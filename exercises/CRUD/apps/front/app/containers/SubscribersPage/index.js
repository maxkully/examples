import React, { useEffect, memo } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Delete, Add, ArrowUpward, ArrowDownward } from '@material-ui/icons';
import { Input } from '@material-ui/core';
import FormattedPhone from 'components/FormattedPhone';
import FormattedLocale from 'components/FormattedLocale';
import TransitionAlerts from 'components/TransitionAlerts';
import saga from './saga';
import reducer from './reducer';
import {
  loadSubscribers,
  removeSubscriber,
  sortingBy,
  filterByPhone,
  loadMore,
  filterByDateFrom,
  filterByDateTo,
} from './actions';
import {
  makeSelectSubscribers,
  makeSelectQuery,
  makeSelectLoadingPage,
} from './selectors';
import messages from './messages';
import Title from './Title';
import {
  makeSelectLoading,
  makeSelectErrors,
  makeSelectNotifications,
} from '../App/selectors';

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  center: {
    textAlign: 'center',
  },
  link: {
    color: '#3f51b5',
    textDecoration: 'none',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
}));

const key = 'subscribersPage';

export function SubscribersPage({
  loadingPage,
  errors,
  notifications,
  subscribers,
  query,
  onPageOpened,
  removeSubscriberClick,
  sortingByClick,
  loadMoreClick,
  searchPhoneChange,
  searchDateFromChange,
  searchDateToChange,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  useEffect(() => onPageOpened(query), []);
  const classes = useStyles();

  let noRecords = <TableRow />;
  if (!subscribers.length) {
    noRecords = (
      <TableRow key="notification#no-records">
        <TableCell colSpan={6} className={classes.center}>
          <h3>No Records</h3>
        </TableCell>
      </TableRow>
    );
  }

  const sortingIcon = field => {
    if (query.sorting.field !== field) return <React.Fragment />;
    if (query.sorting.direction === 'asc') return <ArrowUpward />;

    return <ArrowDownward />;
  };

  // @todo: extract to paging block
  let loadMoreBlock = <React.Fragment />;
  if (query.paging.limit <= subscribers.length) {
    loadMoreBlock = (
      <div className={classes.seeMore}>
        <Button color="primary" onClick={loadMoreClick} disabled={loadingPage}>
          See more orders
        </Button>
      </div>
    );
  }

  const headers = [
    { id: 'id', title: 'ID' },
    { id: 'created_at', title: 'Created At' },
    { id: 'phone', title: 'Phone' },
    { id: 'locale', title: 'Language' },
  ];

  return (
    <React.Fragment>
      <Title>Subscribers</Title>

      <TransitionAlerts items={errors} severity="error" />
      <TransitionAlerts items={notifications} severity="success" />

      <div className={classes.seeMore}>
        <Link color="primary" to="/subscribers/new" className={classes.link}>
          <Add /> New
        </Link>
      </div>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>&nbsp;</TableCell>
            {headers.map(row => (
              <TableCell key={row.id} id={row.id} onClick={sortingByClick}>
                {row.title}
                {sortingIcon(row.id)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan={5}>
              <form className={classes.container} noValidate>
                <TextField
                  id="dateFrom"
                  label="from"
                  type="date"
                  value={query.filter.created_at.from}
                  onChange={searchDateFromChange}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={loadingPage}
                />
              </form>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3}>
              <form className={classes.container} noValidate>
                <TextField
                  id="dateTo"
                  label="to"
                  type="date"
                  value={query.filter.created_at.to}
                  className={classes.textField}
                  onChange={searchDateToChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={loadingPage}
                />
              </form>
            </TableCell>
            <TableCell colSpan={2}>
              <Input
                type="number"
                placeholder="search by phone..."
                onChange={searchPhoneChange}
                value={query.filter.phone}
                disabled={loadingPage}
              />
            </TableCell>
          </TableRow>
          {noRecords}
          {subscribers.map(row => (
            <TableRow key={row.id}>
              <TableCell>
                <Button
                  id={row.id}
                  onClick={removeSubscriberClick.bind(row.id)}
                  disabled={loadingPage}
                >
                  <Delete />
                </Button>
              </TableCell>
              <TableCell>{row.id}</TableCell>
              <TableCell>
                <FormattedDate value={row.created_at || Date.now()} />
              </TableCell>
              <TableCell>
                <Link to={`/subscribers/${row.id}`}>
                  <FormattedPhone locale={row.locale} phone={row.phone} />
                </Link>
              </TableCell>
              <TableCell>
                <FormattedLocale locale={row.locale} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {loadMoreBlock}
    </React.Fragment>
  );
}

SubscribersPage.propTypes = {
  loading: PropTypes.bool,
  loadingPage: PropTypes.bool,
  errors: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  notifications: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  messages: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  subscribers: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  query: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  onPageOpened: PropTypes.func,
  removeSubscriberClick: PropTypes.func,
  sortingByClick: PropTypes.func,
  loadMoreClick: PropTypes.func,
  searchPhoneChange: PropTypes.func,
  searchDateFromChange: PropTypes.func,
  searchDateToChange: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  loadingPage: makeSelectLoadingPage(),
  errors: makeSelectErrors(),
  notifications: makeSelectNotifications(),
  subscribers: makeSelectSubscribers(),
  query: makeSelectQuery(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onPageOpened: query => {
      dispatch(loadSubscribers(query));
    },
    removeSubscriberClick: evt => {
      // @todo: throttling & disabling
      if (evt) evt.preventDefault();
      if (confirm('Are you sure?')) {
        dispatch(removeSubscriber(evt.currentTarget.id));
      }
    },
    sortingByClick: evt => {
      if (evt) evt.preventDefault();
      dispatch(sortingBy(evt.currentTarget.id));
    },
    searchPhoneChange: evt => {
      dispatch(filterByPhone(evt.target.value));
    },
    searchDateFromChange: evt => {
      dispatch(filterByDateFrom(evt.target.value));
    },
    searchDateToChange: evt => {
      dispatch(filterByDateTo(evt.target.value));
    },
    loadMoreClick: () => {
      dispatch(loadMore());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withRouter,
  memo,
)(SubscribersPage);

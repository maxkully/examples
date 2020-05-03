import React, { useEffect, memo } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import {FormattedDate, FormattedMessage} from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { makeSelectLoading, makeSelectErrors } from 'containers/App/selectors';
import { makeSelectSubscriber } from './selectors';
import messages from './messages';
import {
  loadSubscriber,
  resetSubscriber,
  removeSubscriber,
  disableService,
} from './actions';
import reducer from './reducer';
import saga from './saga';
import { makeSelectNotifications } from '../App/selectors';
import TransitionAlerts from '../../components/TransitionAlerts';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import FormattedPhone from "../../components/FormattedPhone";
import FormattedLocale from "../../components/FormattedLocale";
import { Delete, Edit } from '@material-ui/icons';
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import {serviceEnabled} from "../App/actions";
import {enableService} from "../ServicesPage/actions";

const useStyles = makeStyles(theme => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  card: {
    display: 'flex',
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 160,
  },
}));

const key = 'subscriberCard';

export function SubscriberCard({
  loading,
  errors,
  notifications,
  subscriber,
  onInitPage,
  removeSubscriberClick,
  disableServiceClick,
  match,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  useEffect(() => onInitPage(match.params.id), []);

  const classes = useStyles();
  let content = <React.Fragment />;

  if (subscriber) {
    let noRecords = <TableRow />;
    if (!subscriber.services.length) {
      noRecords = (
        <TableRow key="notification#no-records">
          <TableCell colSpan={6} className={classes.center}>
            <h3>No services</h3>
          </TableCell>
        </TableRow>
      );
      }

    const servicesBlock = (
      <Table size="small">
        <TableBody>
          <TableRow colSpan={3}>
            <TableCell>
              <Link to={`/subscribers/${subscriber.id}/services/enable`}>
                Enable New Service
              </Link>
            </TableCell>
          </TableRow>
          {noRecords}
          {subscriber.services.map(service => {
            const context = {
              service_id: service.id,
              subscriber_id: subscriber.id,
            };
            return (
              <TableRow key={service.id}>
                <TableCell>
                  <Button
                    id={service.id}
                    onClick={disableServiceClick.bind(this, context)}
                    disabled={loading}
                  >
                    <Delete />
                  </Button>
                </TableCell>
                <TableCell>
                  <Link to={`/services/${service.id}`}>{service.title}</Link>
                </TableCell>
                <TableCell>
                  <FormattedDate value={service.created_at || Date.now()}/>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );

    let notificationsBlock = <React.Fragment />;
    if (notifications.length || errors.length) {
      notificationsBlock = (
        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            <Card className={classes.card}>
              <div className={classes.cardDetails}>
                <CardContent>
                  <TransitionAlerts items={notifications} severity="success" />
                  <TransitionAlerts items={errors} severity="error" />
                </CardContent>
              </div>
            </Card>
          </Grid>
        </Grid>
      );
    }

    content = (
      <React.Fragment>
        {notificationsBlock}
        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            <Card className={classes.card}>
              <div className={classes.cardDetails}>
                <CardContent>
                  <Typography component="h2" variant="h5">
                    <FormattedPhone phone={subscriber.phone} locale={subscriber.locale} />
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    <FormattedDate value={subscriber.created_at || Date.now()} />
                  </Typography>
                  <Typography variant="subtitle1" paragraph>
                    Language: <FormattedLocale locale={subscriber.locale} />
                  </Typography>
                  <Typography variant="subtitle1" color="primary">
                    <Link to={`/subscribers/${subscriber.id}/edit`} disabled={loading}>
                      <Button disabled={loading}>
                      <Edit />
                    </Button>
                    </Link>
                    <Button disabled={loading}
                            onClick={removeSubscriberClick.bind(this, subscriber.id)}>
                      <Delete />
                    </Button>
                  </Typography>
                </CardContent>
              </div>
              <Hidden xsDown>
                <CardMedia className={classes.cardMedia} image="https://picsum.photos/160/180" title={subscriber.id} />
              </Hidden>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={5} className={classes.mainGrid}>
          <Grid item xs={12} md={12}>
            <Card className={classes.card}>
              <div className={classes.cardDetails}>
                <CardContent>
                  <ul>{servicesBlock}</ul>
                </CardContent>
              </div>
            </Card>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>Subscriber Card</title>
        <meta name="description" content="Subscriber details" />
      </Helmet>
      {content}
    </React.Fragment>
  );
}

SubscriberCard.propTypes = {
  loading: PropTypes.bool,
  errors: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  notifications: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  subscriber: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  onInitPage: PropTypes.func,
  removeSubscriberClick: PropTypes.func,
  disableServiceClick: PropTypes.func,
  match: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
  notifications: makeSelectNotifications(),
  subscriber: makeSelectSubscriber(),
});

export function mapDispatchToProps(dispatch) {
  return {
    disableServiceClick: evt => {
      // @todo: throttling & disabling
      dispatch(disableService(evt));
    },
    removeSubscriberClick: evt => {
      // @todo: throttling & disabling
      dispatch(removeSubscriber(evt));
    },
    onInitPage: id => {
      if (id) {
        dispatch(loadSubscriber(id));
        return;
      }

      dispatch(resetSubscriber());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withConnect,
  memo,
)(SubscriberCard);

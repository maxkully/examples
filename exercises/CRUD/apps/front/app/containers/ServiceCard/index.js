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
import { makeSelectLoading, makeSelectErrors, makeSelectNotifications } from 'containers/App/selectors';
import { makeSelectService } from './selectors';
import messages from './messages';
import { loadService, resetService, removeService } from './actions';
import reducer from './reducer';
import saga from './saga';
import TransitionAlerts from "../../components/TransitionAlerts";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import FormattedPhone from "../../components/FormattedPhone";
import FormattedLocale from "../../components/FormattedLocale";
import Button from "@material-ui/core/Button";
import {Delete, Edit} from "@material-ui/icons";
import Hidden from "@material-ui/core/Hidden";
import CardMedia from "@material-ui/core/CardMedia";
import {makeStyles} from "@material-ui/core/styles";

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

const key = 'serviceCard';

export function ServiceCard({
  loading,
  errors,
  notifications,
  service,
  onInitPage,
  removeServiceClick,
  match,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const classes = useStyles();

  useEffect(() => onInitPage(match.params.id), []);

  const users = service.users.map(user => (
    <li>
      <span>
        <Link to={`/subscribers/${user.id}`}>{user.phone}</Link>
      </span>
      <span> (Enabled at {user.created_at})</span>
    </li>
  ));

  return (
    <React.Fragment>
      <Helmet>
        <title>Service Card</title>
        <meta name="description" content="Service details" />
      </Helmet>
      <TransitionAlerts items={notifications} severity="success" />
      <TransitionAlerts items={errors} severity="error" />

      <Grid container spacing={4}>
        <Grid item xs={12} md={12}>
          <Card className={classes.card}>
            <div className={classes.cardDetails}>
              <CardContent>
                <Typography component="h2" variant="h5">
                  {service.title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  <FormattedDate value={service.created_at || Date.now()} />
                </Typography>
                <Typography variant="subtitle1" paragraph>
                  {service.description}
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  <Link to={`/services/${service.id}/edit`} disabled={loading}>
                    <Button disabled={loading}>
                      <Edit />
                    </Button>
                  </Link>
                  <Button disabled={loading}
                          onClick={removeServiceClick.bind(this, service.id)}>
                    <Delete />
                  </Button>
                </Typography>
              </CardContent>
            </div>
            <Hidden xsDown>
              <CardMedia className={classes.cardMedia} image="https://picsum.photos/160/180" title={service.id} />
            </Hidden>
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

ServiceCard.propTypes = {
  loading: PropTypes.bool,
  errors: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  service: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  onInitPage: PropTypes.func,
  removeServiceClick: PropTypes.func,
  match: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
  notifications: makeSelectNotifications(),
  service: makeSelectService(),
});

export function mapDispatchToProps(dispatch) {
  return {
    removeServiceClick: evt => {
      // @todo: throttling & disabling
      dispatch(removeService(evt));
    },
    onInitPage: id => {
      if (id) {
        dispatch(loadService(id));
        return;
      }

      dispatch(resetService());
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
)(ServiceCard);

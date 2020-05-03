import React, { useEffect, memo } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { makeSelectErrors, makeSelectLoading } from 'containers/App/selectors';
import { makeSelectCredentials } from './selectors';
import messages from './messages';
import { loginUser, changeCredentials } from './actions';
import reducer from './reducer';
import saga from './saga';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TransitionAlerts from "../../components/TransitionAlerts";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const key = 'loginPage';

export function LoginPage({
  loading,
  errors,
  credentials,
  handleSubmit,
  handleChange,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const classes = useStyles();

  return (
    <React.Fragment>
      <Helmet>
        <title>Log In</title>
        <meta name="description" content="Login" />
      </Helmet>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <TransitionAlerts items={errors} severity="error" />
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Email Address"
            name="username"
            autoComplete="email"
            autoFocus
            placeholder="E-mail"
            value={credentials.username}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>
      </div>
    </React.Fragment>
  );
}

LoginPage.propTypes = {
  loading: PropTypes.bool,
  errors: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  credentials: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
  credentials: makeSelectCredentials(),
});

export function mapDispatchToProps(dispatch) {
  return {
    handleChange: evt => {
      console.log('handleChange => ', {
        [evt.target.name]: evt.target.value,
      })
      dispatch(
        changeCredentials({
          [evt.target.name]: evt.target.value,
        }),
      );
    },
    handleSubmit: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();

      const data = {
        username: evt.target.elements.username.value,
        password: evt.target.elements.password.value,
      };

      dispatch(loginUser(data));
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
)(LoginPage);

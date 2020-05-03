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
import { makeSelectErrors } from 'containers/App/selectors';
import { makeSelectSubscriber, makeSelectLoading } from './selectors';
import messages from './messages';
import {
  addSubscriber,
  changeLocale,
  changePhone,
  loadSubscriber,
  updateSubscriber,
  resetSubscriber,
} from './actions';
import reducer from './reducer';
import saga from './saga';
import Input from './Input';
import Form from './Form';
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TransitionAlerts from "../../components/TransitionAlerts";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {appLocales, languagesMap, localePhoneMap} from '../../i18n'

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const key = 'subscriberForm';

export function SubscriberForm({
  loading,
  errors,
  subscriber,
  onSubmitForm,
  onChangePhone,
  onChangeLocale,
  onInitPage,
  match,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  useEffect(() => onInitPage(match.params.id), []);
  const classes = useStyles();

  const captionBlock = match.params.id
    ? `Subscriber #${match.params.id}`
    : 'New Subscriber';

  return (
    <React.Fragment>
      <Helmet>
        <title>New Subscriber</title>
        <meta name="description" content="Adding new subscriber" />
      </Helmet>
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          {captionBlock}
        </Typography>
        <TransitionAlerts items={errors} severity="error" />
        <form className={classes.form} onSubmit={onSubmitForm}>
          <Input
            id="subscriberId"
            name="subscriberId"
            type="hidden"
            value={subscriber.id}
          />
          <FormControl required fullWidth variant="outlined" className={classes.formControl}>
            <InputLabel id="label-for-id">Language</InputLabel>
            <Select
              labelId="label-for-id"
              id="locale"
              name="locale"
              variant="outlined"
              value={subscriber.locale}
              onChange={onChangeLocale}
              label="Age"
            >
              {appLocales.map(item => <MenuItem value={item}>{`(${localePhoneMap[item]}) ${languagesMap[item]}`}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl required fullWidth variant="outlined" className={classes.formControl}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Phone Number"
              name="phone"
              autoComplete="phone"
              inputProps={{ maxLength: 15, minLength: 11, type: "number" }}
              autoFocus
              placeholder="type something here..."
              value={subscriber.phone}
              // @todo: uniqueness control
              onChange={onChangePhone}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            <FormattedMessage {...messages.submit} />
          </Button>
        </form>
      </div>
    </React.Fragment>
  );
}

SubscriberForm.propTypes = {
  loading: PropTypes.bool,
  errors: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  subscriber: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  onSubmitForm: PropTypes.func,
  onChangePhone: PropTypes.func,
  onChangeLocale: PropTypes.func,
  onInitPage: PropTypes.func,
  match: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
  subscriber: makeSelectSubscriber(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangePhone: evt => {
      dispatch(changePhone(evt.target.value));
    },
    onChangeLocale: evt => {
      dispatch(changeLocale(evt.target.value));
    },
    onSubmitForm: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      // @todo: throttling & disabling
      let data = {
        phone: evt.target.elements.phone.value,
        locale: evt.target.elements.locale.value,
      };

      if (evt.target.elements.subscriberId.value !== '') {
        data = { id: evt.target.elements.subscriberId.value, ...data };
        dispatch(updateSubscriber(data));
        return;
      }

      dispatch(addSubscriber(data));
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
)(SubscriberForm);

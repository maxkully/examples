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
import { makeSelectLoading, makeSelectErrors } from 'containers/App/selectors';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeSelectService } from './selectors';
import messages from './messages';
import {
  addService,
  changeTitle,
  changeDescription,
  updateService,
  resetService,
  loadService,
} from './actions';
import reducer from './reducer';
import saga from './saga';
import Input from './Input';
import TransitionAlerts from '../../components/TransitionAlerts';

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
}));

const key = 'serviceForm';

export function ServiceForm({
  loading,
  errors,
  service,
  onSubmitForm,
  onChangeTitle,
  onChangeDescription,
  onInitPage,
  match,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  useEffect(() => onInitPage(match.params.id), []);
  const classes = useStyles();

  const captionBlock = match.params.id
    ? `Service #${match.params.id}`
    : 'New Service';

  return (
    <React.Fragment>
      <Helmet>
        <title>New Service</title>
        <meta name="description" content="Adding new service" />
      </Helmet>
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          {captionBlock}
        </Typography>
        <TransitionAlerts items={errors} severity="error" />
        <form className={classes.form} onSubmit={onSubmitForm}>
          <Input
            id="serviceId"
            name="serviceId"
            type="hidden"
            value={service.id}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            autoComplete="title"
            inputProps={{ maxLength: 200 }}
            autoFocus
            placeholder="type something here..."
            value={service.title}
            // @todo: uniqueness control
            onChange={onChangeTitle}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Description"
            autoComplete="current-password"
            inputProps={{ maxLength: 1000 }}
            id="description"
            name="description"
            type="text"
            multiline
            maxLength="1000"
            rows={5}
            placeholder="type something here..."
            value={service.description}
            onChange={onChangeDescription}
          />
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

ServiceForm.propTypes = {
  loading: PropTypes.bool,
  errors: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  service: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  onSubmitForm: PropTypes.func,
  onChangeTitle: PropTypes.func,
  onChangeDescription: PropTypes.func,
  onInitPage: PropTypes.func,
  match: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
  service: makeSelectService(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeTitle: evt => {
      dispatch(changeTitle(evt.target.value));
    },
    onChangeDescription: evt => {
      dispatch(changeDescription(evt.target.value));
    },
    onSubmitForm: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      // @todo: throttling & disabling
      let data = {
        title: evt.target.elements.title.value,
        description: evt.target.elements.description.value,
      };

      if (evt.target.elements.serviceId.value !== '') {
        data = { id: evt.target.elements.serviceId.value, ...data };
        dispatch(updateService(data));
        return;
      }

      dispatch(addService(data));
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
)(ServiceForm);

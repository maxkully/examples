/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectSubscriberForm = state => state.subscriberForm || initialState;

const makeSelectSubscriber = () =>
  createSelector(
    selectSubscriberForm,
    subscriberFormState => subscriberFormState.subscriber,
  );

const makeSelectLoading = () =>
  createSelector(
    selectSubscriberForm,
    subscriberFormState => subscriberFormState.loading,
  );

export { selectSubscriberForm, makeSelectLoading, makeSelectSubscriber };

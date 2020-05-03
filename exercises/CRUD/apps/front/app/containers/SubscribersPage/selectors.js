/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectSubscribersPage = state => state.subscribersPage || initialState;

const makeSelectSubscribers = () =>
  createSelector(
    selectSubscribersPage,
    subscribersState => subscribersState.subscribers,
  );

const makeSelectQuery = () =>
  createSelector(
    selectSubscribersPage,
    subscribersState => subscribersState.query,
  );

const makeSelectLoadingPage = () =>
  createSelector(
    selectSubscribersPage,
    subscribersState => subscribersState.loadingPage,
  );
export { selectSubscribersPage, makeSelectSubscribers, makeSelectQuery, makeSelectLoadingPage };

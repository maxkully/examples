/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectServiceCard = state => state.serviceCard || initialState;

const makeSelectService = () =>
  createSelector(
    selectServiceCard,
    serviceCardState => serviceCardState.service,
  );

export { selectServiceCard, makeSelectService };

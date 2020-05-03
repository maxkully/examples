/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectServiceForm = state => state.serviceForm || initialState;

const makeSelectService = () =>
  createSelector(
    selectServiceForm,
    serviceFormState => serviceFormState.service,
  );

export { selectServiceForm, makeSelectService };

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectServices = state => state.services || initialState;

const makeSelectServices = () =>
  createSelector(
    selectServices,
    servicesState => servicesState.services,
  );

export { selectServices, makeSelectServices };

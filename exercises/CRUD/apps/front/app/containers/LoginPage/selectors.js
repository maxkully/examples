import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectLoginPage = state => state.loginPage || initialState;

const makeSelectCredentials = () =>
  createSelector(
    selectLoginPage,
    loginPageState => loginPageState.credentials,
  );

export { selectLoginPage, makeSelectCredentials };

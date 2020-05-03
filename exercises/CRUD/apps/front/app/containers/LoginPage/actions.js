import {
  LOG_IN,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  CHANGE_CREDENTIALS,
} from './constants';

export function loginUser(credentials) {
  return {
    type: LOG_IN,
    credentials,
  };
}

export function changeCredentials(credentials) {
  return {
    type: CHANGE_CREDENTIALS,
    credentials,
  };
}

export function loginSuccess(data) {
  return {
    type: LOGIN_SUCCESS,
    data,
  };
}

export function loginFailed(errors) {
  return {
    type: LOGIN_FAILED,
    errors,
  };
}

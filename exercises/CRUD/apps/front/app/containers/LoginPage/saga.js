import { call, put, takeLatest, all } from 'redux-saga/effects';
import request from 'utils/request';
import { push } from 'react-router-redux';
import { LOG_IN } from './constants';
import { loginSuccess, loginFailed } from './actions';

export function* checkCredentials(data) {
  const requestURL = `http://localhost/api/auth/login`;

  try {
    console.log('checkCredentials with body => ', data);
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify(data.credentials),
    });
    console.log(`Login with '${response.token}' successfully`, response);
    if (response.token) {
      localStorage.setItem('jwt', response.token);
      yield put(push('/'));
      yield put(loginSuccess(response));
    } else {
      yield put(loginFailed([{ message: 'Could not received JWT token' }]));
    }
  } catch (err) {
    console.log('[Error]', err);
    yield put(loginFailed([{ message: err.message }]));
  }
}

export default function* subscriberData() {
  yield all([takeLatest(LOG_IN, checkCredentials)]);
}

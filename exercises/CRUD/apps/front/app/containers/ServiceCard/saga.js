import { call, put, takeLatest, all, takeEvery } from 'redux-saga/effects';
import request from 'utils/request';
import { push } from 'react-router-redux';
import { serviceLoaded, serviceRequestingError } from './actions';
import { LOAD_SERVICE, REMOVE_SERVICE } from './constants';

export function* getService(data) {
  console.log('[getService] with data => ', data);
  // Select username from store
  const requestURL = `http://localhost/api/services/${data.id}`;

  try {
    // Call our request helper (see 'utils/request')
    const response = yield call(request, requestURL);
    yield put(serviceLoaded(response));
  } catch (err) {
    // @todo refactor it
    if (err.statusCode === 401 || err.statusCode === 403) {
      yield put(push('/login'));
    }
    yield put(serviceRequestingError([{ message: err.message }]));
  }
}

export function* deleteService(data) {
  // Select username from store
  const requestURL = `http://localhost/api/services/${data.id}`;
  try {
    yield call(request, requestURL, { method: 'DELETE' });
    console.log(`Service {${data.id}} successfully removed!`);

    yield put(push('/services'));
  } catch (err) {
    // @todo refactor it
    if (err.statusCode === 401 || err.statusCode === 403) {
      yield put(push('/login'));
    }
    yield put(serviceRequestingError([{ message: err.message }]));
  }
}

export default function* serviceData() {
  yield all([takeLatest(LOAD_SERVICE, getService)]);
  yield takeEvery(REMOVE_SERVICE, deleteService);
}

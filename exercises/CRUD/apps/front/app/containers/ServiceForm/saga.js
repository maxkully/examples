import { call, put, takeLatest, all } from 'redux-saga/effects';
import request from 'utils/request';
import { push } from 'react-router-redux';
import { UPDATE_SERVICE, ADD_SERVICE, LOAD_SERVICE_FORM } from './constants';
import {serviceLoaded, serviceRequestingError, serviceAdded, serviceUpdated} from './actions';

export function* addService(data) {
  // Select username from store
  const requestURL = `http://localhost/api/services`;

  try {
    // Call our request helper (see 'utils/request')
    console.log('addService with body => ', data);
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify(data.service),
    });
    console.log(`Add service '${response.title}' successfully`, response);
    yield put(serviceAdded());
    yield put(push(`/services/${response.id}`));
  } catch (err) {
    if (err.statusCode === 401 || err.statusCode === 403) {
      yield put(push('/login'));
    }
    yield put(serviceRequestingError([{ message: err.message, data: data.service }]));
  }
}

export function* changeService(data) {
  console.log('[changeService] with data => ', data);
  // Select username from store
  const requestURL = `http://localhost/api/services/${data.service.id}`;
  const backServiceId = data.service.id;

  try {
    // Call our request helper (see 'utils/request')
    delete data.service.id;
    console.log('[changeService] with body => ', data);
    yield call(request, requestURL, {
      method: 'PUT',
      body: JSON.stringify(data.service),
    });
    yield put(serviceUpdated());
    yield put(push(`/services/${backServiceId}`));
  } catch (err) {
    // @todo refactor it
    if (err.statusCode === 401 || err.statusCode === 403) {
      yield put(push('/login'));
    }
    // @todo: separate unique constraint error
    yield put(serviceRequestingError([{ message: err.message, data: { id: backServiceId, ...data.service} }]));
  }
}

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

export default function* serviceData() {
  yield all([
    takeLatest(UPDATE_SERVICE, changeService),
    takeLatest(ADD_SERVICE, addService),
    takeLatest(LOAD_SERVICE_FORM, getService),
  ]);
}

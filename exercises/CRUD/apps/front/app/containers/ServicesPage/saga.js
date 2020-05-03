import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import request from 'utils/request';
import { ENABLE_SERVICE, LOAD_SERVICES, REMOVE_SERVICE } from './constants';
import {
  loadServices,
  servicesLoaded,
  servicesRequestingError,
} from './actions';

import { serviceEnabled } from "../App/actions";

// eslint-disable-next-line camelcase
export function* getServices(data) {
  // Select username from store
  const requestURL = `http://localhost/api/services?subscriber_id=${data.subscriber_id || ''}`;

  try {
    // Call our request helper (see 'utils/request')
    const services = yield call(request, requestURL);
    console.log('Loaded services => ', services);
    yield put(servicesLoaded(services));
  } catch (err) {
    // @todo refactor it
    if (err.statusCode === 401 || err.statusCode === 403) {
      yield put(push('/login'));
    }
    yield put(servicesRequestingError([{ message: err.message }]));
  }
}

export function* deleteService(data) {
  // Select username from store
  const requestURL = `http://localhost/api/services/${data.id}`;
  try {
    yield call(request, requestURL, { method: 'DELETE' });
    console.log(`Service {${data.id}} successfully removed!`);
    yield put(loadServices());
  } catch (err) {
    // @todo refactor it
    if (err.statusCode === 401 || err.statusCode === 403) {
      yield put(push('/login'));
    }
    yield put(servicesRequestingError([{ message: err.message }]));
  }
}

export function* enableServiceForSubscriber(data) {
  const requestURL = `http://localhost/api/subscribers/${
    data.data.subscriber_id
  }/services/${data.data.service_id}`;

  try {
    yield call(request, requestURL, { method: 'PUT' });
    console.log(
      `Service {${data.data.service_id}} successfully removed for subscriber {${
        data.data.subscriber_id
      }}!`,
    );
    yield put(serviceEnabled());
    yield put(push(`/subscribers/${data.data.subscriber_id}`));
  } catch (err) {
    // @todo refactor it
    if (err.statusCode === 401 || err.statusCode === 403) {
      yield put(push('/login'));
    }
    yield put(servicesRequestingError([{ message: err.message }]));
  }
}

export default function* servicesData() {
  yield takeLatest(LOAD_SERVICES, getServices);
  yield takeEvery(REMOVE_SERVICE, deleteService);
  yield takeEvery(ENABLE_SERVICE, enableServiceForSubscriber);
}

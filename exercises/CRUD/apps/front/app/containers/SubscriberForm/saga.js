import { call, put, takeLatest, all } from 'redux-saga/effects';
import request from 'utils/request';
import { push } from 'react-router-redux';
import {
  LOAD_SUBSCRIBER,
  ADD_SUBSCRIBER,
  UPDATE_SUBSCRIBER,
} from './constants';
import {
  subscriberLoaded,
  subscriberRequestError,
} from './actions';

export function* addSubscriber(data) {
  // Select username from store
  const requestURL = `http://localhost/api/subscribers`;

  try {
    // Call our request helper (see 'utils/request')
    console.log('addSubscriber with body => ', data);
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify(data.subscriber),
    });
    console.log(`Add subscriber '${response.phone}' successfully`, response);
    yield put(push(`/subscribers/${response.id}`));
  } catch (err) {
    if (err.statusCode === 401 || err.statusCode === 403) {
      yield put(push('/login'));
    }
    yield put(subscriberRequestError([{ message: err.message }]));
  }
}

export function* changeSubscriber(data) {
  console.log('[changeSubscriber] with data => ', data);
  // Select username from store
  const requestURL = `http://localhost/api/subscribers/${data.subscriber.id}`;

  try {
    // Call our request helper (see 'utils/request')
    const backId = data.subscriber.id;
    delete data.subscriber.id;
    console.log('[changeSubscriber] with body => ', data);
    yield call(request, requestURL, {
      method: 'PUT',
      body: JSON.stringify(data.subscriber),
    });
    yield put(push(`/subscribers/${backId}`));
  } catch (err) {
    // @todo refactor it
    if (err.statusCode === 401 || err.statusCode === 403) {
      yield put(push('/login'));
    }
    yield put(subscriberRequestError([{ message: err.message }]));
  }
}

export function* getSubscriber(data) {
  console.log('[getSubscriber] with data => ', data);
  // Select username from store
  const requestURL = `http://localhost/api/subscribers/${data.id}`;

  try {
    // Call our request helper (see 'utils/request')
    const response = yield call(request, requestURL);
    yield put(subscriberLoaded(response));
  } catch (err) {
    // @todo refactor it
    if (err.statusCode === 401 || err.statusCode === 403) {
      yield put(push('/login'));
    }
    yield put(subscriberRequestError([{ message: err.message }]));
  }
}

export default function* subscriberData() {
  yield all([
    takeLatest(UPDATE_SUBSCRIBER, changeSubscriber),
    takeLatest(ADD_SUBSCRIBER, addSubscriber),
    takeLatest(LOAD_SUBSCRIBER, getSubscriber),
  ]);
}

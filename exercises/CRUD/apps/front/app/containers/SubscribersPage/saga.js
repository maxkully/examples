import {
  call,
  put,
  takeLatest,
  takeEvery,
  all,
  select,
} from 'redux-saga/effects';
import request from 'utils/request';
import { push } from 'react-router-redux';
import {
  FILTER_BY_DATE_FROM,
  FILTER_BY_DATE_TO,
  FILTER_BY_PHONE,
  LOAD_SUBSCRIBERS,
  LOADING_MORE,
  REMOVE_SUBSCRIBER,
  SORTING_BY,
} from './constants';
import {
  loadSubscribers,
  subscribersLoaded,
  subscribersRequestingError,
  subscriberRemoved,
} from './actions';
import { selectSubscribersPage } from './selectors';

export function* getSubscribers(payload) {
  const { query } = payload;
  // Select username from store
  const requestURL = `http://localhost/api/subscribers/?paging[limit]=${
    query.paging.limit
  }&paging[offest]=${query.paging.offset}&sorting[field]=${
    query.sorting.field
  }&sorting[direction]=${query.sorting.direction}&phone=${
    query.filter.phone
  }&created_at[from]=${query.filter.created_at.from}&created_at[to]=${
    query.filter.created_at.to
  }`;
  console.log('===> requestURL: ', requestURL);

  try {
    // Call our request helper (see 'utils/request')
    const subscribers = yield call(request, requestURL);
    console.log('Loaded subscribers => ', subscribers);
    yield put(subscribersLoaded({ subscribers, query }));
  } catch (err) {
    // @todo refactor it
    if (err.statusCode === 401 || err.statusCode === 403) {
      yield put(push('/login'));
    }
    yield put(subscribersRequestingError([{ message: err.message }]));
  }
}

export function* deleteSubscriber(data) {
  // Select username from store
  const requestURL = `http://localhost/api/subscribers/${data.id}`;
  try {
    yield call(request, requestURL, { method: 'DELETE' });
    console.log(`Subscriber {${data.id}} successfully removed!`);
    const state = yield select(selectSubscribersPage);

    yield put(subscriberRemoved());
    yield put(loadSubscribers(state.query));
  } catch (err) {
    // @todo refactor it
    if (err.statusCode === 401 || err.statusCode === 403) {
      yield put(push('/login'));
    }

    console.log('error => ', err.response);
    yield put(subscribersRequestingError([{ message: err.message }]));
  }
}

export function* filterSubscribersByPhone(data) {
  const state = yield select(selectSubscribersPage);
  state.query.filter.phone = data.phone;
  yield put(loadSubscribers(state.query));
}

export function* filterSubscribersByDateFrom(data) {
  const state = yield select(selectSubscribersPage);
  state.query.filter.created_at.from = data.date;
  yield put(loadSubscribers(state.query));
}

export function* filterSubscribersByDateTo(data) {
  const state = yield select(selectSubscribersPage);
  // @todo: control dating
  state.query.filter.created_at.to = data.date;

  yield put(loadSubscribers(state.query));
}

export function* sortingSubscribers(data) {
  console.log('[sortingSubscribers] Received data ', data);
  const state = yield select(selectSubscribersPage);
  state.query.sorting.field = data.sorting;
  if (state.query.sorting.field === data.sorting) {
    if (state.query.sorting.direction === 'asc') {
      state.query.sorting.direction = 'desc';
    } else {
      state.query.sorting.direction = 'asc';
    }
  } else {
    state.query.sorting.direction = 'asc';
  }
  state.query.sorting.field = data.sorting;

  yield put(loadSubscribers(state.query));
}

export function* loadMoreSubscribers() {
  const state = yield select(selectSubscribersPage);
  // @todo: make paging instead of loading more
  state.query.paging.limit = state.query.paging.limit + 20;
  yield put(loadSubscribers(state.query));
}

export default function* subscribersData() {
  yield all([
    takeLatest(LOAD_SUBSCRIBERS, getSubscribers),
    takeEvery(REMOVE_SUBSCRIBER, deleteSubscriber),
    takeLatest(FILTER_BY_PHONE, filterSubscribersByPhone),
    takeLatest(FILTER_BY_DATE_FROM, filterSubscribersByDateFrom),
    takeLatest(FILTER_BY_DATE_TO, filterSubscribersByDateTo),
    takeLatest(SORTING_BY, sortingSubscribers),
    takeLatest(LOADING_MORE, loadMoreSubscribers),
  ]);
}

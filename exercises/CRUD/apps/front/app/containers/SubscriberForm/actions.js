import {
  SUBSCRIBER_FORM_ERROR,
  LOAD_SUBSCRIBER,
  ADD_SUBSCRIBER,
  UPDATE_SUBSCRIBER,
  LOAD_SUBSCRIBER_SUCCESS,
  CHANGE_PHONE,
  CHANGE_LOCALE,
  RESET_SUBSCRIBER,
} from './constants';

export function loadSubscriber(id) {
  return {
    type: LOAD_SUBSCRIBER,
    id,
  };
}

export function addSubscriber(data) {
  console.log('actions/addSubscriber with data => ', data);
  return {
    type: ADD_SUBSCRIBER,
    subscriber: data,
  };
}

export function updateSubscriber(data) {
  return {
    type: UPDATE_SUBSCRIBER,
    subscriber: data,
  };
}

export function subscriberLoaded(data) {
  return {
    type: LOAD_SUBSCRIBER_SUCCESS,
    data,
  };
}

export function subscriberRequestError(errors) {
  return {
    type: SUBSCRIBER_FORM_ERROR,
    errors,
  };
}

export function changePhone(phone) {
  return {
    type: CHANGE_PHONE,
    phone,
  };
}

export function changeLocale(locale) {
  return {
    type: CHANGE_LOCALE,
    locale,
  };
}

export function resetSubscriber() {
  return {
    type: RESET_SUBSCRIBER,
  };
}

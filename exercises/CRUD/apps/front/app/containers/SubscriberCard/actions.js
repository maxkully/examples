import {
  RESET_SUBSCRIBER,
  SUBSCRIBER_ERROR,
  LOAD_SUBSCRIBER,
  LOAD_SUBSCRIBER_SUCCESS,
  REMOVE_SUBSCRIBER,
  DISABLE_SERVICE,
} from './constants';

export function loadSubscriber(id) {
  return {
    type: LOAD_SUBSCRIBER,
    id,
  };
}

export function subscriberLoaded(data) {
  return {
    type: LOAD_SUBSCRIBER_SUCCESS,
    data,
  };
}

export function subscriberRequestingError(error) {
  return {
    type: SUBSCRIBER_ERROR,
    error,
  };
}

export function resetSubscriber() {
  return {
    type: RESET_SUBSCRIBER,
  };
}

export function removeSubscriber(id) {
  return {
    type: REMOVE_SUBSCRIBER,
    id,
  };
}

export function disableService(data) {
  return {
    type: DISABLE_SERVICE,
    data,
  };
}

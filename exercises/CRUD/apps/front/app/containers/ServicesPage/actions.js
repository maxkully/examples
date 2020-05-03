import {
  REMOVE_SERVICE,
  LOAD_SERVICES,
  LOAD_SERVICES_SUCCESS,
  LOAD_SERVICES_ERROR,
  ENABLE_SERVICE,
} from './constants';

// eslint-disable-next-line camelcase
export function loadServices(subscriber_id) {
  return {
    type: LOAD_SERVICES,
    subscriber_id,
  };
}

export function servicesLoaded(services) {
  return {
    type: LOAD_SERVICES_SUCCESS,
    services,
  };
}

export function servicesRequestingError(errors) {
  return {
    type: LOAD_SERVICES_ERROR,
    errors,
  };
}

export function removeService(id) {
  return {
    type: REMOVE_SERVICE,
    id,
  };
}

export function enableService(data) {
  return {
    type: ENABLE_SERVICE,
    data,
  };
}

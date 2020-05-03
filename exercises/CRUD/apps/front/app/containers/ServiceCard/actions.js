import {
  RESET_SERVICE,
  SERVICE_ERROR,
  LOAD_SERVICE,
  LOAD_SERVICE_SUCCESS,
  REMOVE_SERVICE,
} from './constants';

export function loadService(id) {
  return {
    type: LOAD_SERVICE,
    id,
  };
}

export function serviceLoaded(data) {
  return {
    type: LOAD_SERVICE_SUCCESS,
    data,
  };
}

export function serviceRequestingError(errors) {
  return {
    type: SERVICE_ERROR,
    errors,
  };
}

export function resetService() {
  return {
    type: RESET_SERVICE,
  };
}

export function removeService(id) {
  return {
    type: REMOVE_SERVICE,
    id,
  };
}

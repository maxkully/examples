import { DISABLE_SERVICE_SUCCESS, ENABLE_SERVICE_SUCCESS } from "./constants";

export function serviceEnabled() {
  return {
    type: ENABLE_SERVICE_SUCCESS,
  };
}

export function serviceDisabled() {
  return {
    type: DISABLE_SERVICE_SUCCESS,
  };
}

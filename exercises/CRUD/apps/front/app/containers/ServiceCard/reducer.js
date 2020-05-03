import produce from 'immer';
import {
  SERVICE_ERROR,
  RESET_SERVICE,
  LOAD_SERVICE,
  LOAD_SERVICE_SUCCESS,
} from './constants';

// The initial state of the App
export const initialState = {
  service: {
    id: '',
    title: '',
    users: [],
  },
  loading: true,
};

/* eslint-disable default-case, no-param-reassign */
const serviceCardReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_SERVICE:
        draft.loading = true;
        draft.error = false;
        draft.service = initialState.service;
        break;
      case LOAD_SERVICE_SUCCESS:
        draft.loading = false;
        draft.service = action.data;
        break;
      case SERVICE_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
      case RESET_SERVICE:
        draft.service = initialState.service;
    }
  });

export default serviceCardReducer;

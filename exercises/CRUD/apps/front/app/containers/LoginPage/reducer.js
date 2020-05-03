import produce from 'immer';
import {
  LOGIN_FAILED,
  LOG_IN,
  LOGIN_SUCCESS,
  CHANGE_CREDENTIALS,
} from './constants';

// The initial state of the App
export const initialState = {
  credentials: {
    username: '',
    password: '',
  },
};

/* eslint-disable default-case, no-param-reassign */
const loginReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOG_IN:
        draft.credentials = action.credentials;
        break;
      case LOGIN_SUCCESS:
        draft.error = {};
        break;
      case LOGIN_FAILED:
        draft.error = {};
        draft.credentials = initialState;
        break;
      case CHANGE_CREDENTIALS:
        draft.credentials = { ...draft.credentials, ...action.credentials };
        break;
    }
  });

export default loginReducer;

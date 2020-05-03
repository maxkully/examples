import produce from 'immer';
import {
  LOAD_SERVICE_FORM,
  CHANGE_TITLE,
  CHANGE_DESCRIPTION,
  UPDATE_SERVICE,
  RESET_SERVICE,
  ADD_SERVICE,
  LOAD_SERVICE_FORM_SUCCESS, SERVICE_FORM_ERROR,
} from './constants';

// The initial state of the App
export const initialState = {
  service: {
    id: '',
    title: '',
    description: '',
  },
};

/* eslint-disable default-case, no-param-reassign */
const serviceFormReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case UPDATE_SERVICE:
      case ADD_SERVICE:
      case LOAD_SERVICE_FORM:
        draft.service = initialState.service;
        break;
      case LOAD_SERVICE_FORM_SUCCESS:
        draft.service = action.data;
        break;
      case CHANGE_TITLE:
        draft.service.title = action.title;
        break;
      case CHANGE_DESCRIPTION:
        draft.service.description = action.description;
        break;
      case RESET_SERVICE:
        draft.service = initialState.service;
        break;
      case SERVICE_FORM_ERROR:
        draft.service = action.errors[0].data;
        break;
    }
  });

export default serviceFormReducer;

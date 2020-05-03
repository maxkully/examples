import produce from 'immer';
import {LOAD_SUBSCRIBERS, LOAD_SUBSCRIBERS_ERROR, REMOVE_SUBSCRIBER_SUCCESS} from '../SubscribersPage/constants';
import {
  DISABLE_SERVICE,
  LOAD_SUBSCRIBER,
  LOAD_SUBSCRIBER_SUCCESS,
  REMOVE_SUBSCRIBER,
  SUBSCRIBER_ERROR
} from "../SubscriberCard/constants";
import {DISABLE_SERVICE_SUCCESS, ENABLE_SERVICE_SUCCESS} from "./constants";
import {LOGIN_FAILED, LOGIN_SUCCESS} from "../LoginPage/constants";
import {LOAD_SERVICES, LOAD_SERVICES_ERROR, LOAD_SERVICES_SUCCESS} from "../ServicesPage/constants";
import {LOAD_SERVICE, LOAD_SERVICE_SUCCESS, SERVICE_ERROR} from "../ServiceCard/constants";
import {
  ADD_SERVICE_SUCCESS,
  UPDATE_SERVICE_SUCCESS,
  SERVICE_FORM_ERROR,
  LOAD_SERVICE_FORM, UPDATE_SERVICE, ADD_SERVICE, LOAD_SERVICE_FORM_SUCCESS
} from "../ServiceForm/constants";
import {ADD_SUBSCRIBER, SUBSCRIBER_FORM_ERROR, UPDATE_SUBSCRIBER} from "../SubscriberForm/constants";

// The initial state of the App
export const initialState = {
  loading: false,
  errors: [],
  notifications: [],
  currentUser: false,
  userData: {
    repositories: false,
  },
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_SUBSCRIBER:
      case LOAD_SUBSCRIBERS:
      case LOAD_SERVICES:
      case LOAD_SERVICE:
      case REMOVE_SUBSCRIBER:
      case DISABLE_SERVICE:
      case LOAD_SERVICE_FORM:
      case UPDATE_SERVICE:
      case ADD_SERVICE:
      case ADD_SUBSCRIBER:
      case UPDATE_SUBSCRIBER:
        draft.loading = true;
        break;
      case UPDATE_SERVICE_SUCCESS:
        draft.notifications = [{ message: 'service.updated' }];
        draft.errors = [];
        break;
      case ADD_SERVICE_SUCCESS:
        draft.notifications = [{ message: 'service.added' }];
        draft.errors = [];
        break;
      case REMOVE_SUBSCRIBER_SUCCESS:
        draft.notifications = [{ message: 'subscriber.removed' }];
        draft.errors = [];
        break;
      case LOAD_SUBSCRIBER_SUCCESS:
        draft.loading = false;
        draft.errors = [];
        break;
      case ENABLE_SERVICE_SUCCESS:
        draft.notifications = [{ message: 'subscriber.service.enabled' }];
        draft.errors = [];
        draft.loading = false;
        break;
      case DISABLE_SERVICE_SUCCESS:
        draft.notifications = [{ message: 'subscriber.service.disabled' }];
        draft.errors = [];
        draft.loading = false;
        break;
      case LOGIN_SUCCESS:
        draft.notifications = [{ message: 'user.logged.in' }];
        draft.errors = [];
        break;
      case LOAD_SERVICE_FORM_SUCCESS:
      case LOAD_SERVICE_SUCCESS:
      case LOAD_SERVICES_SUCCESS:
        draft.loading = false;
        break;
      case LOAD_SUBSCRIBERS_ERROR:
      case LOGIN_FAILED:
      case SUBSCRIBER_ERROR:
      case SUBSCRIBER_FORM_ERROR:
      case SERVICE_FORM_ERROR:
      case SERVICE_ERROR:
      case LOAD_SERVICES_ERROR:
        draft.errors = action.errors;
        draft.loading = false;
        break;
    }
  });

export default appReducer;

import produce from 'immer';
import {
  SUBSCRIBER_ERROR,
  RESET_SUBSCRIBER,
  LOAD_SUBSCRIBER,
  LOAD_SUBSCRIBER_SUCCESS,
} from './constants';

// The initial state of the App
export const initialState = {
  subscriber: {
    id: '',
    title: '',
    services: [],
  },
  loading: true,
};

/* eslint-disable default-case, no-param-reassign */
const subscriberCardReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_SUBSCRIBER:
        draft.loading = true;
        draft.subscriber = initialState.subscriber;
        break;
      case LOAD_SUBSCRIBER_SUCCESS:
        draft.loading = false;
        draft.subscriber = action.data;
        break;
      case SUBSCRIBER_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
      case RESET_SUBSCRIBER:
        draft.subscriber = initialState.subscriber;
    }
  });

export default subscriberCardReducer;

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectSubscriberCard = state => state.subscriberCard || initialState;

const makeSelectSubscriber = () =>
  createSelector(
    selectSubscriberCard,
    subscriberCardState => subscriberCardState.subscriber,
  );

export { selectSubscriberCard, makeSelectSubscriber };

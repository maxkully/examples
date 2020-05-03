/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'bdt.containers.SubscriberForm';

export default defineMessages({
  phone: {
    id: `${scope}.input.phone`,
    defaultMessage: 'Phone',
  },
  locale: {
    id: `${scope}.input.locale`,
    defaultMessage: 'Language',
  },
  submit: {
    id: `${scope}.submit`,
    defaultMessage: 'Submit',
  },
});

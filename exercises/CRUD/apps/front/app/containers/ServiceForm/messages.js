import { defineMessages } from 'react-intl';

export const scope = 'bdt.containers.ServiceForm';

export default defineMessages({
  title: {
    id: `${scope}.input.title`,
    defaultMessage: 'Title',
  },
  description: {
    id: `${scope}.input.description`,
    defaultMessage: 'Description',
  },
  submit: {
    id: `${scope}.submit`,
    defaultMessage: 'Submit',
  },
});

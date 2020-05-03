import React from 'react';
import PropTypes from 'prop-types';
import { localePhoneMap } from '../../i18n';

export default function FormattedPhone({ locale, phone }) {
  return (
    <React.Fragment>
      ({localePhoneMap[locale] || 'N/A'}) {phone}
    </React.Fragment>
  );
}

FormattedPhone.propTypes = {
  locale: PropTypes.string,
  phone: PropTypes.string,
};

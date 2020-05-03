import React from 'react';
import PropTypes from 'prop-types';
import { languagesMap } from '../../i18n';

export default function FormattedLocale({ locale }) {
  return <React.Fragment>{languagesMap[locale] || locale}</React.Fragment>;
}

FormattedLocale.propTypes = {
  locale: PropTypes.string,
};

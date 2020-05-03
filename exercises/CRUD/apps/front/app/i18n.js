/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 *   IMPORTANT: This file is used by the internal build
 *   script `extract-intl`, and must use CommonJS module syntax
 *   You CANNOT use import/export in this file.
 */
const addLocaleData = require('react-intl').addLocaleData; //eslint-disable-line
const enLocaleData = require('react-intl/locale-data/en');
const ruLocaleData = require('react-intl/locale-data/ru');
const kyLocaleData = require('react-intl/locale-data/ky');
const uzLocaleData = require('react-intl/locale-data/uz');

const enTranslationMessages = require('./translations/en.json');
const ruTranslationMessages = require('./translations/ru.json');

addLocaleData(enLocaleData);
addLocaleData(ruLocaleData);
addLocaleData(kyLocaleData);
addLocaleData(uzLocaleData);

const DEFAULT_LOCALE = 'en';

// prettier-ignore
const appLocales = [ 'en', 'ru', 'ky', 'uz' ];
const localePhoneMap = {
  en: '+1',
  ru: '+7',
  ky: '+996',
  uz: '+998',
};
const languagesMap = {
  en: 'English',
  ru: 'Russian',
  ky: 'Kyrgyz',
  uz: 'Uzbek',
};

const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages =
    locale !== DEFAULT_LOCALE
      ? formatTranslationMessages(DEFAULT_LOCALE, enTranslationMessages)
      : {};
  const flattenFormattedMessages = (formattedMessages, key) => {
    const formattedMessage =
      !messages[key] && locale !== DEFAULT_LOCALE
        ? defaultFormattedMessages[key]
        : messages[key];
    return Object.assign(formattedMessages, { [key]: formattedMessage });
  };
  return Object.keys(messages).reduce(flattenFormattedMessages, {});
};

const translationMessages = {
  en: formatTranslationMessages('en', enTranslationMessages),
  ru: formatTranslationMessages('ru', ruTranslationMessages),
};

exports.appLocales = appLocales;
exports.localePhoneMap = localePhoneMap;
exports.languagesMap = languagesMap;
exports.formatTranslationMessages = formatTranslationMessages;
exports.translationMessages = translationMessages;
exports.DEFAULT_LOCALE = DEFAULT_LOCALE;

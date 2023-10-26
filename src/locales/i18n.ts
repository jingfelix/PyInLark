import { bitable } from '@lark-base-open/js-sdk';
import i18next from 'i18next';
import $ from 'jquery';
import jqueryI18next from 'jquery-i18next';
import i18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import zh from './zh'
import en from './en'

// 国际化配置，详情请看README.md
/** 语言方案 */
const resources = {
  en: {
    translation: en
  },
  zh: {
    translation: zh
  }
}


const rerender = () => {
  $('body').localize(); // localize 由jqueryI18next.init注入
}

$(function() {
  i18next
    .use(i18nextBrowserLanguageDetector)
    .init({
      debug: true,
      fallbackLng: 'en',
      resources,
    }, (err) => {
      if (err) return console.error(err);
      jqueryI18next.init(i18next, $, { useOptionsAttr: true });
      bitable.bridge.getLanguage().then((lang) => {
        i18next.changeLanguage(lang, () => {
          rerender()
        });
      })
    });
});
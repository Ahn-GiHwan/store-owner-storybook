import { createI18n } from 'vue-i18n';
import { ko, en } from '@/locales';

// eslint-disable-next-line new-cap
const i18n = new createI18n({
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  locale: 'ko',
  messages: { ko, en },
});

// NOTE: lazy-loading이 필요하다면 아래 링크 참조.
// http://kazupon.github.io/vue-i18n/guide/lazy-loading.html

export default i18n;

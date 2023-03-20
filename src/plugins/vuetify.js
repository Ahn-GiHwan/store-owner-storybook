// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Vuetify
import { createVuetify } from 'vuetify';

// i18n
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';
import { useI18n } from 'vue-i18n';
import i18n from './vueI18n';

// customColor
import {
  primaryColor,
  greenColor,
  red1Color,
  red2Color,
  gray9Color,
} from '@/styles/_export.module.scss';

const customColor = {
  primary: primaryColor,
  error: red2Color,
  success: greenColor,
  secondary: gray9Color,
  'error-bg-snackbar': red1Color,
};

export default createVuetify({
  defaults: {
    VBtn: {
      elevation: 0,
    },
  },
  display: {
    thresholds: {
      xs: 0,
      sm: 360,
      md: 484,
      lg: 960,
      xl: 1280,
    },
  },
  theme: {
    themes: {
      light: {
        colors: {
          ...customColor,
        },
      },
    },
    options: { customProperties: true },
  },
  // https://next.vuetifyjs.com/en/features/internationalization/
  locale: { adapter: createVueI18nAdapter({
    i18n,
    useI18n: () => useI18n({ useScope: 'global' }), // 워닝 제거 (참고: https://github.com/intlify/vue-i18n-next/discussions/851)
  }) },
});
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides

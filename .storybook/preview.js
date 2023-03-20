import { app } from '@storybook/vue3'

import { loadFonts } from '../src/plugins/webfontloader';

import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles'
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

loadFonts()

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
const vuetify = createVuetify({
  components,
  directives,
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
})
app.use(vuetify)

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (story) => ({
    components: { story },
    template: `
      <VApp>
        <VMain>
          <VContainer>
            <story />
          </VContainer>
        </VMain>
      </VApp>
    `,
  }),
];

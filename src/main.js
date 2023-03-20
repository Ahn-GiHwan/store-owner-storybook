import { createApp } from 'vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { createPinia } from 'pinia';
import { globalCookiesConfig } from 'vue3-cookies';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import i18n from './plugins/vueI18n';
import { loadFonts } from './plugins/webfontloader';
import apolloClient from './plugins/apollo';
import logger from './plugins/vueLogger';
import { initializeSentry } from './plugins/sentry';
import vueGtm from './plugins/vue-gtm';

import '@vuepic/vue-datepicker/dist/main.css';
import '@/styles/index.scss';
import 'bottom-sheet-vue3/css/style.css';

loadFonts();
globalCookiesConfig({
  expireTimes: '30d',
  domain: '',
  secure: true,
  sameSite: 'None',
});
const app = createApp(App);
initializeSentry(app, router);

app.use(logger);
app.use(router);
app.use(vueGtm(router));
app.use(i18n);
app.use(vuetify);
app.use(createPinia().use(piniaPluginPersistedstate));
app.provide(DefaultApolloClient, apolloClient);
app.mount('#app');

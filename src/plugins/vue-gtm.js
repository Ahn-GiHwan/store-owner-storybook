import { createGtm } from '@gtm-support/vue-gtm';

export default (router) => createGtm({
  id: `${import.meta.env.VITE_GTM_ID}`,
  enabled: true,
  vueRouter: router,
});

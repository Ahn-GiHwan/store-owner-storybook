/* eslint-disable no-param-reassign */
import * as Sentry from '@sentry/vue';
import { BrowserTracing } from '@sentry/tracing';
import { useAuthStore } from '@/stores';

const SENTRY_DNS_KEY = 'https://a517336653f8480c9c58c687f4757465@o4504077356630016.ingest.sentry.io/4504116301332480';

const enableEnvironments = [
  'production',
  'qc',
  'staging',
  'development',
  // 'localhost',
];

const initializeSentry = (app, router) => {
  Sentry.init({
    enabled: enableEnvironments.includes(process.env.NODE_ENV)
      && !import.meta.env.VITE_PLUGIN_SENTRY_CONFIG.release.startsWith('(localhost)'), // 에러 전송 여부
    app,
    dsn: SENTRY_DNS_KEY, // 이벤트를 전송하기 위한 식별 키
    release: import.meta.env.VITE_PLUGIN_SENTRY_CONFIG.release, // vite.config.js release
    environment: process.env.NODE_ENV, // 애플리케이션 환경 (dev, production 등)
    normalizeDepth: 6, // 컨텍스트 데이터를 주어진 깊이로 정규화 (기본값: 3)
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ['localhost', /^\//], // default: ['localhost', /^\//]
      }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.ﬁ
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    beforeSend(event) {
      // Modify the event here
      const auth = useAuthStore();
      // Tarce Details Data 추가
      const loginUser = auth.currentUser ?? {};
      if (!event.contexts) event.contexts = {};
      if (!event.contexts.trace) event.contexts.trace = {};
      if (!event.contexts.trace.data) event.contexts.trace.data = {};

      event.contexts.trace.data.loginUser = {
        userId: loginUser.userId,
        loginId: loginUser.loginId,
      };

      return event;
    },
  });
};

export { initializeSentry };

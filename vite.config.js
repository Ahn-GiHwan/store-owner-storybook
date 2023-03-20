import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import gql from 'vite-plugin-simple-gql';
import loadVersion from 'vite-plugin-package-version';
import viteSentry from 'vite-plugin-sentry';

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '');

  let release = env.npm_package_version; // package.json 파일 version 으로 설정
  if (mode !== 'production') {
    release = `(${mode})${release}`;
  }
  // Configure sentry plugin
  // https://github.com/ikenfin/vite-plugin-sentry
  const sentryConfig = {
    url: 'https://sentry.io',
    authToken: 'c331f1cf1279420caf32f0758aeac95163cd83a42a0a451c90948006dfee76c7', // sentry에서 생성한 token
    org: 'barogo-store-platform',
    project: 'store-web',
    release,
    deploy: {
      env: mode,
    },
    setCommits: {
      auto: true,
      ignoreMissing: true, // 워닝 제거 (참고: https://github.com/getsentry/sentry-cli/issues/792)
    },
    skipEnvironmentCheck: (mode !== 'localhost'), // (localhost 제외) 소스맵 업로드하기 위해 설정
    sourceMaps: {
      include: ['./dist/assets'],
      ignore: ['node_modules'],
      urlPrefix: '~/assets',
    },
  };

  const config = {
    plugins: [vue(), vuetify({ autoImport: true }), gql(), loadVersion(), viteSentry(sentryConfig)],
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    resolve: {
      alias: {
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@composables': fileURLToPath(new URL('./src/composables', import.meta.url)),
        '@constants': fileURLToPath(new URL('./src/constants', import.meta.url)),
        '@graphql': fileURLToPath(new URL('./src/graphql', import.meta.url)),
        '@locales': fileURLToPath(new URL('./src/locales', import.meta.url)),
        '@plugins': fileURLToPath(new URL('./src/plugins', import.meta.url)),
        '@router': fileURLToPath(new URL('./src/router', import.meta.url)),
        '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
        '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
        '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js', // 워닝 제거 (참고: https://github.com/intlify/vue-i18n-next/issues/789)
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/styles/variables";',
        },
      },
    },
    server: {
      port: 5100,
      proxy: {},
    },
    build: {
      sourcemap: true,
    },
  };

  if (env.GRAPHQL_PROXY_HOST) {
    config.server.proxy['/graphql'] = {
      target: env.GRAPHQL_PROXY_HOST,
      changeOrigin: true,
      cookieDomainRewrite: 'localhost',
      configure: (proxy) => {
        proxy.on('proxyReq', (proxyReq) => {
          proxyReq.setHeader('origin', env.GRAPHQL_PROXY_HOST);
        });
      },
    };
  }
  if (env.S9_PROXY_HOST) {
    config.server.proxy['/barogo'] = {
      target: env.S9_PROXY_HOST,
      changeOrigin: true,
      cookieDomainRewrite: 'localhost',
      configure: (proxy) => {
        proxy.on('proxyReq', (proxyReq) => {
          proxyReq.setHeader('origin', env.S9_PROXY_HOST);
        });
      },
    };
  }

  return config;
});

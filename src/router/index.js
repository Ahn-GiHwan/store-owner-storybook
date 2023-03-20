import { createRouter, createWebHistory } from 'vue-router';

import { scrollBehavior } from './utils';
import routes from './routes';
import { afterHooks, beforeHooks } from './hooks';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior,
  routes,
});
router.beforeEach(beforeHooks);
router.afterEach(afterHooks);

// 라우트를 렌더링하는데 필요한 비동기 컴포넌트를 처리하려고 할 때 에러가 발생한 경우 (배포후)
router.onError((error, to) => {
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    window.location = to.fullPath;
  }
});

export default router;

import { createRouter, createWebHashHistory } from 'vue-router';
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes';

const router = createRouter({
  //路由模式hash
  history: createWebHashHistory(),

  // 暂时使用全部路由
  routes: [...constantRoute, ...asyncRoute, anyRoute],
  //滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    };
  },
});

export default router;

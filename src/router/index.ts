import { createRouter, createWebHashHistory } from 'vue-router';
import { constantRoute } from '@/router/routes';

const router = createRouter({
  // 路由模式hash
  history: createWebHashHistory(),

  // 初始化时只注册常量路由，动态路由在权限守卫中注册
  routes: [...constantRoute],
  // 滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    };
  },
});

export function addRouter(routes: RouteItem[]) {
  routes.forEach((route: any) => {
    router.addRoute(route);
  });
}

export default router;

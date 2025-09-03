// 路由鉴权: 鉴权,项目当中路由能不能被的权限的设置(某一个路由什么条件下可以访问、什么条件下不可以访问)
import router from '@/router';
import setting from './setting';

// @ts-expect-error 引入进度条样式，暂时忽略类型检查
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
nprogress.configure({ showSpinner: false });

// 获取用户相关的小仓库内部token数据,去判断用户是否登录成功
import useUserStore from './store/modules/acl/user';
import pinia from './store';
const userStore = useUserStore(pinia);

// 初始化注册路由
const routes = router.getRoutes();
if (userStore.token && routes.length === 3) {
  await userStore.userInfo();
}

// 全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  // 设置页面标题
  document.title = `${setting.title} - ${to.meta.title}`;
  // 开启进度条
  nprogress.start();

  // 如果错误跳转对应页面
  if (to.path === '/500' || to.path === '/404') {
    next();
  }

  // 获取token
  const token = userStore.token;
  if (token) {
    // 获取用户信息
    if (userStore.userId || userStore.menuRoutes.length === 0) {
      await userStore.userInfo();
    }
    next();
  } else {
    // 用户未登录判断
    if (to.path === '/login') {
      next();
    } else {
      next({ path: '/login', query: { redirect: to.path } });
    }
  }
});

//全局后置守卫
router.afterEach(() => {
  nprogress.done();
});

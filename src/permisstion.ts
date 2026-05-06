// 路由鉴权: 鉴权,项目当中路由能不能被的权限的设置(某一个路由什么条件下可以访问、什么条件下不可以访问)
import router from '@/router';
import setting from './setting';
// 引入操作本地存储的工具方法
import { getUserInfo } from '@/utils/localStorageTools';
// @ts-expect-error 引入进度条样式，暂时忽略类型检查
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
nprogress.configure({ showSpinner: false });

// 获取用户相关的小仓库内部token数据,去判断用户是否登录成功
import useUserStore from './store/modules/acl/user';
import pinia from './store';
const userStore = useUserStore(pinia);

// 全局前置守卫
router.beforeEach(async (to: any, _from: any, next: any) => {
  // 设置页面标题
  document.title = `${setting.title} - ${to.meta.title || ''}`;
  // 开启进度条
  nprogress.start();

  // 获取用户信息
  const user = getUserInfo();
  // 获取token
  const token = userStore.token;

  // 判断是否登录
  if (user || token) {
    // 已登录
    if (to.path === '/login') {
      // 已登录访问登录页，重定向到首页
      next({ path: '/' });
    } else {
      // 判断是否已获取用户信息和动态路由
      // 刷新页面时 menuRoutes 会被重置为空数组
      // 或者路由匹配失败（to.matched.length === 0）说明动态路由未加载
      if (userStore.menuRoutes.length === 0 || to.matched.length === 0) {
        // 获取用户信息和动态路由
        await userStore.userInfo();
        // 重新触发导航，确保动态路由已注册
        next({ ...to, replace: true });
      } else {
        // 已有路由信息，直接放行
        next();
      }
    }
  } else {
    // 未登录
    if (to.path === '/login') {
      // 未登录访问登录页，直接放行
      next();
    } else {
      // 未登录访问其他页面，重定向到登录页
      next({ path: '/login' });
      // next({ path: '/login', query: { redirect: to.path } });
    }
  }
});

//全局后置守卫
router.afterEach(() => {
  nprogress.done();
});

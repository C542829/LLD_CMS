//创建用户相关的小仓库
import { defineStore } from 'pinia';
//引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user';
import type {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
} from '@/api/user/type';
import type { UserState } from './types/type';
//引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token';
//引入路由(常量路由)
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes';

//引入深拷贝方法
//@ts-expect-error lodash 类型定义文件版本与当前使用的 lodash 库不匹配，暂时忽略类型错误
import cloneDeep from 'lodash/cloneDeep';
import router from '@/router';
//用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    // if (routes.includes(item.name)) {
    if (item.children && item.children.length > 0) {
      item.children = filterAsyncRoute(item.children, routes);
    }
    return true;
    // }
  });
}

const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(), //用户唯一标识token
      menuRoutes: [...constantRoute, ...asyncRoute, anyRoute], //仓库存储生成菜单需要数组(路由)
      username: 'admin',
      avatar:
        'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      //存储当前用户是否包含某一个按钮
      buttons: [],
    };
  },
  actions: {
    // 登录
    async userLogin(data: loginFormData) {
      return 'ok';
      const result: loginResponseData = await reqLogin(data);
      if (result.code == 200) {
        this.token = result.data as string;
        SET_TOKEN(result.data as string);
        return 'ok';
      } else {
        return Promise.reject(new Error(result.data));
      }
    },

    // 获取用户信息
    async userInfo() {
      return 'ok';
      const result: userInfoReponseData = await reqUserInfo();
      result.code = 200;
      if (result.code == 200) {
        this.username = result.data.name;
        this.avatar = result.data.avatar;
        this.buttons = result.data.buttons;
        const userAsyncRoute = filterAsyncRoute(
          cloneDeep(asyncRoute),
          result.data.routes,
        );
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute];

        [...userAsyncRoute, anyRoute].forEach((route: any) => {
          router.addRoute(route);
        });

        return 'ok';
      } else {
        return Promise.reject(new Error(result.message));
      }
    },

    //退出登录
    async userLogout() {
      const result: any = await reqLogout();
      if (result.code == 200) {
        this.token = '';
        this.username = '';
        this.avatar = '';
        REMOVE_TOKEN();
        return 'ok';
      } else {
        return Promise.reject(new Error(result.message));
      }
    },
  },
  getters: {},
});

export default useUserStore;

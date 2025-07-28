import { defineStore } from 'pinia';
// 引入接口
import { reqLogin, reqUserInfo, reqLogout, reqUpdate } from '@/api/user';
// 引入操作本地存储的工具方法
import { setUserInfo, getUserInfo, removeUserInfo, setToken, getToken, removeToken } from '@/utils/localStorageTools';
// 引入相应枚举
import { ResponseCode } from '@/enums/response';
// 引入路由(常量路由)
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes';
// 引入项目设置
import setting from '@/setting';
// 引入消息提示组件
import $Message from '@/components/Message';
// 引入深拷贝方法
import cloneDeep from 'lodash/cloneDeep';
// 引入路由
import router from '@/router';
import { parseResObj } from '@/utils/parseResponse';

import { usePermissionStore } from '@/store/modules/acl/permission';

// 用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asyncRoute: any, routes: any, tabs: Map<string, string[]>) {
  return asyncRoute.filter((item: any) => {
    if (tabs.get(item.name)) {
      item.meta.tabs = tabs.get(item.name);
    }
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes, tabs);
      }
      return true;
    }
  });
}

const useUserStore = defineStore('User', {
  state: () => {
    return {
      user: <any>{},
      userId: 0,
      username: '',
      nickname: '',
      avatar: setting.logo || '',
      token: getToken() || '', // 用户唯一标识token
      buttons: [], // 存储当前用户是否包含某一个按钮
      menuRoutes: <object[]>[], // 仓库存储生成菜单需要数组(路由)
    };
  },
  actions: {
    // 登录
    async login(data: any) {
      const res: any = await reqLogin(data);
      const isSuccess = res.code === ResponseCode.SUCCESS;
      if (isSuccess) {
        const result = res.data;
        this.userId = result.userId;
        this.nickname = result.userName;
        this.username = result.userCode;
        this.token = `Bearer ${result.token}`;
        setToken(this.token);
        setUserInfo(result);
        await this.userInfo();
      } else {
        $Message.error(res.message);
      }
      return isSuccess;
    },

    // 获取用户信息
    async userInfo() {
      const permStore = usePermissionStore();

      const user = getUserInfo();
      this.userId = user.userId;
      this.nickname = user.userName;
      this.username = user.userCode;

      // this.buttons = result.data.buttons;
      if (this.menuRoutes.length === 0) {
        const perms = await permStore.getPermTreeByUserId(this.userId);
        const routes = perms.treeMap((item) => item.component);
        const tabs: any = perms.treeMap((item) => {
          if (item.remark) {
            const tabs = item.children.map((child: any) => child.name);
            return [item.component, tabs];
          }
        });
        const userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), routes, new Map(tabs));
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute];
      }

      this.menuRoutes.forEach((route: any) => {
        router.addRoute(route);
      });
    },

    // 退出登录
    async userLogout() {
      const params = { username: this.username };
      const res: any = await reqLogout(params);
      if (res.code === ResponseCode.SUCCESS) {
        this.clearUserInfo();
      } else {
        $Message.error('退出登录失败');
      }
    },

    clearUserInfo() {
      this.token = '';
      this.username = '';
      this.nickname = '';
      this.userId = 0;
      this.menuRoutes = [];
      this.buttons = [];
      removeToken();
      removeUserInfo();
    },

    async getUserInfo() {
      this.user = parseResObj(await reqUserInfo(this.userId)) || {};
      return this.user;
    },

    async updatePwd(data: any) {
      const params = this.user;
      params.userPassword = data.newPwd;
      const res: any = await reqUpdate(params);
      const isSuccess = res.code === ResponseCode.SUCCESS;
      if (isSuccess) {
        $Message.success('修改密码成功');
        this.userLogout();
      } else {
        $Message.error('修改密码失败，原因：' + res.message);
      }
      return isSuccess;
    },
  },
  getters: {},
});

export default useUserStore;

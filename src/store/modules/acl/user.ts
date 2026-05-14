import setting from '@/setting';
import $Message from '@/components/Message';
import cloneDeep from 'lodash/cloneDeep';
import router from '@/router';
import { defineStore } from 'pinia';
import { isEmpty } from 'lodash';
import { parseResObj } from '@/utils/parseResponse';
import { RoleCode, ResponseCode } from '@/enums';
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes';
import { reqUserInfo, reqUpdate } from '@/api/user';
import { reqQueryPermTreeByUser } from '@/api/acl/permission/index';
import { reqOrgInfo } from '@/api/acl/org/index';
import {
  setUserInfo,
  getUserInfo,
  removeUserInfo,
  setToken,
  getToken,
  removeToken,
  setOrgInfo,
  removeOrgInfo,
} from '@/utils/localStorageTools';

import { useMasterDataStore } from '@/store/modules/masterData/index';
import { useDictStore } from '@/store/modules/dict/index';

function checkRole(role: any, ...codes: RoleCode[]) {
  if (isEmpty(role)) return false;
  return codes.includes(role?.roleCode || '');
}

// 用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes);
      }
      return true;
    }
  });
}

const useUserStore = defineStore('User', {
  state: () => {
    return {
      user: <UserInfo>{},
      org: <OrgInfo>{},
      userId: 0,
      avatar: setting.logo || '',
      token: getToken() || '',
      buttons: <string[]>[],
      menuRoutes: <object[]>[],
      tabs: <string[]>[],
    };
  },
  actions: {
    /** 设置认证信息（token + 用户基础信息 + localStorage） */
    setAuth(result: any) {
      this.token = `Bearer ${result.token}`;
      this.userId = result.userId;
      this.user = result;
      setUserInfo(result);
      setToken(this.token);
    },

    /** 登录后初始化（路由权限 + 门店信息 + 用户详情 + 预加载） */
    async initAfterLogin() {
      await this.initRoutes();
      this.loadOrgInfo(this.user.orgId!);
      this.loadUserInfo(this.user.userId);
      this.preloadCommonData();
    },

    /** 恢复会话（路由守卫调用，从 localStorage 恢复） */
    async restoreSession() {
      try {
        const user = getUserInfo();
        if (isEmpty(user)) {
          this.clearUserInfo();
          return;
        }
        this.setAuth(user);

        if (this.menuRoutes.length === 0) {
          await this.initRoutes();
        }

        this.menuRoutes.forEach((route: any) => {
          router.addRoute(route);
        });

        this.loadOrgInfo(user.orgId);
        this.loadUserInfo(user.userId);
        this.preloadCommonData();
      } catch (error) {
        console.error(`获取用户信息出错：${error}`);
      }
    },

    /** 构建并注册动态路由 */
    async initRoutes() {
      if (this.menuRoutes.length > 0) return;
      const { data } = await reqQueryPermTreeByUser(this.userId);
      const perms = data;
      const routes = perms.treeMap((item) => item.component);
      this.buttons = perms.treeMap((item) => item.permCode as string);
      this.tabs = perms
        .treeMap((item) => item.remark && [...(item?.children || []).map((child: any) => child.name)])
        .flat();
      const userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), routes);
      this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute];
      this.menuRoutes.forEach((route: any) => router.addRoute(route));
    },

    /** 延迟预加载公共数据 */
    preloadCommonData() {
      // 业务数据优先加载
      useMasterDataStore().init();
      // 字典数据稍后
      setTimeout(() => {
        useDictStore().preloadCommonDicts();
      }, 500);
    },

    /** 存储门店信息 */
    async loadOrgInfo(orgId: number) {
      try {
        const res = await reqOrgInfo(orgId);
        const orgInfo = res.data;
        orgInfo.orgArea && (orgInfo.orgArea = JSON.parse(orgInfo.orgArea as string));
        this.org = orgInfo;
        setOrgInfo(orgInfo);
      } catch (error) {}
    },

    /** 存储当前用户信息 */
    async loadUserInfo(userId: number) {
      try {
        const res = await reqUserInfo(userId);
        this.user = { ...this.user, ...res.data };
      } catch (error) {}
    },

    /** 退出登录（只清除状态和跳转，API 调用在组件内） */
    logout() {
      this.clearUserInfo();
      router.push({ path: '/login' });
      window.location.reload();
    },

    clearUserInfo() {
      this.user = {};
      this.org = {} as OrgInfo;
      this.token = '';
      this.userId = 0;
      this.menuRoutes = [];
      this.buttons = [];
      this.tabs = [];
      removeToken();
      removeUserInfo();
      removeOrgInfo();
      useMasterDataStore().$reset();
      useDictStore().invalidate();
    },

    async getUserInfo() {
      this.user = parseResObj(await reqUserInfo(this.userId)) || {};
      if (this.user?.role?.id) {
        this.user.roleId = this.user.role.id;
      }
      return this.user;
    },

    async updatePwd(data: any) {
      const params = this.user;
      params.userPassword = data.newPwd;
      const res: any = await reqUpdate(params);
      const isSuccess = res.code === ResponseCode.SUCCESS;
      if (isSuccess) {
        $Message.success('修改密码成功');
        this.logout();
      } else {
        $Message.error('修改密码失败，原因：' + res.message);
      }
      return isSuccess;
    },
  },
  getters: {
    hasRole:
      (state) =>
      (...codes: RoleCode[]) =>
        checkRole(state.user?.role, ...codes),
    isSuperAdmin: (state) => checkRole(state.user?.role, RoleCode.SuperAdmin as RoleCode),
    isAdmin: (state) => checkRole(state.user?.role, RoleCode.Admin as RoleCode, RoleCode.SuperAdmin as RoleCode),
    isAreaManager: (state) => checkRole(state.user?.role, RoleCode.AreaManager as RoleCode),
  },
});

export default useUserStore;

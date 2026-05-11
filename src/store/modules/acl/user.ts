import setting from '@/setting';
import $Message from '@/components/Message';
import cloneDeep from 'lodash/cloneDeep';
import router from '@/router';
import { defineStore } from 'pinia';
import { isEmpty } from 'lodash';
import { parseResObj } from '@/utils/parseResponse';
import { RoleCode, ResponseCode } from '@/enums';
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes';
// 引入接口
import { reqLogin, reqUserInfo, reqLogout, reqUpdate } from '@/api/user';
import { reqQueryPermTreeByUser } from '@/api/acl/permission/index';
import { reqOrgInfo } from '@/api/acl/org/index';
// 引入操作本地存储的工具方法
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
      username: '',
      nickname: '',
      avatar: setting.logo || '',
      token: getToken() || '', // 用户唯一标识token
      buttons: <string[]>[], // 存储当前用户是否包含某一个按钮
      menuRoutes: <object[]>[], // 仓库存储生成菜单需要数组(路由)
      tabs: <string[]>[],
    };
  },
  actions: {
    // 登录
    async login(data: any) {
      try {
        const res = await reqLogin(data);
        const result = res.data;
        this.setStoreUserInfo(result);
        setUserInfo(result);
        setToken(this.token);
        await this.userInfo();
        return true;
      } catch (error) {
        return false;
      }
    },

    setStoreUserInfo(user: any) {
      this.userId = user.userId;
      this.nickname = user.userName;
      this.username = user.userCode;
      this.token = `Bearer ${user.token}`;
      this.user = user;
    },

    // 获取用户信息
    async userInfo() {
      try {
        const user = getUserInfo();
        if (isEmpty(user)) {
          this.clearUserInfo();
          return;
        }
        // 同步用户信息
        this.setStoreUserInfo(user);

        if (this.menuRoutes.length === 0) {
          const { data } = await reqQueryPermTreeByUser(this.userId);
          const perms = data;
          const routes = perms.treeMap((item) => item.component);
          this.buttons = perms.treeMap((item) => item.permCode as string);
          this.tabs = perms
            .treeMap((item) => item.remark && [...(item?.children || []).map((child: any) => child.name)])
            .flat();
          const userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), routes);
          this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute];
        }

        this.menuRoutes.forEach((route: any) => {
          router.addRoute(route);
        });

        // 获取门店信息
        this.storageOrgInfo(user.orgId);
        // 获取用户信息
        this.storageUserInfo(user.userId);
        // 延迟预加载公共数据（不阻塞登录流程）
        setTimeout(() => {
          useDictStore().preloadCommonDicts();
          useMasterDataStore().init();
        });
      } catch (error) {
        console.error(`获取用户信息出错：${error}`);
      }
    },

    /** 存储门店信息 */
    async storageOrgInfo(orgId: number) {
      try {
        reqOrgInfo(orgId).then((res) => {
          const orgInfo = res.data;
          orgInfo.orgArea && (orgInfo.orgArea = JSON.parse(orgInfo.orgArea as string));
          this.org = orgInfo;
          setOrgInfo(orgInfo);
        });
      } catch (error) {}
    },

    /** 存储当前用户信息 */
    async storageUserInfo(userId: number) {
      try {
        reqUserInfo(userId).then((res) => {
          const userInfo = res.data;
          this.user = { ...this.user, ...userInfo };
        });
      } catch (error) {}
    },

    // 退出登录
    async userLogout() {
      const params = { username: this.username };
      const res: any = await reqLogout(params);
      if (res.code === ResponseCode.SUCCESS) {
        this.clearUserInfo();
        router.push({ path: '/login' });
        window.location.reload();
        // window.location.href = '/#/login';
        // $Message.success('退出登录成功');
      } else {
        $Message.error('退出登录失败');
      }
    },

    clearUserInfo() {
      this.user = {};
      this.org = {} as OrgInfo;
      this.token = '';
      this.username = '';
      this.nickname = '';
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
        this.userLogout();
      } else {
        $Message.error('修改密码失败，原因：' + res.message);
      }
      return isSuccess;
    },
  },
  getters: {
    isSuperAdmin: (state) => {
      const role = state.user?.role;
      if (isEmpty(role)) {
        return false;
      }
      return role?.roleCode === RoleCode.SuperAdmin;
    },
    isAdmin: (state) => {
      const role = state.user?.role;
      if (isEmpty(role)) {
        return false;
      }
      const roleCodes = [RoleCode.Admin, RoleCode.SuperAdmin];
      return roleCodes.includes(role?.roleCode || '');
    },
    isAreaManager: (state) => {
      const role = state.user?.role;
      if (isEmpty(role)) {
        return false;
      }
      return role?.roleCode === RoleCode.AreaManager;
    },
  },
});

export default useUserStore;

import { get, post, put } from '@/utils/request';
import useUserStore from '@/store/modules/acl/user';
import { setUserInfo } from '@/utils/localStorageTools';
import * as Types from './types';

export { Types };

// 项目用户相关的请求地址
enum API {
  LIST_URL = '/system/user/query-list',
  LOGIN_URL = '/auth/login',
  USERINFO_URL = '/system/user/query-info',
  LOGOUT_URL = '/auth/logout',
  UPDATE_PWD_URL = '/system/user/update-pwd',
  ADD_URL = '/system/user/add-user',
  UPDATE_URL = '/system/user/update-user',
  ROLE_LIST_URL = '/system/user/query-role-list',
  ALLOCATE_ROLE_URL = '/system/user/allocate-role',
}

/**
 * 登录接口
 * @param data 登录参数
 * @returns 登录结果
 */
export const reqLogin = (data: Types.LoginForm): ApiResponse<Types.LoginResponse> => post(API.LOGIN_URL, data);

/**
 * 获取用户列表
 * @param params
 * @returns
 */
export const reqUserList = (params: Types.SearchUserParams): ApiResponse<PageListInfo<UserInfo[]>> =>
  get(API.LIST_URL, params);

/**
 * 获取用户信息
 * @returns 用户信息
 */
export const reqUserInfo = (id: number): ApiResponse<UserInfo> => get(API.USERINFO_URL, { id });

/**
 * 退出登录
 * @returns 退出登录结果
 */
export const reqLogout = (data: any) => post(API.LOGOUT_URL, data, { form_urlencoded: true });

/**
 * 更新用户信息
 * @param data 更新用户信息参数
 * @returns 更新用户信息结果
 */
export const reqUpdate = (data: any) => put(API.UPDATE_URL, data);

/**
 * 更新密码
 * @param data 更新密码参数
 * @returns 更新密码结果
 */
export const reqUpdatePwd = (data: any) => post(API.UPDATE_PWD_URL, data);

/**
 * 添加用户信息
 * @param data 用户信息参数
 * @returns 用户信息结果
 */
export const reqAddUser = (data: Types.UserDTO): ApiResponse<any> => post(API.ADD_URL, data);

/**
 * 更新用户信息
 * @param data 更新用户信息参数
 * @returns 更新用户信息结果
 */
export const reqUpdateUser = (data: Types.UserDTO): ApiResponse<any> => put(API.UPDATE_URL, data);

export const reqUserRoleList = (userId: number) => get(API.ROLE_LIST_URL, { userId });

export const reqAllocateUserRole = (data = {}) => post(API.ALLOCATE_ROLE_URL, data);

/**
 * 初始化当前登录用户信息
 * @param id 用户 id
 */
export const storageUserInfo = async (id: number, token: string) => {
  try {
    const res = await reqUserInfo(id);
    const userInfo = res.data;
    userInfo.token = token || '';
    setUserInfo(userInfo);
    return userInfo;
  } catch (error) {
    console.error(`获取当前登录信息报错：${error}`);
  }
  return null;
};

/**
 * 默认用户列表查询参数
 */
export const defaultParams: Types.SearchUserParams = {
  roleId: '',
  userName: '',
  userStatus: '在职',
  userNumber: '',
  pageNum: 1,
  pageSize: 200,
  orgIds: [],
};

/**
 * 获取用户列表
 */
export const getUserList = async (params: Types.SearchUserParams = defaultParams): Promise<UserInfo[]> => {
  try {
    if (params.orgIds && params.orgIds.length === 0) {
      const userStore = useUserStore();
      if (userStore.user.orgs) {
        params.orgIds = userStore.user.orgs.map((item) => item.id as number);
      } else {
        params.orgIds = [userStore.user.orgId as number];
      }
    }
    const res = await reqUserList(params);
    const data = res.data.rows.map((item: UserInfo) => {
      return {
        id: item.id,
        userId: item.id,
        userName: item.userName,
      };
    });
    return data || [];
  } catch (error) {
    return [];
  }
};

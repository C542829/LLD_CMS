import { get, post, put } from '@/utils/request';
import { setStoreUserInfo } from '@/store/index';
import { setUserInfo } from '@/utils/localStorageTools';
import * as Types from './types';

// 项目用户相关的请求地址
enum API {
  LOGIN_URL = '/auth/login',
  USERINFO_URL = '/system/user/query-info',
  LOGOUT_URL = '/auth/logout',
  UPDATE_URL = '/system/user/update-user',
  UPDATE_PWD_URL = '/system/user/update-pwd',
}

/**
 * 登录接口
 * @param data 登录参数
 * @returns 登录结果
 */
export const reqLogin = (data: Types.LoginForm): ApiResponse<Types.LoginResponse> =>
  post(API.LOGIN_URL, data, { form_urlencoded: true });

/**
 * 获取用户信息
 * @returns 用户信息
 */
export const reqUserInfo = (id: number): ApiResponse<Types.UserInfoVO> => get(API.USERINFO_URL, { id });

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
 * 初始化当前登录用户信息
 * @param id 用户 id
 */
export const storageUserInfo = async (id: number, token: string) => {
  try {
    const res = await reqUserInfo(id);
    const userInfo = res.data;
    userInfo.token = token || '';
    setStoreUserInfo(userInfo);
    setUserInfo(userInfo);
    return userInfo;
  } catch (error) {
    console.error(`获取当前登录信息报错：${error}`);
  }
  return null;
};

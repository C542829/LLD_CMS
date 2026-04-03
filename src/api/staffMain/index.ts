import { get, post, put } from '@/utils/request';
import * as Types from './types';

enum API {
  LIST_URL = '/system/user/query-list',
  INFO_URL = '/system/user/query-info',
  ADD_URL = '/system/user/add-user',
  UPDATE_URL = '/system/user/update-user',
  ROLE_LIST_URL = '/system/user/query-role-list',
  ALLOCATE_ROLE_URL = '/system/user/allocate-role',
}

export const reqUserList = (params: Types.SearchUserParams): ApiResponse<PageListInfo<Types.UserInfoVO[]>> =>
  get(API.LIST_URL, params, { addOrgId: true });

export const reqUserInfo = (id: number): ApiResponse<Types.UserInfoVO> => get(API.INFO_URL, { id });

export const reqAddUser = (data = {}) => post(API.ADD_URL, data);

export const reqUpdateUser = (data = {}) => put(API.UPDATE_URL, data);

export const reqUserRoleList = (userId: number) => get(API.ROLE_LIST_URL, { userId });

export const reqAllocateUserRole = (data = {}) => post(API.ALLOCATE_ROLE_URL, data);

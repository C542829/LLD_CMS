import { get, post, put } from '@/utils/request';
import * as Types from './types';

export { Types };

//枚举地址
enum API {
  LIST_URL = '/system/role/query-list',
  ADD_URL = '/system/role/add-role',
  UPDATE_URL = '/system/role/update-role',
  UPDATE_STATUS_URL = '/system/role/update-status',
  ALLOCATED_LIST_URL = '/system/role/query-allocated-list',
  UNALLOCATED_LIST_URL = '/system/role/query-unallocated-list',
  ADD_ALLOCATED_USER_URL = '/system/role/add-user',
  ADD_ALLOCATED_PERMISSION_URL = '/system/role/add-permission',
}

/**
 * 获取角色列表
 * @param params 查询参数
 * @returns
 */
export const reqRoleList = (
  params: Types.SearchRoleParams = {
    roleName: '',
    roleCode: '',
    status: 0,
  },
): ApiResponse<Types.RoleInfoVo[]> => get(API.LIST_URL, params);

/**
 * 新增角色
 * @param data 角色信息
 * @returns
 */
export const reqAddRole = (data: Types.RoleCreateDTO): ApiResponse<any> => post(API.ADD_URL, data);

/**
 * 更新角色
 * @param data 角色信息
 * @returns
 */
export const reqUpdateRole = (data: Types.RoleUpdateDTO): ApiResponse<any> => put(API.UPDATE_URL, data);

/**
 * 更新角色状态
 * @param params 参数
 * @returns
 */
export const reqUpdateRoleStatus = (params: { roleId: number; status: number }): ApiResponse<any> =>
  put(API.UPDATE_STATUS_URL, params, { form_urlencoded: true });

/**
 * 获取已分配用户列表
 * @param roleId 角色ID
 * @returns 已分配用户列表
 */
export const reqAllocatedList = (roleId: number) => get(API.ALLOCATED_LIST_URL, { roleId });

export const reqUnallocatedList = () => get(API.UNALLOCATED_LIST_URL);

export const reqAddAllocatedUser = (params: any) => post(API.ADD_ALLOCATED_USER_URL, params);

export const reqAddAllocatedPerm = (params: any) => post(API.ADD_ALLOCATED_PERMISSION_URL, params);

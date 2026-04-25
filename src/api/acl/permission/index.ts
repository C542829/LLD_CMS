import { get, post, put } from '@/utils/request';
import { PermissionInfoVO, PermissionCreateDTO, PermissionUpdateDTO } from './types';

//枚举地址
enum API {
  /** 获取权限列表 */
  LIST_URL = '/system/permission/query-list',
  /** 添加权限 */
  ADD_URL = '/system/permission/add-permission',
  /** 更新权限 */
  UPDATE_URL = '/system/permission/update-permission',
  /** 更新权限状态 */
  UPDATE_STATUS_URL = '/system/permission/update-permission-status',
  /** 获取权限树 */
  QUERY_TREE_URL = '/system/permission/query-tree',
  /** 获取角色权限树 */
  QUERY_TREE_BY_ROLE_URL = '/system/permission/query-tree-by-role/{roleId}',
  /** 获取用户权限树 */
  QUERY_TREE_BY_USER_URL = '/system/permission/query-tree-by-user/{userId}',
}

/**
 * 获取权限列表
 * @param params 查询参数
 * @returns 权限列表
 */
export const reqPermList = (params: { name?: string; status?: string | number } = { status: 0 }): ApiResponse<any> =>
  get(API.LIST_URL, params);

/**
 * 添加权限
 * @param data 权限数据
 * @returns 添加结果
 */
export const reqAddPerm = (data: PermissionCreateDTO): ApiResponse<any> => post(API.ADD_URL, data);

/**
 * 更新权限
 * @param data 权限数据
 * @returns 更新结果
 */
export const reqUpdatePerm = (data: PermissionUpdateDTO): ApiResponse<any> => put(API.UPDATE_URL, data);

/**
 * 更新权限状态
 * @param data 权限状态
 * @returns 更新结果
 */
export const reqUpdatePermStatus = (data: { id: number; status: number }): ApiResponse<any> =>
  put(API.UPDATE_STATUS_URL, data, { form_urlencoded: true });

/**
 * 获取权限树
 * @param params 查询参数
 * @returns 权限树
 */
export const reqQueryPermTree = (
  params: { name?: string; status?: string | number } = { status: 0 },
): ApiResponse<PermissionInfoVO[]> => get(API.QUERY_TREE_URL, params);

/**
 * 获取角色权限树
 * @param roleId 角色ID
 * @returns 角色权限树
 */
export const reqQueryPermTreeByRole = (roleId: number): ApiResponse<PermissionInfoVO[]> =>
  get(API.QUERY_TREE_BY_ROLE_URL.replace('{roleId}', roleId.toString()));

/**
 * 获取用户权限树
 * @param userId 用户ID
 * @returns 用户权限树
 */
export const reqQueryPermTreeByUser = (userId: number): ApiResponse<PermissionInfoVO[]> =>
  get(API.QUERY_TREE_BY_USER_URL.replace('{userId}', userId.toString()));

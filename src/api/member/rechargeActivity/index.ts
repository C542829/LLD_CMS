import { get, post, put } from '@/utils/request';
import * as Types from './types';

export { Types };

enum API {
  LIST_URL = '/vip/recharge-active/query-list',
  ADD_URL = '/vip/recharge-active/add',
  // UPDATE_URL = '/vip/recharge-active/update-active',
  UPDATE_STATUS_URL = '/vip/recharge-active/update-status',
}

/**
 * 获取充值活动列表
 */
export const reqActiveList = (params: Types.SearchActiveParams = {}): ApiResponse<Types.RechargeActiveVO[]> =>
  get(API.LIST_URL, params, { addOrgId: true });

/**
 * 添加充值活动
 */
export const reqAddActive = (data = {}) => post(API.ADD_URL, data);

/**
 * 更新充值活动
 */
// export const reqUpdateActive = (data = {}) => put(API.UPDATE_URL, data);

/**
 * 更新充值活动状态
 */
export const reqUpdateActiveStatus = (data = {}) => put(API.UPDATE_STATUS_URL, data);

/**
 * 默认用户列表查询参数
 */
export const defaultParams: Types.SearchActiveParams = {
  orgId: undefined,
  activeName: '',
  activeStatus: 0,
};

/**
 * 获取充值活动列表
 */
export const getActivityList = async (
  params: Types.SearchActiveParams = defaultParams,
): Promise<Types.RechargeActiveVO[]> => {
  try {
    const res = await reqActiveList(params);
    const data = res.data;
    // .map((item: Types.RechargeActiveVO) => {
    //   return {
    //     id: item.id,
    //     activeName: item.activeName,
    //     activeStatus: item.activeStatus,
    //   };
    // });
    return data || [];
  } catch (error) {
    return [];
  }
};

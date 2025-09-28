import { get, post, put, del } from '@/utils/request';

// 接口地址
enum API {
  LIST_URL = '/vip/recharge-history/query-list',
  UPDATE_URL = '/vip/recharge-history/update-status',

  ACTIVE_LIST_URL = '/vip/recharge-active/active-list',
  ADD_ACTIVE_URL = '/vip/recharge-active/add-active',
  ACTIVE_INFO_URL = '/vip/recharge-active/active-info',
}

/**
 * 查询充值记录列表
 * @param params 充值记录查询参数
 * @returns 充值记录列表
 */
export const reqRechargeHistoryList = (params = {}) => get(API.LIST_URL, params);

// export const reqAddRechargeHistory = (data = {}) => post(API.ADD_URL, data);

export const reqUpdateRechargeHistory = (data = {}) => put(API.UPDATE_URL, data);

export const reqActiveList = (params = {}) => get(API.ACTIVE_LIST_URL, params);

export const reqAddActive = (data = {}) => post(API.ADD_ACTIVE_URL, data);

export const reqActiveInfo = (params = {}) => get(API.ACTIVE_INFO_URL, params);

// export const reqUpdateActive = (data = {}) => put(API.UPDATE_ACTIVE_URL, data);

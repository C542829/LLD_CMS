import { get, post, put, del } from '@/utils/request';

// 人员管理模块接口地址
enum API {
  // 获取人员列表
  LIST_URL = '/vip/query-list',
  INFO_URL = '/vip/query-info',
  ADD_URL = '/vip/add-vip',
  UPDATE_URL = '/vip/update-vip',
}

export const reqVipList = (params = {}) => get(API.LIST_URL, params);

export const reqVipInfo = (params = {}) => get(API.LIST_URL, params);

export const reqAddVip = (data = {}) => post(API.ADD_URL, data);

export const reqUpdateVip = (data = {}) => put(API.UPDATE_URL, data);

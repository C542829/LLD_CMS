import { get, post, put, del } from '@/utils/request';

enum API {
  LIST_URL = '/server/recharge-role/query-list',
  ADD_URL = '/server/recharge-role/add-role',
  UPDATE_URL = '/server/recharge-role/update-role',
}

export const reqRechargeCommissionRulesList = (params = {}) => get(API.LIST_URL, params);

export const reqAddRechargeCommissionRules = (data = {}) => post(API.ADD_URL, data);

export const reqUpdateRechargeCommissionRules = (data = {}) => put(API.UPDATE_URL, data);

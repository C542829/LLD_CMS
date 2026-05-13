import { get, post, put } from '@/utils/request';
import * as Types from './types';

export { Types };

enum API {
  LIST_URL = '/server/recharge-role/query-list',
  ADD_URL = '/server/recharge-role/add-role',
  UPDATE_URL = '/server/recharge-role/update-role',
  UPDATE_STATUS = '/server/recharge-role/update-status',
  GET_DEFAULT = '/server/recharge-role/get-default',
  SET_DEFAULT = '/server/recharge-role/set-default/{roleId}',
}

const roleIdStr = '{roleId}';

export const reqRechargeCommissionRulesList = (
  params: Types.RechargeRoleQueryParams = {},
): ApiResponse<Types.RechargeRoleVO[]> => get(API.LIST_URL, params);

export const reqAddRechargeCommissionRules = (data: Types.RechargeRoleCreateDTO): ApiResponse<string> =>
  post(API.ADD_URL, data);

export const reqUpdateRechargeCommissionRules = (data: Types.RechargeRoleUpdateDTO): ApiResponse<string> =>
  put(API.UPDATE_URL, data);

export const reqUpdateRechargeRoleStatus = (data: Types.UpdateRechargeRoleStatusDTO): ApiResponse<string> =>
  put(API.UPDATE_STATUS, data, { form_urlencoded: true });

export const reqDefaultCommissionRule = (): ApiResponse<Types.RechargeRoleVO> => get(API.GET_DEFAULT);

export const reqSetDefaultCommissionRule = (ruleId: number): ApiResponse<string> => {
  const url = API.SET_DEFAULT.replace(roleIdStr, ruleId.toString());
  return put(url);
};

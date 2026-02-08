import { get, post, put, ContentType } from '@/utils/request';
import * as Types from './types';

export { Types };

//枚举地址
enum API {
  LIST_URL = '/system/org/query-list',
  LIST_ONE_URL = '/system/org/query-one',
  ADD_URL = '/system/org/add-org',
  UPDATE_URL = '/system/org/update-org',
  UPDATE_STATUS_URL = '/system/org/update-org-status',
  /** 修改门店默认相关规则 */
  UPDATE_DEFAULT_RULE = `/system/org/update-default-rule`,
  /** 修改打印宽度 */
  UPDATE_PRINT_WIDTH = `/system/org/update-print-width`,
}

export const reqList = (params: Types.SearchListParams): ApiResponse<Types.OrgInfoVO[]> => get(API.LIST_URL, params);

export const reqListOne = (id: number): ApiResponse<Types.OrgInfoVO> => get(API.LIST_ONE_URL, { id });

export const reqAdd = (data: Types.Org): ApiResponse<any> => post(API.ADD_URL, data);

export const reqUpdate = (data: Types.Org): ApiResponse<any> => put(API.UPDATE_URL, data);

export const reqUpdateStatus = (params: any): ApiResponse<any> =>
  put(API.UPDATE_STATUS_URL, params, ContentType.URLencoded);

/**
 * 修改门店默认相关规则
 * @param data 提成规则
 * @returns
 */
export const reqSetOrgDefaultCommissionRule = (data: Types.OrgDefaultRuleUpdateDTO): ApiResponse<any> => {
  return put(API.UPDATE_DEFAULT_RULE, data);
};

/**
 * 修改门店打印宽度
 * @param data 参数
 * @returns
 */
export const reqSetPrintWidth = (data: { id: number; printWidth: number }): ApiResponse<any> => {
  return put(API.UPDATE_PRINT_WIDTH, data);
};

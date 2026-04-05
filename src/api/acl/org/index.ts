import { get, post, put } from '@/utils/request';
import { setStoreOrgInfo } from '@/store/index';
import { setOrgInfo } from '@/utils/localStorageTools';
import * as Types from './types';

// 导出类型
export { Types };

// 门店接口
enum API {
  /** 门店列表 */
  LIST_URL = '/system/org/query-list',
  /** 门店详情 */
  LIST_ONE_URL = '/system/org/query-one',
  /** 新增门店 */
  ADD_URL = '/system/org/add-org',
  /** 更新门店 */
  UPDATE_URL = '/system/org/update-org',
  /** 更新门店状态 */
  UPDATE_STATUS_URL = '/system/org/update-org-status',
  /** 修改门店默认相关规则 */
  UPDATE_DEFAULT_RULE = `/system/org/update-default-rule`,
  /** 修改打印宽度 */
  UPDATE_PRINT_WIDTH = `/system/org/update-print-width`,
}

/**
 * 获取门店列表
 * @param params 搜索参数
 * @returns
 */
export const reqList = (params: Types.SearchListParams = { orgStatus: 0 }): ApiResponse<OrgInfo[]> => {
  return get(API.LIST_URL, params);
};

/**
 * 获取门店详情
 * @param id 门店ID
 * @returns
 */
export const reqListOne = (id: number): ApiResponse<OrgInfo> => {
  return get(API.LIST_ONE_URL, { id });
};

/**
 * 新增门店
 * @param data 门店信息
 * @returns
 */
export const reqAdd = (data: Types.Org): ApiResponse<any> => post(API.ADD_URL, data);

/**
 * 更新门店
 * @param data 门店信息
 * @returns
 */
export const reqUpdate = (data: Types.Org): ApiResponse<any> => put(API.UPDATE_URL, data);

/**
 * 更新门店状态
 * @param params 参数
 * @returns
 */
export const reqUpdateStatus = (params: any): ApiResponse<any> =>
  put(API.UPDATE_STATUS_URL, params, { form_urlencoded: true });

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

// 功能函数

/**
 * 初始化门店详情
 * @param id 门店id
 */
export const storageOrgInfo = async (id: number) => {
  try {
    const res = await reqListOne(id);
    const orgInfo = res.data;
    orgInfo.orgArea && (orgInfo.orgArea = JSON.parse(orgInfo.orgArea as string));
    setStoreOrgInfo(orgInfo);
    setOrgInfo(orgInfo);
    return orgInfo;
  } catch (error) {
    console.error(`获取门店信息报错：${error}`);
  }
  return null;
};

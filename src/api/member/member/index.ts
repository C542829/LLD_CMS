import { get, post, put, ContentType } from '@/utils/request';
import { SearchParams } from './type';

enum API {
  LIST_URL = '/vip/query-list',
  INFO_URL = '/vip/query-info',
  ADD_URL = '/vip/add-vip',
  UPDATE_URL = '/vip/update-vip',
  ASSET_URL = '/vip/count/query-asset/{vipId}',
  ASSET_LIST_URL = '/vip/query-asset-list/{vipId}',
}

const IdStr = '{vipId}';

/**
 * 获取会员列表
 * @param params 搜索参数
 * @returns 会员列表
 */
export const reqVipList = (params: SearchParams) => get(API.LIST_URL, params);

/**
 * 获取会员详情
 * @param id 会员id
 * @returns 会员详情
 */
export const reqVipInfo = (id: number) => get(API.INFO_URL, { id });

/**
 * 添加会员
 * @param data 会员数据
 * @returns 添加结果
 */
export const reqAddVip = (data = {}) => post(API.ADD_URL, data);

/**
 * 更新会员
 * @param data 会员数据
 * @returns 更新结果
 */
export const reqUpdateVip = (data = {}) => put(API.UPDATE_URL, data);

/**
 * 获取会员资产
 * @param vipId 会员id
 * @returns 会员资产
 */
export const reqVipAsset = (vipId: number) => get(API.ASSET_URL.replace(IdStr, vipId.toString()));

/**
 * 获取会员资产列表
 * @param vipId 会员id
 * @returns 会员资产列表
 */
export const reqVipAssetList = (vipId: number) => get(API.ASSET_LIST_URL.replace(IdStr, vipId.toString()));

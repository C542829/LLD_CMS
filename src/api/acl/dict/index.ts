import { get, post, put } from '@/utils/request';
import * as Types from './types';

export { Types };

enum API {
  /** 获取字典列表 */
  LIST_URL = '/system/dict/query-list',
  /** 新增字典类型 */
  ADD_URL = '/system/dict/add-type',
  /** 修改字典类型 */
  UPDATE_URL = '/system/dict/update-type',
  /** 删除字典类型 */
  DEL_URL = '/system/dict/delete-type',

  /** 根据字典类型编码查询字典项 */
  ITEM_LIST_URL = '/system/dict/query-items-by-code',
  /** 新增字典项 */
  ITEM_ADD_URL = '/system/dict/add-item',
  /** 修改字典项 */
  ITEM_UPDATE_URL = '/system/dict/update-item',
  /** 删除字典项 */
  ITEM_DEL_URL = '/system/dict/delete-item',

  /** 根据多个字典类型编码批量查询字典项 */
  ITEM_BY_CODES = '/system/dict/query-items-by-codes',
}

/**
 * 获取字典类型列表
 * @param params 查询参数
 * @returns 字典列表
 */
export const reqDictList = (params: Types.DictTypeQueryDTO = {}): ApiResponse<Types.DictTypeVO[]> =>
  get(API.LIST_URL, params);

/**
 * 新增字典类型
 * @param data 字典数据
 * @returns 新增结果
 */
export const reqAddDict = (data: Types.DictTypeCreateDTO): ApiResponse<any> => post(API.ADD_URL, data);

/**
 * 更新字典类型
 * @param data 字典数据
 * @returns 更新结果
 */
export const reqUpdateDict = (data: Types.DictTypeUpdateDTO): ApiResponse<any> => put(API.UPDATE_URL, data);

/**
 * 删除字典类型
 * @param dictTypeId 字典类型ID
 * @returns 删除结果
 */
export const reqDelDict = (dictTypeId: number): ApiResponse<any> =>
  put(API.DEL_URL, { dictTypeId }, { form_urlencoded: true });

/**
 * 获取字典项列表
 * @param dictCode 字典编码
 * @returns 字典项列表
 */
export const reqDictItemList = (dictCode: string): ApiResponse<Types.DictItemVO[]> =>
  get(API.ITEM_LIST_URL, { dictCode });

/**
 * 新增字典项
 * @param data 字典项数据
 * @returns 新增结果
 */
export const reqAddDictItem = (data: Types.DictItemCreateDTO): ApiResponse<any> => post(API.ITEM_ADD_URL, data);

/**
 * 更新字典项
 * @param data 字典项数据
 * @returns 更新结果
 */
export const reqUpdateDictItem = (data: Types.DictItemUpdateDTO): ApiResponse<any> => put(API.ITEM_UPDATE_URL, data);

/**
 * 删除字典项
 * @param itemId 字典项ID
 * @returns 删除结果
 */
export const reqDelDictItem = (itemId: number): ApiResponse<any> =>
  put(API.ITEM_DEL_URL, { itemId }, { form_urlencoded: true });

/**
 * 根据多个字典类型编码批量查询字典项
 * @param dictCodes 字典编码
 * @returns 字典项列表
 */
export const reqDictItemListByCodes = (dictCodes: string[]): ApiResponse<Record<string, Types.DictItemVO[]>> =>
  get(API.ITEM_BY_CODES, { dictCodes });

import { get, post, put } from '@/utils/request';
import * as Types from './types';

export { Types };

enum API {
  LIST_URL = '/system/dict/query-list',
  ADD_URL = '/system/dict/add-type',
  UPDATE_URL = '/system/dict/update-type',
  DEL_URL = '/system/dict/delete-type',
  /** 根据字典类型编码查询字典项 */
  ITEM_LIST_URL = '/system/dict/query-items-by-code',
  ITEM_ADD_URL = '/system/dict/add-item',
  ITEM_UPDATE_URL = '/system/dict/update-item',
  ITEM_DEL_URL = '/system/dict/delete-item',
}

/**
 * 获取字典列表
 * @param params 查询参数
 * @returns 字典列表
 */
export const reqDictList = (params: Types.DictTypeQueryDTO = {}): ApiResponse<Types.DictTypeVO[]> =>
  get(API.LIST_URL, params);

/**
 * 新增字典
 * @param data 字典数据
 * @returns 新增结果
 */
export const reqAddDict = (data: Types.DictTypeCreateDTO): ApiResponse<any> => post(API.ADD_URL, data);

/**
 * 更新字典
 * @param data 字典数据
 * @returns 更新结果
 */
export const reqUpdateDict = (data: Types.DictTypeUpdateDTO): ApiResponse<any> => put(API.UPDATE_URL, data);

/**
 * 删除字典
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

import { get, post, put } from '@/utils/request';
import * as Types from './type';
import { Status } from '@/enums/index';

export { Types };

enum API {
  /** 获取服务产品列表 */
  LIST_URL = '/server/product/query-list',
  /** 根据服务产品id查询详细信息 */
  INFO_URL = '/server/product/query-info',
  /** 添加服务产品 */
  ADD_URL = '/server/product/add-product',
  /** 更新服务产品 */
  UPDATE_URL = '/server/product/update-product',
  /** 更新产品状态 */
  UPDATE_STATUS_URL = '/server/product/update-status',
}

/**
 * 获取服务产品列表
 * @param params
 * @returns
 */
export const reqProductList = (
  params: Types.ReqParams = {
    keyWord: '',
    productStatus: Status.enabled,
  },
): ApiResponse<Types.ProductInfoVO[]> => get(API.LIST_URL, params);

/**
 * 根据服务产品id查询详细信息
 * @param id 产品ID
 * @returns
 */
export const reqProductInfo = (id: number): ApiResponse<Types.ProductInfoVO> => get(API.INFO_URL, { id });

/**
 * 添加服务产品
 * @param data
 * @returns
 */
export const reqAddProduct = (data: Types.ProductDTO): ApiResponse<any> => post(API.ADD_URL, data);

/**
 * 更新服务产品
 * @param data
 * @returns
 */
export const reqUpdateProduct = (data: Types.ProductDTO): ApiResponse<any> => put(API.UPDATE_URL, data);

/**
 * 更新产品状态
 * @param data
 * @returns
 */
export const reqUpdateStatus = (data: Types.UpdateProductStatusDTO): ApiResponse<any> =>
  put(API.UPDATE_STATUS_URL, data, { form_urlencoded: true });

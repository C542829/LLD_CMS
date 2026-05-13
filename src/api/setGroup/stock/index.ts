import { get, post } from '@/utils/request';
import * as Types from './type';

export { Types };

enum API {
  IN_ADD_URL = '/stock/in-order/add-order',
  IN_LIST_URL = '/stock/in-order/query-page',
  IN_INFO_URL = '/stock/in-order/query-one/{orderCode}',
  OUT_ADD_URL = '/stock/out-order/add-order',
  OUT_LIST_URL = '/stock/out-order/query-page',
  OUT_INFO_URL = '/stock/out-order/query-one',
  LOG_URL = '/stock/log/query-page',
}

enum Path {
  ORDER_CODE = '{orderCode}',
}

/**
 * 入库
 * @param data 入库单信息
 * @returns
 */
export const reqInStockAdd = (data: Types.InStockAddRequest): ApiResponse<string> => post(API.IN_ADD_URL, data);

/**
 * 入库单列表
 * @param params 查询参数
 * @returns
 */
export const reqInStockList = (params: Types.SearchParams = {}): ApiResponse<PageListInfo<Types.StockInOrderVO>> =>
  post(API.IN_LIST_URL, params);

/**
 * 入库单详情
 * @param orderCode 入库单号
 * @returns
 */
export const reqInStockInfo = (orderCode: string): ApiResponse<Types.StockInOrderVO> =>
  get(API.IN_INFO_URL.replace(Path.ORDER_CODE, orderCode));

/**
 * 出库
 * @param data 出库单信息
 * @returns
 */
export const reqOutStockAdd = (data: Types.OutStockAddRequest): ApiResponse<string> => post(API.OUT_ADD_URL, data);

/**
 * 出库单列表
 * @param params 查询参数
 * @returns
 */
export const reqOutStockList = (params: Types.SearchParams = {}): ApiResponse<PageListInfo<Types.StockOutOrderVO>> =>
  post(API.OUT_LIST_URL, params);

/**
 * 出库单详情
 * @param params 查询参数
 * @returns
 */
export const reqOutStockInfo = (params: { orderCode: string }): ApiResponse<Types.StockOutOrderVO> =>
  get(API.OUT_INFO_URL, params);

/**
 * 库存日志列表
 * @param data 查询参数
 * @returns
 */
export const reqStockLogList = (data: Types.SearchParams = {}): ApiResponse<PageListInfo<Types.StockLogVO>> =>
  post(API.LOG_URL, data);

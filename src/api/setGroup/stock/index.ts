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

export const reqInStockAdd = (data: Types.InStockAddRequest): ApiResponse<string> => post(API.IN_ADD_URL, data);

export const reqInStockList = (params: Types.SearchParams = {}): ApiResponse<any> => post(API.IN_LIST_URL, params);

export const reqInStockInfo = (orderCode: string): ApiResponse<any> =>
  get(API.IN_INFO_URL.replace('{orderCode}', orderCode));

export const reqOutStockAdd = (data: Types.OutStockAddRequest): ApiResponse<string> => post(API.OUT_ADD_URL, data);

export const reqOutStockList = (params: Types.SearchParams = {}): ApiResponse<any> => post(API.OUT_LIST_URL, params);

export const reqOutStockInfo = (params: { orderCode: string }): ApiResponse<any> => get(API.OUT_INFO_URL, params);

export const reqStockLogList = (params: Types.SearchParams = {}): ApiResponse<any> => post(API.LOG_URL, params);

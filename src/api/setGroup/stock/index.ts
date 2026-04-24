import { get, post, put } from '@/utils/request';
import * as Types from './type';

export { Types };

enum API {
  /** 创建入库单 */
  IN_ADD_URL = '/stock/in-order/add-order',
  /** 获取入库订单分页列表 */
  IN_LIST_URL = '/stock/in-order/query-page',
  /** 根据订单编号获取入库订单详情 */
  IN_INFO_URL = '/stock/in-order/query-one/{orderCode}',
  /** 创建出库单 */
  OUT_ADD_URL = '/stock/out-order/add-order',
  /** 获取出库订单分页列表 */
  OUT_LIST_URL = '/stock/out-order/query-page',
  /** 根据订单编号获取出库订单详情 */
  OUT_INFO_URL = '/stock/out-order/query-one',
  /** 获取库存日志分页列表 */
  LOG_URL = '/stock/log/query-page',
}

/**
 * 新增入库单
 * @param data
 * @returns
 */
export const reqInStockAdd = (data = {}) => post(API.IN_ADD_URL, data);

/**
 * 入库单列表
 * @param params
 * @returns
 */
export const reqInStockList = (params = {}) => post(API.IN_LIST_URL, params);

/**
 * 入库单详情
 * @param orderCode
 * @returns
 */
export const reqInStockInfo = (orderCode: string) => get(API.IN_INFO_URL.replace('{orderCode}', orderCode));

/**
 * 新增出库单
 * @param data
 * @returns
 */
export const reqOutStockAdd = (data = {}) => post(API.OUT_ADD_URL, data);

/**
 * 出库单列表
 * @param params
 * @returns
 */
export const reqOutStockList = (params = {}) => post(API.OUT_LIST_URL, params);

/**
 * 出库单详情
 * @param orderCode
 * @returns
 */
export const reqOutStockInfo = (orderCode = {}) => get(API.OUT_INFO_URL, orderCode);

/**
 * 库存流水列表
 * @param params
 * @returns
 */
export const reqStockLogList = (params = {}) => post(API.LOG_URL, params);

import { get, post } from '@/utils/request';
import * as Types from './types';

export { Types };

enum API {
  /** 分页查询销售数据 */
  SALE_RECORD = '/order/page',
  /** 分页查询销售明细 */
  SALE_DETAIL = '/order/detail/page',
  /** 获取销售汇总 */
  SALE_SUMMARY = '/order/summary',
  /** 根据订单编号查询订单信息 */
  ORDER_INFO_BY_CODE = '/order/query-by-order-code/{orderCode}',
}

enum PathStr {
  orderId = '{orderId}',
  detailId = '{detailId}',
  orderCode = '{orderCode}',
  bedId = '{bedId}',
}

/**
 * 分页查询销售数据
 * @param params
 * @returns
 */
export const reqSaleRecord = (
  params: Types.SaleDataRequest = {} as any,
): ApiResponse<PageListInfo<Types.OrderInfoVO[]>> => post(API.SALE_RECORD, params);

/**
 * 分页查询销售明细
 * @param data
 * @returns
 */
export const reqSaleDetail = (data: Types.OrderDetailPageQuery): ApiResponse<PageListInfo<Types.OrderDetailVO[]>> =>
  post(API.SALE_DETAIL, data);

/**
 * 获取销售汇总
 * @param data
 * @returns
 */
export const reqSaleSummary = (data = {}): ApiResponse<Types.OrderSummaryVO[]> => post(API.SALE_SUMMARY, data);

/**
 * 根据订单编号查询订单信息
 * @param orderCode 订单号
 * @returns 订单详情
 */
export const reqOrderInfo = (orderCode: string): ApiResponse<Types.OrderInfoVO> => {
  return get(API.ORDER_INFO_BY_CODE.replace(PathStr.orderCode, orderCode));
};

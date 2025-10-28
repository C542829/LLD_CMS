import { get, post, put, del, ContentType } from '@/utils/request';

enum API {
  INFO_URL = '/order/query-by-id/{orderId}',
  ADD_URL = '/order/add-order',
  ADD_DETAIL_URL = '/order/add-detail/{orderId}',
  Settle_URL = '/order/settle-order/{orderId}',
  DELETE_DETAIL_URL = '/order/delete-detail/{detailId}',
  CANCEL_ORDER_URL = '/order/cancel-order/{orderId}',
  QUERY_ORDER_URL = '/order/query-by-order-code/{orderCode}',
}

export const reqOrderInfo = (orderId: number) => get(API.INFO_URL, { orderId });
export const reqAddOrder = (data = {}) => post(API.ADD_URL, data);
export const reqAddOrderDetail = (orderId: number, data = {}) =>
  post(API.ADD_DETAIL_URL.replace('{orderId}', orderId.toString()), data);
export const reqSettleOrder = (orderId: number, data = {}) =>
  put(API.Settle_URL.replace('{orderId}', orderId.toString()), data);
export const reqDeleteOrderDetail = (detailId: number) =>
  del(API.DELETE_DETAIL_URL.replace('{detailId}', detailId.toString()));
export const reqCancelOrder = (orderId: number) => put(API.CANCEL_ORDER_URL.replace('{orderId}', orderId.toString()));
export const reqQueryOrder = (orderCode: string) => get(API.QUERY_ORDER_URL.replace('{orderCode}', orderCode));

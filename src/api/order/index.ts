import { get, post, put, del } from '@/utils/request';
import * as Types from './types';

export { Types };

enum API {
  /** 根据ID查询订单详情 */
  INFO_URL = '/order/query-by-id/{orderId}',
  /** 开单 */
  ADD_URL = '/order/add-order',
  /** 添加订单明细 */
  ADD_DETAIL_URL = '/order/add-detail/{orderId}',
  /** 订单结算 */
  SETTLE_URL = '/order/settle-order',
  /** 删除订单明细 */
  DELETE_DETAIL_URL = '/order/delete-detail/{detailId}',
  /** 取消订单 */
  CANCEL_ORDER_URL = '/order/cancel-order/{orderId}',
  /** 查询订单 */
  QUERY_ORDER_BY_CODE_URL = '/order/query-by-order-code/{orderCode}',
  /** 根据床位ID查询订单详情 */
  QUERY_ORDER_BY_BED_ID_URL = '/order/query-by-bed-id/{bedId}',
  /** 订单冲正 */
  ORDER_RECONCILE = '/order/reconcile-order',
  /** 订单冲正 */
  ORDER_ROLL_BACK = '/order/roll-back',
  /** 修改上钟类型 */
  UPDATE_SERVER_TYPE = '/order/update-server-type/{detailId}',
  /** 修改服务技师 */
  UPDATE_SERVER_EMPLOYEE = '/order/update-server-employee/{detailId}',
  /** 开始计时 */
  TIMER_START = '/order/detail/timer/start/{detailId}',
  /** 暂停计时 */
  TIMER_PAUSE = '/order/detail/timer/pause/{detailId}',
  /** 恢复计时 */
  TIMER_RESUME = '/order/detail/timer/resume/{detailId}',
  /** 停止计时 */
  TIMER_STOP = '/order/detail/timer/stop/{detailId}',
}

enum PathStr {
  orderId = '{orderId}',
  detailId = '{detailId}',
  orderCode = '{orderCode}',
  bedId = '{bedId}',
}

/**
 * 查询订单详情
 * @param orderId 订单ID
 * @returns 订单详情
 */
export const reqOrderInfo = (orderId: number): ApiResponse<Types.OrderInfoVO> => {
  return get(API.INFO_URL, { orderId });
};

/**
 * 添加订单
 * @param data 订单数据
 * @returns 订单ID
 */
export const reqAddOrder = (data: Types.OrderCreateDTO = {} as Types.OrderCreateDTO): ApiResponse<any> => {
  return post(API.ADD_URL, data);
};

/**
 * 添加订单明细
 * @param orderId 订单ID
 * @param data 订单明细数据
 * @returns 订单明细ID
 */
export const reqAddOrderDetail = (
  orderId: number,
  data: Types.OrderDetailSettleDTO = {} as Types.OrderDetailSettleDTO,
): ApiResponse<any> => {
  return post(API.ADD_DETAIL_URL.replace(PathStr.orderId, orderId.toString()), data);
};

/**
 * 订单结算
 * @param data 订单结算数据
 * @returns 订单ID
 */
export const reqSettleOrder = (data: Types.OrderSettleDTO): ApiResponse<any> => {
  return post(API.SETTLE_URL, data);
};

/**
 * 删除订单明细
 * @param detailId 订单明细ID
 * @returns 订单明细ID
 */
export const reqDeleteOrderDetail = (detailId: number): ApiResponse<any> => {
  return del(API.DELETE_DETAIL_URL.replace(PathStr.detailId, detailId.toString()));
};

/**
 * 取消订单
 * @param orderId 订单ID
 * @returns 订单ID
 */
export const reqCancelOrder = (orderId: number): ApiResponse<any> => {
  return put(API.CANCEL_ORDER_URL.replace(PathStr.orderId, orderId.toString()));
};

/**
 * 查询订单
 * @param orderCode 订单号
 * @returns 订单详情
 */
export const reqQueryOrder = (orderCode: string): ApiResponse<Types.OrderInfoVO> => {
  return get(API.QUERY_ORDER_BY_CODE_URL.replace(PathStr.orderCode, orderCode));
};

/**
 * 查询订单详情
 * @param bedId 床位ID
 * @returns 订单详情
 */
export const reqQueryOrderByBedId = (bedId: number): ApiResponse<Types.OrderInfoVO> => {
  return get(API.QUERY_ORDER_BY_BED_ID_URL.replace(PathStr.bedId, bedId.toString()));
};

/**
 * 订单冲正
 * @param orderId 订单ID
 * @param reason 冲正原因
 * @returns
 */
export const reqRollBackOrder = (orderId: string, reason: string): ApiResponse<any> => {
  return post(API.ORDER_ROLL_BACK, { orderId, reason });
};

/**
 * 订单对单
 * @param orderId 订单ID
 * @param remark 备注
 * @returns
 */
export const reqReconcileOrder = (orderId: string, remark: string): ApiResponse<any> => {
  return post(API.ORDER_RECONCILE, { orderId, remark });
};

/**
 * 修改上钟类型
 * @param detailId 订单明细ID
 * @param serverType 上钟类型
 * @returns
 */
export const reqUpdateServerType = (detailId: number, serverType: number): ApiResponse<any> => {
  const api = API.UPDATE_SERVER_TYPE.replace(PathStr.detailId, detailId.toString());
  return put(api, {}, { params: { serverType } });
};

/**
 * 修改服务技师
 * @param detailId 订单明细ID
 * @param params 技师参数
 * @returns
 */
export const reqUpdateServerEmployee = (detailId: number, data: Types.OrderDetailTechnicianDTO[]): ApiResponse<any> => {
  const api = API.UPDATE_SERVER_EMPLOYEE.replace(PathStr.detailId, detailId.toString());
  return put(api, data);
};

/**
 * 开始计时
 * @param detailId 订单明细ID
 * @returns
 */
export const reqTimerStart = (detailId: number): ApiResponse<string> => {
  return post(API.TIMER_START.replace(PathStr.detailId, detailId.toString()));
};

/**
 * 暂停计时
 * @param detailId 订单明细ID
 * @returns
 */
export const reqTimerPause = (detailId: number): ApiResponse<string> => {
  return post(API.TIMER_PAUSE.replace(PathStr.detailId, detailId.toString()));
};

/**
 * 恢复计时
 * @param detailId 订单明细ID
 * @returns
 */
export const reqTimerResume = (detailId: number): ApiResponse<string> => {
  return post(API.TIMER_RESUME.replace(PathStr.detailId, detailId.toString()));
};

/**
 * 停止计时
 * @param detailId 订单明细ID
 * @returns
 */
export const reqTimerStop = (detailId: number): ApiResponse<string> => {
  return post(API.TIMER_STOP.replace(PathStr.detailId, detailId.toString()));
};

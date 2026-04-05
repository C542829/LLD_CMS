import { get, post, put } from '@/utils/request';
import * as Types from './types';

export { Types };

// 优惠券管理模块接口地址
enum API {
  LIST_URL = '/vip/ticket/ticket-list',
  ADD_URL = '/vip/ticket/add-ticket',
  UPDATE_URL = '/vip/ticket/update-ticket',
  UPDATE_STATUS_URL = '/vip/ticket/update-status',
  /** 分页查询会员优惠券明细 */
  COUNT_URL = '/vip/ticket/count-ticket',
}

export const reqTicketList = (params = {}) => get(API.LIST_URL, params, { addOrgId: true });

export const reqAddTicket = (data = {}) => post(API.ADD_URL, data);

export const reqUpdateTicket = (data = {}) => put(API.UPDATE_URL, data);

export const reqUpdateTicketStatus = (data = {}) => put(API.UPDATE_STATUS_URL, data, { form_urlencoded: true });

/**
 * 分页查询会员优惠券明细
 * @param params 分页查询会员优惠券明细请求参数
 */
export const reqCountTicket = (params: Types.TicketListRequest): ApiResponse<PageListInfo<Types.TicketCountVO[]>> =>
  get(API.COUNT_URL, params);

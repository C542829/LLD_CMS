import { get, post, put } from '@/utils/request';
import * as Types from './types';

export { Types };

/** 优惠券管理模块接口地址 */
enum API {
  /** 优惠券列表 */
  LIST_URL = '/vip/ticket/ticket-list',
  /** 添加优惠券 */
  ADD_URL = '/vip/ticket/add-ticket',
  /** 修改优惠券 */
  UPDATE_URL = '/vip/ticket/update-ticket',
  /** 修改优惠券状态 */
  UPDATE_STATUS_URL = '/vip/ticket/update-status',
  /** 根据优惠券id查询详细信息 */
  QUERY_INFO = '/vip/ticket/ticket-info',
  /** 分页查询会员优惠券明细 */
  COUNT_URL = '/vip/ticket/count-ticket',
  /** 查询会员项目券剩余次数 */
  TICKET_REMAINING = '/vip/ticket/remaining',
}

/**
 * 查询会员优惠券列表
 * @param params 查询参数
 * @returns
 */
export const reqTicketList = (params: Types.SearchTicketParams = { ticketStatus: 0 }): ApiResponse<Types.TicketVO[]> =>
  get(API.LIST_URL, params, { addOrgId: true });

/**
 * 修改优惠券状态
 * @param data 修改优惠券状态请求参数
 * @returns
 */
export const reqTicketById = (id: number): ApiResponse<Types.TicketVO> => get(API.QUERY_INFO, { id });

/**
 * 添加优惠券
 * @param data
 * @returns
 */
export const reqAddTicket = (data: Types.VipTicketDTO): ApiResponse<string> => post(API.ADD_URL, data);

/**
 * 修改优惠券
 * @param data
 * @returns
 */
export const reqUpdateTicket = (data: Types.VipTicketDTO): ApiResponse<string> => put(API.UPDATE_URL, data);

/**
 * 修改优惠券状态
 * @param data 修改优惠券状态请求参数
 * @returns
 */
export const reqUpdateTicketStatus = (id: number, status: number): ApiResponse<string> =>
  put(API.UPDATE_STATUS_URL, { id, status }, { form_urlencoded: true });

/**
 * 分页查询会员优惠券明细
 * @param params 分页查询会员优惠券明细请求参数
 */
export const reqCountTicket = (params: Types.TicketListRequest): ApiResponse<PageListInfo<Types.TicketVO[]>> =>
  get(API.COUNT_URL, params);

import { get, post, put, del } from '@/utils/request';

// 优惠券管理模块接口地址
enum API {
  LIST_URL = '/vip/ticket/ticket-list',
  INFO_URL = '/vip/ticket/ticket-info',
  ADD_URL = '/vip/ticket/add-ticket',
  UPDATE_URL = '/server/product/update-product',
}

// 产品管理模块接口方法
export const reqTicketList = (params = {}) => get(API.LIST_URL, params);

export const reqAddTicket = (data = {}) => post(API.ADD_URL, data);

export const reqUpdateTicket = (data = {}) => put(API.UPDATE_URL, data);

import { get, post, put, del } from '@/utils/request';

enum API {
  SALE_RECORD = '/order/page',
  SALE_DETAIL = '/order/detail/page',
  SALE_SUMMARY = '/order/summary',
}

export const reqSaleRecord = (params = {}) => post(API.SALE_RECORD, params);

export const reqSaleDetail = (data = {}) => post(API.SALE_DETAIL, data);

export const reqSaleSummary = (data = {}) => post(API.SALE_SUMMARY, data);

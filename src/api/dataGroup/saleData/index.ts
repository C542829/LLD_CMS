import { get, post, put, del } from '@/utils/request';

enum API {
  SALE_RECORD = '',
  SALE_DETAIL = '',
  SALE_SUMMARY = '',
}

export const reqSaleRecord = (params = {}) => get(API.SALE_RECORD, params);

export const reqSaleDetail = (data = {}) => post(API.SALE_DETAIL, data);

export const reqSaleSummary = (data = {}) => put(API.SALE_SUMMARY, data);

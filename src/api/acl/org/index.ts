import { get, post, put, ContentType } from '@/utils/request';
import { Org } from './type';

//枚举地址
enum API {
  LIST_URL = '/system/org/query-list',
  LIST_ONE_URL = '/system/org/query-one',
  ADD_URL = '/system/org/add-org',
  UPDATE_URL = '/system/org/update-org',
  UPDATE_STATUS_URL = '/system/org/update-org-status',
}

export const reqList = (params: any) => get(API.LIST_URL, params);

export const reqListOne = (id: number) => get(API.LIST_ONE_URL, { id });

export const reqAdd = (data: Org) => post(API.ADD_URL, data);

export const reqUpdate = (data: Org) => put(API.UPDATE_URL, data);

export const reqUpdateStatus = (params: any) => put(API.UPDATE_STATUS_URL, params, ContentType.URLencoded);

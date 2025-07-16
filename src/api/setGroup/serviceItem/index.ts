import { get, post, put, del } from '@/utils/request';

enum API {
  LIST_URL = '/server/item/query-list',
  INFO_URL = '/server/item/query-info',
  ADD_URL = '/server/item/add-item',
  UPDATE_URL = '/server/item/update-item',
}

export const reqItemList = (params = {}) => get(API.LIST_URL, params);

export const reqItemInfo = (params = {}) => get(API.INFO_URL, params);

export const reqAddItem = (data = {}) => post(API.ADD_URL, data);

export const reqUpdateItem = (data = {}) => put(API.UPDATE_URL, data);

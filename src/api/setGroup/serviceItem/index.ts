import { get, post, put } from '@/utils/request';
import * as Types from './types';

export { Types };

enum API {
  LIST_URL = '/server/item/query-list',
  INFO_URL = '/server/item/query-info',
  ADD_URL = '/server/item/add-item',
  UPDATE_URL = '/server/item/update-item',
  UPDATE_STATUS_URL = '/server/item/update-status',
}

/**
 * 查询服务项目列表
 */
export const reqServiceItemList = (
  params: Types.ServerItemRequest = {
    itemStatus: 0,
  },
): ApiResponse<Types.ServerItemVO[]> => get(API.LIST_URL, params, { addOrgId: true });

export const reqServiceItemInfo = (id: number) => get(API.INFO_URL, { id });

export const reqAddServiceItem = (data = {}) => post(API.ADD_URL, data);

export const reqUpdateServiceItem = (data = {}) => put(API.UPDATE_URL, data);

export const reqUpdateServiceItemStatus = (data = {}) => put(API.UPDATE_STATUS_URL, data, { form_urlencoded: true });

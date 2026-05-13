import { get, post, put } from '@/utils/request';
import * as Types from './types';

export { Types };

enum API {
  // 房间
  LIST_URL = '/room/list',
  ADD_URL = '/room/add',
  UPDATE_URL = '/room/update',

  // 床位
  BED_LIST_ALL = '/room/bed/query-all',
  BED_LIST = '/room/bed/list',
  BED_ADD = '/room/bed/add',
  BED_UPDATE = '/room/bed/update-name',
  BED_UPDATE_STATUS = '/room/bed/update-status',
}

// 房间管理
export const reqRoomList = (): ApiResponse<Types.RoomInfoVO[]> => get(API.LIST_URL);

export const reqAddRoom = (data: Types.RoomCreateDTO): ApiResponse<string> => post(API.ADD_URL, data);

export const reqUpdateRoom = (data: Types.RoomUpdateDTO): ApiResponse<string> => put(API.UPDATE_URL, data);

// 床位管理
export const reqBedListAll = (): ApiResponse<Types.RoomBedVO[]> => get(API.BED_LIST_ALL);

export const reqBedList = (params: Types.BedQueryParams): ApiResponse<Types.RoomBedVO[]> => get(API.BED_LIST, params);

export const reqAddBed = (data: Types.BedCreateDTO): ApiResponse<string> => post(API.BED_ADD, data);

export const reqUpdateBed = (data: Types.UpdateBedNameDTO): ApiResponse<string> =>
  put(API.BED_UPDATE, data, { form_urlencoded: true });

export const reqUpdateBedStatus = (data: Types.UpdateBedStatusDTO): ApiResponse<string> =>
  put(API.BED_UPDATE_STATUS, data, { form_urlencoded: true });

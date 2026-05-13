import { get, post, put } from '@/utils/request';
import * as Types from './types';

export { Types };

enum API {
  LIST_URL = '/server/cureTicket/query-list',
  INFO_URL = '/server/cureTicket/query-info',
  ADD_URL = '/server/cureTicket/add-cureTicket',
  UPDATE_URL = '/server/cureTicket/update-cureTicket',
  UPDATE_STATUS = '/server/cureTicket/update-status',
}

export const reqTreatmentCouponList = (params: Types.CureTicketQueryParams = {}): ApiResponse<Types.CureTicketVO[]> =>
  get(API.LIST_URL, params, { addOrgId: true });

export const reqTreatmentCouponInfo = (params: { id: number }): ApiResponse<Types.CureTicketVO> =>
  get(API.INFO_URL, params);

export const reqAddTreatmentCoupon = (data: Types.CureTicketCreateDTO): ApiResponse<string> => post(API.ADD_URL, data);

export const reqUpdateTreatmentCoupon = (data: Types.CureTicketUpdateDTO): ApiResponse<string> =>
  put(API.UPDATE_URL, data);

export const reqUpdateTreatmentCouponStatus = (data: Types.UpdateCureTicketStatusDTO): ApiResponse<string> =>
  put(API.UPDATE_STATUS, data);

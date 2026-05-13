import { get, post, put } from '@/utils/request';
import * as Types from './types';

export { Types };

enum API {
  LIST_URL = '/server/package/query-list',
  INFO_URL = '/server/package/query-info',
  ADD_URL = '/server/package/add-package',
  UPDATE_URL = '/server/package/update-package',
}

export const reqPackageList = (params: Types.PackageQueryParams = {}): ApiResponse<Types.PackageListVO[]> =>
  get(API.LIST_URL, params);

export const reqPackageInfo = (params: { id: number }): ApiResponse<Types.PackageInfoVO> => get(API.INFO_URL, params);

export const reqAddPackage = (data: Types.PackageInfoDTO): ApiResponse<string> => post(API.ADD_URL, data);

export const reqUpdatePackage = (data: Types.PackageInfoDTO): ApiResponse<string> => put(API.UPDATE_URL, data);

import { post } from '@/utils/request';
import type { LiabilityQuery, LiabilityVO } from './types';

enum API {
  QUERY_LIABILITY = '/vip/count/query-liability',
}

/** 负债统计查询 */
export const reqLiability = (params?: LiabilityQuery): ApiResponse<LiabilityVO> =>
  post(API.QUERY_LIABILITY, params || {});

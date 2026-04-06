import { get, post } from '@/utils/request';
import * as Types from './types';

export { Types };

enum API {
  /** 获取绩效列表 */
  PERFORMANCE_RECORD = '/kpi/list',
  /** 获取绩效汇总 */
  PERFORMANCE_SUMMARY = '/kpi/summary',
}

/**
 * 获取绩效列表
 * @param data
 * @returns
 */
export const reqPerformanceRecord = (data: Types.KpiListQuery): ApiResponse<PageListInfo<Types.KpiListVO[]>> =>
  post(API.PERFORMANCE_RECORD, data);

/**
 * 获取绩效汇总
 * @param data
 * @returns
 */
export const reqPerformanceSummary = (data: Types.KpiSummaryQuery): ApiResponse<Types.KpiSummaryVO[]> =>
  post(API.PERFORMANCE_SUMMARY, data);

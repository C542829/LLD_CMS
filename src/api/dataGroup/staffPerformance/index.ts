import { get, post, put, del } from '@/utils/request';

enum API {
  PERFORMANCE_RECORD = '',
  PERFORMANCE_SUMMARY = '',
}

export const reqPerformanceRecord = (data = {}) => post(API.PERFORMANCE_RECORD, data);

export const reqPerformanceSummary = (data = {}) => put(API.PERFORMANCE_SUMMARY, data);

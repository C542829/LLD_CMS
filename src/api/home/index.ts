import { post, get } from '@/utils/request';
import * as Types from './types';

export { Types };

enum API {
  /** 营业额概览（含支付方式分布） */
  REVENUE_SUMMARY = '/data-view/revenue-summary',
  /** 会员统计 */
  MEMBER_STATS = '/data-view/member-stats',
  /** 充值明细统计（日记单-充值） */
  RECHARGE_DETAIL = '/data-view/recharge-detail',
  /** 产品销售统计（日记单-产品销售） */
  PRODUCT_SALES = '/data-view/product-sales',
  /** 服务项目统计（日记单-服务项目） */
  SERVICE_STATS = '/data-view/service-stats',
  /** 技师业绩排行 */
  TECHNICIAN_RANKING = '/data-view/technician-ranking',
  /** 劳动业绩统计（排除充值和疗程券） */
  LABOR_PERFORMANCE = '/data-view/labor-performance',
  /** 疗程券销售统计（日记单-疗程券销售） */
  CURE_TICKET_SALES = '/data-view/cure-ticket-sales',
}

/**
 * 获取营业额概览数据
 * @param data 查询参数
 * @returns 营业额概览数据
 */
export const reqRevenueSummary = (data: Types.DataViewQuery): ApiResponse<Types.RevenueSummaryVO> =>
  post(API.REVENUE_SUMMARY, data);

/**
 * 获取会员统计数据
 * @param data 查询参数
 * @returns 会员统计数据
 */
export const reqMemberStats = (data: Types.DataViewQuery): ApiResponse<Types.MemberStatsVO> =>
  post(API.MEMBER_STATS, data);

/**
 * 获取会员统计数据
 * @param data 查询参数
 * @returns 充值明细统计数据
 */
export const reqRechargeDetail = (data: Types.DataViewQuery): ApiResponse<Types.RechargeDetailVO> =>
  post(API.RECHARGE_DETAIL, data);

/**

/**
 * 获取产品销售统计数据
 * @param data 查询参数
 * @returns 产品销售统计数据
 */
export const reqProductSales = (data: Types.DataViewQuery): ApiResponse<Types.ProductSalesVO> =>
  post(API.PRODUCT_SALES, data);

/**
 * 获取服务项目统计数据
 * @param data 查询参数
 * @returns 服务项目统计数据
 */
export const reqServiceStats = (data: Types.DataViewQuery): ApiResponse<Types.ServiceStatsVO> =>
  post(API.SERVICE_STATS, data);

/**
 * 获取技师业绩排行
 * @param data 查询参数
 * @returns 技师业绩排行数据
 */
export const reqTechnicianRanking = (data: Types.DataViewQuery): ApiResponse<Types.TechnicianRankingVO> =>
  post(API.TECHNICIAN_RANKING, data);

/**
 * 劳动业绩统计（排除充值和疗程券）
 * @param data 查询参数
 * @returns 劳动业绩统计数据
 */
export const reqLaborPerformance = (data: Types.DataViewQuery): ApiResponse<Types.LaborPerformanceVO> =>
  post(API.LABOR_PERFORMANCE, data);

/**
 * 劳动业绩统计（排除充值和疗程券）
 * @param data 查询参数
 * @returns 劳动业绩统计数据
 */
export const reqCureTicketSales = (data: Types.DataViewQuery): ApiResponse<Types.CureTicketSalesVO> =>
  post(API.CURE_TICKET_SALES, data);

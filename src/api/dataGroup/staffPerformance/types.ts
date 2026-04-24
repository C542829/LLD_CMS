//#region 绩效列表

/**
 * KpiListQuery
 */
export interface KpiListQuery {
  /**
   * 开始时间（格式：YYYY-MM-DD HH:mm:ss，左闭右开区间）
   */
  startTime?: string;
  /**
   * 结束时间（格式：YYYY-MM-DD HH:mm:ss，左闭右开区间）
   */
  endTime?: string;
  /**
   * 门店ID列表，不传则查全部关联门店
   */
  orgIds?: number[];
  /**
   * 分页页码 (默认 1)
   */
  pageNum: number;
  /**
   * 分页大小 (默认 20, 最大 100)
   */
  pageSize: number;
  /**
   * 服务编码
   */
  serviceCode?: string;
  /**
   * 员工姓名
   */
  username?: string;
  [property: string]: any;
}

/**
 * org.haut.common.domain.vo.kpi.KpiListVO
 *
 * KpiListVO
 */
export interface KpiListVO {
  /**
   * 提成
   */
  Commission?: number;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * ID
   */
  id?: number;
  /**
   * 上钟类型
   */
  itemType?: number;
  /**
   * 订单/充值记录编号
   */
  orderCode?: string;
  /**
   * 门店编码
   */
  orgCode?: string;
  /**
   * 门店ID
   */
  orgId?: number;
  /**
   * 所属机构
   */
  orgName?: string;
  /**
   * 业绩金额
   */
  performance?: number;
  /**
   * 数量
   */
  quantity?: number;
  /**
   * 项目编号
   */
  serviceCode?: string;
  /**
   * 项目名称
   */
  serviceName?: string;
  /**
   * 业务类型
   */
  bizType?: number;
  /**
   * 员工姓名
   */
  userName?: string;
  [property: string]: any;
}

//#endregion 绩效列表

//#region 绩效汇总

/**
 * KpiSummaryQuery
 */
export interface KpiSummaryQuery {
  /**
   * 开始时间（格式：YYYY-MM-DD HH:mm:ss，左闭右开区间）
   */
  startTime?: string;
  /**
   * 结束时间（格式：YYYY-MM-DD HH:mm:ss，左闭右开区间）
   */
  endTime?: string;
  /**
   * 门店ID列表，不传则查全部关联门店
   */
  orgIds?: number[];
  /**
   * 员工id
   */
  userId?: number;
  [property: string]: any;
}

/**
 * KPI业绩汇总VO
 *
 * KpiSummaryVO
 */
export interface KpiSummaryVO {
  /**
   * 点钟次数
   */
  appointmentCount?: number;
  /**
   * 疗程销售提成
   */
  cureTicketCommission?: number;
  /**
   * 疗程销售业绩
   */
  cureTicketPerformance?: number;
  /**
   * 加钟次数
   */
  extendCount?: number;
  /**
   * 门店编码
   */
  orgCode?: string;
  /**
   * 门店ID
   */
  orgId?: number;
  /**
   * 门店名称
   */
  orgName?: string;
  /**
   * 产品提成
   */
  productCommission?: number;
  /**
   * 产品业绩
   */
  productPerformance?: number;
  /**
   * 项目提成
   */
  projectCommission?: number;
  /**
   * 项目业绩
   */
  projectPerformance?: number;
  /**
   * 卡金提成
   */
  rechargeCommission?: number;
  /**
   * 卡金业绩
   */
  rechargePerformance?: number;
  /**
   * 轮牌次数
   */
  rotationCount?: number;
  /**
   * 总提成
   */
  totalCommission?: number;
  /**
   * 总业绩
   */
  totalPerformance?: number;
  /**
   * 总项目次数
   */
  totalProjectCount?: number;
  /**
   * 技师ID
   */
  userId?: number;
  /**
   * 技师姓名
   */
  userName?: string;
  [property: string]: any;
}

//#endregion 绩效汇总

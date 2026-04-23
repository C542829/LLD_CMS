/**
 * org.haut.common.domain.query.dataview.DataViewQuery
 */
export interface DataViewQuery {
  /**
   * 结束日期
   */
  endTime?: string;
  /**
   * 门店ID列表，不传则查全部关联门店
   */
  orgIds?: number[];
  /**
   * 开始日期
   */
  startTime?: string;
  [property: string]: any;
}

/**
 * 数据对象
 *
 * org.haut.common.domain.vo.dataview.RevenueSummaryVO
 */
export interface RevenueSummaryVO {
  /**
   * 客单价
   */
  avgOrderAmount?: number;
  /**
   * 现金支付金额
   */
  cashPayment?: number;
  /**
   * 抖音支付金额
   */
  douyinPayment?: number;
  /**
   * 美团支付金额
   */
  meituanPayment?: number;
  /**
   * 会员卡支付金额
   */
  memberCardPayment?: number;
  /**
   * 订单数
   */
  orderCount?: number;
  /**
   * POS支付金额
   */
  posPayment?: number;
  /**
   * 扫码支付金额
   */
  qrPayment?: number;
  /**
   * 代金券支付金额
   */
  ticketConsumerPayment?: number;
  /**
   * 项目券支付金额
   */
  ticketItemPayment?: number;
  /**
   * 总实收（排除会员卡+券）
   */
  totalActualReceipt?: number;
  /**
   * 总营业额（支付汇总）
   */
  totalTurnover?: number;
  [property: string]: any;
}

/**
 * 数据对象
 *
 * org.haut.common.domain.vo.dataview.MemberStatsVO
 */
export interface MemberStatsVO {
  /**
   * 会员消费占比(%)
   */
  memberConsumptionRatio?: number;
  /**
   * 会员消费订单数
   */
  memberOrderCount?: number;
  /**
   * 新增会员数
   */
  newMembers?: number;
  /**
   * 会员卡余额总额
   */
  totalBalance?: number;
  /**
   * 总会员数
   */
  totalMembers?: number;
  [property: string]: any;
}

/**
 * 数据对象
 *
 * org.haut.common.domain.vo.dataview.RechargeDetailVO
 */
export interface RechargeDetailVO {
  /**
   * 充值明细列表
   */
  items?: RechargeItem[];
  /**
   * 合计金额
   */
  totalAmount?: number;
  /**
   * 合计数量
   */
  totalQuantity?: number;
  [property: string]: any;
}

/**
 * org.haut.common.domain.vo.dataview.RechargeDetailVO.RechargeItem
 */
export interface RechargeItem {
  /**
   * 充值金额
   */
  amount?: number;
  /**
   * 充值活动名称
   */
  name?: string;
  /**
   * 充值次数
   */
  quantity?: number;
  [property: string]: any;
}

/**
 * 数据对象
 *
 * org.haut.common.domain.vo.dataview.ProductSalesVO
 */
export interface ProductSalesVO {
  /**
   * 产品销售列表
   */
  items?: ProductItem[];
  /**
   * 合计金额
   */
  totalAmount?: number;
  /**
   * 合计数量
   */
  totalQuantity?: number;
  [property: string]: any;
}

/**
 * org.haut.common.domain.vo.dataview.ProductSalesVO.ProductItem
 */
export interface ProductItem {
  /**
   * 销售金额
   */
  amount?: number;
  /**
   * 产品名称
   */
  name?: string;
  /**
   * 销售数量
   */
  quantity?: number;
  [property: string]: any;
}

/**
 * 数据对象
 *
 * org.haut.common.domain.vo.dataview.ServiceStatsVO
 */
export interface ServiceStatsVO {
  /**
   * 服务项目列表
   */
  items?: ServiceItem[];
  /**
   * 总加钟数
   */
  totalAdd?: number;
  /**
   * 合计金额
   */
  totalAmount?: number;
  /**
   * 总点钟数
   */
  totalDesignated?: number;
  /**
   * 总轮钟数
   */
  totalRotation?: number;
  [property: string]: any;
}

/**
 * org.haut.common.domain.vo.dataview.ServiceStatsVO.ServiceItem
 */
export interface ServiceItem {
  /**
   * 加钟数（serverType=1）
   */
  addCount?: number;
  /**
   * 金额
   */
  amount?: number;
  /**
   * 点钟数（serverType=0）
   */
  designatedCount?: number;
  /**
   * 服务名称
   */
  name?: string;
  /**
   * 轮钟数（serverType=2）
   */
  rotationCount?: number;
  [property: string]: any;
}

/**
 * 数据对象
 *
 * org.haut.common.domain.vo.dataview.TechnicianRankingVO
 */
export interface TechnicianRankingVO {
  /**
   * 技师排行列表（按业绩降序）
   */
  ranking?: TechnicianItem[];
  [property: string]: any;
}

/**
 * org.haut.common.domain.vo.dataview.TechnicianRankingVO.TechnicianItem
 */
export interface TechnicianItem {
  /**
   * 加钟数
   */
  addCount?: number;
  /**
   * 点钟数
   */
  designatedCount?: number;
  /**
   * 业绩金额
   */
  performance?: number;
  /**
   * 轮钟数
   */
  rotationCount?: number;
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

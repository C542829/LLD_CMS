// #region 销售数据
/**
 * OrderPageQuery
 */
export interface SaleDataRequest {
  /**
   * 订单号
   */
  orderCode?: string;
  /**
   * 门店ID列表，不传则查全部关联门店
   */
  orgIds?: number[];
  /**
   * 当前页码
   */
  pageNum: number;
  /**
   * 每页大小
   */
  pageSize: number;
  /**
   * 支付方式
   */
  paymentType?: number;
  /**
   * 进查看支付为0的订单
   */
  payZero?: number;
  /**
   * 开始时间（格式：YYYY-MM-DD HH:mm:ss，左闭右开区间）
   */
  startTime?: string;
  /**
   * 结束时间（格式：YYYY-MM-DD HH:mm:ss，左闭右开区间）
   */
  endTime?: string;
  /**
   * 订单状态
   */
  status?: number;
  /**
   * 收银员ID
   */
  userId?: number;
  /**
   * 会员信息字段(卡号/手机号)
   */
  vipInfoFiled?: string;
  [property: string]: any;
}

/**
 * 订单信息响应VO
 *
 * OrderInfoVO
 */
export interface OrderInfoVO {
  /**
   * 实收金额
   */
  actualAmount?: number;
  /**
   * 消费后余额
   */
  afterBalance?: number;
  /**
   * 床位ID
   */
  bedId?: number;
  /**
   * 床位名称
   */
  bedName?: string;
  /**
   * 消费前余额
   */
  beforeBalance?: number;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 顾客类型名称
   * 顾客名称
   */
  customerName?: string;
  /**
   * 顾客类型（0 会员，1 散客）
   */
  customerType?: number;
  /**
   * 优惠金额
   */
  discountAmount?: number;
  /**
   * 主键ID
   */
  id?: number;
  /**
   * 订单编号
   */
  orderCode?: string;
  /**
   * 订单明细列表
   */
  orderDetails?: OrderDetailVO[];
  /**
   * 订单状态
   */
  orderStatus?: number;
  /**
   * 订单状态名称
   */
  orderStatusName?: string;
  /**
   * 开单时间
   */
  orderTime?: string;
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
   * 支付信息列表
   */
  payments?: PaymentVO[];
  /**
   * 备注信息
   */
  remark?: string;
  /**
   * 结算时间
   */
  settleTime?: string;
  /**
   * 应收金额
   */
  totalAmount?: number;
  /**
   * 更新时间
   */
  updateTime?: string;
  /**
   * 收银人ID
   */
  userId?: number;
  /**
   * 收银人名称
   */
  userName?: string;
  /**
   * 会员卡号
   */
  vipCardNumber?: string;
  /**
   * 会员ID
   */
  vipId?: number;
  /**
   * 顾客名称
   */
  vipName?: string;
  /**
   * 会员电话号码
   */
  vipPhoneNumber?: string;
  [property: string]: any;
}

/**
 * 订单明细响应VO
 *
 * OrderDetailVO
 */
export interface OrderDetailVO {
  /**
   * 订单业务ID
   */
  bizId?: number;
  /**
   * 业务编码
   */
  businessCode?: string;
  /**
   * 业务名称（产品名称、服务名称或疗程券名称）
   */
  businessName?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 明细编号
   */
  detailCode?: string;
  /**
   * 业务类型（0 产品，1 服务，2 疗程券）
   */
  bizType?: number;
  /**
   * 主键ID
   */
  id?: number;
  /**
   * 订单编号
   */
  orderCode?: string;
  /**
   * 订单ID
   */
  orderId?: number;
  /**
   * 订单状态
   */
  orderStatus?: number;
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
   * 销售数量
   */
  quantity?: number;
  /**
   * 备注信息
   */
  remark?: string;
  /**
   * 上钟类型（0 点钟，1 加钟，2 轮牌）
   */
  serverType?: number;
  /**
   * 结算时间
   */
  settledTime?: string;
  /**
   * 标准价格
   */
  stdPrice?: number;
  /**
   * 技师列表
   */
  technicians?: OrderDetailTechnicianDTO[];
  /**
   * 实际单价
   */
  truePrice?: number;
  /**
   * 更新时间
   */
  updateTime?: string;
  /**
   * 员工ID
   */
  userId?: number;
  /**
   * 员工名称
   */
  userName?: string;
  /**
   * VIP价格
   */
  vipPrice?: number;
  [property: string]: any;
}

/**
 * org.haut.common.domain.dto.order.OrderDetailTechnicianDTO
 *
 * OrderDetailTechnicianDTO
 */
export interface OrderDetailTechnicianDTO {
  /**
   * 技师ID
   */
  userId: number;
  /**
   * 技师姓名
   */
  userName?: string;
  [property: string]: any;
}

/**
 * org.haut.common.domain.vo.order.PaymentVO
 *
 * PaymentVO
 */
export interface PaymentVO {
  /**
   * 活动编码
   */
  activeCode?: string;
  /**
   * 活动名称
   */
  activeName?: string;
  /**
   * 活动类型
   */
  activeType?: string;
  /**
   * 资产编码
   */
  assetCode?: string;
  /**
   * 支付ID
   */
  id?: number;
  /**
   * 支付名称
   */
  paymentName?: string;
  /**
   * 支付类型
   */
  paymentType?: number;
  /**
   * 总金额
   */
  totalAmount?: number;
  [property: string]: any;
}

// #endregion 销售数据

// #region 销售汇总
/**
 * 销售汇总查询参数
 */
export interface SaleSummaryQuery {
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
  [property: string]: any;
}

/**
 * 销售汇总响应VO
 *
 * OrderSummaryVO
 */
export interface OrderSummaryVO {
  /**
   * 现金支付金额
   */
  cashPayment?: number;
  /**
   * 现金充值金额
   */
  cashRecharge?: number;
  /**
   * 销售数据创建时间
   */
  createTime?: string;
  /**
   * 抖音支付金额
   */
  douyinPayment?: number;
  /**
   * 主键
   */
  id?: number;
  /**
   * 美团支付金额
   */
  meituanPayment?: number;
  /**
   * 会员卡支付金额
   */
  memberCardPayment?: number;
  /**
   * 门店编码
   */
  orgCode?: string;
  /**
   * 机构id
   */
  orgId?: number;
  /**
   * 门店名称
   */
  orgName?: string;
  /**
   * 其他方式充值
   */
  otherRecharge?: number;
  /**
   * POS支付金额
   */
  posPayment?: number;
  /**
   * 扫码支付金额
   */
  qrPayment?: number;
  /**
   * 销售日期
   */
  statsDate?: string;
  /**
   * 总实收金额
   */
  totalActualReceipt?: number;
  /**
   * 总人次
   */
  totalPeopleTime?: number;
  /**
   * 总项目数
   */
  totalProjectCount?: number;
  /**
   * 总单次数量
   */
  totalSingleTime?: number;
  /**
   * 总营业额
   */
  totalTurnover?: number;
  /**
   * 微信充值金额
   */
  wechatRecharge?: number;
  [property: string]: any;
}

// #endregion 销售汇总

// #region 销售明细

/**
 * OrderDetailPageQuery
 */
export interface OrderDetailPageQuery {
  /**
   * 业务编码
   */
  businessCode?: string;
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
   * 当前页码
   */
  pageNum: number;
  /**
   * 每页大小
   */
  pageSize: number;
  /**
   * 销售员id
   */
  userId?: number;
  [property: string]: any;
}

/**
 * 订单明细响应VO
 *
 * OrderDetailVO
 */
export interface OrderDetailVO {
  /**
   * 订单业务ID
   */
  bizId?: number;
  /**
   * 业务编码
   */
  businessCode?: string;
  /**
   * 业务名称（产品名称、服务名称或疗程券名称）
   */
  businessName?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 明细编号
   */
  detailCode?: string;
  /**
   * 业务类型（0 产品，1 服务，2 疗程券）
   */
  bizType?: number;
  /**
   * 主键ID
   */
  id?: number;
  /**
   * 订单编号
   */
  orderCode?: string;
  /**
   * 订单ID
   */
  orderId?: number;
  /**
   * 订单状态
   */
  orderStatus?: number;
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
   * 销售数量
   */
  quantity?: number;
  /**
   * 备注信息
   */
  remark?: string;
  /**
   * 上钟类型（0 点钟，1 加钟，2 轮牌）
   */
  serverType?: number;
  /**
   * 结算时间
   */
  settledTime?: string;
  /**
   * 标准价格
   */
  stdPrice?: number;
  /**
   * 技师列表
   */
  technicians?: OrderDetailTechnicianDTO[];
  /**
   * 实际单价
   */
  truePrice?: number;
  /**
   * 更新时间
   */
  updateTime?: string;
  /**
   * 员工ID
   */
  userId?: number;
  /**
   * 员工名称
   */
  userName?: string;
  /**
   * VIP价格
   */
  vipPrice?: number;
}

/**
 * org.haut.common.domain.dto.order.OrderDetailTechnicianDTO
 *
 * OrderDetailTechnicianDTO
 */
export interface OrderDetailTechnicianDTO {
  /**
   * 技师ID
   */
  userId: number;
  /**
   * 技师姓名
   */
  userName?: string;
}

// #endregion 销售明细

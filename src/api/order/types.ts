// #region 订单创建
/**
 * OrderCreateDTO
 */
export interface OrderCreateDTO {
  /**
   * 床位ID
   * 床位ID(可选)
   */
  bedId?: number;
  /**
   * 床位名称
   */
  bedName?: string;
  /**
   * 散客名称
   */
  customerName?: string;
  /**
   * 顾客类型（0 会员，1 散客）
   */
  customerType: number;
  /**
   * 订单明细列表
   * 订单明细列表（至少一个项目明细）
   */
  orderDetails?: OrderDetailCreateDTO[];
  /**
   * 备注
   * 备注信息
   */
  remark?: string;
  /**
   * 会员ID（可选，散客时为null）
   */
  vipId?: number;
  [property: string]: any;
}

/**
 * 订单明细DTO
 *
 * OrderDetailCreateDTO
 */
export interface OrderDetailCreateDTO {
  /**
   * 订单业务ID（产品ID、服务ID或疗程券ID）
   */
  bid: number;
  /**
   * 业务类型（0 产品，1 服务，2 疗程券）
   */
  detailType: number;
  /**
   * 销售数量
   */
  quantity: number;
  /**
   * 备注
   * 备注信息
   */
  remark?: string;
  /**
   * 上钟类型（0 点钟，1 加钟，2 轮牌）
   */
  serverType?: number;
  /**
   * 标准单价
   */
  stdPrice?: number;
  /**
   * 实际单价
   * 实际单价(结算前和实收价保持一致；结算时更新实际单价)
   */
  truePrice?: number;
  /**
   * 员工ID
   * 技师ID
   */
  userId: number;
  /**
   * 员工名称
   * 技师名称
   */
  userName?: string;
  /**
   * 技师列表
   */
  technicians?: OrderDetailTechnicianDTO[];
  [property: string]: any;
}

// #endregion 订单创建

// #region 订单结算

/**
 * OrderSettleDTO
 */
export interface OrderSettleDTO {
  /**
   * 实收金额
   */
  actualAmount: number;
  /**
   * 资产id
   * 资产ID
   */
  assetIds?: number[];
  /**
   * 床位ID
   * 床位ID(可选)
   */
  bedId?: number;
  /**
   * 床位名称
   */
  bedName?: string;
  /**
   * 散客名称
   */
  customerName?: string;
  /**
   * 顾客类型（0 会员，1 散客）
   */
  customerType?: number;
  /**
   * 优惠金额
   */
  discountAmount: number;
  /**
   * 订单明细
   */
  orderDetails: OrderDetailSettleDTO[];
  /**
   * 订单ID
   * 订单ID（如果已在床位创建订单,传入此id用于更改订单状态）
   */
  orderId?: number;
  /**
   * 下单时间
   */
  orderTime?: string;
  /**
   * 支付信息
   */
  paymentInfoList: PaymentInfoDTO[];
  /**
   * 备注
   * 备注信息
   */
  remark?: string;
  /**
   * 优惠券ID
   */
  ticketUseList?: OrderTicketUseDTO[];
  /**
   * 应收金额
   */
  totalAmount: number;
  /**
   * 会员ID（可选，散客时为null）
   */
  vipId?: number;
  [property: string]: any;
}

/**
 * org.haut.common.domain.dto.order.OrderDetailSettleDTO
 *
 * OrderDetailSettleDTO
 */
export interface OrderDetailSettleDTO {
  /**
   * 订单业务ID（产品ID、服务ID或疗程券ID）
   */
  bid: number;
  /**
   * 业务编码
   */
  businessCode?: string;
  /**
   * 业务名称
   */
  businessName?: string;
  /**
   * 订单明细编号
   */
  detailCode?: string;
  /**
   * 业务类型（0 产品，1 服务，2 疗程券）
   */
  detailType: number;
  /**
   * 订单明细ID
   */
  id?: number;
  /**
   * 销售数量
   */
  quantity: number;
  /**
   * 备注信息
   */
  remark?: string;
  /**
   * 上钟类型（0 点钟，1 加钟，2 轮牌）
   */
  serverType?: number;
  /**
   * 标准单价
   */
  stdPrice?: number;
  /**
   * 实际单价(结算前和实收价保持一致；结算时更新实际单价)
   */
  truePrice?: number;
  /**
   * 技师ID
   */
  userId: number;
  /**
   * 技师名称
   */
  userName?: string;
  /**
   * 技师列表
   */
  technicians?: OrderDetailTechnicianDTO[];
  [property: string]: any;
}

/**
 * org.haut.common.domain.dto.order.OrderDetailTechnicianDTO
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
 * org.haut.common.domain.dto.vip.PaymentInfoDTO
 *
 * PaymentInfoDTO
 */
export interface PaymentInfoDTO {
  /**
   * 资产编号
   */
  assetCode?: string;
  /**
   * 支付金额
   */
  paymentAmount?: number;
  /**
   * 支付名称
   */
  paymentName?: string;
  /**
   * 支付类型
   */
  paymentType?: number;
  [property: string]: any;
}

/**
 * org.haut.common.domain.dto.order.OrderTicketUseDTO
 *
 * OrderTicketUseDTO
 */
export interface OrderTicketUseDTO {
  /**
   * 订单详情ID，如果为代金券则设置为空
   * 订单详情ID
   */
  detailId?: number;
  /**
   * 订单明细在details数组中的索引位置（从0开始）
   * 用于体验券关联订单明细
   * 订单明细索引（从0开始）
   */
  detailIndex?: number;
  /**
   * 优惠券ID
   */
  ticketId?: number;
  /**
   * 优惠券类型
   */
  ticketType?: number;
  [property: string]: any;
}

// #endregion 订单结算

// #region 订单信息

/**
 * 数据对象
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
   * 门店ID
   */
  orgId?: number;
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
  bid?: number;
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
  detailType?: number;
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
   * 技师列表
   */
  technicians?: OrderDetailTechnicianDTO[];
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
// #endregion 订单信息

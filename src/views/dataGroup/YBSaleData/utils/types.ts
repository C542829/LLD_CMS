// ==================== 查询参数 ====================

/**
 * 杨波销售数据查询参数
 */
export interface YbSaleDataQuery {
  /** 页码 */
  pageNum?: number;
  /** 每页大小 */
  pageSize?: number;
  /** 开始时间（格式：yyyy-MM-dd HH:mm:ss） */
  startTime?: string;
  /** 结束时间（格式：yyyy-MM-dd HH:mm:ss） */
  endTime?: string;
  /** 门店ID */
  orgId?: number | string;
  /** 会员姓名 */
  memName?: string;
  /** 会员手机号 */
  cellPhoneNo?: string;
  /** 会员ID */
  memberId?: number | string;
  /** 订单状态 */
  orderStatus?: number;
}

// ==================== 子项结构 ====================

/**
 * 销售明细（Detail）
 */
export interface YbSaleDataDetail {
  /** 销售明细唯一ID */
  id: number;
  /** 关联销售主表ID */
  salesId: number;
  /** 产品(项目)ID */
  productId: number;
  /** 产品编码 */
  prodCode: string;
  /** 产品名称 */
  prodName: string;
  /** 产品类型：69-项目 71-产品 73-耗材 75-疗程券 77-其他 */
  prodType: number;
  /** 产品成本 */
  prodCost: number;
  /** 销售数量 */
  quantity: number;
  /** 标准单价(标价) */
  standPrice: number;
  /** 实际价格(折后单价) */
  acturalPrice: number;
  /** 服务(上钟)类型：89-轮牌 91-点工 92-加钟 */
  serviceType: number;
  /** 服务时长(分钟) */
  serviceTime: number;
  /** 服务开始时间 */
  serviceStart: string | null;
  /** 服务结束时间 */
  serviceEnd: string | null;
  /** 服务方式 */
  treatType: number;
  /** 服务技师ID */
  serviceStaffId: number;
  /** 服务技师名称 */
  serviceStaffName: string;
  /** 服务技师编号 */
  serviceStaffCode: string;
  /** 床位ID */
  bedId: number;
  /** 床位名称 */
  bedName: string;
  /** 财务支付类型：1-现金 2-会员卡 */
  finPayType: number;
  /** 支付标识 */
  payKey: string;
  /** 第三方优惠券交易ID */
  thirdCouponDealId: number;
  /** 套餐ID */
  packageId: number;
  /** 套餐金额 */
  packageAmount: number;
  /** 套餐唯一标识 */
  packageUuid: string;
  /** 最后更新操作员ID */
  updateUser: number;
}

/**
 * 会员消费财务记录（Fin）
 */
export interface YbSaleDataFin {
  /** 财务记录ID */
  finId: number;
  /** 财务编号(资产编号) */
  finNo: string;
  /** 财务消费金额 */
  finAmount: number;
  /** 是否转账：0-否 1-是 */
  tranFin: number;
  /** 消费门店(机构)ID */
  finOrgId: number;
  /** 消费门店(机构)名称 */
  finOrgName: string;
}

// ==================== 响应数据 ====================

/**
 * 杨波销售数据 VO
 */
export interface YbSaleDataVO {
  /** 销售记录唯一ID */
  id: number;
  /** 机构(门店)ID */
  orgId: number;
  /** 机构(门店)名称 */
  orgName: string;
  /** 销售单号 */
  salesNo: string;
  /** 交易(结账)时间 */
  tradeTime: string;
  /** 会员ID，0表示散客 */
  memberId: number;
  /** 会员名称，散客时为null */
  memName: string | null;
  /** 会员编号，散客时为null */
  memCode: string | null;
  /** 会员手机号，散客时为null */
  cellPhoneNo: string | null;
  /** 会员等级代码：N-普通 S-白银 G-黄金 P-铂金 D-钻石 */
  levelCode: string | null;
  /** 交易前会员余额 */
  beforeBalance: number;
  /** 交易后会员余额 */
  afterBalance: number;
  /** 交易前会员联合余额(跨店) */
  beforeUnionBalance: number;
  /** 交易后会员联合余额(跨店) */
  afterUnionBalance: number;
  /** 应收金额(标价总额) */
  shouldAmount: number;
  /** 实收金额(折后实际支付) */
  actualAmount: number;
  /** 折扣金额(应收 - 实收) */
  discountAmount: number;
  /** 优惠折扣金额 */
  optDiscount: number;
  /** 优惠折扣ID */
  optDisId: number;
  /** 总成本 */
  totalCost: number;
  /** 提成金额 */
  commissionAmount: number;
  /** 现金支付金额 */
  cashPay: number;
  /** 会员卡(储值)支付金额 */
  memberCardPay: number;
  /** 银行卡支付金额 */
  bankCardPay: number;
  /** 微信支付金额 */
  wechatPay: number;
  /** 支付宝支付金额 */
  aliPay: number;
  /** 优惠券支付金额(电子券) */
  couponsPay: number;
  /** 实体优惠券支付金额 */
  entityCouponPay: number;
  /** 美团支付金额 */
  meiTuanPay: number;
  /** 口碑支付金额 */
  kouBeiPay: number;
  /** 抖音支付金额 */
  douYinPay: number;
  /** 连连支付金额 */
  lianLianPay: number;
  /** 其他支付金额 */
  otherPay: number;
  /** 是否在线支付：0-否 1-是 */
  onlinePay: number;
  /** 在线支付金额 */
  onlinePayAmount: number;
  /** 支付状态 */
  payState: number;
  /** 收券数量 */
  receiptCoupon: number;
  /** 订单状态：37-已开单 39-已结账 41-已取消 43-已挂账 45-已挂单 46-已冲正 */
  orderStatus: number;
  /** 开单操作员ID */
  createrUserId: number;
  /** 开单操作员名称 */
  createUserName: string;
  /** 结账操作员ID */
  settleUserId: number;
  /** 结账操作员名称 */
  settleUserName: string;
  /** 转账结算金额 */
  transSettleAmount: number;
  /** 转账品牌ID */
  transBrandId: number;
  /** 签单员工ID */
  signBillStaffId: number;
  /** 次卡信息 */
  timesCardInfo: string;
  /** 批次标记 */
  batchFlag: string;
  /** 批次号 */
  batchNum: number;
  /** 短日期(YYMMDD格式) */
  shortDate: number;
  /** 记录创建时间 */
  createTime: string;
  /** 记录更新时间 */
  updateTime: string;
  /** 最后更新操作员ID */
  updateUserId: number;
  /** 优惠券ID列表，逗号分隔 */
  couponsIds: string;
  /** 备注 */
  remark: string;
  /** 销售明细数组 */
  details: YbSaleDataDetail[];
  /** 会员消费财务记录数组 */
  saleMemConsumeFins: YbSaleDataFin[];
}

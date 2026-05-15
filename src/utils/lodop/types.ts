export enum PrintType {
  ORDER = 'ORDER',
  RECHARGE = 'RECHARGE',
}
export interface Config {
  width: number;
  height: number;
}

// 定义数据类型（匹配后端返回结构）
export interface OrderDetail {
  businessName: string;
  userName: string;
  stdPrice: number;
  quantity: number;
  truePrice: number;
  trueUnitPrice: number;
  bizType: number;
  serverType: number; // 0-主项目 1-加项
  technicians: Technician[];
}

export interface Technician {
  userId: number;
  userName: string;
  userCode: string;
}

export interface Payment {
  paymentName: string;
  totalAmount: number;
}

export interface OrderData {
  orderCode: string;
  orderTime: string;
  settleTime: string;
  manualOrderNo: string;
  totalAmount: number;
  actualAmount: number;
  beforeBalance: number;
  afterBalance: number;
  discountAmount: number;
  customerType: number;
  bedName: string;
  userName: string; // 收银员
  vipName: string;
  customerName: string;
  vipPhoneNumber: string;
  orderDetails: OrderDetail[];
  payments: Payment[];
  /**
   * 本次使用的会员卡余额信息（每张卡的剩余余额）
   * 本次使用的会员卡余额信息
   */
  cardBalances?: CardBalanceVO[];
  /**
   * 项目券剩余次数
   */
  ticketRemainings?: TicketRemainingVO[];
  /**
   * 本次使用的次卡信息
   */
  ticketUsages?: TicketUsageVO[];
  orgName: string; // 门店名称，需补充到data中
  servicePhone: string; // 服务电话，需补充到data中
  orgNumber: string; // 服务电话，需补充到data中
  orgAddress: string; // 门店地址，需补充到data中
}

/**
 * 会员卡余额信息（小票打印用）
 *
 * CardBalanceVO
 */
export interface CardBalanceVO {
  /**
   * 资产编号
   */
  assetCode?: string;
  /**
   * 资产名称（如：充值卡-标准价）
   */
  assetName?: string;
  /**
   * 剩余余额
   */
  remainingBalance?: number;
  [property: string]: any;
}

/**
 * org.haut.common.domain.vo.vip.TicketRemainingVO
 *
 * TicketRemainingVO，项目券剩余次数
 */
export interface TicketRemainingVO {
  /**
   * 关联产品名称，逗号分隔
   */
  productNames?: string;
  /**
   * 剩余未使用次数
   */
  remainingCount?: number;
  /**
   * 关联服务项目名称，逗号分隔
   */
  serverItemNames?: string;
  /**
   * 券模板ID
   */
  ticketId?: number;
  /**
   * 券模板名称
   */
  ticketName?: string;
  [property: string]: any;
}

/**
 * 小票-本次使用的次卡/体验券信息
 *
 * TicketUsageVO，小票-本次使用的次卡信息
 */
export interface TicketUsageVO {
  /**
   * 该类券剩余可用次数
   */
  remainingCount?: number;
  /**
   * 使用的券ID
   */
  ticketId?: number;
  /**
   * 券名称
   */
  ticketName?: string;
  /**
   * 券模板ID
   */
  ticketTemplateId?: number;
  /**
   * 本次使用次数
   */
  usedCount?: number;
  [property: string]: any;
}

export interface RechargeData {
  id: number;
  remark: string | null;
  historyCode: string;
  rechargeStatus: number;
  rechargeType: string;
  rechargeTime: string;
  vipId: number;
  vipName: string;
  vipPhoneNumber: string;
  vipCardNumber: string;
  activityId: number;
  activeName: string;
  rechargeValue: number;
  assetCode: string;
  presentValue: number | null;
  presentAssetCode: string | null;
  ticketInfo: string;
  userName: string;
  userId: number;
  orgId: number;
  paymentInfoList: Array<{
    paymentType: number;
    paymentName: string;
    paymentAmount: number;
    assetCode: string | null;
  }>;
  userKpiList: Array<{
    userId: number;
    userName: string;
    kpi: number;
  }>;
  // 补充门店相关字段（默认值适配）
  orgName?: string;
  servicePhone?: string;
  orgNumber?: string;
  orgAddress?: string;
}

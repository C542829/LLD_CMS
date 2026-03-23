export interface RechargeHistoryParams {
  /**
   * 结束时间
   */
  endDate?: string;
  /**
   * 当前页码
   */
  pageNum?: number;
  /**
   * 每页条数
   */
  pageSize?: number;
  /**
   * 支付方式
   */
  paymentType?: number;
  /**
   * 充值状态
   */
  rechargeStatus?: number;
  /**
   * 开始时间
   */
  startDate?: string;
  userId?: number;
  /**
   * 会员信息
   */
  vipInfoFiled?: string;
  [property: string]: any;
}

/**
 * org.haut.common.domain.vo.vip.RechargeHistoryVO
 */
export interface VipRechargeHistoryVO {
  /**
   * 充值活动名称
   */
  activeName?: string;
  /**
   * 关联充值活动id
   */
  activityId?: number;
  /**
   * 本金资产编号
   */
  assetCode?: string;
  /**
   * 充值单号
   */
  historyCode?: string;
  /**
   * 主键
   */
  id?: number;
  /**
   * 门店id
   */
  orgId?: number;
  /**
   * 支付信息
   */
  paymentInfoList?: OrgHautCommonDomainDtoVipPaymentInfoDTO[];
  /**
   * 赠送资产编号
   */
  presentAssetCode?: string;
  /**
   * 赠送金额
   */
  presentValue?: number;
  /**
   * 充值状态（0 充值成功，1 已冲正）
   */
  rechargeStatus?: number;
  /**
   * 充值时间
   */
  rechargeTime?: string;
  /**
   * 充值类型（0 门店充值，1 手动赠送）
   */
  rechargeType?: number;
  /**
   * 充值金额
   */
  rechargeValue?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 赠券信息
   */
  ticketInfo?: string;
  /**
   * 操作员id
   */
  userId?: number;
  /**
   * 业绩信息
   */
  userKpiList?: OrgHautCommonDomainDtoVipRechargeDTOUserKpiDTO[];
  /**
   * 操作员名称
   */
  userName?: string;
  /**
   * 会员卡号
   */
  vipCardNumber?: string;
  /**
   * 关联充值会员id
   */
  vipId?: number;
  /**
   * 会员姓名
   */
  vipName?: string;
  /**
   * 会员电话号
   */
  vipPhoneNumber?: string;
  [property: string]: any;
}

/**
 * org.haut.common.domain.dto.vip.RechargeDTO.PaymentInfoDTO
 *
 * org.haut.common.domain.dto.vip.PaymentInfoDTO
 */
export interface OrgHautCommonDomainDtoVipPaymentInfoDTO {
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
 * org.haut.common.domain.dto.vip.RechargeDTO.UserKpiDTO
 */
export interface OrgHautCommonDomainDtoVipRechargeDTOUserKpiDTO {
  /**
   * 业绩金额
   */
  kpi?: number;
  /**
   * 业绩技师id
   */
  userId?: number;
  /**
   * 业绩技师姓名
   */
  userName?: string;
  [property: string]: any;
}

/**
 * org.haut.common.domain.dto.vip.RechargeDTO
 */
export interface RechargeDTO {
  /**
   * 活动id
   */
  activeId?: number;
  /**
   * 活动名称
   */
  activeName?: string;
  /**
   * 资产折扣基数（0 标准价，1 会员价）
   */
  assetDiscountBase?: number;
  /**
   * 资产折扣率
   */
  assetDiscountRate?: number;
  /**
   * 资产是否允许跨店（0 不允许，1 允许）
   */
  assetIsCrossStore?: number;
  /**
   * 支付信息
   */
  paymentInfoList?: OrgHautCommonDomainDtoVipPaymentInfoDTO[];
  /**
   * 充值提成规则id
   */
  rechargeRoleId: number;
  /**
   * 充值金额
   */
  rechargeValue: number;
  /**
   * 业绩技师信息(支持多人业绩)
   */
  userKpiList?: OrgHautCommonDomainDtoVipRechargeDTOUserKpiDTO[];
  /**
   * 会员卡号
   */
  vipCardNumber?: string;
  /**
   * 会员id
   */
  vipId: number;
  /**
   * 会员姓名
   */
  vipName?: string;
  /**
   * 会员手机号
   */
  vipPhoneNumber?: string;
  [property: string]: any;
}

/**
 * org.haut.common.domain.dto.vip.PaymentInfoDTO
 */
export interface OrgHautCommonDomainDtoVipPaymentInfoDTO {
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
}

/**
 * org.haut.common.domain.dto.vip.RechargeDTO.UserKpiDTO
 */
export interface OrgHautCommonDomainDtoVipRechargeDTOUserKpiDTO {
  /**
   * 业绩金额
   */
  kpi?: number;
  /**
   * 业绩技师id
   */
  userId?: number;
  /**
   * 业绩技师姓名
   */
  userName?: string;
}

/**
 * 充值活动列表参数
 */
export interface SearchActiveParams {
  /**
   * 活动名称
   */
  activeName?: string;
  /**
   * 活动状态
   */
  activeStatus?: number;
  /**
   * 机构ID（可选，用于按门店筛选）
   * 机构ID
   */
  orgId?: number;
  [property: string]: any;
}

/**
 * 充值活动视图对象
 *
 * org.haut.common.domain.vo.vip.VipRechargeActiveVO
 */
export interface RechargeActiveVO {
  /**
   * 活动基础
   */
  activeBase?: number;
  /**
   * 活动开始时间
   */
  activeBeginTime?: string;
  /**
   * 活动资金
   */
  activeCapital?: number;
  /**
   * 活动折扣
   */
  activeDiscount?: number;
  /**
   * 活动结束时间
   */
  activeFinalTime?: string;
  /**
   * 活动名称
   */
  activeName?: string;
  /**
   * 活动状态
   */
  activeStatus?: number;
  /**
   * 活动类型
   */
  activeType?: number;
  /**
   * 提成类型（0固定金额，1比例）
   */
  commissionType?: number;
  /**
   * 提成值
   */
  commissionValue?: number;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 主键ID
   */
  id?: number;
  /**
   * 是否跨店使用(0 不允许，1 允许)
   */
  isCrossStore?: number;
  /**
   * 删除状态(0 存在，1 删除)
   */
  isDelete?: number;
  /**
   * 关联门店列表
   */
  orgs?: OrgSimpleVO[];
  /**
   * 赠送基础
   */
  presentBase?: number;
  /**
   * 赠送折扣
   */
  presentDiscount?: number;
  /**
   * 赠送折扣是否相同
   */
  presentDiscountIsSame?: number;
  /**
   * 赠送是否跨店使用(0 不允许，1 允许)
   */
  presentIsCrossStore?: number;
  /**
   * 赠送金额
   */
  presentValue?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 优惠券列表
   */
  ticketList?: TicketVO[];
  /**
   * 更新时间
   */
  updateTime?: string;
  [property: string]: any;
}

/**
 * org.haut.common.domain.vo.system.OrgSimpleVO
 */
export interface OrgSimpleVO {
  /**
   * 门店ID
   */
  id?: number;
  /**
   * 门店编号
   */
  orgCode?: string;
  /**
   * 门店名称
   */
  orgName?: string;
  [property: string]: any;
}

/**
 * org.haut.common.domain.vo.vip.VipRechargeActiveVO.TicketVO
 */
export interface TicketVO {
  /**
   * 数量
   */
  number?: number;
  /**
   * 有效天数
   */
  ticketEffectiveTime?: number;
  /**
   * 优惠券ID
   */
  ticketId?: number;
  /**
   * 优惠券名称
   */
  ticketName?: string;
  [property: string]: any;
}

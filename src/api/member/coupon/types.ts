//#region 分页查询会员优惠券
/**
 * 分页查询会员优惠券明细请求参数
 */
export interface TicketListRequest {
  /**
   * 活动id
   */
  activeId?: number | string;
  /**
   * 当前页码
   */
  pageNum: number;
  /**
   * 每页大小
   */
  pageSize: number;
  /**
   * 优惠券状态
   */
  status?: number | string;
  /**
   * 会员信息关键字
   */
  vipInfoFiled?: string;
  /**
   * 优惠券id
   */
  vipTicketId?: number | string;
  [property: string]: any;
}

/**
 * org.haut.common.domain.vo.vip.TicketCountVO
 *
 * TicketCountVO
 */
export interface TicketCountVO {
  /**
   * 活动id
   */
  activeId?: number;
  /**
   * 领取时间
   */
  claimTime?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 到期时间
   */
  expiryDate?: string;
  /**
   * 主键
   */
  id?: number;
  /**
   * 删除状态(0 存在，1 删除)
   */
  isDelete?: number;
  /**
   * 组织id
   */
  orgId?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 使用状态（0 未使用，1 已使用，2 已取消）
   */
  status?: number;
  /**
   * 优惠券码
   */
  ticketCode?: string;
  /**
   * 优惠券信息
   */
  ticketInfo?: VipTicketVO;
  /**
   * 代金券名称
   */
  ticketName?: string;
  /**
   * 更新时间
   */
  updateTime?: string;
  /**
   * 领取人卡号
   */
  vipCardNumber?: string;
  /**
   * 会员id
   */
  vipInfoId?: number;
  /**
   * 领取人名称
   */
  vipName?: string;
  /**
   * 领取人手机号
   */
  vipPhoneNumber?: string;
  /**
   * 优惠券id
   */
  vipTicketId?: number;
  [property: string]: any;
}

/**
 * 优惠券信息
 *
 * VipTicketVO
 */
export interface VipTicketVO {
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 主键
   */
  id?: number;
  /**
   * 删除状态(0 存在，1 删除)
   */
  isDelete?: number;
  /**
   * 关联门店列表
   */
  orgs?: OrgSimpleVO[];
  /**
   * 备注
   */
  remark?: string;
  /**
   * 优惠券适用项目
   */
  serverItems?: ServerItemVO[];
  /**
   * 优惠券描述
   */
  ticketDescription?: string;
  /**
   * 有效天数（-1 代表无限期）
   */
  ticketEffectiveTime?: number;
  /**
   * 限额满多少元可用
   */
  ticketFullPayment?: number;
  /**
   * 优惠券名称
   */
  ticketName?: string;
  /**
   * 优惠券状态（0 启用，1 禁用）
   */
  ticketStatus?: number;
  /**
   * 优惠券类型
   */
  ticketType?: number;
  /**
   * 优惠券面值
   */
  ticketValue?: number;
  /**
   * 更新时间
   */
  updateTime?: string;
  [property: string]: any;
}

/**
 * org.haut.common.domain.vo.system.OrgSimpleVO
 *
 * ServerItemVO
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
 * org.haut.common.domain.vo.vip.VipTicketVO.ServerItemVO
 *
 * ServerItemVO
 */
export interface ServerItemVO {
  /**
   * 项目ID
   */
  id?: number;
  /**
   * 项目名称
   */
  itemName?: string;
  [property: string]: any;
}

//#endregion 分页查询会员优惠券

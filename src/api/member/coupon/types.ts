//#region 分页查询会员优惠券

export interface SearchTicketParams {
  /**
   * 门店id（可选，用于筛选指定门店的优惠券）
   */
  orgId?: number | string;
  /**
   * 优惠券名称
   */
  ticketName?: string;
  /**
   * 优惠券状态
   */
  ticketStatus?: number;
  [property: string]: any;
}

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
export interface TicketVO {
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
   * 券类型（0 代金券，1 体验券，2 产品券）
   */
  ticketType?: number;
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
   * 关联产品列表（仅产品券时有值）
   */
  productList?: ProductSimpleVO[];
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

/**
 * 产品简要信息
 */
export interface ProductSimpleVO {
  /**
   * 产品ID
   */
  productId?: number;
  /**
   * 产品名称
   */
  productName?: string;
  /**
   * 产品价格
   */
  productPrice?: number;
  [property: string]: any;
}

/**
 * 券剩余次数VO
 */
export interface TicketRemainingVO {
  /**
   * 券模板ID
   */
  ticketId?: number;
  /**
   * 券模板名称
   */
  ticketName?: string;
  /**
   * 剩余未使用次数
   */
  remainingCount?: number;
  /**
   * 关联服务项目名称，逗号分隔
   */
  serverItemNames?: string;
  /**
   * 关联产品名称，逗号分隔
   */
  productNames?: string;
  [property: string]: any;
}

//#endregion 分页查询会员优惠券

/**
 * VipTicketUpdateDTO，优惠券更新对象
 */
export interface VipTicketDTO {
  /**
   * 主键id
   */
  id?: number;
  /**
   * 关联门店ID列表
   */
  orgIds?: number[];
  /**
   * 关联的产品ID列表（产品券专用）
   */
  productIds?: number[];
  /**
   * 优惠券适用服务项目
   */
  serverItemIds?: number[];
  /**
   * 优惠券描述
   */
  ticketDescription?: string;
  /**
   * 有效天数（-1 代表无限期）
   */
  ticketEffectiveTime: number;
  /**
   * 限额满多少元可用
   */
  ticketFullPayment?: number;
  /**
   * 优惠券名称
   */
  ticketName: string;
  /**
   * 优惠券类型
   */
  ticketType: number;
  /**
   * 优惠券面值
   */
  ticketValue?: number;
  [property: string]: any;
}

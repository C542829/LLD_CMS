//#region 会员管理

/**
 * 会员查询参数
 */
export interface SearchParams {
  /**
   * 查询关键字
   */
  queryField?: string;
  pageNum?: number;
  pageSize?: number;
  [property: string]: any;
}

/**
 * 数据对象
 *
 * VipInfoDTO，会员详细信息对象
 */
export interface VipInfoDTO {
  /**
   * 会员地址
   */
  address?: string;
  /**
   * 店内总余额
   */
  balance?: number;
  /**
   * 会员生日
   */
  birthday?: string;
  /**
   * 会员卡号
   */
  cardNumber?: string;
  /**
   * 性别（0 男，1 女）
   */
  gender?: number;
  /**
   * 主键
   */
  id?: number;
  /**
   * 会员身份
   */
  identity?: number;
  /**
   * 末次消费日期
   */
  lastConsumptionTime?: string;
  /**
   * 末次充值时间
   */
  lastRechargeTime?: string;
  /**
   * 姓名
   */
  name?: string;
  /**
   * 组织ID
   */
  orgId?: number;
  /**
   * 电话号码
   */
  phoneNumber?: string;
  /**
   * 会员密码
   */
  pwd?: string;
  /**
   * 备注
   */
  remark?: string;
  [property: string]: any;
}

/**
 * org.haut.common.domain.dto.vip.PresentTicketDTO
 */
export interface ReqPresentTicket {
  /**
   * 赠送数量
   */
  number: number;
  /**
   * 赠送备注
   */
  remark?: string;
  /**
   * 优惠券ID
   */
  vipTicketId: number;
  [property: string]: any;
}

/**
 * org.haut.common.domain.dto.vip.PresentAssetDTO
 */
export interface ReqPresentAsset {
  /**
   * 折扣基础（0 标准价，1 会员价）
   */
  discountBase: number;
  /**
   * 折扣率（0-1之间的小数，如0.8表示8折）
   * 折扣率
   */
  discountRate: number;
  /**
   * 是否跨店结算（0 不允许，1 允许）
   */
  isCrossStore: number;
  /**
   * 赠送金额
   */
  presentAmount: number;
  /**
   * 备注
   */
  remark?: string;
  [property: string]: any;
}

// #endregion 会员管理

//#region 会员资产

/**
 * 数据对象
 *
 * VipPropertyVO
 */
export interface VipPropertyVO {
  /**
   * 会员资产列表
   */
  vipAssetVOList?: VipAssetVO[];
  /**
   * 会员信息VO
   */
  vipInfoVO?: VipInfoVO;
  /**
   * 会员券列表
   */
  vipTicketVOList?: VipTicketVO[];
  [property: string]: any;
}

/**
 * org.haut.common.domain.vo.vip.VipAssetVO
 *
 * VipAssetVO
 */
export interface VipAssetVO {
  /**
   * 余额
   */
  assetBalance?: number;
  /**
   * 实体卡号
   */
  assetCardNumber?: string;
  /**
   * 折扣基础（0 标准价，1 会员价）
   */
  assetDiscountBase?: number;
  /**
   * 折扣率
   */
  assetDiscountRate?: number;
  /**
   * 跨店消费（0 不允许，1 允许）
   */
  assetIsCrossStore?: number;
  /**
   * 资产名称
   */
  assetName?: string;
  /**
   * 资产编号
   */
  assetNum?: string;
  /**
   * 资产类型（0 充值，1 赠送）
   */
  assetType?: number;
  /**
   * 兼容美管家会员卡类型分类ID
   */
  cardTypeId?: string;
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
   * 门店id
   */
  orgId?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 更新时间
   */
  updateTime?: string;
  /**
   * 乐观锁
   */
  version?: number;
  /**
   * 会员卡号
   */
  vipCardNumber?: string;
  /**
   * 会员id
   */
  vipId?: number;
  [property: string]: any;
}

/**
 * 会员信息VO
 *
 * VipInfoVO
 */
export interface VipInfoVO {
  /**
   * 会员地址
   */
  address?: string;
  /**
   * 店内总余额
   */
  balance?: number;
  /**
   * 会员生日
   */
  birthday?: string;
  /**
   * 会员卡号
   */
  cardNumber?: string;
  /**
   * 性别（0 男，1 女）
   */
  gender?: number;
  /**
   * 主键
   */
  id?: number;
  /**
   * 会员身份
   * 会员身份(字典表管理)
   */
  identity?: number;
  /**
   * 末次消费日期
   */
  lastConsumptionTime?: string;
  /**
   * 末次充值时间
   */
  lastRechargeTime?: string;
  /**
   * 姓名
   */
  name?: string;
  /**
   * 门店编码
   */
  orgCode?: string;
  /**
   * 组织ID
   */
  orgId?: number;
  /**
   * 门店名称
   */
  orgName?: string;
  /**
   * 电话号码
   */
  phoneNumber?: string;
  /**
   * 会员密码
   */
  pwd?: string;
  /**
   * 备注
   */
  remark?: string;
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
 * OrgSimpleVO
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

//#endregion 会员资产

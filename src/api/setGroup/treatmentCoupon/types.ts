/** 门店简要信息VO */
export interface OrgSimpleVO {
  /** 门店ID */
  id?: number;
  /** 门店编号 */
  orgCode?: string;
  /** 门店名称 */
  orgName?: string;
}

/** 疗程关联优惠券明细VO */
export interface TicketDetailVO {
  /** 关联优惠券ID */
  vipTicketId?: number;
  /** 关联优惠券名称 */
  vipTicketName?: string;
  /** 关联优惠券数量 */
  vipTicketNum?: number;
}

/** 疗程券查询参数 */
export interface CureTicketQueryParams {
  /** 疗程券名称 */
  cureTicketName?: string;
  /** 状态 */
  status?: number;
  /** 组织ID（可选，用于筛选门店关联的疗程券） */
  orgId?: number | string;
}

/** 疗程券VO */
export interface CureTicketVO {
  /** 主键 */
  id?: number;
  /** 创建时间 */
  createTime?: string;
  /** 更新时间 */
  updateTime?: string;
  /** 删除状态(0 存在，1 删除) */
  isDelete?: number;
  /** 备注 */
  remark?: string;
  /** 疗程券名称 */
  name?: string;
  /** 疗程编码 */
  encode?: string;
  /** 疗程价格 */
  price?: number;
  /** 提成类型（0 固定金额，1 比例提成） */
  type?: number;
  /** 提成值（固定/比例） */
  commissionValue?: number;
  /** 提成基准（0 标准价，1 实收价） */
  commissionBase?: number;
  /** 状态（0 启用，1 停用） */
  status?: number;
  /** 关联门店列表 */
  orgs?: OrgSimpleVO[];
  /** 疗程关联优惠券列表 */
  ticketDetails?: TicketDetailVO[];
  [property: string]: any;
}

/** 疗程关联优惠券DTO */
export interface RelatedTicketDTO {
  /** 关联优惠券ID */
  vipTicketId: number;
  /** 关联优惠券名称 */
  vipTicketName?: string;
  /** 关联优惠券数量 */
  vipTicketNum: number;
}

/** 疗程券创建DTO */
export interface CureTicketCreateDTO {
  /** 备注 */
  remark?: string;
  /** 疗程券名称 */
  name: string;
  /** 疗程编码 */
  encode: string;
  /** 疗程价格 */
  price: number;
  /** 提成类型（0 固定金额，1 比例提成） */
  type: number;
  /** 提成值（固定/比例） */
  commissionValue: number;
  /** 提成基准（0 标准价，1 实收价） */
  commissionBase: number;
  /** 状态（0 启用，1 停用） */
  status: number;
  /** 疗程关联优惠券 */
  vipTicketList?: RelatedTicketDTO[];
  /** 关联门店ID列表 */
  orgIds?: number[];
}

/** 疗程券更新DTO */
export interface CureTicketUpdateDTO extends CureTicketCreateDTO {
  /** 疗程券ID */
  id: number;
}

/** 更新疗程券状态DTO */
export interface UpdateCureTicketStatusDTO {
  id: number;
  status: number;
}

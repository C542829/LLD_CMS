/** 门店简要信息VO */
export interface OrgSimpleVO {
  /** 门店ID */
  id?: number;
  /** 门店编号 */
  orgCode?: string;
  /** 门店名称 */
  orgName?: string;
}

/** 服务项目查询参数 */
export interface ServerItemRequest {
  /** 分类(筛选条件) */
  category?: string;
  /** 服务项目状态(0 正常，1 停用，null 全部状态) */
  itemStatus?: number;
  /** 查询关键字 */
  keyWord?: string;
  /** 门店ID（可选，不传则查全部） */
  orgId?: number;
}

/** 服务项目VO */
export interface ServerItemVO {
  /** 分类 */
  category?: string;
  /** 提成基准（0 标准价，1 实收价） */
  commissionBase?: number;
  /** 提成类型（0 固定金额，1 比例提成） */
  commissionType?: number;
  /** 提成值（固定/比例）（点钟） */
  commissionValueAppointment?: number;
  /** 提成值（固定/比例）（加钟） */
  commissionValueExtend?: number;
  /** 提成值（固定/比例）（轮牌） */
  commissionValueRotation?: number;
  /** 主键 */
  id?: number;
  /** 是否参与打折（0 允许，1 禁止） */
  isDiscounts?: number;
  /** 服务项目编码 */
  itemEncode?: string;
  /** 服务项目名称 */
  itemName?: string;
  /** 标准价 */
  itemPrice?: number;
  /** 项目状态（0 启用，1 禁用） */
  itemStatus?: number;
  /** 关联门店列表 */
  orgs?: OrgSimpleVO[];
  /** 备注 */
  remark?: string;
  /** 服务时长(分钟) */
  serverTime?: number;
  /** 会员价 */
  vipItemPrice?: number;
  [property: string]: any;
}

/** 服务项目创建DTO */
export interface ServerItemCreateDTO {
  /** 备注 */
  remark?: string;
  /** 服务项目名称 */
  itemName: string;
  /** 服务项目编码 */
  itemEncode: string;
  /** 服务时长(分钟) */
  serverTime: number;
  /** 标准价 */
  itemPrice: number;
  /** 会员价 */
  vipItemPrice: number;
  /** 是否参与打折（0 允许，1 禁止） */
  isDiscounts: number;
  /** 提成类型（0 固定金额，1 比例提成） */
  commissionType: number;
  /** 提成值（轮牌） */
  commissionValueRotation: number;
  /** 提成值（点钟） */
  commissionValueAppointment: number;
  /** 提成值（加钟） */
  commissionValueExtend: number;
  /** 提成基准（0 标准价，1 实收价） */
  commissionBase: number;
  /** 项目状态（0 启用，1 禁用） */
  itemStatus: number;
  /** 分类 */
  category?: string;
  /** 关联门店ID列表 */
  orgIds?: number[];
}

/** 服务项目更新DTO */
export interface ServerItemUpdateDTO extends ServerItemCreateDTO {
  /** 主键 */
  id: number;
}

/** 更新服务项目状态DTO */
export interface UpdateServerItemStatusDTO {
  id: number;
  status: number;
}

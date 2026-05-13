/** 门店简要信息VO */
export interface OrgSimpleVO {
  /** 门店ID */
  id?: number;
  /** 门店编号 */
  orgCode?: string;
  /** 门店名称 */
  orgName?: string;
}

/** 充值提成规则查询参数 */
export interface RechargeRoleQueryParams {
  /** 充值提成规则名称 */
  rechargeRoleName?: string;
  /** 状态 */
  status?: number;
}

/** 充值提成规则VO */
export interface RechargeRoleVO {
  /** 主键 */
  id: number;
  /** 创建时间 */
  createTime?: string;
  /** 更新时间 */
  updateTime?: string;
  /** 删除状态(0 存在，1 删除) */
  isDelete?: number;
  /** 备注 */
  remark?: string;
  /** 充值提成规则名称 */
  rechargeRoleName: string;
  /** 提成类型 */
  commissionType?: number;
  /** 提成值（比例） */
  rechargeCommissionValue?: number;
  /** 状态 */
  status?: number;
  /** 关联的门店列表 */
  orgs?: OrgSimpleVO[];
  [property: string]: any;
}

/** 充值提成规则创建DTO */
export interface RechargeRoleCreateDTO {
  /** 备注 */
  remark?: string;
  /** 充值提成规则名称 */
  rechargeRoleName: string;
  /** 提成类型 */
  commissionType?: number;
  /** 提成值（比例） */
  rechargeCommissionValue?: number;
  /** 状态（0 启用，1 禁用） */
  status?: number;
  /** 关联的门店ID列表 */
  orgIds?: number[];
}

/** 充值提成规则更新DTO */
export interface RechargeRoleUpdateDTO extends RechargeRoleCreateDTO {
  /** 充值提成规则ID */
  id: number;
}

/** 更新充值提成规则状态DTO */
export interface UpdateRechargeRoleStatusDTO {
  id: number;
  status: number;
}

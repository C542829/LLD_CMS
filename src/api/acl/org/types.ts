declare global {
  /**
   * 门店详细信息
   */
  interface OrgInfo {
    /**
     * 创建时间
     */
    createTime?: string;
    /**
     * 默认折扣基准（0 标准价，1 会员价）
     */
    defaultDiscountBase?: number;
    /**
     * 默认折扣率（百分比）
     */
    defaultDiscountRate?: number;
    /**
     * 默认跨店结算（0 不允许，1 允许）
     */
    defaultIsCrossStore?: number;
    /**
     * 默认充值提成规则ID
     */
    defaultRechargeRoleId?: number;
    /**
     * 主键
     */
    id?: number;
    /**
     * 删除状态(0 存在，1 删除)
     */
    isDelete?: number;
    /**
     * 详细地址
     */
    orgAddress?: string;
    /**
     * 行政区域
     */
    orgArea?: string;
    /**
     * 机构编号
     */
    orgCode?: string;
    /**
     * 机构负责人
     */
    orgLeader?: string;
    /**
     * 负责人电话
     */
    orgLeaderNum?: string;
    /**
     * 机构名称
     */
    orgName?: string;
    /**
     * 机构电话
     */
    orgNumber?: string;
    /**
     * 父级机构
     */
    orgParent?: string;
    /**
     * 机构性质
     */
    orgProperty?: string;
    /**
     * 机构简称
     */
    orgShortName?: string;
    /**
     * 机构状态(0 正常，1 停用)
     */
    orgState?: number;
    /**
     * 机构类型
     */
    orgType?: string;
    /**
     * 打印宽度（毫米）
     */
    printWidth?: number;
    /**
     * 备注
     */
    remark?: string;
    /**
     * 更新时间
     */
    updateTime?: string;
    [property: string]: any;
  }
}

export interface Org {
  /**
   * 主键
   */
  id?: number;
  /**
   * 详细地址
   */
  orgAddress: string;
  /**
   * 行政区域
   */
  orgArea: string | object;
  /**
   * 机构编号
   */
  orgCode: string;
  /**
   * 机构负责人
   */
  orgLeader: string;
  /**
   * 负责人电话
   */
  orgLeaderNum: string;
  /**
   * 机构名称
   */
  orgName: string;
  /**
   * 机构电话
   */
  orgNumber: string;
  /**
   * 父级机构
   */
  orgParent: string;
  /**
   * 机构性质
   */
  orgProperty: string;
  /**
   * 机构简称
   */
  orgShortName: string;
  /**
   * 机构状态(0 正常，1 停用)
   */
  orgState: number;
  /**
   * 机构类型
   */
  orgType: string;
  /**
   * 备注
   */
  remark?: string;
}

/**
 * OrgDefaultRuleUpdateDTO
 */
export interface OrgDefaultRuleUpdateDTO {
  /**
   * 折扣基准（0 标准价，1 会员价）
   */
  defaultDiscountBase: number;
  /**
   * 折扣率（百分比）
   */
  defaultDiscountRate: number;
  /**
   * 跨店结算（0 不允许，1 允许）
   */
  defaultIsCrossStore: number;
  /**
   * 默认充值提成规则ID
   */
  defaultRechargeRoleId?: number;
  [property: string]: any;
}

/**
 * 查询参数
 */
export interface SearchListParams {
  /**
   * 机构编码
   */
  orgCode?: string;
  /**
   * 机构名称
   */
  orgName?: string;
  /**
   * 机构状态
   */
  orgStatus?: number | string;
  [property: string]: any;
}

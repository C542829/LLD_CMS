/**
 * 门店机构
 */
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

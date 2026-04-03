/**
 * 角色列表参数
 */
export interface SearchRoleParams {
  /**
   * 角色编码
   */
  roleCode?: string;
  /**
   * 角色名称
   */
  roleName?: string;
  /**
   * 角色状态
   */
  status?: number;
  [property: string]: any;
}

/**
 * org.haut.common.domain.vo.system.RoleInfoVo
 */
export interface RoleInfoVo {
  /**
   * 主键
   * 角色ID
   */
  id: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 角色标识
   * 角色编码
   */
  roleCode?: string;
  /**
   * 角色名称
   */
  roleName?: string;
  /**
   * 显示顺序
   */
  roleSort?: number;
  /**
   * 角色状态（0 正常，1 停用）
   * 角色状态
   */
  roleStatus?: number;
  [property: string]: any;
}

/**
 * org.haut.common.domain.vo.system.PermissionInfoVO
 */
export interface PermissionInfoVO {
  /**
   * 子权限
   */
  children?: PermissionInfoVO[];
  /**
   * 组件名称
   */
  component?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 主键
   */
  id?: number;
  /**
   * 权限名称
   */
  name?: string;
  /**
   * 父权限ID
   */
  parentId?: number;
  /**
   * 资源路径
   */
  path?: string;
  /**
   * 权限标识
   */
  permCode?: string;
  /**
   * 权限状态(0 启用，1 停用)
   */
  permStatus?: number;
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

/**
 * org.haut.common.domain.dto.system.PermissionCreateDTO
 */
export interface PermissionCreateDTO {
  /**
   * 组件名称
   */
  component: string;
  /**
   * 权限名称
   */
  name: string;
  /**
   * 父权限ID
   */
  parentId?: number;
  /**
   * 资源路径
   */
  path: string;
  /**
   * 权限标识
   */
  permCode: string;
  /**
   * 权限状态(0 启用，1 停用)
   */
  permStatus?: number;
  /**
   * 备注
   */
  remark?: string;
  [property: string]: any;
}

/**
 * org.haut.common.domain.dto.system.PermissionUpdateDTO
 */
export interface PermissionUpdateDTO {
  /**
   * 组件名称
   */
  component: string;
  /**
   * 主键
   */
  id: number;
  /**
   * 权限名称
   */
  name: string;
  /**
   * 父权限ID
   */
  parentId?: number;
  /**
   * 资源路径
   */
  path: string;
  /**
   * 权限标识
   */
  permCode: string;
  /**
   * 权限状态(0 启用，1 停用)
   */
  permStatus: number;
  /**
   * 备注
   */
  remark?: string;
  [property: string]: any;
}

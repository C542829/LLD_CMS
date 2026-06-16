declare global {
  /**
   * 用户信息
   * org.haut.common.domain.vo.system.UserInfoVO
   */
  export interface UserInfo {
    /**
     * 员工ID
     */
    id?: number | null;
    /**
     * 组织机构id
     */
    orgId?: number | null;
    /**
     * 用户关联的所有门店列表
     */
    orgs?: OrgSimpleVO[];
    /**
     * 角色信息
     */
    role?: RoleInfoVo;
    /**
     * 居住地址
     */
    userAddress?: string;
    /**
     * 出生日期
     */
    userBirthday?: string;
    /**
     * 员工编号
     */
    userCode?: string;
    /**
     * 所属部门
     */
    userDept?: string;
    /**
     * 学历
     */
    userEdu?: string;
    /**
     * 入职日期
     */
    userEntryDate?: string;
    /**
     * 健康证到期日
     */
    userHealth?: string;
    /**
     * 身份证号
     */
    userIdCard?: string;
    /**
     * 婚姻状况
     */
    userMarry?: string;
    /**
     * 员工姓名
     */
    userName?: string;
    /**
     * 手机号码
     */
    userNumber?: string;
    /**
     * 登录密码
     */
    userPassword?: string;
    /**
     * 职位
     */
    userPosition?: string;
    /**
     * 性别(0-男,1-女)
     */
    userSex?: number;
    /**
     * 在职状态
     */
    userStatus?: string;
    [property: string]: any;
  }
}

/**
 * 登录表单
 */
export interface LoginForm {
  /**
   * 门店编码
   */
  orgCode?: string;
  /**
   * 密码
   */
  password?: string;
  /**
   * 用户名
   */
  username?: string;
  [property: string]: any;
}

/**
 * 用户登录/信息响应类型
 */
export interface LoginResponse {
  /** 用户名 */
  userName: string;
  /** 用户ID */
  userId: number;
  /** 用户编码 */
  userCode: string;
  /** 登录令牌 */
  token: string;
  /** 组织ID */
  orgId: number;
  /** 过期时间 */
  expire: string;
}

/**
 * 查询用户列表参数
 */
export interface SearchUserParams {
  /**
   * 机构id
   */
  orgIds?: number[];
  /**
   * 分页页码
   */
  pageNum?: number;
  /**
   * 分页大小
   */
  pageSize?: number;
  /**
   * 角色id
   */
  roleId?: number | string;
  /**
   * 员工名
   */
  userName?: string;
  /**
   * 员工手机号
   */
  userNumber?: string;
  /**
   * 状态
   */
  userStatus?: string;
  [property: string]: any;
}

/**
 * org.haut.common.domain.vo.system.OrgSimpleVO
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
 * 角色信息
 *
 * org.haut.common.domain.vo.system.RoleInfoVo
 */
export interface RoleInfoVo {
  /**
   * 主键
   * 角色ID
   */
  id?: number;
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

/**
 * org.haut.common.domain.dto.system.UserUpdateDTO
 */
export interface UserDTO {
  /**
   * 员工ID
   */
  id?: number | null;
  /**
   * 额外关联门店ID列表（不含主门店）
   */
  orgIds?: number[];
  /**
   * 角色id
   */
  roleId: number;
  /**
   * 居住地址
   */
  userAddress?: string;
  /**
   * 出生日期
   */
  userBirthday?: string;
  /**
   * 员工编号
   */
  userCode: string;
  /**
   * 所属部门
   */
  userDept?: string;
  /**
   * 学历
   */
  userEdu?: string;
  /**
   * 入职日期
   */
  userEntryDate?: string;
  /**
   * 健康证到期日
   */
  userHealth?: string;
  /**
   * 身份证号
   */
  userIdCard?: string;
  /**
   * 婚姻状况
   */
  userMarry?: string;
  /**
   * 员工姓名
   */
  userName: string;
  /**
   * 手机号码
   */
  userNumber: string;
  /**
   * 登录密码
   */
  userPassword: string;
  /**
   * 职位
   */
  userPosition: string;
  /**
   * 性别(0-男,1-女)
   */
  userSex: number;
  /**
   * 在职状态
   */
  userStatus?: string;
  [property: string]: any;
}

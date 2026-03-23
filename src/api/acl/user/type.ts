declare global {
  interface UserInfo {
    /**
     * 登录token
     */
    token: string;
    /**
     * 过期时间
     */
    expire: string;
    /**
     * 员工ID
     */
    id?: number;
    /**
     * 组织机构id
     */
    orgId?: number;
    /**
     * 角色信息
     */
    role?: OrgHautCommonDomainVoSystemRoleInfoVo;
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
 * 数据对象
 *
 * org.haut.common.domain.vo.system.UserInfoVO
 */
export interface UserInfoVO {
  /**
   * 员工ID
   */
  id?: number;
  /**
   * 组织机构id
   */
  orgId?: number;
  /**
   * 角色信息
   */
  role?: OrgHautCommonDomainVoSystemRoleInfoVo;
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

/**
 * 角色信息
 *
 * org.haut.common.domain.vo.system.RoleInfoVo
 */
export interface OrgHautCommonDomainVoSystemRoleInfoVo {
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

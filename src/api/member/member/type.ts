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

/**
 * 产品列表查询参数
 */
export interface ReqParams {
  /**
   * 查询关键字
   */
  keyWord?: string;
  /**
   * 产品状态(0-启用，1-禁用)
   */
  productStatus?: number;
  [property: string]: any;
}

/**
 * 产品VO
 */
export interface ProductInfoVO {
  /**
   * 提成基准(0-标准价提成，1-实收价提成)
   */
  commissionBase?: number;
  /**
   * 该服务产品的提成类型
   */
  commissionType?: number;
  /**
   * 提成值(固定/比例)
   */
  commissionValue?: number;
  /**
   * 服务产品创建时间
   */
  createTime?: string;
  /**
   * 服务产品ID
   */
  id?: number;
  /**
   * 删除状态(0存在，1删除)
   */
  isDelete?: number;
  /**
   * 服务产品是否参与打折（0是，1否）
   */
  isDiscount?: number;
  /**
   * 组织ID
   */
  orgId?: number;
  /**
   * 服务产品编码
   */
  productEncode?: string;
  /**
   * 服务产品名称
   */
  productName?: string;
  /**
   * 服务产品标准价格
   */
  productPrice?: number;
  /**
   * 产品状态(0-启用，1-禁用)
   */
  productStatus?: number;
  /**
   * 库存
   */
  quantity?: string;
  /**
   * 备注(其他描述)
   */
  remark?: string;
  /**
   * 单位
   */
  unit?: string;
  /**
   * 服务产品更新时间
   */
  updateTime?: string;
  /**
   * 服务产品VIP价格
   */
  vipProductPrice?: number;
  [property: string]: any;
}

/**
 * 产品DTO
 */
export interface ProductDTO {
  /**
   * 主键ID
   */
  id?: number | null;
  /**
   * 提成基准(0-标准价提成，1-实收价提成)
   */
  commissionBase?: number;
  /**
   * 提成类型（0 固定提成, 1 比例提成）
   */
  commissionType: number;
  /**
   * 提成值(固定提成时为固定金额，比例提成时为比例)
   */
  commissionValue?: number | null;
  /**
   * 是否参与打折(0-是，1-否)
   */
  isDiscount: number;
  /**
   * 产品编码
   */
  productEncode: string;
  /**
   * 产品名称
   */
  productName: string;
  /**
   * 标准价格
   */
  productPrice: number | null;
  /**
   * 产品状态(0-启用，1-禁用)
   */
  productStatus: number | null;
  /**
   * 备注信息
   */
  remark?: string;
  /**
   * 单位
   */
  unit: string;
  /**
   * 会员价格
   */
  vipProductPrice: number | null;
  [property: string]: any;
}

/**
 * 更新产品状态DTO
 */
export interface UpdateProductStatusDTO {
  id: number;
  status: number;
  [property: string]: any;
}

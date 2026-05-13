/**
 * 列表查询参数
 */
export interface SearchParams {
  /**
   * 结束时间（格式：YYYY-MM-DD HH:mm:ss，左闭右开区间）
   */
  endTime?: string;
  /**
   * 门店ID
   */
  orgId?: number;
  /**
   * 操作员
   */
  operator?: string;
  /**
   * 订单号
   */
  orderCode?: string;
  /**
   * 页码
   */
  pageNum?: number;
  /**
   * 每页大小
   */
  pageSize?: number;
  /**
   * 开始时间（格式：YYYY-MM-DD HH:mm:ss，左闭右开区间）
   */
  startTime?: string;
  [property: string]: any;
}

/**
 * 新增入库单参数
 */
export interface InStockAddRequest {
  /**
   * 入库明细列表
   */
  items: InStockItemCreateDTO[];
  /**
   * 门店ID
   */
  orgId?: number;
  /**
   * 操作员
   */
  operator?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 总金额
   */
  totalPrice: number;
  [property: string]: any;
}

/**
 * 入库明细创建DTO
 */
export interface InStockItemCreateDTO {
  /**
   * 单价
   */
  price: number;
  /**
   * 产品ID
   */
  productId: number;
  /**
   * 入库数量
   */
  quantity: number;
  /**
   * 备注
   */
  remark?: string;
  [property: string]: any;
}

/**
 * 创建参数
 */
export interface OutStockAddRequest {
  /**
   * 出库明细列表
   */
  items: OutStockItemCreateDTO[];
  /**
   * 门店ID
   */
  orgId?: number;
  /**
   * 操作员
   */
  operator?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 总金额
   */
  totalPrice: number;
  [property: string]: any;
}

/**
 * 出库明细创建DTO
 */
export interface OutStockItemCreateDTO {
  /**
   * 单价
   */
  price: number;
  /**
   * 产品ID
   */
  productId: number;
  /**
   * 出库数量
   */
  quantity: number;
  /**
   * 备注
   */
  remark?: string;
  [property: string]: any;
}

/**
 * 库存日志信息VO
 *
 * StockLogVO，库存日志信息
 */
export interface StockLogVO {
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 主键 自增
   */
  id?: number;
  /**
   * 删除状态(0 存在，1 删除)
   */
  isDelete?: number;
  /**
   * 操作员
   */
  operator?: string;
  /**
   * 订单编码
   */
  orderCode?: string;
  /**
   * 订单类型（入库/出库）
   */
  orderType?: string;
  /**
   * 结构id
   */
  orgId?: number;
  /**
   * 单价
   */
  price?: number;
  /**
   * 产品编码
   */
  productCode?: string;
  /**
   * 产品ID
   */
  productId?: number;
  /**
   * 产品名称
   */
  productName?: string;
  /**
   * 数量
   */
  quantity?: number;
  /**
   * 备注(其他描述)
   */
  remark?: string;
  /**
   * 总价
   */
  totalPrice?: number;
  /**
   * 更新时间
   */
  updateTime?: Date;
  [property: string]: any;
}

/**
 * 出库订单信息VO
 *
 * StockOutOrderVO，出库订单信息
 */
export interface StockOutOrderVO {
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 订单ID
   */
  id?: number;
  /**
   * 删除状态(0 存在，1 删除)
   */
  isDelete?: number;
  /**
   * 出库明细列表
   */
  items?: StockOutItemVO[];
  /**
   * 操作员
   */
  operator?: string;
  /**
   * 出库单号
   */
  orderCode?: string;
  /**
   * 组织ID
   */
  orgId?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 总金额
   */
  totalPrice?: number;
  /**
   * 更新时间
   */
  updateTime?: Date;
  [property: string]: any;
}

/**
 * org.haut.common.domain.vo.stock.StockOutItemVO
 *
 * StockOutItemVO
 */
export interface StockOutItemVO {
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 主键 自增
   */
  id?: number;
  /**
   * 删除状态(0 存在，1 删除)
   */
  isDelete?: number;
  /**
   * 组织ID
   */
  orgId?: number;
  /**
   * 出库订单编码
   */
  outOrderCode?: string;
  /**
   * 出库订单ID
   */
  outOrderId?: number;
  /**
   * 单价
   */
  price?: number;
  /**
   * 产品编码
   */
  productCode?: string;
  /**
   * 产品ID
   */
  productId?: number;
  /**
   * 产品名称
   */
  productName?: string;
  /**
   * 数量
   */
  quantity?: number;
  /**
   * 备注(其他描述)
   */
  remark?: string;
  /**
   * 单位
   */
  unit?: string;
  /**
   * 更新时间
   */
  updateTime?: Date;
  [property: string]: any;
}

/**
 * 入库订单信息VO
 *
 * StockInOrderVO，入库订单信息
 */
export interface StockInOrderVO {
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 订单ID
   */
  id?: number;
  /**
   * 删除状态(0 存在，1 删除)
   */
  isDelete?: number;
  /**
   * 入库明细
   */
  items?: StockInItemVO[];
  /**
   * 操作员
   */
  operator?: string;
  /**
   * 入库单号
   */
  orderCode?: string;
  /**
   * 组织ID
   */
  orgId?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 总金额
   */
  totalPrice?: number;
  /**
   * 更新时间
   */
  updateTime?: Date;
  [property: string]: any;
}

/**
 * org.haut.common.domain.vo.stock.StockInItemVO
 *
 * StockInItemVO，入库明细
 */
export interface StockInItemVO {
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 明细ID
   */
  id?: number;
  /**
   * 入库订单编码
   */
  inOrderCode?: string;
  /**
   * 入库订单ID
   */
  inOrderId?: number;
  /**
   * 删除状态(0 存在，1 删除)
   */
  isDelete?: number;
  /**
   * 组织ID
   */
  orgId?: number;
  /**
   * 入库单价
   */
  price?: number;
  /**
   * 产品编码
   */
  productCode?: string;
  /**
   * 产品ID
   */
  productId?: number;
  /**
   * 产品名称
   */
  productName?: string;
  /**
   * 入库数量
   */
  quantity?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 计量单位
   */
  unit?: string;
  /**
   * 更新时间
   */
  updateTime?: Date;
  [property: string]: any;
}

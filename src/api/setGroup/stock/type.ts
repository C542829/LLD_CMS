/**
 * 列表查询参数
 */
export interface SearchParams {
  /**
   * 结束时间（格式：YYYY-MM-DD HH:mm:ss，左闭右开区间）
   */
  endTime?: string;
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

export interface SearchOperLogParams {
  /**
   * 结束时间
   */
  endTime?: string;
  /**
   * 操作模块
   */
  module?: string;
  /**
   * 操作人姓名
   */
  operatorName?: string;
  /**
   * 页码
   */
  pageNum?: number;
  /**
   * 每页大小
   */
  pageSize?: number;
  /**
   * 开始时间
   */
  startTime?: string;
  /**
   * 操作状态（0成功 1失败）
   */
  status?: number;
  [property: string]: any;
}

/**
 * org.haut.common.domain.vo.system.SysOperLogVO
 */
export interface OperLogVO {
  /**
   * 耗时（毫秒）
   */
  costTime?: number;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 操作描述
   */
  description?: string;
  /**
   * 错误信息
   */
  errorMsg?: string;
  /**
   * 主键
   */
  id?: number;
  /**
   * 操作IP
   */
  ip?: string;
  /**
   * 操作模块
   */
  module?: string;
  /**
   * 操作人ID
   */
  operatorId?: number;
  /**
   * 操作人姓名
   */
  operatorName?: string;
  /**
   * 机构ID
   */
  orgId?: number;
  /**
   * HTTP方法
   */
  requestMethod?: string;
  /**
   * 请求参数
   */
  requestParams?: string;
  /**
   * 请求路径
   */
  requestUrl?: string;
  /**
   * 响应结果
   */
  responseResult?: string;
  /**
   * 操作状态（0成功 1失败）
   */
  status?: number;
  [property: string]: any;
}

import { get, post, put } from '@/utils/request';
import * as Types from './types';

// 导出类型
export { Types };

// 门店接口
enum API {
  /** 分页查询操作日志 */
  OPER_LOG = '/system/oper-log/page',
  /** 修改打印宽度 */
  UPDATE_PRINT_WIDTH = ``,
}

/**
 * 分页查询操作日志
 * @param params 搜索参数
 * @returns
 */
export const reqOperLogList = (params: Types.SearchOperLogParams): ApiResponse<PageListInfo<Types.OperLogVO[]>> => {
  return get(API.OPER_LOG, params);
};

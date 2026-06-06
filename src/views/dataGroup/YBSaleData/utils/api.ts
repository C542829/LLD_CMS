import { post } from '@/utils/request';
import * as Types from './types';

// 导出类型
export { Types };

/** 杨波销售数据接口地址 */
enum API {
  /** 分页列表 */
  LIST_URL = '/yb/sale-data/page',
}

/**
 * 获取杨波销售数据分页列表
 * @param data 搜索参数
 * @returns 销售数据分页列表
 */
export const reqYbSaleDataList = (data: Types.YbSaleDataQuery): ApiResponse<PageListInfo<Types.YbSaleDataVO>> => {
  return post(API.LIST_URL, data);
};

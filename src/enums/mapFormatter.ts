// 枚举映射处理

/**
 * 性别枚举映射器
 * @param row
 * @param column
 * @param cellValue
 * @param index
 * @returns
 * @deprecated 该函数即将被弃用，请使用 /src/utils/formatter sexMap 替代。
 */
export const sexMap = (row: any, column: any, cellValue: number, index: number) => {
  let result = '未知';
  cellValue === 0 && (result = '男');
  cellValue === 1 && (result = '女');
  return result;
};

/**
 * 是否参与打折枚举映射器
 * @param row
 * @param column
 * @param cellValue
 * @param index
 * @returns
 * @deprecated 该函数即将被弃用，请使用 /src/utils/formatter isDiscountMap 替代。
 */
export const isDiscountMap = (row: any, column: any, cellValue: number, index: number) => {
  let result = '未知';
  cellValue === 0 && (result = '允许');
  cellValue === 1 && (result = '不允许');
  return result;
};

/**
 * 优惠券类型枚举映射
 * @param row
 * @param column
 * @param cellValue
 * @param index
 * @returns
 * @deprecated 该函数即将被弃用，请使用 /src/utils/formatter couponTypeMap 替代。
 */
export const couponTypeMap = (row: any, column: any, cellValue: number, index: number) => {
  let couponType = ['实体券', '线上领取', '地推活动领取', '手动赠送', '充值活动获赠', '', '', '疗程项目获得'];
  return couponType[cellValue] || '';
};

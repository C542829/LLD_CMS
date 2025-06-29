// 枚举映射处理

/**
 * 性别枚举映射
 * @param row
 * @param column
 * @param cellValue
 * @param index
 * @returns
 */
export const sexMap = (row: any, column: any, cellValue: any, index: number) => {
  return cellValue === 0 ? '男' : '女';
};

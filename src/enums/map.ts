// 枚举映射处理

/**
 * 性别枚举映射
 * @param row
 * @param column
 * @param cellValue
 * @param index
 * @returns
 */
export const sexMap = (row: any, column: any, cellValue: number, index: number) => {
  let result = '未知';
  cellValue === 0 && (result = '男');
  cellValue === 1 && (result = '女');
  return result;
};

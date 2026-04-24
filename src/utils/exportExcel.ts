/**
 * 基于 SheetJS 的通用表格导出工具
 * @description 支持 Excel 导出、多 Sheet、自定义列映射、样式等功能
 */
import * as XLSX from 'xlsx';

/** 列配置项 */
export interface ExportColumn<T = Record<string, unknown>> {
  /** 对应数据中的 key */
  key: keyof T & string;
  /** 表头显示名称 */
  title: string;
  /** 单元格宽度（字符数） */
  width?: number;
  /** 自定义单元格值转换 */
  formatter?: (value: T[keyof T], row: T, rowIndex: number) => string | number;
}

/** 单个 Sheet 配置 */
export interface ExportSheetOption<T = Record<string, unknown>> {
  /** Sheet 名称 */
  sheetName?: string;
  /** 列配置 */
  columns: ExportColumn<T>[];
  /** 数据源 */
  data: T[];
}

/** 导出配置 */
export interface ExportExcelOption<T = Record<string, unknown>> {
  /** 文件名（不含扩展名） */
  fileName: string;
  /** Sheet 配置（单 Sheet 时可直接传对象，多 Sheet 传数组） */
  sheets: ExportSheetOption<T> | ExportSheetOption<T>[];
  /** 文件类型 */
  bookType?: XLSX.BookType;
  /** 是否添加表头，默认 true */
  includeHeader?: boolean;
}

/**
 * 将数据按照列配置转换为二维数组
 * @param columns 列配置
 * @param data 数据源
 * @param includeHeader 是否包含表头
 */
function transformData<T>(
  columns: ExportColumn<T>[],
  data: T[],
  includeHeader = true,
): (string | number)[][] {
  const result: (string | number)[][] = [];

  // 添加表头
  if (includeHeader) {
    result.push(columns.map((col) => col.title));
  }

  // 填充数据行
  data.forEach((row, rowIndex) => {
    const rowData = columns.map((col) => {
      const cellValue = row[col.key];
      if (col.formatter) {
        return col.formatter(cellValue, row, rowIndex);
      }
      // 处理 null/undefined
      if (cellValue === null || cellValue === undefined) {
        return '';
      }
      return cellValue as string | number;
    });
    result.push(rowData);
  });

  return result;
}

/**
 * 创建单个 Sheet 的工作表对象
 * @param option Sheet 配置
 * @param includeHeader 是否包含表头
 */
function createWorksheet<T>(
  option: ExportSheetOption<T>,
  includeHeader: boolean,
): XLSX.WorkSheet {
  const { columns, data } = option;
  const aoa = transformData(columns, data, includeHeader);

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // 设置列宽
  if (columns.some((col) => col.width)) {
    ws['!cols'] = columns.map((col) => ({
      wch: col.width ?? 15,
    }));
  }

  return ws;
}

/**
 * 通用 Excel 导出方法
 * @param option 导出配置
 * @example
 * ```ts
 * // 单 Sheet 导出
 * exportExcel({
 *   fileName: '用户列表',
 *   sheets: {
 *     sheetName: '用户',
 *     columns: [
 *       { key: 'name', title: '姓名', width: 12 },
 *       { key: 'age', title: '年龄', width: 8 },
 *       { key: 'gender', title: '性别', formatter: (val) => val ? '男' : '女' },
 *     ],
 *     data: userList,
 *   },
 * });
 *
 * // 多 Sheet 导出
 * exportExcel({
 *   fileName: '报表',
 *   sheets: [
 *     { sheetName: '销售汇总', columns: summaryColumns, data: summaryData },
 *     { sheetName: '销售明细', columns: detailColumns, data: detailData },
 *   ],
 * });
 * ```
 */
export function exportExcel<T = Record<string, unknown>>(
  option: ExportExcelOption<T>,
): void {
  const {
    fileName,
    sheets,
    bookType = 'xlsx',
    includeHeader = true,
  } = option;

  // 统一转为数组处理
  const sheetList = Array.isArray(sheets) ? sheets : [sheets];
  const workbook = XLSX.utils.book_new();

  sheetList.forEach((sheetOption, index) => {
    const ws = createWorksheet(sheetOption, includeHeader);
    const sheetName =
      sheetOption.sheetName || `Sheet${index + 1}`;
    XLSX.utils.book_append_sheet(workbook, ws, sheetName);
  });

  // 生成并下载文件
  XLSX.writeFile(workbook, `${fileName}.${bookType}`, { bookType });
}

/**
 * 快捷导出：直接使用 key-value 映射导出
 * @param fileName 文件名
 * @param headerMap 表头映射 { 数据key: 表头名称 }
 * @param data 数据源
 * @example
 * ```ts
 * exportByHeaderMap('用户列表', { name: '姓名', age: '年龄', phone: '手机号' }, userList);
 * ```
 */
export function exportByHeaderMap<T = Record<string, unknown>>(
  fileName: string,
  headerMap: Record<string, string>,
  data: T[],
): void {
  const columns: ExportColumn<T>[] = Object.entries(headerMap).map(
    ([key, title]) => ({
      key: key as keyof T & string,
      title,
    }),
  );

  exportExcel({ fileName, sheets: { columns, data } });
}

/**
 * 导出纯二维数组数据（无列配置）
 * @param fileName 文件名
 * @param aoa 二维数组数据（包含表头行）
 * @param sheetName Sheet 名称
 * @example
 * ```ts
 * exportFromAOA('报表', [['姓名', '年龄'], ['张三', 25], ['李四', 30]]);
 * ```
 */
export function exportFromAOA(
  fileName: string,
  aoa: (string | number)[][],
  sheetName = 'Sheet1',
): void {
  const workbook = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  XLSX.utils.book_append_sheet(workbook, ws, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

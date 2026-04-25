/**
 * 文件下载通用工具
 * @description 处理后端返回的 Blob 二进制流下载
 */

/** 常见 MIME 类型映射 */
const MIME_TYPE_MAP: Record<string, string> = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
  csv: 'text/csv',
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  zip: 'application/zip',
  png: 'image/png',
  jpg: 'image/jpeg',
  json: 'application/json',
};

/** 下载配置 */
export interface DownloadBlobOptions {
  /** 文件名（含扩展名），优先级最高 */
  fileName?: string;
  /** 文件扩展名，用于推断 MIME 类型，默认 'xlsx' */
  extension?: string;
  /** Blob MIME 类型，优先级高于 extension 推断 */
  mimeType?: string;
}

/**
 * 从 Content-Disposition 响应头中提取文件名
 * @param contentDisposition Content-Disposition 头值
 * @returns 文件名或 undefined
 */
function extractFileNameFromHeader(contentDisposition: string): string | undefined {
  if (!contentDisposition) return undefined;

  // 优先匹配 filename*=UTF-8'' 编码格式
  const utf8Match = contentDisposition.match(/filename\*=(?:UTF-8|utf-8)''(.+?)(?:;|$)/);
  if (utf8Match) {
    return decodeURIComponent(utf8Match[1]);
  }

  // 匹配 filename="xxx" 或 filename=xxx
  const match = contentDisposition.match(/filename="?([^";]+)"?/);
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

/**
 * 下载 Blob 二进制流为文件
 * @param blobData 后端返回的二进制数据（Blob | ArrayBuffer）
 * @param options 下载配置
 * @example
 * ```ts
 * // 基础用法
 * const res = await reqSaleExport(params);
 * downloadBlob(res, { fileName: '销售记录.xlsx' });
 *
 * // 使用扩展名自动推断
 * downloadBlob(res, { fileName: '销售记录', extension: 'xlsx' });
 *
 * // 自动从响应头获取文件名
 * downloadBlob(res, { extension: 'xlsx' });
 * ```
 */
export function downloadBlob(blobData: Blob | ArrayBuffer, options: DownloadBlobOptions = {}): void {
  const { fileName, extension = 'xlsx', mimeType } = options;

  // 确定 MIME 类型
  const contentType = mimeType || MIME_TYPE_MAP[extension] || MIME_TYPE_MAP.xlsx;

  // 构建 Blob
  const blob = blobData instanceof Blob ? blobData : new Blob([blobData], { type: contentType });

  // 生成文件名
  const finalFileName = fileName || `下载文件_${formatDate()}.${extension}`;

  // 创建下载链接并触发
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = finalFileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  // 清理
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * 格式化当前日期为 yyyy-MM-dd
 */
function formatDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 从 Axios 响应头中提取文件名并下载
 * @param blobData 二进制数据
 * @param headers Axios 响应头对象
 * @param defaultFileName 默认文件名
 * @example
 * ```ts
 * const res = await axios.post('/api/export', params, { responseType: 'blob' });
 * downloadFromResponse(res.data, res.headers, '导出文件.xlsx');
 * ```
 */
export function downloadFromResponse(
  blobData: Blob | ArrayBuffer,
  headers: Record<string, any>,
  defaultFileName = `下载文件_${formatDate()}.xlsx`,
): void {
  const contentDisposition = headers?.['content-disposition'] || headers?.['Content-Disposition'];
  const fileName = contentDisposition ? extractFileNameFromHeader(contentDisposition) : defaultFileName;

  downloadBlob(blobData, { fileName: fileName || defaultFileName });
}

//封装一个函数:获取一个结果:当前早上|上午|下午|晚上
export const getTime = () => {
  let message = '';
  //通过内置构造函数Date
  const hours = new Date().getHours();
  //情况的判断
  if (hours <= 9) {
    message = '早上';
  } else if (hours <= 12) {
    message = '上午';
  } else if (hours <= 18) {
    message = '下午';
  } else {
    message = '晚上';
  }
  return message;
};

/**
 * 计算有效期剩余天数
 * @param {string} createTime - 创建时间字符串，格式如 "2025-08-19 22:24:53"
 * @param {number} validDays - 有效天数（正整数）
 * @returns {number} 剩余天数（可能为负数，表示已过期）
 */
export function getRemainingDays(createTime: string, validDays: number) {
  if (validDays === -1) {
    return '长期有效';
  }
  // 1. 解析创建时间为Date对象
  const createDate = new Date(createTime);
  if (isNaN(createDate.getTime())) {
    throw new Error("创建时间格式错误，请使用 'YYYY-MM-DD HH:mm:ss' 格式");
  }

  // 2. 计算有效期截止时间（创建时间 + 有效天数）
  const deadline: Date = new Date(createDate);
  deadline.setDate(deadline.getDate() + validDays); // 加N天

  // 3. 计算当前时间与截止时间的差值（毫秒）
  const now: Date = new Date();
  const diffMs: number = deadline.getTime() - now.getTime();

  // 4. 转换为天数（向上取整，不足1天按1天算）
  const remainingDays: number = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return remainingDays;
}

/**
 * 格式化时间字符串
 * @param {Date} date 需要格式化的时间
 * @param {String} format 时间格式
 * @returns 指定格式的时间字符串
 */
export const formatDateTime = (date: Date, format = 'YYYY-MM-DD HH:mm:ss') => {
  // 验证传入的 date 是否为有效的 Date 对象
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('传入的参数 date 不是有效的 Date 对象');
  }
  // 验证传入的 format 是否为有效的字符串
  if (typeof format !== 'string') {
    throw new Error('传入的参数 format 不是有效的字符串');
  }
  // 创建 replacements 对象，把占位符和对应的值关联起来。
  const replacements: any = {
    YYYY: date.getFullYear(),
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    DD: String(date.getDate()).padStart(2, '0'),
    HH: String(date.getHours()).padStart(2, '0'),
    mm: String(date.getMinutes()).padStart(2, '0'),
    ss: String(date.getSeconds()).padStart(2, '0'),
  };
  // 利用正则表达式 /YYYY|MM|DD|HH|mm|ss/g 匹配 format 字符串里的所有占位符，然后用 replacements 对象中的对应值替换
  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) => replacements[match]);
};

/**
 * 格式化日期字符串
 * @param {Date} date 需要格式化的日期
 * @param {String} format 日期格式
 * @returns 指定格式的日期字符串
 */
export const formatDate = (date: Date, format = 'YYYY-MM-DD') => {
  // 验证传入的 date 是否为有效的 Date 对象
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('传入的参数 date 不是有效的 Date 对象');
  }
  // 验证传入的 format 是否为有效的字符串
  if (typeof format !== 'string') {
    throw new Error('传入的参数 format 不是有效的字符串');
  }
  // 创建 replacements 对象，把占位符和对应的值关联起来。
  const replacements: any = {
    YYYY: date.getFullYear(),
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    DD: String(date.getDate()).padStart(2, '0'),
  };
  // 利用正则表达式 /YYYY|MM|DD|HH|mm|ss/g 匹配 format 字符串里的所有占位符，然后用 replacements 对象中的对应值替换
  return format.replace(/YYYY|MM|DD/g, (match) => replacements[match]);
};

/**
 * 表格时间格式化器
 * @param row
 * @param column
 * @param cellValue
 * @param index
 * @returns
 */
export const datetimeFormatter = (row: any, column: any, cellValue: string, index: number) => {
  return formatDateTime(new Date(cellValue)) || cellValue;
};

/**
 * 表格日期格式化器
 * @param row
 * @param column
 * @param cellValue
 * @param index
 * @returns
 */
export const dateFormatter = (row: any, column: any, cellValue: string, index: number) => {
  return formatDate(new Date(cellValue)) || cellValue;
};

/**
 * 表格时间格式化器
 * @param row
 * @param column
 * @param cellValue
 * @param index
 * @returns
 */
export const timeFormatter = (row: any, column: any, cellValue: string, index: number) => {
  return formatDateTime(new Date(cellValue), 'HH:mm:ss') || cellValue;
};

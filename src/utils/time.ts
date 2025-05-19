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

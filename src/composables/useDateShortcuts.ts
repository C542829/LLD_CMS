/** 快捷选项类型 */
interface Shortcut {
  text: string;
  value: [Date, Date] | (() => [Date, Date]);
}

/**
 * 日期快捷选项 composable
 * 提供常用的日期范围快捷选项，用于 DatePicker 和 DateTimePicker 组件
 */
export function useDateShortcuts() {
  /** 一天的毫秒数 */
  const DAY_MS = 24 * 60 * 60 * 1000;

  /** 获取今天的起止时间 */
  const getToday = (): [Date, Date] => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return [start, end];
  };

  /** 获取昨天的起止时间 */
  const getYesterday = (): [Date, Date] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today.getTime() - DAY_MS);
    const end = new Date(today.getTime() - 1);
    return [start, end];
  };

  /** 获取本周的起止时间（周一至今） */
  const getThisWeek = (): [Date, Date] => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date();
    const offset = start.getDay() - 1;
    start.setTime(start.getTime() - DAY_MS * offset);
    start.setHours(0, 0, 0, 0);
    return [start, end];
  };

  /** 获取本月的起止时间（月初至今） */
  const getThisMonth = (): [Date, Date] => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date();
    const offset = start.getDate() - 1;
    start.setTime(start.getTime() - DAY_MS * offset);
    start.setHours(0, 0, 0, 0);
    return [start, end];
  };

  /** 获取上月的起止时间 */
  const getLastMonth = (): [Date, Date] => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    end.setHours(23, 59, 59, 999);
    return [start, end];
  };

  /** 获取去年的起止时间 */
  const getLastYear = (): [Date, Date] => {
    const now = new Date();
    const year = now.getFullYear() - 1;
    const start = new Date(year, 0, 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(year, 11, 31);
    end.setHours(23, 59, 59, 999);
    return [start, end];
  };

  /** 获取最近 N 天的起止时间 */
  const getRecentDays = (days: number): [Date, Date] => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date();
    start.setTime(start.getTime() - DAY_MS * days);
    start.setHours(0, 0, 0, 0);
    return [start, end];
  };

  /** 快捷选项列表 */
  const shortcuts: Shortcut[] = [
    { text: '今天', value: () => getToday() },
    { text: '昨天', value: () => getYesterday() },
    { text: '本周', value: () => getThisWeek() },
    { text: '本月', value: () => getThisMonth() },
    { text: '上月', value: () => getLastMonth() },
    { text: '最近一个月', value: () => getRecentDays(30) },
    { text: '最近三个月', value: () => getRecentDays(90) },
    { text: '最近六个月', value: () => getRecentDays(180) },
    { text: '去年', value: () => getLastYear() },
    { text: '最近一年', value: () => getRecentDays(365) },
    { text: '最近两年', value: () => getRecentDays(730) },
  ];

  return { shortcuts };
}

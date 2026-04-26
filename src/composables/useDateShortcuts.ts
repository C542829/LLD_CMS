/** 快捷选项类型 */
interface Shortcut {
  text: string;
  value: [Date, Date] | (() => [Date, Date]);
}

/**
 * 获取营业日期
 * 凌晨 0:00 ~ 7:00 视为前一天的营业日，7:00 之后为当天
 * @returns 营业日期对应的 Date 对象（时分秒已归零）
 */
export function getBusinessDate(): Date {
  const now = new Date();
  const businessDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // 凌晨 0 点到早上 7 点，取前一天日期
  if (now.getHours() < 7) {
    businessDate.setDate(businessDate.getDate() - 1);
  }
  return businessDate;
}

/**
 * 日期快捷选项 composable
 * 提供常用的日期范围快捷选项，用于 DatePicker 和 DateTimePicker 组件
 * 业务规则：营业日为 07:00 ~ 次日 07:00，凌晨 0-7 点视为前一天
 */
export function useDateShortcuts() {
  /** 一天的毫秒数 */
  const DAY_MS = 24 * 60 * 60 * 1000;

  /** 获取今天（营业日）的起止时间 */
  const getToday = (): [Date, Date] => {
    const businessDate = getBusinessDate();
    const start = new Date(businessDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(businessDate);
    end.setHours(23, 59, 59, 999);
    return [start, end];
  };

  /** 获取昨天（营业日）的起止时间 */
  const getYesterday = (): [Date, Date] => {
    const businessDate = getBusinessDate();
    const start = new Date(businessDate.getTime() - DAY_MS);
    start.setHours(0, 0, 0, 0);
    const end = new Date(businessDate.getTime() - 1);
    end.setHours(23, 59, 59, 999);
    return [start, end];
  };

  /** 获取本周的起止时间（周一至营业日） */
  const getThisWeek = (): [Date, Date] => {
    const businessDate = getBusinessDate();
    const end = new Date(businessDate);
    end.setHours(23, 59, 59, 999);
    const start = new Date(businessDate);
    // getDay(): 周日=0, 周一=1,..., 周六=6 → 需要映射为 周一=0, 周二=1,..., 周日=6
    const offset = (start.getDay() + 6) % 7;
    start.setTime(start.getTime() - DAY_MS * offset);
    start.setHours(0, 0, 0, 0);
    return [start, end];
  };

  /** 获取本月的起止时间（月初至营业日） */
  const getThisMonth = (): [Date, Date] => {
    const businessDate = getBusinessDate();
    const end = new Date(businessDate);
    end.setHours(23, 59, 59, 999);
    const start = new Date(businessDate.getFullYear(), businessDate.getMonth(), 1);
    start.setHours(0, 0, 0, 0);
    return [start, end];
  };

  /** 获取上月的起止时间 */
  const getLastMonth = (): [Date, Date] => {
    const businessDate = getBusinessDate();
    const start = new Date(businessDate.getFullYear(), businessDate.getMonth() - 1, 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(businessDate.getFullYear(), businessDate.getMonth(), 0);
    end.setHours(23, 59, 59, 999);
    return [start, end];
  };

  /** 获取去年的起止时间 */
  const getLastYear = (): [Date, Date] => {
    const businessDate = getBusinessDate();
    const year = businessDate.getFullYear() - 1;
    const start = new Date(year, 0, 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(year, 11, 31);
    end.setHours(23, 59, 59, 999);
    return [start, end];
  };

  /** 获取最近 N 天的起止时间（基于营业日） */
  const getRecentDays = (days: number): [Date, Date] => {
    const businessDate = getBusinessDate();
    const end = new Date(businessDate);
    end.setHours(23, 59, 59, 999);
    const start = new Date(businessDate);
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

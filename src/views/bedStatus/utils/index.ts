import type { OrderDetailVO } from '@/api/order/types';
import { TimerStatus } from '@/enums/index';
/**
 * 格式化服务时间展示
 * 例：18:08 ~ 18:38 (预计)、18:08 ~ 18:38、18:08 ~ (暂停中)
 */
export const formatServiceTime = (row: OrderDetailVO): string => {
  if (!row.timerStartTime) return '--';

  const start = formatTimeToMinute(row.timerStartTime);
  const status = row.timerStatus;

  if (status === TimerStatus.Stopped) {
    // 已结束：显示实际结束时间
    const end = row.timerEndTime ? formatTimeToMinute(row.timerEndTime) : '--';
    return `${start} ~ ${end}`;
  }

  if (status === TimerStatus.Running) {
    // 进行中：显示预计结束时间
    const end = row.timerEndTime ? formatTimeToMinute(row.timerEndTime) : '--';
    return `${start} ~ ${end} (预计)`;
  }

  if (status === TimerStatus.Paused) {
    // 已暂停
    const end = row.timerEndTime ? formatTimeToMinute(row.timerEndTime) : '--';
    return `${start} ~ ${end} (暂停)`;
  }

  // 未开始：显示预计时间范围
  if (row.timerEndTime) {
    const end = formatTimeToMinute(row.timerEndTime);
    return `${start} ~ ${end} (预计)`;
  }

  return `${start} ~ --`;
};

/**
 * 格式化时间为 HH:mm
 */
export const formatTimeToMinute = (timeStr?: string): string => {
  if (!timeStr) return '--';
  const date = new Date(timeStr);
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
};

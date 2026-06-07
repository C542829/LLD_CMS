import { ref, computed, onUnmounted } from 'vue';
import { TimerStatus } from '@/enums/index';
import type { OrderDetailVO } from '@/api/order';

/** 到期提醒阈值（秒） */
const WARNING_THRESHOLD = 300;

/**
 * 计算倒计时剩余秒数
 * @param timerEndTime 预计结束时间字符串
 * @returns 剩余秒数，null 表示无需倒计时
 */
export function getCountdown(timerEndTime?: string): number | null {
  if (!timerEndTime) return null;
  const end = new Date(timerEndTime).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((end - now) / 1000));
}

/**
 * 格式化倒计时秒数为 MM:SS 或 H:MM:SS
 * @param seconds 秒数
 * @returns 格式化后的时间字符串
 */
export function formatCountdown(seconds: number | null): string {
  if (seconds === null || seconds === undefined) return '--:--';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * 格式化实际服务时长（秒 -> 分秒）
 * @param duration 秒数
 * @returns 格式化后的时长字符串
 */
export function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  if (minutes === 0) return `${seconds}秒`;
  if (seconds === 0) return `${minutes}分钟`;
  return `${minutes}分${seconds}秒`;
}

/**
 * 获取计时显示信息
 * @param detail 订单明细对象
 * @returns 计时显示信息对象
 */
export function getTimerDisplay(detail: OrderDetailVO) {
  switch (detail.timerStatus) {
    case TimerStatus.NotStarted:
      return { label: '未开始', type: 'info' as const, countdown: null, isWarning: false };
    case TimerStatus.Running: {
      const seconds = getCountdown(detail.timerEndTime);
      const isWarning = (seconds !== null && seconds <= WARNING_THRESHOLD) || detail.timerWarned === 1;
      return {
        label: formatCountdown(seconds),
        type: isWarning ? ('warning' as const) : ('primary' as const),
        countdown: seconds,
        isWarning,
      };
    }
    case TimerStatus.Paused:
      return { label: '已暂停', type: 'info' as const, countdown: null, isWarning: false };
    case TimerStatus.Stopped: {
      const duration = detail.actualDuration || 0;
      return {
        label: `已结束 ${formatDuration(duration)}`,
        type: 'success' as const,
        countdown: null,
        isWarning: false,
      };
    }
    default:
      return { label: '-', type: 'info' as const, countdown: null, isWarning: false };
  }
}

/**
 * 获取计时操作按钮状态
 * @param detail 订单明细对象
 * @returns 各操作按钮是否可用
 */
export function getTimerActions(detail: OrderDetailVO) {
  return {
    canStart: detail.timerStatus === TimerStatus.NotStarted,
    canPause: detail.timerStatus === TimerStatus.Running,
    canResume: detail.timerStatus === TimerStatus.Paused,
    canStop: detail.timerStatus === TimerStatus.Running || detail.timerStatus === TimerStatus.Paused,
  };
}

/**
 * 计时倒计时 Composable
 * 用于在组件中维护实时倒计时
 */
export function useTimer(detail: () => OrderDetailVO | undefined | null) {
  /** 倒计时剩余秒数（每秒更新） */
  const remainingSeconds = ref<number | null>(null);
  /** 是否处于到期提醒状态 */
  const isWarning = ref(false);

  let intervalId: ReturnType<typeof setInterval> | null = null;

  /** 当前计时状态显示 */
  const timerDisplay = computed(() => {
    const d = detail();
    if (!d) {
      return { label: '--', type: 'info' as const, isWarning: false };
    }
    return getTimerDisplay(d);
  });

  /** 格式化后的倒计时文本 */
  const formattedCountdown = computed(() => {
    return formatCountdown(remainingSeconds.value);
  });

  /** 更新倒计时值 */
  const updateCountdown = () => {
    const d = detail();
    if (!d || d.timerStatus !== TimerStatus.Running) {
      remainingSeconds.value = null;
      isWarning.value = false;
      return;
    }
    remainingSeconds.value = getCountdown(d.timerEndTime);
    isWarning.value =
      (remainingSeconds.value !== null && remainingSeconds.value <= WARNING_THRESHOLD) || d.timerWarned === 1;

    // 倒计时结束，停止定时器
    if (remainingSeconds.value === 0) {
      stopTick();
    }
  };

  /** 启动每秒更新 */
  const startTick = () => {
    stopTick();
    updateCountdown();
    intervalId = setInterval(updateCountdown, 1000);
  };

  /** 停止定时更新 */
  const stopTick = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  onUnmounted(() => {
    stopTick();
  });

  return {
    remainingSeconds,
    isWarning,
    timerDisplay,
    formattedCountdown,
    startTick,
    stopTick,
  };
}

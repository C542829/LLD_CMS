<template>
  <el-progress
    v-if="hasTimerData"
    type="circle"
    :percentage="percentage"
    :color="progressColor"
    :striped-flow="isRunning"
    :width="circleWidth"
  >
    <template #default>
      <span :class="['progress-text', { 'progress-text--warning': isWarning }]" :style="{ fontSize: `${textSize}px` }">
        {{ displayText }}
      </span>
    </template>
  </el-progress>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import type { OrderDetailVO } from '@/api/order/types';
import { TimerStatus, OrderDetailType } from '@/enums/index';
import { getCountdown, formatCountdown } from '@/composables/useTimer';

interface Props {
  /** 订单明细数据 */
  detail: OrderDetailVO;
  /** 服务总时长（秒），不传则自动从 timerStartTime/timerEndTime 计算 */
  totalTime?: number;
  /** 尺寸：default=71px, small=48px */
  size?: 'default' | 'small';
}

const props = withDefaults(defineProps<Props>(), {
  totalTime: 0,
  size: 'default',
});

/** 进度环宽度 */
const circleWidth = computed(() => (props.size === 'small' ? 48 : 71));

/** 文本字号 */
const textSize = computed(() => (props.size === 'small' ? 10 : 12));

/** 当前倒计时剩余秒数 */
const remaining = ref<number | null>(null);
/** 是否处于预警状态 */
const isWarning = ref(false);
let intervalId: ReturnType<typeof setInterval> | null = null;

/** 自动计算服务总时长（秒） */
const computedTotalTime = computed(() => {
  if (props.totalTime > 0) return props.totalTime;
  if (!props.detail.timerStartTime || !props.detail.timerEndTime) return 0;
  const start = new Date(props.detail.timerStartTime).getTime();
  const end = new Date(props.detail.timerEndTime).getTime();
  return Math.max(0, Math.round((end - start) / 1000));
});

/** 是否有计时数据可展示（仅服务项目） */
const hasTimerData = computed(() => {
  return (
    props.detail.bizType === OrderDetailType.Service &&
    props.detail.timerStatus !== undefined &&
    props.detail.timerStatus !== null
  );
});

/** 计算进度百分比 */
const percentage = computed(() => {
  if (props.detail.timerStatus === TimerStatus.NotStarted) return 0;
  if (props.detail.timerStatus === TimerStatus.Stopped) return 100;
  if (props.detail.timerStatus === TimerStatus.Paused) {
    // 暂停时根据已过时间计算进度
    const total = computedTotalTime.value;
    if (total <= 0) return 0;
    const seconds = getCountdown(props.detail.timerEndTime);
    if (seconds === null) return 0;
    const elapsed = total - seconds;
    return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
  }

  const total = computedTotalTime.value;
  if (total <= 0) return 0;
  const seconds = getCountdown(props.detail.timerEndTime);
  if (seconds === null) return 0;
  const elapsed = total - seconds;
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
});

/** 是否计时进行中 */
const isRunning = computed(() => props.detail.timerStatus === TimerStatus.Running);

/** 显示文本 */
const displayText = computed(() => {
  switch (props.detail.timerStatus) {
    case TimerStatus.NotStarted:
      return '待上钟';
    case TimerStatus.Running:
      return formatCountdown(remaining.value);
    case TimerStatus.Paused:
      return '已暂停';
    case TimerStatus.Stopped:
      return '已完成';
    default:
      return '--';
  }
});

/** 进度条颜色 */
const progressColor = computed(() => {
  if (isWarning.value) return '#E6A23C';
  switch (props.detail.timerStatus) {
    case TimerStatus.Stopped:
      return '#67C23A'; // 已完成-绿色
    case TimerStatus.Paused:
      return '#E6A23C'; // 已暂停-橙色
    case TimerStatus.NotStarted:
      return '#909399'; // 待上钟-灰色
    default:
      return '#409EFF'; // 计时中-蓝色
  }
});

/** 更新倒计时 */
const updateRemaining = () => {
  if (props.detail.timerStatus !== TimerStatus.Running) {
    remaining.value = null;
    isWarning.value = false;
    return;
  }
  remaining.value = getCountdown(props.detail.timerEndTime);
  isWarning.value = (remaining.value !== null && remaining.value <= 300) || props.detail.timerWarned === 1;
  if (remaining.value === 0) {
    stopInterval();
  }
};

/** 启动定时器 */
const startInterval = () => {
  stopInterval();
  updateRemaining();
  intervalId = setInterval(updateRemaining, 1000);
};

/** 停止定时器 */
const stopInterval = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

// 监听明细变化，重新计算
watch(
  () => [props.detail.timerStatus, props.detail.timerEndTime, props.detail.timerWarned],
  () => {
    if (props.detail.timerStatus === TimerStatus.Running) {
      startInterval();
    } else {
      stopInterval();
      updateRemaining();
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (props.detail.timerStatus === TimerStatus.Running) {
    startInterval();
  }
});

onUnmounted(() => {
  stopInterval();
});
</script>

<style scoped lang="scss">
.progress-text {
  font-size: 12px;
  color: #fff;
  font-weight: bold;

  &--warning {
    color: #e6a23c;
    animation: blink 1s infinite;
  }
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
</style>

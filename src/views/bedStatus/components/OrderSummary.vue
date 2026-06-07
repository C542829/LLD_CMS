<template>
  <div class="order-summary">
    <div class="order-summary__title">订单详情</div>
    <PaginationTable
      :data="dataList"
      :element-loading-text="LOADING_MSG"
      :border="true"
      :stripe="true"
      :showPagination="false"
      size="small"
    >
      <el-table-column label="名称" min-width="100">
        <template #default="{ row }">
          {{ row.businessName }}
        </template>
      </el-table-column>

      <el-table-column label="技师/上钟" width="170">
        <template #default="{ row }">
          <template v-if="row.bizType === OrderDetailType.Service">
            <!-- 技师行 -->
            <div class="technician-line">
              <span class="technician-label">技师:</span>
              <template v-if="row.technicians?.length">
                <template v-for="(item, tIdx) in row.technicians" :key="tIdx">
                  <span>
                    {{ item.userName }}
                    <template v-if="item.userCode">({{ item.userCode }})</template>
                  </span>
                  <span v-if="Number(tIdx) < row.technicians.length - 1">、</span>
                </template>
              </template>
              <template v-else>
                <span>{{ row.userName || '-' }}</span>
              </template>
              <ClockInTypeTag :type="row.serverType" />
            </div>
            <!-- 上钟时间行 -->
            <div class="technician-line">
              <span class="technician-label">上钟:</span>
              <span>{{ formatServiceTime(row) }}</span>
            </div>
          </template>
          <template v-else>
            <span>{{ row.userName || '-' }}</span>
          </template>
        </template>
      </el-table-column>

      <!-- 计时操作列 -->
      <el-table-column v-if="hasServiceItems" label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <template v-if="row.bizType === OrderDetailType.Service">
            <template v-if="row.timerStatus === TimerStatus.NotStarted">
              <el-button link type="success" size="small" @click="handleTimerAction(row, 'start')">开始</el-button>
            </template>
            <template v-else-if="row.timerStatus === TimerStatus.Running">
              <el-button link type="warning" size="small" @click="handleTimerAction(row, 'pause')">暂停</el-button>
              <el-button link type="danger" size="small" @click="handleTimerAction(row, 'stop')">停止</el-button>
            </template>
            <template v-else-if="row.timerStatus === TimerStatus.Paused">
              <el-button link type="success" size="small" @click="handleTimerAction(row, 'resume')">恢复</el-button>
              <el-button link type="danger" size="small" @click="handleTimerAction(row, 'stop')">停止</el-button>
            </template>
            <template v-else-if="row.timerStatus === TimerStatus.Stopped">
              <span class="text-gray-400 text-12px">已结束</span>
            </template>
          </template>
          <template v-else>
            <span class="text-gray-400">-</span>
          </template>
        </template>
      </el-table-column>
    </PaginationTable>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import { LOADING_MSG } from '@/utils/constants';
import { formatServiceTime } from '@/views/bedStatus/utils/index';
import { OrderDetailType, TimerStatus } from '@/enums/index';
import { reqTimerStart, reqTimerPause, reqTimerResume, reqTimerStop } from '@/api/order';
import Message from '@/components/Message';
import type { OrderDetailVO } from '@/api/order/types';
import { getTimerDisplay, formatCountdown, getCountdown } from '@/composables/useTimer';

const emit = defineEmits<{
  /** 计时操作完成后触发刷新 */
  (e: 'timer-action', detailId: number): void;
}>();

interface Props {
  /** 订单数据 */
  orderData?: any;
}

const props = defineProps<Props>();

// 倒计时定时器
let countdownInterval: ReturnType<typeof setInterval> | null = null;
/** 用于触发视图更新的响应式时间戳 */
const now = ref(Date.now());

/** 是否有服务项目明细 */
const hasServiceItems = computed(() => {
  return dataList.value.some((item: OrderDetailVO) => item.bizType === OrderDetailType.Service);
});

/** 订单明细列表 */
const dataList = computed(() => {
  if (!props.orderData) return [];
  if (Array.isArray(props.orderData.orderDetails)) {
    return props.orderData.orderDetails;
  }
  return [];
});

/**
 * 获取计时标签文本
 */
const getTimerLabel = (row: OrderDetailVO): string => {
  const display = getTimerDisplay(row);
  if (row.timerStatus === TimerStatus.Running) {
    const seconds = getCountdown(row.timerEndTime);
    return formatCountdown(seconds);
  }
  return display.label;
};

/**
 * 获取计时标签类型
 */
const getTimerTagType = (row: OrderDetailVO): string => {
  const display = getTimerDisplay(row);
  const typeMap: Record<string, string> = {
    info: 'info',
    primary: 'primary',
    warning: 'warning',
    success: 'success',
  };
  return typeMap[display.type] || 'info';
};

/**
 * 获取计时标签效果
 */
const getTimerEffect = (row: OrderDetailVO): string => {
  if (isTimerWarning(row)) return 'dark';
  return 'light';
};

/**
 * 是否处于预警状态
 */
const isTimerWarning = (row: OrderDetailVO): boolean => {
  const seconds = getCountdown(row.timerEndTime);
  return (
    (row.timerStatus === TimerStatus.Running && seconds !== null && seconds <= 300 && seconds > 0) ||
    row.timerWarned === 1
  );
};

/**
 * 处理计时操作
 */
const handleTimerAction = async (row: OrderDetailVO, action: 'start' | 'pause' | 'resume' | 'stop') => {
  const actionMap = {
    start: { api: reqTimerStart, msg: '开始计时', successMsg: '计时已开始' },
    pause: { api: reqTimerPause, msg: '暂停计时', successMsg: '计时已暂停' },
    resume: { api: reqTimerResume, msg: '恢复计时', successMsg: '计时已恢复' },
    stop: { api: reqTimerStop, msg: '停止计时', successMsg: '计时已停止' },
  };

  const config = actionMap[action];
  if (!row.id || !config) return;

  try {
    await config.api(row.id);
    Message.success(config.successMsg);
    emit('timer-action', row.id);
  } catch (error: any) {
    Message.error(error?.message || `${config.msg}失败`);
  }
};

/** 启动倒计时定时器（每秒更新以保持 UI 实时） */
const startCountdownTick = () => {
  stopCountdownTick();
  countdownInterval = setInterval(() => {
    now.value = Date.now();
  }, 1000);
};

/** 停止倒计时定时器 */
const stopCountdownTick = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
};

// 监听数据变化，有进行中的计时则启动定时器
watch(
  () => dataList.value,
  (list) => {
    const hasRunning = list.some((item: OrderDetailVO) => item.timerStatus === TimerStatus.Running);
    if (hasRunning) {
      startCountdownTick();
    } else {
      stopCountdownTick();
    }
  },
  { immediate: true },
);

onMounted(() => {
  const hasRunning = dataList.value.some((item: OrderDetailVO) => item.timerStatus === TimerStatus.Running);
  if (hasRunning) {
    startCountdownTick();
  }
});

onUnmounted(() => {
  stopCountdownTick();
});
</script>

<style lang="scss" scoped>
.order-summary {
  &__title {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
  }
}

.timer-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer-tag--warning {
  animation: timer-blink 1s infinite;
}

@keyframes timer-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>

<template>
  <!-- 服务中且有订单数据时，显示悬浮订单详情 -->
  <el-popover
    v-if="bedData.status === 1 && bedData.order"
    placement="right"
    :width="400"
    trigger="hover"
    :popper-class="'order-summary-popover'"
  >
    <template #reference>
      <div class="bed-card-box">
        <div class="bed-card">
          <!-- 卡片头部 -->
          <div class="bed-card__header">
            <div class="bed-card__header-left">
              <span>{{ bedData.bedName }}</span>
            </div>
            <div class="bed-card__header-right">
              <!-- <ModifyBed :bill="{}" /> -->
            </div>
          </div>

          <!-- 服务状态 -->
          <div class="bed-card__bottom bed-card__bottom--occupied">
            <div class="bed-card__info">
              <div class="bed-card__info-left">
                <span>服务中...</span>
                <span v-if="technicianNames" class="bed-card__technician" :title="technicianNames">
                  {{ technicianNames }}
                </span>
              </div>
              <div v-if="serviceDetails.length" class="bed-card__progress">
                <Progress :detail="mergedTimerDetail" :total-time="mergedTotalTime" />
              </div>
            </div>
            <div class="bed-card__option">
              <el-button @click="handleShowDrawer" type="primary" plain size="small">账单</el-button>
              <el-button @click="handleCheckout" type="primary" plain size="small">去结账</el-button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 订单详情内容 -->
    <OrderSummary :order-data="bedData.order" @timer-action="handleTimerAction" />
  </el-popover>

  <!-- 空闲状态或服务中但无订单数据时，不显示悬浮框 -->
  <div v-else class="bed-card-box">
    <div class="bed-card">
      <!-- 卡片头部 -->
      <div class="bed-card__header">
        <div class="bed-card__header-left">
          <span>{{ bedData.bedName }}</span>
        </div>
        <div v-if="bedData.status === 1" class="bed-card__header-right">
          <!-- <ModifyBed :bill="{}" /> -->
        </div>
      </div>

      <!-- 空闲状态 -->
      <div v-if="bedData.status === 0" class="bed-card__bottom bed-card__bottom--free">
        <div class="bed-card__info">
          <div class="bed-card__info-left">
            <span>空闲中...</span>
          </div>
        </div>
        <div class="bed-card__option">
          <el-button @click="handleCreate" type="primary" plain size="small">开单</el-button>
        </div>
      </div>

      <!-- 服务状态（无订单数据） -->
      <div v-if="bedData.status === 1 && !bedData.order" class="bed-card__bottom bed-card__bottom--occupied">
        <div class="bed-card__info">
          <div class="bed-card__info-left">
            <span>服务中...</span>
          </div>
          <div class="bed-card__progress">
            <!-- 无订单数据时不显示进度 -->
          </div>
        </div>
        <div class="bed-card__option">
          <el-button @click="handleShowDrawer" type="primary" plain size="small">账单</el-button>
          <el-button @click="handleCheckout" type="primary" plain size="small">去结账</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import OrderSummary from './OrderSummary.vue';
import Progress from './Progress.vue';
import { CashierRouteSign, OrderDetailType, TimerStatus } from '@/enums/index';
import { computed } from 'vue';
import type { OrderDetailVO } from '@/api/order/types';
import { getCountdown } from '@/composables/useTimer';

// Props 定义
interface Props {
  /** 床位数据 */
  bedData: {
    id: number;
    bedName: string;
    status: number;
    order?: any;
  };
}

const props = defineProps<Props>();

// Emits 定义
interface Emits {
  /** 结账/开单事件 */
  (e: 'checkout', data: any, sign: CashierRouteSign): void;
  /** 显示抽屉事件 */
  (e: 'showDrawer', data: any): void;
  /** 计时操作完成后需要刷新 */
  (e: 'refresh'): void;
}

const emit = defineEmits<Emits>();

/** 获取所有服务项目的明细 */
const serviceDetails = computed<OrderDetailVO[]>(() => {
  const details = props.bedData.order?.orderDetails;
  if (!Array.isArray(details)) return [];
  return details.filter((d: OrderDetailVO) => d.bizType === OrderDetailType.Service);
});

/**
 * 计算单个服务项目的剩余秒数
 * Running/Paused: 基于倒计时; NotStarted: 返回完整时长; Stopped: 0
 */
const getDetailRemaining = (d: OrderDetailVO): number => {
  if (d.timerStatus === TimerStatus.Stopped) return 0;
  if (d.timerStatus === TimerStatus.NotStarted) {
    if (!d.timerStartTime || !d.timerEndTime) return 0;
    return Math.round((new Date(d.timerEndTime).getTime() - new Date(d.timerStartTime).getTime()) / 1000);
  }
  // Running / Paused
  const countdown = getCountdown(d.timerEndTime);
  return countdown ?? 0;
};

/**
 * 计算单个服务项目的总时长（秒）
 */
const getDetailDuration = (d: OrderDetailVO): number => {
  if (!d.timerStartTime || !d.timerEndTime) return 0;
  return Math.round((new Date(d.timerEndTime).getTime() - new Date(d.timerStartTime).getTime()) / 1000);
};

/** 进行中/暂停中的服务项目（用于倒计时） */
const activeServiceDetails = computed<OrderDetailVO[]>(() => {
  return serviceDetails.value.filter(
    (d) => d.timerStatus === TimerStatus.Running || d.timerStatus === TimerStatus.Paused,
  );
});

/** 待上钟的服务项目 */
const pendingServiceDetails = computed<OrderDetailVO[]>(() => {
  return serviceDetails.value.filter((d) => d.timerStatus === TimerStatus.NotStarted);
});

/** 是否有待上钟的项目（且同时有进行中的项目） */
const hasPendingHint = computed(() => {
  return pendingServiceDetails.value.length > 0 && activeServiceDetails.value.length > 0;
});

/** 合并后的服务总时长（秒），仅计算进行中/暂停中的项目 */
const mergedTotalTime = computed(() => {
  return activeServiceDetails.value.reduce((sum, d) => sum + getDetailDuration(d), 0);
});

/** 合并后的剩余总秒数，仅计算进行中/暂停中的项目 */
const mergedRemainingSeconds = computed(() => {
  return activeServiceDetails.value.reduce((sum, d) => sum + getDetailRemaining(d), 0);
});

/**
 * 合并后的整体计时状态
 * 优先基于进行中/暂停项目判断：Running > Paused
 * 无活跃项目时：有待上钟→NotStarted，全部结束→Stopped
 */
const mergedTimerStatus = computed(() => {
  const active = activeServiceDetails.value;
  if (active.length > 0) {
    const statuses = new Set(active.map((d) => d.timerStatus));
    if (statuses.has(TimerStatus.Running)) return TimerStatus.Running;
    return TimerStatus.Paused;
  }
  if (pendingServiceDetails.value.length > 0) return TimerStatus.NotStarted;
  return TimerStatus.Stopped;
});

/** 是否有活跃项目被预警（仅基于进行中/暂停中的项目判断） */
const mergedTimerWarned = computed(() => {
  return activeServiceDetails.value.some((d) => d.timerWarned === 1) ? 1 : 0;
});

/**
 * 将多个服务项目合并为一个合成 detail 供 Progress 组件使用
 * timerEndTime 设为"当前时间 + 剩余秒数"，让 Progress 内部倒计时逻辑正常工作
 */
const mergedTimerDetail = computed<OrderDetailVO>(() => {
  const remaining = mergedRemainingSeconds.value;
  const syntheticEndTime = remaining > 0 ? new Date(Date.now() + remaining * 1000).toISOString() : undefined;
  const total = mergedTotalTime.value;
  const syntheticStartTime = total > 0 ? new Date(Date.now() - (total - remaining) * 1000).toISOString() : undefined;
  return {
    id: 0,
    bizType: OrderDetailType.Service,
    businessName:
      serviceDetails.value.length > 1
        ? `${serviceDetails.value.length}项服务`
        : serviceDetails.value[0]?.businessName || '',
    timerStatus: mergedTimerStatus.value,
    timerStartTime: syntheticStartTime,
    timerEndTime: syntheticEndTime,
    timerWarned: mergedTimerWarned.value,
    actualDuration: total - remaining,
  } as OrderDetailVO;
});

const technicianNames = computed(() => {
  const order = props.bedData.order;
  if (!order?.orderDetails?.length) return '';
  const names = new Set<string>();
  for (const detail of order.orderDetails) {
    if (detail.technicians?.length) {
      for (const t of detail.technicians) {
        if (t.userName) names.add(t.userName);
      }
    } else if (detail.userName) {
      names.add(detail.userName);
    }
  }
  return [...names].join('、');
});

/** 开单操作 */
const handleCreate = () => {
  emit('checkout', props.bedData, CashierRouteSign.Create);
};

/** 显示抽屉 */
const handleShowDrawer = () => {
  emit('showDrawer', props.bedData);
};

/** 去结账 */
const handleCheckout = () => {
  emit('checkout', props.bedData, CashierRouteSign.Settle);
};

/** 计时操作完成后触发刷新 */
const handleTimerAction = () => {
  emit('refresh');
};
</script>

<style scoped lang="scss">
.bed-card-box {
  color: #fff;
  width: 230px;
  height: 150px;
  margin: 10px 10px 30px 10px;
  border-radius: 5px;
  overflow: hidden;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 0 10px #68afff;
    transform: translateY(-1px);
  }

  .bed-card {
    height: 100%;
    display: flex;
    flex-direction: column;

    &__header {
      height: 30px;
      line-height: 30px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
      background-image: linear-gradient(to right top, #68afff, #b3d6ff);

      &-left {
        flex: 1;
      }
    }

    &__bottom {
      font-size: 14px;
      flex: 1;
      padding: 10px;
      line-height: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      &--free {
        background-image: linear-gradient(to right top, #68afff, #b3d6ff);
      }

      &--occupied {
        background-image: linear-gradient(to right top, #68afff, #e280f3);
      }
    }

    &__info {
      flex: 1;
      display: flex;
      align-items: center;

      &-left {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
    }

    &__technician {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.85);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
    }

    &__progress {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &__pending-hint {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.85);
      margin-top: 2px;
    }

    &__option {
      height: 24px;
      display: flex;
      gap: 8px;
    }
  }
}
</style>

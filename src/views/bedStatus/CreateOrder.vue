<template>
  <Drawer v-model="drawerVisible" :title="drawerTitle" @closed="closeDrawer" size="550px" style="max-width: 600px">
    <div v-loading="loading">
      <!-- 客户信息 -->
      <el-descriptions size="large" :column="1">
        <el-descriptions-item label="床位名称：">{{ orderStore.order.bedName }}</el-descriptions-item>
        <el-descriptions-item label="顾客类型：">
          <el-radio-group v-model="orderStore.order.customerType" :disabled="true">
            <el-radio
              v-for="item in CustomerTypeOptions"
              :value="item.value"
              :label="item.label"
              :key="item.value"
              :border="true"
            />
          </el-radio-group>
        </el-descriptions-item>
        <el-descriptions-item v-show="orderStore.order.customerType == CustomerType.Member" label="开单会员：">
          <!-- <SearchMember
            v-model="orderStore.order.vipName"
            size="default"
            :showSearchButton="false"
            :disabled="true"
            @selected="handleMemberSelected"
          /> -->
          <el-input
            v-model="orderStore.order.vipName"
            placeholder="请输入会员姓名"
            clearable
            :disabled="true"
            class="w-180"
          />
        </el-descriptions-item>
        <el-descriptions-item v-show="orderStore.order.customerType == CustomerType.Guest" label="散客姓名：">
          <el-input
            v-model="orderStore.order.customerName"
            placeholder="请输入散客姓名"
            clearable
            :disabled="true"
            class="w-180"
          />
        </el-descriptions-item>
      </el-descriptions>

      <!-- 订单信息 -->
      <Card padding="0px">
        <!-- <div style="margin: 10px 0 0 10px">
          <el-button type="primary" :disabled="type == 'view'" @click="showDialog(false)">新增明细</el-button>
        </div> -->
        <PaginationTable :data="orderStore.order.orderDetails" :showPagination="false" size="small">
          <el-table-column prop="businessName" label="名称" min-width="50" />
          <el-table-column prop="truePrice" label="价格" min-width="50">
            <template #default="{ row }">
              <p class="text">标准价￥{{ row.stdPrice }}</p>
              <p class="text">实收价￥{{ row.trueUnitPrice }}</p>
            </template>
          </el-table-column>
          <el-table-column label="技师/上钟" min-width="100">
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
          <!-- 计时状态列：仅服务项目显示 -->
          <!-- <el-table-column v-if="hasServiceItems" label="计时" width="120">
            <template #default="{ row }">
              <template v-if="row.bizType === OrderDetailType.Service">
                <el-tag
                  :type="getTimerTagType(row)"
                  :effect="getTimerEffect(row)"
                  size="small"
                  :class="{ 'timer-tag--warning': isTimerWarning(row) }"
                >
                  {{ getTimerLabel(row) }}
                </el-tag>
              </template>
              <template v-else>
                <span class="text-gray-400">-</span>
              </template>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button @click="deleteOrderDetail(row)" link size="small" type="danger">删除</el-button>
              <br />
              <!-- 计时操作按钮 -->
              <template v-if="row.bizType === OrderDetailType.Service">
                <template v-if="row.timerStatus === TimerStatus.NotStarted">
                  <el-button link type="success" size="small" @click="handleTimerAction(row, 'start')">上钟</el-button>
                </template>
                <template v-else-if="row.timerStatus === TimerStatus.Running">
                  <el-button link type="warning" size="small" @click="handleTimerAction(row, 'pause')">暂停</el-button>
                  <el-button link type="danger" size="small" @click="handleTimerAction(row, 'stop')">停止</el-button>
                </template>
                <template v-else-if="row.timerStatus === TimerStatus.Paused">
                  <el-button link type="success" size="small" @click="handleTimerAction(row, 'resume')">恢复</el-button>
                  <el-button link type="danger" size="small" @click="handleTimerAction(row, 'stop')">停止</el-button>
                </template>
                <!-- <template v-else-if="row.timerStatus === TimerStatus.Stopped">
                  <span class="text-gray-400 text-12px">已结束</span>
                </template> -->
              </template>
            </template>
          </el-table-column>
        </PaginationTable>
      </Card>

      <!-- 操作 -->
      <footer style="text-align: center; margin: 20px 0">
        <el-button type="default" @click="closeDrawer">关闭</el-button>
        <!-- <el-button v-if="type === 'add'" type="primary" @click="createOrder">开单</el-button> -->
        <el-button v-if="type === 'view'" type="primary" @click="goCheckout">去结账</el-button>
        <el-button v-if="type === 'view'" type="danger" :loading="btnLoading" @click="handleCancel">取消订单</el-button>
      </footer>
    </div>
  </Drawer>

  <!-- <DetailForm v-model="dialogVisible" :handleType="handleType"></DetailForm> -->
</template>

<script setup lang="ts">
import Message from '@/components/Message';
import DetailForm from './DetailForm.vue';
import SearchMember from '@/components/Input/SearchMember.vue';
import { ref, onMounted, watch, computed, onUnmounted } from 'vue';
import { cloneDeep } from 'lodash';
import {
  reqCancelOrder,
  reqDeleteOrderDetail,
  reqQueryOrderByBedId,
  reqTimerStart,
  reqTimerPause,
  reqTimerResume,
  reqTimerStop,
  Types,
} from '@/api/order';
import {
  CashierRouteSign,
  CustomerType,
  CustomerTypeOptions,
  OrderDetailType,
  ServiceType,
  ServiceTypeMap,
  TimerStatus,
} from '@/enums/index';
import { useOrderStore } from '@/store/modules/order/index';
import { getCountdown, formatCountdown, formatDuration } from '@/composables/useTimer';
import type { OrderDetailVO } from '@/api/order/types';

const orderStore = useOrderStore();

// #region 初始化信息

const emit = defineEmits(['update:model-value', 'close', 'refresh', 'checkout']);

interface Props {
  modelValue: boolean;
  type: DialogType;
  params: any;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'view',
  params: () => ({}),
});

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      getOrderInfo();
    }
    drawerVisible.value = val;
  },
);

watch(
  () => props.type,
  (val: DialogType) => {
    if (val === 'view') {
      drawerTitle.value = '账单';
    } else if (val === 'add') {
      drawerTitle.value = '开单';
    }
  },
);

// #endregion 初始化信息

// 加载状态
const loading = ref(false);
const btnLoading = ref(false);
// 抽屉信息
const drawerVisible = ref(false);
const drawerTitle = ref('账单');

/** 倒计时定时器 */
let countdownInterval: ReturnType<typeof setInterval> | null = null;
/** 触发视图更新的响应式时间戳 */
const now = ref(Date.now());

/** 是否有服务项目明细 */
const hasServiceItems = computed(() => {
  return orderStore.order.orderDetails?.some((item: OrderDetailVO) => item.bizType === OrderDetailType.Service);
});

/** 关闭抽屉 */
const closeDrawer = () => {
  drawerVisible.value = false;
  stopCountdownTick();
  emit('update:model-value', false);
  emit('close');
};

/**
 * 查询订单信息
 */
const getOrderInfo = async () => {
  try {
    loading.value = true;
    const res = await reqQueryOrderByBedId(props.params.id);
    orderStore.order = res.data as Types.OrderSettleDTO;
    // 有进行中的计时则启动倒计时
    const hasRunning = orderStore.order.orderDetails?.some(
      (item: OrderDetailVO) => item.timerStatus === TimerStatus.Running,
    );
    if (hasRunning) {
      startCountdownTick();
    }
  } catch (error) {
    console.error('查询订单信息失败：', error);
  } finally {
    loading.value = false;
  }
};

/** 取消订单 */
const handleCancel = async () => {
  btnLoading.value = true;
  try {
    const res = await reqCancelOrder(orderStore.order.id);
    orderStore.reset();
    emit('close');
    emit('refresh');
    Message.success('取消订单成功');
  } catch (error) {
    Message.error('取消订单失败');
  } finally {
    btnLoading.value = false;
  }
};

/** 去结账 */
const goCheckout = () => {
  const params = {
    id: orderStore.order.bedId,
    bedName: orderStore.order.bedName,
  };
  emit('checkout', { params, sign: CashierRouteSign.Settle });
};

/**
 * 处理删除订单明细项事件
 * @param item 订单明细项
 */
const deleteOrderDetail = async (item: any) => {
  try {
    loading.value = true;
    const res = await reqDeleteOrderDetail(item.id);
    const index = orderStore.order.orderDetails.findIndex((detail: any) => detail.id === item.id);
    orderStore.order.orderDetails.splice(index, 1);
  } catch (error) {
    console.log('删除订单明细项失败：', error);
  } finally {
    loading.value = false;
  }
};

const handleMemberSelected = (item: any) => {
  // console.log('会员', item);
  orderStore.order.vipId = item.id;
  orderStore.order.vipName = item.name;
  orderStore.order.vipPhoneNumber = item.phoneNumber;
  orderStore.order.vipCardNumber = item.cardNumber;
};

// #region 计时相关方法

/**
 * 格式化服务时间展示
 * 例：18:08 ~ 18:38 (预计)、18:08 ~ 18:38、18:08 ~ (暂停中)
 */
const formatServiceTime = (row: OrderDetailVO): string => {
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
const formatTimeToMinute = (timeStr?: string): string => {
  if (!timeStr) return '--';
  const date = new Date(timeStr);
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
};

/**
 * 获取计时标签文本
 */
const getTimerLabel = (row: OrderDetailVO): string => {
  switch (row.timerStatus) {
    case TimerStatus.NotStarted:
      return '未开始';
    case TimerStatus.Running: {
      const seconds = getCountdown(row.timerEndTime);
      return formatCountdown(seconds);
    }
    case TimerStatus.Paused:
      return '已暂停';
    case TimerStatus.Stopped: {
      const duration = row.actualDuration || 0;
      const minutes = Math.round(duration / 60);
      return `已结束 ${minutes}分钟`;
    }
    default:
      return '-';
  }
};

/**
 * 获取计时标签类型
 */
const getTimerTagType = (row: OrderDetailVO): string => {
  if (row.timerStatus === TimerStatus.Stopped) return 'success';
  if (isTimerWarning(row)) return 'warning';
  if (row.timerStatus === TimerStatus.Running) return 'primary';
  return 'info';
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
    // 操作完成后刷新订单数据
    await getOrderInfo();
    emit('refresh');
  } catch (error: any) {
    Message.error(error?.message || `${config.msg}失败`);
  }
};

/** 启动倒计时定时器 */
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

// #endregion 计时相关方法

// #region 新增开单明细
const dialogVisible = ref(false);
const handleType = ref('add');
const showDialog = (type: boolean, row: any = {}) => {
  //   if (orderStore.order.customerType === CustomerType.Member && !orderStore.order.vipId) {
  //     Message.warning('请选择会员');
  //     return;
  //   }
  //   if (orderStore.order.customerType === CustomerType.Guest && !orderStore.order.customerName) {
  //     Message.warning('请输入散客姓名');
  //     return;
  //   }
  //   dialogVisible.value = true;
  //   if (type) {
  //     // 编辑
  //     handleType.value = 'edit';
  //     orderStore.detailForm = cloneDeep(row);
  //   } else {
  //     // 新增
  //     handleType.value = 'add';
  //     orderStore.resetDetailForm();
  //   }
};

onUnmounted(() => {
  stopCountdownTick();
});
</script>

<style scoped lang="scss">
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

.technician-line {
  display: flex;
  align-items: center;
  gap: 4px;
  line-height: 1.6;
}

.technician-label {
  color: #909399;
  flex-shrink: 0;
}
</style>

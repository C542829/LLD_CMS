<template>
  <div class="bed-status-container">
    <div class="top-header">
      <h1>床位状态</h1>
      <div class="top-header-right">
        <el-button type="success" @click="handleRefresh">刷新状态</el-button>
      </div>
    </div>

    <!-- 床位列表 -->
    <div v-loading="loading" :element-loading-text="LOADING_MSG" class="bed-status-content">
      <BedCard
        v-for="item in bedList"
        :key="item.id"
        :bed-data="item"
        @checkout="checkout"
        @show-drawer="showDrawer"
        @refresh="handleRefresh"
      />
    </div>

    <CreateOrder
      v-model="drawer.visible"
      :type="drawer.type"
      :params="drawer.params"
      @close="closeDrawer"
      @refresh="handleRefresh"
      @checkout="checkout"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { BedStatus, CashierRouteSign, TimerStatus } from '@/enums/index';
import { reqQueryOrderByBedId } from '@/api/order/index';
import type { OrderDetailVO } from '@/api/order/types';
import { LOADING_MSG } from '@/utils/constants';
import Message from '@/components/Message';
import { getCountdown } from '@/composables/useTimer';

import BedCard from './components/BedCard.vue';
import CreateOrder from './CreateOrder.vue';

// 引入数据仓库
import { useMasterDataStore } from '@/store/modules/masterData/index';
import { useOrderStore } from '@/store/modules/order/index';

const masterDataStore = useMasterDataStore();
const orderStore = useOrderStore();

// 加载状态
const loading = ref(false);

const router = useRouter();

/** 轮询定时器 */
let pollingTimer: ReturnType<typeof setInterval> | null = null;
/** 到期提醒检查定时器 */
let warningTimer: ReturnType<typeof setInterval> | null = null;
/** 轮询间隔（毫秒） */
const POLLING_INTERVAL = 60 * 1000;
/** 到期提醒检查间隔（毫秒） */
const WARNING_CHECK_INTERVAL = 10 * 1000;
/** 已提醒的明细 ID 集合，避免重复提醒 */
const warnedDetailIds = new Set<number>();

onMounted(async () => {
  getBedList();
  // 启动轮询，每 30 秒刷新一次床位数据
  pollingTimer = setInterval(() => {
    getBedList();
  }, POLLING_INTERVAL);

  // 启动到期提醒检查，每 10 秒检查一次
  warningTimer = setInterval(() => {
    checkTimerWarnings();
  }, WARNING_CHECK_INTERVAL);
});

onUnmounted(() => {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
  if (warningTimer) {
    clearInterval(warningTimer);
    warningTimer = null;
  }
  warnedDetailIds.clear();
});

// 床列表
const bedList: any = ref([]);

// 订单数据缓存 Map<bedId, orderData>
const orderCache = new Map<number, any>();

/** 刷新状态（手动） */
const handleRefresh = async () => {
  // 刷新时清除缓存，确保获取最新数据
  orderCache.clear();
  await getBedList();
};

/** 获取床列表 */
const getBedList = async () => {
  try {
    loading.value = true;
    bedList.value = await masterDataStore.getAllBedList();

    // 获取所有服务中的床位的订单数据
    setTimeout(() => {
      fetchOccupiedBedOrders();
    }, 200);
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

/**
 * 批量获取服务中床位的订单数据
 * 并行请求 + 缓存
 */
const fetchOccupiedBedOrders = async () => {
  // 筛选服务中的床位
  const occupiedBeds = bedList.value.filter((bed: any) => bed.status === BedStatus.Occupied);

  if (occupiedBeds.length === 0) return;

  // 并行请求所有服务中床位的订单数据
  const orderPromises = occupiedBeds.map(async (bed: any) => {
    try {
      // 请求订单数据（不使用缓存以获取最新计时状态）
      const res = await reqQueryOrderByBedId(bed.id);
      const order = res.data || null;

      // 缓存订单数据
      if (order) {
        orderCache.set(bed.id, order);
      }

      return { bedId: bed.id, order };
    } catch (error) {
      console.error(`获取床位 ${bed.bedName} 订单失败:`, error);
      return { bedId: bed.id, order: orderCache.get(bed.id) || null };
    }
  });

  // 等待所有请求完成
  const results = await Promise.all(orderPromises);

  // 将订单数据合并到床位数据中
  results.forEach(({ bedId, order }) => {
    const bed = bedList.value.find((b: any) => b.id === bedId);
    if (bed) {
      bed.order = order;
    }
  });
};

/**
 * 检查所有服务中床位的计时到期提醒
 * 使用前端本地计算方式，更实时
 */
const checkTimerWarnings = () => {
  for (const bed of bedList.value) {
    if (bed.status !== BedStatus.Occupied || !bed.order?.orderDetails) continue;

    for (const detail of bed.order.orderDetails as OrderDetailVO[]) {
      // 仅检查进行中的服务项目计时
      if (detail.timerStatus !== TimerStatus.Running || !detail.id) continue;

      const countdown = getCountdown(detail.timerEndTime);
      // 5 分钟内到期且尚未提醒
      if (countdown !== null && countdown <= 300 && countdown > 0 && !warnedDetailIds.has(detail.id)) {
        warnedDetailIds.add(detail.id);
        Message.warning(`${detail.businessName} 即将结束（剩余 ${Math.ceil(countdown / 60)} 分钟）`);
      }
    }
  }
};

/**
 * 去结账
 * @param data 账单数据
 */
const checkout = (data: any, sign: CashierRouteSign) => {
  router.push({
    path: '/saleMain',
    query: {
      bedId: data.id,
      bedName: data.bedName,
      sign,
    },
  });
};

// 抽屉参数
const drawer: any = reactive({
  type: 'add',
  visible: false,
  params: {},
});

// 显示抽屉
const showDrawer = (item: any) => {
  if (item.status === BedStatus.Available) {
    drawer.type = 'add';
    drawer.params = item;
  } else if (item.status === BedStatus.Occupied) {
    drawer.type = 'view';
    drawer.params = item;
  }
  drawer.visible = true;
};

/** 关闭抽屉 */
const closeDrawer = () => {
  drawer.visible = false;
  orderStore.reset();
};
</script>

<style scoped lang="scss">
.bed-status-container {
  display: flex;
  flex-direction: column;

  > .top-header {
    color: #fff;
    font-size: 18px;
    text-align: center;
    font-weight: bold;
    height: $base-tabbar-height;
    line-height: $base-tabbar-height;
    background-color: var(--el-color-primary-light-5);
    margin-bottom: $main-padding;
    position: relative;
    .top-header-right {
      position: absolute;
      top: -3px;
      right: 12px;
    }
  }

  .bed-status-content {
    max-height: calc(100vh - $base-tabbar-height * 2 - $main-padding * 4);
    overflow: auto;
    padding: 0 $main-padding;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}
</style>

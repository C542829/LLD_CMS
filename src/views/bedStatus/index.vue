<template>
  <div class="bed-status-container">
    <div class="top-header">
      <h1>床位状态</h1>
      <div class="top-header-right">
        <el-button type="success" @click="getBedList">刷新状态</el-button>
      </div>
    </div>

    <!-- 床位列表 -->
    <div v-loading="loading" :element-loading-text="LOADING_MSG" class="bed-status-content">
      <BedCard v-for="item in bedList" :key="item.id" :bed-data="item" @checkout="checkout" @show-drawer="showDrawer" />
    </div>

    <CreateOrder
      v-model="drawer.visible"
      :type="drawer.type"
      :params="drawer.params"
      @close="closeDrawer"
      @refresh="getBedList"
      @checkout="checkout"
    />
  </div>
</template>

<script setup lang="ts">
import BedCard from './components/BedCard.vue';
import CreateOrder from './CreateOrder.vue';

import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { BedStatus, CashierRouteSign } from '@/enums/index';
import { reqQueryOrderByBedId } from '@/api/order/index';
import { LOADING_MSG } from '@/utils/constants';
// 引入数据仓库
import { useMasterDataStore } from '@/store/modules/masterData/index';
import { useOrderStore } from '@/store/modules/order/index';

const masterDataStore = useMasterDataStore();
const orderStore = useOrderStore();

// 加载状态
const loading = ref(false);

const router = useRouter();

let timer: any = null;

onMounted(async () => {
  getBedList();
  // timer = setInterval(() => {
  //   getBedList();
  // }, 1000 * 30);
});

onUnmounted(() => {
  clearInterval(timer);
});

// 床列表
const bedList: any = ref([]);

// 订单数据缓存 Map<bedId, orderData>
const orderCache = new Map<number, any>();

/** 获取床列表 */
const getBedList = async () => {
  try {
    loading.value = true;
    bedList.value = await masterDataStore.getAllBedList();

    // 获取所有服务中的床位的订单数据
    timer = setTimeout(() => {
      fetchOccupiedBedOrders();
    }, 200);
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

/**
 * 批量获取服务中床位的订单数据
 * 方案一：并行请求 + 缓存
 */
const fetchOccupiedBedOrders = async () => {
  // 筛选服务中的床位
  const occupiedBeds = bedList.value.filter((bed: any) => bed.status === BedStatus.Occupied);

  if (occupiedBeds.length === 0) return;

  // 并行请求所有服务中床位的订单数据
  const orderPromises = occupiedBeds.map(async (bed: any) => {
    try {
      // 检查缓存
      if (orderCache.has(bed.id)) {
        return { bedId: bed.id, order: orderCache.get(bed.id) };
      }

      // 请求订单数据
      const res = await reqQueryOrderByBedId(bed.id);
      const order = res.data || null;

      // 缓存订单数据
      if (order) {
        orderCache.set(bed.id, order);
      }

      return { bedId: bed.id, order };
    } catch (error) {
      console.error(`获取床位 ${bed.bedName} 订单失败:`, error);
      return { bedId: bed.id, order: null };
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

<template>
  <div v-loading="loading" style="height: 100%">
    <div class="top-content">
      <div class="top-item"></div>
      <div class="top-item search">
        <SearchMember v-model="inputValue" size="default" :showSearchButton="false" @selected="handleSelect" />
      </div>
      <div class="top-item"></div>
      <div class="top-item bed">
        <div class="bed-info" v-show="orderStore.order.bedId">
          <div>
            <span>床位：</span>
            <span>{{ orderStore.order.bedName }}</span>
            <span>&nbsp;{{ getBedStatus }}</span>
          </div>
          <div @click="clearOrder" class="hover-pointer">
            <el-icon :size="24"><Close /></el-icon>
          </div>
        </div>
      </div>
      <div class="top-item"></div>
      <div class="top-item">
        <el-dropdown placement="bottom" trigger="click" @command="selectBed" @visible-change="visibleDropdown">
          <el-button plain>选择床位订单</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="bed" v-for="bed in bedList" :key="bed.id">
                <span>{{ bed.bedName }}</span>
                &nbsp;&nbsp;
                <span :style="{ color: bed.status === 0 ? 'green' : 'red' }">
                  {{ bed.status === 0 ? '空闲' : '占用' }}
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="top-item"></div>
    </div>
    <div class="main-content">
      <div class="main-item">
        <div class="left-tab">
          <el-radio-group v-model="tabSwitch">
            <el-radio-button :value="0" :border="true" size="large">添加产品、项目、疗程</el-radio-button>
            <el-radio-button :value="1" :border="true" size="large">会员卡详情</el-radio-button>
          </el-radio-group>
        </div>
        <div class="left-tab-content">
          <el-tabs
            v-show="tabSwitch === 0"
            tab-position="left"
            type="border-card"
            style="height: 100%"
            class="scale-tabs"
          >
            <el-tab-pane label="项目">
              <ServiceItemList />
            </el-tab-pane>
            <el-tab-pane label="产品">
              <ProductList />
            </el-tab-pane>
            <el-tab-pane label="疗程">
              <TreatmentCouponList />
            </el-tab-pane>
          </el-tabs>
          <MemberInfo v-show="tabSwitch === 1" />
        </div>
      </div>
      <div class="main-item">
        <OrderList @update-order="setOrderByBed" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Message from '@/components/Message';
import MessageBox from '@/components/MessageBox';
import SearchMember from '@/components/Input/SearchMember.vue';
import ProductList from './components/ProductList.vue';
import ServiceItemList from './components/ServiceItemList.vue';
import TreatmentCouponList from './components/TreatmentCouponList.vue';
import MemberInfo from './components/MemberInfo.vue';
import OrderList from './components/OrderList.vue';

import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { reqQueryOrderByBedId } from '@/api/order/index';
import { DEFAULT_ORDER_FORM } from '@/views/saleMain/utils/index';
import { CustomerType, BedStatus, BedStatusMap, CashierRouteSign } from '@/enums/index';
import { useRoomStore } from '@/store/modules/setGroup/room';
import { useOrderStore } from '@/store/modules/order/index';
import { useDataEnumStore } from '@/store/modules/enums/index';
import { cloneDeep } from 'lodash';

const orderStore = useOrderStore();
const roomStore = useRoomStore();
const dataEnumStore = useDataEnumStore();
const router = useRouter();

const loading = ref(false);
// 切换项目和会员信息
const tabSwitch = ref(0);

onMounted(async () => {
  initByBedId();
  getBedList();
  await dataEnumStore.getStaffList();
  setTimeout(() => {
    orderStore.initServiceMap();
  }, 500);
});

onUnmounted(() => {
  orderStore.reset();
});

//#region 更新订单信息
/**
 * 根据床位ID获取订单信息
 * @param bedId 床位ID
 */
const setOrderByBed = async (bedId: number) => {
  loading.value = true;
  try {
    const orderRes = await reqQueryOrderByBedId(bedId);
    const order = { ...DEFAULT_ORDER_FORM, ...orderRes.data };
    order.orderId = order.id;
    orderStore.order = cloneDeep(order);
  } catch (error) {
    Message.error('获取订单信息出错，请刷新页面后重试');
  } finally {
    loading.value = false;
  }
};

/**
 * 根据路由参数初始化订单信息
 */
const initByBedId = () => {
  // 从路由参数中获取床位ID
  const bedId = Number(router.currentRoute.value.query.bedId || 0);
  const sign = router.currentRoute.value.query.sign;
  const bedName = router.currentRoute.value.query.bedName as string;
  if (sign === CashierRouteSign.Create) {
    orderStore.order.bedId = bedId;
    orderStore.order.bedName = bedName;
  } else {
    setOrderByBed(bedId);
  }
};

/**
 * 切换床位并更新订单信息
 * @param params
 */
const selectBed = (params: any) => {
  // MessageBox.warning('切换床位，将清除床位对应的所有明细，你确定切换床位吗？', '提示').then(() => {
  orderStore.reset();
  if (params.status === BedStatus.Occupied) {
    setOrderByBed(params.id);
  } else if (params.status === BedStatus.Available) {
    orderStore.order.bedId = params.id;
    orderStore.order.bedName = params.bedName;
  }
  // });
};

/** 清空订单信息 */
const clearOrder = () => {
  MessageBox.warning('清空床位信息将清空订单信息，是否继续？', '提示').then(() => {
    orderStore.reset();
  });
};

//#endregion 更新订单信息

//#region 更新床位信息

// 床位列表
const bedList: any = ref([]);

/** 获取床位状态 */
const getBedStatus = computed(() => {
  const bed = bedList.value.find((item: any) => item.id === orderStore.order.bedId);
  if (!bed) {
    return '';
  }
  return BedStatusMap[bed.status as BedStatus];
});

/** 获取床位列表 */
const getBedList = async () => {
  bedList.value = await roomStore.getAllBedList();
};

/** 显示下拉菜单 */
const visibleDropdown = (visible: boolean) => {
  if (visible) {
    getBedList();
  }
};

//#endregion 更新床位信息

//#region 更新会员信息

// 搜索会员
const inputValue = ref('');

// 选中会员
const handleSelect = (item: Record<string, any>) => {
  orderStore.order.vipId = item.id;
  orderStore.order.customerType = CustomerType.Member;
  tabSwitch.value = 1;
};

//#endregion 更新会员信息
</script>

<style scoped lang="scss">
.top-content {
  height: 70px;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: 1fr;
  border-bottom: 1px solid var(--el-border-color);

  .top-item {
    // border: 1px red solid;
    // height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .top-item.search {
    grid-column: 2 / 4;
  }
  .top-item.bed {
    grid-column: 5 / 7;
    .bed-info {
      height: 45px;
      line-height: 45px;
      width: 100%;
      font-weight: 600;
      color: var(--el-text-color-secondary);
      background-color: $base-bg;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 10px;

      > div:first-child {
        flex: 1;
        text-align: center;
      }
      > div:last-child {
        display: flex;
        align-items: center;
      }
    }
  }
}

.main-content {
  height: calc(100% - 70px);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  .main-item {
    height: 100%;
    padding: 10px;
    overflow: hidden;

    .left-tab {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
    }
    .left-tab-content {
      height: calc(100% - 50px);
      .scale-tabs {
        height: 100%;
        > :deep(.el-tabs__content) {
          height: 100%;
          > div {
            height: 100%;
          }
        }
      }
    }
  }

  .main-item:last-child {
    padding: 0;
    border-left: 1px solid var(--el-border-color);
  }
}

:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

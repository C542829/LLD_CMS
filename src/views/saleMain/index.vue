<template>
  <div v-loading="loading" style="height: 100%">
    <div class="top-content">
      <div class="top-item"></div>
      <div class="top-item search">
        <SearchMember size="default" :showSearchButton="false" @selected="handleSelect" />
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
              <ServiceItemList @addItem="addOrderItem" />
            </el-tab-pane>
            <el-tab-pane label="产品">
              <ProductList @addItem="addOrderItem" />
            </el-tab-pane>
            <el-tab-pane label="疗程">
              <TreatmentCouponList @addItem="addOrderItem" />
            </el-tab-pane>
          </el-tabs>
          <MemberInfo v-show="tabSwitch === 1" />
        </div>
      </div>
      <div class="main-item">
        <OrderList ref="orderListRef" @update-order="setOrderByBed" />
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
import { cloneDeep, isEmpty } from 'lodash';
import { useRouter } from 'vue-router';
import { type Types, reqQueryOrderByBedId, reqAddOrderDetail } from '@/api/order/index';
import { DEFAULT_ORDER_FORM } from '@/views/saleMain/utils/index';
import { CustomerType, BedStatus, BedStatusMap, CashierRouteSign } from '@/enums/index';
import { useMasterDataStore } from '@/store/modules/masterData/index';
import { useOrderStore } from '@/store/modules/order/index';
import { useUserStore } from '@/store/modules/acl/user';

const router = useRouter();

const orderStore = useOrderStore();
const masterDataStore = useMasterDataStore();
const userStore = useUserStore();

/** 订单列表 Ref */
const orderListRef = ref<InstanceType<typeof OrderList>>();

const loading = ref(false);
// 切换项目和会员信息
const tabSwitch = ref(0);

onMounted(async () => {
  initByBedId();
  getBedList();
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
    order.manualOrderNo = '';
    orderStore.order = cloneDeep(order) as Types.OrderSettleDTO;
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
  if (bedId === 0) {
    return;
  }

  updateChangePriceStatus();
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
  updateChangePriceStatus();
  if (params.status === BedStatus.Occupied) {
    setOrderByBed(params.id);
  } else if (params.status === BedStatus.Available) {
    orderStore.order.bedId = params.id;
    orderStore.order.bedName = params.bedName;
  }
  // });
};

/** 订单变更时更新是否改价状态 */
const updateChangePriceStatus = () => {
  orderStore.isChangePrice = !userStore.isCashier;
};

/**
 * 添加订单明细
 * @param detail 订单明细数据
 * @returns 操作结果
 */
const addOrderItem = async (detail: any) => {
  if (
    (orderStore.order.customerType === CustomerType.Member && !orderStore.order.vipId) ||
    (orderStore.order.customerType === CustomerType.Guest && !orderStore.order.customerName)
  ) {
    Message.warning('请先选择会员或输入散客名称');
    return;
  }

  if (!orderStore.order.bedId) {
    Message.warning('请先选择床位');
    return;
  }

  //   const bizTypes = orderStore.order.orderDetails.map((item) => item.bizType);
  // if (bizTypes.includes(OrderDetailType.Product) || bizTypes.includes(OrderDetailType.Service)) {
  //   Message.warning('疗程卡');
  //   return;
  // }

  // 初始化详情项 技师列表
  detail.technicians = [];
  console.log('添加明细：', detail);

  // 如果订单已创建，则发送请求添加订单明细
  if (orderStore.isCreated) {
    addOrderDetail(detail);
    return;
  }

  // 生成订单明细索引
  const index = orderStore.order.orderDetails.length;
  // 添加订单明细
  detail = { index, ...detail };
  orderStore.order.orderDetails.push(detail);
  orderStore.updateOrderDetailPrice();
};

/**
 * 发送请求添加订单明细
 * @param detail 订单明细
 */
const addOrderDetail = async (detail: any) => {
  try {
    orderListRef.value?.setLoading();
    const res = await reqAddOrderDetail(orderStore.order.id, detail);
    console.log('添加订单明细成功：', res);
    // 生成订单明细索引
    const index = orderStore.order.orderDetails.length;
    // 添加订单明细
    detail = { index, ...detail };
    // 设置订单明细ID
    detail.id = res.data;
    orderStore.order.orderDetails.push(detail);
    orderStore.updateOrderDetailPrice();
  } catch (error) {
    // addOrderItem(detail);
    console.log('添加订单明细失败：', error);
  } finally {
    orderListRef.value?.setLoading();
  }
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
  bedList.value = await masterDataStore.getAllBedList();
};

/** 显示下拉菜单 */
const visibleDropdown = (visible: boolean) => {
  if (visible) {
    getBedList();
  }
};

//#endregion 更新床位信息

//#region 更新会员信息

// 选中会员
const handleSelect = (item: Record<string, any>) => {
  orderStore.order.vipId = item.id;
  orderStore.order.vipName = item.name;
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

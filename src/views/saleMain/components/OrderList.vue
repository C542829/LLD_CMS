<template>
  <div class="order-list-container">
    <!-- 头部操作 -->
    <header class="order-list-header">
      <div class="order-count">账单明细({{ orderStore.orderCount }})</div>
      <div class="operation-btns">
        <el-button type="primary" link size="large" @click="handleCleanOrder">清空</el-button>
        <el-button type="success" plain round size="small" @click="handleDiscount">打折优惠</el-button>
      </div>
    </header>

    <!-- 资产概览 -->
    <div v-if="orderStore.checkedAssetInfo.assetIds.length > 0" class="selected-property-count">
      <span>当前选择资产为：{{ orderStore.checkedAssetInfo.assetTitle || '' }}</span>
      <span>，总余额：{{ orderStore.checkedAssetInfo.assetAmount || 0 }}</span>
    </div>
    <div v-else class="el-center selected-property-count">
      <el-text type="danger">存在不同折扣类型的资产，选择的资产不同，结账金额可能会变化</el-text>
    </div>

    <!-- 订单明细 -->
    <div class="order-content">
      <el-scrollbar>
        <!-- <p v-for="item in 100" :key="item" class="scrollbar-demo-item">{{ item }}</p> -->
        <DetailCard
          v-for="(item, index) in orderStore.orderForm.orderDetails"
          :key="item.id"
          :index="index + 1"
          :data="item"
          @delete="handleDeleteItem"
        />
        <div style="height: 110px"></div>
      </el-scrollbar>
      <!-- :config="customConfig"
        @add="handleAddItem" -->
    </div>
    <div class="coupon-list-container">
      <el-divider>
        <el-radio-group v-model="tabSwitch">
          <el-radio-button :value="0" :border="false" size="small">本单可选优惠券</el-radio-button>
          <el-radio-button :value="1" :border="false" size="small">所有优惠券</el-radio-button>
        </el-radio-group>
      </el-divider>
      <el-scrollbar class="coupon-content">
        <template v-if="coupons && coupons.length > 0">
          <CouponCard v-for="(item, index) in coupons" :key="item.id" :coupon="item" />
        </template>
        <Empty v-else description="暂无优惠券" />
      </el-scrollbar>
    </div>
    <footer class="order-list-footer"></footer>
  </div>
</template>

<script setup lang="ts">
import DetailCard from './DetailCard.vue';
import CouponCard from './CouponCard.vue';
import MessageBox from '@/components/MessageBox';
import { ref, onMounted, computed } from 'vue';
import { useOrderStore } from '@/store/modules/order/index';
const orderStore = useOrderStore();

const handleCleanOrder = async () => {
  const result = await MessageBox.warning('确定清空订单吗？');
  if (result) {
    orderStore.reset();
  }
};

const handleDiscount = () => {
  // orderStore.discount();
};
/**
 * 处理删除订单明细项事件
 * @param index 订单明细项索引
 */
const handleDeleteItem = (item: any) => {
  const index = orderStore.orderForm.orderDetails.findIndex((detail: any) => detail.index === item.index);
  orderStore.orderForm.orderDetails.splice(index, 1);
};

const tabSwitch = ref(0);
const coupons = computed(() => {
  if (tabSwitch.value === 0) {
    return [];
  } else {
    return orderStore.member.vipTicketVOList;
  }
});
</script>

<style lang="scss" scoped>
.order-list-container {
  $order-header-height: 40px;
  $order-footer-height: 80px;
  $selected-property-count-height: 30px;
  $coupon-list-container-height: 110px;

  height: 100%;
  position: relative;

  .order-list-header {
    height: $order-header-height;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    > div {
      width: 50%;
      text-align: center;
    }
    .order-count {
      font-size: 16px;
      font-weight: 500;
      color: var(--el-text-color-regular);
    }
    .operation-btns {
    }
  }
  .selected-property-count {
    width: 100%;
    font-weight: 500;
    text-align: center;
    height: $selected-property-count-height;
    line-height: $selected-property-count-height;
    color: var(--el-color-success);
  }
  .coupon-list-container {
    position: absolute;
    bottom: $order-footer-height;
    left: 0;
    width: 100%;
    height: $coupon-list-container-height;
    // border-top: 1px solid var(--el-border-color);
    background-color: var(--el-bg-color);
    z-index: 1000;
    :deep(.el-divider) {
      // margin: 10px 0;
      margin-top: 0;
      > .el-divider__text {
        background: none;
        // border-radius: 4px;
      }
    }
    .coupon-content {
      width: 100%;
      height: calc(100% - 25px);
      display: flex;
      overflow-x: auto;
      :deep(.el-scrollbar__wrap) {
        width: 100%;
        .el-scrollbar__view {
          height: 100%;
        }
      }
    }
  }
  .order-list-footer {
    border-top: 1px solid var(--el-border-color);
    height: $order-footer-height;
  }
  .order-content {
    height: calc(100% - #{$order-header-height} - #{$order-footer-height} - #{$selected-property-count-height});
    // padding-bottom: 110px;
    > :deep(.el-scrollbar) {
      padding: 10px;
    }
  }
}
</style>

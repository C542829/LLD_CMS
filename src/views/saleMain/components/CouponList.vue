<template>
  <div class="coupon-container">
    <el-divider>
      <el-radio-group v-model="tabSwitch">
        <el-radio-button :value="0" :border="false" size="small">代金券</el-radio-button>
        <el-radio-button :value="1" :border="false" size="small">项目券</el-radio-button>
      </el-radio-group>
    </el-divider>
    <el-scrollbar class="coupon-list">
      <template v-if="coupons && coupons.length > 0">
        <CouponCard
          v-for="(item, index) in coupons"
          :key="item.id"
          :coupon="item"
          :active="couponActive(item)"
          @cancelSelect="cancelSelect(item)"
          @click="selectCoupon(item)"
        />
      </template>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import CouponCard from './CouponCard.vue';
import { ref, watch, computed, onMounted } from 'vue';
import { CouponType, CustomerType, DiscountType, discountTypeMap } from '@/enums/index';
import { useOrderStore } from '@/store/modules/order/index';
import { ElMessage } from 'element-plus';

const store = useOrderStore();

const tabSwitch = ref(0);

/** 优惠券列表(tabSwitch = 0 返回代金券;1 返回项目券) */
const coupons = computed(() => {
  if (!store.member.vipTicketVOList || store.member.vipTicketVOList.length === 0) {
    return [];
  }
  if (tabSwitch.value === 0) {
    return store.member.vipTicketVOList.filter((item: any) => {
      return item.ticketInfo.ticketType === CouponType.voucher;
    });
  } else {
    return store.member.vipTicketVOList.filter((item: any) => {
      return item.ticketInfo.ticketType === CouponType.experience;
    });
  }
});

/** 判断优惠券是否已选中 */
const couponActive = (item: any) => {
  if (Array.isArray(store.order.ticketUseList)) {
    return false;
  }
  return store.order.ticketUseList.some((useItem: any) => useItem.ticketId === item.id);
};

/** 代金券列表 */
const vouchers = computed(() => {
  if (!store.member.vipTicketVOList || store.member.vipTicketVOList.length === 0) {
    return [];
  }
  if (tabSwitch.value === 0) {
    return store.member.vipTicketVOList.filter((item: any) => {
      return item.ticketInfo.ticketType === CouponType.voucher;
    });
  } else {
    return store.member.vipTicketVOList.filter((item: any) => {
      return item.ticketInfo.ticketType === CouponType.experience;
    });
  }
});

let currentCoupon: any | null = null;

/** 选择优惠券 */
const selectCoupon = (item: any) => {
  if (item.ticketInfo.ticketType === CouponType.experience) {
    return;
  }
  if (!checkVoucherCondition(item.ticketInfo, store.payAmount)) {
    ElMessage.warning('订单金额不足，无法使用该优惠券');
    return;
  }

  if (currentCoupon) {
    cleanVoucher();
  }
  currentCoupon = item;
  item.isSelected = true;
  store.order.ticketUseList.push({
    ticketId: item.id,
    ticketType: item.ticketInfo.ticketType,
  });
};

// 判断是否符合代金券满减条件
const checkVoucherCondition = (coupon: any, payAmount: number) => {
  return payAmount >= coupon.ticketFullPayment;
};

const cleanVoucher = () => {
  currentCoupon.isSelected = false;
  const index = store.order.ticketUseList.findIndex((useItem: any) => useItem.ticketId === currentCoupon.id);
  if (index !== -1) {
    store.order.ticketUseList.splice(index, 1);
  }
  currentCoupon = null;
};

/** 取消选择优惠券 */
const cancelSelect = (item: any) => {
  cleanVoucher();
};
</script>

<style scoped lang="scss">
.coupon-container {
  overflow: hidden;
  :deep(.el-divider) {
    margin: 16px 0;
    > .el-divider__text {
      background: none;
    }
  }
  .coupon-list {
    height: calc(100% - 33px);
    :deep(.el-scrollbar__view) {
      width: 260px;
      margin: 0 auto;
      padding-bottom: 12px;
    }
  }
}
</style>

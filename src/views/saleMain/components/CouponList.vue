<template>
  <div class="coupon-container">
    <!-- <el-divider>
      <el-radio-group v-model="tabSwitch">
        <el-radio-button :value="0" :border="false" size="small">代金券</el-radio-button>
        <el-radio-button :value="1" :border="false" size="small">项目券</el-radio-button>
      </el-radio-group>
    </el-divider> -->
    <el-scrollbar class="coupon-list">
      <template v-if="isRender">
        <!-- <template v-if="tabSwitch === 0"> -->
        <CouponCard
          v-for="(item, index) in voucherCoupons"
          :key="item.id"
          :coupon="item"
          @cancelSelect="cancelSelect(item)"
          @select="selectCoupon(item)"
        />
        <!-- </template>
        <template v-else> -->
        <ProjectCouponCard v-for="(item, index) in projectCoupons" :key="item.id" :coupon="item" />
        <!-- </template> -->
        <div style="height: 12px"></div>
      </template>
      <template v-else>
        <Empty></Empty>
      </template>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import CouponCard from './CouponCard.vue';
import ProjectCouponCard from './ProjectCouponCard.vue';
import { ref, computed, onMounted } from 'vue';
import { CouponType } from '@/enums/index';
import { useOrderStore } from '@/store/modules/order/index';
import { ElMessage } from 'element-plus';

const store = useOrderStore();

const tabSwitch = ref(0);

// 是否渲染优惠券列表
const isRender = computed(() => {
  return !(!store.member.vipTicketVOList || store.member.vipTicketVOList.length === 0);
});

// 代金券
const voucherCoupons = computed(() => {
  if (!store.member.vipTicketVOList || store.member.vipTicketVOList.length === 0) {
    return [];
  }
  return store.member.vipTicketVOList.filter((item: any) => {
    return item.ticketInfo.ticketType === CouponType.voucher;
  });
});

// 项目券
const projectCoupons = computed(() => {
  if (!store.member.vipTicketVOList || store.member.vipTicketVOList.length === 0) {
    return [];
  }
  const coupons = store.member.vipTicketVOList.filter((item: any) => {
    return item.ticketInfo.ticketType === CouponType.experience;
  });

  // 根据 ticketName 聚合数量，其余优惠券参数信息也需要展示
  const projectCoupons = coupons.reduce((acc: any, cur: any) => {
    const item = acc.find((item: any) => item.ticketName === cur.ticketName);
    if (item) {
      item.count++;
    } else {
      acc.push({
        ticketName: cur.ticketName,
        count: 1,
        ...cur,
      });
    }
    return acc;
  }, []);
  return projectCoupons;
});

let currentCoupon: any | null = null;

/** 选择优惠券 */
const selectCoupon = (item: any) => {
  // 订单未创建则停止操作
  if (!store.isCreated) {
    return;
  }

  if (!checkVoucherCondition(item.ticketInfo, store.truePayAmount)) {
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
    amount: item.ticketInfo.ticketValue,
    // detailName: item.ticketName,
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
    // height: calc(100% - 33px);
    :deep(.el-scrollbar__view) {
      width: 260px;
      margin: 0 auto;
      height: 100%;
      padding-bottom: 12px;
    }
  }
}
</style>

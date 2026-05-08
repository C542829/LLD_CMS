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
        <ProjectCouponCard
          v-for="(item, index) in projectCoupons"
          :key="item.id"
          :coupon="item"
          @select="selectDetailCoupon(item)"
        />
        <ProjectCouponCard
          v-for="(item, index) in productCoupons"
          :key="item.id"
          :coupon="item"
          @select="selectDetailCoupon(item)"
        />
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
import Message from '@/components/Message';
import { ref, computed } from 'vue';
import { CouponType, OrderDetailType } from '@/enums/index';
import { useOrderStore } from '@/store/modules/order/index';

const store = useOrderStore();

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

// 项目券（根据 ticketName + orgId 聚合，做门店隔离）
const projectCoupons = computed(() => {
  if (!store.member.vipTicketVOList || store.member.vipTicketVOList.length === 0) {
    return [];
  }
  const coupons = store.member.vipTicketVOList.filter((item: any) => {
    return item.ticketInfo.ticketType === CouponType.experience;
  });

  return aggregateCoupons(coupons);
});

// 产品券（根据 ticketName + orgId 聚合，做门店隔离）
const productCoupons = computed(() => {
  if (!store.member.vipTicketVOList || store.member.vipTicketVOList.length === 0) {
    return [];
  }
  const coupons = store.member.vipTicketVOList.filter((item: any) => {
    return item.ticketInfo.ticketType === CouponType.product;
  });

  return aggregateCoupons(coupons);
});

/**
 * 根据 ticketName + orgId 聚合优惠券
 */
const aggregateCoupons = (coupons: any[]) => {
  return coupons.reduce((acc: any, cur: any) => {
    const key = `${cur.ticketName}_${cur.orgId}`;
    const item = acc.find((item: any) => item._aggKey === key);
    if (item) {
      item.count++;
    } else {
      acc.push({
        _aggKey: key,
        ticketName: cur.ticketName,
        count: 1,
        ...cur,
      });
    }
    return acc;
  }, []);
};

let currentCoupon: any | null = null;

/** 选择优惠券 */
const selectCoupon = (item: any) => {
  // 订单未创建则停止操作
  if (!store.isCreated) {
    return;
  }

  if (!checkVoucherCondition(item.ticketInfo, store.truePayAmount)) {
    Message.warning('订单金额不足，无法使用该优惠券');
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

/**
 * 选择项目券/产品券，绑定到匹配的订单明细并存入 ticketUseList
 */
const selectDetailCoupon = (coupon: any) => {
  if (!store.isCreated) {
    return;
  }

  const ticketType = coupon.ticketInfo?.ticketType;
  const ticketId = coupon.id;

  // 检查是否已使用
  if (store.order.ticketUseList?.some((item: any) => item.ticketId === ticketId)) {
    Message.warning('该优惠券已使用');
    return;
  }

  // 查找匹配的订单明细
  const detail = findMatchDetail(coupon);
  if (!detail) {
    const typeLabel = ticketType === CouponType.product ? '产品' : '服务项目';
    Message.warning(`当前订单中没有匹配的${typeLabel}`);
    return;
  }

  // 如果该明细已绑定优惠券，先解绑
  if (detail.coupon) {
    const existIndex = store.order.ticketUseList?.findIndex((item: any) => item.ticketId === detail.coupon.id);
    if (existIndex !== -1) {
      store.order.ticketUseList.splice(existIndex, 1);
    }
    detail.coupon = null;
  }

  // 绑定优惠券到订单明细
  detail.coupon = coupon;
  detail.trueUnitPrice = coupon.amount ?? coupon.ticketInfo?.ticketValue ?? detail.stdPrice;
  detail.truePrice = detail.trueUnitPrice;

  // 存入 ticketUseList
  const useCoupon: any = {
    ticketId: ticketId,
    ticketType: ticketType,
    amount: detail.truePrice,
    detailName: detail.businessName,
    coupon: coupon,
  };
  if (detail.id) {
    useCoupon.detailId = detail.id;
  }
  if (detail.index) {
    useCoupon.detailIndex = detail.index;
  }
  store.order.ticketUseList?.push(useCoupon);
  Message.success('优惠券已使用');
};

/**
 * 查找匹配的订单明细
 * 项目券匹配服务项目，产品券匹配产品
 */
const findMatchDetail = (coupon: any) => {
  const ticketType = coupon.ticketInfo?.ticketType;
  const details = store.order.orderDetails || [];

  if (ticketType === CouponType.experience) {
    const serverItemIds = coupon.ticketInfo?.serverItems?.map((s: any) => s.id) || [];
    return details.find(
      (d: any) => d.bizType === OrderDetailType.Service && serverItemIds.includes(d.bizId) && !d.coupon,
    );
  }

  if (ticketType === CouponType.product) {
    const productIds = coupon.ticketInfo?.productList?.map((p: any) => p.productId) || [];
    return details.find((d: any) => d.bizType === OrderDetailType.Product && productIds.includes(d.bizId) && !d.coupon);
  }

  return null;
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

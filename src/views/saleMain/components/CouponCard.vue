<template>
  <div
    class="coupon-info"
    @click="select"
    :class="{ active: coupon?.isSelected || coupon?.active, expired: isExpired }"
  >
    <!-- 优惠券信息 -->
    <template v-if="coupon.ticketInfo.ticketType === CouponType.voucher">
      <span
        v-if="coupon.ticketInfo.ticketDescription"
        class="title text-overflow"
        :title="coupon.ticketInfo.ticketDescription"
      >
        {{ coupon.ticketInfo.ticketDescription }}
      </span>
      <span
        v-else
        class="title text-overflow"
        :title="`满${coupon.ticketInfo.ticketFullPayment}减${coupon.ticketInfo.ticketValue}元`"
      >
        满{{ coupon.ticketInfo.ticketFullPayment }}减{{ coupon.ticketInfo.ticketValue }}元
      </span>
    </template>
    <template v-else>
      <span class="title text-overflow" :title="getServerItems(coupon.ticketInfo.serverItems)">
        {{ getServerItems(coupon.ticketInfo.serverItems) }}
      </span>
    </template>

    <!-- 优惠券名字 -->
    <div class="coupon-tip text-overflow" :title="coupon.ticketInfo.ticketName">
      {{ coupon.ticketInfo.ticketName }}
    </div>

    <!-- 过期时间 -->
    <div class="coupon-tip text-overflow" :title="`${getExpiryDate(coupon.expiryDate)}`">
      {{ getExpiryDate(coupon.expiryDate) }}
    </div>

    <!-- 取消选择遮盖 -->
    <div v-if="coupon?.isSelected" class="cancel-select">
      <el-button type="primary" link @click.stop.prevent="cancelSelect">取消选择</el-button>
    </div>

    <!-- 过期优惠券遮盖 -->
    <div v-if="isExpired" class="cancel-select expired-coupon">
      <!-- <el-button type="danger" link>已过期</el-button> -->
      <span class="expired-text">优惠券已过期</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CouponType } from '@/enums/index';
import { computed } from 'vue';

interface Props {
  coupon: {
    expiryDate: string | number;
    isSelected?: boolean;
    active?: boolean;
    ticketInfo: {
      ticketName: string;
      ticketDescription: string;
      ticketValue: number;
      ticketType: number;
      ticketFullPayment: number;
      ticketStatus: number;
      ticketEffectiveTime: number;
      serverItems: {
        id: number;
        itemName: string;
      }[];
    };
  };
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits(['cancelSelect', 'select']);

/** 判断优惠券是否过期 */
const isExpired = computed(() => {
  if (!props.coupon.expiryDate || props.coupon.expiryDate === -1) {
    return false;
  } else {
    const expiryDate = new Date(props.coupon.expiryDate);
    return expiryDate < new Date();
  }
});

/**
 * 选择优惠券
 */
const select = () => {
  // 优惠券已过期 - 不可点击
  if (isExpired.value) {
    return;
  }
  emit('select', props.coupon);
};

/** 取消选择 */
const cancelSelect = () => {
  emit('cancelSelect', props.coupon);
};

/**
 * 获取优惠券的到期时间
 * @param expiryDate 优惠券有效期
 */
const getExpiryDate = (expiryDate: string) => {
  let result = '到期时间：';
  if (expiryDate) {
    result = expiryDate;
  } else {
    result = '长期有效';
  }
  return result;
};

/** 获取服务项 */
const getServerItems = (serverItems: any) => {
  if (serverItems) {
    return serverItems.map((item: any) => item.itemName).join('、');
  } else {
    return '';
  }
};
</script>

<style lang="scss" scoped>
.coupon-info.active {
  background-color: var(--el-color-primary);
  .title {
    color: #fff;
  }
  .coupon-tip {
    color: var(--el-fill-color-light);
    opacity: 0.9;
  }
}

.coupon-info.expired {
  background-color: var(--el-color-info);
  .title {
    color: #fff;
  }
  .coupon-tip {
    color: var(--el-fill-color-light);
    opacity: 0.9;
  }
}

.coupon-info {
  cursor: pointer;
  display: inline-block;
  // width: 150px;
  width: 100%;
  min-width: 160px;
  max-width: 320px;
  height: 60px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: var(--el-color-primary-light-7) 0px 0px 5px;
  text-align: center;
  background-color: rgb(255, 255, 255);
  flex-shrink: 0;
  // margin: 8px 0px 8px 20px;
  margin-top: 12px;
  border-radius: 3px;
  position: relative;
  padding: 5px;
  transition: 0.3s ease-in-out;
  .title {
    color: var(--el-color-primary);
    width: 100%;
    display: inline-block;
    cursor: default;
  }

  .coupon-tip {
    cursor: default;
    width: 100%;
    display: inline-block;
    font-size: 11px;
    margin-top: 5px;
    color: rgb(136, 136, 136);
  }

  .cancel-select {
    position: absolute;
    top: 0;
    right: 0;
    // margin-top: 5px;
    // 半透明背景
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.8);
    // border-radius: 3px;
  }

  .expired-coupon {
    background: rgba(255, 255, 255, 0.8);
    cursor: not-allowed;

    .expired-text {
      color: var(--el-color-danger);
    }
  }
}
</style>

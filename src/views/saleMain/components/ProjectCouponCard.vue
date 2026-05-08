<template>
  <div class="coupon-info" @click="select">
    <div class="row" :title="coupon.ticketName">
      <div class="title text-overflow">
        {{ coupon.ticketName }}
      </div>
      <div class="count text-overflow" :title="`余${coupon.count}张`">余{{ coupon.count }}张</div>
    </div>

    <!-- 过期时间 -->
    <div class="row">
      <div class="coupon-tip text-overflow" :title="`${getExpiryDate(coupon.expiryDate)}`">
        过期时间：{{ getExpiryDate(coupon.expiryDate) }}
        <!-- {{ coupon.ticketName }} -->
      </div>
      <div class="amount text-overflow" :title="`面值 ￥${coupon.amount || 0}/张`">￥{{ coupon.amount || 0 }}/张</div>
    </div>
    <!-- 优惠券描述 -->
    <div class="row coupon-tip text-overflow" :title="coupon.remark || coupon.ticketInfo?.ticketDescription">
      {{ coupon.remark || coupon.ticketInfo?.ticketDescription }}
    </div>

    <!-- 关联门店 -->
    <div v-if="orgName" class="row coupon-tip text-overflow" :title="`门店：${orgName}`">门店：{{ orgName }}</div>

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
import { computed } from 'vue';

interface Props {
  coupon: {
    expiryDate: string | number;
    isSelected?: boolean;
    active?: boolean;
    ticketName: string;
    remark: string;
    count: number;
    amount: number;
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

/** 获取关联门店名称 */
const orgName = computed(() => {
  const orgs = props.coupon.ticketInfo?.orgs;
  if (orgs && orgs.length > 0) {
    return orgs.map((o: any) => o.orgName).join('、');
  }
  return '';
});

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
const getExpiryDate = (expiryDate: string | number) => {
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
  // cursor: pointer;
  display: inline-block;
  width: 100%;
  min-width: 160px;
  max-width: 320px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: var(--el-color-primary-light-7) 0px 0px 5px;
  text-align: center;
  background-color: rgb(255, 255, 255);
  flex-shrink: 0;
  margin-top: 12px;
  border-radius: 3px;
  position: relative;
  padding: 10px;
  transition: 0.3s ease-in-out;

  .row {
    display: flex;
    // justify-content: center;
    align-items: center;
    width: 100%;
    .title {
      height: 20px;
      color: var(--el-color-primary);
      width: 100%;
      display: inline-block;
      cursor: default;
      text-align: left;
    }
    .count {
      width: 60px;
      text-align: right;
      font-weight: 500;
      color: var(--el-text-color-regular);
    }
    .amount {
      font-size: 10px;
      width: 100px;
      text-align: right;
      font-weight: 400;
      color: var(--el-text-color-secondary);
    }
  }

  .coupon-tip {
    cursor: default;
    width: 100%;
    display: inline-block;
    font-size: 10px;
    text-align: left;
    margin-top: 5px;
    color: rgb(136, 136, 136);
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

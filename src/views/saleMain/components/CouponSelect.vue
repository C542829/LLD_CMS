<template>
  <el-popover ref="popoverRef" trigger="click" effect="light" placement="left" title="请选择项目券" width="180">
    <el-select v-model="selected" placeholder="请选择项目券" filterable clearable value-key="id" @change="handleChange">
      <el-option v-for="(item, index) in coupons" :key="item.id" :label="item.ticketName" :value="item">
        <span>{{ index + 1 }}、{{ item.ticketName }}</span>
      </el-option>
    </el-select>
    <template #reference>
      <el-button
        type="primary"
        link
        size="large"
        icon="Ticket"
        :disabled="!store.isCreated"
        style="transform: scale(1.3)"
      />
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { CouponType, OrderDetailType } from '@/enums/index';
import { PopoverInstance } from 'element-plus';

import { useOrderStore } from '@/store/modules/order/index';
const store = useOrderStore();

interface Emits {
  (e: 'change', coupon: any): void;
}

const emit = defineEmits<Emits>();

interface Props {
  detailItem: any;
}

const props = withDefaults(defineProps<Props>(), {
  detailItem: {},
});

const filter = (item: any) => {
  // 如果是代金券，直接返回true
  if (item.ticketInfo.ticketType === CouponType.voucher) {
    return false;
  }

  // 过期时间过滤
  if (item.expiryDate && item.expiryDate !== -1) {
    const expiryDate = new Date(item.expiryDate);
    return expiryDate > new Date();
  }

  // 如果是服务项目，判断是否包含在优惠券的服务项目中
  if (props.detailItem.detailType === OrderDetailType.Service) {
    const ids = item.ticketInfo.serverItems.map((item: any) => item.id);
    return ids.includes(props.detailItem.bid);
  }
  return false;
};

const coupons = computed(() => {
  if (store.order.ticketUseList && store.order.ticketUseList.length > 0) {
    return store.member.vipTicketVOList.filter((item: any) => {
      return filter(item) && !store.order.ticketUseList.some((useItem: any) => useItem.ticketId === item.id);
    });
  } else {
    if (!store.member.vipTicketVOList || store.member.vipTicketVOList.length === 0) {
      return [];
    }
    return store.member.vipTicketVOList.filter(filter);
  }
});

// 弹出框实例
const popoverRef = ref<PopoverInstance>();
const selected = ref<any>();

const handleChange = (coupon: any) => {
  // if (item.ticketInfo.ticketType === CouponType.voucher) {
  emit('change', coupon);
  selected.value = '';
  popoverRef.value?.hide();
};
</script>

<style lang="scss" scoped>
.popover-container {
  .discount-content {
    padding: 10px 0;
    color: var(--el-color-primary);
    .discount-item {
    }
    .discount-input-wrapper {
      margin-top: 10px;
      display: flex;
      align-items: center;
      gap: 5px;
      .discount-input {
        width: 120px;
      }
    }
  }

  .footer-btns {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
}
</style>

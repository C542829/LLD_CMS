<template>
  <el-popover ref="popoverRef" trigger="click" effect="light" placement="left" title="请选择优惠券" width="180">
    <el-select v-model="selected" placeholder="请选择优惠券" filterable clearable value-key="id" @change="handleChange">
      <el-option
        v-for="(item, index) in coupons"
        :key="item.id"
        :label="item.ticketName"
        :value="item"
        :disabled="item.disabled"
      >
        <!-- <span>{{ index + 1 }}、{{ item.ticketName }}</span> -->
        {{ index + 1 }}. {{ item.ticketName }} [{{ couponTypeMap[item.ticketInfo?.ticketType] || '' }}]
        <!-- ({{ item.remark }}) -->
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
import { CouponType, couponTypeMap, OrderDetailType } from '@/enums/index';
import { PopoverInstance } from 'element-plus';
import { useOrderStore } from '@/store/modules/order/index';
import useUserStore from '@/store/modules/acl/user';

const store = useOrderStore();
const userStore = useUserStore();

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
  const ticketType = item.ticketInfo.ticketType;

  // 只允许项目券和产品券
  if (ticketType !== CouponType.experience && ticketType !== CouponType.product) {
    return false;
  }

  // 如果该优惠券不是当前门店则不显示
  if (item.orgId !== userStore.user.orgId) {
    return false;
  }

  // 过期时间过滤
  if (item.expiryDate && item.expiryDate !== -1) {
    const expiryDate = new Date(item.expiryDate);
    return expiryDate > new Date();
  }

  // 项目券：判断服务项目是否匹配
  if (ticketType === CouponType.experience && props.detailItem.bizType === OrderDetailType.Service) {
    const ids = item.ticketInfo.serverItems?.map((s: any) => s.id) || [];
    return ids.includes(props.detailItem.bizId);
  }

  // 产品券：判断产品是否匹配
  if (ticketType === CouponType.product && props.detailItem.bizType === OrderDetailType.Product) {
    const productIds = item.ticketInfo.productList?.map((p: any) => p.productId) || [];
    return productIds.includes(props.detailItem.bizId);
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

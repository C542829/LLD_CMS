<template>
  <el-tag :type="serviceType.type">{{ serviceType.name }}</el-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { OrderDetailTypeMap, OrderDetailType, ServiceType, ServiceTypeMap } from '@/enums/index';
interface Props {
  type: OrderDetailType;
}
const props = withDefaults(defineProps<Props>(), {
  type: OrderDetailType.Product,
});

const serviceTypeColor = {
  [OrderDetailType.Product]: 'primary',
  [OrderDetailType.Service]: 'success',
  [OrderDetailType.TreatmentCoupon]: 'warning',
  [OrderDetailType.Package]: 'info',
};

const serviceType = computed(() => {
  return {
    name: OrderDetailTypeMap[props.type] || '未知',
    type: (serviceTypeColor[props.type] || 'primary') as ElTagType,
  };
});
</script>

<style></style>

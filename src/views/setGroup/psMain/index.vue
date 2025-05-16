<template>
  <div>
    <ChildNav :navList="navList" />
  </div>
</template>

<script setup lang="ts">
import ChildNav from '@/components/ChildNav/index.vue';
import PackageManager from './packageManager/index.vue';
import ProductManager from './productManager/index.vue';
import RechargeCommissionRules from './rechargeCommissionRules/index.vue';
import ServiceItemManager from './serviceItemManager/index.vue';
import TreatmentCouponManager from './treatmentCouponManager/index.vue';

import { ref, markRaw } from 'vue';

const navList = ref([
  { label: '产品管理', icon: '', component: markRaw(ProductManager) },
  { label: '项目管理', icon: '', component: markRaw(ServiceItemManager) },
  { label: '疗程券管理', icon: '', component: markRaw(TreatmentCouponManager) },
  { label: '套餐管理', icon: '', component: markRaw(PackageManager) },
  {
    label: '充值提成规则',
    icon: '',
    component: markRaw(RechargeCommissionRules),
  },
]);
</script>

<style scoped lang="scss"></style>

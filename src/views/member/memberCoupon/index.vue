<template>
  <div>
    <ChildNav :navList="navList" />
  </div>
</template>

<script setup lang="ts">
import ChildNav from '@/components/ChildNav/index.vue';
import CouponManager from './couponManager/index.vue';
import CouponCount from './couponCount/index.vue';
import CouponOverview from './couponOverview/index.vue';

import { ref, markRaw } from 'vue';

const navList = ref([
  { label: '优惠券管理', icon: '', component: markRaw(CouponManager) },
  { label: '优惠券统计', icon: '', component: markRaw(CouponCount) },
  { label: '优惠券汇总', icon: '', component: markRaw(CouponOverview) },
]);
</script>

<style scoped lang="scss"></style>

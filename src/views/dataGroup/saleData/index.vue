<template>
  <ChildNav :navList="navList" />
</template>

<script setup lang="ts">
import ChildNav from '@/components/ChildNav/index.vue';
import SaleRecord from './saleRecord/index.vue';
import SaleDetail from './saleDetail/index.vue';
import SaleSummary from './saleSummary/index.vue';

import { ref, markRaw } from 'vue';

const navList = ref([
  { label: '销售记录', icon: '', component: markRaw(SaleRecord) },
  { label: '销售汇总', icon: '', component: markRaw(SaleSummary) },
  { label: '销售明细', icon: '', component: markRaw(SaleDetail) },
]);
</script>

<style scoped lang="scss"></style>

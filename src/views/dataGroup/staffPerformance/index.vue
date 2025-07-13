<template>
  <ChildNav :navList="navList" />
</template>

<script setup lang="ts">
import ChildNav from '@/components/ChildNav/index.vue';
import PerformanceDetail from './performanceDetail/index.vue';
import PerformanceOverview from './performanceOverview/index.vue';

import { ref, markRaw } from 'vue';

const navList = ref([
  { label: '业绩明细', icon: '', component: markRaw(PerformanceDetail) },
  { label: '业绩汇总', icon: '', component: markRaw(PerformanceOverview) },
]);
</script>

<style scoped lang="scss"></style>

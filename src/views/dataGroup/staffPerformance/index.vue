<template>
  <ChildNav :navList="navList" />
</template>

<script setup lang="ts">
import ChildNav from '@/components/ChildNav/index.vue';
import PerformanceDetail from './performanceDetail/index.vue';
import PerformanceOverview from './performanceOverview/index.vue';

import { ref, markRaw } from 'vue';

const originalNavList = ref([
  { label: '业绩明细', icon: '', component: markRaw(PerformanceDetail) },
  { label: '业绩汇总', icon: '', component: markRaw(PerformanceOverview) },
]);

const navList: any = ref([]);

import { useRoute } from 'vue-router';
const tabs: any = useRoute().meta.tabs;
for (const item of originalNavList.value) {
  if (tabs.includes(item.label)) {
    navList.value.push(item);
  }
}
</script>

<style scoped lang="scss"></style>

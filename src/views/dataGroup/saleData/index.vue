<template>
  <div>
    <ChildNav :navList="navList" />
  </div>
</template>

<script setup lang="ts">
import ChildNav from '@/components/ChildNav/index.vue';
import SaleDetail from './saleDetail/index.vue';

import { ref, markRaw } from 'vue';

const navList = ref([{ label: '销售明细', icon: '', component: markRaw(SaleDetail) }]);
</script>

<style scoped lang="scss"></style>

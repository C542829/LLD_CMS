<template>
  <div class="container">
    <ChildNav :navList="navList" />
  </div>
</template>

<script setup lang="ts">
import ChildNav from '@/components/ChildNav/index.vue';
import Property from './Property.vue';
import ConsumptionRecord from './ConsumptionRecord.vue';
import RechargeRecord from './RechargeRecord.vue';

import { ref, markRaw } from 'vue';

const navList = ref([
  { label: '可用资产', icon: '', component: markRaw(Property) },
  { label: '消费记录', icon: '', component: markRaw(ConsumptionRecord) },
  { label: '充值记录', icon: '', component: markRaw(RechargeRecord) },
]);
</script>

<style scoped lang="scss">
.container {
  flex: 1;
  height: 100%;
}
</style>

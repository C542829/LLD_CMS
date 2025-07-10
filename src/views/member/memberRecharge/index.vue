<template>
  <ChildNav :navList="navList" />
</template>

<script setup lang="ts">
import ChildNav from '@/components/ChildNav/index.vue';
import Recharge from './recharge/index.vue';
import RechargeRecord from './rechargeRecord/index.vue';
import RechargeActivity from './rechargeActivity/index.vue';

import { ref, markRaw } from 'vue';

const navList = ref([
  { label: '会员充值', icon: '', component: markRaw(Recharge) },
  { label: '充值记录', icon: '', component: markRaw(RechargeRecord) },
  { label: '充值活动', icon: '', component: markRaw(RechargeActivity) },
]);
</script>
<style scoped lang="scss"></style>

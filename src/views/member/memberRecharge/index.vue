<template>
  <ChildNav :navList="navList" />
</template>

<script setup lang="ts">
import ChildNav from '@/components/ChildNav/index.vue';
import Recharge from './recharge/index.vue';
import RechargeRecord from './rechargeRecord/index.vue';
import RechargeActivity from './rechargeActivity/index.vue';

import { ref, markRaw } from 'vue';

const originalNavList = ref([
  { label: '会员充值', icon: '', component: markRaw(Recharge) },
  { label: '充值记录', icon: '', component: markRaw(RechargeRecord) },
  { label: '充值活动', icon: '', component: markRaw(RechargeActivity) },
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

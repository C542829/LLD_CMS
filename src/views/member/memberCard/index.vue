<template>
  <ChildNav :navList="navList" />
</template>

<script setup lang="ts">
import ChildNav from '@/components/ChildNav/index.vue';
import MemberList from './memberList/index.vue';
import MemberCount from './memberCount/index.vue';
import ActivityAnalysis from './activityAnalysis/index.vue';
import AssetTransfer from './assetTransfer/index.vue';

import { ref, markRaw } from 'vue';

const navList = ref([
  { label: '会员列表', icon: '', component: markRaw(MemberList) },
  { label: '会员统计', icon: '', component: markRaw(MemberCount) },
  { label: '会员活跃分析', icon: '', component: markRaw(ActivityAnalysis) },
  { label: '资产转移', icon: '', component: markRaw(AssetTransfer) },
]);
</script>

<style scoped lang="scss"></style>

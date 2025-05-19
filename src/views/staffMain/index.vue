<template>
  <ChildNav :navList="navList" />
</template>

<script setup lang="ts">
import ChildNav from '@/components/ChildNav/index.vue';
import StaffList from './staffList/index.vue';
import TechnList from './technList/index.vue';
import PowerSet from './powerSet/index.vue';

import { ref, markRaw } from 'vue';

const navList = ref([
  { label: '人员列表', icon: '', component: markRaw(StaffList) },
  { label: '技师列表', icon: 'ScaleToOriginal', component: markRaw(TechnList) },
  { label: '权限管理', icon: 'Lock', component: markRaw(PowerSet) },
]);
</script>

<style scoped lang="scss"></style>

<template>
  <div>
    <ChildNav :navList="navList" />
  </div>
</template>

<script setup lang="ts">
import ChildNav from '@/components/ChildNav/index.vue';
import PayRecord from './payRecord/index.vue';

import { ref, markRaw } from 'vue';

const navList = ref([{ label: '支付记录', icon: '', component: markRaw(PayRecord) }]);
</script>

<style scoped lang="scss"></style>

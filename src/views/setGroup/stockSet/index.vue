<template>
  <div>
    <ChildNav :navList="navList" />
  </div>
</template>

<script setup lang="ts">
import ChildNav from '@/components/ChildNav/index.vue';
import ProductStock from './productStock/index.vue';

import { ref, markRaw } from 'vue';

const navList = ref([{ label: '产品库存', icon: '', component: markRaw(ProductStock) }]);
</script>

<style scoped lang="scss"></style>

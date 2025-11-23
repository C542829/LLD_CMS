<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useDataEnumStore } from '@/store/modules/enums/index';
const enumStore = useDataEnumStore();

// 初始化一些信息
onMounted(async () => {
  // 初始化常用枚举信息
  await enumStore.getProductList();
  await enumStore.getServiceItemList();
  await enumStore.getTreatmentCouponList();
});
</script>

<style scoped></style>

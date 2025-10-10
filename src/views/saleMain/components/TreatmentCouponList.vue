<template>
  <div class="product-list">
    <el-scrollbar>
      <ItemCard
        v-for="item in enumStore.treatmentCouponList"
        :key="item.id"
        :data="item"
        :config="customConfig"
        :disabled="item.status !== 0"
        :showSecondPrice="false"
        firstPriceText="疗程券价"
        @add="handleAddItem"
      />
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import ItemCard from './ItemCard.vue';

import { ref, watch, onMounted } from 'vue';
import { useDataEnumStore } from '@/store/modules/enums/index';
const enumStore = useDataEnumStore();

onMounted(async () => {
  await enumStore.getTreatmentCouponList();
});

const handleAddItem = (item: any) => {
  console.log(item);
};

const customConfig = ref({
  nameKey: 'name',
  codeKey: 'remark',
  retailPriceKey: 'price',
  memberPriceKey: 'vipProductPrice',
  isDiscountKey: 'isDiscount',
});
</script>

<style lang="scss" scoped>
.product-list {
  height: 100%;
  :deep(.el-scrollbar__wrap) {
    height: 100%;
    > div {
      height: 100%;
    }
  }
}
</style>

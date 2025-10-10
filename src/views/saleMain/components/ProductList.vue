<template>
  <div class="product-list">
    <el-scrollbar>
      <ItemCard
        v-for="item in enumStore.productList"
        :key="item.id"
        :data="item"
        :config="customConfig"
        :disabled="item.productStatus !== 0"
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
  await enumStore.getProductList();
});

const handleAddItem = (item: any) => {
  console.log(item);
};

const customConfig = ref({
  nameKey: 'productName',
  codeKey: 'productEncode',
  retailPriceKey: 'productPrice',
  memberPriceKey: 'vipProductPrice',
  isDiscountKey: 'isDiscount',
});
</script>

<style lang="scss" scoped>
.product-list {
  height: 100%;
  // overflow: hidden;
  :deep(.el-scrollbar__wrap) {
    height: 100%;
    > div {
      overflow: auto;
      height: 100%;
    }
  }
}
</style>

<template>
  <div class="product-list">
    <template v-if="enumStore.productList && enumStore.productList.length > 0">
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
    </template>
    <template v-else>
      <Empty></Empty>
    </template>
  </div>
</template>

<script setup lang="ts">
import ItemCard from './ItemCard.vue';
import { OrderDetailType, ServiceType } from '@/enums/index';
import { ref, onMounted } from 'vue';
import { useDataEnumStore } from '@/store/modules/enums/index';
import { cloneDeep } from 'lodash';

const emit = defineEmits(['addItem']);

const enumStore = useDataEnumStore();

onMounted(async () => {
  await enumStore.getProductList();
});

const handleAddItem = (item: any) => {
  item = cloneDeep(item);
  item.detailType = OrderDetailType.Product;
  item.serverType = ServiceType.Point;
  item.quantity = 1;
  item.bid = item.id;
  item.businessName = item.productName;
  item.stdPrice = item.productPrice;
  item.truePrice = item.productPrice;

  delete item.id;
  // orderStore.addOrderItem(item);
  emit('addItem', item);
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

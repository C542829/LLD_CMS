<template>
  <div class="product-list">
    <template v-if="enumStore.serviceItemList && enumStore.serviceItemList.length > 0">
      <el-scrollbar>
        <ItemCard
          v-for="item in enumStore.serviceItemList"
          :key="item.id"
          :data="item"
          :config="customConfig"
          :disabled="item.itemStatus !== 0"
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
import { ref, watch, onMounted } from 'vue';
import { useDataEnumStore } from '@/store/modules/enums/index';
import { cloneDeep } from 'lodash';

const emit = defineEmits(['addItem']);

const enumStore = useDataEnumStore();

onMounted(async () => {
  await enumStore.getServiceItemList(true);
});

const handleAddItem = (item: any) => {
  item = cloneDeep(item);
  item.detailType = OrderDetailType.Service;
  item.serverType = ServiceType.Round;
  item.quantity = 1;
  item.bid = item.id;
  item.businessName = item.itemName;
  item.businessCode = item.itemEncode;
  item.stdPrice = item.itemPrice;
  item.truePrice = item.itemPrice;

  delete item.id;
  emit('addItem', item);
};

const customConfig = ref({
  nameKey: 'itemName',
  codeKey: 'itemEncode',
  retailPriceKey: 'itemPrice',
  memberPriceKey: 'vipItemPrice',
  isDiscountKey: 'isDiscounts',
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

<template>
  <div class="product-list">
    <template v-if="enumStore.treatmentCouponList && enumStore.treatmentCouponList.length > 0">
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
    </template>
    <template v-else>
      <Empty></Empty>
    </template>
  </div>
</template>

<script setup lang="ts">
import ItemCard from './ItemCard.vue';
import { ref, onMounted } from 'vue';
import { OrderDetailType } from '@/enums/index';
import { IsDiscount } from '@/enums';
import { useDataEnumStore } from '@/store/modules/enums/index';
import { cloneDeep } from 'lodash';

const emit = defineEmits(['addItem']);

const enumStore = useDataEnumStore();

onMounted(async () => {
  await enumStore.getTreatmentCouponList();
});

const handleAddItem = (item: any) => {
  item = cloneDeep(item);
  item.detailType = OrderDetailType.TreatmentCoupon;
  item.isDiscount = IsDiscount.No;
  item.quantity = 1;
  item.bid = item.id;
  item.businessName = item.name;
  item.businessCode = item.encode;
  item.stdPrice = item.price;
  item.vipPrice = item.price;
  item.truePrice = item.price;
  item.trueUnitPrice = item.price;

  delete item.id;
  emit('addItem', item);
};

const customConfig = ref({
  nameKey: 'name',
  codeKey: 'encode',
  retailPriceKey: 'price',
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

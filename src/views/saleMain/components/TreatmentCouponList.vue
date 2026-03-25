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
import { OrderDetailType } from '@/enums/index';
import Message from '@/components/Message';
import { type FormInstance } from 'element-plus';
import { IsDiscount } from '@/enums';

import { useDataEnumStore } from '@/store/modules/enums/index';
import { useOrderStore } from '@/store/modules/order/index';
import { cloneDeep } from 'lodash';
const enumStore = useDataEnumStore();
const orderStore = useOrderStore();

onMounted(async () => {
  await enumStore.getTreatmentCouponList();
});

const handleAddItem = (item: any) => {
  item = cloneDeep(item);
  item.detailType = OrderDetailType.TreatmentCoupon;
  item.isDiscount = IsDiscount.noDiscount;
  item.quantity = 1;
  item.bid = item.id;
  item.businessName = item.name;
  item.stdPrice = item.price;
  item.truePrice = item.price;

  delete item.id;
  orderStore.addOrderItem(item);
};

const customConfig = ref({
  nameKey: 'name',
  codeKey: 'remark',
  retailPriceKey: 'price',
  memberPriceKey: 'vipProductPrice',
  // isDiscountKey: 'isDiscount',
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

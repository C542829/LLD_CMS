<template>
  <div class="product-list">
    <DictRadio :dictCode="DictCode.PRODUCT_CATEGORY" class="dict-radio" @change="handleChange" />
    <template v-if="productList && productList.length > 0">
      <el-scrollbar v-loading="loading" :element-loading-text="LOADING_MSG">
        <ItemCard
          v-for="item in productList"
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
import DictRadio from '@/components/FormComponents/DictRadio.vue';
import { ref, onMounted } from 'vue';
import { cloneDeep } from 'lodash';
import { LOADING_MSG } from '@/utils/constant';
import { OrderDetailType, DictCode } from '@/enums/index';
import { reqProductList, type Types } from '@/api/setGroup/product';

const emit = defineEmits(['addItem']);

onMounted(async () => {
  getProductList('');
});

const loading = ref(false);
const productList = ref<Types.ProductInfoVO[]>([]);

const handleChange = (val: string | number | boolean | undefined) => {
  getProductList(val as string);
};

const getProductList = async (category: string) => {
  try {
    loading.value = true;
    const res = await reqProductList({ category, productStatus: 0 });
    productList.value = res.data || [];
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

const handleAddItem = (item: any) => {
  item = cloneDeep(item);
  item.detailType = OrderDetailType.Product;
  // item.serverType = ServiceType.Round;
  item.quantity = 1;
  item.bid = item.id;
  item.businessName = item.productName;
  item.businessCode = item.productEncode;
  item.stdPrice = item.productPrice;
  item.truePrice = item.productPrice;

  delete item.id;
  emit('addItem', item);
};

const customConfig = ref({
  nameKey: 'productName',
  codeKey: 'productEncode',
  retailPriceKey: 'productPrice',
  memberPriceKey: 'vipProductPrice',
  isDiscountKey: 'isDiscount',
  categoryKey: 'category',
});
</script>

<style lang="scss" scoped>
.product-list {
  height: 100%;
  .dict-radio {
    margin-bottom: 8px;
  }
  > :deep(.el-scrollbar) {
    height: calc(100% - 40px);
    .el-scrollbar__wrap {
      height: 100%;
      > div {
        overflow: auto;
        height: 100%;
      }
    }
  }
}
</style>

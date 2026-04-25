<template>
  <div class="product-list">
    <DictRadio :dictCode="DictCode.PRODUCT_CATEGORY" class="dict-radio" @change="handleChange" />
    <template v-if="productList && productList.length > 0">
      <el-scrollbar v-loading="loading" :element-loading-text="LOADING_MSG" :always="true">
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
import { LOADING_MSG } from '@/utils/constants';
import { OrderDetailType, DictCode } from '@/enums/index';
import { reqProductList, type Types } from '@/api/setGroup/product';

const emit = defineEmits(['addItem']);

onMounted(async () => {
  getProductList('');
});

const loading = ref(false);
const productList = ref<Types.ProductInfoVO[]>([]);
/** 本地缓存的全量数据，用于按分类过滤 */
const allProductList = ref<Types.ProductInfoVO[]>([]);

const handleChange = (val: string | number | boolean | undefined) => {
  getProductList(val as string);
};

/**
 * 获取产品列表
 * - category 为空时请求接口获取全量数据并缓存到本地
 * - category 非空时基于本地缓存数据按分类过滤
 */
const getProductList = async (category: string) => {
  if (category) {
    productList.value = allProductList.value.filter((item) => item.category === category);
    return;
  }
  try {
    loading.value = true;
    const res = await reqProductList({ category: '', productStatus: 0 });
    const list = res.data || [];
    allProductList.value = list;
    productList.value = list;
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

const handleAddItem = (item: any) => {
  item = cloneDeep(item);
  item.bizType = OrderDetailType.Product;
  item.isDiscount = item.isDiscount;
  item.quantity = 1;
  item.bizId = item.id;
  item.businessName = item.productName;
  item.businessCode = item.productEncode;
  item.stdPrice = item.productPrice;
  item.vipPrice = item.vipProductPrice;
  item.truePrice = item.productPrice;
  item.trueUnitPrice = item.productPrice;

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

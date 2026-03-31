<template>
  <div class="container-left" v-loading="loading">
    <el-button type="primary" @click="getProductList">获取产品数据</el-button>
    <div class="left-content">
      <div
        v-for="item in productList"
        :type="parseInt(item.quantity!) < 10 ? 'danger' : 'primary'"
        :key="item.productId"
        class="product-card"
      >
        <span>{{ item.productName }}({{ item.productEncode }})</span>
        <span>剩余数量：{{ item.quantity }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { type Types, reqProductList } from '@/api/setGroup/product/index';
import { parseResList } from '@/utils/parseResponse';

onMounted(async () => {
  getProductList();
});

const productList = ref<Types.ProductInfoVO[]>([]);
const loading = ref(false);
/**
 * 获取产品列表
 * @returns 产品列表
 */
const getProductList = async () => {
  try {
    loading.value = true;
    const res = await reqProductList();
    const data = parseResList(res);
    data.sort((a, b) => parseInt(a.quantity!) - parseInt(b.quantity!));
    productList.value = data;
  } catch (error) {
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.container-left {
  width: 250px;
  height: 100%;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;

  .left-content {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-wrap: nowrap;
    padding: 10px 10px;

    .product-card {
      line-height: 25px;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      cursor: pointer;
      border: 2px solid transparent;
      border-radius: 10px;
      padding: 10px;
      transition: 0.2s ease;

      &[type='primary'] {
        color: var(--el-color-primary-dark-2);
        background-color: var(--el-color-primary-light-9);
      }
      &[type='primary']:hover {
        box-shadow: 0 0 8px var(--el-color-primary-light-7);
        border: 2px solid var(--el-color-primary-light-7);
      }

      &[type='danger'] {
        color: var(--el-color-danger-dark-2);
        background-color: var(--el-color-danger-light-9);
      }
      &[type='danger']:hover {
        box-shadow: 0 0 8px var(--el-color-danger-light-7);
        border: 2px solid var(--el-color-error-light-7);
      }
    }
  }
}
</style>

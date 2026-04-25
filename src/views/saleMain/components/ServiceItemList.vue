<template>
  <div class="product-list">
    <DictRadio :dictCode="DictCode.ITEM_CATEGORY" class="dict-radio" @change="handleChange" />
    <template v-if="serviceItemList && serviceItemList.length > 0">
      <el-scrollbar v-loading="loading" :element-loading-text="LOADING_MSG" :always="true">
        <ItemCard
          v-for="item in serviceItemList"
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
import DictRadio from '@/components/FormComponents/DictRadio.vue';
import { ref, onMounted } from 'vue';
import { cloneDeep } from 'lodash';
import { LOADING_MSG } from '@/utils/constants';
import { DictCode, OrderDetailType, ServiceType } from '@/enums/index';
import { reqServiceItemList, type Types } from '@/api/setGroup/serviceItem';

const emit = defineEmits(['addItem']);

onMounted(async () => {
  getServiceItemList('');
});

const loading = ref(false);
const serviceItemList = ref<Types.ServerItemVO[]>([]);
/** 本地缓存的全量数据，用于按分类过滤 */
const allServiceItemList = ref<Types.ServerItemVO[]>([]);

const handleChange = (val: string | number | boolean | undefined) => {
  getServiceItemList(val as string);
};

/**
 * 获取服务项目列表
 * - category 为空时请求接口获取全量数据并缓存到本地
 * - category 非空时基于本地缓存数据按分类过滤
 */
const getServiceItemList = async (category: string) => {
  if (category) {
    serviceItemList.value = allServiceItemList.value.filter((item) => item.category === category);
    return;
  }
  try {
    loading.value = true;
    const res = await reqServiceItemList({ category: '', itemStatus: 0 });
    const list = res.data || [];
    allServiceItemList.value = list;
    serviceItemList.value = list;
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

const handleAddItem = (item: any) => {
  item = cloneDeep(item);
  item.bizType = OrderDetailType.Service;
  item.serverType = ServiceType.Round;
  item.isDiscount = item.isDiscounts;
  item.quantity = 1;
  item.bizId = item.id;
  item.businessName = item.itemName;
  item.businessCode = item.itemEncode;
  item.stdPrice = item.itemPrice;
  item.vipPrice = item.vipItemPrice;
  item.truePrice = item.itemPrice;
  item.trueUnitPrice = item.itemPrice;

  delete item.id;
  emit('addItem', item);
};

const customConfig = ref({
  nameKey: 'itemName',
  codeKey: 'itemEncode',
  retailPriceKey: 'itemPrice',
  memberPriceKey: 'vipItemPrice',
  isDiscountKey: 'isDiscounts',
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

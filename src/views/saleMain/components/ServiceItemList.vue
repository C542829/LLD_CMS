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
import { LOADING_MSG } from '@/utils/constant';
import { DictCode, OrderDetailType, ServiceType } from '@/enums/index';
import { reqServiceItemList, type Types } from '@/api/setGroup/serviceItem';

const emit = defineEmits(['addItem']);

onMounted(async () => {
  getServiceItemList('');
});

const loading = ref(false);
const serviceItemList = ref<Types.ServerItemVO[]>([]);

const handleChange = (val: string | number | boolean | undefined) => {
  getServiceItemList(val as string);
};

const getServiceItemList = async (category: string) => {
  try {
    loading.value = true;
    const res = await reqServiceItemList({ category, itemStatus: 0 });
    serviceItemList.value = res.data || [];
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

const handleAddItem = (item: any) => {
  item = cloneDeep(item);
  item.detailType = OrderDetailType.Service;
  item.serverType = ServiceType.Round;
  item.isDiscount = item.isDiscounts;
  item.quantity = 1;
  item.bid = item.id;
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

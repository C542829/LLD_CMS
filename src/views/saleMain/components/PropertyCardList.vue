<template>
  <!-- 资产信息 -->
  <div class="member-card-container">
    <el-scrollbar class="property-container">
      <el-checkbox-group v-model="checkedList" @change="handleChange">
        <PropertyCard
          v-for="(item, index) in assetList"
          :key="item.id"
          :data="item"
          :index="index + 1"
          :amount="store.payAmount"
        />
      </el-checkbox-group>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import PropertyCard from './PropertyCard.vue';

import { ref, watch, computed, onMounted } from 'vue';
import { isEmpty } from 'lodash';
import { DiscountType, discountTypeMap } from '@/enums/index';
import { useOrderStore } from '@/store/modules/order/index';
import { useDataEnumStore } from '@/store/modules/enums';

const enumsStore = useDataEnumStore();
const store = useOrderStore();

onMounted(() => {
  enumsStore.getOrgList();
});

const assetList: any = computed(() => {
  if (!store.member.vipAssetVOList && isEmpty(store.member.vipAssetVOList)) {
    return [];
  }

  const assetList = store.member.vipAssetVOList.filter((item: any) => item.assetBalance > 0);
  // 排序
  assetList.sort((a: any, b: any) => {
    // 第一条件：折扣基础
    if (a.assetDiscountBase !== b.assetDiscountBase) {
      return b.assetDiscountBase - a.assetDiscountBase;
    }
    // 第二条件：折扣率
    if (a.assetDiscountRate !== b.assetDiscountRate) {
      return a.assetDiscountRate - b.assetDiscountRate;
    }
    // 第三条件：余额
    return a.assetBalance - b.assetBalance;
  });
  return assetList;
});

const checkedList = ref<any>([]);

// 更新 store 资产列表
watch(
  () => checkedList.value,
  (newVal) => {
    const assetIds = newVal.map((e: string) => parseInt(e.split('-')[0]));
    store.checkedAssetInfo.assetIds = assetIds;
    // console.log('checkedList = ', newVal);
    // console.log('assetIds = ', assetIds);

    let assetTitle = '';
    let assetAmount = 0;
    for (const id of assetIds) {
      const asset = assetList.value.find((e: any) => e.id === id);
      if (asset) {
        assetTitle = getDiscountLabel(asset);
        assetAmount += asset.assetBalance;
      }
    }
    store.checkedAssetInfo.assetTitle = assetTitle;
    store.checkedAssetInfo.assetAmount = assetAmount;
  },
);

// 选择会员卡时触发
const handleChange = (val: any) => {
  // 没有选择会员卡时，将所有会员卡状态重置
  if (val.length === 0) {
    assetList.value.forEach((item: any) => {
      item.disabled = false;
    });
    store.updateOrderDetailPrice();
    return;
  } else {
    // 更新明细价格
    // const assetId = val[0].split('-')[0];
    // const asset = store.member.vipAssetVOList.find((item: any) => item.id == assetId);
    // console.log('当前选择资产：', asset);
    // updateOrderItemPrice(asset);
    store.updateOrderDetailPrice();
  }

  // 当值变化时，禁用值不同的复选款
  assetList.value.forEach((item: any) => {
    item.disabled = getDiscountValue(item.discountValue) !== getDiscountValue(val[0]);
    if (item.disabled) {
      // item.assetDiscountRate = 0;
    }
  });
};

// 获取折扣值
const getDiscountValue = (params: string) => {
  return params.substring(params.indexOf('-') + 1);
};

/**
 * 获取折扣相关标签（整合折扣类型、折扣力度、是否赠送等逻辑）
 */
const getDiscountLabel = (data: any): string => {
  // 处理数据为空的情况
  if (!data) return '标准价';

  // 提取基础折扣类型的显示文本（默认标准价）
  const baseLabel = discountTypeMap[data.assetDiscountBase as DiscountType] || '标准价';

  // 处理折扣率（需存在且有效才显示折扣信息）
  const { assetDiscountRate } = data;
  if (assetDiscountRate !== undefined && assetDiscountRate < 100 && assetDiscountRate > 0) {
    return `${baseLabel}(${assetDiscountRate / 10}折)`;
  }

  // 无有效折扣率时直接返回基础标签
  return baseLabel;
};
</script>

<style scoped lang="scss">
.member-card-container {
  width: 320px;
  margin: 0 auto;
  height: 180px;
  overflow: hidden;
  // flex-shrink: 0;
}
</style>

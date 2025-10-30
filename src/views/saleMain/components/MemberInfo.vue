<template>
  <!-- <div v-if="store.order.vipId" class="member-info"> -->
  <div v-if="true" class="member-info">
    <div class="member-card-container">
      <MemberCard :member="store.member.vipInfoVO || {}" :show-reset-btn="false" />
    </div>
    <div class="tag-container"></div>
    <!-- 资产信息 -->
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
  <div v-else class="member-info">
    <el-empty description="未选择会员" />
  </div>
</template>

<script setup lang="ts">
import MemberCard from '@/components/Card/MemberCard.vue';
import PropertyCard from './PropertyCard.vue';

import { ref, watch, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { DiscountType, discountTypeMap } from '@/enums/index';

import { useOrderStore } from '@/store/modules/order/index';
import { useMemberStore } from '@/store/modules/member/member';
import { useDataEnumStore } from '@/store/modules/enums';
const enumsStore = useDataEnumStore();
const memberStore = useMemberStore();
const store = useOrderStore();
const router = useRouter();

onMounted(() => {
  enumsStore.getOrgList();
});

const assetList: any = computed(() => store.member.vipAssetVOList || []);

const checkedList = ref<any>([]);

watch(
  () => checkedList.value,
  (newVal) => {
    const assetIds = newVal.map((e: string) => parseInt(e.split('-')[0]));
    store.checkedAssetInfo.assetIds = assetIds;
    console.log('checkedList = ', newVal);
    console.log('assetIds = ', assetIds);

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

const handleChange = (val: any) => {
  if (val.length === 0) {
    assetList.value.forEach((item: any) => {
      item.disabled = false;
    });
    return;
  }
  console.log('val = ', val);

  // 当值变化时，禁用值不同的复选款
  assetList.value.forEach((item: any) => {
    item.disabled = getDiscountValue(item.discountValue) !== getDiscountValue(val[0]);
    if (item.disabled) {
      // item.assetDiscountRate = 0;
    }
  });
};
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
.member-info {
  height: calc(100% - 30px);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  width: 320px;
  margin: 30px auto 0 auto;
  overflow: auto;
  // border: 1px solid var(--el-border-color);

  .member-card-container {
    width: 100%;
  }
  .tag-container {
    height: 40px;
    width: 100%;
    // border: 1px solid var(--el-border-color);
  }
  .property-container {
    width: 100%;
    height: calc(100% - 230px);
  }
}
</style>

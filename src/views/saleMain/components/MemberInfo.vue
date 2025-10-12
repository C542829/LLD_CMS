<template>
  <!-- <div v-if="store.orderForm.vipId" class="member-info"> -->
  <div v-if="true" class="member-info">
    <div class="member-card-container">
      <MemberCard :member="store.member" :show-reset-btn="false" />
    </div>
    <div class="tag-container"></div>
    <!-- 资产信息 -->
    <el-scrollbar class="property-container">
      <el-checkbox-group v-model="checkList" @change="handleChange">
        <PropertyCard
          v-for="(item, index) in assetList"
          :key="item.id"
          :data="item"
          :index="index"
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
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MemberCard from '@/components/Card/MemberCard.vue';
import PropertyCard from './PropertyCard.vue';

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

const assetList: any = ref([]);
watch(
  () => store.orderForm.vipId,
  async (newVal, oldVal) => {
    if (newVal) {
      const asset = await memberStore.getMemberAsset(newVal);
      if (asset && asset?.vipAssetVOList) {
        assetList.value = asset.vipAssetVOList.map((item: any, index: number) => ({
          ...item,
          disabled: false,
          discountValue: `${index}-${item?.assetType}-${item?.assetDiscountBase}-${item?.assetDiscountRate}`,
        }));
      }
    }
  },
);

const checkList = ref<any>([]);
const handleChange = (val: any) => {
  if (val.length === 0) {
    assetList.value.forEach((item: any) => {
      item.disabled = false;
    });
    return;
  }
  // 当值变化时，禁用值不同的复选款
  assetList.value.forEach((item: any) => {
    item.disabled = getDiscountValue(item.discountValue) !== getDiscountValue(val[0]);
  });
};
const getDiscountValue = (params: string) => {
  return params.substring(params.indexOf('-') + 1);
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

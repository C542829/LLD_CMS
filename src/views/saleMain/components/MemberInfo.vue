<template>
  <div class="member-info" v-loading="loading">
    <!-- 会员卡信息 -->
    <div class="member-card-container">
      <template v-if="store.order.customerType === CustomerType.Member">
        <MemberCard :member="store.member.vipInfoVO || {}" :show-reset-btn="false" :show-remark="true" />
      </template>
      <template v-if="store.order.customerType === CustomerType.Guest">
        <el-descriptions :column="1">
          <el-descriptions-item label="顾客姓名:">
            <el-input v-model="store.order.customerName" placeholder="请输入散客姓名" clearable />
          </el-descriptions-item>
          <el-descriptions-item label="应付总额:">
            <span class="price-text">{{ store.truePayAmount }} 元</span>
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </div>

    <!-- <div v-if="false && store.order.customerType === CustomerType.Member" class="tag-container"></div> -->

    <!-- 资产信息 -->
    <div class="asset-container" v-if="store.order.customerType === CustomerType.Member">
      <template v-if="assetList && assetList.length > 0">
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
      <div class="coupon-container" v-if="store.member.vipTicketVOList && store.member.vipTicketVOList.length > 0">
        <CouponList></CouponList>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MemberCard from '@/components/Card/MemberCard.vue';
import PropertyCard from './PropertyCard.vue';
import CouponList from './CouponList.vue';

import { ref, watch, computed, onMounted } from 'vue';
import { isEmpty } from 'lodash';
import { CouponType, CustomerType, DiscountType, discountTypeMap } from '@/enums/index';

import { useOrderStore } from '@/store/modules/order/index';
import { useMemberStore } from '@/store/modules/member/member';
import { useDataEnumStore } from '@/store/modules/enums';
const enumsStore = useDataEnumStore();
const memberStore = useMemberStore();
const store = useOrderStore();

onMounted(() => {
  enumsStore.getOrgList();
});

const loading = ref(false);

watch(
  () => store.order.vipId,
  (newVal) => {
    if (newVal) {
      getMemberAsset(newVal);
      store.resetCheckedAssetInfo();
    }
  },
);

/** 获取会员资产 */
const getMemberAsset = async (id: number) => {
  loading.value = true;
  try {
    const asset = await memberStore.getMemberAssetList(id);
    if (asset && asset?.vipAssetVOList) {
      asset.vipAssetVOList = asset.vipAssetVOList.map((item: any, index: number) => ({
        ...item,
        disabled: false,
        discountValue: `${item.id}-${item?.assetDiscountBase}-${item?.assetDiscountRate}`,
      }));
    }
    if (asset && asset?.vipTicketVOList) {
      asset.vipTicketVOList = asset.vipTicketVOList.filter((item: any) => {
        return item.status != '已使用';
      });
      // asset.vipTicketVOList.sort((a: any, b: any) => {
      //   if (!a.expiryDate && a.expiryDate === -1) {
      //     a.expiryDate = new Date('2060-12-31');
      //   } else {
      //     a.expiryDate = new Date(a.expiryDate);
      //   }
      //   if (!b.expiryDate && b.expiryDate === -1) {
      //     b.expiryDate = new Date('2060-12-31');
      //   } else {
      //     b.expiryDate = new Date(b.expiryDate);
      //   }
      //   return a.expiryDate - b.expiryDate;
      // });
    }
    store.member = { ...asset.vipInfoVO, ...asset };
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

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
    store.resetOrderDetailPrice();
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
.member-info {
  height: calc(100% - 10px);
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 15px;
  // width: 320px;
  width: 100%;
  margin: 20px auto 0 auto;
  overflow: hidden;
  // border: 1px solid red;

  .member-card-container {
    width: 320px;
    margin: 0 auto;
    height: 180px;
    overflow: hidden;
    // flex-shrink: 0;
  }
  .tag-container {
    height: 40px;
    width: 320px;
    margin: 0 auto;
    border: 1px solid var(--el-border-color);
  }

  .asset-container {
    // flex: 1;
    width: 100%;
    // border: 1px solid var(--el-border-color);
    height: calc(100% - 195px);

    display: flex;
    gap: 15px;
    justify-content: center;

    > div {
      width: 320px;
      height: 100%;
      // border: 1px solid red;
      border-radius: 4px;
      border: 1px solid var(--el-border-color);
    }

    .member-card-container {
      height: 100%;
    }
    .property-container {
      width: 320px;
    }
    .coupon-container {
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>

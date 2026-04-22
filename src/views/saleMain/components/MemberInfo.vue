<template>
  <div class="member-info" v-loading="loading" :element-loading-text="LOADING_MSG">
    <!-- 会员卡信息 -->
    <div class="member-card-container">
      <template v-if="store.order.customerType === CustomerType.Member">
        <MemberCard
          :member="store.member.vipInfoVO || {}"
          :show-reset-btn="false"
          :show-remark="true"
          :show-info-btn="true"
        />
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
                :index="index"
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
import { CustomerType, DiscountType, discountTypeMap } from '@/enums/index';
import { LOADING_MSG } from '@/utils/constant';
import { useOrderStore } from '@/store/modules/order/index';
import { useMemberStore } from '@/store/modules/member/member';
import { useDataEnumStore } from '@/store/modules/enums';
const enumsStore = useDataEnumStore();
const memberStore = useMemberStore();
const store = useOrderStore();

onMounted(() => {
  // 获取门店列表用于更新折扣卡门店提示
  enumsStore.getOrgList();
});

const loading = ref(false);

// 监听订单ID变化
watch(
  () => store.order.id,
  (newVal) => {
    if (newVal) {
      checkedList.value = [];
    }
  },
);

// 监听会员ID变化
watch(
  () => store.order.vipId,
  (newVal) => {
    if (newVal) {
      store.resetCheckedAssetInfo();
      getMemberAsset(newVal);
    }
  },
);

/** 获取会员资产 */
const getMemberAsset = async (id: number) => {
  loading.value = true;
  try {
    const asset = await memberStore.getMemberAssetList(id);
    // 处理资产列表
    if (asset && asset?.vipAssetVOList) {
      asset.vipAssetVOList = asset.vipAssetVOList.map((item: any, index: number) => ({
        ...item,
        disabled: false,
        discountValue: `${item.id}-${item?.assetDiscountBase}-${item?.assetDiscountRate}`,
      }));
    }

    // 处理优惠券列表
    if (asset && asset?.vipTicketVOList) {
      asset.vipTicketVOList = asset.vipTicketVOList.filter((item: any) => {
        return item.status != '已使用';
      });
    }

    // 存储会员资产信息
    store.member = { ...asset.vipInfoVO, ...asset };
    // 重置选中资产
    checkedList.value = [];
  } catch (error) {
    console.error('获取会员资产失败：', error);
  } finally {
    loading.value = false;
  }
};

// 渲染会员资产列表
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

// 当前选择的资产列表
const checkedList = ref<any>([]);

/** 更新 pinia 中，当前选择的折扣卡参数 */
const updateSelectedDiscountCard = (val: string[]) => {
  const assetIds = val.map((e: string) => parseInt(e.split('-')[0]));
  store.checkedAssetInfo.assetIds = assetIds;

  let assetTitle = '';
  let assetAmount = 0;
  for (const id of assetIds) {
    const asset = assetList.value.find((e: any) => e.id === id);
    if (asset) {
      assetTitle = getDiscountLabel(asset);
      assetAmount += asset.assetBalance;

      // 更新选中资产信息
      store.checkedAssetInfo.assetDiscountBase = asset.assetDiscountBase;
      store.checkedAssetInfo.assetDiscountRate = asset.assetDiscountRate;
    }
  }
  store.checkedAssetInfo.assetTitle = assetTitle;
  store.checkedAssetInfo.assetAmount = assetAmount;
};

/** 选择会员卡时触发 */
const handleChange = (val: any) => {
  // 空数组处理
  if (val.length === 0) {
    // 重置 pinia 中选择的折扣卡信息
    store.resetCheckedAssetInfo();
    // 更新订单明细价格
    store.updateOrderDetailPrice();
    // 没有选择会员卡时，将所有会员卡状态重置
    assetList.value.forEach((item: any) => {
      item.disabled = false;
    });
    return;
  }

  // 更新选中的折扣卡信息
  updateSelectedDiscountCard(val);

  // 更新订单明细价格
  store.updateOrderDetailPrice();

  // 当值变化时，禁用值不同的复选款
  assetList.value.forEach((item: any) => {
    item.disabled = getDiscountValue(item.discountValue) !== getDiscountValue(val[0]);
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

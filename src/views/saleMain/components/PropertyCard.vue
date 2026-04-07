<template>
  <div class="fin-row">
    <div>
      <div class="row-item fin-row-index">
        <div class="asset-name text-overflow" :title="`${index + 1}. ${data?.assetName || ''}`">
          {{ index + 1 }}. {{ data?.assetName || '' }}
        </div>
        <div class="fin-row-amount text-overflow" :title="`应付: ${amount}`">应付: {{ amount }}</div>
      </div>
      <div class="row-item fin-row-discount-info">
        <el-checkbox
          :label="discountLabel"
          :value="data?.discountValue"
          :disabled="data?.disabled || !orderStore.isCreated"
        />
        <span class="fin-row-balance">余额：{{ data?.assetBalance }} 元</span>
      </div>
      <div class="row-item fin-row-org">
        <div class="fin-row-org-name">
          <EllipsisText :content="orgName" placement="left" />
        </div>
        <div class="fin-row-org-time text-overflow" :title="data.createTime || ''">{{ data?.createTime || '' }}</div>
      </div>
      <div class="row-item fin-row-remark">
        <!-- <EllipsisText :content="`备注：${data.remark || '-'}`" placement="left" /> -->
        <span style="font-size: 12px">备注：</span>
        <DynamicInput :value="data.remark" :params="data || {}" size="small" fontSize="12px" @update="updateRemark" />
      </div>
    </div>
    <div v-if="isGiving" class="is-giving">赠 送</div>
  </div>
</template>

<script setup lang="ts">
import Message from '@/components/Message';
import { computed, onMounted } from 'vue';
import { DiscountType, discountTypeMap } from '@/enums/index';
import { reqUpdateAssetRemark } from '@/api/member/member/index';
import { useDataEnumStore } from '@/store/modules/enums';
import { useOrderStore } from '@/store/modules/order/index';
const orderStore = useOrderStore();
const enumsStore = useDataEnumStore();

interface Props {
  data: any;
  index: number;
  amount?: number;
}
/**
 * 组件属性定义
 */
const props = withDefaults(defineProps<Props>(), {
  amount: 0,
  index: 0,
});

const payAmount = computed(() => {});

/** 更新会员备注 */
const updateRemark = async (remark: string, data: any) => {
  try {
    const res = await reqUpdateAssetRemark(data.id, remark);
    data.remark = remark;
    Message.success('更新资产备注成功');
  } catch (error) {
    Message.error('更新资产备注失败');
  } finally {
  }
};

// 折扣标签
const discountLabel = computed(() => {
  if (!props.data) return '标准价';
  if (hasDiscount.value) {
    return `${discountType.value}(${discountRate.value})`;
  } else {
    return discountType.value;
  }
});

/**
 * 折扣类型
 */
const discountType = computed(() => {
  if (!props.data) return '标准价';
  return props.data.assetDiscountBase ? discountTypeMap[props.data.assetDiscountBase as DiscountType] : '标准价';
});

/**
 * 是否有折扣
 */
const hasDiscount = computed(() => {
  return props.data && props.data.assetDiscountRate && props.data?.assetDiscountRate < 100;
});

/**
 * 获取折扣标签
 */
const discountRate = computed(() => {
  if (props.data.assetDiscountRate && props.data?.assetDiscountRate < 100) {
    return `${props.data.assetDiscountRate / 10}折`;
  }
});

// 是否赠送
const isGiving = computed(() => {
  return props.data.assetType === 1;
});

/**
 * 门店名称
 */
const orgName = computed(() => {
  if (!props.data?.orgId) return '未知门店';
  const org = enumsStore.orgList.find((item: any) => item.id === props.data?.orgId);
  return org?.orgName || '未知门店';
});
</script>

<style lang="scss" scoped>
.fin-row {
  --fin-width: 280px;
  --fin-line-height: 24px;
  --fin-min-row-height: 116px;

  width: var(--fin-width);
  min-height: var(--fin-min-row-height);
  height: auto;
  margin: 10px auto;
  padding: 10px 20px !important;
  color: var(--el-text-color-secondary);
  border-radius: 6px;
  box-shadow: 0 0 15px #c2bccc;
  position: relative;
  overflow: hidden;
  > div:first-child {
    height: auto;
  }
}

.fin-row .is-giving {
  position: absolute;
  background-color: #ff4500;
  right: -50px;
  top: -22px;
  height: 21px;
  width: 100px;
  line-height: 21px;
  color: #fff;
  text-align: center;
  transform-origin: left top;
  transform: rotate(45deg);
  font-size: 14px;
}

.row-item {
  overflow: hidden;
  display: flex;
  align-items: center;
  height: var(--fin-line-height);
  line-height: var(--fin-line-height);
}

.row-item .is-pt-prod {
  background-color: #3408f7;
}

.row-item .is-pt-prod,
.row-item .is-pt-svr {
  position: absolute;
  left: -30px;
  top: 41px;
  height: 15px;
  width: 100px;
  line-height: 15px;
  color: #fff;
  text-align: center;
  transform-origin: left top;
  transform: rotate(-45deg);
  font-size: 10px;
}

.row-item .is-pt-svr {
  background-color: #02af45;
}

.row-item .is-pt-treat {
  position: absolute;
  background-color: #fd5f5f;
  left: -30px;
  top: 41px;
  height: 15px;
  width: 100px;
  line-height: 15px;
  color: #fff;
  text-align: center;
  transform-origin: left top;
  transform: rotate(-45deg);
  font-size: 10px;
}

.fin-row-index {
  font-size: 14px;
  width: 100%;
  display: flex;
  gap: 10px;
  .asset-name {
    width: calc(100% - 80px);
  }
  .fin-row-amount {
    text-align: right;
    width: 80px;
    font-size: 13px;
    color: var(--el-color-success);
  }
}

.fin-row-discount-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fin-row-balance,
.fin-row-disinfo {
  display: inline-block;
  font-weight: 700;
  font-size: 13px;
}

.fin-row-balance {
  margin-left: 10px;
  color: var(--el-color-danger);
}

.fin-row-org {
  display: flex;
  flex-wrap: nowrap;
  font-size: 12px;
  .fin-row-org-name {
    flex: 1;
    width: calc(100% - 120px);
  }
  .fin-row-org-time {
    width: 120px;
    text-indent: 5px;
  }
}

.fin-row-remark {
  color: var(--el-text-color-regular);
  font-size: 12px;
  > span:first-child {
    width: 36px;
  }
  > div {
    width: calc(100% - 36px);
  }
}
</style>

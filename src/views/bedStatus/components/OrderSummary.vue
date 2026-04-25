<template>
  <div class="order-summary">
    <div class="order-summary__title">订单详情</div>
    <PaginationTable
      :data="dataList"
      v-loading="settingStore.loading"
      :element-loading-text="LOADING_MSG"
      :border="true"
      :stripe="true"
      :showPagination="false"
      size="small"
    >
      <el-table-column label="名称" width="100">
        <template #default="{ row }">
          {{ row.businessName }}
        </template>
      </el-table-column>
      <el-table-column label="技师/销售" width="120">
        <template #default="{ row }">
          <div v-if="row.technicians && row.technicians.length > 0">
            {{ row.technicians.map((t: any) => t.userName).join('、') }}
          </div>
          <div v-else>{{ row.userName || '-' }}</div>
        </template>
      </el-table-column>

      <el-table-column label="数量" width="60">
        <template #default="{ row }">
          {{ row.quantity }}
        </template>
      </el-table-column>

      <el-table-column label="单价" width="80">
        <template #default="{ row }">¥{{ row.truePrice || row.stdPrice || 0 }}</template>
      </el-table-column>
    </PaginationTable>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { LOADING_MSG } from '@/utils/constants';
import { useSettingStore } from '@/store/modules/acl/setting';

const settingStore = useSettingStore();

/**
 * 订单详情组件
 * @description 展示订单的产品列表信息
 */

// Props 定义
interface Props {
  /** 订单数据 */
  orderData?: any;
}

const props = defineProps<Props>();

// 计算属性：订单产品列表
const dataList = computed(() => {
  if (!props.orderData) return [];

  // 根据实际数据结构调整，如果订单数据中有 items 或 products 字段，则使用该字段
  if (Array.isArray(props.orderData.orderDetails)) {
    return props.orderData.orderDetails;
  }

  return [];
});
</script>

<style lang="scss" scoped>
.order-summary {
  &__title {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
  }
}
</style>

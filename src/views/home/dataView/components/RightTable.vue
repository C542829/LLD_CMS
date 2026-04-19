<template>
  <h2 class="right-table-title">充值统计</h2>
  <PaginationTable
    :data="rechargeTableData"
    :showPagination="false"
    :stripe="false"
    containerHeight="auto"
    size="small"
    height="auto"
    show-summary
  >
    <el-table-column prop="name" label="充值活动名称" :align="'center'" />
    <el-table-column prop="quantity" label="数量" :align="'center'" />
    <el-table-column prop="amount" label="金额" :align="'center'" />
  </PaginationTable>

  <h2 class="right-table-title">项目统计</h2>
  <PaginationTable
    :data="serviceTableData"
    :showPagination="false"
    :summary-method="summaryMethod"
    :stripe="false"
    size="small"
    height="auto"
    containerHeight="auto"
    show-summary
  >
    <el-table-column prop="name" label="项目名称" :align="'center'" />
    <el-table-column prop="quantity" label="点 | 轮 | 加" :align="'center'">
      <template #default="{ row }">
        <div class="count-num">
          <span>{{ row.designatedCount }}</span>
          <span>{{ row.rotationCount }}</span>
          <span>{{ row.addCount }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="amount" label="金额" :align="'center'" />
  </PaginationTable>

  <h2 class="right-table-title">产品统计</h2>
  <PaginationTable
    :data="productTableData"
    :showPagination="false"
    :stripe="false"
    containerHeight="auto"
    size="small"
    height="auto"
    show-summary
  >
    <el-table-column prop="name" label="产品名称" :align="'center'" />
    <el-table-column prop="quantity" label="数量" :align="'center'" />
    <el-table-column prop="amount" label="金额" :align="'center'" />
  </PaginationTable>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { reqProductSales, reqRechargeDetail, reqServiceStats, type Types } from '@/api/home/index';

const emit = defineEmits(['businessData']);

/** 充值/开卡数据 */
const rechargeTableData = ref<any[]>([]);
/** 获取充值/开卡数据 */
const getRechargeDetail = async (params: Types.DataViewQuery) => {
  try {
    const { data } = await reqRechargeDetail(params);
    rechargeTableData.value = data.items || [];
  } catch (error) {
    console.error(error);
  }
};
/** 充值/开卡数据 */
const productTableData = ref<any[]>([]);
/** 获取充值/开卡数据 */
const getProductDetail = async (params: Types.DataViewQuery) => {
  try {
    const { data } = await reqProductSales(params);
    productTableData.value = data.items || [];
  } catch (error) {
    console.error(error);
  }
};
/** 充值/开卡数据 */
const serviceTableData = ref<any[]>([]);
/** 获取充值/开卡数据 */
const getServiceDetail = async (params: Types.DataViewQuery) => {
  try {
    const { data } = await reqServiceStats(params);
    serviceTableData.value = data.items || [];
    emit('businessData', data);
  } catch (error) {
    console.error(error);
  }
};

/** 初始化数据 */
const initData = async (params: Types.DataViewQuery) => {
  getRechargeDetail(params);
  getProductDetail(params);
  getServiceDetail(params);
};

defineExpose({
  initData,
});

const summaryMethod = (data: { columns: any[]; data: any[] }) => {
  const { columns, data: rows } = data;
  const sums: any = [];
  columns.forEach((item, index) => {
    if (index === 0) {
      sums[index] = '合计';
      return;
    }
    if (item.property === 'quantity') {
      const lun = calcTotal(rows, 'rotationCount');
      const dian = calcTotal(rows, 'designatedCount');
      const jia = calcTotal(rows, 'addCount');
      sums[index] = `点钟：${dian}；轮牌：${lun}；加钟：${jia}`;
      return;
    }

    sums[index] = calcTotal(rows, item.property);
  });
  return sums;
};
const calcTotal = (rows: any, key: string) => {
  const values = rows.map((row: any) => row[key]);
  const result = values.reduce((prev: any, cur: any) => {
    const value = Number(cur);
    if (!isNaN(value)) {
      return prev + value;
    } else {
      return prev;
    }
  }, 0);
  return result.toFixed(2);
};
</script>

<style lang="scss" scoped>
.right-table-title {
  color: var(--el-text-color-secondary);
  font-weight: 600;
}
.count-num {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  span:first-child {
    border-right: 1px dashed gray;
  }
  span:last-child {
    border-left: 1px dashed gray;
  }
}
</style>

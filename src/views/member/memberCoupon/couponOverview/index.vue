<template>
  <div class="main-container">
    <!-- 搜索组件区域 -->
    <Card class="operation-card">
      <div class="search-container">
        <!-- 状态 -->
        <div class="search-item">
          <label>
            <span>查询时段：</span>
            <DatePicker v-model="summaryParams.dateRange" @change="search"></DatePicker>
          </label>
        </div>

        <!-- 搜索 -->
        <div class="search-item">
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
      </div>
    </Card>

    <!-- 数据列表 -->
    <Card class="table-card">
      <Table v-loading="loading" element-loading-text="加载中..." :data="couponSummary">
        <el-table-column prop="couponStatType" label="优惠券统计类型" :formatter="couponTypeMap" />
        <el-table-column label="赠送数量/金额">
          <template #default="{ row }">
            <p>赠送数量：{{ row.numOfSend }}张</p>
            <p>赠送金额：￥{{ row.amountOfSend }}</p>
          </template>
        </el-table-column>
        <el-table-column label="使用数量/金额">
          <template #default="{ row }">
            <p>使用数量：{{ row.numOfUse }}张</p>
            <p>使用金额：￥{{ row.amountOfUse }}</p>
          </template>
        </el-table-column>
        <el-table-column label="取消和失效数量/金额">
          <template #default="{ row }">
            <p>取消和失效数量：{{ row.numOfCancel }}张</p>
            <p>取消和失效金额：￥{{ row.amountOfCancel }}</p>
          </template>
        </el-table-column>
      </Table>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

import { couponTypeMap } from '@/utils/formatter';
import { formatDate } from '@/utils/time';

const loading = ref(false);

const summaryParams = reactive({ dateRange: [new Date(), new Date()] as [Date, Date] });

interface CouponSummaryItem {
  couponStatType: number;
  numOfSend: number;
  amountOfSend: number;
  numOfUse: number;
  amountOfUse: number;
  numOfCancel: number;
  amountOfCancel: number;
}

const couponSummary = ref<CouponSummaryItem[]>([]);

onMounted(() => {
  loadCouponSummary();
});

const search = () => {
  loadCouponSummary();
};

const loadCouponSummary = async () => {
  loading.value = true;
  try {
    const start = formatDate(summaryParams.dateRange[0]);
    const end = formatDate(summaryParams.dateRange[1]);
    console.log('查询时段:', start, '-', end);

    couponSummary.value = [
      {
        couponStatType: 0,
        numOfSend: 0,
        amountOfSend: 0,
        numOfUse: 0,
        amountOfUse: 0,
        numOfCancel: 0,
        amountOfCancel: 0,
      },
      {
        couponStatType: 0,
        numOfSend: 0,
        amountOfSend: 0,
        numOfUse: 0,
        amountOfUse: 0,
        numOfCancel: 0,
        amountOfCancel: 0,
      },
      {
        couponStatType: 0,
        numOfSend: 0,
        amountOfSend: 0,
        numOfUse: 0,
        amountOfUse: 0,
        numOfCancel: 0,
        amountOfCancel: 0,
      },
      {
        couponStatType: 0,
        numOfSend: 0,
        amountOfSend: 0,
        numOfUse: 0,
        amountOfUse: 0,
        numOfCancel: 0,
        amountOfCancel: 0,
      },
      {
        couponStatType: 0,
        numOfSend: 0,
        amountOfSend: 0,
        numOfUse: 0,
        amountOfUse: 0,
        numOfCancel: 0,
        amountOfCancel: 0,
      },
      {
        couponStatType: 0,
        numOfSend: 0,
        amountOfSend: 0,
        numOfUse: 0,
        amountOfUse: 0,
        numOfCancel: 0,
        amountOfCancel: 0,
      },
    ];
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss"></style>

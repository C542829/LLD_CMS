<template>
  <div class="main-container">
    <!-- 搜索组件区域 -->
    <Card class="operation-card">
      <div class="search-container">
        <!-- 选择门店 -->
        <div class="search-item" v-if="false">
          <label for="storeId">选择门店：</label>
          <el-select v-model="store.searchParams.storeId" id="storeId" style="width: 120px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <!-- 状态 -->
        <div class="search-item">
          <label for="staffStatus2">优惠券状态：</label>
          <DatePicker v-model="store.searchParams.dateRange"></DatePicker>
        </div>

        <!-- 搜索 -->
        <div class="search-item">
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
      </div>
    </Card>

    <!-- 数据列表 -->
    <Card class="table-card">
      <Table v-loading="store.loading" :data="store.couponTotal">
        <el-table-column prop="couponStatType" label="优惠券统计类型" :formatter="couponTypeMap" />
        <el-table-column label="赠送数量/金额">
          <template #default="scope">
            <p>赠送数量：{{ scope.row.numOfSend }}张</p>
            <p>赠送金额：￥{{ scope.row.amountOfSend }}</p>
          </template>
        </el-table-column>
        <el-table-column label="使用数量/金额">
          <template #default="scope">
            <p>使用数量：{{ scope.row.numOfUse }}张</p>
            <p>使用金额：￥{{ scope.row.amountOfUse }}</p>
          </template>
        </el-table-column>
        <el-table-column label="取消和失效数量/金额">
          <template #default="scope">
            <p>取消和失效数量：{{ scope.row.numOfCancel }}张</p>
            <p>取消和失效金额：￥{{ scope.row.amountOfCancel }}</p>
          </template>
        </el-table-column>
      </Table>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
import { formatDate } from '@/utils/time';
// 导入枚举数据
import { statusOptions } from '@/enums/index';
import { couponTypeMap } from '@/enums/mapFormatter';
// 引入数据仓库
import { useCouponStore } from '@/store/modules/member/memberCoupon';
const store = useCouponStore();

onMounted(() => {
  store.setCouponTotal();
});

// 搜索
const search = () => {
  store.setCouponTotal();
};
</script>

<style scoped lang="scss"></style>

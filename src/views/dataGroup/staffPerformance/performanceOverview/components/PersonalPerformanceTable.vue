<template>
  <div style="width: 85%; height: 400px; margin: 12px auto">
    <PaginationTable
      v-loading="loading"
      :element-loading-text="LOADING_MSG"
      :data="performanceRecord"
      :total="pageInfo.total"
      v-model:currentPage="pageInfo.pageNum"
      v-model:pageSize="pageInfo.pageSize"
      @size-change="handleSizeChange"
      @pagination-current-change="handleCurrentChange"
      show-summary
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="createTime" label="业绩日期" :formatter="dateFormatter" />
      <el-table-column label="订单编号" width="200">
        <template #default="scope">
          {{ scope.row.orderCode }}
        </template>
      </el-table-column>
      <el-table-column prop="serviceName" label="项目/产品/疗程名称" width="155" />
      <el-table-column label="类型">
        <template #default="{ row }">
          <ServiceTypeTag :type="row.serviceType as OrderDetailType" />
        </template>
      </el-table-column>
      <el-table-column label="上钟类型">
        <template #default="{ row }">
          <ClockInTypeTag :type="row.clockInType as ServiceType" />
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="数量" />
      <el-table-column prop="userName" label="提成技师" />
      <el-table-column prop="performance" label="业绩金额" />
      <el-table-column prop="commission" label="提成金额" />
    </PaginationTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, withDefaults, watch } from 'vue';
import { reqPerformanceRecord } from '@/api/dataGroup/staffPerformance/index';
import { dateFormatter } from '@/utils/formatter';
import { LOADING_MSG } from '@/utils/constant';
import { OrderDetailType, ServiceType } from '@/enums/index';

interface Props {
  data: any;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({}),
});

const loading = ref(false);
const performanceRecord = ref<any>([]);
const expandRowKeys = ref<any>([]);
const pageInfo = reactive<any>({
  pageNum: 1,
  pageSize: 30,
  total: 0,
});
const userName = ref('');

const searchRecord = async () => {
  try {
    const params = {
      pageNum: pageInfo.pageNum,
      pageSize: pageInfo.pageSize,
      username: userName.value,
    };
    const res = await reqPerformanceRecord(params);
    performanceRecord.value = res?.data?.rows;
    pageInfo.total = res?.data?.total;
  } catch (error) {}
};
const handleSizeChange = (val: number) => {
  pageInfo.pageSize = val;
  searchRecord();
};
const handleCurrentChange = (val: number) => {
  pageInfo.pageNum = val;
  searchRecord();
};

const expandChange = async (row: any) => {
  // console.log(row);
  userName.value = row.userName;
  expandRowKeys.value = [row.userName];
  searchRecord();
};

watch(
  () => props.data,
  (newVal) => {
    if (newVal) {
      expandChange(newVal);
    }
  },
  { immediate: true },
);
</script>

<style></style>

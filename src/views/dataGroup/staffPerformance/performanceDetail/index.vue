<template>
  <div class="main-container">
    <!-- 数据筛选 -->
    <Card class="operation-card">
      <!-- 第一行 -->
      <div class="search-container">
        <div class="search-item" v-if="false">
          <label>
            选择门店：
            <el-select v-model="store.searchParams.storeId" clearable style="width: 120px" placeholder="选择门店">
              <el-option
                v-for="item in [{ value: 1, label: '' }]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </label>
        </div>
        <div class="search-item">
          <label>
            开单时段：
            <DatePicker v-model="store.searchParams.date" style="width: 260px" />
          </label>
        </div>
      </div>

      <!-- 第二行 -->
      <div class="search-container">
        <div class="search-item">
          <label>
            选择部门：
            <el-select v-model="store.searchParams.saleStaff" clearable placeholder="选择部门" style="width: 120px">
              <el-option label="未指定" value="0" />
              <el-option
                v-for="item in [{ value: 1, label: '' }]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </label>
        </div>
        <div class="search-item">
          <label>
            产品/项目：
            <el-select
              v-model="store.searchParams.saleStaff"
              clearable
              placeholder="选择产品/项目"
              style="width: 140px"
            >
              <el-option label="未指定" value="0" />
              <el-option
                v-for="item in [{ value: 1, label: '' }]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </label>
        </div>
        <div class="search-item">
          <label>
            提成技师：
            <el-select v-model="store.searchParams.saleStaff" clearable placeholder="选择技师" style="width: 120px">
              <el-option label="全部" value="0" />
              <el-option
                v-for="item in [{ value: 1, label: '' }]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </label>
        </div>
        <div class="search-item">
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
      </div>
    </Card>

    <!-- 数据列表 -->
    <Card padding="0px" bgColor="#fff">
      <PaginationTable
        v-loading="store.loading"
        :data="store.performanceRecord.data"
        :total="store.performanceRecord.total"
        v-model:currentPage="store.searchParams.currentPage"
        v-model:pageSize="store.searchParams.pageSize"
        @size-change="handleSizeChange"
        @pagination-current-change="handleCurrentChange"
        show-summary
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="recDate" label="业绩日期" :formatter="dateFormatter" />
        <el-table-column label="订单编号" width="150">
          <template #default="scope">
            {{ scope.row.busNo }}
          </template>
        </el-table-column>
        <el-table-column prop="itemName" label="项目/产品/疗程名称" width="155" />
        <el-table-column prop="serviceType" label="类型" />
        <el-table-column prop="perfType" label="上钟类型" />
        <el-table-column prop="itemNum" label="数量" />
        <el-table-column prop="staffId" label="提成技师" />
        <el-table-column prop="perfAmount" label="业绩金额" />
        <el-table-column prop="amount" label="提成金额" />
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button @click="showDialog(scope.row)" link type="primary">查看原单</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <el-dialog v-model="dialog.visible" title="收银单据">
    <Receipt :receipt="receiptInfo" />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { dateFormatter } from '@/utils/time';
import Receipt from './Receipt.vue';

// 引入数据仓库
import { useStaffPerformanceStore } from '@/store/modules/dataGroup/staffPerformance';
const store = useStaffPerformanceStore();

// 初始化
onMounted(() => {
  store.setPerformanceRecord();
});

onUnmounted(() => {
  store.loading = false;
});

// 搜索
const search = () => {
  store.setPerformanceRecord();
};

// 处理分页变化
const handleSizeChange = (val: number) => {
  store.searchParams.pageSize = val;
  store.setPerformanceRecord();
};

const handleCurrentChange = (val: number) => {
  store.searchParams.currentPage = val;
  store.setPerformanceRecord();
};

// 模态框
const dialog: any = reactive({
  title: '修改单据',
  visible: false,
});

const receiptInfo: any = ref({});

const showDialog = (row: any) => {
  receiptInfo.value = row;
  dialog.visible = true;
};
</script>

<style scoped lang="scss"></style>

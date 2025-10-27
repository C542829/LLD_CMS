<template>
  <div class="main-container">
    <!-- 数据筛选 -->
    <Card class="operation-card">
      <!-- 第一行 -->
      <div class="search-container">
        <div class="search-item" v-if="false">
          <label for="staffStatus">选择店铺：</label>
          <el-select v-model="store.searchParams.storeId" id="staffStatus" style="width: 120px" placeholder="选择店铺">
            <el-option
              v-for="item in [{ value: 1, label: '' }]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
            销售员：
            <el-select v-model="store.searchParams.saleStaff" clearable placeholder="选择销售员" style="width: 120px">
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
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
        <div class="search-item">
          <el-button type="primary" @click="">导出表格</el-button>
        </div>
      </div>
    </Card>

    <!-- 数据列表 -->
    <Card padding="0">
      <PaginationTable
        v-loading="settingStore.loading"
        :element-loading-text="settingStore.loadingMsg"
        :data="store.saleDetail.data"
        :total="store.saleDetail.total"
        v-model:currentPage="store.searchParams.pageNum"
        v-model:pageSize="store.searchParams.pageSize"
        @size-change="handleSizeChange"
        @pagination-current-change="handleCurrentChange"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="orderCode" label="订单编号" />
        <el-table-column prop="detailCode" label="明细编号" />
        <el-table-column label="名称/标准价">
          <template #default="scope">
            <p>{{ scope.row.businessName }}</p>
            <p>标准价：{{ scope.row.stdPrice }}</p>
          </template>
        </el-table-column>

        <el-table-column label="实收单价/销售数量">
          <template #default="scope">
            <p>实收单价：{{ scope.row.truePrice }}</p>
            <p>销售数量：{{ scope.row.quantity }}</p>
          </template>
        </el-table-column>

        <el-table-column label="技师/销售">
          <template #default="scope">
            技师：{{ scope.row.userId }}({{ scope.row.userName }})
            <el-text type="primary" style="font-weight: bold">[{{ scope.row.serverType }}]</el-text>
          </template>
        </el-table-column>
        <el-table-column prop="tradeTime" label="结算时间" :formatter="datetimeFormatter" />
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button @click="showDialog(scope.row)" link type="primary">查看原单</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <el-dialog v-model="dialog.visible" title="收银单据">
    <Receipt />
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, inject, onMounted } from 'vue';
import { datetimeFormatter } from '@/utils/formatter';
import Receipt from './Receipt.vue';

// 引入数据仓库
import { useSettingStore } from '@/store/modules/acl/setting';
import { useSaleStore } from '@/store/modules/dataGroup/saleData';
const settingStore = useSettingStore();
const store = useSaleStore();

// 初始化
onMounted(() => {
  store.setSaleDetail();
});

// 搜索
const search = () => {
  store.setSaleDetail();
};

// 处理分页变化
const handleSizeChange = (val: number) => {
  store.searchParams.pageSize = val;
  store.setSaleDetail();
};

const handleCurrentChange = (val: number) => {
  store.searchParams.pageNum = val;
  store.setSaleDetail();
};

// 模态框
const dialog: any = reactive({
  title: '修改单据',
  visible: false,
});

const showDialog = (row: any) => {
  // 显示模态框
  dialog.visible = true;

  // 表单数据回显
  // store = row;
};
</script>

<style scoped lang="scss"></style>

<template>
  <div class="main-container">
    <!-- 搜索组件区域 -->
    <Card class="operation-card">
      <SearchForm @search="handleSearchParams" />
    </Card>

    <!-- 表格组件 -->
    <Card padding="0">
      <PaginationTable
        v-loading="settingStore.loading"
        :element-loading-text="settingStore.loadingMsg"
        :data="tableData.list"
        :total="tableData.total"
        v-model:currentPage="searchParams.pageNum"
        v-model:pageSize="searchParams.pageSize"
        @size-change="handleSizeChange"
        @pagination-current-change="handleCurrentChange"
      >
        <el-table-column prop="orderType" label="订单类型" width="85" />
        <el-table-column prop="orderCode" label="订单编号" />
        <el-table-column prop="productName" label="产品名称&编码">
          <template #default="{ row }">{{ row.productName }}({{ row.productCode }})</template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="总金额" :formatter="amountFormatter" />
        <el-table-column prop="price" label="单价" :formatter="amountFormatter" />
        <el-table-column prop="quantity" label="数量" />
        <el-table-column prop="operator" label="操作人" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button @click="showDetail(row)" link type="primary">查看原单</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <!-- 详情 -->
  <Dialog v-model="dialog.visible" :title="dialog.title" center>
    <ShowDetail :data="dialog.data" />
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import SearchForm from '@/views/setGroup/stock/components/SearchForm.vue';
import ShowDetail from '@/views/setGroup/stock/components/ShowDetail.vue';

import { amountFormatter } from '@/utils/formatter';

import { useSettingStore } from '@/store/modules/acl/setting';
const settingStore = useSettingStore();
import { useStockStore } from '@/store/modules/setGroup/stock';
const store = useStockStore();

onMounted(() => {
  search();
});

const tableData = reactive<any>({ total: 0, list: [] });

const searchParams = ref<any>({
  pageNum: 1,
  pageSize: 20,
});

const search = async () => {
  settingStore.loading = true;
  const data: any = await store.getStockLogList(searchParams.value);
  tableData.total = data.total;
  tableData.list = data.rows;
  settingStore.loading = false;
};

const handleSearchParams = (params: any) => {
  searchParams.value.operator = params.operator;
  searchParams.value.orderCode = params.orderCode;
  searchParams.value.startDate = params.startDate;
  searchParams.value.endDate = params.endDate;
  search();
};

// 处理分页变化
const handleSizeChange = (val: number) => {
  searchParams.value.pageSize = val;
  search();
};

const handleCurrentChange = (val: number) => {
  searchParams.value.pageNum = val;
  search();
};

const dialog = reactive({
  title: '入库详情',
  visible: false,
  data: {},
});

const showDetail = async (row: any) => {
  const { orderType, orderCode } = row;
  if (orderType === '入库') {
    dialog.title = '入库详情';
    dialog.data = await store.getInStockInfo(orderCode);
  } else {
    dialog.title = '出库详情';
    dialog.data = await store.getOutStockInfo(orderCode);
  }

  dialog.visible = true;
};
</script>

<style scoped lang="scss"></style>

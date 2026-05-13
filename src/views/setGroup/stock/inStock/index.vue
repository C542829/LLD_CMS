<template>
  <div class="main-container">
    <!-- 搜索组件区域 -->
    <Card class="operation-card">
      <div class="search-container">
        <el-button type="primary" @click="createOrder">新建入库单</el-button>
      </div>
      <SearchForm @search="handleSearchParams" type="in" />
    </Card>

    <!-- 表格组件 -->
    <Card padding="0">
      <PaginationTable
        v-loading="loading"
        :element-loading-text="LOADING_MSG"
        :data="tableData.list"
        :total="tableData.total"
        v-model:currentPage="searchParams.pageNum"
        v-model:pageSize="searchParams.pageSize"
        @size-change="handleSizeChange"
        @pagination-current-change="handleCurrentChange"
      >
        <el-table-column prop="orderCode" label="入库单编号" />
        <el-table-column prop="totalPrice" label="总金额" :formatter="amountFormatter" />
        <el-table-column prop="operator" label="操作人" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button @click="showDetail(row)" link type="primary">详情</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <!-- 详情 -->
  <Dialog v-model="dialog.visible" :title="dialog.title" center>
    <ShowDetail :data="dialog.data" />
  </Dialog>

  <!-- 新建入库单 -->
  <Dialog
    v-model="createDialog.visible"
    :title="createDialog.title"
    top="10vh"
    style="max-width: 1400px"
    width="75%"
    center
  >
    <CreateOrder :handle="createDialog.handle" @submit="handleSubmit" />
  </Dialog>
</template>

<script setup lang="ts">
import SearchForm from '@/views/setGroup/stock/components/SearchForm.vue';
import ShowDetail from '@/views/setGroup/stock/components/ShowDetail.vue';
import CreateOrder from '@/views/setGroup/stock/components/CreateOrder.vue';
import { ref, reactive, onMounted } from 'vue';
import { amountFormatter } from '@/utils/formatter';
import { LOADING_MSG } from '@/utils/constants';
import { reqInStockList } from '@/api/setGroup/stock';
import { type SearchParams } from '@/api/setGroup/stock/type';
import { parseResObj } from '@/utils/parseResponse';

const loading = ref(false);
const tableData = reactive<any>({ total: 0, list: [] });
const searchParams = ref<SearchParams>({
  pageNum: 1,
  pageSize: 20,
});

const fetchList = async () => {
  loading.value = true;
  try {
    const res = await reqInStockList(searchParams.value);
    const data = parseResObj(res);
    tableData.total = data?.total || 0;
    tableData.list = data?.rows || [];
  } finally {
    loading.value = false;
  }
};

const handleSearchParams = (params: any) => {
  searchParams.value.operator = params.operator;
  searchParams.value.orderCode = params.orderCode;
  searchParams.value.startTime = params.startTime;
  searchParams.value.endTime = params.endTime;
  fetchList();
};

const handleSizeChange = (val: number) => {
  searchParams.value.pageSize = val;
  fetchList();
};

const handleCurrentChange = (val: number) => {
  searchParams.value.pageNum = val;
  fetchList();
};

const handleSubmit = () => {
  fetchList();
};

const dialog = reactive({
  title: '入库详情',
  visible: false,
  data: {},
});
const showDetail = (row: any) => {
  dialog.data = row;
  dialog.visible = true;
};

const createDialog = reactive({
  title: '新建入库单',
  visible: false,
  handle: 'in',
});
const createOrder = () => {
  createDialog.visible = true;
};

onMounted(() => {
  fetchList();
});
</script>

<style scoped lang="scss"></style>

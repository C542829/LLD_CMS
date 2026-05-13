<template>
  <div class="main-container">
    <!-- 搜索组件区域 -->
    <Card class="operation-card">
      <SearchForm @search="handleSearchParams" type="log" />
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
        <el-table-column prop="orderType" label="订单类型" width="85" />
        <el-table-column prop="orderCode" label="订单编号" min-width="100" />
        <el-table-column prop="productName" label="产品名称&编码" min-width="100">
          <template #default="{ row }">{{ row.productName }}({{ row.productCode }})</template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="总金额" :formatter="amountFormatter" min-width="70" />
        <el-table-column prop="price" label="单价" :formatter="amountFormatter" min-width="60" />
        <el-table-column prop="quantity" label="数量" min-width="50" />
        <el-table-column prop="operator" label="操作人" min-width="60" />
        <el-table-column prop="createTime" label="创建时间" min-width="90" />
        <el-table-column prop="remark" label="备注" min-width="80" />
        <el-table-column label="操作" min-width="60">
          <template #default="{ row }">
            <el-button @click="showDetail(row)" link type="primary">查看原单</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <!-- 详情 -->
  <Dialog v-model="dialog.visible" :title="dialog.title" center>
    <ShowDetail :data="dialog.data" v-loading="detailLoading" :element-loading-text="LOADING_MSG" />
  </Dialog>
</template>

<script setup lang="ts">
import SearchForm from '@/views/setGroup/stock/components/SearchForm.vue';
import ShowDetail from '@/views/setGroup/stock/components/ShowDetail.vue';
import { ref, reactive, onMounted } from 'vue';
import { amountFormatter } from '@/utils/formatter';
import { LOADING_MSG } from '@/utils/constants';
import { reqStockLogList, reqInStockInfo, reqOutStockInfo } from '@/api/setGroup/stock';
import { type SearchParams } from '@/api/setGroup/stock/type';
import { parseResObj } from '@/utils/parseResponse';

const loading = ref(false);
const detailLoading = ref(false);
const tableData = reactive<any>({ total: 0, list: [] });
const searchParams = ref<SearchParams>({
  pageNum: 1,
  pageSize: 20,
});

const fetchList = async () => {
  loading.value = true;
  try {
    const res = await reqStockLogList(searchParams.value);
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
  searchParams.value.orgId = params.orgId;
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

const dialog = reactive({
  title: '入库详情',
  visible: false,
  data: {},
});

const showDetail = async (row: any) => {
  dialog.visible = true;
  detailLoading.value = true;
  try {
    const { orderType, orderCode } = row;
    if (orderType === '入库') {
      dialog.title = '入库详情';
      const res = await reqInStockInfo(orderCode);
      dialog.data = parseResObj(res) || {};
    } else {
      dialog.title = '出库详情';
      const res = await reqOutStockInfo({ orderCode });
      dialog.data = parseResObj(res) || {};
    }
  } finally {
    detailLoading.value = false;
  }
};

onMounted(() => {
  fetchList();
});
</script>

<style scoped lang="scss"></style>

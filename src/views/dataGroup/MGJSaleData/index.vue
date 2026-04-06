<template>
  <div class="main-container">
    <Card class="operation-card">
      <div class="search-container">
        <div class="search-item">
          <label>
            开单时段：
            <el-date-picker
              v-model="dateRange"
              :shortcuts="shortcuts"
              unlinkPanels
              clearable
              type="daterange"
              class="w-240"
              rangeSeparator="至"
              startPlaceholder="开始日期"
              endPlaceholder="结束日期"
              format="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
            />
          </label>
        </div>
        <!-- <div class="search-item">
          <label for="billno">单据编号：</label>
          <el-input
            v-model="searchParams.billno"
            id="billno"
            class="w-120"
            placeholder="单据编号"
            clearable
            @clear="search"
          />
        </div>
        <div class="search-item">
          <label for="name">顾客姓名：</label>
          <el-input
            v-model="searchParams.name"
            id="name"
            class="w-100"
            placeholder="顾客姓名"
            clearable
            @clear="search"
          />
        </div>
        <div class="search-item">
          <label for="billtype">账单类型：</label>
          <el-select
            v-model="searchParams.billtype"
            clearable
            @change="search"
            id="billtype"
            class="w-100"
            placeholder="账单类型"
          >
            <el-option v-for="item in BILL_TYPE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="search-item">
          <label for="billstatus">账单状态：</label>
          <el-select
            v-model="searchParams.billstatus"
            clearable
            @change="search"
            id="billstatus"
            class="w-100"
            placeholder="账单状态"
          >
            <el-option v-for="item in BILL_STATUS_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div> -->

        <div class="search-item">
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
        <div class="search-item">
          <el-button type="info" @click="resetSearchParams">重置</el-button>
        </div>
      </div>
    </Card>

    <Card padding="0">
      <PaginationTable
        v-loading="loading"
        element-loading-text="加载中..."
        :data="tableData.list"
        :total="tableData.total"
        v-model:pageNum="searchParams.pageNum"
        v-model:pageSize="searchParams.pageSize"
        @size-change="handleSizeChange"
        @pagination-current-change="handleCurrentChange"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="billno" label="单据编号" min-width="80" />
        <el-table-column label="账单类型" min-width="60">
          <template #default="{ row }">
            {{ BILL_TYPE_MAP[row.billtype] || '未知' }}
          </template>
        </el-table-column>
        <el-table-column label="顾客信息" min-width="120">
          <template #default="{ row }">
            <p>姓名：{{ row.name || '-' }}</p>
            <p>性别：{{ SEX_MAP[row.sex] || '-' }}</p>
          </template>
        </el-table-column>
        <el-table-column label="消费金额" min-width="80">
          <template #default="{ row }">
            <span class="text-primary">￥{{ row.consumefee || '0' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实收金额" min-width="80">
          <template #default="{ row }">
            <span class="text-success">￥{{ row.eafee || '0' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付方式" min-width="100">
          <template #default="{ row }">
            <div v-if="row.cashs && row.cashs.length > 0">
              <p v-for="(cash, index) in row.cashs" :key="index">
                <span v-if="cash.cash > 0">现金：￥{{ cash.cash }}</span>
                <span v-if="cash.weixin > 0">微信：￥{{ cash.weixin }}</span>
                <span v-if="cash.dianpin > 0">点评：￥{{ cash.dianpin }}</span>
              </p>
            </div>
            <div v-if="row.cards && row.cards.length > 0">
              <p v-for="(card, index) in row.cards" :key="index">
                <span v-if="card.cardFee > 0">会员卡：￥{{ card.cardFee }}</span>
                <span v-if="card.treatFee > 0">疗程：￥{{ card.treatFee }}</span>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="消费项目" min-width="120">
          <template #default="{ row }">
            <div v-if="row.items && row.items.length > 0">
              <p v-for="(item, index) in row.items.slice(0, 2)" :key="index">
                {{ item.serviceItemName }}
                <span v-if="item.num > 1">x{{ item.num }}</span>
              </p>
              <p v-if="row.items.length > 2" class="text-info">共{{ row.items.length }}项</p>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="账单状态" min-width="60">
          <template #default="{ row }">
            <el-tag :type="row.billstatus === 0 ? 'success' : 'danger'">
              {{ BILL_STATUS_MAP[row.billstatus] || '未知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="开单时间" min-width="100">
          <template #default="{ row }">
            {{ formatTimestamp(row.createDate) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ row }">
            <el-button @click="showDetailDialog(row)" link type="primary">详情</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>
  <DetailDialog v-model="dialogVisible" :billData="currentBill" />
</template>

<script setup lang="ts">
import DetailDialog from './components/DetailDialog.vue';
import { reactive, onMounted, ref } from 'vue';
import { reqConsumeBillList } from './utils/api';
import type { ConsumeBill, ConsumeBillQuery } from './utils/types';
import { BILL_TYPE_OPTIONS, BILL_STATUS_OPTIONS, BILL_TYPE_MAP, BILL_STATUS_MAP, SEX_MAP } from './utils/types';
import { shortcuts } from '@/utils/time';
import { cloneDeep } from 'lodash';

const loading = ref(false);

const dateRange = ref<string[]>([]);

const DEFAULT_SEARCH_PARAMS: ConsumeBillQuery = {
  pageNum: 1,
  pageSize: 50,
  startTime: '',
  endTime: '',
  billno: '',
  name: '',
  billtype: undefined,
  billstatus: undefined,
};

const searchParams = reactive<ConsumeBillQuery>(cloneDeep(DEFAULT_SEARCH_PARAMS));

const tableData = reactive<{ list: ConsumeBill[]; total: number }>({
  list: [],
  total: 0,
});

const dialogVisible = ref(false);
const currentBill = ref<ConsumeBill | null>(null);

onMounted(() => {
  search();
});

const resetSearchParams = () => {
  Object.assign(searchParams, cloneDeep(DEFAULT_SEARCH_PARAMS));
  dateRange.value = [];
  search();
};

const fetchTableData = async () => {
  loading.value = true;
  try {
    const params = { ...searchParams };
    if (Array.isArray(dateRange.value) && dateRange.value.length === 2) {
      params.startTime = dateRange.value[0];
      params.endTime = dateRange.value[1];
    }
    const res = await reqConsumeBillList(params);
    tableData.total = res.data.total;
    tableData.list = res.data.rows;
  } catch (error) {
    console.error('获取消费账单列表失败：', error);
  } finally {
    loading.value = false;
  }
};

const search = () => {
  searchParams.pageNum = 1;
  fetchTableData();
};

const handleSizeChange = () => {
  fetchTableData();
};

const handleCurrentChange = () => {
  fetchTableData();
};

const formatTimestamp = (timestamp: number): string => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const showDetailDialog = (row: ConsumeBill) => {
  currentBill.value = cloneDeep(row);
  dialogVisible.value = true;
};
</script>

<style scoped lang="scss">
.main-container {
  padding: $main-padding;
}
</style>

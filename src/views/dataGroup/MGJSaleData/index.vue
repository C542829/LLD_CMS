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
        <div class="search-item">
          <label for="storeId">门店：</label>
          <el-select
            v-model="searchParams.storeId"
            clearable
            @change="search"
            id="storeId"
            class="w-100"
            placeholder="门店"
          >
            <el-option v-for="item in StoreOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="search-item">
          <label for="name">姓名：</label>
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
          <label for="memberId">会员ID：</label>
          <el-input
            v-model="searchParams.memberId"
            id="memberId"
            class="w-100"
            placeholder="会员ID"
            clearable
            @clear="search"
          />
        </div>

        <!-- <div class="search-item">
          <label for="consumeType">消费类型：</label>
          <el-select
            v-model="searchParams.consumeType"
            clearable
            @change="search"
            id="consumeType"
            class="w-100"
            placeholder="消费类型"
          >
            <el-option v-for="item in CONSUME_TYPE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div> -->
        <!-- <div class="search-item">
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
        :row-class-name="getRowClassName"
        v-model:pageNum="searchParams.pageNum"
        v-model:pageSize="searchParams.pageSize"
        @size-change="handleSizeChange"
        @pagination-current-change="handleCurrentChange"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column label="门店" min-width="60">
          <template #default="{ row }">
            {{ StoreMap[row.storeId] || '未知' }}
          </template>
        </el-table-column>
        <el-table-column prop="billno" label="单据编号" width="85" />
        <el-table-column label="顾客信息" min-width="100">
          <template #default="{ row }">
            <p class="text">姓名：{{ row.name || '散客' }}</p>
            <template v-if="row.memberId">
              <p class="text">会员ID：{{ row.memberId }}</p>
            </template>
            <p class="text">性别：{{ SEX_MAP[row.sex] || '-' }}</p>
          </template>
        </el-table-column>
        <el-table-column label="金额" min-width="60">
          <template #default="{ row }">
            <span class="text-primary">￥{{ row.consumefee || '0' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入账" min-width="60">
          <template #default="{ row }">
            <span class="text-success">￥{{ row.eafee || '0' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付方式" min-width="100">
          <template #default="{ row }">
            <div v-if="row.cashs && row.cashs.length > 0">
              <p v-for="(cash, index) in row.cashs" :key="'cash-' + index">
                <span v-if="cash.cash > 0">现金：￥{{ cash.cash }}</span>
                <span v-if="cash.weixin > 0">微信：￥{{ cash.weixin }}</span>
                <span v-if="cash.dianpin > 0">点评：￥{{ cash.dianpin }}</span>
              </p>
            </div>
            <div v-if="row.cards && row.cards.length > 0">
              <p v-for="(card, index) in row.cards" :key="'card-' + index">
                <span v-if="card.cardFee > 0">会员卡：￥{{ card.cardFee }}</span>
                <span v-if="card.treatFee > 0">疗程：￥{{ card.treatFee }}</span>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="消费项目" min-width="200">
          <template #default="{ row }">
            <template v-if="row.items && row.items.length > 0">
              <p class="text" v-for="(item, index) in row.items" :key="index">
                {{ item.serviceItemName }}
                <span class="quantity" v-if="item.num > 1">x{{ item.num }}</span>
                <span class="price">￥{{ item.price }}</span>
                <template v-if="item.emps && item.emps.length > 0">
                  <span class="emps">（{{ getEmpsName(item?.emps) }}）</span>
                </template>
              </p>
            </template>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="账单状态" min-width="60">
          <template #default="{ row }">
            <el-tag :type="row.billstatus === 0 ? 'success' : 'danger'">
              {{ BILL_STATUS_MAP[row.billstatus] || '未知' }}
            </el-tag>
          </template>
        </el-table-column> -->
        <el-table-column prop="createDate" label="开单时间" min-width="100" :formatter="datetimeFormatter" />
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
import { ref, reactive, onMounted } from 'vue';
import { cloneDeep } from 'lodash';
import { datetimeFormatter } from '@/utils/formatter';
import { shortcuts } from '@/utils/time';
import { reqMGJSaleDataList } from './utils/api';
import type { MgjSaleDataQuery, MgjSaleDataParsed } from './utils/types';
import {
  StoreMap,
  BILL_STATUS_OPTIONS,
  CONSUME_TYPE_MAP,
  BILL_STATUS_MAP,
  SEX_MAP,
  parseSaleDataVO,
  StoreOptions,
} from './utils/index';

/** 加载状态 */
const loading = ref(false);

/** 日期范围 */
const dateRange = ref<string[]>([]);

/** 默认搜索参数 */
const DEFAULT_SEARCH_PARAMS: MgjSaleDataQuery = {
  pageNum: 1,
  pageSize: 50,
  startDate: '',
  endDate: '',
  name: '',
  memberId: '',
  storeId: '',
  consumeType: undefined,
  billstatus: undefined,
};

/** 搜索参数 */
const searchParams = reactive<MgjSaleDataQuery>(cloneDeep(DEFAULT_SEARCH_PARAMS));

/** 表格数据 */
const tableData = reactive<{ list: MgjSaleDataParsed[]; total: number }>({
  list: [],
  total: 0,
});

/** 详情弹窗 */
const dialogVisible = ref(false);
const currentBill = ref<MgjSaleDataParsed | null>(null);

onMounted(() => {
  search();
});

/** 重置搜索参数 */
const resetSearchParams = () => {
  Object.assign(searchParams, cloneDeep(DEFAULT_SEARCH_PARAMS));
  dateRange.value = [];
  search();
};

/** 获取表格数据 */
const fetchTableData = async () => {
  loading.value = true;
  try {
    const params = { ...searchParams };
    if (Array.isArray(dateRange.value) && dateRange.value.length === 2) {
      params.startDate = dateRange.value[0];
      params.endDate = dateRange.value[1];
    }
    const res = await reqMGJSaleDataList(params);
    // 解析 VO 中的 JSON 字段
    tableData.list = (res.data.rows || []).map(parseSaleDataVO);
    tableData.total = res.data.total;
  } catch (error) {
    console.error('获取销售数据列表失败：', error);
  } finally {
    loading.value = false;
  }
};

/** 搜索 */
const search = () => {
  searchParams.pageNum = 1;
  fetchTableData();
};

/** 每页大小变化 */
const handleSizeChange = () => {
  fetchTableData();
};

/** 页码变化 */
const handleCurrentChange = () => {
  fetchTableData();
};

/** 显示详情弹窗 */
const showDetailDialog = (row: MgjSaleDataParsed) => {
  currentBill.value = cloneDeep(row);
  dialogVisible.value = true;
};

/** 消费类型下拉选项（从映射生成，过滤掉 -1） */
const CONSUME_TYPE_OPTIONS: OptionItem[] = Object.entries(CONSUME_TYPE_MAP)
  .filter(([key]) => Number(key) !== -1)
  .map(([value, label]) => ({ value: Number(value), label }));

/** 获取员工姓名列表 */
const getEmpsName = (emps: any) => {
  return emps.map((emp: any) => emp.empName).join('、');
};

// 设置行样式
const getRowClassName = ({ row }: { row: { memberId: number } }) => {
  return row.memberId === 0 ? 'disabled-row' : '';
};
</script>

<style scoped lang="scss">
.main-container {
  padding: $main-padding;
}

.quantity {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.price {
  color: var(--el-color-danger);
}
.emps {
  font-size: 12px;
  color: var(--el-color-primary);
}
</style>

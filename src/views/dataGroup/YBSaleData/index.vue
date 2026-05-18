<template>
  <div class="main-container">
    <Card class="operation-card">
      <div class="search-container">
        <div class="search-item">
          <label>
            交易时段：
            <IDatePicker v-model="dateRange" :default="false" @change="search" @clear="search" class="w-220" />
          </label>
        </div>
        <template v-if="userStore.isAdmin">
          <div class="search-item">
            <label for="orgId">门店：</label>
            <el-select
              v-model="searchParams.orgId"
              clearable
              @change="search"
              id="orgId"
              class="w-100"
              placeholder="门店"
            >
              <el-option v-for="item in storeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </template>
        <div class="search-item">
          <label for="memName">姓名：</label>
          <el-input
            v-model="searchParams.memName"
            id="memName"
            class="w-80"
            placeholder="会员姓名"
            clearable
            @clear="search"
          />
        </div>
        <div class="search-item">
          <label for="cellPhoneNo">手机号：</label>
          <el-input
            v-model="searchParams.cellPhoneNo"
            id="cellPhoneNo"
            class="w-120"
            placeholder="手机号"
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
        <el-table-column prop="orgName" label="门店" min-width="80" />
        <el-table-column prop="salesNo" label="销售单号" width="120" />
        <el-table-column label="顾客信息" min-width="120">
          <template #default="{ row }">
            <p class="text">姓名：{{ row.memName || '散客' }}</p>
            <p v-if="row.cellPhoneNo" class="text">手机：{{ row.cellPhoneNo }}</p>
            <p v-if="row.memberId" class="text">ID：{{ row.memberId }}</p>
          </template>
        </el-table-column>
        <el-table-column label="应收/实收" min-width="100">
          <template #default="{ row }">
            <p class="text">
              应收：
              <span class="text-primary">￥{{ row.shouldAmount?.toFixed(2) || '0.00' }}</span>
            </p>
            <p class="text">
              实收：
              <span class="text-success">￥{{ row.actualAmount?.toFixed(2) || '0.00' }}</span>
            </p>
            <p v-if="row.discountAmount > 0" class="text">
              优惠：
              <span class="text-danger">￥{{ row.discountAmount?.toFixed(2) }}</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="支付方式" min-width="160">
          <template #default="{ row }">
            <template v-for="field in PAY_FIELDS" :key="field.key">
              <p v-if="row[field.key] > 0" class="text">
                {{ field.label }}：
                <span class="text-success">￥{{ row[field.key]?.toFixed(2) }}</span>
              </p>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="消费项目" min-width="200">
          <template #default="{ row }">
            <template v-if="row.details && row.details.length > 0">
              <p class="text" v-for="(detail, index) in row.details" :key="index">
                {{ detail.prodName }}
                <span class="quantity" v-if="detail.quantity > 1">x{{ detail.quantity }}</span>
                <span class="price">￥{{ detail.acturalPrice?.toFixed(2) }}</span>
                <template v-if="detail.serviceStaffName">
                  <span class="emps">（{{ detail.serviceStaffName }}）</span>
                </template>
              </p>
            </template>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getOrderStatusTagType(row.orderStatus) as any" size="small">
              {{ ORDER_STATUS_MAP[row.orderStatus] || '未知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tradeTime" label="交易时间" min-width="100" />
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ row }">
            <el-button @click="showDetailDialog(row)" link type="primary">详情</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>
  <DetailDialog v-model="dialogVisible" :data="currentRow" />
</template>

<script setup lang="ts">
import DetailDialog from './components/DetailDialog.vue';
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { cloneDeep } from 'lodash';
import { reqYbSaleDataList } from './utils/api';
import type { YbSaleDataQuery, YbSaleDataVO } from './utils/types';
import {
  ORDER_STATUS_MAP,
  ORDER_STATUS_OPTIONS,
  MEMBER_LEVEL_MAP,
  MEMBER_LEVEL_TAG_TYPE,
  PAY_FIELDS,
  getOrderStatusTagType,
} from './utils/index';
import useUserStore from '@/store/modules/acl/user';
import { saleData } from './utils/data';

const route = useRoute();
const userStore = useUserStore();

// TODO: 门店选项需要从接口获取或配置
const storeOptions = computed<OptionItem[]>(() => {
  // 临时返回空数组，后续根据实际门店数据配置
  return [];
});

/** 加载状态 */
const loading = ref(false);

/** 日期范围 */
const dateRange = ref<string[]>([]);

/** 默认搜索参数 */
const DEFAULT_SEARCH_PARAMS: YbSaleDataQuery = {
  pageNum: 1,
  pageSize: 50,
  startTime: '',
  endTime: '',
  memName: '',
  cellPhoneNo: '',
  memberId: '',
  orgId: '',
  orderStatus: undefined,
};

/** 搜索参数 */
const searchParams = reactive<YbSaleDataQuery>(cloneDeep(DEFAULT_SEARCH_PARAMS));

const memberId = route.query.memberId;
if (memberId) {
  searchParams.memberId = memberId as string;
}

/** 表格数据 */
const tableData = reactive<{ list: YbSaleDataVO[]; total: number }>({
  list: [],
  total: 0,
});

/** 详情弹窗 */
const dialogVisible = ref(false);
const currentRow = ref<YbSaleDataVO | null>(null);

onMounted(() => {
  setTimeout(() => {
    search();
  }, 0);
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
      params.startTime = dateRange.value[0];
      params.endTime = dateRange.value[1];
    }
    // const res = await reqYbSaleDataList(params);
    // tableData.list = res.data.rows || [];
    tableData.list = saleData;
    tableData.total = res.data.total;
  } catch (error) {
    console.error('获取杨波销售数据列表失败：', error);
  } finally {
    loading.value = false;
  }
};

/** 搜索 */
const search = () => {
  fetchTableData();
};

/** 每页大小变化 */
const handleSizeChange = (val: number) => {
  searchParams.pageSize = val;
  fetchTableData();
};

/** 页码变化 */
const handleCurrentChange = (val: number) => {
  searchParams.pageNum = val;
  fetchTableData();
};

/** 显示详情弹窗 */
const showDetailDialog = (row: YbSaleDataVO) => {
  currentRow.value = cloneDeep(row);
  dialogVisible.value = true;
};

// 设置行样式（散客灰色显示）
const getRowClassName = ({ row }: { row: YbSaleDataVO }) => {
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

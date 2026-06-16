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
          <label for="isVip">会员类型：</label>
          <el-select
            v-model="searchParams.isVip"
            clearable
            @change="search"
            id="isVip"
            class="w-80"
            placeholder="会员类型"
          >
            <el-option label="全部" value="" />
            <el-option label="散客" :value="0" />
            <el-option label="会员" :value="1" />
          </el-select>
        </div>
        <div class="search-item">
          <label for="memberName">姓名：</label>
          <el-input
            v-model="searchParams.memberName"
            id="memberName"
            class="w-80"
            placeholder="姓名"
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
        <!-- <div class="search-item">
          <label for="memberId">会员ID：</label>
          <el-input
            v-model="searchParams.memberId"
            id="memberId"
            class="w-80"
            placeholder="会员ID"
            clearable
            @clear="search"
          />
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
        <el-table-column prop="orgName" label="门店" min-width="80">
          <template #default="{ row }">
            {{ STORE_MAP[row.orgId] || row.orgName }}
          </template>
        </el-table-column>
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
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { cloneDeep } from 'lodash';
import { reqYbSaleDataList } from './utils/api';
import type { YbSaleDataQuery, YbSaleDataParsed } from './utils/types';
import { STORE_MAP, PAY_FIELDS, STORE_OPTIONS, parseSaleDataVO } from './utils/index';
import useUserStore from '@/store/modules/acl/user';

const route = useRoute();
const userStore = useUserStore();

/** 根据用户角色动态计算门店选项：管理员看全部门店，非管理员只看所属门店 */
const storeOptions = computed(() => {
  if (userStore.isAdmin) {
    return STORE_OPTIONS;
  }
  if (!userStore.org || !userStore.org.legacyOrgId) {
    return [];
  }
  return STORE_OPTIONS.filter((item) => item.value == userStore.org!.legacyOrgId);
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
  memberName: '',
  cellPhoneNo: '',
  memberId: '',
  orgId: '',
  isVip: 1,
};

/** 搜索参数 */
const searchParams = reactive<YbSaleDataQuery>(cloneDeep(DEFAULT_SEARCH_PARAMS));

// 接收路由跳转入参
const queryMemberId = route.query.memberId;
if (queryMemberId) {
  searchParams.memberId = queryMemberId as string;
}
const queryOrgId = route.query.orgId;
if (queryOrgId) {
  searchParams.orgId = Number(queryOrgId);
}

/** 表格数据 */
const tableData = reactive<{ list: YbSaleDataParsed[]; total: number }>({
  list: [],
  total: 0,
});

/** 详情弹窗 */
const dialogVisible = ref(false);
const currentRow = ref<YbSaleDataParsed | null>(null);

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
    const res = await reqYbSaleDataList(params);
    tableData.list = (res.data.rows || []).map(parseSaleDataVO);
    tableData.total = res.data.total;
  } catch (error) {
    console.error('获取杨波销售数据列表失败：', error);
  } finally {
    loading.value = false;
  }
};

/** 搜索 */
const search = () => {
  // 非管理员且无门店选项时，设置 orgId 为 0
  if (storeOptions.value.length === 0) {
    searchParams.orgId = 0;
  }
  // 非管理员且只有一个门店时，自动选中该门店
  if (storeOptions.value.length === 1) {
    searchParams.orgId = storeOptions.value[0].value;
  }
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
const showDetailDialog = (row: YbSaleDataParsed) => {
  currentRow.value = cloneDeep(row);
  dialogVisible.value = true;
};

// 设置行样式（散客灰色显示）
const getRowClassName = ({ row }: { row: YbSaleDataParsed }) => {
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

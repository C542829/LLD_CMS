<template>
  <div class="main-container">
    <!-- 数据筛选 -->
    <Card class="operation-card">
      <div class="search-container">
        <div class="search-item">
          <label>
            时间段：
            <IDateTimePicker v-model="dateRange" :default="false" @change="search" @clear="search" class="w-220" />
          </label>
        </div>

        <div class="search-item">
          <label for="status">状态：</label>
          <el-select
            v-model="searchParams.status"
            clearable
            @change="search"
            id="status"
            class="w-80"
            placeholder="状态"
          >
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <div class="search-item">
          <label>
            门店：
            <OrgSelect v-model="searchParams.orgId" :multiple="false" class="w-120" @clear="search" @change="search" />
          </label>
        </div>

        <!-- 操作模块 -->
        <div class="search-item">
          <label for="module">操作模块：</label>
          <el-select
            v-model="searchParams.module"
            clearable
            @change="search"
            id="module"
            class="w-100"
            placeholder="操作模块"
          >
            <el-option v-for="item in operModuleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <!-- 操作人 -->
        <div class="search-item">
          <label for="operatorName">操作人：</label>
          <div>
            <el-input
              v-model="searchParams.operatorName"
              id="operatorName"
              class="w-100"
              placeholder="操作人姓名"
              clearable
              @clear="search"
            />
          </div>
        </div>

        <!-- 搜索按钮 -->
        <div class="search-item">
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
        <div class="search-item">
          <el-button type="info" @click="resetSearchParams">重置</el-button>
        </div>
      </div>
    </Card>

    <!-- 数据列表 -->
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
        <el-table-column prop="module" label="操作模块" min-width="50">
          <template #default="{ row }">
            {{ operModuleMap[row.module] || '未知' }}
          </template>
        </el-table-column>
        <el-table-column prop="requestUrl" label="HTTP方法" min-width="100" />
        <el-table-column prop="operatorName" label="操作人" min-width="50" />
        <el-table-column prop="orgId" label="门店" min-width="50">
          <template #default="{ row }">
            {{ formatOrgId(row.orgId) || '未知' }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="ip" label="操作IP" min-width="60" /> -->
        <el-table-column label="状态" min-width="30">
          <template #default="{ row }">
            <el-tag v-if="row.status === 0" type="success">成功</el-tag>
            <el-tag v-else type="danger">失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="操作描述" min-width="100"></el-table-column>
        <el-table-column prop="createTime" label="操作时间" min-width="80"></el-table-column>
      </PaginationTable>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, computed } from 'vue';
import { reqOrgList } from '@/api/acl/org/index';
import { type Types, reqOperLogList } from '@/api/sys/index';
import { cloneDeep } from 'lodash';

const loading = ref(false);

/** 日期范围 */
const dateRange = ref<string[]>([]);

const DEFAULT_SEARCH_PARAMS = {
  pageNum: 1,
  pageSize: 50,
  endTime: '',
  module: '',
  operatorName: '',
  startTime: '',
  status: '',
};

const operModuleOptions = [
  { value: '', label: '全部模块' },
  { value: 'system', label: '系统管理' },
  { value: 'order', label: '订单管理' },
  { value: 'vip', label: '会员管理' },
  { value: 'stock', label: '库存管理' },
  { value: 'payment', label: '支付管理' },
  { value: 'server', label: '服务管理' },
  { value: 'room', label: '房间管理' },
  { value: 'kpi', label: '绩效管理' },
];

const operModuleMap = {
  system: '系统管理',
  order: '订单管理',
  vip: '会员管理',
  stock: '库存管理',
  payment: '支付管理',
  server: '服务管理',
  room: '房间管理',
  kpi: '绩效管理',
};
const statusOptions = [
  { value: '', label: '全部' },
  { value: 0, label: '成功' },
  { value: 1, label: '失败' },
];

const searchParams = reactive<Types.SearchOperLogParams>(cloneDeep(DEFAULT_SEARCH_PARAMS));

const tableData = reactive<{ list: Types.OperLogVO[]; total: number }>({
  list: [],
  total: 0,
});

// 初始化
onMounted(async () => {
  await getOrgList();
  search();
});

const resetSearchParams = () => {
  Object.assign(searchParams, cloneDeep(DEFAULT_SEARCH_PARAMS));
  dateRange.value = [];
  search();
};

const setTableData = async () => {
  loading.value = true;
  try {
    const { data } = await reqOperLogList(searchParams);
    tableData.total = data.total;
    tableData.list = data.rows;
  } catch (error) {
    console.error('获取操作日志失败：', error);
  } finally {
    loading.value = false;
  }
};

// 搜索
const search = () => {
  // 处理日期范围参数
  if (Array.isArray(dateRange.value) && dateRange.value.length === 2) {
    searchParams.startTime = dateRange.value[0];
    searchParams.endTime = dateRange.value[1];
  } else {
    searchParams.startTime = '';
    searchParams.endTime = '';
  }

  if (searchParams.status == undefined) {
    searchParams.status = '';
  }
  if (searchParams.module == undefined) {
    searchParams.module = '';
  }

  setTableData();
};

// 处理分页变化
const handleSizeChange = (val: number) => {
  searchParams.pageSize = val;
  search();
};

const handleCurrentChange = (val: number) => {
  searchParams.pageNum = val;
  search();
};

/** 门店列表 */
const orgList = ref<OrgInfo[]>([]);

/**
 * 获取门店列表
 */
const getOrgList = async () => {
  loading.value = true;
  try {
    const res = await reqOrgList();
    const data = res.data;
    orgList.value = data.filter((item) => !item?.orgCode.includes('Test'));
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

// 门店映射计算属性
const orgMap = computed(() => {
  const map = new Map();
  orgList.value.forEach((item: any) => {
    map.set(item.id, item.orgName);
  });
  return map;
});

// 格式化门店显示
const formatOrgId = (orgId: any) => {
  return orgMap.value.get(String(orgId)) || orgId || '';
};
</script>

<style scoped lang="scss">
.main-container {
  padding: $main-padding;
}
</style>

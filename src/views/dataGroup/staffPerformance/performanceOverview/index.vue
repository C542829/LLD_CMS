<template>
  <div class="main-container">
    <!-- 数据筛选 -->
    <Card class="operation-card">
      <!-- 第一行 -->
      <div class="search-container">
        <div class="search-item">
          <label>
            销售时段：
            <IDatePicker v-model="dateRange" @change="search" @clear="search" class="w-220" />
          </label>
        </div>

        <template v-if="userStore.isAdmin || userStore.isAreaManager">
          <div class="search-item">
            <label>
              门店：
              <OrgSelect
                v-model="searchParams.orgIds"
                placeholder="门店"
                class="w-100"
                :multiple="true"
                :max-collapse-tags="0"
                @change="search"
                @clear="search"
              />
            </label>
          </div>
        </template>
        <div class="search-item">
          <label>
            技师：
            <UserSelect
              v-model="searchParams.userId"
              placeholder="技师"
              class="w-100"
              :multiple="false"
              @change="search"
              @clear="search"
            />
          </label>
        </div>
        <div class="search-item">
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="success" @click="handleExport">导出表格</el-button>
        </div>
      </div>
    </Card>

    <!-- 数据列表 -->
    <Card padding="0">
      <PaginationTable
        v-loading="settingStore.loading"
        :element-loading-text="settingStore.loadingMsg"
        :data="performanceSummary"
        :showPagination="false"
        show-summary
        style="width: 100%"
        row-key="userId"
      >
        <el-table-column type="expand" width="60" fixed>
          <template #default="{ row }">
            <PersonalPerformanceTable :data="row" />
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="60" fixed />
        <el-table-column prop="orgName" label="门店" width="60" fixed />
        <el-table-column prop="userName" label="技师" width="100" fixed>
          <template #default="{ row }">{{ row.userName }}({{ row.userCode }})</template>
        </el-table-column>
        <el-table-column prop="totalPerformance" label="总业绩" min-width="85" fixed />
        <el-table-column prop="totalCommission" label="总提成" min-width="85" fixed />
        <el-table-column prop="totalProjectCount" label="总项目次" min-width="85" />
        <el-table-column prop="appointmentCount" label="点钟次数" min-width="85" />
        <el-table-column prop="rotationCount" label="轮牌次数" min-width="85" />
        <el-table-column prop="extendCount" label="加钟次数" min-width="85" />
        <el-table-column prop="projectPerformance" label="项目业绩" min-width="85" />
        <el-table-column prop="projectCommission" label="项目提成" min-width="85" />
        <el-table-column prop="productPerformance" label="产品业绩" min-width="85" />
        <el-table-column prop="productCommission" label="产品提成" min-width="85" />
        <el-table-column prop="cureTicketPerformance" label="疗程销售业绩" min-width="110" />
        <el-table-column prop="cureTicketCommission" label="疗程销售提成" min-width="110" />
        <el-table-column prop="rechargePerformance" label="卡金业绩" min-width="85" />
        <el-table-column prop="rechargeCommission" label="卡金提成" min-width="85" />
      </PaginationTable>
    </Card>
  </div>
</template>

<script setup lang="ts">
import PersonalPerformanceTable from './components/PersonalPerformanceTable.vue';
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { reqPerformanceSummary } from '@/api/dataGroup/staffPerformance/index';
import type { KpiSummaryQuery, KpiSummaryVO } from '@/api/dataGroup/staffPerformance/types';
import { parseResList } from '@/utils/parseResponse';
import { exportExcel, type ExportColumn } from '@/utils/exportExcel';
// 引入数据仓库
import { useSettingStore } from '@/store/modules/acl/setting';
import { useDataEnumStore } from '@/store/modules/enums/index';
import useUserStore from '@/store/modules/acl/user';

const userStore = useUserStore();
const settingStore = useSettingStore();
const dataEnumStore = useDataEnumStore();

/** 日期范围 */
const dateRange = ref<string[]>([]);

// 搜索参数
const searchParams = ref<KpiSummaryQuery>({
  startTime: '',
  endTime: '',
  orgIds: [],
  userId: undefined,
});

/** 处理搜索参数 */
const handleSearchParams = () => {
  if (dateRange.value.length === 0) {
    searchParams.value.startTime = '';
    searchParams.value.endTime = '';
  } else {
    searchParams.value.startTime = dateRange.value[0] as string;
    searchParams.value.endTime = dateRange.value[1] as string;
  }
};

// 绩效汇总数据
const performanceSummary = ref<KpiSummaryVO[]>([]);

// 技师列表
const staffList: any = ref([]);
const loadStaffList = async () => {
  try {
    staffList.value = await dataEnumStore.getStaffList();
  } catch (error) {
    console.error('加载技师列表失败:', error);
  }
};

/**
 * 获取绩效汇总数据
 */
const setPerformanceSummary = async () => {
  try {
    settingStore.loading = true;
    handleSearchParams();
    const params = { ...searchParams.value };
    const res = await reqPerformanceSummary(params);
    const data: any = parseResList(res);
    performanceSummary.value = data || [];
  } catch (error) {
    console.error('获取绩效汇总失败:', error);
    ElMessage.error('获取绩效汇总失败');
  } finally {
    settingStore.loading = false;
  }
};

// 初始化
onMounted(() => {
  loadStaffList();
  setPerformanceSummary();
});

// 搜索
const search = () => {
  setPerformanceSummary();
};

/** 导出列配置 */
const exportColumns: ExportColumn<KpiSummaryVO>[] = [
  { key: 'orgName', title: '门店', width: 16 },
  { key: 'userName', title: '技师', width: 12 },
  { key: 'userCode', title: '工号', width: 12 },
  { key: 'totalPerformance', title: '总业绩', width: 12 },
  { key: 'totalCommission', title: '总提成', width: 12 },
  { key: 'totalProjectCount', title: '总项目次', width: 10 },
  { key: 'appointmentCount', title: '点钟次数', width: 10 },
  { key: 'rotationCount', title: '轮牌次数', width: 10 },
  { key: 'extendCount', title: '加钟次数', width: 10 },
  { key: 'projectPerformance', title: '项目业绩', width: 12 },
  { key: 'projectCommission', title: '项目提成', width: 12 },
  { key: 'productPerformance', title: '产品业绩', width: 12 },
  { key: 'productCommission', title: '产品提成', width: 12 },
  { key: 'cureTicketPerformance', title: '疗程销售业绩', width: 14 },
  { key: 'cureTicketCommission', title: '疗程销售提成', width: 14 },
  { key: 'rechargePerformance', title: '卡金业绩', width: 12 },
  { key: 'rechargeCommission', title: '卡金提成', width: 12 },
];

/** 导出表格 */
const handleExport = () => {
  if (!performanceSummary.value.length) {
    return ElMessage.warning('暂无数据可导出');
  }

  exportExcel({
    fileName: '绩效汇总',
    sheets: {
      sheetName: '绩效汇总',
      columns: exportColumns,
      data: performanceSummary.value,
    },
  });
};
</script>

<style scoped lang="scss"></style>

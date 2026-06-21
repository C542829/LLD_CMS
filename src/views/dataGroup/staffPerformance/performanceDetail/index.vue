<template>
  <div class="main-container">
    <!-- 数据筛选 -->
    <Card class="operation-card">
      <!-- 第一行 -->
      <div class="search-container">
        <div class="search-item">
          <label>
            开单时段：
            <IDatePicker v-model="dateRange" class="w-220" @change="search" @clear="search" />
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
        <!-- <div class="search-item">
          <label>
            产品：
            <ProductSelect
              v-model="searchParams.serviceCode"
              placeholder="选择产品"
              class="w-100"
              :multiple="false"
              @change="search"
              @clear="search"
            />
          </label>
        </div> -->
        <!-- <div class="search-item">
          <label>
            项目：
            <ServiceItemSelect
              v-model="searchParams.serviceCode"
              placeholder="选择项目"
              class="w-100"
              :multiple="false"
              @change="search"
              @clear="search"
            />
          </label>
        </div> -->
        <!-- <template v-if="userStore.isAdmin || userStore.isAreaManager">
          <div class="search-item">
            <el-input v-model="searchParams.username" clearable @clear="search" placeholder="技师姓名" class="w-100" />
          </div>
        </template>
        <template v-else> -->
        <div class="search-item">
          <label>
            提成技师：
            <UserSelect
              v-model="searchParams.userId"
              placeholder="技师"
              class="w-100"
              :multiple="false"
              :defaultProps="{
                label: 'userName',
                value: 'userId',
                code: 'userCode',
              }"
              @change="search"
              @clear="search"
            />
          </label>
        </div>
        <!-- </template> -->
        <div class="search-item">
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="success" :loading="exportLoading" @click="exportData">导出</el-button>
        </div>
      </div>
    </Card>

    <!-- 数据列表 -->
    <Card padding="0">
      <PaginationTable
        v-loading="loading"
        :element-loading-text="LOADING_MSG"
        :data="performanceRecord.data"
        :total="performanceRecord.total"
        v-model:currentPage="searchParams.pageNum"
        v-model:pageSize="searchParams.pageSize"
        @size-change="handleSizeChange"
        @pagination-current-change="handleCurrentChange"
        show-summary
      >
        <el-table-column type="index" label="序号" align="center" width="60" />
        <el-table-column prop="orgName" label="门店" min-width="50" />
        <el-table-column prop="createTime" label="业绩日期" min-width="60" />
        <el-table-column label="订单编号" prop="orderCode" min-width="60" />
        <el-table-column prop="serviceName" label="项目/产品/疗程名称" width="155" />
        <el-table-column label="类型" align="center" width="70">
          <template #default="{ row }">
            <ServiceTypeTag :type="row.bizType" />
          </template>
        </el-table-column>
        <el-table-column label="上钟类型" align="center" width="90">
          <template #default="{ row }">
            <template v-if="row.bizType === OrderDetailType.Service">
              <ClockInTypeTag :type="row.itemType" />
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" align="center" width="70" />
        <el-table-column prop="userName" label="提成技师" align="center" min-width="50" />
        <el-table-column prop="performance" label="业绩金额" align="center" min-width="50" />
        <el-table-column prop="commission" label="提成金额" align="center" min-width="50" />
        <el-table-column label="操作" min-width="50">
          <template #default="{ row }">
            <el-button @click="showDialog(row)" link type="primary">查看原单</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <ReceiptDialog v-model="dialog.visible" :data="dialog.data" />
</template>

<script setup lang="ts">
import ProductSelect from '@/components/FormComponents/ProductSelect.vue';
import ServiceItemSelect from '@/components/FormComponents/ServiceItemSelect.vue';
import ReceiptDialog from './components/ReceiptDialog.vue';
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { reqPerformanceRecord, reqPerformanceExport } from '@/api/dataGroup/staffPerformance/index';
import type { KpiListQuery, KpiListVO } from '@/api/dataGroup/staffPerformance/types';
import { parseResObj } from '@/utils/parseResponse';
import { OrderDetailType, ServiceType } from '@/enums';
import { LOADING_MSG } from '@/utils/constants';
import { downloadBlob } from '@/utils/download';
import useUserStore from '@/store/modules/acl/user';

const userStore = useUserStore();

const loading = ref<boolean>(false);

/** 日期范围 */
const dateRange = ref<string[]>([]);

// 搜索参数
const searchParams = ref<KpiListQuery>({
  pageNum: 1,
  pageSize: 50,
  startTime: '',
  endTime: '',
  orgIds: [],
  serviceCode: '',
  userId: '',
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
  if (searchParams.value.userId === undefined) {
    searchParams.value.userId = '';
  }
};

// 绩效记录数据
const performanceRecord = reactive<{
  total: number;
  data: KpiListVO[];
}>({
  total: 0,
  data: [],
});

/**
 * 获取绩效记录列表
 */
const setPerformanceRecord = async () => {
  try {
    loading.value = true;
    handleSearchParams();
    const params = { ...searchParams.value };
    const res = await reqPerformanceRecord(params);
    const data: any = parseResObj(res);
    performanceRecord.total = data.total;
    performanceRecord.data = data.rows;
  } catch (error) {
    console.error('获取绩效记录失败:', error);
    ElMessage.error('获取绩效记录失败');
  } finally {
    loading.value = false;
  }
};

// 初始化
onMounted(() => {
  search();
});

// 搜索
const search = () => {
  setPerformanceRecord();
};

// 处理分页变化
const handleSizeChange = (val: number) => {
  searchParams.value.pageSize = val;
  setPerformanceRecord();
};

const handleCurrentChange = (val: number) => {
  searchParams.value.pageNum = val;
  setPerformanceRecord();
};

/** 导出业绩明细 */
const exportLoading = ref(false);
const exportData = async () => {
  exportLoading.value = true;
  try {
    handleSearchParams();
    const res = await reqPerformanceExport(searchParams.value);
    downloadBlob(res, { fileName: `业绩明细_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx` });
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出业绩明细失败:', error);
    ElMessage.error('导出业绩明细失败');
  } finally {
    exportLoading.value = false;
  }
};

// 模态框
const dialog: any = reactive({
  visible: false,
  data: {},
});

const showDialog = async (row: any) => {
  if (row.bizType === OrderDetailType.Recharge) {
    ElMessage.info('充值订单暂不能查看原单');
    return;
  }
  dialog.data = {
    id: row.id,
    orderCode: row.orderCode,
  };

  dialog.visible = true;
};
</script>

<style scoped lang="scss"></style>

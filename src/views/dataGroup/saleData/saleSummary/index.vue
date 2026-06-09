<template>
  <div class="main-container">
    <!-- 数据筛选 -->
    <Card class="operation-card">
      <!-- 第一行 -->
      <div class="search-container">
        <div class="search-item">
          <label>
            销售时段：
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
        <div class="search-item">
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
        <div class="search-item">
          <el-button type="success" @click="handleExport">导出表格</el-button>
        </div>
      </div>
    </Card>

    <!-- 数据列表 -->
    <Card padding="0">
      <PaginationTable
        v-loading="loading"
        :element-loading-text="LOADING_MSG"
        :data="saleSummary.list"
        :showPagination="false"
        show-summary
      >
        <el-table-column type="index" label="序号" width="60" fixed />
        <template v-if="isMultipleOrg">
          <el-table-column prop="orgName" label="门店" min-width="80" fixed />
        </template>
        <template v-else>
          <el-table-column prop="statsDate" label="日期" width="105" :formatter="dateFormatter" fixed />
        </template>
        <el-table-column prop="totalTurnover" label="总营业额" min-width="85" fixed />
        <el-table-column prop="totalActualReceipt" label="总实收" min-width="85" fixed />
        <el-table-column prop="totalCustomers" label="总客" min-width="60" />
        <el-table-column prop="newMembers" label="新会员" min-width="60" />
        <el-table-column prop="walkInCustomers" label="散客" min-width="60" />
        <el-table-column prop="totalProjectCount" label="总项目数" min-width="85" />
        <el-table-column prop="qrPayment" label="收款码" min-width="80" />
        <el-table-column prop="cashPayment" label="现金" min-width="60" />
        <el-table-column prop="memberCardPayment" label="会员卡" min-width="80" />
        <el-table-column prop="posPayment" label="POS" min-width="60" />
        <el-table-column prop="meituanPayment" label="美团" min-width="80" />
        <el-table-column prop="douyinPayment" label="抖音" min-width="80" />
        <el-table-column prop="ticketItemPayment" label="项目券" min-width="80" />
        <el-table-column prop="ticketConsumerPayment" label="代金券" min-width="80" />
        <el-table-column prop="rechargeAmount" label="充值金额" min-width="80" />
      </PaginationTable>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { reqSaleSummary, reqSaleSummaryV2 } from '@/api/dataGroup/saleData';
import { OrderSummaryVO } from '@/api/dataGroup/saleData/types';
import { dateFormatter } from '@/utils/formatter';
import { LOADING_MSG } from '@/utils/constants';
import { ElMessage } from 'element-plus';
import { exportExcel, type ExportColumn } from '@/utils/exportExcel';
import useUserStore from '@/store/modules/acl/user';

const userStore = useUserStore();

// 初始化
onMounted(() => {
  search();
});

// 搜索
const search = () => {
  setSaleSummary();
};

const loading = ref(false);
const isMultipleOrg = ref(false);
const orgName = ref<string | undefined>('');

/** 日期范围 */
const dateRange = ref<string[]>([]);
const searchParams = reactive({
  startTime: '',
  endTime: '',
  orgIds: [] as number[],
});

/** 处理搜索参数 */
const handleSearchParams = () => {
  if (dateRange.value.length === 0) {
    searchParams.startTime = '';
    searchParams.endTime = '';
  } else {
    searchParams.startTime = dateRange.value[0] as string;
    searchParams.endTime = dateRange.value[1] as string;
  }
};

const saleSummary = reactive<TableData<OrderSummaryVO>>({
  total: 0,
  list: [],
});

const setSaleSummary = async () => {
  loading.value = true;
  try {
    handleSearchParams();
    const { data } = await reqSaleSummaryV2(searchParams);
    const storeLength = data?.storeList?.length || 0;
    if (Array.isArray(data?.storeList) && storeLength <= 1) {
      isMultipleOrg.value = false;
      orgName.value = storeLength === 1 ? data?.storeList[0].orgName : '';
      saleSummary.list = data?.total?.dailyList || [];
    } else {
      isMultipleOrg.value = true;
      saleSummary.list = data?.storeList || [];
    }
  } catch (error) {
    console.error('获取订单汇总失败:', error);
  } finally {
    loading.value = false;
  }
};

/** 多门店模式导出列配置 */
const multiOrgColumns: ExportColumn<OrderSummaryVO>[] = [
  { key: 'orgName', title: '门店', width: 12 },
  { key: 'totalTurnover', title: '总营业额', width: 12 },
  { key: 'totalActualReceipt', title: '总实收', width: 12 },
  { key: 'totalCustomers', title: '总客', width: 10 },
  { key: 'newMembers', title: '新会员', width: 10 },
  { key: 'walkInCustomers', title: '散客', width: 10 },
  { key: 'totalProjectCount', title: '总项目数', width: 10 },
  { key: 'qrPayment', title: '收款码', width: 10 },
  { key: 'cashPayment', title: '现金', width: 8 },
  { key: 'memberCardPayment', title: '会员卡', width: 10 },
  { key: 'posPayment', title: 'POS', width: 8 },
  { key: 'meituanPayment', title: '美团', width: 10 },
  { key: 'douyinPayment', title: '抖音', width: 10 },
  { key: 'ticketItemPayment', title: '项目券', width: 10 },
  { key: 'ticketConsumerPayment', title: '代金券', width: 10 },
  { key: 'rechargeAmount', title: '充值金额', width: 10 },
];

/** 单门店模式导出列配置 */
const singleOrgColumns: ExportColumn<OrderSummaryVO>[] = [
  { key: 'statsDate', title: '日期', width: 12 },
  { key: 'totalTurnover', title: '总营业额', width: 12 },
  { key: 'totalActualReceipt', title: '总实收', width: 12 },
  { key: 'totalCustomers', title: '总客', width: 10 },
  { key: 'newMembers', title: '新会员', width: 10 },
  { key: 'walkInCustomers', title: '散客', width: 10 },
  { key: 'totalProjectCount', title: '总项目数', width: 10 },
  { key: 'qrPayment', title: '收款码', width: 10 },
  { key: 'cashPayment', title: '现金', width: 8 },
  { key: 'memberCardPayment', title: '会员卡', width: 10 },
  { key: 'posPayment', title: 'POS', width: 8 },
  { key: 'meituanPayment', title: '美团', width: 10 },
  { key: 'douyinPayment', title: '抖音', width: 10 },
  { key: 'ticketItemPayment', title: '项目券', width: 10 },
  { key: 'ticketConsumerPayment', title: '代金券', width: 10 },
  { key: 'rechargeAmount', title: '充值金额', width: 10 },
];

/** 导出表格 */
const handleExport = () => {
  if (!saleSummary.list.length) {
    return ElMessage.warning('暂无数据可导出');
  }

  const columns = isMultipleOrg.value ? multiOrgColumns : singleOrgColumns;
  const baseName = isMultipleOrg.value ? `销售汇总` : `${orgName.value}-销售汇总`;
  /** 拼接日期区间后缀，日期区间为空则不添加 */
  const dateSuffix = dateRange.value.length === 2 ? `(${dateRange.value[0]}~${dateRange.value[1]})` : '';
  const fileName = `${baseName}${dateSuffix}`;

  exportExcel({
    fileName,
    sheets: {
      sheetName: '销售汇总',
      columns,
      data: saleSummary.list,
    },
  });
};
</script>

<style scoped lang="scss"></style>

<template>
  <div class="main-container">
    <!-- 数据筛选 -->
    <Card class="operation-card">
      <!-- 第一行 -->
      <div class="search-container">
        <div class="search-item">
          <label>
            销售时段：
            <IDateTimePicker v-model="dateRange" class="w-220" @change="search" @clear="search" />
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
        <!-- <div class="search-item">
          <el-button type="primary" @click="">导出表格</el-button>
        </div> -->
      </div>
    </Card>

    <!-- 数据列表 -->
    <Card padding="0">
      <PaginationTable
        v-loading="loading"
        :element-loading-text="LOADING_MSG"
        :data="saleSummary.data"
        :showPagination="false"
        show-summary
      >
        <el-table-column type="index" label="序号" width="60" fixed />
        <el-table-column prop="orgName" label="门店" min-width="60" fixed />
        <el-table-column prop="statsDate" label="日期" width="105" :formatter="dateFormatter" fixed />
        <el-table-column prop="totalTurnover" label="总营业额" min-width="85" fixed />
        <el-table-column prop="totalActualReceipt" label="总实收" min-width="85" fixed />
        <el-table-column prop="totalSingleTime" label="总单次" min-width="80" />
        <el-table-column prop="totalPeopleTime" label="总人次" min-width="80" />
        <el-table-column prop="totalProjectCount" label="总项目数" min-width="85" />
        <el-table-column prop="qrPayment" label="收款码" min-width="85" />
        <el-table-column prop="cashPayment" label="现金" min-width="85" />
        <el-table-column prop="memberCardPayment" label="会员卡" min-width="95" />
        <el-table-column prop="posPayment" label="POS" min-width="85" />
        <el-table-column prop="meituanPayment" label="美团" min-width="85" />
        <el-table-column prop="douyinPayment" label="抖音" min-width="85" />
        <el-table-column prop="ticketItemPayment" label="项目券" min-width="85" />
        <el-table-column prop="ticketConsumerPayment" label="代金券" min-width="80" />
      </PaginationTable>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { reqSaleSummary } from '@/api/dataGroup/saleData';
import { OrderSummaryVO } from '@/api/dataGroup/saleData/types';
import { dateFormatter } from '@/utils/formatter';
import { LOADING_MSG } from '@/utils/constants';
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

const saleSummary = reactive<{
  total: number;
  data: OrderSummaryVO[];
}>({
  total: 0,
  data: [],
});

const setSaleSummary = async () => {
  loading.value = true;
  try {
    handleSearchParams();
    const res = await reqSaleSummary(searchParams);
    saleSummary.data = res.data || [];
  } catch (error) {
    console.error('获取订单汇总失败:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss"></style>

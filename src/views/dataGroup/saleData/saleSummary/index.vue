<template>
  <div class="main-container">
    <!-- 数据筛选 -->
    <Card class="operation-card">
      <!-- 第一行 -->
      <div class="search-container">
        <div class="search-item">
          <label>
            销售时段：
            <DatePicker v-model="searchParams.date" class="w-240" @change="search" />
          </label>
        </div>
        <template v-if="userStore.isAdmin || userStore.isAreaManager">
          <div class="search-item">
            <label>
              门店：
              <OrgSelect
                v-model="searchParams.orgIds"
                placeholder="门店"
                class="w-120"
                :multiple="true"
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
        <el-table-column prop="orgName" label="门店" width="60" fixed />
        <el-table-column prop="statsDate" label="日期" width="105" :formatter="dateFormatter" fixed />
        <el-table-column prop="totalTurnover" label="总营业额" width="85" fixed />
        <el-table-column prop="totalActualReceipt" label="总实收" width="85" fixed />
        <el-table-column prop="totalSingleTime" label="总单次" width="80" />
        <el-table-column prop="totalPeopleTime" label="总人次" width="80" />
        <el-table-column prop="totalProjectCount" label="总项目数" width="85" />
        <el-table-column prop="qrPayment" label="扫码支付" width="85" />
        <el-table-column prop="cashPayment" label="现金支付" width="85" />
        <el-table-column prop="memberCardPayment" label="会员卡支付" width="95" />
        <el-table-column prop="posPayment" label="POS" width="85" />
        <el-table-column prop="meituanPayment" label="美团支付" width="85" />
        <el-table-column prop="douyinPayment" label="抖音支付" width="85" />
        <el-table-column prop="cashRecharge" label="现金充值" width="85" />
        <!-- <el-table-column prop="wechatRecharge" label="微信充值" width="85" /> -->
        <el-table-column prop="otherRecharge" label="其他方式充值" width="110" />
      </PaginationTable>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { isEmpty } from 'lodash';
import { reqSaleSummary } from '@/api/dataGroup/saleData';
import { OrderSummaryVO } from '@/api/dataGroup/saleData/types';
import { dateFormatter } from '@/utils/formatter';
import { LOADING_MSG } from '@/utils/constant';
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

const searchParams = reactive({
  date: [],
  orgIds: [],
});

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

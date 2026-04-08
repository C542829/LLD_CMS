<template>
  <div class="main-container">
    <!-- 数据筛选 -->
    <Card class="operation-card">
      <div class="search-container">
        <div class="search-item">
          <label>
            时间：
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
          <el-input v-model="searchParams.amount" style="width: 220px" placeholder="输入金额" clearable>
            <template #prepend>
              <el-select v-model="searchParams.amountType" style="width: 130px">
                <el-option label="余额大于等于" :value="0" />
                <el-option label="余额小于等于" :value="1" />
              </el-select>
            </template>
          </el-input>
        </div>
        <div class="search-item">
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
        <div class="search-item">
          <el-button type="info" @click="resetSearch">重置</el-button>
        </div>
        <div class="search-item">
          <el-button type="success" @click="exportAllMember">导出所有会员</el-button>
        </div>
      </div>
    </Card>

    <!-- 数据列表 -->
    <Card padding="0">
      <PaginationTable
        v-loading="settingStore.loading && !dialog.visible"
        :element-loading-text="settingStore.loadingMsg"
        :data="tableData.list"
        :total="tableData.total"
        v-model:currentPage="searchParams.pageNum"
        v-model:pageSize="searchParams.pageSize"
        @size-change="handleSizeChange"
        @pagination-current-change="handleCurrentChange"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="orgName" label="门店" min-width="40" />
        <el-table-column prop="name" label="姓名" min-width="60" />
        <el-table-column prop="gender" label="性别" min-width="30" :formatter="sexMap" />
        <el-table-column prop="cardNumber" label="卡号" min-width="80" />
        <el-table-column prop="phoneNumber" label="手机号" min-width="80" />
        <el-table-column prop="balance" label="店内总余额" min-width="80" :formatter="amountFormatter" />
        <el-table-column prop="lastConsumptionTime" label="末次消费日期" min-width="80" />
        <el-table-column prop="lastRechargeTime" label="末次充值日期" min-width="80" />
        <el-table-column label="操作" min-width="80">
          <template #default="{ row }">
            <el-button link type="primary" :disabled="true" @click="showDialog(row)">资产详情</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <el-dialog v-model="dialog.visible" :title="dialog.title" center width="800px">
    <PropertyDetail :memberId="dialog.memberId" @close-dialog="dialog.visible = false" />
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { sexMap, amountFormatter } from '@/utils/formatter';
import { formatDate } from '@/utils/time';
import { parseResObj } from '@/utils/parseResponse';
import { reqVipList } from '@/api/member/member';

import PropertyDetail from '../components/PropertyDetail.vue';

// 引入数据仓库
import { useSettingStore } from '@/store/modules/acl/setting';
import useUserStore from '@/store/modules/acl/user';

const userStore = useUserStore();
const settingStore = useSettingStore();

// 搜索参数
const searchParams = reactive<any>({
  queryField: '',
  pageNum: 1,
  pageSize: 20,
  amount: null,
  amountType: 0,
  date: [],
  orgIds: [],
});

// 表格数据
const tableData = reactive({
  total: 0,
  list: [],
});

/**
 * 处理请求参数
 */
const handleTotalParams = () => {
  const params: any = { ...searchParams };

  // 处理参数
  if (params.amount) {
    params.amountType === 0 ? (params.less = params.amount) : (params.greater = params.amount);
  }
  if (params.date && params.date.length !== 0) {
    params.startTime = formatDate(params.date[0]);
    params.endTime = formatDate(params.date[1]);
  }

  // 移除多余参数
  delete params.amount;
  delete params.amountType;
  delete params.date;

  return params;
};

/**
 * 获取表格数据
 */
const setTableData = async () => {
  settingStore.loading = true;
  const params = handleTotalParams();
  const res = await reqVipList(params);
  const { total, rows } = parseResObj(res);
  tableData.total = total;
  tableData.list = rows;
  settingStore.loading = false;
};

/**
 * 重置搜索条件
 */
const resetSearch = () => {
  searchParams.queryField = '';
  searchParams.amount = null;
  searchParams.amountType = 0;
  searchParams.date = [];
  setTableData();
};

// 初始化
onMounted(() => {
  search();
});

// 搜索
const search = () => {
  setTableData();
};

// 处理分页变化
const handleSizeChange = (val: number) => {
  searchParams.pageSize = val;
  setTableData();
};

const handleCurrentChange = (val: number) => {
  searchParams.pageNum = val;
  setTableData();
};

// 模态框
const dialog = reactive({
  title: '优惠券列表',
  visible: false,
  memberId: 0,
});

// 打开模态框
const showDialog = (row: any) => {
  // 显示模态框
  dialog.title = `会员${row.name}在本店的资产详情`;
  dialog.visible = true;
  dialog.memberId = row.id;
};

const exportAllMember = () => {};
</script>

<style scoped lang="scss">
:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

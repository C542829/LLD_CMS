<template>
  <div class="main-container">
    <!-- 数据筛选 -->
    <Card class="operation-card">
      <div class="search-container">
        <div class="search-item">
          <label>
            时间：
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
          范围：
          <el-input
            v-model="searchParams.fullAmount"
            :disabled="!!searchParams.moreAmount"
            style="max-width: 180px"
            placeholder="输入金额"
            clearable
          >
            <template #prepend>消费满</template>
          </el-input>
          &nbsp;
          <el-input
            v-model="searchParams.moreAmount"
            :disabled="!!searchParams.fullAmount"
            style="max-width: 210px"
            placeholder="输入金额"
            clearable
          >
            <template #prepend>单次消费超过</template>
          </el-input>
        </div>
        <div class="search-item">
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
        <div class="search-item">
          <el-button type="info" @click="resetSearch">重置</el-button>
        </div>
        <div class="search-item">
          <el-button type="success" disabled @click="">导出所有会员</el-button>
        </div>
      </div>
    </Card>

    <!-- 数据列表 -->
    <Card padding="0">
      <PaginationTable
        v-loading="settingStore.loading && !dialog.visible"
        :element-loading-text="LOADING_MSG"
        :data="tableData.list"
        :total="tableData.total"
        v-model:currentPage="searchParams.currentPage"
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
    <PropertyDetail @close-dialog="dialog.visible = false" :memberId="dialog.memberId" />
  </el-dialog>
</template>

<script setup lang="ts">
import PropertyDetail from '../components/PropertyDetail.vue';
import { reactive, onMounted, ref } from 'vue';
import { sexMap, amountFormatter } from '@/utils/formatter';
import { parseResObj } from '@/utils/parseResponse';
import { reqVipList } from '@/api/member/member';
import { LOADING_MSG } from '@/utils/constants';
// 引入数据仓库
import { useSettingStore } from '@/store/modules/acl/setting';
import useUserStore from '@/store/modules/acl/user';

const userStore = useUserStore();
const settingStore = useSettingStore();

/** 日期范围 */
const dateRange = ref<string[]>([]);

// 搜索参数
const searchParams = reactive<any>({
  moreAmount: null,
  fullAmount: null,
  startTime: '',
  endTime: '',
  orgIds: [],
  pageSize: 50,
  currentPage: 1,
});

// 表格数据
const tableData = reactive({
  total: 0,
  list: [],
});

/**
 * 处理请求参数
 */
const handleParams = () => {
  const params: any = { ...searchParams };
  // 处理日期范围参数
  if (Array.isArray(dateRange.value) && dateRange.value.length === 2) {
    params.startTime = dateRange.value[0];
    params.endTime = dateRange.value[1];
  } else {
    params.startTime = '';
    params.endTime = '';
  }
  !params.moreAmount && delete params.moreAmount;
  !params.fullAmount && delete params.fullAmount;

  return params || {};
};

/**
 * 获取表格数据
 */
const setTableData = async () => {
  settingStore.loading = true;
  const params = handleParams();
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
  searchParams.moreAmount = null;
  searchParams.fullAmount = null;
  searchParams.startTime = '';
  searchParams.endTime = '';
  dateRange.value = [];
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
  searchParams.currentPage = val;
  setTableData();
};

// 模态框
const dialog: any = reactive({
  title: '优惠券列表',
  visible: false,
  memberId: null,
});

// 打开模态框
const showDialog = (row: any) => {
  // 显示模态框
  dialog.title = `会员${row.name}在本店的资产详情`;
  dialog.visible = true;
  dialog.memberId = row.id;
};
</script>

<style scoped lang="scss">
:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

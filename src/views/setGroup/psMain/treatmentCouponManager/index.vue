<template>
  <div class="main-container">
    <!-- 搜索组件区域 -->
    <Card class="operation-card">
      <div class="header-container">
        <el-button type="primary" @click="showDrawer('add')" class="add-button">添加疗程券</el-button>
      </div>
      <div class="search-container">
        <!-- 疗程券状态 -->
        <div class="search-item">
          <label>
            状态：
            <el-select v-model="searchParams.status" @change="fetchList" class="w-100">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </label>
        </div>
        <template v-if="userStore.isAdmin || userStore.isAreaManager">
          <div class="search-item">
            <label>
              门店：
              <OrgSelect
                v-model="searchParams.orgId"
                placeholder="门店"
                class="w-120"
                :multiple="false"
                @change="fetchList"
                @clear="fetchList"
              />
            </label>
          </div>
        </template>
        <!-- 搜索框 -->
        <div class="search-item">
          <el-input
            v-model="searchParams.cureTicketName"
            :prefix-icon="Search"
            clearable
            class="w-240"
            placeholder="疗程券名称"
            @keydown.enter="fetchList"
            @clear="fetchList"
          >
            <template #append>
              <el-button type="primary" @click="fetchList">搜索</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </Card>

    <!-- 表格组件 -->
    <Card padding="0px">
      <PaginationTable
        v-loading="loading"
        :data="pagedData"
        :total="tableData.length"
        :page-sizes="[50, 100, 200]"
        v-model:currentPage="currentPage"
        v-model:pageSize="pageSize"
        :element-loading-text="LOADING_MSG"
        :row-class-name="getRowClassName"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="orgs" label="关联门店" min-width="50">
          <template #default="{ row }">
            {{ row.orgs?.map((org: any) => org.orgName).join('、') }}
          </template>
        </el-table-column>
        <el-table-column label="疗程券" min-width="60">
          <template #default="{ row }">
            <p>名称：{{ row.name }}</p>
            <p>编码：{{ row.encode }}</p>
          </template>
        </el-table-column>
        <el-table-column label="疗程券内容" min-width="100">
          <template #default="{ row }">
            <div style="display: flex; gap: 5px; flex-wrap: wrap">
              <el-tag v-for="item in row.ticketDetails" :key="item" type="primary">
                {{ item.vipTicketName }} &nbsp; 数量：{{ item.vipTicketNum }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="疗程价(元)" :formatter="amountFormatter" min-width="50" />
        <el-table-column label="提成" width="200">
          <template #default="{ row }">
            <span v-if="row.type === CommissionType.FixedAmount">固定金额提成：{{ row.commissionValue || 0 }}元</span>
            <span v-else>固定比例提成：{{ row.commissionValue || 0 }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="50">
          <template #default="{ row }">
            <el-button link type="info" @click="showDrawer('view', row)">详情</el-button>
            <el-button link type="primary" :disabled="!!row.status" @click="showDrawer('edit', row)">编辑</el-button>
            <el-button link type="success" v-if="row.status" :loading="row.loading" @click="handleUpdateStatus(row)">
              启用
            </el-button>
            <el-button link type="warning" v-else @click="showConfirm(row)">禁用</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <!-- 抽屉表单 -->
  <DrawerForm v-model="drawerVisible" :type="drawerType" :data="currentRow" @success="refreshList" />
</template>

<script setup lang="ts">
import Message from '@/components/Message';
import MessageBox from '@/components/MessageBox';
import DrawerForm from './components/DrawerForm.vue';
import OrgSelect from '@/components/FormComponents/OrgSelect.vue';
import { Search } from '@element-plus/icons-vue';
import { ref, reactive, computed, onMounted } from 'vue';
import { amountFormatter } from '@/utils/formatter';
import { statusOptions, CommissionType, Status } from '@/enums/index';
import { LOADING_MSG } from '@/utils/constants';
import { type Types, reqTreatmentCouponList, reqUpdateTreatmentCouponStatus } from '@/api/setGroup/treatmentCoupon';
import { useMasterDataStore } from '@/store/modules/masterData/index';
import useUserStore from '@/store/modules/acl/user';

const userStore = useUserStore();
const masterDataStore = useMasterDataStore();

// 本地状态
const loading = ref(false);
const tableData = ref<Types.CureTicketVO[]>([]);
const currentPage = ref(1);
const pageSize = ref(50);

// 前端分页
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return tableData.value.slice(start, start + pageSize.value);
});
const searchParams = reactive<Types.CureTicketQueryParams>({
  cureTicketName: '',
  status: 0,
  orgId: undefined,
});

// 抽屉状态
const drawerVisible = ref(false);
const drawerType = ref<DialogType>('add');
const currentRow = ref<Types.CureTicketVO | undefined>(undefined);

// 列表查询
const fetchList = async () => {
  loading.value = true;

  if (searchParams.orgId === undefined) searchParams.orgId = '';

  try {
    const res = await reqTreatmentCouponList(searchParams);
    tableData.value = res.data || [];
    currentPage.value = 1;
  } finally {
    loading.value = false;
  }
};

// 打开抽屉
const showDrawer = (type: DialogType, row?: Types.CureTicketVO) => {
  drawerType.value = type;
  currentRow.value = row;
  drawerVisible.value = true;
};

// 状态更新
const handleUpdateStatus = async (row: Types.CureTicketVO) => {
  try {
    row.status === Status.Disabled && (row.loading = true);
    const res = await reqUpdateTreatmentCouponStatus({
      id: row.id!,
      status: row.status === Status.Enabled ? Status.Disabled : Status.Enabled,
    });
    if (res.code === 10000) {
      Message.success('操作成功');
      fetchList();
      masterDataStore.invalidate('treatmentCoupon');
    }
  } catch (error) {
    console.error(error);
  } finally {
    row.loading = false;
  }
};

// 禁用确认
const showConfirm = async (row: Types.CureTicketVO) => {
  const result = await MessageBox.confirm({
    title: '确认操作',
    message: `你确定要禁用疗程券【${row.name}】吗？`,
    type: 'warning',
  });
  result && handleUpdateStatus(row);
};

const refreshList = () => {
  fetchList();
  masterDataStore.invalidate('treatmentCoupon');
};

// 设置行样式
const getRowClassName = ({ row }: { row: { status: number } }) => {
  return row.status === Status.Disabled ? 'disabled-row' : '';
};

onMounted(() => {
  fetchList();
});
</script>

<style scoped lang="scss">
:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

<template>
  <div class="main-container">
    <!-- 搜索组件区域 -->
    <Card class="operation-card">
      <div class="header-container">
        <el-button type="primary" @click="showDrawer('add')" class="add-button">添加充值提成规则</el-button>
      </div>
      <div class="search-container">
        <!-- 提成规则状态 -->
        <div class="search-item">
          <label>
            提成规则状态：
            <el-select v-model="searchParams.status" class="w-100" clearable @change="fetchList" @clear="fetchList">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </label>
        </div>

        <!-- 搜索框 -->
        <div class="search-item">
          <el-input
            v-model="searchParams.rechargeRoleName"
            :prefix-icon="Search"
            clearable
            placeholder="提成规则名称"
            class="w-240"
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
        :element-loading-text="LOADING_MSG"
        :data="tableData"
        :row-class-name="getRowClassName"
        :showPagination="false"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="orgs" label="关联门店" min-width="50">
          <template #default="{ row }">
            {{ row.orgs?.map((org: any) => org.orgName).join('、') }}
          </template>
        </el-table-column>
        <el-table-column prop="rechargeRoleName" label="提成规则名称" min-width="100" />
        <el-table-column label="状态" min-width="60">
          <template #default="{ row }">
            <el-tag v-if="row.status === 0" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="提成类型" min-width="60">
          <template #default="{ row }">
            {{ commissionTypeMap[row.commissionType as CommissionType] }}
          </template>
        </el-table-column>
        <el-table-column label="提成值" min-width="50">
          <template #default="{ row }">
            {{ row.rechargeCommissionValue }}{{ row.commissionType === CommissionType.FixedAmount ? ' 元' : '%' }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" :formatter="dateFormatter" min-width="60" />
        <el-table-column prop="updateTime" label="修改时间" :formatter="dateFormatter" min-width="60" />
        <el-table-column prop="remark" label="备注" min-width="60" />
        <el-table-column label="操作" min-width="80">
          <template #default="{ row }">
            <el-button @click="showDrawer('edit', row)" :disabled="!!row.status" link type="primary">编辑</el-button>
            <el-button @click="handleUpdateStatus(row)" v-if="row.status" :loading="row.loading" link type="success">
              启用
            </el-button>
            <el-button @click="showConfirm(row)" v-else link type="warning">禁用</el-button>
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
import { Search } from '@element-plus/icons-vue';
import { ref, reactive, onMounted } from 'vue';
import { statusOptions, commissionTypeMap, CommissionType, Status } from '@/enums/index';
import { dateFormatter } from '@/utils/formatter';
import { LOADING_MSG } from '@/utils/constants';
import {
  type Types,
  reqRechargeCommissionRulesList,
  reqUpdateRechargeRoleStatus,
} from '@/api/setGroup/rechargeCommissionRules';

// 本地状态
const loading = ref(false);
const tableData = ref<Types.RechargeRoleVO[]>([]);
const searchParams = reactive<Types.RechargeRoleQueryParams>({
  rechargeRoleName: '',
  status: 0,
});

// 抽屉状态
const drawerVisible = ref(false);
const drawerType = ref<DialogType>('add');
const currentRow = ref<Types.RechargeRoleVO | undefined>(undefined);

// 列表查询
const fetchList = async () => {
  loading.value = true;
  try {
    const res = await reqRechargeCommissionRulesList(searchParams);
    tableData.value = res.data || [];
  } finally {
    loading.value = false;
  }
};

// 刷新列表（DrawerForm 增改成功回调）
const refreshList = () => {
  fetchList();
};

// 打开抽屉
const showDrawer = (type: DialogType, row?: Types.RechargeRoleVO) => {
  drawerType.value = type;
  currentRow.value = row;
  drawerVisible.value = true;
};

// 状态更新
const handleUpdateStatus = async (row: Types.RechargeRoleVO) => {
  try {
    row.status === Status.Disabled && (row.loading = true);
    const res = await reqUpdateRechargeRoleStatus({
      id: row.id,
      status: row.status === Status.Enabled ? Status.Disabled : Status.Enabled,
    });
    if (res.code === 10000) {
      Message.success('操作成功');
      fetchList();
    }
  } catch (error) {
    console.error(error);
  } finally {
    row.loading = false;
  }
};

// 禁用确认
const showConfirm = async (row: Types.RechargeRoleVO) => {
  const result = await MessageBox.confirm({
    title: '确认操作',
    message: `你确定要禁用充值提成规则【${row.rechargeRoleName}】吗？`,
    type: 'warning',
  });
  result && handleUpdateStatus(row);
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

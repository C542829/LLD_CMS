<template>
  <div class="main-container">
    <!-- 搜索组件区域 -->
    <Card class="operation-card">
      <div class="header-container">
        <el-button type="primary" @click="showDrawer('add')" class="add-button">添加套餐</el-button>
      </div>
      <div class="search-container">
        <!-- 套餐状态 -->
        <div class="search-item">
          <label>
            套餐状态：
            <el-select v-model="searchParams.packageStatus" @change="fetchList" class="w-120">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </label>
        </div>

        <!-- 搜索框 -->
        <div class="search-item">
          <el-input
            v-model="searchParams.packageName"
            @keydown.enter="fetchList"
            @clear="fetchList"
            :prefix-icon="Search"
            placeholder="套餐名称"
            class="w-240"
            clearable
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
        <el-table-column label="套餐" width="200">
          <template #default="{ row }">
            <p>名称：{{ row.packageName }}</p>
            <p>编码：{{ row.packageEncode }}</p>
          </template>
        </el-table-column>
        <el-table-column label="套餐明细">
          <template #default="{ row }">
            <div style="display: flex; gap: 5px; flex-wrap: wrap">
              <el-tag v-for="item in row.packageDetailDTOList" :key="item" type="primary">
                {{ item.packageDetailName }} 数量：{{ item.packageToolNumber }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="packagePrice" label="散客价(元)" :formatter="amountFormatter" width="110" />
        <el-table-column prop="packagePriceVip" label="会员价(元)" :formatter="amountFormatter" width="110" />
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button link type="info" @click="showDrawer('view', row)">详情</el-button>
            <el-button link type="primary" :disabled="!!row.packageStatus" @click="showDrawer('edit', row)">
              编辑
            </el-button>
            <el-button
              link
              type="success"
              v-if="row.packageStatus"
              :loading="row.loading"
              @click="handleUpdateStatus(row)"
            >
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
import { Search } from '@element-plus/icons-vue';
import { ref, reactive, onMounted } from 'vue';
import { amountFormatter } from '@/utils/formatter';
import { statusOptions, Status } from '@/enums/index';
import { LOADING_MSG } from '@/utils/constants';
import { type Types, reqPackageList, reqUpdatePackage } from '@/api/setGroup/package';
import { useMasterDataStore } from '@/store/modules/masterData/index';

const masterDataStore = useMasterDataStore();

// 本地状态
const loading = ref(false);
const tableData = ref<Types.PackageListVO[]>([]);
const searchParams = reactive({
  packageName: '',
  packageStatus: 0,
});

// 抽屉状态
const drawerVisible = ref(false);
const drawerType = ref<DialogType>('add');
const currentRow = ref<Types.PackageListVO | undefined>(undefined);

// 列表查询
const fetchList = async () => {
  loading.value = true;
  try {
    const res = await reqPackageList(searchParams);
    tableData.value = res.data || [];
  } finally {
    loading.value = false;
  }
};

// 刷新列表（DrawerForm 增改成功回调）
const refreshList = () => {
  fetchList();
  masterDataStore.invalidate('package');
};

// 打开抽屉
const showDrawer = (type: DialogType, row?: Types.PackageListVO) => {
  drawerType.value = type;
  currentRow.value = row;
  drawerVisible.value = true;
};

// 状态更新
const handleUpdateStatus = async (row: Types.PackageListVO) => {
  try {
    row.packageStatus === Status.Disabled && (row.loading = true);
    const data = { ...row, packageStatus: row.packageStatus === Status.Enabled ? Status.Disabled : Status.Enabled };
    const res = await reqUpdatePackage(data as Types.PackageInfoDTO);
    if (res.code === 10000) {
      Message.success('操作成功');
      fetchList();
      masterDataStore.invalidate('package');
    }
  } catch (error) {
    console.error(error);
  } finally {
    row.loading = false;
  }
};

// 禁用确认
const showConfirm = async (row: Types.PackageListVO) => {
  const result = await MessageBox.confirm({
    title: '确认操作',
    message: `你确定要禁用套餐【${row.packageName}】吗？`,
    type: 'warning',
  });
  result && handleUpdateStatus(row);
};

// 设置行样式
const getRowClassName = ({ row }: { row: { packageStatus: number } }) => {
  return row.packageStatus === Status.Disabled ? 'disabled-row' : '';
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

<template>
  <div class="main-container">
    <!-- 搜索组件区域 -->
    <Card class="operation-card">
      <div class="header-container">
        <el-button type="primary" @click="showDrawer('add')" class="add-button">添加服务项目</el-button>
      </div>
      <div class="search-container">
        <!-- 服务项目状态 -->
        <div class="search-item">
          <label>
            <span>状态：</span>
            <el-select v-model="searchParams.itemStatus" @change="fetchList" class="w-100">
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
        <!-- 服务项目分类 -->
        <div class="search-item">
          <label>
            <span>分类：</span>
            <el-select v-model="searchParams.category" clearable @change="fetchList" class="w-100">
              <el-option
                v-for="item in categoryList"
                :key="item.itemValue"
                :label="item.itemLabel"
                :value="item.itemValue"
              />
            </el-select>
          </label>
        </div>
        <!-- 搜索框 -->
        <div class="search-item">
          <el-input
            v-model="searchParams.keyWord"
            @keydown.enter="fetchList"
            @clear="fetchList"
            :prefix-icon="Search"
            placeholder="编码 | 服务名称"
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
        :data="tableData"
        :element-loading-text="LOADING_MSG"
        :row-class-name="getRowClassName"
        :showPagination="false"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="orgs" label="关联门店" min-width="50">
          <template #default="{ row }">
            {{ row.orgs?.map((org: any) => org.orgName).join('、') }}
          </template>
        </el-table-column>
        <el-table-column prop="category" label="项目分类" min-width="50" />
        <el-table-column prop="itemName" label="名称" min-width="80" />
        <el-table-column prop="itemEncode" label="编码" min-width="50" />
        <el-table-column prop="serverTime" label="服务时长(分钟)" min-width="50" />
        <el-table-column prop="itemPrice" label="标准价(元)" :formatter="amountFormatter" min-width="50" />
        <el-table-column prop="vipItemPrice" label="会员价(元)" :formatter="amountFormatter" min-width="50" />
        <el-table-column prop="isDiscounts" label="参与折扣卡打折" :formatter="isDiscountMap" min-width="50" />
        <el-table-column label="操作" min-width="80">
          <template #default="{ row }">
            <el-button @click="showDrawer('view', row)" link type="info">详情</el-button>
            <el-button @click="showDrawer('edit', row)" :disabled="!!row.itemStatus" link type="primary">编辑</el-button>
            <el-button @click="handleUpdateStatus(row)" v-if="row.itemStatus" :loading="row.loading" link type="success">启用</el-button>
            <el-button @click="showConfirm(row)" v-else link type="warning">禁用</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <!-- 抽屉表单 -->
  <DrawerForm
    v-model="drawerVisible"
    :type="drawerType"
    :data="currentRow"
    @success="refreshList"
  />
</template>

<script setup lang="ts">
import DrawerForm from './components/DrawerForm.vue';
import OrgSelect from '@/components/FormComponents/OrgSelect.vue';
import Message from '@/components/Message';
import MessageBox from '@/components/MessageBox';
import { Search } from '@element-plus/icons-vue';
import { ref, reactive, onMounted } from 'vue';
import { statusOptions, DictCode, Status } from '@/enums/index';
import { amountFormatter, isDiscountMap } from '@/utils/formatter';
import { LOADING_MSG } from '@/utils/constants';
import { type Types, reqServiceItemList, reqUpdateServiceItemStatus } from '@/api/setGroup/serviceItem';
import { useMasterDataStore } from '@/store/modules/masterData/index';
import { useDictStore } from '@/store/modules/dict/index';
import useUserStore from '@/store/modules/acl/user';

const userStore = useUserStore();
const dictStore = useDictStore();
const masterDataStore = useMasterDataStore();

// 本地状态
const loading = ref(false);
const tableData = ref<Types.ServerItemVO[]>([]);
const searchParams = reactive<Types.ServerItemRequest>({
  keyWord: '',
  itemStatus: 0,
  category: '',
  orgId: undefined,
});

// 抽屉状态
const drawerVisible = ref(false);
const drawerType = ref<DialogType>('add');
const currentRow = ref<Types.ServerItemVO | undefined>(undefined);

// 列表查询
const fetchList = async () => {
  if (searchParams.category === undefined) searchParams.category = '';
  if (searchParams.itemStatus === undefined) searchParams.itemStatus = '' as any;
  if (searchParams.orgId === undefined) searchParams.orgId = '' as any;

  loading.value = true;
  try {
    const res = await reqServiceItemList(searchParams);
    tableData.value = res.data || [];
  } finally {
    loading.value = false;
  }
};

// 刷新列表（DrawerForm 增改成功回调）
const refreshList = () => {
  fetchList();
  masterDataStore.invalidate('serviceItem');
};

// 打开抽屉
const showDrawer = (type: DialogType, row?: Types.ServerItemVO) => {
  drawerType.value = type;
  currentRow.value = row;
  drawerVisible.value = true;
};

// 状态更新
const handleUpdateStatus = async (row: Types.ServerItemVO) => {
  try {
    row.itemStatus === Status.Disabled && (row.loading = true);
    const res = await reqUpdateServiceItemStatus({
      id: row.id!,
      status: row.itemStatus === Status.Enabled ? Status.Disabled : Status.Enabled,
    });
    if (res.code === 10000) {
      Message.success('操作成功');
      fetchList();
      masterDataStore.invalidate('serviceItem');
    }
  } catch (error) {
    console.error(error);
  } finally {
    row.loading = false;
  }
};

// 禁用确认
const showConfirm = async (row: Types.ServerItemVO) => {
  const result = await MessageBox.confirm({
    title: '确认操作',
    message: `你确定要禁用服务项目【${row.itemName}】吗？`,
    type: 'warning',
  });
  result && handleUpdateStatus(row);
};

// 字典数据
const categoryList = ref<any>([]);
const getEnumList = async () => {
  categoryList.value = await dictStore.getDictItems(DictCode.ITEM_CATEGORY);
};

// 设置行样式
const getRowClassName = ({ row }: { row: { itemStatus: number } }) => {
  return row.itemStatus === Status.Disabled ? 'disabled-row' : '';
};

onMounted(() => {
  fetchList();
  getEnumList();
});
</script>

<style scoped lang="scss">
:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

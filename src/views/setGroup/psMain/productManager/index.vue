<template>
  <div class="main-container">
    <!-- 搜索组件区域 -->
    <Card class="operation-card">
      <div class="header-container">
        <el-button type="primary" @click="showDrawer('add')" class="add-button">添加产品</el-button>
      </div>
      <div class="search-container">
        <!-- 产品状态 -->
        <div class="search-item">
          <label>
            <span>状态：</span>
            <el-select v-model="searchParams.productStatus" @change="fetchList" class="w-100">
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
        <!-- 产品分类 -->
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
            placeholder="编码 | 产品名称"
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
        <el-table-column prop="category" label="产品分类" min-width="50" />
        <el-table-column prop="productName" label="产品名称" min-width="80" />
        <el-table-column prop="productEncode" label="产品编码" min-width="50" />
        <el-table-column prop="quantity" label="库存" min-width="50">
          <template #default="{ row }">
            <el-tag :type="parseInt(row.quantity!) <= 10 ? 'danger' : 'primary'">{{ row.quantity }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位/规格" :formatter="unitFormatter" width="90" />
        <el-table-column prop="productPrice" label="标准价(元)" min-width="50" :formatter="amountFormatter" />
        <el-table-column prop="vipProductPrice" label="会员价(元)" min-width="50" :formatter="amountFormatter" />
        <el-table-column prop="isDiscount" label="参与折扣卡打折" :formatter="isDiscountMap" min-width="60" />
        <el-table-column label="操作" min-width="80">
          <template #default="{ row }">
            <el-button @click="showDrawer('view', row)" link type="info">详情</el-button>
            <el-button @click="showDrawer('edit', row)" :disabled="!!row.productStatus" link type="primary">
              编辑
            </el-button>
            <el-button
              @click="handleUpdateStatus(row)"
              v-if="row.productStatus"
              :loading="row.loading"
              link
              type="success"
            >
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
import OrgSelect from '@/components/FormComponents/OrgSelect.vue';
import { Search } from '@element-plus/icons-vue';
import { ref, reactive, computed, onMounted } from 'vue';
import { statusOptions, DictCode, Status } from '@/enums/index';
import { amountFormatter, isDiscountMap } from '@/utils/formatter';
import { LOADING_MSG } from '@/utils/constants';
import { type Types, reqProductList, reqUpdateStatus } from '@/api/setGroup/product';
import { useMasterDataStore } from '@/store/modules/masterData/index';
import { useDictStore } from '@/store/modules/dict/index';
import useUserStore from '@/store/modules/acl/user';

const userStore = useUserStore();
const dictStore = useDictStore();
const masterDataStore = useMasterDataStore();

// 本地状态
const loading = ref(false);
const tableData = ref<Types.ProductInfoVO[]>([]);
const currentPage = ref(1);
const pageSize = ref(50);

// 前端分页
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return tableData.value.slice(start, start + pageSize.value);
});
const searchParams = reactive<Types.ReqParams>({
  keyWord: '',
  productStatus: 0,
  category: '',
  orgId: '',
});

// 抽屉状态
const drawerVisible = ref(false);
const drawerType = ref<DialogType>('add');
const currentRow = ref<Types.ProductInfoVO | undefined>(undefined);

// 列表查询
const fetchList = async () => {
  if (searchParams.category === undefined) searchParams.category = '';
  if (searchParams.productStatus === undefined) searchParams.productStatus = '' as any;
  if (searchParams.orgId === undefined) searchParams.orgId = '' as any;

  loading.value = true;
  try {
    const res = await reqProductList(searchParams);
    tableData.value = res.data || [];
    currentPage.value = 1;
  } finally {
    loading.value = false;
  }
};

// 刷新列表（DrawerForm 增改成功回调）
const refreshList = () => {
  fetchList();
  masterDataStore.invalidate('product');
};

// 打开抽屉
const showDrawer = (type: DialogType, row?: Types.ProductInfoVO) => {
  drawerType.value = type;
  currentRow.value = row;
  drawerVisible.value = true;
};

// 状态更新
const handleUpdateStatus = async (row: Types.ProductInfoVO) => {
  try {
    row.productStatus === Status.Disabled && (row.loading = true);
    const res = await reqUpdateStatus({
      id: row.id!,
      status: row.productStatus === Status.Enabled ? Status.Disabled : Status.Enabled,
    });
    if (res.code === 10000) {
      Message.success('操作成功');
      fetchList();
      masterDataStore.invalidate('product');
    }
  } catch (error) {
    console.error(error);
  } finally {
    row.loading = false;
  }
};

// 禁用确认
const showConfirm = async (row: Types.ProductInfoVO) => {
  const result = await MessageBox.confirm({
    title: '确认操作',
    message: `你确定要禁用产品【${row.productName}】吗？`,
    type: 'warning',
  });
  result && handleUpdateStatus(row);
};

// 字典数据
const unitList = ref<any>([]);
const categoryList = ref<any>([]);
const getEnumList = async () => {
  unitList.value = await dictStore.getDictItems(DictCode.UNIT);
  categoryList.value = await dictStore.getDictItems(DictCode.PRODUCT_CATEGORY);
};

// 单位格式化
const unitFormatter = (row: any, column: any, cellValue: number) => {
  const unit = unitList.value.find((item: any) => item.itemValue === cellValue);
  return unit?.itemLabel || '-';
};

// 设置行样式
const getRowClassName = ({ row }: { row: { productStatus: number } }) => {
  return row.productStatus === Status.Disabled ? 'disabled-row' : '';
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

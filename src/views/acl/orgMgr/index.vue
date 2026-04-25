<template>
  <div class="main-container">
    <!-- 搜索操作 -->
    <Card class="operation-card">
      <div class="search-container">
        <div><el-button type="primary" @click="showDrawer(0)">添加门店</el-button></div>
      </div>
      <div class="search-container">
        <!-- 状态 -->
        <div class="search-item">
          <label>
            <span>状态：</span>
            <el-select v-model="searchParams.orgStatus" @change="fetchTableData" clearable style="width: 100px">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </label>
        </div>
        <!-- 搜索框 -->
        <div class="search-item">
          <el-input
            v-model="searchParams.orgName"
            @keydown.enter="fetchTableData"
            @clear="fetchTableData"
            :prefix-icon="Search"
            placeholder="请输入门店关键字"
            clearable
          >
            <template #append>
              <el-button type="primary" @click="fetchTableData">搜索</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </Card>
    <!-- 数据列表 -->
    <Card class="table-card" padding="0">
      <PaginationTable
        v-loading="loading"
        :element-loading-text="LOADING_MSG"
        :data="tableData"
        :showPagination="false"
        :row-class-name="getRowClassName"
      >
        <el-table-column prop="orgName" label="门店名称" min-width="10" />
        <el-table-column prop="orgCode" label="门店编码" min-width="5" />
        <el-table-column prop="orgState" label="状态" min-width="5">
          <template #default="{ row }">
            <el-tag :type="row.orgState === 0 ? 'success' : 'danger'">
              {{ row.orgState === 0 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="orgParent" label="门店上级" /> -->
        <!-- <el-table-column prop="orgProperty" label="门店性质" /> -->
        <el-table-column prop="orgType" label="门店类型" min-width="6" />
        <el-table-column prop="orgNumber" label="门店电话" min-width="8" />
        <el-table-column prop="orgLeader" label="负责人" min-width="6" />
        <!-- <el-table-column prop="orgLeaderNum" label="负责人电话" /> -->
        <el-table-column prop="orgArea" label="门店区域" min-width="10" />
        <el-table-column prop="orgAddress" label="门店地址" min-width="10" />
        <el-table-column prop="createTime" label="创建时间" :formatter="dateFormatter" min-width="7" />
        <el-table-column label="操作" min-width="10">
          <template #default="{ row }">
            <el-button @click="showDrawer(2, row)" link type="info">详情</el-button>
            <el-button @click="showDrawer(1, row)" link type="primary">编辑</el-button>
            <el-button v-if="row.orgState === 1" @click="handleUpdateStatus(row)" link type="success">启用</el-button>
            <el-button v-else @click="showConfirm(row)" link type="warning">禁用</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <!-- 抽屉表单 -->
  <Drawer v-model="drawer.visible" :title="drawer.title" @closed="handleDrawerClose" width="450">
    <!-- 表单 -->
    <OrgForm
      :form-data="currentFormData"
      :disabled="drawer.disabled"
      @close-drawer="drawer.visible = false"
      @submit-success="handleSubmitSuccess"
    />
  </Drawer>
</template>

<script setup lang="ts">
import OrgForm from './form.vue';
import MessageBox from '@/components/MessageBox/index';
import { Search } from '@element-plus/icons-vue';
import { onMounted, reactive, ref } from 'vue';
import { cloneDeep } from 'lodash';
import { Status, statusOptions } from '@/enums/index';
import { dateFormatter } from '@/utils/formatter';
import { reqOrgList, reqUpdateOrgStatus } from '@/api/acl/org';
import type * as Types from '@/api/acl/org/types';
import { parseResList, parseResMsg } from '@/utils/parseResponse';
import { LOADING_MSG } from '@/utils/constants';

/** 加载状态 */
const loading = ref(false);

/** 搜索参数 */
const searchParams = reactive<Types.SearchListParams>({
  orgName: '',
  orgCode: '',
  orgStatus: Status.enabled,
});

/** 表格数据 */
const tableData = ref<any[]>([]);

/** 当前表单数据（传递给子组件） */
const currentFormData = ref<any>({});

/** 获取门店列表 */
const fetchTableData = async () => {
  if (searchParams.orgStatus == undefined) {
    searchParams.orgStatus = '';
  }
  loading.value = true;
  try {
    const res = await reqOrgList(searchParams);
    const data: Types.Org[] = parseResList(res);
    for (const item of data) {
      item.orgArea && (item.orgArea = JSON.parse(item.orgArea as string));
    }
    tableData.value = data.filter((item) => !item.orgCode.includes('Test'));
  } finally {
    loading.value = false;
  }
};

/** 更新门店状态 */
const handleUpdateStatus = async (row: Types.Org) => {
  const params = {
    id: row.id,
    status: row.orgState ? 0 : 1,
  };
  const res = await reqUpdateOrgStatus(params);
  const result = parseResMsg(res);
  result && fetchTableData();
};

onMounted(() => {
  fetchTableData();
});

// 禁用确认
const showConfirm = async (row: any) => {
  const result = await MessageBox.confirm({
    title: '确认操作',
    message: `你确定要禁用门店【${row.orgName}】吗？`,
    type: 'warning',
  });
  result && handleUpdateStatus(row);
};

// 抽屉标题
const drawerTitles = ['新增门店信息', '修改门店信息', '门店详情'];
const drawer: any = reactive({
  title: '新增门店信息',
  visible: false,
  disabled: false,
});

/** 默认表单数据 */
const DEFAULT_FORMDATA = {
  id: 0,
  orgState: 0,
  orgName: '',
  orgShortName: '',
  orgCode: '',
  orgParent: '无',
  orgProperty: '实体门店',
  orgType: '自营',
  orgArea: ['河南省', '郑州市', '中原区'],
  orgNumber: '',
  orgLeader: '',
  orgLeaderNum: '',
  orgAddress: '',
  remark: '',
};

/** 重置表单数据 */
const resetFormData = () => {
  currentFormData.value = cloneDeep(DEFAULT_FORMDATA);
};

// 打开抽屉
const showDrawer = (handleIndex: number, row: any = {}) => {
  row?.id ? (currentFormData.value = { ...row }) : resetFormData();
  drawer.title = drawerTitles[handleIndex];
  drawer.visible = true;
  drawer.disabled = handleIndex === 2;
};

// 关闭抽屉触发
const handleDrawerClose = () => {
  resetFormData();
};

/** 表单提交成功回调 */
const handleSubmitSuccess = () => {
  drawer.visible = false;
  fetchTableData();
};

// 设置行样式
const getRowClassName = ({ row }: { row: { orgState: number } }) => {
  return row.orgState === 1 ? 'disabled-row' : '';
};
</script>

<style scoped lang="scss">
.main-container {
  padding: $main-padding;
}

:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

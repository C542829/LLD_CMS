<template>
  <div class="main-container">
    <!-- 搜索组件区域 -->
    <Card class="operation-card">
      <div class="header-container">
        <el-button type="primary" @click="showDrawer(0)" class="add-button">添加充值活动</el-button>
      </div>
      <div class="search-container">
        <!-- 状态 -->
        <div class="search-item">
          <label>
            <span>状态：</span>
            <el-select v-model="store.search.activeStatus" @change="search" class="w-100">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </label>
        </div>
        <template v-if="userStore.isAdmin || userStore.isAreaManager">
          <div class="search-item">
            <label>
              门店：
              <OrgSelect
                v-model="store.search.orgId"
                placeholder="门店"
                class="w-100"
                :multiple="false"
                @change="search"
                @clear="search"
              />
            </label>
          </div>
        </template>
        <!-- 搜索框 -->
        <div class="search-item">
          <el-input
            v-model="store.search.activeName"
            :prefix-icon="Search"
            clearable
            placeholder="充值活动名称"
            class="search-input w-240"
            @keydown.enter="search"
            @clear="search"
          >
            <template #append>
              <el-button type="primary" @click="search">搜索</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </Card>

    <!-- 表格组件 -->
    <Card padding="0">
      <PaginationTable
        v-loading="settingStore.loading"
        :element-loading-text="LOADING_MSG"
        :data="store.tableData"
        :row-class-name="getRowClassName"
        :showPagination="false"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="orgs" label="关联门店" min-width="50">
          <template #default="{ row }">
            {{ row.orgs.map((org: OrgInfo) => org.orgName).join('、') }}
          </template>
        </el-table-column>
        <el-table-column prop="activeName" label="活动名称" min-width="80" />
        <el-table-column prop="activeBeginTime" label="活动开始" :formatter="dateFormatter" min-width="40" />
        <el-table-column prop="activeFinalTime" label="活动结束" :formatter="dateFormatter" min-width="40" />
        <el-table-column prop="createTime" label="创建时间" :formatter="dateFormatter" min-width="40" />
        <el-table-column label="折扣基础" min-width="30">
          <template #default="{ row }">
            <DiscountTypeTag :type="row.activeBase as DiscountType" />
          </template>
        </el-table-column>
        <el-table-column label="提成值" min-width="50">
          <template #default="{ row }">
            <CommissionTypeTag :commission-type="row.commissionType as CommissionType" :value="row.commissionValue" />
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="50">
          <template #default="{ row }">
            <el-button @click="showDrawer(2, row)" link type="info">详情</el-button>
            <el-button @click="showDrawer(1, row)" link type="primary">编辑</el-button>
            <el-button v-if="row.activeStatus" @click="store.updateStatus(row)" link type="success">启用</el-button>
            <el-button v-else @click="showConfirm(row)" link type="warning">禁用</el-button>
            <!-- <el-button :disabled="true" @click="showDialog(row)" link type="primary">统计</el-button> -->
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <!-- 抽屉表单 -->
  <Drawer v-model="drawer.visible" :title="drawer.title" @closed="handleDrawerClose">
    <!-- 表单 -->
    <ActivityForm :disabled="drawer.disabled" @close-drawer="drawer.visible = false" />
    <!-- 抽屉操作按钮 -->
    <div v-show="drawer.disabled" class="drawer-buttons">
      <el-button @click="drawer.visible = false">取消</el-button>
    </div>
  </Drawer>

  <!-- 统计详情 -->
  <Dialog v-model="dialog.visible" :title="dialog.title">
    <ShowDetail :id="dialog.id" />
  </Dialog>
</template>

<script setup lang="ts">
import CommissionTypeTag from '@/components/Tag/CommissionTypeTag.vue';
import DiscountTypeTag from '@/components/Tag/DiscountTypeTag.vue';
import ActivityForm from './form.vue';
import ShowDetail from './ShowDetail.vue';
import { Search } from '@element-plus/icons-vue';
import { onMounted, inject, reactive } from 'vue';
import { dateFormatter } from '@/utils/formatter';
import { CommissionType, DiscountType, statusOptions } from '@/enums/index';
import { LOADING_MSG } from '@/utils/constants';
// 引入数据仓库
import { useSettingStore } from '@/store/modules/acl/setting';
import { useRechargeActivityStore } from '@/store/modules/member/rechargeActivity';
import useUserStore from '@/store/modules/acl/user';
const userStore = useUserStore();
const settingStore = useSettingStore();
const store = useRechargeActivityStore();

// 引入消息提示组件
const $MessageBox: any = inject('$MessageBox');

onMounted(() => {
  store.setTableData();
});

// 搜索
const search = () => {
  if (store.search.orgId === undefined) {
    store.search.orgId = '';
  }
  store.setTableData();
};

// 禁用
const showConfirm = async ($row: any) => {
  const result = await $MessageBox.confirm({
    title: '确认操作',
    message: `你确定要禁用活动【${$row.activeName}】吗？`,
    type: 'warning',
  });
  result && store.updateStatus($row);
};

// 抽屉标题
const drawerTitles = ['新增充值活动信息', '修改充值活动信息', '充值活动信息'];
const drawer = reactive({
  title: '新增充值活动信息',
  visible: false,
  disabled: false,
});

// 打开抽屉
const showDrawer = (index: number, row?: any) => {
  row?.id ? (store.formData = { ...row }) : store.resetFormData();
  index === 2 && (drawer.disabled = true);
  drawer.title = drawerTitles[index];
  drawer.visible = true;
};

// 关闭抽屉触发
const handleDrawerClose = () => {
  // 去除预览禁用
  drawer.disabled = false;
  // 当抽屉关闭时重置表单
  store.resetFormData();
};

const dialog = reactive({
  title: '活动统计',
  visible: false,
  id: 0,
});

const showDialog = (row: any) => {
  dialog.visible = true;
  dialog.id = row.id;
};

// 设置行样式
const getRowClassName = ({ row }: { row: { activeStatus: number } }) => {
  return row.activeStatus ? 'disabled-row' : '';
};
</script>

<style scoped lang="scss">
:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

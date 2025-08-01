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
            <span>充值活动状态：</span>
            <el-select v-model="store.search.activeStatus" @change="search" style="width: 120px">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </label>
        </div>
        <!-- 搜索框 -->
        <div class="search-item">
          <el-input
            v-model="store.search.keyWord"
            @keydown.enter="search"
            :prefix-icon="Search"
            placeholder="充值活动名称"
            clearable
            class="search-input"
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
        :element-loading-text="settingStore.loadingMsg"
        :data="store.tableData"
        :row-class-name="getRowClassName"
        :show-pagination="false"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="productName" label="活动名称" :center="true" min-width="100" />
        <el-table-column prop="createTime" label="活动开始" :formatter="dateFormatter" min-width="40" />
        <el-table-column prop="createTime" label="活动结束" :formatter="dateFormatter" min-width="40" />
        <el-table-column prop="createTime" label="创建时间" :formatter="dateFormatter" min-width="40" />
        <el-table-column label="操作" min-width="40">
          <template #default="{ row }">
            <el-button link type="info" @click="showDrawer(2, row)">详情</el-button>
            <el-button link type="warning" v-if="row.activeStatus" @click="store.updateStatus(row)">启用</el-button>
            <el-button link type="warning" v-else @click="showConfirm(row)">禁用</el-button>
            <el-button link type="primary" :disabled="!!row.activeStatus" @click="showDrawer(1, row)">统计</el-button>
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
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref, onMounted, inject, reactive } from 'vue';
import { dateFormatter } from '@/utils/formatter';
import ActivityForm from './form.vue';

// 导入枚举数据
import { statusOptions } from '@/enums/index';
// 引入数据仓库
import { useSettingStore } from '@/store/modules/acl/setting';
const settingStore = useSettingStore();
import { useRechargeActivityStore } from '@/store/modules/member/rechargeActivity';
const store = useRechargeActivityStore();

// 引入消息提示组件
const $MessageBox: any = inject('$MessageBox');

onMounted(() => {
  store.setTableData();
});

// 搜索
const search = () => {
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

const drawer: any = reactive({
  title: '新增充值活动信息',
  visible: false,
  disabled: false,
});

// 抽屉标题
const drawerTitles = ['新增充值活动信息', '修改充值活动信息', '充值活动信息'];

// 打开抽屉
const showDrawer = (titleIndex: number, row: any = {}) => {
  row?.id ? (store.formData = { ...row }) : store.resetFormData();
  titleIndex === 2 && (drawer.disabled = true);
  drawer.title = drawerTitles[titleIndex];
  drawer.visible = true;
};

// 关闭抽屉触发
const handleDrawerClose = () => {
  // 去除预览禁用
  drawer.disabled = false;
  // 当抽屉关闭时重置表单
  store.resetFormData();
};

// 设置行样式
const getRowClassName = ({ row }: { row: { activityStatus: number } }) => {
  return row.activityStatus ? 'disabled-row' : '';
};
</script>

<style scoped lang="scss">
:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

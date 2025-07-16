<template>
  <div class="main-container">
    <!-- 搜索组件区域 -->
    <Card class="operation-card">
      <div class="header-container">
        <el-button type="primary" @click="showDrawer(0)" class="add-button">添加充值提成规则</el-button>
      </div>
      <div class="search-container">
        <!-- 选择门店 -->
        <div class="search-item" v-if="false">
          <label>
            选择门店：
            <el-select v-model="store.searchParams.storeId" style="width: 120px">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </label>
        </div>

        <!-- 提成规则状态 -->
        <div class="search-item">
          <label>
            提成规则状态：
            <el-select v-model="store.searchParams.status" style="width: 120px">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </label>
        </div>

        <!-- 搜索框 -->
        <div class="search-item">
          <el-input
            v-model="store.searchParams.rechargeRoleName"
            @keydown.enter="search"
            @clear="search"
            :prefix-icon="Search"
            placeholder="提成规则名称"
            clearable
          >
            <template #append>
              <el-button type="primary" @click="search">搜索</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </Card>

    <!-- 表格组件 -->
    <Card padding="0px">
      <PaginationTable
        :data="store.dataList"
        v-loading="settingStore.loading"
        :element-loading-text="settingStore.loadingMsg"
        :border="true"
        :stripe="true"
        :row-class-name="getRowClassName"
        :showPagination="false"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="rechargeRoleName" label="提成规则名称" />
        <el-table-column prop="rechargePrice" label="充值金额" :formatter="amountFormatter" width="120" />
        <el-table-column prop="commissionType" label="提成类型" width="120">
          <template #default="{ row }">
            {{ row.commissionType === 1 ? '固定金额提成' : '比例提成' }}
          </template>
        </el-table-column>
        <el-table-column prop="rechargeCommissionValue" label="提成值" width="120">
          <template #default="{ row }">
            {{ row.rechargeCommissionValue }}{{ row.commissionType === '1' ? '元' : '%' }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" :formatter="dateFormatter" width="120" />
        <el-table-column prop="updateTime" label="修改时间" :formatter="dateFormatter" width="120" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button @click="showDrawer(1, row)" :disabled="!!row.status" link type="primary">编辑</el-button>
            <el-button @click="store.updateDataStatus(row)" v-if="row.status" link type="success">启用</el-button>
            <el-button @click="showConfirm(row)" v-else link type="warning">禁用</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <!-- 抽屉表单 -->
  <Drawer v-model="drawer.visible" :title="drawer.title" @close="handleDrawerClose">
    <!-- 表单 -->
    <RechargeCommissionRulesForm :disabled="drawer.disabled" @close-drawer="drawer.visible = false" />
    <!-- 抽屉操作按钮 -->
    <template v-if="drawer.disabled">
      <div class="drawer-buttons">
        <el-button @click="drawer.visible = false">取消</el-button>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref, onMounted, inject } from 'vue';
import RechargeCommissionRulesForm from './form.vue';

// 导入表格内容格式化器
import { amountFormatter, dateFormatter } from '@/utils/formatter';

// 导入枚举数据
import { statusOptions } from '@/enums/index';

// 引入数据仓库
import { useSettingStore } from '@/store/modules/acl/setting';
const settingStore = useSettingStore();
import { useRechargeCommissionRulesStore } from '@/store/modules/setGroup/rechargeCommissionRules';
const store = useRechargeCommissionRulesStore();

// 引入消息提示组件
const $MessageBox: any = inject('$MessageBox');

onMounted(() => {
  search();
});

// 搜索产品
const search = () => {
  store.setDataList();
};

// 禁用产品
const showConfirm = async (row: any) => {
  const result = await $MessageBox.confirm({
    title: '确认操作',
    message: `你确定要禁用充值提成规则【${row.rechargeRoleName}】吗？`,
    type: 'warning',
  });
  result && store.updateDataStatus(row);
};

// 抽屉标题
const drawerTitles = ['新增充值提成规则信息', '修改充值提成规则信息'];

const drawer: any = ref({
  title: '新增充值提成规则信息',
  visible: false,
});

// 打开抽屉
const showDrawer = (handleIndex: number, row: any = {}) => {
  // 浅拷贝防止直接操作原对象
  row = { ...row };

  // 表单数据回显
  handleIndex ? (store.formData = row) : store.resetFormData();

  drawer.value.title = drawerTitles[handleIndex]; // 修改抽屉标题
  drawer.value.visible = true; // 显示抽屉
};

// 关闭抽屉触发
const handleDrawerClose = () => {
  const timer = setTimeout(() => {
    // 当抽屉关闭时重置表单
    store.resetFormData();
    // 清除定时器
    timer && clearTimeout(timer);
  }, 100);
};

// 设置行样式
const getRowClassName = ({ row }: { row: { productStatus: number } }) => {
  return row.productStatus ? 'disabled-row' : '';
};
</script>

<style scoped lang="scss">
:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

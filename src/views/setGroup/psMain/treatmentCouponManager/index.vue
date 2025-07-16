<template>
  <div class="main-container">
    <!-- 搜索组件区域 -->
    <Card class="operation-card">
      <div class="header-container">
        <el-button type="primary" @click="showDrawer(0)" class="add-button">添加疗程券</el-button>
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

        <!-- 疗程券状态 -->
        <div class="search-item">
          <label>
            疗程券状态：
            <el-select v-model="store.searchParams.cureTicketStatus" style="width: 120px">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </label>
        </div>

        <!-- 搜索框 -->
        <div class="search-item">
          <el-input
            v-model="store.searchParams.cureTicketName"
            @keydown.enter="search"
            @clear="search"
            :prefix-icon="Search"
            placeholder="疗程券名称"
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
        <el-table-column label="疗程券" width="200">
          <template #default="{ row }">
            <p>名称：{{ row.cureTicketName }}</p>
            <p>编码：{{ row.cureTicketEncode }}</p>
          </template>
        </el-table-column>
        <el-table-column label="疗程券内容">
          <template #default="{ row }">
            <div style="display: flex; gap: 5px; flex-wrap: wrap">
              <el-tag v-for="item in row.cureTicketDetailInfoDTOList" :key="item" type="primary">
                {{ item.vipTicketName }} &nbsp; 数量：{{ item.vipTicketNum }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="cureTicketPrice" label="疗程价(元)" :formatter="amountFormatter" width="110" />
        <el-table-column label="提成" width="200">
          <template #default="{ row }">
            <span v-if="row.cureTicketType === 1">固定金额提成：{{ row.cureTicketCommissionPrice }}元</span>
            <span v-else>固定比例提成：{{ row.cureTicketCommissionValue }}元</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button link type="info" @click="showDrawer(2, row)">详情</el-button>
            <el-button link type="primary" :disabled="!!row.cureTicketStatus" @click="showDrawer(1, row)">
              编辑
            </el-button>
            <el-button link type="warning" v-if="row.cureTicketStatus" @click="store.updateDataStatus(row)">
              启用
            </el-button>
            <el-button link type="warning" v-else @click="showConfirm(row)">禁用</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <!-- 抽屉表单 -->
  <Drawer v-model="drawer.visible" :title="drawer.title" @close="handleDrawerClose" :destroy-on-close="true">
    <!-- 表单 -->
    <TreatmentCouponForm :disabled="drawer.disabled" @close-drawer="drawer.visible = false" />
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
import TreatmentCouponForm from './form.vue';

// 导入表格数据格式化器
import { amountFormatter } from '@/utils/formatter';
// 导入枚举数据
import { statusOptions } from '@/enums/index';

// 导入数据仓库
import { useSettingStore } from '@/store/modules/acl/setting';
const settingStore = useSettingStore();
import { useTreatmentCouponStore } from '@/store/modules/setGroup/treatmentCoupon';
const store = useTreatmentCouponStore();

// 引入消息提示组件
const $MessageBox: any = inject('$MessageBox');

// 初始化
onMounted(() => {
  search();
});

// 搜索
const search = () => {
  store.setDataList();
};

// 禁用
const showConfirm = async (row: any) => {
  const result = await $MessageBox.confirm({
    title: '确认操作',
    message: `你确定要禁用疗程券【${row.cureTicketName}】吗？`,
    type: 'warning',
  });
  result && store.updateDataStatus(row);
};

// 抽屉标题
const drawerTitles = ['新增疗程券信息', '修改疗程券信息', '疗程券信息'];
const drawer: any = ref({
  title: '新增疗程券信息',
  visible: false,
  disabled: false,
});

// 打开抽屉
const showDrawer = (handleIndex: number, row: any = {}) => {
  // 如果点击详情 禁用表单
  handleIndex === 2 && (drawer.value.disabled = true);
  // 浅拷贝避免操作元数据
  row = { ...row };

  // 表单数据回显
  row?.id ? (store.formData = row) : store.resetFormData();

  drawer.value.title = drawerTitles[handleIndex]; // 修改抽屉标题
  drawer.value.visible = true; // 显示抽屉
};

// 关闭抽屉触发
const handleDrawerClose = () => {
  const timer = setTimeout(() => {
    // 当抽屉关闭时重置表单
    store.resetFormData();
    // 去除预览禁用
    drawer.value.disabled = false;
    // 清除定时器
    timer && clearTimeout(timer);
  }, 100);
};

// 设置行样式
const getRowClassName = ({ row }: { row: { cureTicketStatus: number } }) => {
  return row.cureTicketStatus ? 'disabled-row' : '';
};
</script>

<style scoped lang="scss">
:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

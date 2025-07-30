<template>
  <div class="main-container">
    <!-- 数据筛选 -->
    <Card class="operation-card">
      <div class="header-container">
        <el-button type="primary" @click="showDrawer(0)" class="add-button">新增会员</el-button>
      </div>
      <div class="search-container">
        <div class="search-item">
          <el-input
            v-model="store.search.queryField"
            @keydown.enter="search"
            @clear="search"
            :prefix-icon="Search"
            placeholder="会员卡号 | 姓名 | 手机号"
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

    <!-- 数据列表 -->
    <Card padding="0">
      <PaginationTable
        v-loading="settingStore.loading"
        :element-loading-text="settingStore.loadingMsg"
        :data="store.tableData.list"
        :total="store.tableData.total"
        v-model:currentPage="store.search.pageNum"
        v-model:pageSize="store.search.pageSize"
        @size-change="handleSizeChange"
        @pagination-current-change="handleCurrentChange"
      >
        <el-table-column prop="infoName" label="姓名" min-width="80" />
        <el-table-column prop="infoGender" label="性别" width="60" :formatter="sexMap" />
        <el-table-column prop="infoCardNumber" label="卡号" min-width="100" />
        <el-table-column prop="infoPhoneNumber" label="手机号" width="120" />
        <el-table-column prop="infoLastConsumptionTime" label="末次消费" width="170" />
        <el-table-column prop="infoLastRechargeTime" label="末次充值" width="170" />
        <el-table-column prop="remark" label="备注" min-width="30" />
        <el-table-column label="操作" min-width="120">
          <template #default="scope">
            <el-button link type="warning" @click="showDrawer(1, scope.row)">修改资料</el-button>
            <el-button link type="primary" @click="showDrawer(2, scope.row)">修改密码</el-button>
            <el-button link type="success" @click="showDrawer(3, scope.row)">赠送优惠券</el-button>
            <el-button link type="warning" @click="showDialog(4, scope.row)">取消优惠券</el-button>
            <el-button link type="success" @click="showDrawer(5, scope.row)">赠送卡金</el-button>
            <el-button link type="info" @click="showDialog(6, scope.row)">更多</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>
  <Drawer v-model="drawer.visible" :title="drawer.title" @closed="handleDrawerClose">
    <component :is="drawer.component" @close-drawer="drawer.visible = false" />
  </Drawer>

  <el-dialog
    v-model="dialog.visible"
    :title="dialog.title"
    :width="dialog.width"
    @closed="handleDrawerClose"
    :top="dialog.width === '80%' ? '3vh' : ''"
    center
  >
    <component :is="dialog.component" @close-drawer="dialog.visible = false" />
  </el-dialog>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref, onMounted, markRaw, reactive, onUnmounted } from 'vue';
import { sexMap } from '@/utils/formatter';

// 引入数据仓库
import { useSettingStore } from '@/store/modules/acl/setting';
const settingStore = useSettingStore();
import { useMemberStore } from '@/store/modules/member/member';
const store = useMemberStore();

// 初始化
onMounted(() => {});

// 搜索
const search = () => {
  store.setTableData();
};

// 处理分页变化
const handleSizeChange = (val: number) => {
  store.search.pageSize = val;
  store.setTableData();
};

const handleCurrentChange = (val: number) => {
  store.search.pageNum = val;
  store.setTableData();
};

// 导入子组件
import MemberForm from './MemberForm.vue';
import PwdForm from './PwdForm.vue';
import GiveCouponForm from './GiveCouponForm.vue';
import CancelCoupon from './CancelCoupon.vue';
import GiveCardAmount from './GiveCardAmount.vue';
import MemberInfo from './MemberInfo.vue';

const drawer: any = reactive({
  title: '新增会员',
  visible: false,
  component: markRaw(MemberForm),
});

// 抽屉标题
const drawerTitles = ['新增会员', '修改会员信息', '修改会员密码', '赠送优惠券', '优惠券列表', '赠送卡金', '会员信息'];

// 打开抽屉
const showDrawer = (handleIndex: number, row: any = {}) => {
  // 修改抽屉标题
  drawer.title = drawerTitles[handleIndex];
  // 显示抽屉
  drawer.visible = true;

  // 表单数据回显
  row?.id ? (store.formData = row) : store.resetFormData;

  // 切换子组件
  switch (handleIndex) {
    case 0:
      drawer.component = markRaw(MemberForm);
      break;
    case 1:
      drawer.component = markRaw(MemberForm);
      break;
    case 2:
      drawer.component = markRaw(PwdForm);
      break;
    case 3:
      drawer.component = markRaw(GiveCouponForm);
      break;
    case 5:
      drawer.component = markRaw(GiveCardAmount);
      break;
  }
};

// 关闭抽屉触发
const handleDrawerClose = () => {
  // 当抽屉关闭时重置表单
  store.resetFormData();
};

// 模态框
const dialog: any = reactive({
  title: '优惠券列表',
  visible: false,
  component: markRaw(CancelCoupon),
  width: '60%',
});

// 打开模态框
const showDialog = (handleIndex: number, row: any = {}) => {
  // 修改模态框标题
  dialog.title = drawerTitles[handleIndex];
  // 显示模态框
  dialog.visible = true;

  // 表单数据回显
  row?.id ? (store.formData = row) : store.resetFormData;

  // 切换子组件
  switch (handleIndex) {
    case 4:
      dialog.width = '60%';
      dialog.component = markRaw(CancelCoupon);
      break;
    case 6:
      dialog.width = '80%';
      dialog.component = markRaw(MemberInfo);
      break;
  }
};
</script>

<style scoped lang="scss">
:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

<template>
  <div class="main-container">
    <!-- 数据筛选 -->
    <Card class="operation-card">
      <div class="header-container">
        <el-button type="primary" @click="showDrawer(0)" class="add-button">新增会员</el-button>
      </div>
      <div class="search-container">
        <div class="search-item" v-if="false">
          <label for="staffStatus" class="search-label">选择店铺：</label>
          <el-select v-model="store.searchParams.storeId" id="staffStatus" style="width: 120px" placeholder="Select">
            <el-option
              v-for="item in [{ value: 1, label: '' }]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="search-item">
          <el-input
            v-model="store.searchParams.inputValue"
            @keydown.enter="search"
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
    <Card class="table-card" :padding="10">
      <PaginationTable
        :data="store.tableData"
        :total="store.tableData.length"
        v-model:currentPage="currentPage"
        v-model:pageSize="pageSize"
        @size-change="handleSizeChange"
        @pagination-current-change="handleCurrentChange"
      >
        <el-table-column prop="infoName" label="姓名" min-width="80" />
        <el-table-column prop="infoSex" label="性别" width="60" :formatter="sexMap" />
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
            <el-button link type="warning" @click="showDrawer(4, scope.row)">取消优惠券</el-button>
            <el-button link type="success" @click="showDrawer(5, scope.row)">赠送卡金</el-button>
            <el-button link type="info" @click="showDrawer(6, scope.row)">更多</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>
  <Drawer v-model="drawer.visible" :title="drawer.title" @close="handleDrawerClose">
    <component :is="drawer.component" @close-drawer="handleDrawerClose" />
  </Drawer>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref, onMounted, markRaw, reactive } from 'vue';
import { sexMap } from '@/enums/map';

// 导入子组件
import MemberForm from './MemberForm.vue';
import PwdForm from './PwdForm.vue';

// 引入数据仓库
import { useMemberListStore } from '@/store/modules/member/memberList';
const store = useMemberListStore();

const currentPage = ref(1);
const pageSize = ref(20);
// 处理分页变化
const handleSizeChange = (val: number) => {
  console.log(`每页 ${val} 条`);
  // 这里可以调用接口重新获取数据
};

const handleCurrentChange = (val: number) => {
  console.log(`当前页: ${val}`);
  // 这里可以调用接口重新获取数据
};

onMounted(() => {
  store.setTableData();
});

// #region 事件处理

// 搜索
const search = () => {
  store.setTableData();
};

// #endregion

// #region 抽屉
const drawer: any = reactive({
  title: '新增会员',
  visible: false,
  component: markRaw(MemberForm),
});

// 抽屉标题
const drawerTitles = ['新增会员', '修改会员信息', '修改会员密码'];

// 打开抽屉
const showDrawer = (handleIndex: number, row: any = {}) => {
  // 修改抽屉标题
  drawer.title = drawerTitles[handleIndex];
  // 显示抽屉
  drawer.visible = true;

  // 浅拷贝防止直接操作原对象
  row = { ...row };
  // 表单数据回显
  row?.id ? (store.formData = row) : store.resetFormData;

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
      break;
    case 4:
      break;
    default:
      break;
  }
};

// 关闭抽屉触发
const handleDrawerClose = () => {
  console.log();

  const timer = setTimeout(() => {
    // 当抽屉关闭时重置表单
    store.resetFormData();
    // 去除预览禁用
    drawer.visible = false;
    // 清除定时器
    timer && clearTimeout(timer);
  }, 100);
};
// #endregion
</script>

<style scoped lang="scss">
.table-main {
  height: 100%;
}

:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

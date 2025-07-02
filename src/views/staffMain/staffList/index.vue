<template>
  <div class="main-container">
    <!-- 数据筛选 -->
    <Card class="operation-card">
      <div class="header-container">
        <el-button type="primary" @click="showDrawer(0)" class="add-button">添加人员</el-button>
      </div>
      <div class="search-container">
        <div class="search-item" v-if="false">
          <label for="staffStatus" class="search-label">选择店铺：</label>
          <el-select v-model="store.searchParams.storeId" id="staffStatus" style="width: 120px" placeholder="Select">
            <el-option
              v-for="item in searchEmployedOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="search-item">
          <label for="staffStatus" class="search-label">人员在职状态：</label>
          <el-select v-model="store.searchParams.userStatus" id="staffStatus" style="width: 120px" placeholder="Select">
            <el-option
              v-for="item in searchEmployedOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="search-item">
          <el-input
            v-model="store.searchParams.userName"
            @keydown.enter="search"
            :prefix-icon="Search"
            placeholder="姓名|登录名"
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
    <Card class="table-card">
      <Table :data="store.tableData" :border="true" :stripe="true" :row-class-name="getRowClassName" class="table-main">
        <el-table-column prop="userName" label="姓名" min-width="80" />
        <el-table-column prop="userSex" label="性别" width="60" :formatter="sexMap" />
        <el-table-column prop="userNumber" label="手机号" width="120" />
        <el-table-column prop="userCode" label="编号" min-width="60" />
        <el-table-column prop="userDept" label="部门" min-width="70" />
        <el-table-column prop="userPosition" label="职位" min-width="70" />
        <el-table-column prop="userEntryDate" label="入职时间" min-width="110" />
        <el-table-column prop="userStatus" label="在职状态" min-width="90" />
        <el-table-column label="操作" min-width="120">
          <template #default="scope">
            <el-button link type="info" @click="showDrawer(2, scope.row)">更多</el-button>
            <el-button
              link
              type="primary"
              :disabled="scope.row.userStatus !== '在职'"
              @click="showDrawer(1, scope.row)"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </Table>
    </Card>
  </div>
  <Drawer v-model="drawer.visible" :title="drawer.title" @close="handleDrawerClose">
    <!-- 表单 -->
    <StaffForm :disabled="drawer.disabled" @close-drawer="drawer.visible = false" />
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
import { ref, onMounted } from 'vue';
import StaffForm from './form.vue';

// 导入枚举数据
import { searchEmployedOptions } from '@/enums/index';
import { sexMap } from '@/enums/map';

// 引入数据仓库
import { useStaffStore } from '@/store/modules/staffMain/staff';
const store = useStaffStore();

import { useEnumsStore } from '@/store/modules/enums/index';
const enumsStore = useEnumsStore();

onMounted(() => {
  store.setStaffList();
});

// 搜索
const search = () => {
  store.setStaffList();
};

const drawer: any = ref({
  title: '新增人员信息',
  visible: false,
  disabled: false,
});

// 抽屉标题
const drawerTitles = ['新增人员信息', '人员信息', '修改人员信息'];

// 打开抽屉
const showDrawer = (titleIndex: number, $row: any = {}) => {
  // 修改抽屉标题
  drawer.value.title = drawerTitles[titleIndex];
  // 显示抽屉
  drawer.value.visible = true;

  // 获取职位列表
  enumsStore.setPositionList();
  // 获取部门列表
  enumsStore.setDeptList();
  // 获取职称列表
  enumsStore.setTitleList();

  // 如果点击更多 禁用表单
  titleIndex === 2 && (drawer.value.disabled = true);

  // 浅拷贝防止直接操作原对象
  $row = { ...$row };

  // 表单数据回显
  $row?.id ? (store.formData = $row) : store.resetFormData();
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
const getRowClassName = ({ row }: { row: { userStatus: string } }) => {
  return row.userStatus !== '在职' ? 'disabled-row' : '';
};
</script>

<style scoped lang="scss">
.table-main {
  height: 100%;
}

:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

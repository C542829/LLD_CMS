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
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="search-item">
          <label for="staffStatus" class="search-label">人员在职状态：</label>
          <el-select v-model="store.searchParams.userStatus" id="staffStatus" style="width: 120px" placeholder="Select">
            <el-option
              v-for="item in store.employedOptions"
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
        <el-table-column prop="sexStr" label="性别" min-width="60" />
        <el-table-column prop="userNumber" label="手机号" min-width="120" />
        <el-table-column prop="userCode" label="编号" min-width="60" />
        <el-table-column prop="userDept" label="部门" min-width="70" />
        <el-table-column prop="userPosition" label="职位" min-width="70" />
        <el-table-column prop="userBirthday" label="入职时间" min-width="110" />
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
    <Form
      :model="store.formData"
      :rules="store.formRules"
      :showButtons="!drawer.disabled"
      :disabled="drawer.disabled"
      @submit="handleFormSubmit"
      @reset="handleFormReset"
    >
      <!-- 人员编号 -->
      <el-form-item label="人员编号" prop="userCode">
        <el-input v-model="store.formData.userCode" placeholder="请输入人员编号" />
      </el-form-item>
      <!-- 姓名 -->
      <el-form-item label="姓名" prop="userName">
        <el-input v-model="store.formData.userName" placeholder="请输入姓名" />
      </el-form-item>
      <!-- 手机号 -->
      <el-form-item label="手机号" prop="userNumber">
        <el-input v-model="store.formData.userNumber" placeholder="请输入手机号" />
      </el-form-item>
      <!-- 人员职位 -->
      <el-form-item label="人员职位" prop="userPosition">
        <div style="width: 100%; display: flex; gap: 10px">
          <el-select v-model="store.formData.userPosition" style="width: 200px" placeholder="选择职位">
            <el-option
              v-for="item in store.positionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div><el-button link type="primary" @click="">职位管理</el-button></div>
        </div>
      </el-form-item>
      <!-- 性别 -->
      <el-form-item label="性别" prop="userSex">
        <div style="width: 100%; display: flex; gap: 10px">
          <el-select v-model="store.formData.userSex" style="width: 200px" placeholder="性别">
            <el-option v-for="item in store.sex" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </el-form-item>

      <!-- 生日 -->
      <el-form-item label="生日" prop="userBirthday">
        <el-date-picker
          v-model="store.formData.userBirthday"
          type="date"
          placeholder="选择生日"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <!-- 所属部门 -->
      <el-form-item label="所属部门" prop="userDept">
        <div style="width: 100%; display: flex; gap: 10px">
          <el-select v-model="store.formData.deptOptions" style="width: 200px" placeholder="选择职位">
            <el-option
              v-for="item in store.positionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div><el-button link type="primary" @click="">部门管理</el-button></div>
        </div>
      </el-form-item>

      <!-- 入职时间 -->
      <el-form-item label="入职时间" prop="userEntryDate">
        <el-date-picker
          v-model="store.formData.userEntryDate"
          type="date"
          placeholder="选择入职时间"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <!-- 在职状态 -->
      <el-form-item label="在职状态" prop="userStatus">
        <el-select v-model="store.formData.userStatus" style="width: 200px" placeholder="请选择在职状态">
          <el-option
            v-for="item in store.formEmployedOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- 身份证号 -->
      <el-form-item label="身份证号" prop="userIdCard">
        <el-input v-model="store.formData.userIdCard" placeholder="请输入身份证号" />
      </el-form-item>

      <!-- 人员地址 -->
      <el-form-item label="人员地址" prop="userAddress">
        <el-input v-model="store.formData.userAddress" placeholder="请输入居住地址" />
      </el-form-item>

      <!-- 婚姻状况 -->
      <el-form-item label="婚姻状况" prop="userMarry">
        <el-select v-model="store.formData.userMarry" style="width: 200px" placeholder="请选择婚姻状况">
          <el-option
            v-for="item in store.maritalStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- 学历状况 -->
      <el-form-item label="学历状况" prop="userEdu">
        <el-select v-model="store.formData.userEdu" style="width: 200px" placeholder="请选择学历">
          <el-option v-for="item in store.educationOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <!-- 人员职称 -->
      <el-form-item label="人员职称" prop="userTitle">
        <div style="width: 100%; display: flex; gap: 10px">
          <el-select v-model="store.formData.userPosition" style="width: 200px" placeholder="选择职位">
            <el-option v-for="item in store.titleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <div><el-button link type="primary" @click="">职称管理</el-button></div>
        </div>
      </el-form-item>

      <!-- 健康证到期 -->
      <el-form-item label="健康证到期" prop="userHealth">
        <el-date-picker
          v-model="store.formData.userHealth"
          type="date"
          placeholder="选择健康证到期时间"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
    </Form>
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

// 导入枚举数据
import { statusOptions } from '@/enums/index';
// 引入数据仓库
import { useStaffStore } from '@/store/modules/staffMain/staff';
const store = useStaffStore();

defineProps({
  title: {
    type: String,
    default: '产品管理',
  },
});

onMounted(() => {
  store.setStaffList();
  // 获取产品单位列表
  store.setStatusList();
});

// #region 事件处理

// 搜索
const search = () => {
  store.setStaffList();
};

// 表单提交
const handleFormSubmit = async (model: any) => {
  const result = await store.updateStaff(model);
  result && (drawer.value.visible = false);
};

// 表单重置
const handleFormReset = () => {
  store.resetFormData();
};

// #endregion

// #region 抽屉
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

  // 获取产品单位列表
  store.setPositionList();
  // 获取产品单位列表
  store.setDeptList();
  // 获取产品单位列表
  store.setTitleList();

  // 如果点击更多 禁用表单
  titleIndex === 2 && (drawer.value.disabled = true);
  titleIndex === 0 && store.setStatusList();

  // 浅拷贝防止直接操作原对象
  $row = { ...$row };

  // 表单数据回显
  if ($row?.id) {
    store.formData = $row;
  } else {
    store.resetFormData();
  }
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
// #endregion

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

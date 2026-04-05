<template>
  <div class="main-container">
    <!-- 数据筛选 -->
    <Card class="operation-card">
      <div class="search-container">
        <el-button type="primary" @click="showDrawer('add')">添加人员</el-button>
      </div>
      <div class="search-container">
        <template v-if="userStore.isAdmin || userStore.isAreaManager">
          <div class="search-item">
            <label>
              门店：
              <OrgSelect
                v-model="searchParams.orgIds"
                placeholder="门店"
                class="w-120"
                :multiple="true"
                @change="search"
                @clear="search"
              />
            </label>
          </div>
        </template>
        <!-- 人员在职状态 -->
        <div class="search-item">
          <label>
            <span>在职状态：</span>
            <el-select v-model="searchParams.userStatus" clearable @change="search" style="width: 120px">
              <el-option
                v-for="item in searchEmployedOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </label>
        </div>
        <!-- 角色 -->
        <div class="search-item">
          <label>
            <span>角色：</span>
            <el-select v-model="searchParams.roleId" clearable @change="search" style="width: 120px">
              <el-option v-for="item in roles" :label="item.roleName" :value="item.id" :key="item.id" />
            </el-select>
          </label>
        </div>
        <!-- 搜索 -->
        <div class="search-item">
          <el-input
            v-model="searchParams.userName"
            @keydown.enter="search"
            @clear="search"
            :prefix-icon="Search"
            placeholder="姓名 | 登录名"
            clearable
            class="search-input"
          >
            <template #append>
              <el-button type="primary" @click="search">搜索</el-button>
            </template>
          </el-input>
        </div>

        <!-- 搜索 -->
        <div class="search-item">
          <el-button type="info" @click="resetSearchParams">重置</el-button>
        </div>
      </div>
    </Card>

    <!-- 数据列表 -->
    <Card padding="0">
      <PaginationTable
        v-loading="loading"
        :data="tableData.list"
        :total="tableData.total"
        v-model:currentPage="searchParams.pageNum"
        v-model:pageSize="searchParams.pageSize"
        @size-change="handleSizeChange"
        @pagination-current-change="handleCurrentChange"
        :row-class-name="getRowClassName"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="orgs" label="关联门店" min-width="50">
          <template #default="{ row }">
            {{ row.orgs.map((org: OrgInfo) => org.orgName).join('、') }}
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="姓名" width="80" />
        <el-table-column prop="userSex" label="性别" width="60" :formatter="sexMap" />
        <el-table-column prop="userNumber" label="手机号" width="120" />
        <el-table-column prop="userCode" label="账号" min-width="60" />
        <el-table-column prop="role.roleName" label="角色" min-width="40" />
        <el-table-column prop="userDept" label="部门" min-width="50" />
        <el-table-column prop="userPosition" label="职位" min-width="40" />
        <el-table-column prop="userEntryDate" label="入职时间" width="110" />
        <el-table-column prop="userStatus" label="在职状态" width="90" />
        <el-table-column label="操作" min-width="100">
          <template #default="{ row }">
            <el-button link type="info" :disabled="isDisableOper(row)" @click="showDrawer('view', row)">更多</el-button>
            <el-button link type="primary" :disabled="isDisableOper(row)" @click="showDrawer('edit', row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <!-- 抽屉 -->
  <DrawerForm
    v-model="drawer.visible"
    :type="drawer.type"
    :data="drawer.data"
    :roleList="roles"
    @close="handleDrawerClose"
  ></DrawerForm>
</template>

<script setup lang="ts">
import DrawerForm from './components/DrawerForm.vue';
import { Search } from '@element-plus/icons-vue';
import { ref, onMounted, reactive, computed } from 'vue';
import { cloneDeep, isEmpty } from 'lodash';
import { DEFAULT_SEARCH_PARAMS, RoleCodeFilterMap } from './utils/index';
import { isRoleHigherOrEqual } from '@/utils/index';
import { RoleCode, searchEmployedOptions } from '@/enums/index';
import { sexMap } from '@/utils/formatter';
import { reqRoleList, Types as RoleTypes } from '@/api/acl/role';
import { reqUserList, Types as UserTypes } from '@/api/user/index';
import { useDataEnumStore } from '@/store/modules/enums/index';
import useUserStore from '@/store/modules/acl/user';

const userStore = useUserStore();
const dataEnumStore = useDataEnumStore();

// 初始化
onMounted(async () => {
  await dataEnumStore.getOrgList();
  handleOrgIds();
  search();
  getRoleList();
});

//#region 表格

const loading = ref<boolean>(false);
/** 搜索参数 */
const searchParams = reactive<UserTypes.SearchUserParams>(cloneDeep(DEFAULT_SEARCH_PARAMS));
/** 重置搜索参数 */
const resetSearchParams = () => {
  Object.assign(searchParams, cloneDeep(DEFAULT_SEARCH_PARAMS));
  search();
};

/**
 * 表格数据
 */
const tableData = reactive<{ list: UserInfo[]; total: number }>({
  list: [],
  total: 0,
});

// 搜索
const search = () => {
  if (searchParams.roleId == undefined) {
    searchParams.roleId = '';
  }
  if (searchParams.userStatus == undefined) {
    searchParams.userStatus = '';
  }

  setTableData();
};

/**
 * 设置表格数据
 */
const setTableData = async () => {
  loading.value = true;
  try {
    const { data } = await reqUserList(searchParams);
    tableData.total = data.total;
    tableData.list = data.rows;
  } catch (error) {
    console.error('获取操作日志失败：', error);
  } finally {
    loading.value = false;
  }
};

// 设置 orgIds
const handleOrgIds = () => {
  let orgs: any = [];
  if (userStore.isAdmin) {
    orgs = dataEnumStore.orgList;
  } else {
    orgs = userStore.user.orgs;
  }

  if (isEmpty(orgs)) {
    orgs = [];
  }

  searchParams.orgIds = orgs.map((item: any) => item.id);
};

// 分页容量变化
const handleSizeChange = (val: number) => {
  searchParams.pageSize = val;
  search();
};

// 分页变化
const handleCurrentChange = (val: number) => {
  searchParams.pageNum = val;
  search();
};

const isDisableOper = (row: UserInfo) => {
  if (row.id === userStore.user.id) {
    return false;
  }
  if (userStore.user.role && row.role) {
    return isRoleHigherOrEqual(row.role.roleCode as RoleCode, userStore.user?.role?.roleCode as RoleCode);
  }
  return false;
};

// 设置行样式
const getRowClassName = ({ row }: { row: { userStatus: string } }) => {
  return row.userStatus === '离职' ? 'disabled-row' : '';
};
//#endregion 表格

//#region 抽屉

const drawer: any = reactive({
  visible: false,
  type: 'add',
  data: {},
});

// 打开抽屉
const showDrawer = async (type: DialogType, row: any = {}) => {
  drawer.type = type;
  drawer.visible = true;
  drawer.data = row;
};

// 关闭抽屉触发
const handleDrawerClose = () => {
  if (drawer.type === 'view') {
    return;
  }
  search();
};

//#endregion 抽屉

//#region 角色列表

/** 角色列表 */
const roleList = ref<RoleTypes.RoleInfoVo[]>([]);
/** 过滤后的角色列表 */
const roles = computed(() => {
  return roleList.value.filter((item: RoleTypes.RoleInfoVo) => {
    const roleCode = userStore.user.role?.roleCode || RoleCode.AreaManager;
    const roleCodes = RoleCodeFilterMap[roleCode];
    return !roleCodes.includes(item.roleCode || '');
  });
});

/** 获取角色列表 */
const getRoleList = async () => {
  try {
    const res = await reqRoleList();
    roleList.value = res.data;
  } catch (error) {
    console.error('获取角色列表失败：', error);
  }
};

//#endregion 角色列表
</script>

<style scoped lang="scss">
.main-container {
  padding: $main-padding;
}

:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

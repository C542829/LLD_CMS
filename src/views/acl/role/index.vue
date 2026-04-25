<template>
  <div class="main-container">
    <!-- 搜索操作 -->
    <Card class="operation-card">
      <div class="search-container">
        <div><el-button type="primary" @click="showDrawer(0)">添加角色</el-button></div>
      </div>
      <div class="search-container">
        <!-- 状态 -->
        <div class="search-item">
          <label>
            <span>状态：</span>
            <el-select v-model="searchParams.status" @change="fetchTableData" style="width: 100px">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </label>
        </div>
        <!-- 搜索框 -->
        <div class="search-item">
          <el-input
            v-model="searchParams.roleName"
            @keydown.enter="fetchTableData"
            @clear="fetchTableData"
            :prefix-icon="Search"
            placeholder="请输入角色名称"
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
        v-loading="loading && drawer.handleIndex !== 2"
        :element-loading-text="LOADING_MSG"
        :data="tableData"
        :showPagination="false"
        :row-class-name="getRowClassName"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleCode" label="角色编码" />
        <el-table-column prop="roleStatus" label="角色状态">
          <template #default="{ row }">
            <el-tag :type="row.roleStatus === 0 ? 'success' : 'danger'" size="small">
              {{ row.roleStatus === 0 ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="roleSort" label="显示顺序" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button @click="showDrawer(1, row)" link type="primary">修改</el-button>
            <el-button @click="setPermisstion(row)" link type="success">分配权限</el-button>
            <el-button v-if="row.roleStatus" @click="handleUpdateStatus(row)" link type="success">启用</el-button>
            <el-button v-else @click="showConfirm(row)" link type="warning">禁用</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <!-- 抽屉表单 -->
  <Drawer v-model="drawer.visible" :title="drawer.title" @close="handleDrawerClose">
    <!-- 表单 -->
    <template v-if="drawer.handleIndex !== 2">
      <RoleForm
        :form-data="formData"
        @submit="handleFormSubmit"
        @reset="resetFormData"
        @close-drawer="drawer.visible = false"
      />
    </template>
    <template v-else>
      <div class="tree-container">
        <el-input v-model="filterText" placeholder="请输入权限关键字" />
        <div class="tree-content" v-loading="loading && drawer.handleIndex === 2">
          <el-tree
            :data="permTree"
            :filter-node-method="filterNode"
            ref="treeRef"
            node-key="id"
            show-checkbox
            default-expand-all
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
            </template>
          </el-tree>
        </div>

        <div>
          <el-button @click="drawer.visible = false">取消</el-button>
          <el-button type="primary" @click="assignPermissions">提交</el-button>
        </div>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import RoleForm from './form.vue';
import MessageBox from '@/components/MessageBox/index';
import { Search } from '@element-plus/icons-vue';
import { ref, onMounted, reactive, watch } from 'vue';
import { statusOptions } from '@/enums/index';
import { reqQueryPermTree, reqQueryPermTreeByRole } from '@/api/acl/permission/index';
import { reqRoleList, reqAddRole, reqUpdateRole, reqUpdateRoleStatus, reqAddAllocatedPerm } from '@/api/acl/role';
import type { RoleInfoVo } from '@/api/acl/role/types';
import { LOADING_MSG } from '@/utils/constants';
import { parseResList, parseResMsg } from '@/utils/parseResponse';

// ======================== 状态变量 ========================

/** 加载状态 */
const loading = ref(false);

/** 搜索参数 */
const searchParams = reactive({
  roleName: '',
  roleCode: '',
  status: 0,
});

/** 表格数据 */
const tableData = ref<RoleInfoVo[]>([]);

/** 表单数据 */
const formData = ref<Record<string, any>>({
  id: null,
  roleCode: '',
  roleName: '',
  remark: '',
  roleSort: 0,
  roleStatus: 0,
});

// ======================== 数据请求 ========================

/** 获取表格数据 */
const fetchTableData = async () => {
  loading.value = true;
  try {
    const res = await reqRoleList(searchParams);
    tableData.value = parseResList(res);
    tableData.value.sort((a, b) => a.roleSort! - b.roleSort!);
  } catch (error) {
    console.error('获取角色列表失败：', error);
  } finally {
    loading.value = false;
  }
};

/** 新增/修改角色 */
const updateRole = async (data: Record<string, any>) => {
  const params = { ...data };
  try {
    const res = await (params?.id ? reqUpdateRole(params) : reqAddRole(params));
    const result = parseResMsg(res);
    result && (await fetchTableData());
    return result;
  } catch (error) {
    console.error('新增/修改角色失败：', error);
    return false;
  }
};

/** 更新角色状态 */
const handleUpdateStatus = async (row: RoleInfoVo) => {
  const params = {
    roleId: row.id,
    status: row.roleStatus ? 0 : 1,
  };
  try {
    const res = await reqUpdateRoleStatus(params);
    const result = parseResMsg(res);
    result && (await fetchTableData());
  } catch (error) {
    console.error('更新角色状态失败：', error);
  }
};

/** 分配权限 */
const addPerm = async (params: { roleId: number; permissionIds: number[] }) => {
  try {
    const res = await reqAddAllocatedPerm(params);
    return parseResMsg(res, '分配权限成功');
  } catch (error) {
    console.error('分配权限失败：', error);
    return false;
  }
};

// ======================== 生命周期 ========================

onMounted(() => {
  fetchTableData();
});

// ======================== 搜索 ========================

// (fetchTableData 即为搜索方法)

// ======================== 禁用确认 ========================

const showConfirm = async (row: RoleInfoVo) => {
  try {
    const result = await MessageBox.confirm({
      title: '确认操作',
      message: `你确定要禁用角色【${row.roleName}】吗？`,
      type: 'warning',
    });
    result && handleUpdateStatus(row);
  } catch (error) {
    // 用户取消操作，无需处理
  }
};

// ======================== 抽屉相关 ========================

/** 抽屉标题映射 */
const drawerTitles = ['新增角色信息', '修改角色信息', '分配权限'];

const drawer = reactive({
  title: '新增角色信息',
  visible: false,
  handleIndex: 0,
});

/** 打开抽屉 */
const showDrawer = (handleIndex: number, row: Record<string, any> = {}) => {
  drawer.handleIndex = handleIndex;
  drawer.title = drawerTitles[handleIndex];
  drawer.visible = true;

  // 表单数据回显
  row?.id ? (formData.value = { ...row }) : resetFormData();
};

/** 关闭抽屉触发 */
const handleDrawerClose = () => {
  resetFormData();
};

/** 重置表单数据 */
const resetFormData = () => {
  formData.value = {
    id: null,
    roleCode: '',
    roleName: '',
    remark: '',
    roleSort: 0,
    roleStatus: 0,
  };
};

/** 表单提交处理 */
const handleFormSubmit = async (model: Record<string, any>) => {
  const result = await updateRole(model);
  result && (drawer.visible = false);
};

// ======================== 权限树相关 ========================

/** 权限树数据 */
const permTree = ref<any>([]);

/** tree 组件实例 */
const treeRef = ref<any>();

/** 请求权限树数据并设置已选的节点 */
const setPermisstion = async (row: RoleInfoVo) => {
  drawer.handleIndex = 2;
  drawer.title = drawerTitles[2];
  drawer.visible = true;
  formData.value = row;
  loading.value = true;
  try {
    const { data } = await reqQueryPermTree();
    permTree.value = data;
    await setCheckedKeys(row.id);
  } catch (error) {
    console.error('获取权限树失败：', error);
  } finally {
    loading.value = false;
  }
};

/**
 * 设置勾选的节点
 * @param roleId 角色ID
 */
const setCheckedKeys = async (roleId: number) => {
  try {
    const { data } = await reqQueryPermTreeByRole(roleId);
    const checkKeys = data.treeMap((item: any) => item.id);
    for (const id of checkKeys) {
      treeRef.value.setChecked(id, true, false);
    }
  } catch (error) {
    console.error('获取角色权限节点失败：', error);
  }
};

/**
 * 分配权限
 */
const assignPermissions = async () => {
  loading.value = true;
  try {
    // 角色ID
    const roleId = formData.value.id;
    // 选中节点的ID
    const treeCheckedKeys = treeRef.value.getCheckedKeys();
    // 半选的ID
    const treeHalfCheckedKeys = treeRef.value.getHalfCheckedKeys();
    // 合并选中和半选的ID
    const permissionIds = treeCheckedKeys.concat(treeHalfCheckedKeys);
    // 请求参数
    const params = { roleId, permissionIds };
    // 提交请求
    await addPerm(params);
  } catch (error) {
    console.error('分配权限失败：', error);
  } finally {
    loading.value = false;
  }
};

// ======================== 树过滤 ========================

/** 过滤文本 */
const filterText = ref('');

/** 监听过滤文本的变化 */
watch(filterText, (val) => {
  treeRef.value!.filter(val);
});

/**
 * 过滤树节点
 * @param value 搜索关键词
 * @param data 树节点数据
 * @returns 是否显示该节点
 */
const filterNode = (value: string, data: any) => {
  if (!value) return true;
  return data.name.includes(value);
};

// ======================== 行样式 ========================

/**
 * 设置行样式
 * @param row 当前行数据
 * @returns 行类名
 */
const getRowClassName = ({ row }: { row: { roleStatus: number } }) => {
  return row.roleStatus === 1 ? 'disabled-row' : '';
};
</script>

<style scoped lang="scss">
.main-container {
  padding: $main-padding;
}

.tree-container {
  width: 90%;
  margin: 0 auto;
  min-height: 100px;
  padding: 20px 15px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;

  .tree-content {
    max-height: 70vh;
    overflow: auto;
  }

  > div:last-child {
    text-align: center;
  }
}

:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

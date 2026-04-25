<template>
  <div class="main-container">
    <!-- 搜索操作 -->
    <Card class="operation-card">
      <div class="search-container">
        <div><el-button type="primary" @click="addPermisstion(0)">添加一级权限</el-button></div>
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
            v-model="searchParams.name"
            @keydown.enter="fetchTableData"
            @clear="fetchTableData"
            :prefix-icon="Search"
            placeholder="请输入权限关键字"
            clearable
          >
            <template #append>
              <el-button type="primary" @click="fetchTableData">搜索</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </Card>
    <Card padding="0">
      <PaginationTable
        :data="tableData"
        v-loading="loading"
        :element-loading-text="LOADING_MSG"
        :showPagination="false"
        row-key="id"
      >
        <el-table-column label="权限名称" prop="name"></el-table-column>
        <el-table-column label="权限标识" prop="permCode"></el-table-column>
        <el-table-column label="资源路径" prop="path"></el-table-column>
        <el-table-column label="组件名称" prop="component"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="操作" width="220">
          <template #="{ row }">
            <el-button @click="addPermisstion(row.id)" type="primary" size="small">添加权限</el-button>
            <el-button @click="updatePermisstion(row)" type="warning" size="small">编辑</el-button>
            <el-button v-if="row.permStatus === 0" @click="forbid(row)" type="danger" size="small">禁用</el-button>
            <el-button v-else @click="handleUpdateStatus(row)" type="success" size="small">启用</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <!-- 对话框组件:添加或者更新已有的菜单的数据结构 -->
  <el-dialog v-model="dialog.visible" :title="dialog.title" @close="handleClose" width="400px">
    <el-form :model="formData" :rules="formRules" ref="formRef" label-width="80">
      <el-form-item label="名称" prop="name">
        <el-input placeholder="请你输入权限名称" v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="permCode">
        <el-input placeholder="请你输入权限标识" v-model="formData.permCode"></el-input>
      </el-form-item>
      <el-form-item label="资源路径" prop="path">
        <el-input placeholder="请你输入资源路径" v-model="formData.path"></el-input>
      </el-form-item>
      <el-form-item label="组件名称" prop="component">
        <el-input placeholder="请你输入组件名称" v-model="formData.component"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input placeholder="请你输入备注" v-model="formData.remark"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref, onMounted, reactive, inject } from 'vue';
import { statusOptions } from '@/enums/index';
import { reqQueryPermTree, reqAddPerm, reqUpdatePerm, reqUpdatePermStatus } from '@/api/acl/permission';
import { parseResList, parseResMsg } from '@/utils/parseResponse';
import { LOADING_MSG } from '@/utils/constants';

// 引入消息提示组件
const $MessageBox: any = inject('$MessageBox');

/** 加载状态 */
const loading = ref(false);

/** 搜索参数 */
const searchParams = reactive({
  name: '',
  status: 0,
});

/** 表格数据 */
const tableData = ref<any>([]);

/** 表单数据 */
const formData = ref<any>({});

/** 重置表单数据模型 */
const resetFormData = () => {
  formData.value = {
    id: null,
    parentId: 0,
    name: '',
    permCode: '',
    path: '',
    component: '',
    remark: '',
    permStatus: 0,
  };
};

/** 获取权限树数据 */
const fetchTableData = async () => {
  loading.value = true;
  try {
    const res = await reqQueryPermTree(searchParams);
    tableData.value = parseResList(res);
  } catch (error) {
    console.error('获取权限树数据失败:', error);
  } finally {
    loading.value = false;
  }
};

/** 新增/更新权限 */
const handleUpdate = async (data: any) => {
  try {
    const res = await (data?.id ? reqUpdatePerm(data) : reqAddPerm(data));
    const msg = data?.id ? `更新权限【${data.name}】成功` : `添加权限【${data.name}】成功`;
    const result = parseResMsg(res, msg);
    // 刷新数据
    result && fetchTableData();
    return result;
  } catch (error) {
    console.error('新增/更新权限失败:', error);
    return false;
  }
};

/** 更新权限状态 */
const handleUpdateStatus = async (row: any) => {
  const params = {
    id: row.id,
    status: row.permStatus ? 0 : 1,
  };
  try {
    const res = await reqUpdatePermStatus(params);
    const result = parseResMsg(res);
    // 刷新数据
    result && fetchTableData();
    return result;
  } catch (error) {
    console.error('更新权限状态失败:', error);
    return false;
  }
};

onMounted(() => {
  // 初始化表单数据
  resetFormData();
  fetchTableData();
});

// 禁用
const forbid = async (row: any) => {
  const result = await $MessageBox.confirm({
    title: '确认操作',
    message: `你确定要禁用权限【${row.name}】吗？`,
    type: 'warning',
  });
  result && handleUpdateStatus(row);
};

// 添加菜单按钮的回调
const addPermisstion = (parentId: number) => {
  resetFormData();
  dialog.title = '新增权限';
  dialog.visible = true;
  formData.value.parentId = parentId;
};

// 编辑已有的菜单
const updatePermisstion = (row: any) => {
  dialog.title = '编辑权限';
  dialog.visible = true;
  formData.value = { ...row };
};

const formRef = ref<any>(null);

// 确定按钮的回调
const save = async () => {
  // 表单验证
  await formRef.value.validate();
  const result = await handleUpdate(formData.value);
  result && (dialog.visible = false);
};

const dialog = reactive({
  title: '新增权限',
  visible: false,
});

// 关闭对话框触发
const handleClose = () => {
  resetFormData();
  formRef.value.resetFields();
};

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '权限名称为必填项', trigger: 'blur' }],
  permCode: [{ required: true, message: '权限标识为必填项', trigger: 'blur' }],
  path: [{ required: true, message: '资源路径为必填项', trigger: 'blur' }],
  component: [{ required: true, message: '组件名称为必填项', trigger: 'blur' }],
};
</script>

<style scoped lang="scss">
.main-container {
  padding: $main-padding;
}

:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

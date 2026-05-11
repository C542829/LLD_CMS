<template>
  <div class="main-container">
    <!-- 搜索操作 -->
    <Card class="operation-card">
      <div class="search-container">
        <div class="search-item"><el-button type="primary" @click="handleAddDict">添加字典</el-button></div>
        <div class="search-item">
          <el-input
            v-model="searchParams.dictName"
            @keydown.enter="search"
            @clear="search"
            :prefix-icon="Search"
            placeholder="请输入字典名称"
            clearable
          >
            <template #append>
              <el-button type="primary" @click="search">搜索</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </Card>

    <Card padding="0">
      <PaginationTable
        :data="tableData"
        v-loading="settingStore.loading && !enumHandler.visible"
        :element-loading-text="LOADING_MSG"
        :showPagination="false"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="dictName" label="字典名称" />
        <el-table-column prop="dictCode" label="字典编码" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="字典项数量">
          <template #default="scope">
            {{ scope.row.dictItems?.length || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEditDict(row)">编辑</el-button>
            <el-button link type="success" @click="handleViewItems(row)">查看项</el-button>
            <el-button link type="danger" @click="handleDeleteDict(row)">删除</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <!-- 对话框组件:添加或者更新已有的菜单的数据结构 -->
  <Dialog v-model="dialog.visible" :title="dialog.title" width="400px">
    <Form :model="dict" :rules="formRules" :loading="submitLoading" @submit="handleSubmit" @reset="resetDict">
      <el-form-item label="字典名称" prop="dictName">
        <el-input v-model="dict.dictName" placeholder="请你输入字典名称" />
      </el-form-item>
      <el-form-item label="字典编码" prop="dictCode">
        <el-input v-model="dict.dictCode" placeholder="请你输入字典编码" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="dict.sort" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dict.remark" type="textarea" placeholder="请你输入备注" />
      </el-form-item>
    </Form>
  </Dialog>

  <EnumHandler v-model="enumHandler.visible" :dictCode="enumHandler.dictCode" :defaultData="enumHandler.defaultData" />
</template>

<script setup lang="ts">
import EnumHandler from '@/components/EnumHandler/index.vue';
import { Search } from '@element-plus/icons-vue';
import { onMounted, reactive, inject, ref } from 'vue';
import { LOADING_MSG } from '@/utils/constants';
import { useSettingStore } from '@/store/modules/acl/setting';
import { reqDictList, reqAddDict, reqUpdateDict, reqDelDict } from '@/api/acl/dict/index';
import { parseResList, parseResMsg } from '@/utils/parseResponse';

// 引入消息提示组件
const $MessageBox: any = inject('$MessageBox');

const settingStore = useSettingStore();

const searchParams = reactive({
  dictName: '',
  dictCode: '',
});

const tableData = ref<any[]>([]);

const fetchList = async () => {
  settingStore.loading = true;
  const res = await reqDictList(searchParams);
  tableData.value = parseResList(res);
  settingStore.loading = false;
};

const dict = ref<any>({});
const resetDict = () => {
  dict.value = {
    dictTypeId: null,
    dictName: '',
    dictCode: '',
    sort: 0,
    remark: '',
  };
};

const submitLoading = ref(false);
const updateDict = async () => {
  try {
    submitLoading.value = true;
    const res = await (dict.value.dictTypeId ? reqUpdateDict(dict.value) : reqAddDict(dict.value));
    const result = parseResMsg(res);
    result && fetchList();
    return result;
  } finally {
    submitLoading.value = false;
  }
};

const delDict = async (dictTypeId: number) => {
  const res = await reqDelDict(dictTypeId);
  const result = parseResMsg(res);
  result && fetchList();
  return result;
};

onMounted(() => {
  fetchList();
});

// 搜索
const search = () => {
  fetchList();
};

const handleSubmit = async () => {
  const result = await updateDict();
  result && (dialog.visible = false);
};

const dialog = reactive({
  title: '新增字典',
  visible: false,
});

const handleAddDict = () => {
  dialog.title = '新增字典';
  dialog.visible = true;
  resetDict();
};

const handleEditDict = (row: any) => {
  dialog.title = '编辑字典';
  dialog.visible = true;
  dict.value = { ...row };
};

const handleDeleteDict = async (row: any) => {
  const result = await $MessageBox.confirm({
    title: '确认操作',
    message: `你确定要删除字典【${row.dictName}】吗？`,
    type: 'warning',
  });
  result && delDict(row.dictTypeId);
};

const enumHandler = reactive({
  visible: false,
  dictCode: '',
  defaultData: <any>[],
});

const handleViewItems = (row: any) => {
  enumHandler.visible = true;
  enumHandler.dictCode = row.dictCode;
  enumHandler.defaultData = row.dictItems;
};

const formRules = {
  dictName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
  dictCode: [{ required: true, message: '请输入字典编码', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
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

<template>
  <Dialog v-model="dialogVisible" :title="title" :width="width" @close="handleClose">
    <div class="dict-select-container">
      <PaginationTable
        v-loading="loading"
        element-loading-text="加载中..."
        :data="dictItemList"
        @selection-change="handleSelectionChange"
        :showPagination="false"
        class="table-container"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="itemLabel" label="字典项标签" min-width="120" />
        <el-table-column prop="itemValue" label="字典项值" min-width="120" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="remark" label="备注" min-width="150" />
      </PaginationTable>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { reqDictItemList, Types } from '@/api/acl/dict';

interface Props {
  modelValue?: boolean;
  dictCode: string;
  title?: string;
  width?: string | number;
}

// 定义组件属性
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  dictCode: '',
  title: '选择字典项',
  width: '800px',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [selectedItems: Types.DictItemVO[]];
  cancel: [];
}>();

// dialog 显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const loading = ref(false);
const dictItemList = ref<Types.DictItemVO[]>([]);
const selectedItems = ref<Types.DictItemVO[]>([]);

/**
 * 获取字典项列表
 */
const getDictItemList = async () => {
  if (!props.dictCode) {
    ElMessage.warning('字典编码不能为空');
    return;
  }

  try {
    loading.value = true;
    const res = await reqDictItemList(props.dictCode);
    const allItems = res.data || [];
    dictItemList.value = allItems;
    // 恢复选中状态
    restoreSelection();
  } catch (error) {
    console.error('获取字典项列表失败:', error);
    ElMessage.error('获取字典项列表失败');
  } finally {
    loading.value = false;
  }
};

/**
 * 从本地缓存恢复选中状态
 */
const restoreSelection = () => {
  try {
    const cachedData = localStorage.getItem(props.dictCode);
    if (cachedData) {
      const cachedItems: Types.DictItemVO[] = JSON.parse(cachedData);
      selectedItems.value = cachedItems;
    }
  } catch (error) {
    console.error('恢复选中状态失败:', error);
  }
};

/**
 * 处理选择变化
 */
const handleSelectionChange = (selection: Types.DictItemVO[]) => {
  // 合并当前页的选择和之前已选择的数据
  const currentPageIds = dictItemList.value.map((item) => item.dictItemId);
  const previousSelections = selectedItems.value.filter((item) => !currentPageIds.includes(item.dictItemId));
  selectedItems.value = [...previousSelections, ...selection];
};

/**
 * 保存选择到本地缓存
 */
const saveToCache = () => {
  try {
    localStorage.setItem(props.dictCode, JSON.stringify(selectedItems.value));
  } catch (error) {
    console.error('保存到本地缓存失败:', error);
  }
};

/**
 * 确定按钮
 */
const handleConfirm = () => {
  // 保存到本地缓存
  saveToCache();

  // 触发确认事件
  emit('confirm', selectedItems.value);

  // 关闭 dialog
  dialogVisible.value = false;
};

/**
 * 取消按钮
 */
const handleCancel = () => {
  emit('cancel');
  dialogVisible.value = false;
};

/**
 * dialog 关闭事件
 */
const handleClose = () => {
  dialogVisible.value = false;
};

/**
 * 重置状态
 */
const resetState = () => {
  selectedItems.value = [];
  dictItemList.value = [];
};

// 监听 dictCode 变化，重新加载数据
watch(
  () => props.dictCode,
  (newVal) => {
    if (newVal && props.modelValue) {
      resetState();
      getDictItemList();
    }
  },
);

// 监听 dialog 显示状态
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && props.dictCode) {
      resetState();
      getDictItemList();
    }
  },
);

defineExpose({
  getDictItemList,
  resetState,
});
</script>

<style lang="scss" scoped>
.dict-select-container {
  height: 400px;
  display: flex;
  flex-direction: column;
  gap: $main-padding;

  > .table-container {
    flex: 1;
    overflow: auto;
  }
}

::deep(.table-container .el-table__header-wrapper th) {
  background-color: $base-child-nav-bg;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>

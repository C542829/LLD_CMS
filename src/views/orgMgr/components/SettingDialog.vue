<template>
  <Dialog v-model="dialogVisible" :title="title" :width="width" @close="handleClose">
    <div class="setting-container">
      <div class="setting-item">
        <h1 class="setting-title">浏览器打印跨域问题</h1>
        <p class="setting-desc">
          谷歌浏览器输入 chrome://flags ；搜索 block-insecure-private-network-requests ， 修改 Default 为 Disabled
        </p>
      </div>
      <div class="setting-item">
        <h1 class="setting-title">谷歌浏览器</h1>
        <p class="setting-desc">
          <a href="https://caihao.lanzouu.com/imwZf3miidrc" target="_blank">点击下载</a>
          提取码：gk8j
        </p>
      </div>
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
import { computed } from 'vue';

interface Props {
  modelValue?: boolean;
  title?: string;
  width?: string | number;
}

// 定义组件属性
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '系统设置记录',
  width: '800px',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'cancel'): void;
}>();

// dialog 显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

/**
 * 确定按钮
 */
const handleConfirm = () => {
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
</script>

<style lang="scss" scoped>
.setting-container {
  // padding: 20px;
  // display: flex;
  // flex-direction: column;
  .setting-item {
    margin-bottom: 12px;

    .setting-title {
      font-size: 16px;
      // font-weight: bold;
      color: var(--el-text-color-secondary);
      margin-bottom: 8px;
    }
    .setting-desc {
      text-indent: 2em;
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }
}
</style>

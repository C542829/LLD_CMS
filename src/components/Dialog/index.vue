<template>
  <div class="custom-dialog">
    <el-dialog
      v-model="visible"
      :title="props.title"
      :width="props.width"
      :top="props.top"
      :modal="props.modal"
      :append-to-body="props.appendToBody"
      :lock-scroll="props.lockScroll"
      :close-on-click-modal="props.closeOnClickModal"
      :close-on-press-escape="props.closeOnPressEscape"
      :show-close="props.showClose"
      :before-close="handleClose"
      :center="props.center"
      :destroy-on-close="props.destroyOnClose"
      :draggable="props.draggable"
      :fullscreen="props.fullscreen"
      :align-center="props.alignCenter"
      :custom-class="props.customClass"
    >
      <slot></slot>
      <template #footer v-if="$slots.footer">
        <slot name="footer"></slot>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, withDefaults } from 'vue';

// 定义事件
const $emit = defineEmits(['update:modelValue', 'open', 'opened', 'close', 'closed']);

// 使用 withDefaults 添加默认值
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    width?: string | number;
    top?: string;
    modal?: boolean;
    appendToBody?: boolean;
    lockScroll?: boolean;
    closeOnClickModal?: boolean;
    closeOnPressEscape?: boolean;
    showClose?: boolean;
    center?: boolean;
    destroyOnClose?: boolean;
    draggable?: boolean;
    fullscreen?: boolean;
    alignCenter?: boolean;
    customClass?: string;
  }>(),
  {
    title: '',
    width: '30%',
    top: '15vh',
    modal: true,
    appendToBody: false,
    lockScroll: true,
    closeOnClickModal: true,
    closeOnPressEscape: true,
    showClose: true,
    center: false,
    destroyOnClose: false,
    draggable: false,
    fullscreen: false,
    alignCenter: false,
    customClass: '',
  },
);

// 内部可见性状态
const visible = ref(props.modelValue);

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newValue) => {
    visible.value = newValue;
  },
);

// 监听内部状态变化，通知父组件更新
watch(
  () => visible.value,
  (newValue) => {
    $emit('update:modelValue', newValue);
    if (newValue) {
      $emit('open');
    } else {
      $emit('close');
    }
  },
);

// 关闭前的回调
const handleClose = (done: () => void) => {
  $emit('close');
  done();
};
</script>

<style scoped>
.custom-dialog {
  /* 自定义样式 */
}
</style>

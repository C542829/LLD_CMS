<template>
  <ElDialog
    ref="dialogRef"
    :model-value="modelValue"
    :title="title"
    :width="width"
    :fullscreen="fullscreen"
    :top="top"
    :modal="modal"
    :show-close="showClose"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :destroy-on-close="destroyOnClose"
    :before-close="beforeClose"
    :append-to-body="appendToBody"
    :lock-scroll="lockScroll"
    :z-index="zIndex"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <slot />
  </ElDialog>
</template>

<script lang="ts" setup>
import { ref, watch, getCurrentInstance } from 'vue';
import { ElDialog, type DialogProps } from 'element-plus';

const vm: any = getCurrentInstance();
const dialogRef = ref<any>(null);

watch(
  dialogRef,
  (val) => {
    if (val) {
      vm.exposeProxy = vm.exposed = val;
    }
  },
  { immediate: true },
);

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    title?: string;
    width?: string | number;
    fullscreen?: boolean;
    top?: string;
    modal?: boolean;
    showClose?: boolean;
    closeOnClickModal?: boolean;
    closeOnPressEscape?: boolean;
    destroyOnClose?: boolean;
    beforeClose?: DialogProps['beforeClose'];
    appendToBody?: boolean;
    lockScroll?: boolean;
    zIndex?: number;
  }>(),
  {
    modal: true,
    showClose: true,
    closeOnClickModal: true,
    closeOnPressEscape: true,
    lockScroll: true,
  },
);

defineEmits(['update:modelValue']);
</script>
<script lang="ts">
export default {
  name: 'CustomDialog',
};
</script>

<style scoped></style>

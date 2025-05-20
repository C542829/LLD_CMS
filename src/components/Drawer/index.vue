<template>
  <div class="custom-drawer">
    <el-drawer
      style="min-width: 400px"
      v-model="visible"
      :title="props.title"
      :size="props.size"
      :direction="props.direction"
      :before-close="handleClose"
      :with-header="props.withHeader"
      :destroy-on-close="props.destroyOnClose"
      :modal="props.modal"
      :append-to-body="props.appendToBody"
      :close-on-click-modal="props.closeOnClickModal"
      :close-on-press-escape="props.closeOnPressEscape"
      :show-close="props.showClose"
      :custom-class="props.customClass"
    >
      <slot></slot>
      <template #footer v-if="$slots.footer">
        <slot name="footer"></slot>
      </template>
    </el-drawer>
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
    size?: string | number;
    direction?: 'rtl' | 'ltr' | 'ttb' | 'btt';
    withHeader?: boolean;
    destroyOnClose?: boolean;
    modal?: boolean;
    appendToBody?: boolean;
    closeOnClickModal?: boolean;
    closeOnPressEscape?: boolean;
    showClose?: boolean;
    customClass?: string;
  }>(),
  {
    title: '信息',
    size: '30%',
    direction: 'rtl',
    withHeader: true,
    destroyOnClose: false,
    modal: true,
    appendToBody: false,
    closeOnClickModal: true,
    closeOnPressEscape: true,
    showClose: true,
    customClass: '',
  },
);

// 控制抽屉显示状态
const visible = ref(props.modelValue);

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newValue) => {
    visible.value = newValue;
  },
);

// 监听 visible 变化
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

<script lang="ts">
export default {
  name: 'CustomDrawer',
};
</script>

<style scoped>
.custom-drawer {
  /* 自定义样式 */
}
</style>

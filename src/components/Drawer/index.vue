<template>
  <ElDrawer
    ref="drawerRef"
    :model-value="modelValue"
    :title="title"
    :size="size"
    :direction="direction"
    :with-header="withHeader"
    :show-close="showClose"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :destroy-on-close="destroyOnClose"
    :before-close="beforeClose"
    :modal="modal"
    :append-to-body="appendToBody"
    :lock-scroll="lockScroll"
    :z-index="zIndex"
    @update:model-value="$emit('update:modelValue', $event)"
    @closed="$emit('closed')"
    style="min-width: 400px; max-width: 500px"
    header-class="custom-header"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}" />
    </template>
  </ElDrawer>
</template>

<script lang="ts" setup>
import { ref, watch, getCurrentInstance } from 'vue';
import { ElDrawer, type DrawerProps } from 'element-plus';

const vm: any = getCurrentInstance();
const drawerRef = ref<any>(null);

watch(
  drawerRef,
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
    size?: DrawerProps['size'];
    direction?: DrawerProps['direction'];
    withHeader?: boolean;
    showClose?: boolean;
    closeOnClickModal?: boolean;
    closeOnPressEscape?: boolean;
    destroyOnClose?: boolean;
    beforeClose?: DrawerProps['beforeClose'];
    modal?: boolean;
    appendToBody?: boolean;
    lockScroll?: boolean;
    zIndex?: number;
  }>(),
  {
    withHeader: true,
    showClose: true,
    closeOnClickModal: true,
    closeOnPressEscape: true,
    modal: true,
    lockScroll: true,
  },
);

defineEmits(['update:modelValue', 'closed']);
</script>
<script lang="ts">
export default {
  name: 'CustomDrawer',
};
</script>

<style lang="scss">
.custom-header {
  font-size: 18px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>

<template>
  <component
    ref="datePickerRef"
    :is="h(ElDatePicker, { ...$attrs, ...props, ref: changeRef }, $slots)"
    :shortcuts="shortcuts"
    type="daterange"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    value-format="YYYY-MM-DD"
    format="YYYY-MM-DD"
    clearable
    unlink-panels
  />
</template>

<script lang="ts" setup>
import { ElDatePicker, type DatePickerProps } from 'element-plus';
import { ref, h, getCurrentInstance } from 'vue';
import { useDateShortcuts } from '@/composables/useDateShortcuts';

/**
 * 组件属性接口定义
 * - 继承 DatePickerProps 并覆盖/扩展部分属性
 * - default: 默认日期范围
 */
interface MyDatePickerProps extends Partial<DatePickerProps> {
  default?: Array<Date>;
}

// 定义组件属性
const props = defineProps<MyDatePickerProps>();

// 获取当前组件实例，用于暴露对话框方法
const vm: any = getCurrentInstance();
function changeRef(dialogInstance: any) {
  // 将对话框实例挂载到组件实例上，便于父组件调用
  vm.exposeProxy = vm.exposed = dialogInstance || {};
}

const emit = defineEmits<{
  'update:modelValue': [value: any];
  change: [value: any];
  clear: [];
}>();

// 绑定值
const value = ref<Array<Date>>([]);

props.default && (value.value = props.default);

// 获取快捷选项
const { shortcuts } = useDateShortcuts();

// 重置
const reset = () => {
  value.value = [];
};

// 暴露方法
defineExpose({ reset });
</script>

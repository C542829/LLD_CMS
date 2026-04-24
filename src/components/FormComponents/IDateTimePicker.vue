<template>
  <el-tooltip effect="dark" content="区间为 当天 07:00:00 ~ 次日 07:00:00" placement="top">
    <div class="date-picker-container">
      <el-date-picker
        ref="datePickerRef"
        v-bind="{ ...$attrs, ...props }"
        v-model="innerValue"
        :type="type as any"
        :size="size"
        :disabled="disabled"
        :range-separator="rangeSeparator"
        :start-placeholder="startPlaceholder"
        :end-placeholder="endPlaceholder"
        :clearable="clearable"
        :format="format"
        :value-format="valueFormat"
        :default-value="defaultTime"
        :default-time="defaultTime"
        :shortcuts="showShortcuts ? shortcuts : undefined"
        @change="handleChange"
        @clear="handleClear"
      />
    </div>
  </el-tooltip>
</template>

<script lang="ts">
export default {
  name: 'IDateTimePicker',
};
</script>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { ElDatePicker } from 'element-plus';
import { useDateShortcuts } from '@/composables/useDateShortcuts';
import { isBoolean, isNumber } from 'lodash';
import { formatDate, formatDateTime } from '@/utils';

/** 日期时间范围值类型 */
type DateRangeValue = [string, string] | [Date, Date] | string | Date | [];

interface Props {
  /** 绑定值，支持 v-model */
  modelValue?: DateRangeValue;
  /** 日期选择器类型 */
  type?: string;
  /** 是否启用默认值（值为true 默认使用当天；值为数字时为快捷数组下标 0-10） */
  default?: boolean | number;
  /** 尺寸 */
  size?: SizeType;
  /** 是否禁用 */
  disabled?: boolean;
  /** 范围分隔符 */
  rangeSeparator?: string;
  /** 开始占位文本 */
  startPlaceholder?: string;
  /** 结束占位文本 */
  endPlaceholder?: string;
  /** 是否可清空 */
  clearable?: boolean;
  /** 显示格式 */
  format?: string;
  /** 绑定值格式 */
  valueFormat?: string;
  /** 是否显示快捷选项 */
  showShortcuts?: boolean;
  /** 默认值 */
  defaultValue?: Date | [Date, Date];
  /** 默认时间 */
  defaultTime?: Date | [Date, Date];
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  type: 'datetimerange',
  default: true,
  size: 'default',
  disabled: false,
  rangeSeparator: '至',
  startPlaceholder: '开始时间',
  endPlaceholder: '结束时间',
  clearable: true,
  format: 'YYYY-MM-DD HH:mm:ss',
  valueFormat: 'YYYY-MM-DD HH:mm:ss',
  showShortcuts: true,
  defaultValue: () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    return [start, end] as any;
  },
  defaultTime: () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    return [start, end] as any;
  },
});

const emit = defineEmits(['update:modelValue', 'change', 'clear']);

/** 日期选择器实例 */
const datePickerRef = ref<any>();

/** 内部绑定值，与 modelValue 双向同步 */
const innerValue = computed<any>({
  get: () => props.modelValue,
  set: (val: [string, string]) => {
    if (!val) {
      emit('update:modelValue', []);
      return;
    }
    emit('update:modelValue', val as DateRangeValue);
  },
});

/** 获取快捷选项 */
const { shortcuts } = useDateShortcuts();

/** 解析快捷选项值，处理函数类型 */
const resolveShortcutValue = (shortcut: (typeof shortcuts)[number]): [Date, Date] | [] => {
  let val = shortcut.value;
  return typeof val === 'function' ? val() : val;
};

/**
 * 默认值变化监听
 * 当 default 为 true 时，使用快捷选项第一个值
 * 当 default 为 number 时，使用快捷选项对应下标值
 */
watch(
  () => props.default,
  (val) => {
    //  值为true 默认使用当天
    if (isBoolean(val)) {
      const datetime = resolveShortcutValue(shortcuts[0]);
      const datetimeStr = [formatDateTime(datetime[0] as Date), formatDateTime(datetime[1] as Date)];
      innerValue.value = val ? (datetimeStr as any) : [];
    } else {
      // 为数字时，使用快捷选项对应下标值
      if (isNumber(val)) {
        const datetime = resolveShortcutValue(shortcuts[val]);
        const datetimeStr = [formatDateTime(datetime[0] as Date), formatDateTime(datetime[1] as Date)];
        innerValue.value = datetimeStr as any;
      }
    }
  },
  { immediate: true },
);

/** 值变化事件 */
const handleChange = (val: DateRangeValue) => {
  emit('change', val);
};

/** 清空事件 */
const handleClear = () => {
  emit('clear', []);
};

/** 暴露实例方法 */
defineExpose({
  /** 获取日期选择器实例 */
  ref: datePickerRef,
  /** 聚焦 */
  focus: () => datePickerRef.value?.focus(),
  /** 失焦 */
  blur: () => datePickerRef.value?.blur(),
});
</script>

<style lang="scss" scoped>
.date-picker-container {
  display: inline-block;
}
</style>

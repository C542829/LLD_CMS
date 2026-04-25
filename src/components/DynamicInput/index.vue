<template>
  <div class="dynamic-input" :style="{ maxWidth: normalizedWidth }">
    <!-- 查看状态 -->
    <div v-if="!isEditing" class="dynamic-input__view" :style="{ fontSize: fontSize }">
      <span class="dynamic-input__text text-overflow" :title="inputValue ?? ''">
        {{ inputValue || emptyText }}
      </span>
      <el-button
        type="primary"
        :color="btnColor || undefined"
        :size="size"
        link
        @click.stop.prevent="handleStartEdit"
      >
        编辑
      </el-button>
    </div>
    <!-- 编辑状态 -->
    <div v-else class="dynamic-input__edit">
      <el-input
        v-model="inputValue"
        :placeholder="placeholder"
        :size="size"
        class="dynamic-input__input"
        clearable
        @keyup.enter="handleConfirm"
        @keyup.escape="handleCancel"
      />
      <el-button
        type="primary"
        :color="btnColor || undefined"
        :size="size"
        link
        @click.stop.prevent="handleCancel"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        :color="btnColor || undefined"
        :size="size"
        link
        @click.stop.prevent="handleConfirm"
      >
        确定
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Message from '@/components/Message/index';

/** 动态编辑输入框组件 Props */
interface DynamicInputProps {
  /** 输入框值 */
  value: string | null | undefined;
  /** 额外参数，随 change 事件一起传递 */
  params?: Record<string, unknown>;
  /** 编辑按钮颜色 */
  btnColor?: string;
  /** 容器最大宽度，number 时单位为 px，string 时直接使用 */
  width?: number | string;
  /** 尺寸 */
  size?: SizeType;
  /** 查看状态文字大小 */
  fontSize?: string;
  /** 输入框占位文本 */
  placeholder?: string;
  /** 空值时显示的文本 */
  emptyText?: string;
}

const props = withDefaults(defineProps<DynamicInputProps>(), {
  size: 'default',
  width: 300,
  fontSize: '14px',
  placeholder: '请输入内容',
  emptyText: '-',
});

const emit = defineEmits<{
  /** 值变更事件 */
  (e: 'change', value: string, params: Record<string, unknown>): void;
}>();

/** 标准化宽度：number 时添加 px 单位，string 时直接使用 */
const normalizedWidth = computed(() => {
  return typeof props.width === 'number' ? `${props.width}px` : props.width;
});

/** 输入框值 */
const inputValue = ref<string>('');
/** 是否处于编辑状态 */
const isEditing = ref(false);

/** 进入编辑状态 */
const handleStartEdit = () => {
  isEditing.value = true;
};

/** 确认修改 */
const handleConfirm = () => {
  if (!inputValue.value) {
    Message.warning('内容不能为空');
    return;
  }
  emit('change', inputValue.value, props.params ?? {});
  isEditing.value = false;
};

/** 取消编辑，恢复原始值 */
const handleCancel = () => {
  isEditing.value = false;
  inputValue.value = props.value ?? '';
};

/** 同步外部 value */
watch(
  () => props.value,
  (newValue) => {
    inputValue.value = newValue ?? '';
  },
  { immediate: true },
);
</script>

<script lang="ts">
export default {
  name: 'DynamicInput',
};
</script>

<style lang="scss" scoped>
.dynamic-input {
  display: flex;
  align-items: center;
  width: 100%;

  &__view {
    width: 100%;
    display: flex;
    align-items: center;
  }

  &__text {
    margin-right: 5px;
  }

  &__edit {
    width: 100%;
    display: flex;
    align-items: center;
  }

  &__input {
    width: calc(100% - 85px);
    margin-right: 5px;
  }
}
</style>

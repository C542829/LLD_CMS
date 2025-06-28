<template>
  <div class="container">
    <!-- 查看状态 -->
    <template v-if="!isEditing">
      <span>{{ inputValue }}</span>
      <el-button type="primary" link @click="isEditing = true">编辑</el-button>
    </template>
    <!-- 编辑状态 -->
    <template v-else>
      <el-input
        v-model="inputValue"
        @keyup.enter="handleConfirm"
        :style="{ width: `${props.width}px` }"
        class="input"
        clearable
      />
      <el-button type="primary" link @click="handleCancel">取消</el-button>
      <el-button type="primary" link @click="handleConfirm">确定</el-button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, withDefaults, inject } from 'vue';

const $Message: any = inject('$Message');

const props = withDefaults(defineProps<DynamicInputProps>(), { value: '', width: 160 });

const $emit = defineEmits(['update']);

// 输入框初始值
let inputValue = ref(props.value);
// 是否处于编辑状态
let isEditing = ref(false);

// 确认修改
const handleConfirm = () => {
  if (!inputValue.value) {
    $Message.error('内容不能为空');
    return;
  }
  // 传递数据
  const params: DynamicInputData = { value: inputValue.value };
  props.params && (params.params = props.params);
  $emit('update', params);
  // 关闭编辑状态
  isEditing.value = false;
};

// 取消编辑
const handleCancel = () => {
  isEditing.value = false;
  inputValue.value = props.value;
};

interface DynamicInputProps {
  value: string; // 输入框值
  width?: number; // 输入框宽度
  params?: object; // 额外参数
}

interface DynamicInputData {
  value: string;
  params?: object;
}
</script>
<script lang="ts">
export default {
  name: 'DynamicInput',
};
</script>
<style scoped>
.container {
  display: inline;
  > span {
    margin: 0 5px 0 0;
  }

  .input {
    width: 150px;
    margin: 0 5px 0 0;
  }
}
</style>

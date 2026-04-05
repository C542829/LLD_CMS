<template>
  <el-select
    v-model="selectedValue"
    :placeholder="placeholder"
    :class="class"
    :value-key="valueKey"
    :multiple="multiple"
    :collapse-tags="multiple"
    :collapse-tags-tooltip="multiple"
    :max-collapse-tags="multiple ? maxCollapseTags : 1"
    :clearable="clearable"
    :placement="placement"
    :loading="loading"
    :filterable="filterable"
    :disabled="disabled"
    @change="handleChange"
    @clear="handleClear"
  >
    <el-option
      v-for="item in options"
      :key="item[defaultProps.value]"
      :label="item[defaultProps.label]"
      :value="emitObject ? item : item[defaultProps.value]"
    />

    <template #header>
      <div class="el-align-center">
        <el-button v-if="multiple" type="primary" size="small" link @click="handleClear">取消选择</el-button>
        <el-button type="success" size="small" link @click="loadDictItems">刷新数据</el-button>
      </div>
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { reqDictItemList, Types } from '@/api/acl/dict/index';
import { computed, onMounted, ref, watch } from 'vue';
import { SelectInstance } from 'element-plus';

type ElSelectProps = SelectInstance['$props'];

interface Props extends Partial<ElSelectProps> {
  modelValue: number | number[] | string | string[] | Types.DictItemVO | Types.DictItemVO[];
  dictCode: string;
  placeholder?: string;
  class?: string;
  valueKey?: string;
  maxCollapseTags?: number;
  clearable?: boolean;
  multiple?: boolean;
  emitObject?: boolean;
  defaultProps?: { label: string; value: string };
  filterable?: boolean;
  placement?: PlacementType;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  dictCode: '',
  placeholder: '请选择',
  class: 'w-120',
  valueKey: 'dictItemId',
  maxCollapseTags: 0,
  clearable: true,
  multiple: false,
  emitObject: false,
  filterable: true,
  placement: 'bottom',
  disabled: false,
  defaultProps: () => ({
    label: 'itemLabel',
    value: 'itemValue',
  }),
});

const emit = defineEmits(['update:modelValue', 'change', 'clear']);

const selectedValue = ref<any>(props.multiple ? [] : undefined);

const loading = ref(false);

watch(
  () => props.modelValue,
  (val) => {
    if (props.emitObject) {
      if (props.multiple) {
        selectedValue.value = Array.isArray(val) ? val : [];
      } else {
        selectedValue.value = val || undefined;
      }
    } else {
      if (props.multiple) {
        selectedValue.value = Array.isArray(val) ? val : [];
      } else {
        selectedValue.value = Array.isArray(val) ? (val.length > 0 ? val[0] : undefined) : val;
      }
    }
  },
  { immediate: true },
);

watch(
  () => props.dictCode,
  (val) => {
    if (val) {
      loadDictItems();
    }
  },
);

const handleChange = (val: any) => {
  emit('update:modelValue', val);
  emit('change', val);
};

const handleClear = () => {
  const value = props.multiple ? [] : '';
  emit('update:modelValue', value);
  emit('clear');
};

onMounted(() => {
  if (props.dictCode) {
    loadDictItems();
  }
});

const options = computed(() => {
  return dictItems.value;
});

const dictItems = ref<Types.DictItemVO[]>([]);

const loadDictItems = async () => {
  if (!props.dictCode) return;
  loading.value = true;
  try {
    const res = await reqDictItemList(props.dictCode);
    dictItems.value = res.data || [];
  } catch (error) {
    console.error('加载字典项失败:', error);
  } finally {
    loading.value = false;
  }
};
</script>

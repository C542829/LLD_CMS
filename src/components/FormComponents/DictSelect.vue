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
      <div v-if="multiple" class="el-align-center">
        <el-button type="primary" size="small" link @click="handleClear">取消选择</el-button>
      </div>
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { SelectInstance } from 'element-plus';
import { useDictStore } from '@/store/modules/dict/index';
import type { Types } from '@/api/acl/dict/index';

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

const dictStore = useDictStore();

const selectedValue = ref<any>(props.multiple ? [] : undefined);

const loading = ref(false);

const dictItems = ref<Types.DictItemVO[]>([]);

const options = computed(() => dictItems.value);

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
  async (val) => {
    if (val) {
      loading.value = true;
      dictItems.value = await dictStore.getDictItems(val);
      loading.value = false;
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

onMounted(async () => {
  if (props.dictCode) {
    loading.value = true;
    dictItems.value = await dictStore.getDictItems(props.dictCode);
    loading.value = false;
  }
});
</script>

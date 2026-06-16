<template>
  <el-select
    ref="userSelectRef"
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
    :filter-method="filterMethod"
    @change="handleChange"
    @clear="handleClear"
  >
    <el-option
      v-for="item in filterOptions"
      :key="item[defaultProps.value]"
      :label="item[defaultProps.label]"
      :value="emitObject ? item : item[defaultProps.value]"
    >
      {{ item[defaultProps.label] }}({{ item[defaultProps.code] }})
    </el-option>

    <template #header>
      <div class="el-align-center">
        <el-button v-if="multiple" type="primary" size="small" link @click="handleClear">取消选择</el-button>
        <el-button type="success" size="small" link @click="getUserList">刷新数据</el-button>
      </div>
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { useMasterDataStore } from '@/store/modules/masterData/index';
import { computed, onMounted, ref, watch } from 'vue';
import { SelectInstance } from 'element-plus';

const masterDataStore = useMasterDataStore();

type ElSelectProps = SelectInstance['$props'];

interface Props extends /* @vue-ignore */ Partial<ElSelectProps> {
  modelValue: number | number[] | UserInfo | UserInfo[] | string;
  placeholder?: string;
  class?: string;
  valueKey?: string;
  maxCollapseTags?: number;
  clearable?: boolean;
  multiple?: boolean;
  emitObject?: boolean;
  defaultProps?: any;
  filterable?: boolean;
  placement?: PlacementType;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  placeholder: '用户',
  class: 'w-120',
  valueKey: 'userId',
  maxCollapseTags: 0,
  clearable: true,
  multiple: true,
  emitObject: false,
  filterable: true,
  placement: 'bottom',
  defaultProps: () => ({
    label: 'userName',
    value: 'userId',
    code: 'userCode',
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

/**
 * 选择用户
 */
const handleChange = (val: any) => {
  emit('update:modelValue', val);
  emit('change', val);
};

/**
 * 取消选择用户
 */
const handleClear = () => {
  const value = props.multiple ? [] : '';
  emit('update:modelValue', value);
  emit('clear');
};

onMounted(() => {
  getUserList();
});

/** 当前用户选项列表 */
const options = computed(() => {
  return userList.value;
});

const filterOptions = ref<UserInfo[]>([]);

/** 用户列表 */
const userList = ref<UserInfo[]>([]);

/**
 * 过滤用户 根据用户名和编码进行匹配
 */
const filterMethod = (query: string) => {
  if (!query.trim()) {
    filterOptions.value = userList.value;
  }
  filterOptions.value = userList.value.filter(
    (item) =>
      item[props.defaultProps.label].toLowerCase().includes(query.toLowerCase()) ||
      item[props.defaultProps.code].toLowerCase().includes(query.toLowerCase()),
  );
};

/**
 * 获取用户列表
 */
const getUserList = async (refresh = false) => {
  loading.value = true;
  try {
    const data = await masterDataStore.getUserList(refresh);
    userList.value = data || [];
    filterOptions.value = data || [];
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

const userSelectRef = ref<SelectInstance>();
defineExpose({
  focus: () => {
    userSelectRef.value?.focus();
  },
  blur: () => {
    userSelectRef.value?.blur();
  },
  getRef: () => userSelectRef.value,
});
</script>

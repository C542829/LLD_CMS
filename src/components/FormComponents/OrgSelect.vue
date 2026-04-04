<template>
  <el-select
    v-model="selectedOrgIds"
    :placeholder="placeholder"
    :class="class"
    :value-key="valueKey"
    :multiple="multiple"
    :collapse-tags="multiple"
    :collapse-tags-tooltip="multiple"
    :max-collapse-tags="multiple ? maxCollapseTags : undefined"
    :clearable="clearable"
    :placement="placement"
    :loading="loading"
    @change="handleChange"
    @clear="handleClear"
  >
    <el-option
      v-for="item in options"
      :key="item[defaultProps.value]"
      :label="item[defaultProps.label]"
      :value="item[defaultProps.value]"
    />
    <template v-if="multiple" #header>
      <div class="el-align-center">
        <el-button type="primary" size="small" link @click="handleSelectAll">全选</el-button>
        <el-button type="primary" size="small" link @click="handleClear">取消选择</el-button>
        <el-button type="success" size="small" link @click="getOrgList">刷新数据</el-button>
      </div>
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { reqList as reqOrgList } from '@/api/acl/org/index';
import { computed, onMounted, ref, watch } from 'vue';
import { SelectInstance } from 'element-plus';
import useUserStore from '@/store/modules/acl/user';

type ElSelectProps = SelectInstance['$props'];

interface Props extends Partial<ElSelectProps> {
  modelValue: number | number[];
  placeholder?: string;
  class?: string;
  valueKey?: string;
  maxCollapseTags?: number;
  clearable?: boolean;
  multiple?: boolean;
  defaultProps?: any;
  placement?: PlacementType;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  placeholder: '关联门店',
  class: 'w-240',
  valueKey: 'id',
  maxCollapseTags: 1,
  clearable: true,
  multiple: true,
  defaultProps: () => ({
    label: 'orgName',
    value: 'id',
  }),
  placement: 'bottom',
});

const emit = defineEmits(['update:modelValue', 'clear', 'change']);

const selectedOrgIds = ref<number | number[]>(props.multiple ? [] : (undefined as any));

const loading = ref(false);

const userStore = useUserStore();

watch(
  () => props.modelValue,
  (val) => {
    if (props.multiple) {
      selectedOrgIds.value = Array.isArray(val) ? val : [];
    } else {
      selectedOrgIds.value = Array.isArray(val) ? (val.length > 0 ? val[0] : undefined) : val;
    }
  },
  { immediate: true },
);

/**
 * 选择门店
 */
const handleChange = (val: number | number[]) => {
  emit('update:modelValue', val);
  emit('change', val);
};

/**
 * 取消已选择
 */
const handleClear = () => {
  const value = props.multiple ? [] : '';
  emit('update:modelValue', value);
  emit('clear');
};

/**
 * 全选
 */
const handleSelectAll = () => {
  if (props.multiple && options.value) {
    const val = options.value.map((item) => item.id) as number[];
    emit('update:modelValue', val);
    emit('change', val);
  }
};

onMounted(() => {
  getOrgList();
});

/** 当前门店选项列表 */
const options = computed(() => {
  if (userStore.isAreaManager) {
    return userStore.user.orgs;
  }
  return orgList.value;
});

/** 门店列表 */
const orgList = ref<OrgInfo[]>([]);

/**
 * 获取门店列表
 */
const getOrgList = async () => {
  loading.value = true;
  try {
    const res = await reqOrgList();
    const data = res.data;
    orgList.value = data.filter((item) => !item?.orgCode.includes('Test'));
  } catch (error) {
  } finally {
    loading.value = false;
  }
};
</script>

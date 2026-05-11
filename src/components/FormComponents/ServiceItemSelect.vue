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
        <el-button v-if="multiple" type="primary" link size="small" @click="handleClear">取消选择</el-button>
        <el-button type="success" size="small" link @click="getServiceItemList">刷新数据</el-button>
      </div>
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { type Types } from '@/api/setGroup/serviceItem/index';
import { useMasterDataStore } from '@/store/modules/masterData/index';
import { computed, onMounted, ref, watch } from 'vue';
import { SelectInstance } from 'element-plus';

const masterDataStore = useMasterDataStore();

type ElSelectProps = SelectInstance['$props'];

interface Props extends Partial<ElSelectProps> {
  modelValue: number | number[] | Types.ServerItemVO | Types.ServerItemVO[] | string;
  placeholder?: string;
  class?: string;
  valueKey?: string;
  maxCollapseTags?: number;
  clearable?: boolean;
  multiple?: boolean;
  emitObject?: boolean;
  filterable?: boolean;
  placement?: PlacementType;
  itemStatus?: number;
  category?: string;
  defaultProps?: any;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  placeholder: '服务项目',
  class: 'w-120',
  valueKey: 'id',
  maxCollapseTags: 0,
  clearable: true,
  multiple: true,
  emitObject: false,
  filterable: true,
  placement: 'bottom',
  itemStatus: 0,
  category: '',
  defaultProps: () => ({
    label: 'itemName',
    value: 'id',
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
 * 选择服务项目
 */
const handleChange = (val: any) => {
  emit('update:modelValue', val);
  emit('change', val);
};

/**
 * 取消选择服务项目
 */
const handleClear = () => {
  const value = props.multiple ? [] : '';
  emit('update:modelValue', value);
  emit('clear');
};

onMounted(() => {
  getServiceItemList();
});

/** 当前服务项目选项列表 */
const options = computed(() => {
  return serviceItemList.value;
});

/** 服务项目列表 */
const serviceItemList = ref<Types.ServerItemVO[]>([]);

/**
 * 获取服务项目列表
 */
const getServiceItemList = async (refresh = false) => {
  loading.value = true;
  try {
    serviceItemList.value = await masterDataStore.getServiceItemList(refresh);
  } catch (error) {
  } finally {
    loading.value = false;
  }
};
</script>

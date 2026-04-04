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
        <el-button type="success" size="small" link @click="getProductList">刷新数据</el-button>
      </div>
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { reqProductList, type Types } from '@/api/setGroup/product/index';
import { computed, onMounted, ref, watch } from 'vue';
import { SelectInstance } from 'element-plus';
import { Status } from '@/enums/index';

type ElSelectProps = SelectInstance['$props'];

interface Props extends Partial<ElSelectProps> {
  modelValue: number | number[] | Types.ProductInfoVO | Types.ProductInfoVO[] | string;
  placeholder?: string;
  class?: string;
  valueKey?: string;
  maxCollapseTags?: number;
  clearable?: boolean;
  multiple?: boolean;
  emitObject?: boolean;
  filterable?: boolean;
  placement?: PlacementType;
  productStatus?: number;
  defaultProps?: any;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  placeholder: '产品',
  class: 'w-120',
  valueKey: 'id',
  maxCollapseTags: 0,
  clearable: true,
  multiple: true,
  emitObject: false,
  filterable: true,
  placement: 'bottom',
  productStatus: Status.enabled,
  defaultProps: () => ({
    label: 'productName',
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
 * 选择产品
 */
const handleChange = (val: any) => {
  emit('update:modelValue', val);
  emit('change', val);
};

/**
 * 取消选择产品
 */
const handleClear = () => {
  const value = props.multiple ? [] : '';
  emit('update:modelValue', value);
  emit('clear');
};

onMounted(() => {
  getProductList();
});

/** 当前产品选项列表 */
const options = computed(() => {
  return productList.value;
});

/** 产品列表 */
const productList = ref<Types.ProductInfoVO[]>([]);

/**
 * 获取产品列表
 */
const getProductList = async () => {
  loading.value = true;
  try {
    const res = await reqProductList({
      productStatus: props.productStatus,
    });
    productList.value = res.data || [];
  } catch (error) {
  } finally {
    loading.value = false;
  }
};
</script>

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
        <el-button type="success" size="small" link @click="getTreatmentCouponList">刷新数据</el-button>
      </div>
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { useMasterDataStore } from '@/store/modules/masterData/index';
import { computed, onMounted, ref, watch } from 'vue';
import { SelectInstance } from 'element-plus';
import { Status } from '@/enums/index';

const masterDataStore = useMasterDataStore();

type ElSelectProps = SelectInstance['$props'];

interface TreatmentCouponVO {
  id?: number;
  cureTicketName?: string;
  encode?: string;
  price?: number;
  status?: number;
  remark?: string;
  type?: number;
  commissionValue?: number;
  commissionBase?: number;
  [property: string]: any;
}

interface Props extends Partial<ElSelectProps> {
  modelValue: number | number[] | TreatmentCouponVO | TreatmentCouponVO[] | string;
  placeholder?: string;
  class?: string;
  valueKey?: string;
  maxCollapseTags?: number;
  clearable?: boolean;
  multiple?: boolean;
  emitObject?: boolean;
  filterable?: boolean;
  placement?: PlacementType;
  status?: number;
  defaultProps?: any;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  placeholder: '疗程券',
  class: 'w-120',
  valueKey: 'id',
  maxCollapseTags: 0,
  clearable: true,
  multiple: true,
  emitObject: false,
  filterable: true,
  placement: 'bottom',
  status: Status.enabled,
  defaultProps: () => ({
    label: 'name',
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
 * 选择疗程券
 */
const handleChange = (val: any) => {
  emit('update:modelValue', val);
  emit('change', val);
};

/**
 * 取消选择疗程券
 */
const handleClear = () => {
  const value = props.multiple ? [] : '';
  emit('update:modelValue', value);
  emit('clear');
};

onMounted(() => {
  getTreatmentCouponList();
});

/** 当前疗程券选项列表 */
const options = computed(() => {
  return treatmentCouponList.value;
});

/** 疗程券列表 */
const treatmentCouponList = ref<TreatmentCouponVO[]>([]);

/**
 * 获取疗程券列表
 */
const getTreatmentCouponList = async (refresh = false) => {
  loading.value = true;
  try {
    treatmentCouponList.value = await masterDataStore.getTreatmentCouponList(refresh);
  } catch (error) {
  } finally {
    loading.value = false;
  }
};
</script>

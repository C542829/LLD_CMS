<template>
  <div class="dict-radio-container">
    <el-scrollbar height="32px">
      <el-radio-group v-model="dictValue" @change="handleChange">
        <el-radio-button
          v-for="item in dictItemList"
          :key="item.itemValue"
          :value="item.itemValue"
          :label="item.itemLabel"
        />
      </el-radio-group>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { reqDictItemList } from '@/api/acl/dict';

interface Props {
  modelValue?: string | number;
  dictCode: string;
}

// 定义组件属性
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  dictCode: '',
});

const emit = defineEmits(['update:modelValue', 'change']);

watch(
  () => props.modelValue,
  (newVal) => {
    emit('update:modelValue', newVal);
  },
);

const handleChange = (val: string | number | boolean | undefined) => {
  emit('update:modelValue', val);
  emit('change', val);
};

// 选中值
const dictValue = ref<string | number>(props.modelValue);
// 加载状态
const loading = ref(false);
// 字典项列表
const dictItemList: any = ref([]);

onMounted(() => {
  getDictItemList();
});

const all = {
  itemValue: '',
  itemLabel: '全部',
};

const getDictItemList = async () => {
  try {
    loading.value = true;
    const res = await reqDictItemList(props.dictCode);
    res.data.unshift(all);
    dictItemList.value = res.data || [];
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

defineExpose({
  getDictItemList,
});
</script>
<script lang="ts">
export default {
  name: 'DictRadio',
};
</script>

<style lang="scss" scoped>
.dict-radio-container {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
}
</style>

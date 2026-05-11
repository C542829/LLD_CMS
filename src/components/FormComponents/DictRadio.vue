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
import { useDictStore } from '@/store/modules/dict/index';
import type { Types } from '@/api/acl/dict/index';

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

const dictStore = useDictStore();

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
const dictItemList = ref<Types.DictItemVO[]>([]);

const all: Types.DictItemVO = {
  itemValue: '',
  itemLabel: '全部',
};

/**
 * 从本地缓存获取字典项列表
 */
const getDictFromCache = (): Types.DictItemVO[] | null => {
  try {
    const cachedData = localStorage.getItem(props.dictCode);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  } catch (error) {
    console.error('从缓存读取字典失败:', error);
    return null;
  }
};

/**
 * 保存字典项列表到本地缓存
 */
const saveDictToCache = (data: Types.DictItemVO[]) => {
  try {
    localStorage.setItem(props.dictCode, JSON.stringify(data));
  } catch (error) {
    console.error('保存字典到缓存失败:', error);
  }
};

const getDictItemList = async () => {
  if (!props.dictCode) return;

  try {
    loading.value = true;

    // 优先从本地缓存读取
    const cachedData = getDictFromCache();
    if (cachedData && cachedData.length > 0) {
      dictItemList.value = [all, ...cachedData];
      return;
    }

    // 缓存中没有，从 dictStore 获取
    const list = await dictStore.getDictItems(props.dictCode);

    // 保存到本地缓存
    if (list.length > 0) {
      saveDictToCache(list);
    }

    dictItemList.value = [all, ...list];
  } catch (error) {
    console.error('获取字典项列表失败:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getDictItemList();
});

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

<template>
  <div class="demo-date-picker">
    <div class="block">
      <span class="demonstration">{{ props.title }}：</span>
      <el-date-picker
        v-model="value"
        type="daterange"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :shortcuts="shortcuts"
        :size="props.size"
        :touch-config="{ passive: true }"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatDate } from '@/utils/time';
import { ref, watch, withDefaults } from 'vue';

// 导入自定义事件
let $emit = defineEmits(['selectDate']);

// 使用 withDefaults 添加默认值
const props = withDefaults(
  defineProps<{
    title?: string;
    size: 'default' | 'large' | 'small';
  }>(),
  {
    title: '选择日期',
    size: 'default',
  },
);

// 绑定值
const value = ref([]);

// 当值发生变化时，调用自定义事件
watch(
  () => value.value,
  (newValue, oldValue) => {
    const start: string = formatDate(newValue[0]);
    const end: string = formatDate(newValue[1]);
    $emit('selectDate', start, end);
  },
);

// 设置快捷选项
const shortcuts = [
  {
    text: '今天',
    value: () => {
      const end = new Date();
      const start = new Date();
      return [start, end];
    },
  },
  {
    text: '昨天',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
      end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
      return [start, end];
    },
  },
  {
    text: '本周',
    value: () => {
      const end = new Date();
      const start = new Date();
      const offset = start.getDay() - 1;
      start.setTime(start.getTime() - 3600 * 1000 * 24 * offset);
      return [start, end];
    },
  },
  {
    text: '本月',
    value: () => {
      const end = new Date();
      const start = new Date();
      const offset = start.getDate() - 1;
      start.setTime(start.getTime() - 3600 * 1000 * 24 * offset);
      return [start, end];
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];
</script>
<script lang="ts">
export default {
  name: 'DatePicker',
};
</script>

<style scoped>
.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}

.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.demo-date-picker .block:last-child {
  border-right: none;
}

.demo-date-picker .demonstration {
  display: inline-block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>

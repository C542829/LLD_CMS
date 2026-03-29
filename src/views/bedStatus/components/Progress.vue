<template>
  <el-progress type="circle" :percentage="percentage" :color="colors" :striped-flow="true" :width="71">
    <template #default>
      <span style="color: #fff">140分钟</span>
    </template>
  </el-progress>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  bed: {};
}

const props = withDefaults(defineProps<Props>(), {
  bed: () => ({}),
});

/**
 * 计算时间差
 * @param createTime 开始时间
 * @returns 时间差（分钟）
 */
const calcTime = (createTime: Date) => {
  const now = new Date();
  const diff = now.getTime() - createTime.getTime();
  const diffMinutes = diff / (1000 * 60);
  return diffMinutes;
};

/**
 * 根据当前服务时间计算百分比
 * @param total 总时间
 * @param current 当前时间
 */
const calcPercentage = (total: number, current: number) => {
  return (current / total) * 100;
};

const percentage = ref(calcPercentage(140, 0));
// const percentage = ref(140);

const colors = [
  { color: '#e74c3c', percentage: 100 },
  { color: '#E6A23C', percentage: 80 },
  { color: '#9b59b6', percentage: 60 },
  { color: '#409EFF', percentage: 40 },
  { color: '#67C23A', percentage: 20 },
];
</script>

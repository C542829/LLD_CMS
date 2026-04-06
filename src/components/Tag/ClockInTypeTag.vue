<template>
  <el-tag :type="clockInType.type">{{ clockInType.name }}</el-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ServiceType, ServiceTypeMap } from '@/enums/index';
interface Props {
  type: ServiceType;
}
const props = withDefaults(defineProps<Props>(), {
  type: ServiceType.Point,
});

const clockInTypeColor = {
  [ServiceType.Point]: 'warning',
  [ServiceType.Add]: 'success',
  [ServiceType.Round]: 'primary',
};

const clockInType = computed(() => {
  return {
    name: ServiceTypeMap[props.type] || '未知',
    type: (clockInTypeColor[props.type] || 'info') as ElTagType,
  };
});
</script>

<style></style>

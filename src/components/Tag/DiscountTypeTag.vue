<template>
  <el-tag :type="tagInfo.type">{{ tagInfo.name }}</el-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DiscountType, discountTypeMap } from '@/enums/index';

interface Props {
  /** 折扣类型 */
  type: DiscountType;
}

const props = withDefaults(defineProps<Props>(), {
  type: DiscountType.Standard,
});

/** 折扣类型对应标签颜色 */
const discountTypeColor: Record<DiscountType, ElTagType> = {
  [DiscountType.Standard]: 'primary',
  [DiscountType.Member]: 'success',
};

const tagInfo = computed(() => ({
  name: discountTypeMap[props.type] || '未知',
  type: discountTypeColor[props.type] || 'info',
}));
</script>

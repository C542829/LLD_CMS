<template>
  <el-tag :type="tagInfo.type">
    {{ tagInfo.name }}：{{ value }}{{ commissionType === CommissionType.FixedAmount ? '元' : '%' }}
  </el-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CommissionType, commissionTypeMap } from '@/enums/index';

interface Props {
  /** 提成类型 */
  commissionType: CommissionType;
  /** 提成值 */
  value: number;
}

const props = withDefaults(defineProps<Props>(), {
  commissionType: CommissionType.FixedAmount,
  value: 0,
});

/** 提成类型对应标签颜色 */
const commissionTypeColor: Record<CommissionType, ElTagType> = {
  [CommissionType.FixedAmount]: 'success',
  [CommissionType.Proportion]: 'primary',
};

const tagInfo = computed(() => ({
  name: commissionTypeMap[props.commissionType] || '未知',
  type: commissionTypeColor[props.commissionType] || 'info',
}));
</script>

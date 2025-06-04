<template>
  <el-card
    class="card-container"
    :shadow="props.shadow"
    :style="{
      backgroundColor: props.bgColor,
    }"
  >
    <template #header v-if="$slots.header">
      <slot name="header"></slot>
    </template>
    <slot></slot>
    <template #footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { withDefaults } from 'vue';

interface CardProps {
  shadow?: 'always' | 'hover' | 'never';
  bgColor?: string;
  flex?: 'row' | 'column';
}

const props = withDefaults(defineProps<CardProps>(), {
  shadow: 'never',
  bgColor: '#f5f7fa',
  flex: 'column',
});
</script>
<script lang="ts">
export default {
  name: 'Card',
};
</script>

<style lang="scss" scoped>
.card-container {
  width: 100%;
  border: none;
}
</style>

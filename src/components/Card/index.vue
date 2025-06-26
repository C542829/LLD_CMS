<template>
  <el-card
    class="card-container"
    body-class="card-body"
    :shadow="props.shadow"
    :body-style="{
      gap: `${props.gap}px`,
      flexDirection: props.flex,
      padding: `${props.padding}px`,
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
  gap?: number;
  padding?: number;
}

const props = withDefaults(defineProps<CardProps>(), {
  shadow: 'never',
  bgColor: '#f5f7fa',
  flex: 'column',
  gap: 10,
  padding: 20,
});
</script>
<script lang="ts">
export default {
  name: 'Card',
};
</script>

<style lang="scss">
.card-container {
  width: 100%;
  border: none;

  .card-body {
    display: flex;
  }
}
</style>

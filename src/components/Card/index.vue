<template>
  <el-card class="card-container">
    <slot></slot>
  </el-card>
</template>

<script setup lang="ts"></script>
<script lang="ts">
export default {
  name: 'Card',
};
</script>

<style lang="scss" scoped>
.card-container {
  width: 100%;
  box-shadow: none;
  border: none;
  background-color: #f5f7fa;
}
</style>

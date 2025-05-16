<template>
  <div>{{ title }}</div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
  },
});
</script>

<style scoped lang="scss"></style>

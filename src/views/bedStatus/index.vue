<template>
  <div>
    <h2>房态</h2>
    <div>
      <ul class="bed-list">
        <li v-for="item in bedList" :key="item.benName">{{ item.benName }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const bedList = ref([
  { benName: '卡1', status: true },
  { benName: '卡2', status: true },
  { benName: '卡3', status: true },
  { benName: '卡4', status: true },
  { benName: '卡4', status: true },
  { benName: '卡4', status: true },
  { benName: '卡4', status: true },
  { benName: '卡4', status: true },
  { benName: '卡4', status: true },
  { benName: '卡4', status: true },
  { benName: '卡4', status: true },
  { benName: '卡4', status: true },
  { benName: '卡4', status: true },
  { benName: '卡4', status: true },
  { benName: '卡4', status: true },
  { benName: '卡4', status: true },
  { benName: '卡4', status: true },
]);
</script>

<style scoped lang="scss">
.bed-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  list-style: none;

  > li {
    border: 1px solid #ccc;
    padding: 10px;
    height: 200px;
    width: 200px;
    text-align: center;
    border-radius: 5px;
    grid-column: span 1;
  }
}
</style>

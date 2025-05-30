<template>
  <div class="bed-status-container">
    <h2>房态</h2>
    <div class="bed-status-content">
      <ul class="bed-list">
        <li v-for="item in bedList" :key="item.benName">{{ item.benName }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const bedList: any = ref([]);

onMounted(() => {
  bedList.value = new Array(20).fill(0).map((item, index) => ({ benName: `卡${index}`, status: true }));
});
</script>

<style scoped lang="scss">
.bed-status-container {
  display: flex;
  flex-direction: column;

  > h2 {
    text-align: center;
    display: inline-block;
    height: $base-tabbar-height;
    line-height: $base-tabbar-height;
    background-color: aliceblue;
    margin-bottom: $main-padding;
  }

  .bed-status-content {
    height: calc(100vh - $base-tabbar-height * 2 - $main-padding * 4);
    overflow: auto;
    padding: 0 $main-padding * 2;

    .bed-list {
      display: flex;
      flex-wrap: wrap;
      gap: $main-padding;
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
  }
}
</style>

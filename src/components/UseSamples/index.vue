<template>
  <div class="container">
    <header>
      <router-link to="/samples/all">全部</router-link>
      <router-link to="/samples/messageBox">MessageBox</router-link>
      <router-link to="/samples/multipleSelect">MultipleSelect</router-link>
    </header>
    <hr />
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.container {
  position: relative;

  header {
    font-size: 18px;
    display: flex;
    gap: 30px;
    align-items: center;
    justify-content: center;
    line-height: 50px;
    position: sticky;
  }
}
</style>

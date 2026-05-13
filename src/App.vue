<template>
  <div class="app-container">
    <router-view></router-view>

    <!-- 版本更新提示 -->
    <el-dialog
      v-model="versionCheck.hasUpdate.value"
      title="系统更新"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <span>系统已发布新版本，请刷新页面以获取最新内容。</span>
      <template #footer>
        <el-button type="primary" @click="versionCheck.refresh()">立即刷新</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useVersionCheck } from '@/composables/useVersionCheck';

const versionCheck = useVersionCheck();
versionCheck.start();
</script>

<style lang="scss" scoped>
.app-container {
  min-width: 1280px;
}
</style>

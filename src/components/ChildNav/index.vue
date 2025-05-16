<template>
  <div>
    <el-tabs type="border-card" class="demo-tabs">
      <el-tab-pane v-for="item in navList" :key="item.label">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon v-if="item.icon">
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.label }}</span>
          </span>
        </template>
        <component :is="item.component" :title="item.label" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { defineProps, PropType } from 'vue';

defineProps({
  navList: {
    type: Array as PropType<NavItem[]>,
    required: true,
  },
});

interface NavItem {
  label: string;
  icon?: string;
  component: object;
}
</script>
<script lang="ts">
export default {
  name: 'ChildNav',
};
</script>

<style scoped lang="scss">
.demo-tabs {
  border: none;
  > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
  .custom-tabs-label .el-icon {
    vertical-align: middle;
  }
  .custom-tabs-label span {
    vertical-align: middle;
    margin-left: 4px;
  }
}
</style>

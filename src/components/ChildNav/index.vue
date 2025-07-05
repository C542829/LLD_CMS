<template>
  <component :is="h(ElTabs, { ...$attrs, ...props, ref: changeRef }, $slots)" type="border-card" class="demo-tabs">
    <el-tab-pane v-for="item in props.navList" :key="item.label">
      <template #label>
        <span class="custom-tabs-label">
          <el-icon v-if="item.icon">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.label }}</span>
        </span>
      </template>
      <component :is="item.component" />
    </el-tab-pane>
  </component>
</template>

<script setup lang="ts">
import { ElTabs, type TabsProps } from 'element-plus';
import { h, getCurrentInstance, withDefaults } from 'vue';

interface NavItem {
  label: string;
  icon?: string;
  component: object;
}

interface MyTabsProps extends Partial<TabsProps> {
  navList: Array<NavItem>;
}

const props = withDefaults(defineProps<MyTabsProps>(), {});

// // 获取当前组件实例，用于暴露对话框方法
const vm: any = getCurrentInstance();
function changeRef(dialogInstance: any) {
  // 将对话框实例挂载到组件实例上，便于父组件调用
  vm.exposeProxy = vm.exposed = dialogInstance || {};
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

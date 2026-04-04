<template>
  <div class="nav-tabs-container">
    <el-tabs v-bind="$attrs" type="card">
      <template v-if="$slots.default">
        <slot></slot>
      </template>
      <template v-else>
        <el-tab-pane
          v-for="item in props.tabs"
          :label="item[props.props.label]"
          :name="item[props.props.name]"
          :key="item[props.props.name]"
          style="height: 100%"
        >
          <template #label>
            <span class="label">
              <template v-if="item[props.props.icon || 'icon']">
                <SvgIcon :name="item[props.props.icon || 'icon']" class="icon" />
              </template>
              <span>{{ item[props.props.label] }}</span>
            </span>
          </template>
          <template v-if="item[props.props.content || 'content']">
            <component :is="item[props.props.content || 'content']" />
          </template>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
// 定义 Props 并继承 TabsProps
interface Props {
  // tab 列表
  tabs?: Array<TabPane>;
  // tab 列表Props属性
  props?: {
    label: string;
    name: string;
    icon?: string;
    content?: string;
    [property: string]: string | undefined;
  };
}

// props默认值
const props = withDefaults(defineProps<Props>(), {
  type: 'card',

  // 自定义属性
  tabs: () => [],
  props: () => ({ label: 'label', name: 'name', icon: 'icon' }),
});
</script>
<script lang="ts">
export default {
  name: 'NavTabs',
};
interface TabPane {
  label: string;
  name: string;
  icon?: string;
  disabled?: boolean;
  closable?: boolean;
  content?: string;
}
</script>

<style lang="scss" scoped>
.nav-tabs-container {
  position: relative;

  .label {
    display: flex;
    align-items: center;
    .icon {
      margin-right: 5px;
    }
  }

  > :deep(.el-tabs) {
    // 修改tabs默认样式
    > .el-tabs__header {
      // 改变tabs高度
      --el-tabs-header-height: 38px;
      --el-tabs-header-bg: #f5f7fa;
      // 移除tabs边框
      border: none;
      // 改变tabs背景色
      background-color: var(--el-tabs-header-bg);
      margin: 0;
      > .el-tabs__nav-wrap {
        border: none;
        margin: 0;
        height: 100%;
        > .el-tabs__nav-scroll {
          height: 100%;
        }
      }

      // 改变tabs标签样式
      > div > div > .el-tabs__nav {
        height: 100%;
        margin: 0;
        // 移除tabs标签边框
        border: none;
        // 改变tabs标签背景色
        background-color: var(--el-tabs-header-bg);

        // 改变tabs标签样式
        > .el-tabs__item {
          margin: 0;
          // 移除tabs标签边框
          border: none;
          color: var(--el-text-color-regular);
          // 改变tabs标签选中时的背景色和文字颜色
          &.is-active {
            background-color: var(--el-bg-color-overlay);
            color: var(--el-color-primary);
          }
          &:hover {
            color: var(--el-color-primary);
          }
        }
      }
    }

    > .el-tabs__content {
      padding: 0;
    }
  }
}
</style>

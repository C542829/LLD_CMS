<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider" :class="{ fold: LayOutSettingStore.fold ? true : false }">
      <Logo></Logo>
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件-->
        <el-menu
          :collapse="LayOutSettingStore.fold ? true : false"
          :default-active="$route.path"
          background-color="#001529"
          text-color="white"
        >
          <!--根据路由动态生成菜单-->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <div class="layout_right">
      <!-- 顶部导航 -->
      <div class="layout_tabbar" :class="{ fold: LayOutSettingStore.fold ? true : false }">
        <!-- layout组件的顶部导航tabbar -->
        <Tabbar></Tabbar>
      </div>
      <!-- 内容展示区域 -->
      <div class="layout_main" :class="{ fold: LayOutSettingStore.fold ? true : false }">
        <Main></Main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//获取路由对象
import { useRoute } from 'vue-router';
//引入左侧菜单logo子组件
import Logo from './logo/index.vue';
//引入菜单组件
import Menu from './menu/index.vue';
//右侧内容展示区域
import Main from './main/index.vue';
//引入顶部tabbar组件
import Tabbar from './tabbar/index.vue';

//获取用户相关的小仓库
import useUserStore from '@/store/modules/user';
import useLayOutSettingStore from '@/store/modules/setting';
let userStore = useUserStore();
//获取layout配置仓库

let LayOutSettingStore = useLayOutSettingStore();

//获取路由对象
let $route = useRoute();
</script>

<script lang="ts">
export default {
  name: 'Layout',
};
</script>
<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  display: flex;

  // 左侧菜单
  .layout_slider {
    color: white;
    display: inline-block;
    height: 100vh;
    width: $base-menu-width;
    background: $base-menu-bg;
    transition: all 0.3s;
    z-index: 100;
    &.fold {
      width: $base-menu-min-width;
    }
    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);

      .el-menu {
        height: calc(100vh - $base-menu-logo-height);
        border-right: none;
      }
    }
  }

  // 右侧主题内容
  .layout_right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    // 顶部header
    .layout_tabbar {
      width: calc(100vw - $base-menu-width);
      height: $base-tabbar-height;
      transition: all 0.3s;
      &.fold {
        width: calc(100vw - $base-menu-min-width);
      }
    }

    // 主体内容
    .layout_main {
      width: calc(100vw - $base-menu-width);
      height: calc(100vh - $base-tabbar-height);
      padding: $main-padding;
      transition: all 0.3s;
      z-index: 1;

      &.fold {
        width: calc(100vw - $base-menu-min-width);
      }
    }
  }
}
</style>

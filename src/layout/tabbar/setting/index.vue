<template>
  <el-button size="small" icon="Refresh" circle @click="updateRefresh"></el-button>
  <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>

  <!-- 主题设置弹出框 - 添加了reference插槽以修复ElOnlyChild警告 -->
  <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
    <!-- 表单元素 -->
    <el-form>
      <el-form-item label="主题颜色" for="theme-color">
        <el-color-picker
          id="theme-color"
          @change="setColor"
          v-model="color"
          size="small"
          show-alpha
          :predefine="predefineColors"
        />
      </el-form-item>
      <el-form-item label="暗黑模式" for="dark-mode">
        <el-switch
          id="dark-mode"
          @change="changeDark"
          v-model="dark"
          class="mt-2"
          style="margin-left: 24px"
          inline-prompt
          active-icon="MoonNight"
          inactive-icon="Sunny"
        />
      </el-form-item>
    </el-form>
    <!-- 添加reference插槽以修复警告 -->
    <template #reference>
      <!-- 使用一个透明的小元素作为触发器，保持功能暂时移除但修复警告 -->
      <div style="width: 0; height: 0; overflow: hidden"></div>
    </template>
  </el-popover>
  <img :src="userStore.avatar" style="width: 24px; height: 24px; margin: 0px 10px; border-radius: 50%" />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link hover-pointer">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
//获取用户相关的小仓库
import useUserStore from '@/store/modules/acl/user';
//获取骨架的小仓库
import useLayOutSettingStore from '@/store/modules/acl/setting';
let layoutSettingStore = useLayOutSettingStore();
let userStore = useUserStore();
//获取路由器对象
let $router = useRouter();
//获取路由对象
let $route = useRoute();

//收集开关的数据
let dark = ref<boolean>(false);

//刷新按钮点击回调
const updateRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh;
};

//全屏按钮点击的回调
const fullScreen = () => {
  let full = document.fullscreenElement;
  //切换为全屏模式
  if (!full) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

//退出登录点击回调
const logout = async () => {
  await userStore.userLogout();
  //跳转到登录页面
  $router.push({ path: '/login', query: { redirect: $route.path } });
};

//颜色组件组件的数据
const color = ref('rgba(255, 69, 0, 0.68)');
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
]);

//switch开关的chang事件进行暗黑模式的切换
const changeDark = () => {
  //获取HTML根节点
  let html = document.documentElement;
  //判断HTML标签是否有类名dark
  dark.value ? (html.className = 'dark') : (html.className = '');
};

//主题颜色的设置
const setColor = () => {
  //通知js修改根节点的样式对象的属性与属性值
  const html = document.documentElement;
  html.style.setProperty('--el-color-primary', color.value);
};
</script>

<script lang="ts">
export default {
  name: 'Setting',
};
</script>
<style scoped lang="scss"></style>

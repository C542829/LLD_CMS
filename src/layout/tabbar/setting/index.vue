<template>
  <el-text type="info" style="margin-right: 12px">{{ getOrgName }}</el-text>
  <el-tooltip effect="light" content="刷新" placement="bottom">
    <el-button size="small" icon="Refresh" circle @click="updateRefresh"></el-button>
  </el-tooltip>
  <el-tooltip effect="light" content="全屏" placement="bottom">
    <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
  </el-tooltip>
  <img :src="userStore.avatar" style="width: 24px; height: 24px; margin: 0px 10px; border-radius: 50%" />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link hover-pointer">
      {{ userStore.nickname }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <!-- <el-dropdown-item @click="printDesign">打印设计</el-dropdown-item> -->
        <!-- <el-dropdown-item @click="printSetup">打印维护</el-dropdown-item> -->
        <!-- <el-dropdown-item @click="changeInfo">修改资料</el-dropdown-item> -->
        <el-dropdown-item @click="visible = true">修改密码</el-dropdown-item>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <el-dialog v-model="visible" title="修改密码" @close="visible = false" width="350">
    <PwdForm @close="visible = false" />
  </el-dialog>
</template>

<script setup lang="ts">
import PwdForm from './PwdForm.vue';
// import UserDrawerForm from '@/views/acl/user/components/DrawerForm.vue';
import { computed, ref } from 'vue';
// import { printer } from '@/utils/lodop';
import { useRouter, useRoute } from 'vue-router';
// 获取用户相关的小仓库
import useUserStore from '@/store/modules/acl/user';
// 获取骨架的小仓库
import { useSettingStore } from '@/store/modules/acl/setting';
let settingStore = useSettingStore();
let userStore = useUserStore();
// 获取路由器对象
let $router = useRouter();
// 获取路由对象
let $route = useRoute();

const visible = ref(false);

// 刷新按钮点击回调
const updateRefresh = () => {
  window.location.reload();
  // settingStore.refresh = !settingStore.refresh;
};

// 全屏按钮点击的回调
const fullScreen = () => {
  let full = document.fullscreenElement;
  // 切换为全屏模式
  if (!full) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

// 退出登录点击回调
const logout = async () => {
  await userStore.userLogout();
  //跳转到登录页面
  // $router.push({ path: '/login', query: { redirect: $route.path } });
};

const getOrgName = computed(() => {
  if (userStore.user.orgs) {
    const org = userStore.user.orgs.find((item) => item.id === userStore.user.orgId);
    return org?.orgName || '';
  }
  return '';
});

// 修改资料点击回调
const changeInfo = () => {
  // $router.push({ path: '/user/info' });
};

/** 打开打印设计窗口 */
// const printDesign = () => {
//   printer.printDesign();
// };
/** 打开打印维护窗口 */
// const printSetup = () => {
//   printer.printSetup();
// };
</script>

<script lang="ts">
export default {
  name: 'Setting',
};
</script>
<style scoped lang="scss">
// .text
</style>

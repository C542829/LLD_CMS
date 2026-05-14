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
      {{ userStore?.user?.userName }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <!-- <el-dropdown-item @click="printDesign">打印设计</el-dropdown-item> -->
        <!-- <el-dropdown-item @click="printSetup">打印维护</el-dropdown-item> -->
        <el-dropdown-item @click="changeInfo">修改资料</el-dropdown-item>
        <el-dropdown-item @click="visible = true">修改密码</el-dropdown-item>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <ChangePasswordDialog v-model="visible" />
  <UserDrawerForm v-model="infoVisible" :data="userStore.user" @refresh="handleInfoRefresh" />
</template>

<script setup lang="ts">
import ChangePasswordDialog from './ChangePasswordDialog.vue';
import UserDrawerForm from './ChangeUserInfo.vue';
import { computed, ref, onMounted } from 'vue';
import { reqLogout } from '@/api/user/index';
import useUserStore from '@/store/modules/acl/user';

const userStore = useUserStore();

const visible = ref(false);
const infoVisible = ref(false);

onMounted(async () => {});

/** 刷新按钮点击回调 */
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
  await reqLogout({ username: userStore.user?.userCode });
  userStore.logout();
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
  infoVisible.value = true;
};

// 修改资料刷新回调
const handleInfoRefresh = () => {
  userStore.loadUserInfo(userStore.userId);
};
</script>

<script lang="ts">
export default {
  name: 'Setting',
};
</script>
<style scoped lang="scss">
// .text
</style>

<template>
  <div class="logo">
    <!-- 设置logo -->
    <img :src="setting.logo" alt="" />
    <p v-show="!layOutSettingStore.fold">{{ logoTitle }}</p>
  </div>
</template>

<script setup lang="ts">
//引入设置标题与logo这配置文件
import setting from '@/setting';
import useLayOutSettingStore from '@/store/modules/acl/setting';
import { watch, ref } from 'vue';
let layOutSettingStore = useLayOutSettingStore();
const logoTitle = ref(setting.title);
watch(
  () => layOutSettingStore.fold,
  (newVal, oldVal) => {
    if (newVal) {
      logoTitle.value = '';
    } else {
      let timer: any = setTimeout(() => {
        logoTitle.value = setting.title;
        timer && (timer = null);
      }, 300);
    }
  },
);
</script>
<script lang="ts">
export default {
  name: 'Logo',
};
</script>
<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px;
  img {
    width: 35px;
    height: 35px;
  }
  p {
    font-size: $base-logo-title-fontSize;
    margin-left: 10px;
  }
}

.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.3s;
}

.fade-enter-to {
  opacity: 1;
}
</style>

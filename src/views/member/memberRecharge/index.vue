<template>
  <ChildNav :navList="navList" />
</template>

<script setup lang="ts">
import ChildNav from '@/components/ChildNav/index.vue';
import Recharge from './recharge/index.vue';
import RechargeRecord from './rechargeRecord/index.vue';
import RechargeActivity from './rechargeActivity/index.vue';
import { ref, markRaw, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { reqVipInfo } from '@/api/member/member/index';
import { useRechargeStore } from '@/store/modules/member/recharge';
import useUserStore from '@/store/modules/acl/user';
import { useSettingStore } from '@/store/modules/acl/setting';

const settingStore = useSettingStore();
const rechargeStore = useRechargeStore();

const route = useRoute();
const vipId = route.query.vipId;

const initVipInfo = async () => {
  if (vipId) {
    localStorage.setItem('activeTab', '会员充值');
    try {
      settingStore.loading = true;
      const { data } = await reqVipInfo(vipId as string);
      rechargeStore.member = data;
    } catch (error) {
    } finally {
      settingStore.loading = false;
    }
  }
};
initVipInfo();

const originalNavList = ref([
  { label: '会员充值', icon: '', component: markRaw(Recharge) },
  { label: '充值记录', icon: '', component: markRaw(RechargeRecord) },
  { label: '充值活动', icon: '', component: markRaw(RechargeActivity) },
]);

const navList: any = ref([]);

const userStore = useUserStore();
for (const item of originalNavList.value) {
  if (userStore.tabs.includes(item.label)) {
    navList.value.push(item);
  }
}
</script>
<style scoped lang="scss"></style>

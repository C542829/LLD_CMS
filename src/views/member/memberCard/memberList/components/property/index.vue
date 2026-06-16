<template>
  <div class="detail-container">
    <div class="top-content">
      <span>时间段：</span>
      <IDatePicker v-model="query.date" :default="false" class="w-240 mr-3" @change="search" @clear="search" />
      <el-button type="primary" @click="search">查询</el-button>
      <el-button type="primary" plain @click="handleQueryMgj">查询美管家记录</el-button>
      <el-button type="primary" plain @click="handleQueryYB">查询杨波记录</el-button>
    </div>
    <div class="main-content">
      <NavTabs v-model="activeTab" :tabs="tabs"></NavTabs>
      <div class="content">
        <template v-if="activeTab === tabs[0]?.name">
          <Property ref="propertyRef" :params="query"></Property>
        </template>
        <template v-else-if="activeTab === tabs[1]?.name">
          <ConsumptionRecord ref="consumptionRecordRef" :params="query"></ConsumptionRecord>
        </template>
        <template v-else-if="activeTab === tabs[2]?.name">
          <RechargeRecord ref="rechargeRecordRef" :params="query"></RechargeRecord>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavTabs from '@/components/Tab/NavTabs.vue';
import Property from './Property.vue';
import ConsumptionRecord from './ConsumptionRecord.vue';
import RechargeRecord from './RechargeRecord.vue';
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useMemberStore } from '@/store/modules/member/member';

const router = useRouter();

// 获取会员信息
const memberStore = useMemberStore();
// 当前激活 Tab 名称
const activeTab = ref('Property');
// tab 列表
const tabs = ref([
  { label: '可用资产', name: 'Property', icon: '' },
  { label: '消费记录', name: 'ConsumptionRecord', icon: '' },
  { label: '充值记录', name: 'RechargeRecord', icon: '' },
]);

const query = reactive({
  date: [],
  member: { cardNumber: '' },
});

onMounted(() => {
  query.member = memberStore.formData;
});

const propertyRef = ref();
const consumptionRecordRef = ref();
const rechargeRecordRef = ref();
const search = () => {
  if (activeTab.value === 'Property') {
    propertyRef.value.getData();
  } else if (activeTab.value === 'ConsumptionRecord') {
    consumptionRecordRef.value.getData();
  } else if (activeTab.value === 'RechargeRecord') {
    rechargeRecordRef.value.getData();
  }
};

/**
 * 查询美管家记录
 */
const handleQueryMgj = () => {
  // 解析路由
  const routeUrl = router.resolve({
    path: '/dataGroup/MGJSaleData',
    query: { memberId: query.member?.cardNumber },
  });
  // 打开新标签
  window.open(routeUrl.href, '_blank');
};

/**
 * 查询杨波记录
 */
const handleQueryYB = () => {
  // 解析路由
  const routeUrl = router.resolve({
    path: '/dataGroup/YBSaleData',
    query: { memberId: query.member?.cardNumber },
  });
  // 打开新标签
  window.open(routeUrl.href, '_blank');
};
</script>

<style scoped lang="scss">
.detail-container {
  height: 100%;

  > .top-content {
    // margin: 10px;
    width: 100%;
    margin-bottom: 12px;
  }
  > .main-content {
    height: calc(100% - 44px);
    // height: 100%;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);

    > .content {
      height: calc(100% - 38px);
      padding: 12px;
    }
  }
}
</style>

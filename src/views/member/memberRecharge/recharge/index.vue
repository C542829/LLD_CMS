<template>
  <div class="container">
    <!-- 会员基本信息 -->
    <Card shadow="always" bgColor="#fff" wrap="nowrap" style="width: 350px">
      <!-- 会员卡 -->
      <div class="member-card">
        <div v-if="!!store.member.id" class="member-card-main">
          <div>
            <h1>会员：{{ store.member.name }}</h1>
            <el-button
              @click="store.reset"
              size="small"
              plain
              style="background-color: transparent; color: var(--el-color-primary-light-5)"
            >
              重选会员
            </el-button>
          </div>
          <p>电话：{{ store.member.phoneNumber }}</p>
          <el-tooltip
            :content="store.member.cardNumber ? `卡号：${store.member.cardNumber}(${store.member.identity})` : '无卡号'"
            placement="bottom"
            effect="light"
          >
            <p style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
              卡号：{{ store.member.cardNumber }}({{ store.member.identity }})
            </p>
          </el-tooltip>
          <p>门店余额：{{ store.member.balance }} 元</p>
        </div>
        <div v-else class="member-card-empty">未选择会员</div>
      </div>

      <!-- 设置按钮 -->
      <div style="padding: 0 5px">
        <el-button type="default" plain style="width: 100%">设置门店默认充值价格和折扣率</el-button>
      </div>

      <!-- 充值表单 -->
      <div style="flex: 1">
        <RechargeForm />
      </div>
    </Card>

    <!-- 右侧 -->
    <Card bgColor="#fff" shadow="always">
      <!-- 搜索 -->
      <div v-if="!store.member.id" v-loading="settingStore.loading" class="search-container">
        <el-form class="search-form">
          <div>
            <el-input
              v-model="inputValue"
              @keydown.enter="search"
              :prefix-icon="Search"
              placeholder="姓名 | 手机号 | 会员卡号"
              size="large"
              clearable
            >
              <template #append>
                <el-button type="primary" size="large" @click="search">搜索会员</el-button>
              </template>
            </el-input>
          </div>

          <div>
            <img src="@/assets/images/scan.png" />
          </div>
        </el-form>
      </div>

      <!-- 充值 -->
      <div v-else class="recharge-container">
        <el-form class="recharge-form">
          <!-- 充值金额输入框 -->
          <div class="recharge-input">
            <el-input-number
              v-model="store.rechargeFormData.amount"
              size="large"
              :controls="false"
              style="width: 100%; transform: scale(1.3)"
            >
              <template #prefix><b>￥</b></template>
              <template #suffix><b>元</b></template>
            </el-input-number>
          </div>

          <!-- 充值活动列表 -->
          <div v-loading="settingStore.loading" class="activity-list">
            <h1>可选充值活动</h1>
            <div>
              <ActivityCard
                v-for="item in activityList"
                :key="item.id"
                :id="item.id"
                :title="item.title"
                :subtitle="item.subtitle"
                :status="item.status"
                :end-date="item['end-date']"
                @click="handleCardClick"
              />
              <div v-if="activityList.length === 0" style="padding: 30px 0; color: var(--el-color-info)">
                充值活动加载中...
              </div>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div>
            <el-button @click="store.reset" round plain size="large" style="width: 200px">重选会员</el-button>
            <el-button @click="store.recharge" type="primary" round size="large" style="width: 200px">充值</el-button>
          </div>
        </el-form>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref, watch, onMounted } from 'vue';

import RechargeForm from './form.vue';
import ActivityCard from './ActivityCard.vue';

import { useSettingStore } from '@/store/modules/acl/setting';
import { useRechargeActivityStore } from '@/store/modules/member/rechargeActivity';
import { useRechargeStore } from '@/store/modules/member/recharge';
const settingStore = useSettingStore();
const rechargeActivityStore = useRechargeActivityStore();
const store = useRechargeStore();

onMounted(() => {});
// 搜索
const inputValue = ref('');
const search = async () => {
  // store.setMember(inputValue.value);
  // await store.setMember(1);
  // await store.setActivityList();
};

const activityList = ref<any>([]);
const getActivityList = async () => {
  settingStore.loading = true;
  // activityList.value = await rechargeActivityStore.getActiveList({});
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
  activityList.value = [
    { id: 1, title: '1380两个月半价1', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
    { id: 2, title: '1380两个月半价2', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
    { id: 3, title: '1380两个月半价3', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
    { id: 4, title: '1380两个月半价4', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
    { id: 5, title: '1380两个月半价5', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
    { id: 6, title: '1380两个月半价6', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
    { id: 7, title: '1380两个月半价6', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
    { id: 8, title: '1380两个月半价6', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
    { id: 9, title: '1380两个月半价6', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
    { id: 10, title: '1380两个月半价6', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
    { id: 11, title: '1380两个月半价6', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
    { id: 12, title: '1380两个月半价6', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
  ];
  settingStore.loading = false;
};
getActivityList();

const handleCardClick = (data: any) => {
  store.rechargeActivity = selectActivity(data);
};

// 选择活动
const selectActivity = (data: any) => {
  let result = {};
  for (const item of activityList.value) {
    if (item.id === data.id && item.status === 'selected') {
      item.status = 'active';
      return {};
    }
    if (item.status === 'selected') {
      item.status = 'active';
    }
  }
  for (const item of activityList.value) {
    if (item.id === data.id) {
      item.status = 'selected';
      result = item;
    }
  }
  return result;
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  display: flex;
  gap: $main-padding;

  > div:last-child {
    flex: 1;
  }
}

// 会员卡
.member-card {
  height: 160px;
  width: 320px;
  border-radius: 8px;
  color: #eee;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 0 10px #d4b2eb;
  background: linear-gradient(to right top, rgb(144, 108, 156), rgb(138, 140, 247));

  .member-card-main {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    flex-direction: column;
    gap: 3px;

    > div:first-child {
      height: 30px;
      line-height: 30px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      > h1 {
        flex: 1;
      }
    }

    > p {
      height: 30px;
      line-height: 30px;
    }
  }

  .member-card-empty {
    font-size: 18px;
  }
}

// 搜索菜单
.search-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .search-form {
    width: 60%;
    height: 60%;
    > div:first-child {
      width: 60%;
      min-width: 300px;
      max-width: 500px;
      margin: 0 auto;
      transform: scale(1.5);
    }

    > div:last-child {
      width: 50%;
      margin: 50px auto 0 auto;
      > img {
        width: 100%;
      }
    }
  }
}

.recharge-container {
  width: 100%;
  height: 100%;

  .recharge-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    height: 100%;

    // 输入框
    .recharge-input {
      margin-top: 30px;
      width: 30%;
      min-width: 300px;
      max-width: 400px;
      b {
        font-weight: bold;
      }
    }

    // 充值活动列表
    .activity-list {
      width: 80%;
      max-width: 800px;
      height: 80%;

      > h1 {
        height: 40px;
        line-height: 40px;
        margin-bottom: 20px;
        color: gray;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
      }
      > div {
        width: 100%;
        height: calc(100% - 60px);
        display: flex;
        overflow: auto;
        flex-wrap: wrap;
        gap: 15px;
        padding: 5px 0;
        justify-content: space-around;
      }
    }
  }
}

:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

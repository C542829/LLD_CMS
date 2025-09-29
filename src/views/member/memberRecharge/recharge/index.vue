<template>
  <div class="recharge-container" v-loading="settingStore.loading">
    <!-- 会员基本信息 -->
    <div class="left-content">
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
            <p class="text-overflow">卡号：{{ store.member.cardNumber }}({{ store.member.identity }})</p>
          </el-tooltip>
          <p>门店余额：{{ store.member.balance }} 元</p>
        </div>
        <div v-else class="member-card-empty">未选择会员</div>
      </div>

      <!-- 设置按钮 -->
      <div class="left-item">
        <el-button type="default" plain style="width: 100%">设置门店默认充值价格和折扣率</el-button>
      </div>

      <!-- 充值表单 -->
      <div class="left-item">
        <RechargeForm />
      </div>
    </div>

    <!-- 右侧 -->
    <div class="right-content">
      <!-- 搜索 -->
      <div v-if="!store.member.id" class="search-container">
        <el-form class="search-form">
          <div>
            <el-autocomplete
              v-model="inputValue"
              @select="handleSelect"
              :fetch-suggestions="querySearchAsync"
              :prefix-icon="Search"
              placeholder="姓名 | 手机号 | 会员卡号"
              size="large"
              value-key="name"
              clearable
            >
              <template #default="{ item }">
                <div class="mem-info-card">
                  <p>
                    <span>姓名：</span>
                    <span>{{ item.name }}</span>
                  </p>
                  <p>
                    <span>电话：</span>
                    <span>{{ item.phoneNumber }}</span>
                  </p>
                  <p>
                    <span>卡号：</span>
                    <span>{{ item.cardNumber }}</span>
                  </p>
                </div>
              </template>
              <template #append>
                <el-button type="primary" size="large" @click="">搜索会员</el-button>
              </template>
            </el-autocomplete>
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
            <el-input-number v-model="store.rechargeFormData.rechargeValue" size="large" :controls="false">
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
                :title="item.activeName"
                :subtitle="item.remark"
                :status="item.status"
                :end-date="item.activeFinalTime"
                @click="handleCardClick"
              />
              <div v-if="activityList.length === 0" class="activity-empty">
                <span>暂无活动...</span>
                <el-button type="primary" size="small" link @click="getActivityList">点击刷新</el-button>
              </div>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="submit-btn">
            <el-button @click="store.reset" round plain size="large" style="width: 200px">重选会员</el-button>
            <el-button @click="store.recharge" type="primary" round size="large" style="width: 200px">充值</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref, watch, onMounted } from 'vue';

import RechargeForm from './form.vue';
import ActivityCard from './ActivityCard.vue';

import { useSettingStore } from '@/store/modules/acl/setting';
import { useDynamicDataStore } from '@/store/modules/enums/dynamicData';
import { useMemberStore } from '@/store/modules/member/member';
import { useRechargeStore } from '@/store/modules/member/recharge';
import { useRechargeCommissionRulesStore } from '@/store/modules/setGroup/rechargeCommissionRules';
const settingStore = useSettingStore();
const dynamicDataStore = useDynamicDataStore();
const memberStore = useMemberStore();
const rcRulesStore = useRechargeCommissionRulesStore();
const store = useRechargeStore();

onMounted(async () => {
  await getActivityList();
  store.rcRule = await rcRulesStore.getDefaultRCRule();
});

// 活动列表
const activityList = ref<any>([]);
const getActivityList = async () => {
  settingStore.loading = true;
  const res = await dynamicDataStore.getActiveList();
  activityList.value =
    res.data.map((item: any) => {
      item.status = 'active';
      return item;
    }) || [];
  settingStore.loading = false;
};

// 搜索会员
const inputValue = ref('');
// 搜索联想会员列表
const querySearchAsync = async (queryString: string, cb: (arg: any) => void) => {
  if (!queryString) {
    cb([]);
    return;
  }
  const results = await memberStore.getAssociateList(queryString, 50);
  // if (results.length === 1) {
  //   store.member = { ...results[0] };
  // }
  cb(results);
};

// 选中会员
const handleSelect = (item: Record<string, any>) => {
  inputValue.value = '';
  store.member = { ...item };
};

const handleCardClick = (data: any) => {
  store.rechargeActivity = selectActivity(data);
  console.log(data.activeCapital);

  store.rechargeFormData.rechargeValue = store.rechargeActivity.activeCapital;
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
.recharge-container {
  height: 100%;
  display: flex;
  gap: $main-padding;

  > div {
    height: 100%;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  // 左侧
  .left-content {
    width: 350px;
    padding: 15px;
    .left-item {
      margin-top: 15px;
    }
    .left-item:last-child {
      height: calc(100% - 222px);
    }
  }

  .right-content {
    flex: 1;
    padding: 15px;

    > div {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    // 搜索菜单
    .search-container {
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
      .recharge-form {
        width: 100%;
        height: 100%;
        // display: flex;
        // flex-direction: column;
        // justify-content: center;
        // align-items: center;
        // gap: 20px;
        // border: 1px solid #ccc;
        > div {
          width: 100%;
        }
        // 输入框
        .recharge-input {
          padding: 15px;
          display: flex;
          justify-content: center;
          .el-input-number {
            width: 350px;
            height: 50px;
            b {
              font-size: 18px;
              font-weight: bold;
            }
          }
        }

        // 充值活动列表
        .activity-list {
          height: calc(100% - 120px);
          padding-bottom: 15px;
          > h1 {
            height: 40px;
            line-height: 40px;
            margin-bottom: 10px;
            color: gray;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
          }
          > div {
            width: 800px;
            height: calc(100% - 50px);
            margin: 0 auto;
            padding: 5px 0;
            overflow: auto;
            display: grid;
            gap: 30px 15px;
            // 自动适配列数，最小宽度 220px，剩余空间平分
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            // 子项垂直方向“顶对齐”，保持自身高度
            align-items: start;
            // 让行高根据内容最小需求来，这样能更贴合内容高度
            grid-auto-rows: min-content;
          }
          .activity-empty {
            text-align: center;
            color: var(--el-text-color-secondary);
          }
        }

        .submit-btn {
          display: flex;
          justify-content: center;
        }
      }
    }
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

// 搜索提示会员信息
.mem-info-card {
  line-height: 20px;
  margin: 10px;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

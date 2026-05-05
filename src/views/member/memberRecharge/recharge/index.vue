<template>
  <div class="recharge-container" v-loading="settingStore.loading" :element-loading-text="LOADING_MSG">
    <!-- 会员基本信息 -->
    <div class="left-content">
      <!-- 会员卡 -->
      <MemberCard :member="store.member || {}" :showInfoBtn="true" :show-remark="true" @reset="store.reset" />

      <!-- 设置按钮 -->
      <div class="left-item">
        <el-button type="default" plain @click="openRCDialog" style="width: 100%">
          设置门店默认充值价格和折扣率
        </el-button>
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
              placement="bottom"
              clearable
            >
              <template #default="{ item }">
                <div class="mem-info-card">
                  <p class="row text-overflow" :title="`姓名：${item.name}`">
                    <span>姓名：</span>
                    <span>{{ item.name }}</span>
                  </p>
                  <p class="row text-overflow" :title="`电话：${item.phoneNumber}`">
                    <span>电话：</span>
                    <span>{{ item.phoneNumber }}</span>
                  </p>
                  <p class="row text-overflow" :title="`卡号：${item.cardNumber}`">
                    <span>卡号：</span>
                    <span>{{ item.cardNumber }}</span>
                  </p>
                  <p class="row text-overflow" :title="`备注：${item.remark}`">
                    <span>备注：</span>
                    <span>{{ item.remark }}</span>
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
            <el-input-number
              v-model="store.rechargeFormData.rechargeValue"
              size="large"
              :controls="false"
              @change="handleRechargeValueChange"
            >
              <template #prefix><b>￥</b></template>
              <template #suffix><b>元</b></template>
            </el-input-number>
            <div v-show="store.rechargeFormData.rechargeValue < store.rechargeActivity.activeCapital" class="rech-tips">
              温馨提醒：充值值金额不满足所选 "活动" 条件
            </div>
          </div>

          <!-- 充值活动列表 -->
          <div v-loading="activityLoading" :element-loading-text="LOADING_MSG" class="activity-list">
            <h1>
              可选充值活动
              <el-button type="primary" size="small" link @click="getActivities">刷新</el-button>
            </h1>
            <div class="activity-list-content">
              <template v-if="activityList.length === 0">
                <Empty></Empty>
              </template>
              <template v-else>
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
              </template>
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
  <RCModify v-model:visible="RCDialog.visible"></RCModify>
</template>

<script setup lang="ts">
import MemberCard from '@/components/Card/MemberCard.vue';
import RechargeForm from './form.vue';
import RCModify from './RCModify.vue';
import ActivityCard from './ActivityCard.vue';
import { Search } from '@element-plus/icons-vue';
import { ref, watch, onMounted, reactive } from 'vue';
import { reqDefaultCommissionRule } from '@/api/setGroup/rechargeCommissionRules/index';
import { getActivityList } from '@/api/member/rechargeActivity/index';
import { LOADING_MSG } from '@/utils/constants';
import { useSettingStore } from '@/store/modules/acl/setting';
import { useMemberStore } from '@/store/modules/member/member';
import { useRechargeStore } from '@/store/modules/member/recharge';

const settingStore = useSettingStore();
const memberStore = useMemberStore();
const store = useRechargeStore();

onMounted(async () => {
  getActivities();
  getDefaultRCRule();
});

/** 获取默认充值佣金规则 */
const getDefaultRCRule = async () => {
  try {
    const res: any = await reqDefaultCommissionRule();
    store.rcRule = res.data;
  } catch (error) {
    console.error('获取默认充值佣金规则', error);
  }
};

const activityLoading = ref(false);
// 活动列表
const activityList = ref<any>([]);
const getActivities = async () => {
  activityLoading.value = true;
  try {
    const data = await getActivityList();
    activityList.value =
      data.map((item: any) => {
        item.status = 'active';
        return item;
      }) || [];
  } catch (error) {
  } finally {
    activityLoading.value = false;
  }
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
  cb(results);
};

// 选中会员
const handleSelect = (item: Record<string, any>) => {
  inputValue.value = '';
  store.member = { ...item };
};

const handleCardClick = (data: any) => {
  store.rechargeActivity = selectActivity(data);
  store.rechargeFormData.rechargeValue = store.rechargeActivity.activeCapital;
};

/**
 * 充值金额变化
 * @param cur 当前值
 * @param prev 上一次值
 */
const handleRechargeValueChange = (cur: number | undefined, prev: number | undefined) => {
  // 如果当前值小于活动金额，则设置为活动金额
  if (store.rechargeActivity) {
    if (cur && cur < store.rechargeActivity.activeCapital) {
      store.rechargeFormData.rechargeValue = store.rechargeActivity.activeCapital;
    }
  }
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

// #region 设置门店默认充值价格和折扣率
const RCDialog = reactive({
  visible: false,
});
const openRCDialog = () => {
  RCDialog.visible = true;
};
// #endregion 设置门店默认充值价格和折扣率
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
      height: calc(100% - 242px);
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
          align-items: center;
          flex-direction: column;
          .el-input-number {
            width: 350px;
            height: 50px;
            b {
              font-size: 18px;
              font-weight: bold;
            }
          }

          .rech-tips {
            margin-top: 10px;
            font-size: 14px;
            font-weight: 700;
            color: #dd98b5;
          }
        }

        // 充值活动列表
        .activity-list {
          height: calc(100% - 140px);
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
          .activity-list-content {
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

// 搜索提示会员信息
.mem-info-card {
  margin: 10px auto;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--el-border-color);
  width: 240px;
  .row {
    height: 18px;
    line-height: 18px;
  }
  .phone {
    color: var(--el-color-primary);
    font-weight: 500;
  }
}

:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

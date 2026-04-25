<template>
  <Dialog v-model="dialogVisible" title="充值单据详情" width="600px" @closed="handleClose">
    <div class="recharge-detail" v-loading="loading" :element-loading-text="LOADING_MSG">
      <!-- 基本信息区域 -->
      <div class="info-section">
        <div class="section-title">基本信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">充值单号：</span>
            <span class="value">{{ detailData.historyCode || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">充值状态：</span>
            <span class="value">
              <el-tag :type="detailData.rechargeStatus === RechargeStatus.SUCCESS ? 'success' : 'danger'" size="small">
                {{ RechargeStatusMap[detailData.rechargeStatus as RechargeStatus] || '-' }}
              </el-tag>
            </span>
          </div>
          <div class="info-item">
            <span class="label">充值时间：</span>
            <span class="value">{{ detailData.rechargeTime || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">充值类型：</span>
            <span class="value">{{ RechargeTypeMap[detailData.rechargeType as RechargeType] || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">销售门店：</span>
            <span class="value">{{ detailData.orgName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">操作员：</span>
            <span class="value">{{ detailData.userName || '-' }}</span>
          </div>
        </div>
      </div>

      <!-- 会员信息区域 -->
      <div class="info-section">
        <div class="section-title">会员信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">会员姓名：</span>
            <span class="value">{{ detailData.vipName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">会员卡号：</span>
            <span class="value">{{ detailData.vipCardNumber || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">手机号码：</span>
            <span class="value">{{ detailData.vipPhoneNumber || '-' }}</span>
          </div>
        </div>
      </div>

      <!-- 充值金额区域 -->
      <div class="info-section">
        <div class="section-title">充值金额</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">充值金额：</span>
            <span class="value highlight">￥{{ detailData.rechargeValue ?? 0 }}</span>
          </div>
          <div class="info-item">
            <span class="label">本金资产编号：</span>
            <span class="value">
              <el-tag size="small">{{ detailData.assetCode || '-' }}</el-tag>
            </span>
          </div>
          <template v-if="detailData.presentValue">
            <div class="info-item">
              <span class="label">赠送金额：</span>
              <span class="value highlight">￥{{ detailData.presentValue }}</span>
            </div>
            <div class="info-item">
              <span class="label">赠送资产编号：</span>
              <span class="value">
                <el-tag size="small" type="warning">{{ detailData.presentAssetCode || '-' }}</el-tag>
              </span>
            </div>
          </template>
          <div class="info-item" v-if="detailData.activeName">
            <span class="label">充值活动：</span>
            <span class="value">
              <el-tag size="small" type="success">{{ detailData.activeName }}</el-tag>
            </span>
          </div>
          <div class="info-item" v-if="detailData.ticketInfo">
            <span class="label">赠券信息：</span>
            <span class="value">{{ detailData.ticketInfo }}</span>
          </div>
        </div>
      </div>

      <!-- 支付信息区域 -->
      <div class="info-section" v-if="detailData.paymentInfoList?.length">
        <div class="section-title">支付信息</div>
        <el-table :data="detailData.paymentInfoList" size="small" border>
          <el-table-column prop="paymentName" label="支付方式" min-width="100" />
          <el-table-column prop="paymentAmount" label="支付金额" min-width="80">
            <template #default="{ row }">
              <span class="highlight">￥{{ row.paymentAmount }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="assetCode" label="资产编号" min-width="80">
            <template #default="{ row }">
              <el-tag size="small" v-if="row.assetCode">{{ row.assetCode }}</el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 业绩信息区域 -->
      <div class="info-section" v-if="detailData.userKpiList?.length">
        <div class="section-title">业绩信息</div>
        <el-table :data="detailData.userKpiList" size="small" border>
          <el-table-column prop="userName" label="技师姓名" min-width="100" />
          <el-table-column prop="kpi" label="业绩金额" min-width="80">
            <template #default="{ row }">
              <span class="highlight">￥{{ row.kpi }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 备注区域 -->
      <div class="info-section" v-if="detailData.remark">
        <div class="section-title">备注</div>
        <div class="remark-content">{{ detailData.remark }}</div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <!-- <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template> -->
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { LOADING_MSG } from '@/utils/constants';
import { RechargeStatus, RechargeStatusMap, RechargeType, RechargeTypeMap } from '@/enums';
import type { RechargeHistoryVO } from '@/api/member/recharge/types';

// #region 父子组件交互
interface Props {
  /** 控制对话框显示/隐藏 */
  modelValue: boolean;
  /** 充值记录数据 */
  data?: RechargeHistoryVO;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const dialogVisible = ref(false);

watch(
  () => props.modelValue,
  (val: boolean) => {
    dialogVisible.value = val;
  },
);

watch(dialogVisible, (val: boolean) => {
  emit('update:modelValue', val);
});

/** 对话框关闭回调 */
const handleClose = () => {
  dialogVisible.value = false;
};
// #endregion

const loading = ref(false);

/** 充值详情数据 */
const detailData = ref<RechargeHistoryVO>({});

/** 监听传入数据变化 */
watch(
  () => props.data,
  (val) => {
    if (val) {
      detailData.value = { ...val };
    }
  },
  { immediate: true, deep: true },
);
</script>

<style scoped lang="scss">
.recharge-detail {
  max-height: 65vh;
  overflow-y: auto;
  padding: 0 4px;

  .info-section {
    margin-bottom: 16px;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 6px;
    padding: 12px 16px;

    .section-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 24px;
    }

    .info-item {
      display: flex;
      align-items: center;
      line-height: 28px;
      font-size: 14px;

      .label {
        color: var(--el-text-color-secondary);
        white-space: nowrap;
        min-width: 90px;
      }

      .value {
        flex: 1;
        color: var(--el-text-color-regular);
        word-break: break-all;

        &.highlight {
          font-weight: 600;
          color: var(--el-color-primary);
        }
      }
    }

    .remark-content {
      font-size: 14px;
      color: var(--el-text-color-regular);
      line-height: 22px;
      padding: 8px;
      background-color: var(--el-fill-color-light);
      border-radius: 4px;
    }
  }
}
</style>

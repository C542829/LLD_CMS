<template>
  <Dialog v-model="dialogVisible" title="消费账单详情" width="900px" @close="closeDialog">
    <div class="dialog-container" v-loading="loading" :element-loading-text="LOADING_MSG">
      <div class="bill-info">
        <div class="info-row">
          <div class="info-item">
            <span class="label">单据编号：</span>
            <span class="value">{{ bill?.billno || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">账单类型：</span>
            <span class="value">{{ BILL_TYPE_MAP[bill?.billtype ?? -1] || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">账单状态：</span>
            <el-tag :type="bill?.billstatus === 0 ? 'success' : 'danger'" size="small">
              {{ BILL_STATUS_MAP[bill?.billstatus ?? -1] || '-' }}
            </el-tag>
          </div>
        </div>
        <div class="info-row">
          <div class="info-item">
            <span class="label">顾客姓名：</span>
            <span class="value">{{ bill?.name || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">顾客性别：</span>
            <span class="value">{{ SEX_MAP[bill?.sex ?? ''] || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">会员ID：</span>
            <span class="value">{{ bill?.memberId || '-' }}</span>
          </div>
        </div>
        <div class="info-row">
          <div class="info-item">
            <span class="label">消费金额：</span>
            <span class="value text-primary">￥{{ bill?.consumefee || '0' }}</span>
          </div>
          <div class="info-item">
            <span class="label">实收金额：</span>
            <span class="value text-success">￥{{ bill?.eafee || '0' }}</span>
          </div>
          <div class="info-item">
            <span class="label">开单时间：</span>
            <span class="value">{{ formatTimestamp(bill?.createDate) }}</span>
          </div>
        </div>
        <div v-if="bill?.comment" class="info-row">
          <div class="info-item full-width">
            <span class="label">备注：</span>
            <span class="value">{{ bill?.comment }}</span>
          </div>
        </div>
      </div>

      <div class="tab-container">
        <el-tabs type="border-card" style="height: 100%">
          <el-tab-pane class="tab-pane-content">
            <template #label>
              <span>消费项目 ({{ bill?.items?.length || 0 }})</span>
            </template>
            <el-table :data="bill?.items || []" :border="true" height="100%" stripe size="small">
              <el-table-column prop="serviceItemName" label="项目名称" min-width="120" />
              <el-table-column prop="price" label="单价" width="80">
                <template #default="{ row }">￥{{ row.price }}</template>
              </el-table-column>
              <el-table-column prop="num" label="数量" width="60" align="center" />
              <el-table-column label="小计" width="90">
                <template #default="{ row }">￥{{ (parseFloat(row.price) * row.num).toFixed(2) }}</template>
              </el-table-column>
              <el-table-column label="技师" min-width="100">
                <template #default="{ row }">
                  <span v-for="(emp, index) in row.emps" :key="index">
                    {{ emp.empName }}
                    <span v-if="index < row.emps.length - 1">、</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="类型" width="80">
                <template #default="{ row }">
                  <el-tag size="small" :type="row.type === 0 ? 'primary' : 'warning'">
                    {{ row.type === 0 ? '服务' : row.type === 3 ? '套餐' : row.type === 4 ? '疗程' : '其他' }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane class="tab-pane-content">
            <template #label>
              <span>现金支付 ({{ bill?.cashs?.length || 0 }})</span>
            </template>
            <el-table :data="cashPaymentList" :border="true" height="100%" stripe size="small">
              <el-table-column prop="name" label="支付方式" min-width="100" />
              <el-table-column prop="amount" label="金额" width="100">
                <template #default="{ row }">
                  <span class="text-success">￥{{ row.amount.toFixed(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="consumeTime" label="支付时间" min-width="160" />
            </el-table>
          </el-tab-pane>

          <el-tab-pane class="tab-pane-content">
            <template #label>
              <span>会员卡支付 ({{ bill?.cards?.length || 0 }})</span>
            </template>
            <el-table :data="bill?.cards || []" :border="true" height="100%" stripe size="small">
              <el-table-column prop="cardTypeId" label="卡类型ID" width="100" />
              <el-table-column label="卡金支付" width="100">
                <template #default="{ row }">
                  <span v-if="row.cardFee > 0" class="text-success">￥{{ row.cardFee.toFixed(2) }}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column label="疗程支付" width="100">
                <template #default="{ row }">
                  <span v-if="row.treatFee > 0" class="text-primary">￥{{ row.treatFee.toFixed(2) }}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column label="赠送支付" width="100">
                <template #default="{ row }">
                  <span v-if="row.presentFee > 0">￥{{ row.presentFee.toFixed(2) }}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column prop="consumeTime" label="支付时间" min-width="160" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="payment-summary">
        <div class="summary-title">支付汇总</div>
        <div class="summary-content">
          <div v-for="item in paymentSummary" :key="item.name" class="summary-item">
            <span class="name">{{ item.name }}：</span>
            <span class="amount">￥{{ item.amount.toFixed(2) }}</span>
          </div>
          <div class="summary-item total">
            <span class="name">合计：</span>
            <span class="amount text-danger">￥{{ totalPayment.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { ConsumeBill, ConsumeBillCash } from '../utils/types';
import { BILL_TYPE_MAP, BILL_STATUS_MAP, SEX_MAP } from '../utils/types';
import { LOADING_MSG } from '@/utils/constant';

interface Props {
  modelValue: boolean;
  billData: ConsumeBill | null;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  billData: null,
});

const emit = defineEmits(['update:modelValue']);

const dialogVisible = ref<boolean>(props.modelValue);
const loading = ref<boolean>(false);
const bill = ref<ConsumeBill | null>(null);

watch(
  () => props.modelValue,
  (newVal) => {
    dialogVisible.value = newVal;
  },
);

watch(
  () => props.billData,
  (newVal) => {
    bill.value = newVal;
  },
  { immediate: true },
);

const closeDialog = () => {
  emit('update:modelValue', false);
};

const formatTimestamp = (timestamp?: number): string => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

interface CashPaymentItem {
  name: string;
  amount: number;
  consumeTime: string;
}

const cashPaymentList = computed<CashPaymentItem[]>(() => {
  if (!bill.value?.cashs || bill.value.cashs.length === 0) return [];

  const result: CashPaymentItem[] = [];
  bill.value.cashs.forEach((cash: ConsumeBillCash) => {
    if (cash.cash > 0) {
      result.push({ name: '现金', amount: cash.cash, consumeTime: cash.consumeTime });
    }
    if (cash.weixin > 0) {
      result.push({ name: '微信', amount: cash.weixin, consumeTime: cash.consumeTime });
    }
    if (cash.dianpin > 0) {
      result.push({ name: '点评', amount: cash.dianpin, consumeTime: cash.consumeTime });
    }
    if (cash.unionPay > 0) {
      result.push({ name: '银联', amount: cash.unionPay, consumeTime: cash.consumeTime });
    }
    if (cash.coupon > 0) {
      result.push({ name: '优惠券', amount: cash.coupon, consumeTime: cash.consumeTime });
    }
    if (cash.luckymoney > 0) {
      result.push({ name: '红包', amount: cash.luckymoney, consumeTime: cash.consumeTime });
    }
  });
  return result;
});

interface PaymentSummaryItem {
  name: string;
  amount: number;
}

const paymentSummary = computed<PaymentSummaryItem[]>(() => {
  const summary: PaymentSummaryItem[] = [];

  if (bill.value?.cashs) {
    let cashTotal = 0;
    let weixinTotal = 0;
    let dianpinTotal = 0;
    let unionPayTotal = 0;

    bill.value.cashs.forEach((cash: ConsumeBillCash) => {
      cashTotal += cash.cash || 0;
      weixinTotal += cash.weixin || 0;
      dianpinTotal += cash.dianpin || 0;
      unionPayTotal += cash.unionPay || 0;
    });

    if (cashTotal > 0) summary.push({ name: '现金', amount: cashTotal });
    if (weixinTotal > 0) summary.push({ name: '微信', amount: weixinTotal });
    if (dianpinTotal > 0) summary.push({ name: '点评', amount: dianpinTotal });
    if (unionPayTotal > 0) summary.push({ name: '银联', amount: unionPayTotal });
  }

  if (bill.value?.cards) {
    let cardFeeTotal = 0;
    let treatFeeTotal = 0;
    let presentFeeTotal = 0;

    bill.value.cards.forEach((card) => {
      cardFeeTotal += card.cardFee || 0;
      treatFeeTotal += card.treatFee || 0;
      presentFeeTotal += card.presentFee || 0;
    });

    if (cardFeeTotal > 0) summary.push({ name: '会员卡金', amount: cardFeeTotal });
    if (treatFeeTotal > 0) summary.push({ name: '疗程', amount: treatFeeTotal });
    if (presentFeeTotal > 0) summary.push({ name: '赠送', amount: presentFeeTotal });
  }

  return summary;
});

const totalPayment = computed(() => {
  return paymentSummary.value.reduce((sum, item) => sum + item.amount, 0);
});
</script>

<style scoped lang="scss">
.dialog-container {
  height: 65vh;
  display: flex;
  flex-direction: column;
  padding: 0 $main-padding;

  .bill-info {
    padding: 12px 0;
    border-bottom: 1px solid var(--el-border-color);

    .info-row {
      display: flex;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .info-item {
      flex: 1;
      display: flex;
      align-items: center;
      font-size: 14px;

      &.full-width {
        flex: 3;
      }

      .label {
        color: var(--el-text-color-secondary);
        min-width: 70px;
      }

      .value {
        color: var(--el-text-color-primary);
      }
    }
  }

  .tab-container {
    flex: 1;
    margin-top: 12px;
    overflow: hidden;

    .tab-pane-content {
      height: 100%;
    }
  }

  .payment-summary {
    padding: 12px 0;
    border-top: 1px solid var(--el-border-color);

    .summary-title {
      font-weight: bold;
      margin-bottom: 8px;
      color: var(--el-text-color-primary);
    }

    .summary-content {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;

      .summary-item {
        display: flex;
        align-items: center;
        font-size: 14px;

        .name {
          color: var(--el-text-color-secondary);
        }

        .amount {
          font-weight: 500;
        }

        &.total {
          .name,
          .amount {
            font-weight: bold;
          }
        }
      }
    }
  }
}

.text-primary {
  color: var(--el-color-primary);
}

.text-success {
  color: var(--el-color-success);
}

.text-danger {
  color: var(--el-color-danger);
}

.text-info {
  color: var(--el-text-color-secondary);
}
</style>

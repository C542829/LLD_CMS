<template>
  <Dialog v-model="dialogVisible" title="销售记录详情" width="950px" @close="closeDialog">
    <div class="dialog-container" v-if="data">
      <!-- 基本信息 -->
      <div class="bill-info">
        <div class="info-row">
          <div class="info-item">
            <span class="label">销售单号：</span>
            <span class="value">{{ data.salesNo || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">门店：</span>
            <span class="value">{{ data.orgName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">订单状态：</span>
            <el-tag :type="getOrderStatusTagType(data.orderStatus) as any" size="small">
              {{ ORDER_STATUS_MAP[data.orderStatus] || '-' }}
            </el-tag>
          </div>
        </div>
        <div class="info-row">
          <div class="info-item">
            <span class="label">会员姓名：</span>
            <span class="value">{{ data.memName || '散客' }}</span>
          </div>
          <div class="info-item">
            <span class="label">手机号：</span>
            <span class="value">{{ data.cellPhoneNo || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">会员等级：</span>
            <span class="value">
              <template v-if="data.levelCode">
                <el-tag :type="MEMBER_LEVEL_TAG_TYPE[data.levelCode] as any" size="small">
                  {{ MEMBER_LEVEL_MAP[data.levelCode] || data.levelCode }}
                </el-tag>
              </template>
              <template v-else>-</template>
            </span>
          </div>
        </div>
        <div class="info-row">
          <div class="info-item">
            <span class="label">交易时间：</span>
            <span class="value">{{ data.tradeTime || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">开单员：</span>
            <span class="value">{{ data.createUserName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">结账员：</span>
            <span class="value">{{ data.settleUserName || '-' }}</span>
          </div>
        </div>
        <div class="info-row">
          <div class="info-item">
            <span class="label">应收金额：</span>
            <span class="value text-primary">￥{{ data.shouldAmount?.toFixed(2) || '0.00' }}</span>
          </div>
          <div class="info-item">
            <span class="label">实收金额：</span>
            <span class="value text-success">￥{{ data.actualAmount?.toFixed(2) || '0.00' }}</span>
          </div>
          <div class="info-item">
            <span class="label">折扣金额：</span>
            <span class="value text-danger">￥{{ data.discountAmount?.toFixed(2) || '0.00' }}</span>
          </div>
        </div>
        <div v-if="data.remark" class="info-row">
          <div class="info-item full-width">
            <span class="label">备注：</span>
            <span class="value">{{ data.remark }}</span>
          </div>
        </div>
      </div>

      <!-- Tab 详情 -->
      <div class="tab-container">
        <el-tabs type="border-card" style="height: 100%">
          <!-- 消费项目 -->
          <el-tab-pane class="tab-pane-content">
            <template #label>
              <span>消费项目 ({{ data.details?.length || 0 }})</span>
            </template>
            <PaginationTable :data="data.details || []" :showPagination="false" size="small" containerHeight="100%">
              <el-table-column prop="prodName" label="项目名称" min-width="120" />
              <el-table-column prop="prodCode" label="编码" width="80" />
              <el-table-column label="类型" width="80">
                <template #default="{ row }">
                  {{ PRODUCT_TYPE_MAP[row.prodType] || '-' }}
                </template>
              </el-table-column>
              <el-table-column prop="standPrice" label="标准价" width="80">
                <template #default="{ row }">￥{{ row.standPrice?.toFixed(2) }}</template>
              </el-table-column>
              <el-table-column prop="acturalPrice" label="实际价" width="80">
                <template #default="{ row }">￥{{ row.acturalPrice?.toFixed(2) }}</template>
              </el-table-column>
              <el-table-column prop="quantity" label="数量" width="60" align="center" />
              <el-table-column label="小计" width="90">
                <template #default="{ row }">￥{{ (row.acturalPrice * row.quantity).toFixed(2) }}</template>
              </el-table-column>
              <el-table-column label="技师" min-width="100">
                <template #default="{ row }">
                  {{ row.serviceStaffName || '-' }}
                </template>
              </el-table-column>
              <el-table-column label="服务类型" width="80">
                <template #default="{ row }">
                  {{ SERVICE_TYPE_MAP[row.serviceType] || '-' }}
                </template>
              </el-table-column>
              <el-table-column prop="serviceTime" label="时长(分)" width="70" align="center" />
            </PaginationTable>
          </el-tab-pane>

          <!-- 支付明细 -->
          <el-tab-pane class="tab-pane-content">
            <template #label>
              <span>支付明细</span>
            </template>
            <PaginationTable :data="paymentDetailList" :showPagination="false" size="small" containerHeight="100%">
              <el-table-column prop="name" label="支付方式" min-width="100" />
              <el-table-column prop="amount" label="金额" width="100">
                <template #default="{ row }">
                  <span class="text-success">￥{{ row.amount.toFixed(2) }}</span>
                </template>
              </el-table-column>
            </PaginationTable>
          </el-tab-pane>

          <!-- 会员财务记录 -->
          <el-tab-pane class="tab-pane-content">
            <template #label>
              <span>财务记录 ({{ data.saleMemConsumeFins?.length || 0 }})</span>
            </template>
            <PaginationTable
              :data="data.saleMemConsumeFins || []"
              :showPagination="false"
              size="small"
              containerHeight="100%"
            >
              <el-table-column prop="finNo" label="财务编号" min-width="120" />
              <el-table-column prop="finAmount" label="消费金额" width="100">
                <template #default="{ row }">
                  <span class="text-success">￥{{ row.finAmount?.toFixed(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="是否转账" width="80" align="center">
                <template #default="{ row }">
                  {{ TRAN_FIN_MAP[row.tranFin] || '-' }}
                </template>
              </el-table-column>
              <el-table-column prop="finOrgName" label="消费门店" min-width="100" />
            </PaginationTable>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 支付汇总 -->
      <div class="payment-summary">
        <div class="summary-title">支付汇总</div>
        <div class="summary-content">
          <template v-for="field in PAY_FIELDS" :key="field.key">
            <div v-if="(data as any)[field.key] > 0" class="summary-item">
              <span class="name">{{ field.label }}：</span>
              <span class="amount">￥{{ (data as any)[field.key]?.toFixed(2) }}</span>
            </div>
          </template>
          <div class="summary-item total">
            <span class="name">合计：</span>
            <span class="amount text-danger">￥{{ data.actualAmount?.toFixed(2) || '0.00' }}</span>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { YbSaleDataVO } from '../utils/types';
import {
  ORDER_STATUS_MAP,
  MEMBER_LEVEL_MAP,
  MEMBER_LEVEL_TAG_TYPE,
  PRODUCT_TYPE_MAP,
  SERVICE_TYPE_MAP,
  TRAN_FIN_MAP,
  PAY_FIELDS,
  getOrderStatusTagType,
} from '../utils';

interface Props {
  modelValue: boolean;
  data: YbSaleDataVO | null;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  data: null,
});

const emit = defineEmits(['update:modelValue']);

const dialogVisible = ref<boolean>(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    dialogVisible.value = newVal;
  },
);

const closeDialog = () => {
  emit('update:modelValue', false);
};

interface PaymentDetailItem {
  name: string;
  amount: number;
}

/** 支付明细列表 */
const paymentDetailList = computed<PaymentDetailItem[]>(() => {
  if (!props.data) return [];
  const result: PaymentDetailItem[] = [];
  PAY_FIELDS.forEach((field) => {
    const amount = (props.data as any)[field.key];
    if (amount > 0) {
      result.push({ name: field.label, amount });
    }
  });
  return result;
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
</style>

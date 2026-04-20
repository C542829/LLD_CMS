<template>
  <el-dialog v-model="dialogVisible" title="销售单据" width="800px" @close="handleClose">
    <div class="dialog-container" v-loading="loading" :element-loading-text="LOADING_MSG">
      <article class="consumption-detail" v-if="orderData">
        <div>
          <span>单据编号: {{ orderData.orderCode }}</span>
          <span>单据日期: {{ orderData.orderTime?.split(' ')[0] }}</span>
        </div>
        <div>
          <span>会员卡号: {{ orderData.vipCardNumber || '无' }}</span>
          <span>会员姓名: {{ orderData.vipName || orderData.customerName }}</span>
        </div>
        <div>
          <span>床位: {{ orderData.bedName }}</span>
          <span>销售员: {{ orderData.userName }}</span>
        </div>
        <div>
          <span>总金额: ¥{{ orderData.totalAmount }}</span>
          <span>实收金额: ¥{{ orderData.actualAmount }}</span>
        </div>
      </article>

      <div class="tab-container">
        <el-tabs type="border-card">
          <el-tab-pane>
            <template #label>
              <span>项目/产品消费</span>
            </template>
            <PaginationTable :data="orderData?.orderDetails || []" :showPagination="false">
              <el-table-column prop="businessName" label="项目/产品/疗程" min-width="100" />
              <el-table-column prop="stdPrice" label="标准价" width="70" :formatter="amountFormatter" />
              <el-table-column prop="quantity" label="数量" width="60" />
              <el-table-column prop="trueUnitPrice" label="实收金额" width="90" :formatter="amountFormatter" />
              <el-table-column label="类型" width="80">
                <template #default="{ row }">
                  <ServiceTypeTag :type="row.bizType" />
                </template>
              </el-table-column>
              <el-table-column label="上钟类型" width="90">
                <template #default="{ row }">
                  <template v-if="row.bizType === OrderDetailType.Service">
                    <ClockInTypeTag :type="row.serverType" />
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="技师/销售" min-width="100">
                <template #default="{ row }">
                  <template v-if="row.technicians">
                    {{ row.technicians.map((item: any) => item.userName).join('、') }}
                  </template>
                  <template v-else>
                    {{ row.userName }}
                  </template>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" min-width="90" />
            </PaginationTable>
          </el-tab-pane>
          <el-tab-pane>
            <template #label>
              <span>支付明细</span>
            </template>
            <el-scrollbar class="pay-detail">
              <div v-for="payment in orderData?.payments || []" :key="payment.id" class="payment-item">
                <span>{{ payment.paymentName }}</span>
                <span>¥{{ payment.totalAmount }}</span>
              </div>
              <div v-if="orderData?.vipId" class="balance-info">
                <span>消费前余额: ¥{{ orderData.beforeBalance }}</span>
                <span>消费后余额: ¥{{ orderData.afterBalance }}</span>
              </div>
            </el-scrollbar>
            <!-- <article class="pay-detail">
            </article> -->
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { reqOrderInfo } from '@/api/dataGroup/saleData';
import { parseResObj } from '@/utils/parseResponse';
import { amountFormatter } from '@/utils/formatter';
import { LOADING_MSG } from '@/utils/constant';
import { OrderDetailType } from '@/enums';

/** 订单数据 */
const orderData = ref<any>(null);

/** dialog 显示状态 */
const dialogVisible = ref(false);

/** 加载状态 */
const loading = ref(false);

/**
 * 显示销售单据对话框
 * @param orderCode 订单编号
 */
const show = async (orderCode: string) => {
  try {
    loading.value = true;
    dialogVisible.value = true;

    const res = await reqOrderInfo(orderCode);
    const data = parseResObj(res);

    if (data) {
      orderData.value = data;
    } else {
      ElMessage.error('获取订单详情失败');
      dialogVisible.value = false;
    }
  } catch (error) {
    console.error('获取订单详情失败:', error);
    ElMessage.error('获取订单详情失败,请稍后重试');
    dialogVisible.value = false;
  } finally {
    loading.value = false;
  }
};

/**
 * 关闭对话框
 */
const handleClose = () => {
  orderData.value = null;
};

// 暴露方法供父组件调用
defineExpose({
  show,
});
</script>

<style lang="scss" scoped>
.dialog-container {
  // min-height: 500px;
  height: 60vh;
  display: flex;
  flex-direction: column;

  .consumption-detail {
    width: 100%;
    line-height: 30px;
    height: 140px;
    padding: 10px 0;

    > div {
      display: flex;
      > span {
        flex: 1;
        font-weight: 500;
      }
    }
  }

  .tab-container {
    height: calc(60vh - 160px);
    flex: 1;
    min-height: 0;
    :deep(.el-tabs) {
      height: 100%;

      .el-tabs__content {
        height: 100%;
        padding: 10px;
        .el-tab-pane {
          height: 100%;
        }
      }
    }
  }

  .pay-detail {
    padding: 10px;
    line-height: 30px;

    .payment-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      padding: 8px;
      background-color: #f5f7fa;
      border-radius: 4px;

      > span:first-child {
        width: 120px;
        font-weight: 500;
      }

      > span:last-child {
        color: #e6a23c;
        font-weight: bold;
      }
    }

    .balance-info {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #ebeef5;
      display: flex;
      justify-content: space-between;

      > span {
        color: #606266;
        font-size: 14px;
      }
    }
  }
}
</style>

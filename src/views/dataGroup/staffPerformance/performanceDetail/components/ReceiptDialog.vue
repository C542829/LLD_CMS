<template>
  <Dialog v-model="dialogVisible" title="收银单据" width="800px" @close="closeDialog">
    <div class="dialog-container" v-loading="loading" :element-loading-text="LOADING_MSG">
      <div class="consumption-detail">
        <div>
          <span>单据编号: {{ receiptInfo?.orderCode || '-' }}</span>
          <span>单据日期: {{ receiptInfo?.orderTime || '-' }}</span>
        </div>
        <div>
          <span>会员卡号: {{ receiptInfo?.vipCardNumber || '-' }}</span>
          <span>会员姓名: {{ receiptInfo?.vipName || '-' }}</span>
        </div>
      </div>

      <div class="tab-container">
        <el-tabs type="border-card" style="height: 100%">
          <el-tab-pane class="tab-pane-content" style="height: 100%">
            <template #label>
              <span>项目/产品消费</span>
            </template>
            <PaginationTable :data="receiptInfo?.orderDetails || []" :show-pagination="false" container-height="100%">
              <el-table-column prop="businessName" label="项目/产品消费" min-width="100" />
              <el-table-column prop="stdPrice" label="标准价" />
              <el-table-column prop="quantity" label="数量" />
              <el-table-column prop="truePrice" label="金额" />
              <el-table-column label="类型">
                <template #default="{ row }">
                  <ServiceTypeTag :type="row.bizType" />
                </template>
              </el-table-column>
              <el-table-column label="上钟类型">
                <template #default="{ row }">
                  <template v-if="row.bizType === OrderDetailType.Service">
                    <ClockInTypeTag :type="row.serverType" />
                  </template>
                </template>
              </el-table-column>
              <el-table-column prop="userName" label="技师/销售">
                <template #default="{ row }">
                  <template v-if="row.technicians">
                    <div v-for="(item, index) in row.technicians" :key="index" class="text-overflow text">
                      {{ item.userName }}({{ item.userCode }})
                    </div>
                  </template>
                  <template v-else>
                    {{ row.userName }}
                  </template>
                </template>
              </el-table-column>
            </PaginationTable>
          </el-tab-pane>
          <el-tab-pane>
            <template #label>
              <span>支付明细</span>
            </template>
            <article class="pay-detail">
              <div v-for="payment in receiptInfo?.payments || []" :key="payment.id">
                <span>{{ payment.paymentName }}</span>
                <span>{{ payment.totalAmount }}</span>
              </div>
              <div>
                <span>消费资产明细</span>
                <el-tag v-for="payment in receiptInfo?.payments || []" :key="payment.id">
                  {{ payment.paymentName }}:{{ payment.totalAmount }}元
                </el-tag>
              </div>
            </article>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { reqQueryOrder } from '@/api/order';
import { OrderInfoVO } from '@/api/order/types';
import { OrderDetailType } from '@/enums';
import { LOADING_MSG } from '@/utils/constants';

interface Props {
  modelValue: boolean;
  data: {
    id: number;
    orderCode: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  data: {} as any,
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

watch(
  () => props.data.orderCode,
  (newVal) => {
    if (newVal) {
      queryOrderDetail(newVal);
    }
  },
);
const loading = ref<boolean>(false);
const receiptInfo = ref<OrderInfoVO>({});

/**
 * 查询订单详情
 * @param orderCode 订单编号
 */
const queryOrderDetail = async (orderCode: string) => {
  try {
    loading.value = true;
    const res = await reqQueryOrder(orderCode);
    receiptInfo.value = res.data;
  } catch (error) {
    console.error('查询订单详情失败:', error);
    throw error;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.dialog-container {
  height: 60vh;
  display: flex;
  flex-direction: column;
  padding: 0 $main-padding;

  .consumption-detail {
    width: 100%;
    line-height: 30px;
    height: 70px;

    > div {
      display: flex;
      > span {
        flex: 1;
      }
    }
  }

  .tab-container {
    flex: 1;
    height: calc(60vh - 70px);
  }

  .pay-detail {
    padding: 20px;
    line-height: 30px;

    > div {
      display: flex;
      align-items: flex-end;
      > span:first-child {
        width: 120px;
      }
    }
  }
}
</style>

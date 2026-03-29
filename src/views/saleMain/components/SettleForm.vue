<template>
  <Dialog :title="title" v-model="dialogVisible" @closed="closeDialog" width="400px" center class="settle-dialog">
    <div class="dialog-body">
      <el-descriptions :column="1">
        <template v-if="orderStore.order.customerType === CustomerType.Member">
          <el-descriptions-item label="会员姓名:">{{ orderStore.member.name }}</el-descriptions-item>
          <el-descriptions-item label="会员卡号:">{{ orderStore.member.cardNumber }}</el-descriptions-item>
          <el-descriptions-item label="会员电话:">{{ orderStore.member.phoneNumber }}</el-descriptions-item>
          <el-descriptions-item label="可用余额:">
            <span class="amount">{{ orderStore.checkedAssetInfo.assetAmount }} 元</span>
          </el-descriptions-item>
        </template>
        <template v-else>
          <el-descriptions-item label="客户姓名:">{{ orderStore.order.customerName }}</el-descriptions-item>
        </template>
        <el-descriptions-item label="应付总额:">
          <span class="price-text">{{ orderStore.truePayAmount }} 元</span>
        </el-descriptions-item>
      </el-descriptions>
      <PayMethod />
    </div>
    <template #footer>
      <el-button type="default" @click="dialogVisible = false">取消</el-button>
      <el-button :loading="loading" type="primary" @click="handleSubmit">确认</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Message from '@/components/Message';
import PayMethod from './PayMethod.vue';

import { ref, watch, onMounted } from 'vue';
import { CustomerType, ResponseCode } from '@/enums/index';
import { printer } from '@/utils/lodop';
import { reqQueryOrder } from '@/api/order/index';
import { isEmpty } from 'lodash';

import { useOrderStore } from '@/store/modules/order/index';
import { useOrgStore } from '@/store/modules/acl/org';

const orgStore = useOrgStore();
const orderStore = useOrderStore();

interface Props {
  modelValue: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
});

watch(
  () => props.modelValue,
  (newVal) => {
    dialogVisible.value = newVal;
  },
);

const emit = defineEmits(['update:model-value', 'close']);

onMounted(async () => {});

const dialogVisible = ref(false);
const title = ref('结算确认单');
const loading = ref(false);

/** 结算操作 */
const handleSubmit = async () => {
  const payMethods = orderStore.order.paymentInfoList.filter((item: any) => item.paymentType !== '');
  if (payMethods.length === 0) {
    Message.warning('请选择支付方式');
    return;
  }

  loading.value = true;

  try {
    const order = await orderStore.settleOrder();
    if (!isEmpty(order)) {
      closeDialog();
      printReceipt(order.orderCode);
    }
  } catch (error) {
    console.log('结算订单失败：', error);
  } finally {
    loading.value = false;
  }
};

/** 打印小票 */
const printReceipt = async (orderCode: string) => {
  if (!orderCode) {
    console.log('打印参数缺失：缺少订单编码');
  }

  const org = await orgStore.getOrg();
  const order = await getOrder(orderCode);
  const data = { ...order, ...org };
  printer.printOrderByHTML(data, false);
};

/** 获取订单信息 */
const getOrder = async (orderCode: string) => {
  try {
    const res = await reqQueryOrder(orderCode);
    if (res.code === ResponseCode.SUCCESS) {
      return res.data;
    } else {
      Message.error('请求订单信息错误');
      return {};
    }
  } catch (error) {
    console.error(error);
    Message.error('请求订单信息错误');
    return {};
  }
};

const closeDialog = () => {
  dialogVisible.value = false;
  emit('update:model-value', false);
  emit('close');
};
</script>

<style scoped lang="scss">
.settle-dialog {
  .dialog-body {
    padding: 0 40px;
  }

  .amount {
    color: var(--el-color-success);
  }
  .price-text {
    color: red;
  }
}
</style>

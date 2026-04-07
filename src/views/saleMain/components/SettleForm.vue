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

import { isEmpty } from 'lodash';
import { ref, watch, onMounted } from 'vue';
import { paymentTypeMap, PaymentType } from '@/enums';
import { CustomerType } from '@/enums/index';
import { printer } from '@/utils/lodop';
import { type Types, reqQueryOrder, reqSettleOrder } from '@/api/order/index';

import { useOrderStore } from '@/store/modules/order/index';
import useUserStore from '@/store/modules/acl/user';

const userStore = useUserStore();
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

/**
 * 更新支付方式信息
 */
const updatePayment = (payments: Types.PaymentInfoDTO[]) => {
  for (const payment of payments) {
    payment.paymentName = paymentTypeMap[payment.paymentType as PaymentType];
    if (payment.paymentType !== PaymentType.MemberCard) {
      payment.assetCode = '';
    }
  }
};

/** 结算操作 */
const handleSubmit = async () => {
  // const payMethods = orderStore.order.paymentInfoList.filter((item: any) => item.paymentType !== '');
  // if (payMethods.length === 0) {
  //   Message.warning('请选择支付方式');
  //   return;
  // }

  // 更新支付方式信息
  updatePayment(orderStore.order.paymentInfoList);

  // 更新会员信息
  if (orderStore.order.vipId) {
    orderStore.order.customerName = orderStore.order.vipName;
  }

  // 同步订单信息
  orderStore.order.assetIds = orderStore.checkedAssetInfo.assetIds;
  orderStore.order.totalAmount = orderStore.payAmount;
  orderStore.order.actualAmount = orderStore.truePayAmount;
  orderStore.order.discountAmount = orderStore.discountAmount;

  settleOrder();
};

/**
 * 订单结算
 */
const settleOrder = async () => {
  loading.value = true;

  // console.log('结算订单:', orderStore.order);
  try {
    const res = await reqSettleOrder(orderStore.order);
    console.log('结算订单成功：', res);
    Message.success('订单结算成功');

    // 获取订单编码
    const orderCode = res.data.orderCode;
    //  打印小票
    printReceipt(orderCode);
    // 重置订单表单
    orderStore.reset();
    // 关闭弹窗
    closeDialog();
  } catch (error) {
    console.error('结算订单报错：', error);
  } finally {
    loading.value = false;
  }
};

/** 打印小票 */
const printReceipt = async (orderCode: string) => {
  if (!orderCode) {
    console.log('打印参数缺失：缺少订单编码');
  }

  try {
    // 获取门店详情
    const org = userStore.org || {};
    // 获取订单详情
    const order = await getOrder(orderCode);
    if (isEmpty(order)) {
      return;
    }
    // 合并订单详情和门店详情
    const data: any = { ...order, ...org };
    // 打印小票
    printer.printOrderByHTML(data, false);
  } catch (error) {}
};

/** 获取订单信息 */
const getOrder = async (orderCode: string) => {
  try {
    const res = await reqQueryOrder(orderCode);
    return res.data;
  } catch (error) {
    console.error(error);
    Message.error('获取订单信息失败,无法打印小票');
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

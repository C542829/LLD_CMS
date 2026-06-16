<template>
  <Dialog :title="title" v-model="dialogVisible" @closed="closeDialog" width="400px" center class="settle-dialog">
    <div class="dialog-body">
      <!-- 会员客户信息 -->
      <el-descriptions v-if="orderStore.order.customerType === CustomerType.Member" :column="1">
        <el-descriptions-item label="会员姓名:">{{ orderStore.member.name }}</el-descriptions-item>
        <el-descriptions-item label="会员卡号:">{{ orderStore.member.cardNumber }}</el-descriptions-item>
        <el-descriptions-item label="会员电话:">{{ orderStore.member.phoneNumber }}</el-descriptions-item>
        <el-descriptions-item v-if="orderStore.checkedAssetInfo.assetIds.length > 0" label="可用余额:">
          <span class="amount">{{ orderStore.checkedAssetInfo.assetAmount?.toFixed(1) }} 元</span>
        </el-descriptions-item>
        <el-descriptions-item label="手写单号:">
          <el-input v-model="orderStore.order.manualOrderNo" clearable class="w-100" />
          <span class="text-error">手写单号为必填项</span>
        </el-descriptions-item>
        <el-descriptions-item label="订单总额:">
          <span class="order-total">{{ orderStore.payAmount?.toFixed(1) }} 元</span>
        </el-descriptions-item>
        <el-descriptions-item label="应付总额:">
          <span class="pay-total">{{ orderStore.truePayAmount?.toFixed(1) }} 元</span>
        </el-descriptions-item>
        <el-descriptions-item v-if="orderStore.discountAmount > 0" label="折扣优惠:">
          <span class="discount-total">{{ orderStore.discountAmount?.toFixed(1) }} 元</span>
        </el-descriptions-item>
        <el-descriptions-item v-if="orderStore.couponDiscountAmount > 0" label="优惠券优惠:">
          <span class="discount-total">{{ orderStore.couponDiscountAmount?.toFixed(1) }} 元</span>
        </el-descriptions-item>
      </el-descriptions>
      <!-- 散客客户信息 -->
      <el-descriptions v-else :column="1">
        <el-descriptions-item label="客户姓名:">{{ orderStore.order.customerName }}</el-descriptions-item>
        <el-descriptions-item label="手写单号:">
          <el-input v-model="orderStore.order.manualOrderNo" clearable class="w-100" />
          <span class="text-error">手写单号为必填项</span>
        </el-descriptions-item>
        <el-descriptions-item label="订单总额:">
          <span class="order-total">{{ orderStore.payAmount?.toFixed(1) }} 元</span>
        </el-descriptions-item>
        <el-descriptions-item label="应付总额:">
          <span class="pay-total">{{ orderStore.truePayAmount?.toFixed(1) }} 元</span>
        </el-descriptions-item>
        <el-descriptions-item v-if="orderStore.discountAmount > 0" label="折扣优惠:">
          <span class="discount-total">{{ orderStore.discountAmount?.toFixed(1) }} 元</span>
        </el-descriptions-item>
        <el-descriptions-item v-if="orderStore.couponDiscountAmount > 0" label="优惠券优惠:">
          <span class="discount-total">{{ orderStore.couponDiscountAmount?.toFixed(1) }} 元</span>
        </el-descriptions-item>
      </el-descriptions>

      <template v-if="orderStore.order.ticketUseList && orderStore.order.ticketUseList.length > 0">
        <div class="used-coupon-info">
          <PaginationTable :data="orderStore.order.ticketUseList" :showPagination="false" size="small">
            <el-table-column prop="orgs" label="类型" width="60">
              <template #default="{ row }">
                {{ getCouponType(row.ticketType) }}
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="抵扣金额" width="80" />
            <el-table-column prop="detailName" label="描述" min-width="100" />
          </PaginationTable>
        </div>
      </template>

      <PayMethod />

      <div class="remark-container">
        <el-input
          v-model="orderStore.order.remark"
          :autosize="{ minRows: 1, maxRows: 4 }"
          class="w-p-100"
          type="textarea"
          placeholder="请输入订单备注"
        />
      </div>
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

import { cloneDeep, isEmpty } from 'lodash';
import { ref, watch, onMounted } from 'vue';
import { paymentTypeMap, PaymentType, couponTypeMap, CouponType } from '@/enums';
import { CustomerType } from '@/enums/index';
import { getPrinter } from '@/utils/lodop';
import { type Types, reqQueryOrder, reqSettleOrder } from '@/api/order/index';

import { useOrderStore } from '@/store/modules/order/index';
import useUserStore from '@/store/modules/acl/user';
import { add } from '@/utils/bigMethods';

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

/**
 * 券转换为支付方式
 */
const ticketToPayment = (tickets: Types.OrderTicketUseDTO[]) => {
  return tickets.map((ticket) => {
    let paymentType: PaymentType;
    if (ticket.ticketType === CouponType.voucher) {
      paymentType = PaymentType.Voucher;
    } else if (ticket.ticketType === CouponType.product) {
      paymentType = PaymentType.ProductCoupon;
    } else {
      paymentType = PaymentType.ItemCoupon;
    }
    return {
      paymentType,
      paymentName: paymentTypeMap[paymentType],
      paymentAmount: ticket.amount,
      assetCode: ticket.ticketId,
    };
  });
};

/** 结算操作 */
const handleSubmit = async () => {
  // const payMethods = orderStore.order.paymentInfoList.filter((item: any) => item.paymentType !== '');
  // if (payMethods.length === 0) {
  //   Message.warning('请选择支付方式');
  //   return;
  // }

  if (isEmpty(orderStore.order.manualOrderNo)) {
    Message.warning('请输入流水单号');
    return;
  }

  const order = cloneDeep(orderStore.order);

  // 更新支付方式信息
  updatePayment(order.paymentInfoList);
  const ticketPayments = ticketToPayment(order.ticketUseList!);
  order.paymentInfoList = [...order.paymentInfoList, ...ticketPayments];

  // 更新会员信息
  if (order.vipId) {
    order.customerName = order.vipName;
  }

  // 同步订单信息
  order.assetIds = orderStore.checkedAssetInfo.assetIds;
  order.totalAmount = orderStore.payAmount;
  // 实收金额 = 真实支付金额 + 优惠券折扣金额
  order.actualAmount = add(orderStore.truePayAmount, orderStore.couponDiscountAmount);
  order.discountAmount = orderStore.discountAmount;

  settleOrder(order);
};

/**
 * 订单结算
 */
const settleOrder = async (order: any) => {
  loading.value = true;

  console.log('结算订单:', order);
  try {
    const res = await reqSettleOrder(order);
    console.log('结算订单成功：', res);
    Message.success('订单结算成功');

    // 获取订单编码
    const orderCode = res.data.orderCode;
    // 关闭弹窗（先关闭再重置，避免弹窗动画期间数据变化导致渲染错误）
    closeDialog();
    // 打印小票
    printReceipt(orderCode);
    // 重置订单表单
    orderStore.reset();
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
    getPrinter().printOrderByHTML(data, false);
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

const getCouponType = (type: CouponType) => {
  return couponTypeMap[type] || '未知';
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
    color: var(--el-color-success) !important;
  }
  .order-total {
    color: var(--el-color-primary) !important;
  }
  .discount-total {
    color: var(--el-color-warning) !important;
  }
  .pay-total {
    color: var(--el-color-danger) !important;
    font-weight: 600;
  }

  .used-coupon-info {
    margin-bottom: 12px;
    // .coupon-info-title {
    //   color: var(--el-text-color-secondary);
    //   color: var(--el-text-color-primary);
    //   > b {
    //     margin: 0 3px;
    //     color: var(--el-color-danger);
    //   }
    // }
    // .coupon-list {
    //   margin-top: 12px;
    // }
  }
}

.text-error {
  font-size: 12px;
  color: var(--el-color-danger);
  margin-left: 6px;
}

.remark-container {
  margin-top: 10px;
}
</style>

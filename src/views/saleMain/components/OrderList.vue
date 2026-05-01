<template>
  <div class="order-list-container">
    <!-- 头部操作 -->
    <header class="order-list-header">
      <div class="order-count">账单明细({{ orderStore.orderCount }})</div>
      <div class="operation-btns">
        <el-button type="primary" link size="large" @click="handleCleanOrder">清空</el-button>
        <!-- <el-button type="warning" link size="large" @click="handleApplyModifyAuth">申请改价</el-button> -->
        <EditDiscountPrice @confirm="handleDiscountConfirm">
          <template #reference>
            <el-button type="success" plain round size="small" :disabled="!orderStore.isCreated">打折优惠</el-button>
          </template>
        </EditDiscountPrice>
      </div>
    </header>

    <!-- 资产概览 -->
    <div v-if="orderStore.checkedAssetInfo.assetIds.length > 0" class="selected-property-count">
      <span>当前选择资产为：{{ orderStore.checkedAssetInfo.assetTitle || '' }}</span>
      <span>，总余额：{{ orderStore.checkedAssetInfo.assetAmount || 0 }}</span>
    </div>
    <div v-else class="el-center selected-property-count">
      <el-text type="danger">存在不同折扣类型的资产，选择的资产不同，结账金额可能会变化</el-text>
    </div>

    <!-- 订单明细 -->
    <div class="order-content" v-loading="loading">
      <template v-if="orderStore.order.orderDetails && orderStore.order.orderDetails.length > 0">
        <el-scrollbar>
          <DetailCard
            v-for="(item, index) in orderStore.order.orderDetails"
            :key="item.id"
            :index="index + 1"
            :data="item"
            @delete="handleDeleteItem"
          />
        </el-scrollbar>
      </template>
      <template v-else>
        <Empty></Empty>
      </template>
    </div>

    <!-- 结算栏 -->
    <footer class="order-list-footer">
      <!-- 结算信息 -->
      <div class="left-footer">
        <!-- 待付款 -->
        <div class="pay-info">
          <span class="pay-amount">
            待付款:
            <b>￥{{ orderStore.truePayAmount }}</b>
          </span>
          <template v-if="orderStore.payAmount !== orderStore.truePayAmount">
            <span class="original-amount">应付：￥{{ orderStore.payAmount }}</span>
          </template>
        </div>
        <!-- 优惠信息 -->
        <div class="discount-info">
          <span class="coupon-amount" v-for="item in orderStore.order.ticketUseList" :key="item.ticketId">
            <template v-if="item.ticketType === CouponType.voucher">
              代金券抵扣：{{ getCouponInfo(item.ticketId!) }}元
            </template>
            <template v-else>
              {{ getCouponInfo(item.ticketId!) }}
            </template>
          </span>
          <template v-if="orderStore.order.discountAmount > 0">
            <span class="discount-amount">打折优惠：{{ orderStore.order.discountAmount || 0 }}元</span>
          </template>
        </div>
      </div>

      <!-- 底部操作按钮栏 -->
      <div class="right-footer">
        <!-- <template v-if="orderStore.order && orderStore.order.ticketUseList.length > 0">
          <el-button type="primary" link @click="handleCancelCoupon">取消所选优惠券</el-button>
        </template> -->
        <template v-if="orderStore.isCreated">
          <el-button type="primary" @click="handleSettle">结 算</el-button>
          <el-button type="danger" plain :loading="btnLoading" @click="handleCancel">取消订单</el-button>
        </template>
        <template v-else>
          <el-tooltip effect="dark" content="选择床位后可开单" placement="left">
            <el-button type="primary" :loading="btnLoading" :disabled="!canCreate" @click="handleCreate">
              开 单
            </el-button>
          </el-tooltip>
        </template>
      </div>
    </footer>
  </div>
  <SettleForm v-model="settleDialogVisible" />
</template>

<script setup lang="ts">
import Message from '@/components/Message';
import MessageBox from '@/components/MessageBox';
import DetailCard from './DetailCard.vue';
import EditDiscountPrice from './EditDiscountPrice.vue';
import SettleForm from './SettleForm.vue';
import { ref, onMounted, computed } from 'vue';
import { isEmpty } from 'lodash';
import { CouponType, PaymentType, paymentTypeMap, CustomerType } from '@/enums/index';
import { type Types, reqAddOrder, reqCancelOrder, reqDeleteOrderDetail } from '@/api/order/index';
import { useOrderStore } from '@/store/modules/order/index';
import { verifyOrder } from '../utils';
import { getOrgInfo } from '@/utils/localStorageTools';
import { sub } from '@/utils/bigMethods';

const emit = defineEmits<{
  (ev: 'update-order', value: number): void;
}>();

const orderStore = useOrderStore();
const loading = ref(false);
const btnLoading = ref(false);

/** 设置加载状态 */
const setLoading = () => (loading.value = !loading.value);

/** 是否满足创建订单的条件 */
const canCreate = computed(() => orderStore.order.bedId !== 0);

/**
 * 处理创建订单事件
 */
const handleCreate = () => {
  if (!canCreate) {
    Message.warning('请先选择床位后进行开单');
    return;
  }
  createOrder();
};

/** 创建订单 */
const createOrder = async () => {
  btnLoading.value = true;
  try {
    const res = await reqAddOrder(orderStore.order as Types.OrderCreateDTO);
    console.log('订单创建成功：', res);
    Message.success('订单创建成功！');
    emit('update-order', orderStore.order.bedId as number);
  } catch (error) {
  } finally {
    btnLoading.value = false;
  }
};

/**
 * 清空订单
 */
const handleCleanOrder = async () => {
  if (orderStore.isCreated) {
    Message.warning('已挂单，如需清空订单，请点取消订单');
    return;
  }
  const result = await MessageBox.warning('确定清空订单吗？');
  if (result) {
    // orderStore.reset();
    orderStore.order.orderDetails = [];
  }
};

/**
 * 处理申请改价事件
 */
const handleApplyModifyAuth = () => {
  //
  console.log(getOrgInfo());
};

/**
 * 执行修改权限
 */
const applyModifyAuth = () => {
  //
};

/**
 * 添加打折优惠
 * @param discountAmount 优惠金额
 */
const handleDiscountConfirm = (discountAmount: number) => {
  orderStore.order.discountAmount = discountAmount;
};

/**
 * 处理删除订单明细项事件
 * @param item 订单明细项
 */
const handleDeleteItem = async (item: any) => {
  // 如果已生成订单ID，则调用删除接口
  if (item.id) {
    deleteOrderDetail(item.id);
  } else {
    const index = orderStore.order.orderDetails.findIndex((detail: any) => detail.index === item.index);
    orderStore.order.orderDetails.splice(index, 1);
  }
};

/**
 * 删除订单明细项
 * @param detailId 订单明细项ID
 */
const deleteOrderDetail = async (detailId: number) => {
  try {
    loading.value = true;
    const res = await reqDeleteOrderDetail(detailId);
    const index = orderStore.order.orderDetails.findIndex((detail: any) => detail.id === detailId);
    orderStore.order.orderDetails.splice(index, 1);
  } catch (error: any) {
    // Message.error(error.message);
    console.log('删除订单明细失败：', error);
  } finally {
    loading.value = false;
  }
};

/** 取消订单 */
const handleCancel = async () => {
  try {
    btnLoading.value = true;
    const res = await reqCancelOrder(orderStore.order.id);
    orderStore.reset();
    Message.success('取消订单成功');
  } catch (error) {
    Message.error('取消订单失败');
  } finally {
    btnLoading.value = false;
  }
};

const settleDialogVisible = ref(false);

// 处理结算事件
const handleSettle = async () => {
  if (!verifyOrder(orderStore.order)) {
    // 没有选择销售人员，是否继续？
    const result = await MessageBox.warning('没有选择销售人员，是否继续？');
    if (!result) {
      return;
    }
  }

  if (orderStore.order.customerType === CustomerType.Member && !orderStore.order.vipId) {
    Message.warning('请选择会员进行结算');
    return;
  }
  if (orderStore.order.customerType === CustomerType.Guest && orderStore.order.customerName === '') {
    Message.warning('请输入散客姓名后进行结算');
    return;
  }
  // 检查订单是否为空
  if (orderStore.order.orderDetails.length <= 0) {
    Message.warning('订单不能为空');
    return;
  }

  orderStore.order.paymentInfoList = [];

  if (orderStore.order.customerType === CustomerType.Member) {
    let truePayAmount = orderStore.truePayAmount;

    // if (orderStore.order.ticketUseList && truePayAmount === 0) {
    //   orderStore.order.paymentInfoList.push({
    //     paymentType: PaymentType.WeChat,
    //     paymentName: paymentTypeMap[PaymentType.WeChat],
    //     paymentAmount: orderStore.truePayAmount,
    //     assetCode: '',
    //   });
    //   settleDialogVisible.value = true;
    //   return;
    // }
    // if (orderStore.checkedAssetInfo.assetIds.length === 0 && truePayAmount > 0) {
    //   Message.warning('会员存在不同类型的资产记录，请您选择至少一个条资产记录，进行结算');
    //   return;
    // }

    // 遍历选择的资产记录 补全支付列表
    for (const assetId of orderStore.checkedAssetInfo.assetIds) {
      const asset = orderStore.member.vipAssetVOList.find((assetItem: any) => assetItem.id === assetId);
      // 如果资产余额为0，则跳过
      if (asset.assetBalance <= 0) {
        continue;
      }

      if (asset) {
        const paymentInfo = {
          paymentType: PaymentType.MemberCard,
          paymentName: paymentTypeMap[PaymentType.MemberCard],
          paymentAmount: truePayAmount,
          assetCode: asset.assetNum,
        };

        // 如果资产余额小于应付金额，则使用资产余额
        if (asset.assetBalance < truePayAmount) {
          paymentInfo.paymentAmount = asset.assetBalance;
          truePayAmount = sub(truePayAmount, asset.assetBalance);
        }
        orderStore.order.paymentInfoList.push(paymentInfo);
      } else {
        Message.warning('未找到相关资产记录，请重新选择');
        return;
      }
    }

    // 计算支付列表总金额
    const totalTruePayment = orderStore.order.paymentInfoList.reduce(
      (total: number, item: any) => (total += item.paymentAmount),
      0,
    );

    // 如果会员卡余额不足，则使用扫码支付
    if (totalTruePayment < orderStore.truePayAmount) {
      const paymentInfo = {
        paymentType: PaymentType.QR,
        paymentName: paymentTypeMap[PaymentType.QR],
        paymentAmount: sub(orderStore.truePayAmount, totalTruePayment),
        assetCode: '',
      };
      orderStore.order.paymentInfoList.push(paymentInfo);
    }
    settleDialogVisible.value = true;
  }
  // 散客结算
  else {
    const paymentInfo = {
      paymentType: PaymentType.QR,
      paymentName: paymentTypeMap[PaymentType.QR],
      paymentAmount: orderStore.truePayAmount,
      assetCode: '',
    };
    orderStore.order.paymentInfoList.push(paymentInfo);
    settleDialogVisible.value = true;
  }
};

/**
 * 取消所有优惠券
 */
const handleCancelCoupon = () => {
  orderStore.order.ticketUseList = [];
};

/**
 * 获取优惠信息
 * @param id 优惠券id
 */
const getCouponInfo = (id: number) => {
  const coupon = orderStore.member.vipTicketVOList.find((item: any) => item.id === id);
  if (isEmpty(coupon)) {
    return 0;
  }
  if (coupon.ticketInfo.ticketType === CouponType.voucher) {
    return coupon.ticketInfo.ticketValue;
  } else {
    return coupon.ticketName;
  }
};

defineExpose({
  setLoading,
});
</script>

<style lang="scss" scoped>
.order-list-container {
  $order-header-height: 40px;
  $order-footer-height: 80px;
  $selected-property-count-height: 30px;
  $coupon-list-container-height: 110px;

  height: 100%;
  position: relative;

  .order-list-header {
    height: $order-header-height;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    > div {
      width: 50%;
      text-align: center;
    }
    .order-count {
      font-size: 16px;
      font-weight: 500;
      color: var(--el-text-color-regular);
    }
    .operation-btns {
    }
  }
  .selected-property-count {
    width: 100%;
    font-weight: 500;
    text-align: center;
    height: $selected-property-count-height;
    line-height: $selected-property-count-height;
    color: var(--el-color-success);
  }
  .coupon-list-container {
    position: absolute;
    bottom: $order-footer-height;
    left: 0;
    width: 100%;
    height: $coupon-list-container-height;
    // border-top: 1px solid var(--el-border-color);
    background-color: var(--el-bg-color);
    z-index: 1000;
    :deep(.el-divider) {
      margin-top: 0;
      > .el-divider__text {
        background: none;
      }
    }
    .coupon-content {
      width: 100%;
      height: calc(100% - 25px);
      display: flex;
      overflow-x: auto;
      :deep(.el-scrollbar__wrap) {
        width: 100%;
        .el-scrollbar__view {
          height: 100%;
        }
      }
    }
  }
  .order-list-footer {
    border-top: 1px solid var(--el-border-color);
    height: $order-footer-height;
    display: flex;
    > div {
      height: 100%;
      // border: 1px red solid;
    }
    .left-footer {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 10px;
      padding-left: 20px;

      .pay-info {
        .pay-amount {
          font-size: 20px;
          color: var(--el-text-color-regular);
          > b {
            font-weight: 600;
            color: red;
          }
        }
        .original-amount {
          margin-left: 5px;
          font-size: 14px;
          font-weight: 500;
          color: red;
          text-decoration: line-through;
        }
      }
      .discount-info {
        width: 100%;
        > span {
          font-size: 14px;
          color: var(--el-color-success);
          margin-right: 5px;
          padding: 0 5px;
          border-radius: 4px;
          border: 1px solid var(--el-color-success);
        }
      }
    }
    .right-footer {
      width: 200px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 20px;
    }
  }
  .order-content {
    height: calc(100% - #{$order-header-height} - #{$order-footer-height} - #{$selected-property-count-height});
    > :deep(.el-scrollbar) {
      padding: 10px;
    }
  }
}
</style>

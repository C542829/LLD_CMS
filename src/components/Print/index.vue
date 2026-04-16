<template>
  <div class="print-container">
    <div>
      <el-button type="primary" @click="handlePrint">打印消费单</el-button>
      <el-button @click="handlePreview">打印预览</el-button>
      <el-button @click="resetLoad">重新加载</el-button>
    </div>

    <div v-html="htmlTemplate"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { printer } from '@/utils/lodop';
import { generateOrderHtmlTemplate } from '@/utils/lodop/GenerateTemplate';
import { type OrderData } from '@/utils/lodop/types';

// 构造匹配的数据结构（需与后端返回对齐，此处模拟数据）
const orderData: OrderData = {
  id: 137,
  createTime: '2026-04-09 22:41:25',
  updateTime: '2026-04-12 00:43:22',
  remark: '',
  orderCode: 'ORD17757456847895260',
  orderTime: '2026-04-09 22:41:25',
  orderStatus: 2,
  orderStatusName: '已结算',
  vipId: 4621,
  vipName: '刘',
  vipCardNumber: 'VIP17755286236155777',
  vipPhoneNumber: '13000000000',
  beforeBalance: 4144.8,
  afterBalance: 4144.8,
  settleTime: '2026-04-12 00:43:23',
  totalAmount: 200.0,
  actualAmount: 200.0,
  discountAmount: 0.0,
  bedId: 41,
  bedName: '一楼-床位3',
  userId: 1,
  userName: 'SPAdmin',
  customerType: 0,
  customerName: '刘',
  orgId: 1,
  orgName: null,
  orgCode: null,
  orderDetails: [
    {
      id: 280,
      createTime: '2026-04-09 22:41:25',
      updateTime: '2026-04-12 00:43:23',
      remark: '',
      detailCode: 'DTL17757456849115296',
      orderId: 137,
      orderCode: 'ORD17757456847895260',
      userId: null,
      userName: null,
      detailType: 1,
      bid: 2,
      businessName: '采耳',
      businessCode: null,
      stdPrice: 100.0,
      truePrice: 200.0,
      trueUnitPrice: 200.0,
      vipPrice: 90.0,
      quantity: 1,
      isDiscount: 1,
      serverType: 2,
      settledTime: '2026-04-12 00:43:23',
      orderStatus: 2,
      technicians: [
        {
          userId: 1,
          userName: 'SPAdmin',
          userCode: 'SPAdmin',
        },
      ],
      orgId: 1,
      orgName: null,
      orgCode: null,
      timerStatus: 0,
      timerStartTime: null,
      timerEndTime: null,
      timerPausedDuration: 0,
      timerLastPauseTime: null,
      actualDuration: null,
      timerWarned: 0,
    },
  ],
  payments: [
    {
      id: 144,
      activeCode: 'ORD17757456847895260',
      activeType: '0',
      activeName: '消费',
      paymentType: 6,
      paymentName: '项目券',
      totalAmount: 200.0,
      assetCode: '15706',
    },
  ],
  manualOrderNo: null,
};
const htmlTemplate = ref(generateOrderHtmlTemplate(orderData));

const resetLoad = () => {
  htmlTemplate.value = generateOrderHtmlTemplate(orderData);
};
const handlePrint = () => {
  printer.printOrderByHTML(orderData, false);
};

const handlePreview = () => {
  printer.printOrderByHTML(orderData, true);
};
</script>

<style>
.print-container {
  display: flex;
  flex-direction: column;
  justify-content: center;

  > div {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  > div:last-child {
    > div {
      height: 177mm;
      border: 1px red solid;
    }
  }
}
</style>

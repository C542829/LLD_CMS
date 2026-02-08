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
  orgName: '郑州棉纺路店',
  servicePhone: '16697771407',
  orgAddress: '郑州市中原区盈润锦绣城西苑18-154号',
  orgNumber: '11000001',
  orderCode: 'ORD17628461058279941',
  orderTime: '2025-11-10 23:33:15',
  settleTime: '2025-11-10 23:34:46',
  totalAmount: 562,
  actualAmount: 371,
  discountAmount: 191,
  bedName: '卡5',
  userName: '刘',
  orderDetails: [
    { businessName: '套餐五选二', userName: '李园园', stdPrice: 138, quantity: 1, truePrice: 106.5, serverType: 0 },
    { businessName: '套餐五选二', userName: '李小展', stdPrice: 138, quantity: 1, truePrice: 106.5, serverType: 0 },
    { businessName: '水洗头', userName: '李园园', stdPrice: 128, quantity: 1, truePrice: 69, serverType: 1 },
    { businessName: '水洗头', userName: '李小展', stdPrice: 128, quantity: 1, truePrice: 69, serverType: 1 },
    { businessName: '一次性工具', userName: '李小展', stdPrice: 15, quantity: 1, truePrice: 10, serverType: 0 },
    { businessName: '一次性工具', userName: '李园园', stdPrice: 15, quantity: 1, truePrice: 10, serverType: 0 },
  ],
  payments: [
    { paymentName: '微信', totalAmount: 20 },
    { paymentName: '支付宝', totalAmount: 69 },
    { paymentName: '银行卡', totalAmount: 282 },
  ],
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

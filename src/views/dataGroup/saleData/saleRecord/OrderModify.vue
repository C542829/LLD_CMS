<template>
  <el-tabs v-model="activeTab" type="border-card" class="modify-tabs">
    <!-- 支付方式修改 -->
    <el-tab-pane label="支付方式修改" name="payment">
      <div class="payment-section">
        <h1>修改支付方式：</h1>
        <div class="payment-item">
          <span>优惠券支付 ￥88</span>
          <el-select v-model="couponPayment" placeholder="选择新支付方式">
            <el-option v-for="item in paymentOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="payment-item">
          <span>会员卡支付 ￥606.02</span>
          <el-select v-model="cardPayment" placeholder="选择新支付方式">
            <el-option v-for="item in paymentOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="submit-area">
          <el-button type="primary" @click="confirmModify">确定修改</el-button>
        </div>
      </div>
    </el-tab-pane>

    <!-- 技师/项目修改 -->
    <el-tab-pane label="技师/项目修改" name="technician">
      <el-tag type="warning" size="large" style="width: 100%; font-weight: bold; margin-bottom: 10px">
        修改产品/项目时，技师业绩会发生变化
      </el-tag>
      <el-table :data="projectList" :border="true" size="small" style="width: 100%; margin-top: 10px">
        <el-table-column prop="priceQuantity" label="价格/数量" min-width="100">
          <template #default="scope">
            <div>单价: {{ scope.row.price }} 元</div>
            <div>数量: {{ scope.row.quantity }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="namePrice" label="名称/标准价" min-width="120">
          <template #default="scope">
            <div>{{ scope.row.name }}</div>
            <div>标准价: {{ scope.row.standardPrice }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="project" label="修改项目/产品" min-width="120">
          <template #default="scope">
            <el-select v-model="scope.row.modifyProject" placeholder="选择项目">
              <el-option v-for="item in projectOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="technicianSales" label="技师/销售" min-width="100">
          <template #default="scope">
            <div>{{ scope.row.technicianSales }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="modifyTechnician" label="修改技师/销售" min-width="120">
          <template #default="scope">
            <el-select v-model="scope.row.newTechnician" placeholder="选择人员">
              <el-option v-for="item in staffOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="modifyType" label="修改上钟类型" min-width="120">
          <template #default="scope">
            <el-select v-model="scope.row.newType" placeholder="选择类型">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <div class="submit-area">
        <el-button type="primary" @click="confirmModify">确定修改</el-button>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 标签页激活状态
const activeTab = ref('payment');

// 支付方式下拉选项
const paymentOptions = ref([
  { label: '现金支付', value: 'cash' },
  { label: '微信支付', value: 'wechat' },
  { label: '支付宝支付', value: 'alipay' },
]);
const couponPayment = ref('');
const cardPayment = ref('');

// 技师/项目修改相关数据
const projectOptions = ref([
  { label: '经典足疗 (112)', value: 'classicFoot' },
  { label: '经络疏通40分钟 (607)', value: 'meridianDredge' },
  { label: '惠嘉抑菌液 (03)', value: 'huijiaAntibacterial' },
  { label: '足乐草本液 (0004)', value: 'zuleHerbal' },
]);
const staffOptions = ref([
  { label: '26(李小展)', value: '26' },
  { label: '88(刘)', value: '88' },
]);
const typeOptions = ref([
  { label: '点钟', value: 'dianzhong' },
  { label: '加钟', value: 'jiazhong' },
]);

const projectList = ref([
  {
    price: 88,
    quantity: 1,
    name: '经典足疗(112)',
    standardPrice: 88,
    modifyProject: '',
    technicianSales: '技师:26(李小展) [点钟]',
    newTechnician: '',
    newType: '',
  },
  {
    price: 109.02,
    quantity: 1,
    name: '经络疏通40分钟(607)',
    standardPrice: 158,
    modifyProject: '',
    technicianSales: '技师:26(李小展) [加钟]',
    newTechnician: '',
    newType: '',
  },
  {
    price: 199,
    quantity: 1,
    name: '惠嘉抑菌液(03)',
    standardPrice: 249,
    modifyProject: '',
    technicianSales: '销售:88(刘)',
    newTechnician: '',
    newType: '',
  },
  {
    price: 199,
    quantity: 1,
    name: '惠嘉抑菌液(03)',
    standardPrice: 249,
    modifyProject: '',
    technicianSales: '销售:26(李小展)',
    newTechnician: '',
    newType: '',
  },
  {
    price: 99,
    quantity: 1,
    name: '足乐草本液(0004)',
    standardPrice: 129,
    modifyProject: '',
    technicianSales: '销售:88(刘)',
    newTechnician: '',
    newType: '',
  },
]);

// 确定修改按钮事件
const confirmModify = () => {
  // 可在此处编写调用接口修改数据的逻辑
  console.log('确定修改，当前激活标签页：', activeTab.value);
  if (activeTab.value === 'payment') {
    console.log('优惠券支付新方式：', couponPayment.value);
    console.log('会员卡支付新方式：', cardPayment.value);
  } else {
    console.log('项目修改数据：', projectList.value);
  }
};
</script>

<style scoped lang="scss">
.modify-tabs {
  margin: 10px 20px;
}

.payment-section {
  padding: 10px;

  h1 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .payment-item {
    display: flex;
    align-items: center;
    margin-bottom: $main-padding;

    span {
      width: 160px;
    }

    .el-select {
      width: 200px;
    }
  }
}

.submit-area {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>

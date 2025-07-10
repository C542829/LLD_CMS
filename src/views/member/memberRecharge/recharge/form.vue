<template>
  <div class="sales-form">
    <el-form :model="store.rechargeFormData" label-width="72px" size="default">
      <!-- 折扣率 -->
      <el-form-item label="折扣率:">
        <el-input-number v-model="store.rechargeFormData.discountRate" :min="0" :max="100" style="width: 300px">
          <template #suffix>%</template>
        </el-input-number>
      </el-form-item>

      <!-- 折扣基础 -->
      <el-form-item label="折扣基础:">
        <el-select v-model="store.rechargeFormData.discountBase" placeholder="请选择" style="width: 300px">
          <el-option label="会员价" value="member" />
          <el-option label="标准价" value="Standard" />
        </el-select>
      </el-form-item>

      <!-- 跨店结算 -->
      <el-form-item label="跨店结算:">
        <el-select v-model="store.rechargeFormData.crossStoreSettlement" placeholder="请选择" style="width: 300px">
          <el-option label="允许" value="allow" />
          <el-option label="不允许" value="disallow" />
        </el-select>
      </el-form-item>

      <!-- 销售员 (单人模式) -->
      <el-form-item v-if="!isMultiPerformanceMode" label="销售员:">
        <el-select v-model="store.rechargeFormData.salesperson" placeholder="请选择" style="width: 300px">
          <el-option label="无" value="" />
          <el-option label="张三" value="zhangsan" />
          <el-option label="李四" value="lisi" />
          <el-option label="王五" value="wangwu" />
        </el-select>
      </el-form-item>

      <!-- 业绩技师 (多人模式) -->
      <div v-if="isMultiPerformanceMode">
        <el-form-item label="业绩技师:">
          <div class="performance-technician-section">
            <div
              v-for="(technician, index) in store.rechargeFormData.performanceTechnicians"
              :key="index"
              class="technician-row"
            >
              <el-button :icon="Plus" circle size="small" @click="addTechnician" v-if="index === 0" />
              <el-button :icon="Minus" circle size="small" @click="removeTechnician(index)" v-if="index > 0" />
              <el-select v-model="technician.name" placeholder="请选择" style="width: 120px; margin-left: 10px">
                <el-option label="请选择" value="" />
                <el-option label="技师A" value="technicianA" />
                <el-option label="技师B" value="technicianB" />
                <el-option label="技师C" value="technicianC" />
              </el-select>
              <el-input-number
                v-model="technician.amount"
                :min="0"
                :controls="false"
                style="width: 120px; margin-left: 10px"
              >
                <template #suffix>元</template>
              </el-input-number>
            </div>
          </div>
        </el-form-item>
      </div>

      <!-- 模式切换按钮 -->
      <el-form-item>
        <el-button type="primary" link @click="toggleMode" style="color: #409eff">
          {{ isMultiPerformanceMode ? '<- 切换到单人业绩模式' : '切换到多人业绩模式 ->' }}
        </el-button>
      </el-form-item>

      <!-- 支付方式 -->
      <el-form-item label="支付方式:">
        <div class="payment-methods">
          <div v-for="(payment, index) in store.rechargeFormData.paymentMethods" :key="index" class="payment-row">
            <el-button :icon="Plus" circle size="small" @click="addPaymentMethod" v-if="index === 0" />
            <el-button :icon="Minus" circle size="small" @click="removePaymentMethod(index)" v-if="index > 0" />
            <el-select v-model="payment.method" placeholder="请选择支付方式" style="width: 120px; margin-left: 10px">
              <el-option label="抖音支付" value="douyin" />
              <el-option label="微信支付" value="wechat" />
              <el-option label="支付宝" value="alipay" />
              <el-option label="现金" value="cash" />
              <el-option label="银行卡" value="bankcard" />
            </el-select>
            <el-input-number
              v-model="payment.amount"
              :min="0"
              :controls="false"
              style="width: 120px; margin-left: 10px"
            >
              <template #suffix>元</template>
            </el-input-number>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Minus } from '@element-plus/icons-vue';

import { useRechargeStore } from '@/store/modules/member/recharge';
const store = useRechargeStore();

// 响应式数据
const isMultiPerformanceMode = ref(false);

// 切换模式
const toggleMode = () => {
  isMultiPerformanceMode.value = !isMultiPerformanceMode.value;
};

// 添加业绩技师
const addTechnician = () => {
  store.rechargeFormData.performanceTechnicians.push({ name: '', amount: 0 });
};

// 移除业绩技师
const removeTechnician = (index: number) => {
  if (store.rechargeFormData.performanceTechnicians.length > 1) {
    store.rechargeFormData.performanceTechnicians.splice(index, 1);
  }
};

// 添加支付方式
const addPaymentMethod = () => {
  store.rechargeFormData.paymentMethods.push({ method: '', amount: 0 });
};

// 移除支付方式
const removePaymentMethod = (index: number) => {
  if (store.rechargeFormData.paymentMethods.length > 1) {
    store.rechargeFormData.paymentMethods.splice(index, 1);
  }
};
</script>

<style lang="scss" scoped>
.sales-form {
  height: 100%;
  overflow: auto;
}

.performance-technician-section {
  width: 100%;
}

.technician-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.technician-row:last-child {
  margin-bottom: 0;
}

.payment-methods {
  width: 100%;
}

.payment-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.payment-row:last-child {
  margin-bottom: 0;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-button--small .is-circle {
  width: 24px;
  height: 24px;
}
</style>

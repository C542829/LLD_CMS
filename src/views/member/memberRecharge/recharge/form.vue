<template>
  <div class="sales-form">
    <el-form :model="store.rechargeFormData" :disabled="!store.member.id" label-width="72px" size="default">
      <!-- 折扣率 -->
      <el-form-item label="折扣率:">
        <el-input-number v-model="store.rechargeFormData.assetDiscountRate" :min="0" :max="100" style="width: 300px">
          <template #suffix>%</template>
        </el-input-number>
      </el-form-item>

      <!-- 折扣基础 -->
      <el-form-item label="折扣基础:">
        <el-select v-model="store.rechargeFormData.assetDiscountBase" placeholder="请选择" style="width: 300px">
          <el-option v-for="item in discountTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <!-- 跨店结算 -->
      <el-form-item label="跨店结算:">
        <el-select v-model="store.rechargeFormData.assetIsCrossStore" placeholder="请选择" style="width: 300px">
          <el-option v-for="item in isCrossStoreOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <!-- 销售员 (单人模式) -->
      <el-form-item v-if="!isMultiPerformanceMode" label="销售员:">
        <el-select v-model="store.rechargeFormData.userKpi.userId" placeholder="请选择" style="width: 300px">
          <el-option label="请选择" :value="''" />
          <el-option v-for="item in staffList" :key="item.id" :label="item.userName" :value="item.id" />
        </el-select>
      </el-form-item>

      <!-- 业绩技师 (多人模式) -->
      <div v-if="isMultiPerformanceMode">
        <el-form-item label="业绩技师:">
          <div class="performance-technician-section">
            <div v-for="(technician, index) in store.rechargeFormData.userKpiList" :key="index" class="technician-row">
              <el-button :icon="Plus" circle size="small" @click="addTechnician" v-if="index === 0" />
              <el-button :icon="Minus" circle size="small" @click="removeTechnician(index)" v-if="index > 0" />
              <el-select v-model="technician.userId" placeholder="请选择" style="width: 120px; margin-left: 10px">
                <el-option label="请选择" :value="''" />
                <el-option v-for="item in staffList" :key="item.id" :label="item.userName" :value="item.id" />
              </el-select>
              <el-input-number
                v-model="technician.kpi"
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
          <div v-for="(payment, index) in store.rechargeFormData.paymentInfoList" :key="index" class="payment-row">
            <el-button :icon="Plus" circle size="small" @click="addPaymentMethod" v-if="index === 0" />
            <el-button :icon="Minus" circle size="small" @click="removePaymentMethod(index)" v-if="index > 0" />
            <el-select
              v-model="payment.paymentType"
              placeholder="请选择支付方式"
              style="width: 120px; margin-left: 10px"
            >
              <el-option v-for="item in paymentTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-input-number
              v-model="payment.paymentAmount"
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
import { ref, onMounted } from 'vue';
import { Plus, Minus } from '@element-plus/icons-vue';
import { paymentTypeOptions, isCrossStoreOptions, discountTypeOptions } from '@/enums';
import { useRechargeStore } from '@/store/modules/member/recharge';
import { useDynamicDataStore } from '@/store/modules/enums/dynamicData';
const dynamicDataStore = useDynamicDataStore();
const store = useRechargeStore();

onMounted(() => {
  getStaffList();
});

// 销售员列表
const staffList = ref<any>([]);
const getStaffList = async () => {
  const res = await dynamicDataStore.getUserList();
  if (res && res.data && res.data.rows) {
    staffList.value = res.data.rows || [];
  }
};

// 响应式数据
const isMultiPerformanceMode = ref(false);

// 切换模式
const toggleMode = () => {
  isMultiPerformanceMode.value = !isMultiPerformanceMode.value;
};

// 添加业绩技师
const addTechnician = () => {
  store.rechargeFormData.userKpiList.push({ userId: '', userName: '', kpi: 0 });
};

// 移除业绩技师
const removeTechnician = (index: number) => {
  if (store.rechargeFormData.userKpiList.length > 1) {
    store.rechargeFormData.userKpiList.splice(index, 1);
  }
};

// 添加支付方式
const addPaymentMethod = () => {
  store.rechargeFormData.paymentInfoList.push({ paymentType: 0, paymentName: '', paymentAmount: 0 });
};

// 移除支付方式
const removePaymentMethod = (index: number) => {
  if (store.rechargeFormData.paymentInfoList.length > 1) {
    store.rechargeFormData.paymentInfoList.splice(index, 1);
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

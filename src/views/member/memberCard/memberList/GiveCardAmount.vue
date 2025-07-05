<template>
  <div class="form-container">
    <!-- 表单 -->
    <Form :model="formData" :rules="formRules" @submit="handleFormSubmit" @reset="handleFormReset">
      <el-form-item label="赠送金额：" prop="amount">
        <el-input-number v-model="formData.amount" :controls="false" />
      </el-form-item>
      <el-form-item label="折扣率：" prop="rate">
        <el-input-number v-model="formData.rate" :min="0" :max="100" controls-position="right" />
        <span>&nbsp;&nbsp;%</span>
      </el-form-item>

      <el-form-item label="折扣基础：" prop="discountBase">
        <el-select v-model="formData.discountBase" style="width: 150px">
          <el-option :value="0" label="标准价">标准价</el-option>
          <el-option :value="1" label="会员价">会员价</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="跨店结算：" prop="acrossStore">
        <el-select v-model="formData.acrossStore" style="width: 150px">
          <el-option :value="0" label="允许">允许</el-option>
          <el-option :value="1" label="不允许">不允许</el-option>
        </el-select>
      </el-form-item>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 导入数据仓库
import { useMemberListStore } from '@/store/modules/member/memberList';
const store = useMemberListStore();

const $emit = defineEmits(['close-drawer']);

const formData = ref({
  amount: 0,
  rate: 100,
  discountBase: 0,
  acrossStore: 0,
});

// 表单提交
const handleFormSubmit = async () => {
  console.log(store.formData);

  const result = null;
  result && $emit('close-drawer');
};

// 表单重置
const handleFormReset = () => {
  formData.value = {
    amount: 0,
    rate: 100,
    discountBase: 0,
    acrossStore: 0,
  };
};

// 表单验证规则
const formRules = {
  amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
  rate: [{ required: true, message: '请输入折扣率', trigger: 'blur' }],
  discountBase: [{ required: true, message: '请选择折扣基础', trigger: 'blur' }],
  acrossStore: [{ required: true, message: '是否允许跨店结算', trigger: 'blur' }],
};
</script>

<style lang="scss" scoped>
.form-container {
  width: 300px;
  margin: 0 auto;
}
</style>

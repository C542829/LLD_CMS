<template>
  <Form
    :model="store.formData"
    :rules="formRules"
    :showButtons="!disabled"
    :disabled="disabled"
    @submit="handleFormSubmit"
    @reset="handleFormReset"
  >
    <!-- 优惠券名称 -->
    <el-form-item label="优惠券名称" prop="ticketName">
      <el-input v-model="store.formData.ticketName" placeholder="请输入优惠券名称" clearable />
    </el-form-item>

    <!-- 优惠券描述 -->
    <el-form-item label="优惠券描述" prop="ticketDescription">
      <el-input v-model="store.formData.ticketDescription" placeholder="请输入优惠券描述" clearable />
    </el-form-item>

    <!-- 优惠券类型 -->
    <el-form-item label="优惠券类型" prop="ticketType">
      <el-select v-model="store.formData.ticketType" placeholder="请选择优惠券类型" clearable>
        <el-option label="体验券" :value="1" />
        <el-option label="代金券" :value="0" />
      </el-select>
    </el-form-item>

    <!-- 领取后有效天数 -->
    <el-form-item label="领取后有效天数" prop="ticketEffectiveTime">
      <el-input
        v-model.number="store.formData.ticketEffectiveTime"
        placeholder="请输入有效天数"
        style="width: 120px; margin-right: 8px"
        clearable
      />
      <span>天内有效（-1代表无限期）</span>
    </el-form-item>

    <!-- 限制满额 -->
    <el-form-item label="限制满额" prop="ticketFullPayment">
      <el-input
        v-model.number="store.formData.ticketFullPayment"
        placeholder="请输入限制满额"
        style="width: 120px; margin-right: 8px"
        clearable
      />
      <span>元可用</span>
      <el-tooltip effect="light" content="限制满额为0表示无限制，可任意使用" placement="top">
        <i class="el-icon-question" style="margin-left: 4px"></i>
      </el-tooltip>
    </el-form-item>

    <!-- 代金券面值 -->
    <el-form-item label="代金券面值" prop="ticketValue">
      <el-input
        v-model.number="store.formData.ticketValue"
        placeholder="请输入代金券面值"
        style="width: 120px; margin-right: 8px"
        clearable
      />
      <span>元</span>
    </el-form-item>
    <!-- <el-alter>
      <div class="rule-tip">
        <span>规则结果：满{{ store.formData.ticketFullPayment }}元，</span>
        <span>可使用优惠券抵扣{{ store.formData.ticketValue }}元</span>
      </div>
    </el-alter> -->

    <!-- 需支付金额 -->
    <!-- <el-form-item label="需支付金额" prop="shouldPay">
      <el-input
        v-model.number="store.formData.shouldPay"
        placeholder="请输入需支付金额"
        style="width: 120px; margin-right: 8px"
        clearable
      />
      <span>元</span>
    </el-form-item> -->
  </Form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

import { useCouponStore } from '@/store/modules/member/memberCoupon';
const store = useCouponStore();

const $emit = defineEmits(['close-drawer']);

defineProps(['disabled']);

onMounted(() => {});

// 表单提交
const handleFormSubmit = async (model: any) => {
  const result = await store.update(model);
  result && $emit('close-drawer');
};

// 表单重置
const handleFormReset = () => {
  store.resetFormData();
};

// VipTicketUpdateDTO表单验证规则
const formRules = {
  ticketName: [
    {
      required: true,
      message: '优惠券名称不能为空',
      trigger: 'blur',
    },
    {
      type: 'string',
      message: '优惠券名称必须为字符串',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 100,
      message: '优惠券名称长度必须在1-100个字符之间',
      trigger: 'blur',
    },
  ],
  ticketType: [
    {
      required: true,
      message: '优惠券类型不能为空',
      trigger: 'blur',
    },
  ],
  ticketDescription: [
    {
      type: 'string',
      message: '优惠券描述必须为字符串',
      trigger: 'blur',
    },
  ],
  ticketEffectiveTime: [
    {
      required: true,
      message: '有效天数不能为空',
      trigger: 'blur',
    },
    {
      type: 'number',
      message: '有效天数必须为数字',
      trigger: 'blur',
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value < -1) {
          return callback(new Error('有效天数不能小于-1'));
        }
        callback();
      },
      trigger: 'blur',
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (!Number.isInteger(value)) {
          return callback(new Error('有效天数必须为整数'));
        }
        callback();
      },
      trigger: 'blur',
    },
  ],
  ticketFullPayment: [
    // {
    //   required: true,
    //   message: '限额不能为空',
    //   trigger: 'blur',
    // },
    {
      type: 'number',
      message: '限额必须为数字',
      trigger: 'blur',
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value !== undefined && value < 0) {
          return callback(new Error('限额不能为负数'));
        }
        callback();
      },
      trigger: 'blur',
    },
  ],

  ticketValue: [
    // {
    //   required: true,
    //   message: '优惠券面值不能为空',
    //   trigger: 'blur',
    // },
    {
      type: 'number',
      message: '优惠券面值必须为数字',
      trigger: 'blur',
    },
    // {
    //   validator: (rule: any, value: any, callback: any) => {
    //     if (value !== undefined && value <= 0) {
    //       return callback(new Error('优惠券面值必须大于0'));
    //     }
    //     callback();
    //   },
    //   trigger: 'blur',
    // },
  ],
};
</script>

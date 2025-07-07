<template>
  <Form
    :model="store.formData"
    :rules="store.formRules"
    :showButtons="!disabled"
    :disabled="disabled"
    @submit="handleFormSubmit"
    @reset="handleFormReset"
  >
    <!-- 优惠券名称 -->
    <el-form-item label="优惠券名称" prop="name">
      <el-input v-model="store.formData.couponName" placeholder="请输入优惠券名称" clearable />
    </el-form-item>

    <!-- 优惠券描述 -->
    <el-form-item label="优惠券描述" prop="desc">
      <el-input v-model="store.formData.content" placeholder="请输入优惠券描述" clearable />
    </el-form-item>

    <!-- 优惠券类型 -->
    <el-form-item label="优惠券类型" prop="type">
      <el-select v-model="store.formData.type" placeholder="请选择优惠券类型" clearable>
        <el-option label="体验券" value="151" />
        <el-option label="代金券" value="152" />
      </el-select>
    </el-form-item>

    <!-- 领取后有效天数 -->
    <el-form-item label="领取后" prop="timeLimit">
      <el-input
        v-model.number="store.formData.timeLimit"
        placeholder="请输入有效天数"
        style="width: 120px; margin-right: 8px"
        clearable
      />
      <span>天内有效</span>
    </el-form-item>

    <!-- 限制满额 -->
    <el-form-item label="限制满额" prop="useLimitRule">
      <el-input
        v-model.number="store.formData.useLimitRule.value"
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
    <el-form-item label="代金券面值" prop="limitBuy">
      <el-input
        v-model.number="store.formData.useLimitRule.limitBuy"
        placeholder="请输入代金券面值"
        style="width: 120px; margin-right: 8px"
        clearable
      />
      <span>元</span>
      <div class="rule-tip">
        <span>规则结果：满{{ store.formData.useLimitRule.value }}元，</span>
        <span>可使用优惠券抵扣{{ store.formData.useLimitRule.limitBuy }}元</span>
      </div>
    </el-form-item>

    <!-- 需支付金额 -->
    <el-form-item label="需支付金额" prop="shouldPay">
      <el-input
        v-model.number="store.formData.shouldPay"
        placeholder="请输入需支付金额"
        style="width: 120px; margin-right: 8px"
        clearable
      />
      <span>元</span>
    </el-form-item>
  </Form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import EnumHandler from '@/components/EnumHandler/index.vue';

// 导入枚举数据
import { commissionOptions } from '@/enums/index';
// 引入产品数据仓库
import { useCouponStore } from '@/store/modules/member/memberCoupon';
const store = useCouponStore();
import { useEnumsStore } from '@/store/modules/enums/index';
const enumsStore = useEnumsStore();

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
</script>

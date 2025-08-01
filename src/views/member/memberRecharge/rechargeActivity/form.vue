<template>
  <div>
    <Form
      :model="store.formData"
      :rules="formRules"
      :showButtons="!disabled"
      :disabled="disabled"
      @submit="handleFormSubmit"
      @reset="handleFormReset"
    >
      <!-- 活动名称 -->
      <el-form-item label="活动名称" prop="activeName">
        <el-input v-model="store.formData.activeName" placeholder="请输入活动名称" clearable />
      </el-form-item>

      <!-- 活动时间 -->
      <el-form-item label="活动时间" prop="activeTime">
        <el-date-picker
          v-model="store.formData.activeTime"
          type="daterange"
          unlink-panels
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :shortcuts="shortcuts"
          clearable
        />
      </el-form-item>

      <!-- 活动类型 -->
      <el-form-item label="活动类型" prop="activeType">
        <el-select v-model="store.formData.activeType" placeholder="请选择活动类型" clearable style="width: 160px">
          <el-option v-for="item in activityTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <div>
        <h1 class="title">本金设置</h1>
        <!-- 本金设置 -->
        <el-form-item label="充值本金" prop="activeCapital">
          <el-input-number
            v-model="store.formData.activeCapital"
            :min="0"
            :controls="false"
            placeholder="请输入充值本金"
          />
          <span style="margin-left: 8px">元</span>
        </el-form-item>

        <el-form-item label="消费折扣" prop="activeDiscount">
          <el-input-number
            v-model="store.formData.activeDiscount"
            :min="0"
            :max="100"
            :controls="false"
            placeholder="请输入消费折扣"
          />
          <span style="margin-left: 8px">%</span>
        </el-form-item>

        <el-form-item label="折扣基础" prop="activeBaseOn">
          <el-radio-group v-model="store.formData.activeBaseOn">
            <el-radio v-for="item in discountTypeOptions" :key="item.value" :value="item.value" :label="item.value" />
          </el-radio-group>
        </el-form-item>

        <el-form-item label="跨店结算" prop="isCrossStore">
          <el-switch v-model="store.formData.isCrossStore" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </div>

      <div v-show="store.formData.activeType === '赠送储值金' || store.formData.activeType === '赠送优惠券和储值金'">
        <h1 class="title">赠送金设置</h1>
        <!-- 赠送金设置 -->
        <el-form-item label="赠送金额" prop="activePresent">
          <el-input-number
            v-model="store.formData.activePresent"
            :min="0"
            placeholder="请输入赠送金额"
            :controls="false"
          />
          <span style="margin-left: 8px">元</span>
        </el-form-item>

        <el-form-item label="折扣同本金" prop="isDiscountSameAs">
          <el-switch v-model="store.formData.isDiscountSameAs" :active-value="1" :inactive-value="0" />
        </el-form-item>

        <template v-if="!store.formData.isDiscountSameAs">
          <el-form-item label="消费折扣" prop="activeDiscount">
            <el-input-number
              v-model="store.formData.activeDiscount"
              :min="0"
              :max="100"
              :controls="false"
              placeholder="请输入消费折扣"
            />
            <span style="margin-left: 8px">%</span>
          </el-form-item>

          <el-form-item label="折扣基础" prop="activeBaseOn">
            <el-radio-group v-model="store.formData.activeBaseOn">
              <el-radio v-for="item in discountTypeOptions" :key="item.value" :value="item.value" :label="item.value" />
            </el-radio-group>
          </el-form-item>

          <el-form-item label="跨店结算" prop="isCrossStore">
            <el-switch v-model="store.formData.isCrossStore" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </template>

        <el-form-item label="累加赠送" prop="isAccum">
          <el-checkbox v-model="store.formData.isAccum" :true-label="1" :false-label="0">是否累加</el-checkbox>
          <el-alert type="warning">
            <span style="padding: 0 20px">
              勾选累加后，会根据充值金额累计赠送。比如“充值100送10元”活动，用户充值200则会赠送20元
            </span>
          </el-alert>
        </el-form-item>
      </div>

      <div v-show="store.formData.activeType === '赠送优惠券' || store.formData.activeType === '赠送优惠券和储值金'">
        <h1 class="title">赠送优惠券设置</h1>
      </div>

      <!-- 其他描述 -->
      <el-form-item label="其他描述">
        <el-input
          v-model="store.formData.remark"
          style="width: 240px"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="请输入活动描述"
        />
      </el-form-item>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { activityTypeOptions, discountTypeOptions } from '@/enums/index';
// 引入数据仓库
import { useRechargeActivityStore } from '@/store/modules/member/rechargeActivity';
const store = useRechargeActivityStore();

// 定义组件触发的事件 - 关闭抽屉
const $emit = defineEmits(['close-drawer']);

// 定义组件接收的props - 是否禁用表单
defineProps(['disabled']);

/**
 * 表单提交处理函数
 * @param model 表单数据对象
 */
const handleFormSubmit = async (model: any) => {
  const result = await store.update(model);
  result && $emit('close-drawer');
};

/**
 * 表单重置处理函数
 * 调用数据仓库的重置表单数据方法
 */
const handleFormReset = () => {
  store.resetFormData();
};

// 表单验证规则
const formRules = {
  activeName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  activeTime: [{ required: true, message: '请选择活动时间', trigger: 'blur' }],
  activeType: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  activeCapital: [
    { required: true, message: '请输入充值本金', trigger: 'blur' },
    { type: 'number', message: '请输入有效金额', trigger: 'blur' },
  ],
  activeDiscount: [
    { required: true, message: '请输入消费折扣', trigger: 'blur' },
    { type: 'number', message: '请输入有效折扣', trigger: 'blur' },
  ],
  activeBaseOn: [{ required: true, message: '请选择折扣基础', trigger: 'change' }],
  isCrossStore: [{ required: true, message: '请选择跨店结算', trigger: 'change' }],
  activePresent: [
    { required: true, message: '请输入赠送金额', trigger: 'blur' },
    { type: 'number', message: '请输入有效金额', trigger: 'blur' },
  ],
};

const shortcuts = [
  {
    text: '未来一年',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() + 3600 * 1000 * 24 * 365);
      return [start, end];
    },
  },
  {
    text: '未来两年',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() + 3600 * 1000 * 24 * 365 * 2);
      return [start, end];
    },
  },
  {
    text: '未来三年',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() + 3600 * 1000 * 24 * 365 * 3);
      return [start, end];
    },
  },
  {
    text: '未来五年',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() + 3600 * 1000 * 24 * 365 * 5);
      return [start, end];
    },
  },
  {
    text: '未来十年',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() + 3600 * 1000 * 24 * 365 * 10);
      return [start, end];
    },
  },
];
</script>

<style lang="scss" scoped>
.title {
  color: var(--el-color-info-light-3);
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
}
</style>

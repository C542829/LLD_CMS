<template>
  <div>
    <Form :model="store.formData" :rules="formRules" @submit="handleFormSubmit" @reset="handleFormReset">
      <!-- 关联门店 -->
      <template v-if="userStore.isAdmin">
        <el-form-item label="关联门店" prop="orgIds">
          <OrgSelect v-model="store.formData.orgIds" />
        </el-form-item>
      </template>

      <!-- 提成规则名称 -->
      <el-form-item label="提成规则名称" prop="rechargeRoleName">
        <el-input v-model="store.formData.rechargeRoleName" clearable class="w-240" placeholder="请输入提成规则名称" />
      </el-form-item>

      <!-- 提成类型 -->
      <el-form-item label="提成类型" prop="commissionType">
        <el-radio-group v-model="store.formData.commissionType">
          <el-radio
            v-for="item in commissionTypeOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            :border="true"
          />
        </el-radio-group>
      </el-form-item>

      <!-- 固定金额 -->
      <template v-if="store.formData.commissionType === CommissionType.FixedAmount">
        <el-form-item label="提成值" prop="rechargeCommissionValue">
          <el-input-number v-model="store.formData.rechargeCommissionValue" :controls="false" class="w-120">
            <template #suffix>元</template>
          </el-input-number>
        </el-form-item>
      </template>

      <!-- 比例提成 -->
      <template v-if="store.formData.commissionType === CommissionType.Proportion">
        <el-form-item label="提成比例" prop="rechargeCommissionValue">
          <el-input-number
            v-model="store.formData.rechargeCommissionValue"
            :min="0"
            :max="100"
            :controls="false"
            class="w-120"
          >
            <template #suffix>%</template>
          </el-input-number>
        </el-form-item>
      </template>

      <!-- 其他描述 -->
      <el-form-item label="其他描述">
        <el-input
          v-model="store.formData.remark"
          :autosize="{ minRows: 2, maxRows: 4 }"
          class="w-240"
          type="textarea"
          placeholder="请输入其他描述"
        />
      </el-form-item>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { CommissionType, commissionTypeOptions } from '@/enums';
// 引入数据仓库
import { useRechargeCommissionRulesStore } from '@/store/modules/setGroup/rechargeCommissionRules';
import useUserStore from '@/store/modules/acl/user';

const store = useRechargeCommissionRulesStore();
const userStore = useUserStore();

// 定义组件触发的事件 - 关闭抽屉
const $emit = defineEmits(['close-drawer']);

onMounted(() => {});

/**
 * 表单提交处理函数
 * @param model 表单数据对象
 */
const handleFormSubmit = async (model: any) => {
  const result = await store.updateData(model);
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
  orgIds: [{ required: true, message: '请选择关联门店', trigger: 'blur' }],
  rechargeRoleName: [{ required: true, message: '请输入提成规则名称', trigger: 'blur' }],
  rechargePrice: [
    { required: true, message: '请输入充值金额', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
  ],
  commissionType: [{ required: true, message: '请选择提成类型', trigger: 'blur' }],
  double: [{ required: true, message: '是否倍数叠加', trigger: 'blur' }],
  rechargeCommissionValue: [
    { required: true, message: '请输入提成值', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
  ],
  remark: [{ required: false, message: '请输入其他描述', trigger: 'blur' }],
};
</script>

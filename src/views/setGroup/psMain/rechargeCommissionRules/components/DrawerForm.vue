<template>
  <Drawer v-model="drawerVisible" :title="drawerTitle" @closed="handleDrawerClose">
    <Form
      :model="formdata"
      :rules="formRules"
      :showButtons="!formDisabled"
      :disabled="formDisabled"
      :loading="submitLoading"
      @submit="handleFormSubmit"
      @reset="handleFormReset"
    >
      <!-- 关联门店 -->
      <template v-if="userStore.isAdmin">
        <el-form-item label="关联门店" prop="orgIds">
          <OrgSelect v-model="formdata.orgIds" />
        </el-form-item>
      </template>

      <!-- 提成规则名称 -->
      <el-form-item label="提成规则名称" prop="rechargeRoleName">
        <el-input v-model="formdata.rechargeRoleName" clearable class="w-240" placeholder="请输入提成规则名称" />
      </el-form-item>

      <!-- 提成类型 -->
      <el-form-item label="提成类型" prop="commissionType">
        <el-radio-group v-model="formdata.commissionType">
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
      <template v-if="formdata.commissionType === CommissionType.FixedAmount">
        <el-form-item label="提成值" prop="rechargeCommissionValue">
          <el-input-number v-model="formdata.rechargeCommissionValue" :controls="false" class="w-120">
            <template #suffix>元</template>
          </el-input-number>
        </el-form-item>
      </template>

      <!-- 比例提成 -->
      <template v-if="formdata.commissionType === CommissionType.Proportion">
        <el-form-item label="提成比例" prop="rechargeCommissionValue">
          <el-input-number
            v-model="formdata.rechargeCommissionValue"
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
          v-model="formdata.remark"
          :autosize="{ minRows: 2, maxRows: 4 }"
          class="w-240"
          type="textarea"
          placeholder="请输入其他描述"
        />
      </el-form-item>
    </Form>

    <!-- 抽屉操作按钮 -->
    <div v-show="formDisabled" class="drawer-buttons">
      <el-button @click="drawerVisible = false">取消</el-button>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import OrgSelect from '@/components/FormComponents/OrgSelect.vue';
import { ref, computed, watch } from 'vue';
import { cloneDeep } from 'lodash';
import { CommissionType, commissionTypeOptions, Status } from '@/enums/index';
import {
  type Types,
  reqAddRechargeCommissionRules,
  reqUpdateRechargeCommissionRules,
} from '@/api/setGroup/rechargeCommissionRules';
import useUserStore from '@/store/modules/acl/user';
import Message from '@/components/Message';

const userStore = useUserStore();

const DEFAULT_FORMDATA: Types.RechargeRoleCreateDTO = {
  rechargeRoleName: '',
  commissionType: CommissionType.Proportion,
  rechargeCommissionValue: undefined,
  status: Status.Enabled,
  orgIds: [],
  remark: '',
};

interface Props {
  type: DialogType;
  modelValue: boolean;
  data?: Types.RechargeRoleVO;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  modelValue: false,
});

const emit = defineEmits(['update:model-value', 'close', 'success']);

watch(
  () => props.modelValue,
  (newVal) => {
    drawerVisible.value = newVal;
  },
);

const drawerVisible = ref(false);
const submitLoading = ref(false);
const formdata = ref<Types.RechargeRoleCreateDTO>(cloneDeep(DEFAULT_FORMDATA));

const drawerTitle = computed(() => {
  switch (props.type) {
    case 'add':
      formdata.value = cloneDeep(DEFAULT_FORMDATA);
      return '新增充值提成规则信息';
    case 'edit':
      formdata.value = {
        ...cloneDeep(props.data!),
        orgIds: props.data!.orgs?.map((item) => item.id!) ?? [],
      } as Types.RechargeRoleCreateDTO;
      return '修改充值提成规则信息';
    default:
      formdata.value = cloneDeep(props.data) as Types.RechargeRoleCreateDTO;
      return '充值提成规则信息';
  }
});

const formDisabled = computed(() => props.type === 'view');

const handleDrawerClose = () => {
  emit('update:model-value', false);
  emit('close');
};

const handleFormSubmit = async () => {
  try {
    submitLoading.value = true;
    const res = (formdata.value as any).id
      ? await reqUpdateRechargeCommissionRules(formdata.value as Types.RechargeRoleUpdateDTO)
      : await reqAddRechargeCommissionRules(formdata.value as Types.RechargeRoleCreateDTO);
    if (res.code === 10000) {
      Message.success((formdata.value as any).id ? '更新成功' : '添加成功');
      drawerVisible.value = false;
      emit('success');
    }
  } catch (error) {
    console.error(error);
  } finally {
    submitLoading.value = false;
  }
};

const handleFormReset = () => {
  formdata.value = cloneDeep(DEFAULT_FORMDATA);
};

// 表单验证规则
const formRules = {
  orgIds: [{ required: true, message: '请选择关联门店', trigger: 'blur' }],
  rechargeRoleName: [{ required: true, message: '请输入提成规则名称', trigger: 'blur' }],
  commissionType: [{ required: true, message: '请选择提成类型', trigger: 'blur' }],
  rechargeCommissionValue: [
    { required: true, message: '请输入提成值', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
  ],
};
</script>

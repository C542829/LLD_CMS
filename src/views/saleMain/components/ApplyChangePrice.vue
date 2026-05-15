<template>
  <el-dialog v-model="visible" title="店长账号验证" center width="350" @close="handleDialogClose">
    <div class="form-container">
      <Form
        :model="formData"
        :rules="formRules"
        :loading="loading"
        submit-text="验证"
        @submit="handleFormSubmit"
        @reset="handleFormReset"
      >
        <el-form-item label="账号" prop="userCode">
          <el-input v-model="formData.userCode" placeholder="请输入店长账号" clearable />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" type="password" show-password placeholder="请输入店长密码" />
        </el-form-item>
      </Form>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import Message from '@/components/Message';
import { reactive, ref, computed, watch } from 'vue';
import { RoleCode } from '@/enums/index';
import { useMasterDataStore } from '@/store/modules/masterData/index';

const masterDataStore = useMasterDataStore();

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(['update:modelValue', 'confirm']);

/** 双向绑定弹框显隐 */
const visible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const loading = ref(false);
/** 店长用户列表缓存 */
const managerList = computed(() => {
  return masterDataStore.userList.filter((user: any) => user.role.roleCode === RoleCode.StoreManager);
});

const formData = reactive({
  userCode: '',
  password: '',
});

/** 弹框关闭时重置表单 */
const handleDialogClose = () => {
  handleFormReset();
};

const handleFormSubmit = async () => {
  loading.value = true;
  try {
    const { userCode, password } = formData;

    const matchedManager = managerList.value.find(
      (manager: any) => manager.userCode === userCode && manager.userPassword === password,
    );

    if (matchedManager) {
      Message.success('验证通过，已开启改价权限');
      emit('confirm', matchedManager);
      visible.value = false;
    } else {
      Message.error('店长账号或密码错误');
    }
  } finally {
    loading.value = false;
  }
};

/** 重置表单 */
const handleFormReset = () => {
  formData.userCode = '';
  formData.password = '';
};

/** 账号自定义校验 */
const validateUserCode = (_rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入店长账号'));
  } else {
    callback();
  }
};

/** 密码自定义校验 */
const validatePassword = (_rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入店长密码'));
  } else {
    callback();
  }
};

const formRules = {
  userCode: [{ required: true, validator: validateUserCode, trigger: 'blur' }],
  password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
};
</script>
<script lang="ts">
export default {
  name: 'ApplyChangePriceDialog',
};
</script>

<style lang="scss" scoped>
.form-container {
  width: 90%;
  min-width: 260px;
  max-width: 350px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: $main-padding * 2;
  margin-top: 12px;
}
</style>

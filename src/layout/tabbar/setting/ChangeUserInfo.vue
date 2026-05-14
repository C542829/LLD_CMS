<template>
  <Dialog v-model="drawerVisible" :title="drawerTitle" center @closed="handleDrawerClose" style="width: 500px">
    <div class="dialog-container">
      <Form :model="formdata" :rules="formRules" :loading="loading" @submit="handleFormSubmit" @reset="handleFormReset">
        <!-- 人员账号 -->
        <el-form-item label="账号" prop="userCode">
          <el-input v-model="formdata.userCode" clearable disabled class="w-240" placeholder="请输入账号" />
        </el-form-item>

        <!-- 姓名 -->
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="formdata.userName" clearable class="w-240" placeholder="请输入姓名" />
        </el-form-item>

        <!-- 手机号 -->
        <el-form-item label="手机号" prop="userNumber">
          <el-input v-model="formdata.userNumber" clearable class="w-240" placeholder="请输入手机号" />
        </el-form-item>

        <!-- 身份证号 -->
        <el-form-item label="身份证号" prop="userIdCard">
          <el-input v-model="formdata.userIdCard" clearable class="w-240" placeholder="请输入身份证号" />
        </el-form-item>

        <!-- 性别 -->
        <el-form-item label="性别" prop="userSex">
          <el-select v-model="formdata.userSex" class="w-120" placeholder="性别">
            <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <!-- 生日 -->
        <el-form-item label="生日" prop="userBirthday">
          <el-date-picker
            v-model="formdata.userBirthday"
            type="date"
            placeholder="选择生日"
            value-format="YYYY-MM-DD"
            class="w-240"
          />
        </el-form-item>

        <!-- 婚姻状况 -->
        <el-form-item label="婚姻状况" prop="userMarry">
          <el-select v-model="formdata.userMarry" class="w-120" placeholder="婚姻状况">
            <el-option v-for="item in maritalStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <!-- 学历状况 -->
        <el-form-item label="学历状况" prop="userEdu">
          <el-select v-model="formdata.userEdu" class="w-120" placeholder="学历">
            <el-option v-for="item in educationOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <!-- 人员地址 -->
        <el-form-item label="人员地址" prop="userAddress">
          <el-input
            v-model="formdata.userAddress"
            :autosize="{ minRows: 2, maxRows: 4 }"
            class="w-240"
            type="textarea"
            placeholder="请输入居住地址"
          />
        </el-form-item>
      </Form>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Message from '@/components/Message';
import { ref, watch } from 'vue';
import { cloneDeep } from 'lodash';
import { type Types as UserTypes, reqUpdateUser } from '@/api/user/index';
import { sexOptions, maritalStatusOptions, educationOptions } from '@/enums/index';

const DEFAULT_FORMDATA = {
  id: null,
  userCode: '',
  userName: '',
  userNumber: '',
  userSex: 0,
  userBirthday: '',
  userIdCard: '',
  userAddress: '',
  userMarry: '未知',
  userEdu: '未知',
};

//#region 父子组件交互
interface Props {
  modelValue: boolean;
  data: UserInfo;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
});

const emit = defineEmits(['update:model-value', 'refresh']);

watch(
  () => props.modelValue,
  (newVal) => {
    drawerVisible.value = newVal;
    formdata.value = cloneDeep(props.data) || {};
  },
);

const drawerVisible = ref<boolean>(false);

const drawerTitle = '修改个人信息';

const handleDrawerClose = () => {
  handleFormReset();
  emit('update:model-value', false);
};

//#endregion 父子组件交互

//#region 表单

const loading = ref(false);
const formdata = ref<UserInfo>(cloneDeep(DEFAULT_FORMDATA));

// 表单重置
const handleFormReset = () => {
  formdata.value = cloneDeep(DEFAULT_FORMDATA);
};

// 表单提交
const handleFormSubmit = async () => {
  updateUser(formdata.value as UserTypes.UserDTO);
};

/**
 * 修改个人信息
 * @param data 修改用户数据
 */
const updateUser = async (data: UserTypes.UserDTO) => {
  try {
    loading.value = true;
    await reqUpdateUser(data);
    Message.success('更新个人信息成功');
    drawerVisible.value = false;
    emit('refresh');
  } catch (error) {
    console.error('更新个人信息失败', error);
  } finally {
    loading.value = false;
  }
};

//#endregion 表单

// 表单验证规则
const formRules = {
  userName: [
    { required: true, message: '姓名为必填项', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在2到20个字符之间', trigger: 'blur' },
  ],
  userNumber: [
    { required: true, message: '手机号为必填项', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  userIdCard: [
    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号码', trigger: 'blur' },
  ],
  userAddress: [{ max: 200, message: '人员地址长度不能超过200个字符', trigger: 'blur' }],
};
</script>

<style lang="scss" scoped>
.dialog-container {
  width: 360px;
  margin: 0 auto;
}
</style>

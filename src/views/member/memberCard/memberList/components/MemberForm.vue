<template>
  <div class="form-container">
    <!-- 表单 -->
    <Form :model="store.formData" :rules="formRules" @submit="handleFormSubmit" @reset="handleFormReset">
      <!-- 所属门店 -->
      <template v-if="userStore.isAdmin || userStore.isAreaManager">
        <el-form-item label="所属门店" prop="orgId">
          <OrgSelect v-model="store.formData.orgId" :multiple="false" placeholder="所属门店" />
        </el-form-item>
      </template>

      <!-- 姓名 -->
      <el-form-item label="姓名" prop="name">
        <el-input v-model="store.formData.name" clearable class="w-240" placeholder="请输入姓名" />
      </el-form-item>

      <!-- 性别 -->
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="store.formData.gender">
          <el-radio :value="0" :border="true">男</el-radio>
          <el-radio :value="1" :border="true">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 电话号码 -->
      <el-form-item label="电话号码" prop="phoneNumber">
        <el-input v-model="store.formData.phoneNumber" clearable class="w-240" placeholder="请输入电话号码" />
      </el-form-item>

      <!-- 会员密码 -->
      <el-form-item label="会员密码" prop="pwd">
        <el-input v-model="store.formData.pwd" show-password clearable class="w-240" placeholder="请输入会员密码" />
      </el-form-item>

      <!-- 会员生日 -->
      <el-form-item label="会员生日" prop="birthday">
        <el-date-picker
          v-model="store.formData.birthday"
          clearable
          type="date"
          placeholder="选择会员生日"
          value-format="YYYY-MM-DD"
          class="w-240"
        />
      </el-form-item>

      <!-- 会员地址 -->
      <el-form-item label="会员地址" prop="address">
        <el-input
          v-model="store.formData.address"
          clearable
          type="textarea"
          class="w-240"
          placeholder="请输入会员地址"
        />
      </el-form-item>

      <!-- 备注信息 -->
      <el-form-item label="备注信息" prop="remark">
        <el-input
          v-model="store.formData.remark"
          clearable
          type="textarea"
          class="w-240"
          placeholder="请输入备注信息"
        />
      </el-form-item>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref, withDefaults } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/acl/user';
import { useMemberStore } from '@/store/modules/member/member';

const userStore = useUserStore();
const store = useMemberStore();

// 声明路由
const router = useRouter();

const emit = defineEmits(['close-drawer']);

// 表单提交
const handleFormSubmit = async (model: any) => {
  const result = await store.update(model);
  if (result) {
    emit('close-drawer');
    result.id && goRecharge(result.id);
  }
};

// 表单重置
const handleFormReset = () => {
  store.resetFormData();
};

const goRecharge = (id?: number) => {
  router.push({
    path: '/member/memberRecharge',
    query: {
      vipId: id,
    },
  });
};

// 表单验证规则
const formRules = {
  orgId: [{ required: true, message: '请选择所属门店', trigger: 'blur' }],
  cardNumber: [{ required: true, message: '请输入会员卡号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phoneNumber: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '请输入正确的11位手机号', trigger: 'blur' },
  ],
  pwd: [
    { required: true, message: '请输入会员密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20位之间', trigger: 'blur' },
  ],
};
</script>
<script lang="ts">
export default {
  name: 'MemberForm',
};
</script>
<style lang="scss" scoped>
.form-container {
  width: 90%;
  min-width: 260px;
  max-width: 350px;
  margin: 0 auto;
}
</style>

<template>
  <div class="form-container">
    <!-- 表单 -->
    <Form :model="store.formData" :rules="formRules" @submit="handleFormSubmit" @reset="handleFormReset">
      <!-- 会员姓名 -->
      <el-form-item label="会员姓名" prop="infoName">
        <el-input v-model="store.formData.infoName" placeholder="请输入会员姓名" />
      </el-form-item>

      <!-- 会员性别 -->
      <el-form-item label="会员性别" prop="infoGender">
        <el-select v-model="store.formData.infoGender" placeholder="请选择性别">
          <el-option v-for="item in sexOptions" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <!-- 会员手机 -->
      <el-form-item label="会员手机" prop="infoPhoneNumber">
        <el-input v-model="store.formData.infoPhoneNumber" placeholder="请输入会员手机" />
      </el-form-item>

      <!-- 消费密码 -->
      <el-form-item label="消费密码" prop="infoPwd">
        <el-input v-model="store.formData.infoPwd" placeholder="请输入消费密码" />
      </el-form-item>

      <!-- 会员身份 -->
      <el-form-item label="会员身份" prop="infoIdentity">
        <el-select v-model="store.formData.infoIdentity" placeholder="请选择会员身份">
          <el-option v-for="item in vipLevelOptions" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <!-- 会员生日 -->
      <el-form-item label="会员生日" prop="infoBirthday">
        <el-date-picker
          v-model="store.formData.infoBirthday"
          type="date"
          placeholder="选择生日"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <!-- 会员地址 -->
      <el-form-item label="会员地址" prop="infoAddress">
        <el-input v-model="store.formData.infoAddress" type="textarea" placeholder="请输入会员地址" />
      </el-form-item>

      <!-- 备注信息 -->
      <el-form-item label="备注信息" prop="remark">
        <el-input v-model="store.formData.remark" type="textarea" placeholder="请输入备注信息" />
      </el-form-item>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref, withDefaults } from 'vue';
import { vipLevelOptions, sexOptions } from '@/enums';
import { useMemberListStore } from '@/store/modules/member/memberList';
const store = useMemberListStore();

const $emit = defineEmits(['close-drawer']);

// 表单提交
const handleFormSubmit = async (model: any) => {
  const result = await store.update(model);
  result && $emit('close-drawer');
};

// 表单重置
const handleFormReset = () => {
  store.resetFormData();
};

// 表单验证规则
const formRules = {
  infoName: [
    { required: true, message: '请输入会员姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度为2-20个字符', trigger: 'blur' },
  ],
  infoGender: [{ required: false, message: '请选择会员性别', trigger: 'change' }],
  infoPhoneNumber: [
    { required: true, message: '请输入会员手机', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  infoPwd: [
    { required: true, message: '请输入消费密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' },
  ],
  infoIdentity: [{ required: false, message: '请选择会员身份', trigger: 'change' }],
  infoBirthday: [{ required: false, message: '请选择会员生日', trigger: 'change' }],
  infoAddress: [{ max: 200, message: '地址长度不能超过200个字符', trigger: 'blur' }],
  remark: [{ max: 500, message: '备注信息长度不能超过500个字符', trigger: 'blur' }],
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

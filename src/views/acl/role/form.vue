<template>
  <div>
    <Form :model="formData" :rules="formRules" @submit="handleFormSubmit" @reset="handleFormReset">
      <!-- 角色编码 -->
      <el-form-item label="角色编码" prop="roleCode">
        <el-input v-model="formData.roleCode" placeholder="请输入角色编码" clearable />
      </el-form-item>

      <!-- 角色名称 -->
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="formData.roleName" placeholder="请输入角色名称" clearable />
      </el-form-item>

      <!-- 显示顺序 -->
      <el-form-item label="显示顺序" prop="roleSort">
        <el-input-number v-model="formData.roleSort" :min="0" placeholder="请输入显示顺序" />
      </el-form-item>

      <!-- 角色状态 -->
      <el-form-item label="角色状态" prop="roleStatus">
        <el-radio-group v-model="formData.roleStatus">
          <el-radio :value="0">正常</el-radio>
          <el-radio :value="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 备注 -->
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注信息" clearable />
      </el-form-item>
    </Form>
  </div>
</template>

<script setup lang="ts">
// ======================== Props & Emits ========================

/** 组件属性 */
const props = defineProps<{
  /** 表单数据 */
  formData: Record<string, any>;
}>();

/** 组件事件 */
const $emit = defineEmits<{
  /** 表单提交事件 */
  (e: 'submit', model: Record<string, any>): void;
  /** 表单重置事件 */
  (e: 'reset'): void;
  /** 关闭抽屉事件 */
  (e: 'close-drawer'): void;
}>();

// ======================== 方法 ========================

/**
 * 表单提交处理函数
 * @param model 表单数据对象
 */
const handleFormSubmit = (model: Record<string, any>) => {
  $emit('submit', model);
};

/**
 * 表单重置处理函数
 */
const handleFormReset = () => {
  $emit('reset');
};

// ======================== 表单验证规则 ========================

const formRules = {
  roleCode: [{ required: true, message: '角色编码为必填项', trigger: 'blur' }],
  roleName: [{ required: true, message: '角色名称为必填项', trigger: 'blur' }],
  roleSort: [{ type: 'number', message: '请输入有效的显示顺序', trigger: 'blur' }],
  roleStatus: [{ required: false, message: '请选择角色状态', trigger: 'change' }],
};
</script>

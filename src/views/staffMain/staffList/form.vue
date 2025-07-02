<template>
  <div>
    <Form
      :model="store.formData"
      :rules="store.formRules"
      :showButtons="!disabled"
      :disabled="disabled"
      @submit="handleFormSubmit"
      @reset="handleFormReset"
    >
      <!-- 人员编号 -->
      <el-form-item label="人员编号" prop="userCode">
        <el-input v-model="store.formData.userCode" placeholder="请输入人员编号" />
      </el-form-item>

      <!-- 姓名 -->
      <el-form-item label="姓名" prop="userName">
        <el-input v-model="store.formData.userName" placeholder="请输入姓名" />
      </el-form-item>

      <!-- 手机号 -->
      <el-form-item label="手机号" prop="userNumber">
        <el-input v-model="store.formData.userNumber" placeholder="请输入手机号" />
      </el-form-item>

      <!-- 人员职位 -->
      <el-form-item label="人员职位" prop="userPosition">
        <div style="width: 100%; display: flex; gap: 10px">
          <el-select v-model="store.formData.userPosition" style="width: 200px" placeholder="选择职位">
            <el-option
              v-for="item in enumsStore.positionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div><el-button link type="primary" @click="showDialog(0)">职位管理</el-button></div>
        </div>
      </el-form-item>

      <!-- 性别 -->
      <el-form-item label="性别" prop="userSex">
        <div style="width: 100%; display: flex; gap: 10px">
          <el-select v-model="store.formData.userSex" style="width: 200px" placeholder="性别">
            <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </el-form-item>

      <!-- 生日 -->
      <el-form-item label="生日" prop="userBirthday">
        <el-date-picker
          v-model="store.formData.userBirthday"
          type="date"
          placeholder="选择生日"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <!-- 所属部门 -->
      <el-form-item label="所属部门" prop="userDept">
        <div style="width: 100%; display: flex; gap: 10px">
          <el-select v-model="store.formData.deptOptions" style="width: 200px" placeholder="选择职位">
            <el-option
              v-for="item in enumsStore.deptOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div><el-button link type="primary" @click="showDialog(1)">部门管理</el-button></div>
        </div>
      </el-form-item>

      <!-- 入职时间 -->
      <el-form-item label="入职时间" prop="userEntryDate">
        <el-date-picker
          v-model="store.formData.userEntryDate"
          type="date"
          placeholder="选择入职时间"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <!-- 在职状态 -->
      <el-form-item label="在职状态" prop="userStatus">
        <el-select v-model="store.formData.userStatus" style="width: 200px" placeholder="请选择在职状态">
          <el-option v-for="item in employedOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <!-- 身份证号 -->
      <el-form-item label="身份证号" prop="userIdCard">
        <el-input v-model="store.formData.userIdCard" placeholder="请输入身份证号" />
      </el-form-item>

      <!-- 人员地址 -->
      <el-form-item label="人员地址" prop="userAddress">
        <el-input v-model="store.formData.userAddress" placeholder="请输入居住地址" />
      </el-form-item>

      <!-- 婚姻状况 -->
      <el-form-item label="婚姻状况" prop="userMarry">
        <el-select v-model="store.formData.userMarry" style="width: 200px" placeholder="请选择婚姻状况">
          <el-option v-for="item in maritalStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <!-- 学历状况 -->
      <el-form-item label="学历状况" prop="userEdu">
        <el-select v-model="store.formData.userEdu" style="width: 200px" placeholder="请选择学历">
          <el-option v-for="item in educationOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <!-- 人员职称 -->
      <el-form-item label="人员职称" prop="userTitle">
        <div style="display: flex; gap: 10px">
          <el-select v-model="store.formData.userPosition" style="width: 200px" placeholder="选择职位">
            <el-option
              v-for="item in enumsStore.titleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div><el-button link type="primary" @click="showDialog(2)">职称管理</el-button></div>
        </div>
      </el-form-item>

      <!-- 健康证到期 -->
      <el-form-item label="健康证到期" prop="userHealth">
        <el-date-picker
          v-model="store.formData.userHealth"
          type="date"
          placeholder="选择健康证到期时间"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
    </Form>

    <!-- 枚举操作dialog -->
    <template v-if="enumDialog.visible">
      <EnumHandler v-model="enumDialog.visible" :title="enumDialog.title" :config="enumConfig"></EnumHandler>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import EnumHandler from '@/components/EnumHandler/index.vue';

// 导入枚举数据
import { sexOptions, employedOptions, maritalStatusOptions, educationOptions } from '@/enums/index';

// 引入数据仓库
import { useStaffStore } from '@/store/modules/staffMain/staff';
const store = useStaffStore();
import { useEnumsStore } from '@/store/modules/enums/index';
const enumsStore = useEnumsStore();

const $emit = defineEmits(['close-drawer']);

defineProps(['disabled']);

onMounted(() => {
  // 获取职位列表
  enumsStore.setPositionList();
  // 获取部门列表
  enumsStore.setDeptList();
  // 获取职称列表
  enumsStore.setTitleList();
});

// 表单提交
const handleFormSubmit = async (model: any) => {
  const result = await store.updateStaff(model);
  result && $emit('close-drawer');
};

// 表单重置
const handleFormReset = () => {
  store.resetFormData();
};

// #region 枚举操作

// 导入请求方法
import { reqPositionList, reqAddPosition, reqUpdatePosition, reqDelPosition } from '@/api/enums/position';

// dialog 参数
const enumDialog = reactive({
  title: '职位管理',
  visible: false,
});

// 枚举操作配置对象
const enumConfig = ref({
  parentId: 1,
  setListFn: () => {},
  addFn: () => {},
  updateFn: () => {},
  delFn: () => {},
});

// 枚举操作
const showDialog = (operation: number) => {
  if (operation === 0) {
    (enumDialog.title = '职位管理'), (enumDialog.visible = true);
    enumConfig.value = {
      parentId: 1,
      setListFn: reqPositionList,
      addFn: reqAddPosition,
      updateFn: reqUpdatePosition,
      delFn: reqDelPosition,
    };
  }
  if (operation === 1) {
    (enumDialog.title = '部门管理'), (enumDialog.visible = true);
    enumConfig.value = {
      parentId: 1,
      setListFn: reqPositionList,
      addFn: reqAddPosition,
      updateFn: reqUpdatePosition,
      delFn: reqDelPosition,
    };
  }
  if (operation === 2) {
    (enumDialog.title = '职称管理'), (enumDialog.visible = true);
    enumConfig.value = {
      parentId: 1,
      setListFn: reqPositionList,
      addFn: reqAddPosition,
      updateFn: reqUpdatePosition,
      delFn: reqDelPosition,
    };
  }
};
// #endregion
</script>

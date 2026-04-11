<template>
  <Drawer v-model="drawerVisible" :title="drawerTitle" @closed="handleDrawerClose">
    <Form
      :model="formdata"
      :rules="formRules"
      :showButtons="!formDisabled"
      :disabled="formDisabled"
      :loading="loading"
      @submit="handleFormSubmit"
      @reset="handleFormReset"
    >
      <!-- 关联门店 -->
      <template v-if="userStore.isAdmin">
        <el-form-item label="关联门店" prop="orgIds">
          <OrgSelect v-model="formdata.orgIds" />
        </el-form-item>
      </template>
      <!-- 关联门店 -->
      <template v-if="userStore.isAdmin || userStore.isAreaManager">
        <el-form-item label="默认门店" prop="orgId">
          <OrgSelect v-model="formdata.orgId" :multiple="false" />
        </el-form-item>
      </template>

      <!-- 人员账号 -->
      <el-form-item label="账号" prop="userCode">
        <el-input v-model="formdata.userCode" clearable class="w-240" placeholder="请输入账号" />
      </el-form-item>

      <!--密码 -->
      <template v-if="userStore.isAdmin">
        <el-form-item label="密码" prop="userPassword">
          <el-input
            type="password"
            v-model="formdata.userPassword"
            show-password
            class="w-240"
            placeholder="请输入密码"
          />
        </el-form-item>
      </template>

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

      <!-- 分配角色 -->
      <el-form-item label="人员角色" prop="roleId">
        <el-select v-model="formdata.roleId" class="w-120" placeholder="选择角色">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
            :disabled="isDisableRole(item.roleCode as RoleCode)"
          />
        </el-select>
      </el-form-item>

      <!-- 人员职位 -->
      <el-form-item label="人员职位" prop="userPosition">
        <div style="width: 100%; display: flex; gap: 10px">
          <el-select v-model="formdata.userPosition" class="w-120" placeholder="选择职位">
            <el-option
              v-for="item in positionList"
              :key="item.itemValue"
              :label="item.itemLabel"
              :value="item.itemValue"
            />
          </el-select>
          <div><el-button link type="primary" @click="positionMgr">职位管理</el-button></div>
        </div>
      </el-form-item>

      <!-- 所属部门 -->
      <el-form-item label="所属部门" prop="userDept">
        <div style="width: 100%; display: flex; gap: 10px">
          <el-select v-model="formdata.deptOptions" class="w-120" placeholder="选择职位">
            <el-option v-for="item in deptList" :key="item.itemValue" :label="item.itemLabel" :value="item.itemValue" />
          </el-select>
          <div><el-button link type="primary" @click="deptMgr">部门管理</el-button></div>
        </div>
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

      <!-- 入职时间 -->
      <el-form-item label="入职时间" prop="userEntryDate">
        <el-date-picker
          v-model="formdata.userEntryDate"
          type="date"
          placeholder="选择入职时间"
          value-format="YYYY-MM-DD"
          class="w-240"
        />
      </el-form-item>

      <!-- 健康证到期 -->
      <el-form-item label="健康证到期" prop="userHealth">
        <el-date-picker
          v-model="formdata.userHealth"
          type="date"
          placeholder="选择健康证到期时间"
          value-format="YYYY-MM-DD"
          class="w-240"
        />
      </el-form-item>

      <!-- 在职状态 -->
      <el-form-item label="在职状态" prop="userStatus">
        <el-select v-model="formdata.userStatus" class="w-120" placeholder="在职状态">
          <el-option v-for="item in employedOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
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
        <!-- <el-input v-model="formdata.userAddress" clearable class="w-240" placeholder="请输入居住地址" /> -->
        <el-input
          v-model="formdata.userAddress"
          :autosize="{ minRows: 2, maxRows: 4 }"
          class="w-240"
          type="textarea"
          placeholder="请输入居住地址"
        />
      </el-form-item>
    </Form>

    <!-- 抽屉操作按钮 -->
    <div v-show="formDisabled" class="drawer-buttons">
      <el-button @click="drawerVisible = false">取消</el-button>
    </div>
  </Drawer>
  <EnumHandler
    v-model="enumHandler.visible"
    :title="enumHandler.title"
    :dictCode="enumHandler.dictCode"
    @refresh="initEnum"
  />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { cloneDeep } from 'lodash';
import { type Types } from '@/api/acl/role';
import { type Types as UserTypes, reqAddUser, reqUpdateUser } from '@/api/user/index';
import { DEFAULT_FORMDATA } from '../utils/index';
import { sexOptions, employedOptions, maritalStatusOptions, educationOptions } from '@/enums/index';
import { useEnumStore, DictCode } from '@/store/modules/enums/index';
import useUserStore from '@/store/modules/acl/user';
import Message from '@/components/Message';
import { isRoleHigherOrEqual } from '@/utils';

const userStore = useUserStore();
const enumStore = useEnumStore();

//#region 父子组件交互
interface Props {
  type: DialogType;
  modelValue: boolean;
  roleList: Types.RoleInfoVo[];
  data: UserInfo;
}
const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  modelValue: false,
  roleList: () => [],
});
const emit = defineEmits(['update:model-value', 'close', 'close-drawer']);

watch(
  () => props.modelValue,
  (newVal) => {
    drawerVisible.value = newVal;
  },
);

const drawerVisible = ref<boolean>(false);

const drawerTitle = computed(() => {
  switch (props.type) {
    case 'add':
      formdata.value = cloneDeep(DEFAULT_FORMDATA);
      return '新增人员信息';
    case 'edit':
      formdata.value = cloneDeep(props.data);
      formdata.value.roleId = props.data.role?.id;
      formdata.value.orgIds = props.data.orgs?.map((item) => item.id);

      return '修改人员信息';
    default:
      formdata.value = cloneDeep(props.data);
      formdata.value.roleId = props.data.role?.id;
      formdata.value.orgIds = props.data.orgs?.map((item) => item.id);
      return '人员信息';
  }
});

const formDisabled = computed(() => {
  return props.type === 'view';
});

const handleDrawerClose = () => {
  handleFormReset();
  emit('update:model-value', false);
  emit('close');
};

//#endregion 父子组件交互

onMounted(async () => {
  initEnum();
});

//#region 表单

const loading = ref(false);
const formdata = ref<UserInfo>(cloneDeep(DEFAULT_FORMDATA));

// 表单重置
const handleFormReset = () => {
  formdata.value = cloneDeep(DEFAULT_FORMDATA);
};

/**
 * 检查角色是否禁用
 * @param roleCode 角色编码
 * @returns 是否禁用
 */
const isDisableRole = (roleCode: RoleCode) => {
  if (userStore.user.role) {
    return isRoleHigherOrEqual(roleCode, userStore.user?.role?.roleCode as RoleCode);
  }
  return false;
};

// 表单提交
const handleFormSubmit = async (model: any) => {
  if (!formdata.value.orgId) {
    formdata.value.orgId = userStore.user.orgId;
  }
  if (formdata.value.id) {
    updateUser(formdata.value as UserTypes.UserDTO);
  } else {
    addUser(formdata.value as UserTypes.UserDTO);
  }
};

/**
 * 新增员工
 * @param data 添加用户数据
 */
const addUser = async (data: UserTypes.UserDTO) => {
  try {
    loading.value = true;
    const res = await reqAddUser(data);
    // console.log('添加用户成功：', res);
    Message.success('添加用户成功');
    drawerVisible.value = false;
  } catch (error) {
    console.error('添加用户失败：', error);
  } finally {
    loading.value = false;
  }
};

/**
 * 修改员工
 * @param data 修改用户数据
 */
const updateUser = async (data: UserTypes.UserDTO) => {
  try {
    loading.value = true;
    const res = await reqUpdateUser(data);
    // console.log('更新用户成功：', res);
    Message.success('更新用户成功');
    drawerVisible.value = false;
  } catch (error) {
    console.error('更新用户失败：', error);
  } finally {
    loading.value = false;
  }
};

//#endregion 表单

//#region 字典管理

const deptList = ref<any>([]);
const positionList = ref<any>([]);

const initEnum = async () => {
  deptList.value = await enumStore.getDeptList();
  positionList.value = await enumStore.getPositionList();
};

const enumHandler = reactive({
  title: '字典管理',
  visible: false,
  dictCode: '',
  defaultData: <any>[],
});

const deptMgr = () => {
  enumHandler.title = '部门管理';
  enumHandler.dictCode = DictCode.DEPARTMENT;
  enumHandler.visible = true;
};

const positionMgr = () => {
  enumHandler.title = '职位管理';
  enumHandler.dictCode = DictCode.POSITION;
  enumHandler.visible = true;
};

//#endregion 字典管理

// 表单验证规则
const formRules = {
  orgIds: [{ required: true, message: '请选择关联门店', trigger: 'blur' }],
  orgId: [{ required: true, message: '请选择默认门店', trigger: 'blur' }],
  userCode: [{ required: true, message: '人员账号为必填项', trigger: 'blur' }],
  userPassword: [{ required: true, message: '密码为必填项', trigger: 'blur' }],
  userName: [
    { required: true, message: '姓名为必填项', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在2到20个字符之间', trigger: 'blur' },
  ],
  userNumber: [
    { required: true, message: '手机号为必填项', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  roleId: [{ required: true, message: '请选择人员角色', trigger: 'change' }],
  userIdCard: [
    { required: true, message: '身份证号为必填项', trigger: 'blur' },
    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号码', trigger: 'blur' },
  ],
  userAddress: [{ max: 200, message: '人员地址长度不能超过200个字符', trigger: 'blur' }],
  userBirthday: [{ required: true, message: '出生日期为必填项', trigger: 'blur' }],
};
</script>

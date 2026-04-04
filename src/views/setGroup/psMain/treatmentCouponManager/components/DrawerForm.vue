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
          <!-- <el-select
            v-model="formdata.orgIds"
            placeholder="关联门店"
            class="w-240"
            value-key="id"
            clearable
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="1"
          >
            <el-option v-for="item in dataEnumStore.orgList" :key="item.id" :label="item.orgName" :value="item.id" />
          </el-select> -->
        </el-form-item>
      </template>

      <!-- 疗程券编码 -->
      <el-form-item label="疗程券编码" prop="encode">
        <el-input v-model="formdata.encode" clearable class="w-240" placeholder="请输入疗程券编码" />
      </el-form-item>

      <!-- 疗程券名称（必填） -->
      <el-form-item label="疗程券名称" prop="name">
        <el-input v-model="formdata.name" clearable class="w-240" placeholder="请输入疗程券名称" />
      </el-form-item>

      <!-- 价格设置 -->
      <el-form-item label="价格设置">
        <Card>
          <el-form-item label="疗程价：" prop="price" class="form-item-m-l-0">
            <el-input-number v-model="formdata.price" :controls="false" class="w-130">
              <template #suffix>元</template>
            </el-input-number>
          </el-form-item>
        </Card>
      </el-form-item>

      <!-- 提成类型 -->
      <el-form-item label="提成类型" prop="type">
        <el-radio-group v-model="formdata.type">
          <el-radio
            v-for="item in commissionTypeOptions"
            :value="item.value"
            :label="item.label"
            :key="item.value"
            :border="true"
          />
        </el-radio-group>
      </el-form-item>

      <!-- 固定金额 -->
      <template v-if="formdata.type === CommissionType.FixedAmount">
        <el-form-item label="提成值" prop="commissionValue">
          <el-input-number v-model="formdata.commissionValue" :controls="false" class="w-120">
            <template #suffix>元</template>
          </el-input-number>
        </el-form-item>
      </template>

      <!-- 比例提成 -->
      <template v-if="formdata.type === CommissionType.Proportion">
        <el-form-item label="提成比例" prop="commissionValue" style="margin-bottom: 15px">
          <el-input-number v-model="formdata.commissionValue" :controls="false" class="w-120">
            <template #suffix>%</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="提成基准" prop="commissionBase">
          <el-select v-model="formdata.commissionBase" class="w-120">
            <el-option v-for="item in commissionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </template>

      <el-form-item label="优惠券" prop="ticketIds">
        <MultipleSelect
          v-model="formdata.vipTicketList"
          :displayProps="defaultProps"
          @visible-change="visibleChange"
          value-key="vipTicketId"
          class="w-240"
        >
          <el-option v-for="item in couponOptions" :key="item.vipTicketId" :label="item.vipTicketName" :value="item" />
        </MultipleSelect>
      </el-form-item>

      <!-- 其他描述 -->
      <el-form-item label="其他描述" prop="remark">
        <el-input v-model="formdata.remark" class="w-240" type="textarea" placeholder="请输入其他描述" />
      </el-form-item>
    </Form>

    <!-- 抽屉操作按钮 -->
    <div v-show="formDisabled" class="drawer-buttons">
      <el-button @click="drawerVisible = false">取消</el-button>
    </div>
  </Drawer>
  <EnumHandler v-model="enumHandler.visible" :title="enumHandler.title" :dictCode="enumHandler.dictCode" />
</template>

<script setup lang="ts">
import EnumHandler from '@/components/EnumHandler/index.vue';
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { cloneDeep } from 'lodash';
import { type Types } from '@/api/acl/role';
import { type Types as UserTypes, reqAddUser, reqUpdateUser } from '@/api/user/index';
import { DEFAULT_FORMDATA } from '../utils/index';
import { sexOptions, employedOptions, maritalStatusOptions, educationOptions } from '@/enums/index';
import { useEnumStore, Enums } from '@/store/modules/enums/index';
import useUserStore from '@/store/modules/acl/user';
import Message from '@/components/Message';

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

// 表单提交
const handleFormSubmit = async (model: any) => {
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
    Message.success('添加用户成功');
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
  enumHandler.dictCode = deptList?.value?.[0]?.dictCode || Enums.DEPARTMENT;
  enumHandler.visible = true;
};

const positionMgr = () => {
  enumHandler.title = '职位管理';
  enumHandler.dictCode = positionList?.value?.[0]?.dictCode || Enums.POSITION;
  enumHandler.visible = true;
};

//#endregion 字典管理

// 表单验证规则
const formRules = {
  userCode: [{ required: true, message: '人员编号为必填项', trigger: 'blur' }],
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
    { required: true, message: '姓名为必填项', trigger: 'blur' },
    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号码', trigger: 'blur' },
  ],
  userAddress: [{ max: 200, message: '人员地址长度不能超过200个字符', trigger: 'blur' }],
  userBirthday: [{ required: true, message: '出生日期为必填项', trigger: 'blur' }],
};
</script>

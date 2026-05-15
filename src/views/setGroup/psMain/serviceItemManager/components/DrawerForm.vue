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

      <!-- 项目编码 -->
      <el-form-item label="项目编码" prop="itemEncode">
        <el-input v-model="formdata.itemEncode" class="w-240" placeholder="请输入项目编码" clearable />
      </el-form-item>

      <!-- 项目名称 -->
      <el-form-item label="项目名称" prop="itemName">
        <el-input v-model="formdata.itemName" class="w-240" placeholder="请输入项目名称" clearable />
      </el-form-item>

      <!-- 服务时长 -->
      <el-form-item label="服务时长" prop="serverTime">
        <el-input
          v-model.number="formdata.serverTime"
          clearable
          :controls="false"
          placeholder="请输入服务时长"
          class="w-240"
        >
          <template #suffix>分钟</template>
        </el-input>
      </el-form-item>

      <!-- 项目分类 -->
      <el-form-item label="项目分类" prop="category">
        <el-select v-model="formdata.category" placeholder="选择项目分类" style="width: 160px; margin-right: 15px">
          <el-option
            v-for="item in categoryList"
            :key="item.itemValue"
            :label="item.itemLabel"
            :value="item.itemValue"
          />
        </el-select>
        <el-button link type="primary" @click="categoryMgr">分类管理</el-button>
      </el-form-item>

      <!-- 价格设置 -->
      <el-form-item label="价格设置">
        <Card>
          <el-form-item label="标准价：" prop="itemPrice" class="form-item-m-l-0">
            <el-input-number v-model="formdata.itemPrice" :controls="false" class="w-130">
              <template #suffix>元</template>
            </el-input-number>
          </el-form-item>
          <el-form-item label="会员价：" prop="vipItemPrice" class="form-item-m-l-0">
            <el-input-number v-model="formdata.vipItemPrice" :controls="false" class="w-130">
              <template #suffix>元</template>
            </el-input-number>
          </el-form-item>
        </Card>
      </el-form-item>

      <!-- 允许打折 -->
      <el-form-item label="允许打折" prop="isDiscounts">
        <el-switch v-model="formdata.isDiscounts" :active-value="IsDiscount.Yes" :inactive-value="IsDiscount.No" />
      </el-form-item>

      <!-- 提成类型 -->
      <el-form-item label="提成类型" prop="commissionType">
        <el-radio-group v-model.number="formdata.commissionType">
          <el-radio v-for="item in commissionTypeOptions" :value="item.value" :border="true">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 固定金额 -->
      <template v-if="formdata.commissionType === CommissionType.FixedAmount">
        <el-form-item label="提成值(轮牌)" prop="commissionValueRotation">
          <el-input-number v-model.number="formdata.commissionValueRotation" :controls="false" class="w-120">
            <template #suffix>元</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="提成值(点钟)" prop="commissionValueAppointment">
          <el-input-number v-model.number="formdata.commissionValueAppointment" :controls="false" class="w-120">
            <template #suffix>元</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="提成值(加钟)" prop="commissionValueExtend">
          <el-input-number v-model.number="formdata.commissionValueExtend" :controls="false" class="w-120">
            <template #suffix>元</template>
          </el-input-number>
        </el-form-item>
      </template>

      <!-- 比例提成 -->
      <template v-else>
        <el-form-item label="提成值(轮牌)" prop="commissionValueRotation">
          <el-input-number
            v-model.number="formdata.commissionValueRotation"
            :min="0"
            :max="100"
            :controls="false"
            class="w-120"
          >
            <template #suffix>%</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="提成值(点钟)" prop="commissionValueAppointment">
          <el-input-number
            v-model.number="formdata.commissionValueAppointment"
            :min="0"
            :max="100"
            :controls="false"
            class="w-120"
          >
            <template #suffix>%</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="提成值(加钟)" prop="commissionValueExtend">
          <el-input-number
            v-model.number="formdata.commissionValueExtend"
            :min="0"
            :max="100"
            :controls="false"
            class="w-120"
          >
            <template #suffix>%</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="提成价格" prop="commissionBase">
          <el-select v-model="formdata.commissionBase" placeholder="请选择提成基数" class="w-120" clearable>
            <el-option v-for="item in commissionOptions" :label="item.label" :value="item.value" :key="item.value" />
          </el-select>
        </el-form-item>
      </template>

      <!-- 其他描述 -->
      <el-form-item label="其他描述" prop="remark">
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

    <!-- 枚举管理dialog -->
    <EnumHandler
      v-model="enumDialog.visible"
      :title="enumDialog.title"
      :dictCode="enumDialog.dictCode"
      @refresh="initEnum"
    />
  </Drawer>
</template>

<script setup lang="ts">
import EnumHandler from '@/components/EnumHandler/index.vue';
import OrgSelect from '@/components/FormComponents/OrgSelect.vue';
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { cloneDeep } from 'lodash';
import { CommissionType, IsDiscount, commissionTypeOptions, commissionOptions, DictCode, Status } from '@/enums/index';
import { type Types, reqAddServiceItem, reqUpdateServiceItem } from '@/api/setGroup/serviceItem';
import useUserStore from '@/store/modules/acl/user';
import { useDictStore } from '@/store/modules/dict/index';
import { useMasterDataStore } from '@/store/modules/masterData/index';
import Message from '@/components/Message';

const userStore = useUserStore();
const dictStore = useDictStore();
const masterDataStore = useMasterDataStore();

const DEFAULT_FORMDATA: Types.ServerItemCreateDTO = {
  itemEncode: '',
  itemName: '',
  serverTime: 0,
  itemPrice: 0,
  vipItemPrice: 0,
  isDiscounts: IsDiscount.Yes,
  commissionType: CommissionType.FixedAmount,
  commissionValueRotation: 0,
  commissionValueAppointment: 0,
  commissionValueExtend: 0,
  commissionBase: 0,
  itemStatus: Status.Enabled,
  category: '',
  remark: '',
  orgIds: [],
};

interface Props {
  type: DialogType;
  modelValue: boolean;
  data?: Types.ServerItemVO;
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
const formdata = ref<Types.ServerItemCreateDTO & { id?: number }>(cloneDeep(DEFAULT_FORMDATA));

const drawerTitle = computed(() => {
  switch (props.type) {
    case 'add':
      formdata.value = cloneDeep(DEFAULT_FORMDATA);
      return '新增服务项目信息';
    case 'edit':
      formdata.value = { ...cloneDeep(DEFAULT_FORMDATA), ...cloneDeep(props.data) } as Types.ServerItemCreateDTO & {
        id?: number;
      };
      formdata.value = {
        ...cloneDeep(props.data!),
        orgIds: props.data!.orgs?.map((item) => item.id!) ?? [],
      } as Types.ServerItemCreateDTO & { id?: number };
      return '修改服务项目信息';
    default:
      formdata.value = {
        ...cloneDeep(props.data!),
        orgIds: props.data!.orgs?.map((item) => item.id!) ?? [],
      } as Types.ServerItemCreateDTO & { id?: number };
      return '服务项目信息';
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
    const res = formdata.value.id
      ? await reqUpdateServiceItem(formdata.value as Types.ServerItemUpdateDTO)
      : await reqAddServiceItem(formdata.value as Types.ServerItemCreateDTO);
    if (res.code === 10000) {
      Message.success(formdata.value.id ? '更新成功' : '添加成功');
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

onMounted(() => {
  initEnum();
});

//#region 字典管理
const categoryList = ref<any>([]);

const initEnum = async () => {
  categoryList.value = await dictStore.getDictItems(DictCode.ITEM_CATEGORY);
};

const enumDialog = reactive({
  title: '项目分类管理',
  visible: false,
  dictCode: '',
});

const categoryMgr = () => {
  enumDialog.title = '项目分类管理';
  enumDialog.dictCode = DictCode.ITEM_CATEGORY;
  enumDialog.visible = true;
};
//#endregion

const formRules = {
  orgIds: [{ required: true, message: '请选择关联门店', trigger: 'blur' }],
  itemEncode: [{ required: true, message: '请输入服务项目编码', trigger: 'blur' }],
  itemName: [{ required: true, message: '请输入服务项目名称', trigger: 'blur' }],
  serverTime: [
    { required: true, message: '请输入服务时间', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
  ],
  category: [{ required: true, message: '请选择服务项目分类', trigger: 'blur' }],
  itemPrice: [{ required: true, message: '请输入服务项目价格', trigger: 'blur' }],
  vipItemPrice: [{ required: true, message: '请输入会员价格', trigger: 'blur' }],
  isDiscounts: [{ required: true, message: '请选择是否参与折扣卡打折', trigger: 'blur' }],
  commissionType: [{ required: true, message: '请选择提成类型', trigger: 'blur' }],
  commissionValueRotation: [
    { required: true, message: '请输入提成值(轮牌)', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
  ],
  commissionValueAppointment: [
    { required: true, message: '请输入提成值(点钟)', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
  ],
  commissionValueExtend: [
    { required: true, message: '请输入提成值(加钟)', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
  ],
  commissionBase: [{ required: true, message: '请选择提成价格', trigger: 'blur' }],
};
</script>

<style lang="scss" scoped>
.form-item-m-l-0 {
  :deep(.el-form-item__label-wrap) {
    margin-left: 0 !important;
  }
}
</style>

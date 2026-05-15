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

      <!-- 产品编码 -->
      <el-form-item label="产品编码" prop="productEncode">
        <el-input v-model="formdata.productEncode" class="w-240" placeholder="请输入产品编码" clearable />
      </el-form-item>

      <!-- 产品名称 -->
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="formdata.productName" class="w-240" placeholder="请输入产品名称" clearable />
      </el-form-item>

      <!-- 产品单位 -->
      <el-form-item label="产品单位" prop="unit">
        <el-select v-model="formdata.unit" placeholder="选择产品单位" style="width: 160px; margin-right: 15px">
          <el-option
            v-for="item in unitOptions"
            :key="item.itemValue"
            :label="item.itemLabel"
            :value="item.itemValue"
          />
        </el-select>
        <el-button link type="primary" @click="unitMgr">单位管理</el-button>
      </el-form-item>

      <!-- 产品分类 -->
      <el-form-item label="产品分类" prop="category">
        <el-select v-model="formdata.category" placeholder="选择产品分类" style="width: 160px; margin-right: 15px">
          <el-option
            v-for="item in productCategoryList"
            :key="item.itemValue"
            :label="item.itemLabel"
            :value="item.itemValue"
          />
        </el-select>
        <el-button link type="primary" @click="productCategoryMgr">分类管理</el-button>
      </el-form-item>

      <!-- 价格设置 -->
      <el-form-item label="价格设置">
        <Card>
          <el-form-item label="标准价：" prop="productPrice">
            <el-input-number v-model="formdata.productPrice" :controls="false" class="w-130">
              <template #suffix>元</template>
            </el-input-number>
          </el-form-item>
          <el-form-item label="会员价：" prop="vipProductPrice">
            <el-input-number v-model="formdata.vipProductPrice" :controls="false" class="w-130">
              <template #suffix>元</template>
            </el-input-number>
          </el-form-item>
        </Card>
      </el-form-item>

      <!-- 允许打折 -->
      <el-form-item label="允许打折" prop="isDiscount">
        <el-switch v-model="formdata.isDiscount" :active-value="IsDiscount.Yes" :inactive-value="IsDiscount.No" />
      </el-form-item>

      <!-- 提成类型 -->
      <el-form-item label="提成类型" prop="commissionType">
        <el-radio-group v-model="formdata.commissionType">
          <el-radio v-for="item in commissionTypeOptions" :value="item.value" :border="true">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 固定金额 -->
      <template v-if="formdata.commissionType === CommissionType.FixedAmount">
        <el-form-item label="提成值" prop="commissionValue">
          <el-input-number v-model="formdata.commissionValue" :controls="false" class="w-120">
            <template #suffix>元</template>
          </el-input-number>
        </el-form-item>
      </template>

      <!-- 比例提成 -->
      <template v-if="formdata.commissionType === CommissionType.Proportion">
        <el-form-item label="提成比例" prop="commissionValue" style="margin-bottom: 15px">
          <el-input-number v-model="formdata.commissionValue" :controls="false" class="w-120">
            <template #suffix>%</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="价格类型" prop="commissionBase">
          <el-select v-model="formdata.commissionBase" class="w-120">
            <el-option v-for="item in commissionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </template>

      <!-- 其他描述 -->
      <el-form-item label="其他描述">
        <el-input
          v-model="formdata.remark"
          :autosize="{ minRows: 2, maxRows: 4 }"
          class="w-240"
          type="textarea"
          placeholder="请输入产品描述"
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
import Message from '@/components/Message';
import EnumHandler from '@/components/EnumHandler/index.vue';
import OrgSelect from '@/components/FormComponents/OrgSelect.vue';
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { cloneDeep } from 'lodash';
import { commissionOptions, CommissionType, IsDiscount, commissionTypeOptions, DictCode, Status } from '@/enums/index';
import { type Types, reqAddProduct, reqUpdateProduct } from '@/api/setGroup/product';
import useUserStore from '@/store/modules/acl/user';
import { useDictStore } from '@/store/modules/dict/index';

const userStore = useUserStore();
const dictStore = useDictStore();

const DEFAULT_FORMDATA: Types.ProductDTO = {
  id: undefined,
  productEncode: '',
  productName: '',
  unit: '',
  category: '',
  productPrice: undefined,
  vipProductPrice: undefined,
  isDiscount: IsDiscount.Yes,
  commissionType: CommissionType.FixedAmount,
  commissionValue: undefined,
  commissionBase: undefined,
  remark: '',
  productStatus: Status.Enabled,
  orgIds: [],
};

interface Props {
  type: DialogType;
  modelValue: boolean;
  data?: Types.ProductInfoVO;
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
const formdata = ref<Types.ProductDTO>(cloneDeep(DEFAULT_FORMDATA));

const drawerTitle = computed(() => {
  switch (props.type) {
    case 'add':
      formdata.value = cloneDeep(DEFAULT_FORMDATA);
      return '新增产品信息';
    case 'edit':
      formdata.value = {
        ...cloneDeep(props.data!),
        orgIds: props.data!.orgs?.map((item: { id: number }) => item.id!) ?? [],
      } as Types.ProductDTO;
      return '修改产品信息';
    default:
      formdata.value = {
        ...cloneDeep(props.data!),
        orgIds: props.data!.orgs?.map((item: { id: number }) => item.id!) ?? [],
      } as Types.ProductDTO;
      return '产品信息';
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
      ? await reqUpdateProduct(formdata.value as Types.ProductDTO)
      : await reqAddProduct(formdata.value as Types.ProductDTO);
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
const unitOptions = ref<any>([]);
const productCategoryList = ref<any>([]);
const initEnum = async () => {
  unitOptions.value = await dictStore.getDictItems(DictCode.UNIT);
  productCategoryList.value = await dictStore.getDictItems(DictCode.PRODUCT_CATEGORY);
};

const enumDialog = reactive({
  title: '单位管理',
  visible: false,
  dictCode: '',
});

const unitMgr = () => {
  enumDialog.title = '单位管理';
  enumDialog.dictCode = DictCode.UNIT;
  enumDialog.visible = true;
};

const productCategoryMgr = () => {
  enumDialog.title = '产品分类管理';
  enumDialog.dictCode = DictCode.PRODUCT_CATEGORY;
  enumDialog.visible = true;
};
//#endregion

const formRules = {
  orgIds: [{ required: true, message: '请选择关联门店', trigger: 'blur' }],
  productEncode: [{ required: true, message: '请输入产品编码', trigger: 'blur' }],
  productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  unit: [{ required: true, message: '请选择产品单位', trigger: 'blur' }],
  category: [{ required: true, message: '请选择产品分类', trigger: 'blur' }],
  productPrice: [{ required: true, message: '请输入产品价格', trigger: 'blur' }],
  vipProductPrice: [{ required: true, message: '请输入会员价格', trigger: 'blur' }],
  isDiscount: [{ required: true, message: '请选择是否参与折扣卡打折', trigger: 'blur' }],
  commissionType: [{ required: true, message: '请选择提成类型', trigger: 'blur' }],
  commissionValue: [{ required: true, message: '请输入提成值', trigger: 'blur' }],
  commissionBase: [{ required: true, message: '请选择提成价格类型', trigger: 'blur' }],
};
</script>

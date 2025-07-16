<template>
  <div>
    <Form
      :model="store.formData"
      :rules="formRules"
      :showButtons="!disabled"
      :disabled="disabled"
      @submit="handleFormSubmit"
      @reset="handleFormReset"
    >
      <!-- 产品编码 -->
      <el-form-item label="产品编码" prop="productEncode">
        <el-input v-model="store.formData.productEncode" placeholder="请输入产品编码" />
      </el-form-item>

      <!-- 产品名称 -->
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="store.formData.productName" placeholder="请输入产品名称" />
      </el-form-item>

      <!-- 产品单位 -->
      <el-form-item label="产品单位" prop="ProductUnit">
        <el-select v-model="store.formData.unit" placeholder="选择产品单位" style="width: 200px; margin-right: 15px">
          <el-option v-for="item in enumsStore.unitOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button link type="primary" @click="enumDialog.visible = true">单位管理</el-button>
      </el-form-item>

      <!-- 价格设置 -->
      <el-form-item label="价格设置">
        <Card>
          <el-form-item label="标准价：" prop="productPrice" style="margin-bottom: 15px">
            <el-input-number size="small" v-model="store.formData.productPrice" :controls="false" />
            &nbsp;元
          </el-form-item>
          <el-form-item label="会员价：" prop="vipProductPrice">
            <el-input-number size="small" v-model="store.formData.vipProductPrice" :controls="false" />
            &nbsp;元
          </el-form-item>
        </Card>
      </el-form-item>

      <!-- 允许打折 -->
      <el-form-item label="允许打折" prop="isDiscount">
        <el-switch v-model="store.formData.isDiscount" :active-value="0" :inactive-value="1" />
      </el-form-item>

      <!-- 提成类型 -->
      <el-form-item label="提成类型" prop="commissioinType">
        <el-radio-group v-model="store.formData.commissioinType">
          <el-radio :value="1" :border="true">固定金额</el-radio>
          <el-radio :value="0" :border="true">比例提成</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 固定金额 -->
      <template v-if="store.formData.commissioinType === 1">
        <el-form-item label="提成值" prop="productCommissionPrice">
          <el-input-number size="small" v-model="store.formData.productCommissionPrice" :controls="false" />
          &nbsp;元
        </el-form-item>
      </template>

      <!-- 比例提成 -->
      <template v-if="store.formData.commissioinType === 0">
        <el-form-item label="提成比例" prop="productCommissionValue" style="margin-bottom: 15px">
          <el-input-number size="small" v-model="store.formData.productCommissionValue" :controls="false" />
          &nbsp;%
        </el-form-item>
        <el-form-item label="价格类型" prop="productCommissionValueType">
          <el-select v-model="store.formData.productCommissionValueType" style="width: 200px">
            <el-option v-for="item in commissionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </template>

      <!-- 其他描述 -->
      <el-form-item label="其他描述">
        <el-input
          v-model="store.formData.remark"
          style="width: 240px"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="请输入产品描述"
        />
      </el-form-item>
    </Form>

    <!-- 枚举管理dialog -->
    <template v-if="enumDialog.visible">
      <EnumHandler v-model="enumDialog.visible" :title="enumDialog.title" :config="enumConfig"></EnumHandler>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import EnumHandler from '@/components/EnumHandler/index.vue';

// 导入枚举数据
import { commissionOptions } from '@/enums/index';

// 引入数据仓库
import { useProductStore } from '@/store/modules/setGroup/product';
const store = useProductStore();
import { useEnumsStore } from '@/store/modules/enums/index';
const enumsStore = useEnumsStore();

// 定义组件触发的事件 - 关闭抽屉
const $emit = defineEmits(['close-drawer']);

// 定义组件接收的props - 是否禁用表单
defineProps(['disabled']);

onMounted(() => {});

/**
 * 表单提交处理函数
 * @param model 表单数据对象
 */
const handleFormSubmit = async (model: any) => {
  const result = await store.updateData(model);
  result && $emit('close-drawer');
};

/**
 * 表单重置处理函数
 * 调用数据仓库的重置表单数据方法
 */
const handleFormReset = () => {
  store.resetFormData();
};

// 表单验证规则
const formRules = {
  productEncode: [{ required: false, message: '请输入产品编码', trigger: 'blur' }],
  productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  ProductUnit: [{ required: true, message: '请输入产品单位', trigger: 'blur' }],
  productPrice: [{ required: true, message: '请输入产品价格', trigger: 'blur' }],
  vipProductPrice: [{ required: true, message: '请输入会员价格', trigger: 'blur' }],
  productCommissionValue: [{ required: false, message: '请输入提成价格', trigger: 'blur' }],
  productCommissionPrice: [{ required: false, message: '请输入提成比例', trigger: 'blur' }],
  productCommissionValueType: [{ required: false, message: '请选择提成价格类型', trigger: 'blur' }],
};

// 导入请求方法
import { reqPositionList, reqAddPosition, reqUpdatePosition, reqDelPosition } from '@/api/enums/position';

// dialog 参数
const enumDialog = reactive({
  title: '单位管理',
  visible: false,
});

// 枚举操作配置对象
const enumConfig = ref({
  parentId: 1,
  setListFn: reqPositionList,
  addFn: reqAddPosition,
  updateFn: reqUpdatePosition,
  delFn: reqDelPosition,
});
</script>

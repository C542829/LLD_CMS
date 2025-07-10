<template>
  <div>
    <Form
      :model="productStore.formData"
      :rules="productStore.formRules"
      :showButtons="!disabled"
      :disabled="disabled"
      @submit="handleFormSubmit"
      @reset="handleFormReset"
    >
      <!-- 产品编码 -->
      <el-form-item label="产品编码" prop="productEncode">
        <el-input v-model="productStore.formData.productEncode" placeholder="请输入产品编码" />
      </el-form-item>

      <!-- 产品名称 -->
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="productStore.formData.productName" placeholder="请输入产品名称" />
      </el-form-item>

      <!-- 商品单位 -->
      <el-form-item label="商品单位" prop="ProductUnit">
        <div style="display: flex; gap: 10px">
          <el-select v-model="productStore.formData.unit" style="width: 200px" placeholder="选择商品单位">
            <el-option
              v-for="item in enumsStore.unitOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div><el-button link type="primary" @click="enumDialog.visible = true">单位管理</el-button></div>
        </div>
      </el-form-item>

      <!-- 价格设置 -->
      <el-form-item label="价格设置">
        <Card>
          <el-form-item label="标准价：" prop="productPrice" style="margin-bottom: 15px">
            <el-input-number size="small" v-model="productStore.formData.productPrice" :controls="false" />
            &nbsp;元
          </el-form-item>
          <el-form-item label="会员价：" prop="vipProductPrice">
            <el-input-number size="small" v-model="productStore.formData.vipProductPrice" :controls="false" />
            &nbsp;元
          </el-form-item>
        </Card>
      </el-form-item>

      <!-- 允许打折 -->
      <el-form-item label="允许打折" prop="isDiscount">
        <el-switch v-model="productStore.formData.isDiscount" :active-value="0" :inactive-value="1" />
      </el-form-item>

      <!-- 提成类型 -->
      <el-form-item label="提成类型" prop="commissioinType">
        <el-radio-group v-model="productStore.formData.commissioinType">
          <el-radio :value="1" :border="true">固定金额</el-radio>
          <el-radio :value="0" :border="true">比例提成</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 固定金额 -->
      <template v-if="productStore.formData.commissioinType === 1">
        <el-form-item label="提成值" prop="productCommissionPrice">
          <el-input-number size="small" v-model="productStore.formData.productCommissionPrice" :controls="false" />
          &nbsp;元
        </el-form-item>
      </template>

      <!-- 比例提成 -->
      <template v-if="productStore.formData.commissioinType === 0">
        <el-form-item label="提成比例" prop="productCommissionValue" style="margin-bottom: 15px">
          <el-input-number size="small" v-model="productStore.formData.productCommissionValue" :controls="false" />
          &nbsp;%
        </el-form-item>
        <el-form-item label="价格类型" prop="productCommissionValueType">
          <el-select v-model="productStore.formData.productCommissionValueType" style="width: 200px">
            <el-option v-for="item in commissionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </template>

      <!-- 其他描述 -->
      <el-form-item label="其他描述">
        <el-input
          v-model="productStore.formData.remark"
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
// 引入产品数据仓库
import { useProductStore } from '@/store/modules/setGroup/product';
const productStore = useProductStore();
import { useEnumsStore } from '@/store/modules/enums/index';
const enumsStore = useEnumsStore();

const $emit = defineEmits(['close-drawer']);

defineProps(['disabled']);

onMounted(() => {
  enumsStore.setUnitList();
});

// 表单提交
const handleFormSubmit = async (model: any) => {
  const result = await productStore.updateProduct(model);
  result && $emit('close-drawer');
};

// 表单重置
const handleFormReset = () => {
  productStore.resetFormData();
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

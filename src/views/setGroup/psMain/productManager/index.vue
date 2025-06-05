<template>
  <div class="main-container">
    <!-- 搜索组件区域 -->
    <Card class="operation-card">
      <div class="header-container">
        <el-button type="primary" @click="showDrawer(0)" class="add-button">添加产品</el-button>
      </div>
      <div class="search-container">
        <div class="search-item">
          <label for="staffStatus" class="search-label">商品状态：</label>
          <el-select v-model="searchParams.productStatus" id="staffStatus" style="width: 120px" placeholder="Select">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="search-item">
          <el-input
            v-model="searchParams.productName"
            :prefix-icon="Search"
            placeholder="编码|产品名称"
            class="search-input"
          >
            <template #append>
              <el-button type="primary" @click="search">搜索</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </Card>

    <!-- 表格组件 -->
    <Card class="table-card">
      <Table :data="tableData" :border="true" :stripe="true" class="table-main">
        <el-table-column prop="productName" label="产品" min-width="120" />
        <el-table-column prop="productEncode" label="编码" min-width="60" />
        <el-table-column prop="unit" label="单位/规格" min-width="100" />
        <el-table-column prop="productPrice" label="标准价(元)" min-width="100" />
        <el-table-column prop="vipProductPrice" label="会员价(元)" min-width="100" />
        <el-table-column prop="isDiscount" label="参与折扣卡打折" min-width="130" />
        <el-table-column label="操作" min-width="150">
          <template #default="scope">
            <div>
              <el-button link type="info" @click="showDrawer(2, scope.row)">更多</el-button>
              <el-button link type="primary" :disabled="!!scope.row.productStatus" @click="showDrawer(1, scope.row)">
                编辑
              </el-button>
              <el-button link type="warning" v-if="scope.row.productStatus" @click="updateProductStatus(scope.row)">
                启用
              </el-button>
              <el-button link type="warning" v-else @click="showConfirm(scope.row)">禁用</el-button>
            </div>
          </template>
        </el-table-column>
      </Table>
    </Card>
  </div>

  <!-- 抽屉表单 -->
  <Drawer v-model="drawer.visible" :title="drawer.title" @close="handleDrawerClose">
    <!-- 表单 -->
    <Form
      :model="formData"
      :rules="formRules"
      :showButtons="!drawer.disabled"
      @submit="handleFormSubmit"
      @reset="handleFormReset"
    >
      <!-- 产品编码 -->
      <el-form-item label="产品编码" prop="productEncode">
        <el-input v-model="formData.productEncode" :disabled="drawer.disabled" placeholder="请输入产品编码" />
      </el-form-item>
      <!-- 产品名称 -->
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="formData.productName" :disabled="drawer.disabled" placeholder="请输入产品名称" />
      </el-form-item>
      <!-- 商品单位 -->
      <el-form-item label="商品单位" prop="ProductUnit">
        <div style="width: 100%; display: flex; gap: 10px">
          <el-select
            v-model="formData.unit"
            :disabled="drawer.disabled"
            style="width: 200px"
            placeholder="选择商品单位"
          >
            <el-option v-for="item in unitOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <div><el-button link type="primary" @click="unitManger">单位管理</el-button></div>
        </div>
      </el-form-item>
      <!-- 价格设置 -->
      <el-form-item label="价格设置">
        <Card>
          <el-form-item label="标准价：" prop="productPrice" style="margin-bottom: 15px">
            <el-input-number
              size="small"
              v-model="formData.productPrice"
              :controls="false"
              :disabled="drawer.disabled"
            />
            &nbsp;元
          </el-form-item>
          <el-form-item label="会员价：" prop="vipProductPrice">
            <el-input-number
              size="small"
              v-model="formData.vipProductPrice"
              :controls="false"
              :disabled="drawer.disabled"
            />
            &nbsp;元
          </el-form-item>
        </Card>
      </el-form-item>
      <!-- 允许打折 -->
      <el-form-item label="允许打折" prop="isDiscount">
        <el-switch
          v-model="formData.isDiscount"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          :active-value="0"
          :inactive-value="1"
          :disabled="drawer.disabled"
        />
      </el-form-item>
      <!-- 提成类型 -->
      <el-form-item label="提成类型" prop="commissioinType">
        <el-radio-group v-model="formData.commissioinType" :disabled="drawer.disabled">
          <el-radio :value="1" :border="true">固定金额</el-radio>
          <el-radio :value="0" :border="true">比例提成</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 固定金额 -->
      <template v-if="formData.commissioinType === 1">
        <el-form-item label="提成值" prop="productCommissionPrice">
          <el-input-number
            size="small"
            v-model="formData.productCommissionPrice"
            :controls="false"
            :disabled="drawer.disabled"
          />
          &nbsp;元
        </el-form-item>
      </template>
      <!-- 比例提成 -->
      <template v-if="formData.commissioinType === 0">
        <el-form-item label="提成比例" prop="productCommissionValue" style="margin-bottom: 15px">
          <el-input-number
            size="small"
            v-model="formData.productCommissionValue"
            :controls="false"
            :disabled="drawer.disabled"
          />
          &nbsp;%
        </el-form-item>
        <el-form-item label="价格类型" prop="productCommissionValueType">
          <el-select v-model="formData.productCommissionValueType" style="width: 200px" :disabled="drawer.disabled">
            <el-option v-for="item in commissionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </template>
      <!-- 其他描述 -->
      <el-form-item label="其他描述">
        <el-input
          v-model="formData.remark"
          style="width: 240px"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :disabled="drawer.disabled"
          type="textarea"
          placeholder="请输入产品描述"
        />
      </el-form-item>

      <!-- 抽屉操作按钮 -->
      <!-- <template #buttons>
        <el-button @click="drawer.visible = false">取消</el-button>
      </template> -->
    </Form>
  </Drawer>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref, onMounted, inject } from 'vue';

// 导入请求方法
import { reqProductList, reqAddProduct, reqUpdateProduct } from '@/api/setGroup/product';
// 导入枚举数据
import { statusOptions, commissionOptions, ReponseCode } from '@/enums/index';

// 引入消息提示组件
const $MessageBox: any = inject('$MessageBox');
const $Notification: any = inject('$Notification');

defineProps({
  title: {
    type: String,
    default: '产品管理',
  },
});

// #region 初始化渲染
const tableData: any = ref([]);
const unitOptions: any = ref([]);

onMounted(() => {
  getProductList();
  unitOptions.value = [
    {
      value: 0,
      label: '盒',
    },
    {
      value: 1,
      label: '个',
    },
    {
      value: 2,
      label: '瓶',
    },
  ];
});
// #endregion

// #region 数据交互

// 初始化
const getProductList = async () => {
  const res = await reqProductList(searchParams.value);
  tableData.value = res.data;
};

// 禁用
const showConfirm = async ($row: any) => {
  const result = await $MessageBox.confirm({
    title: '确认操作',
    message: `你确定要禁用产品【${$row.productName}】吗？`,
    type: 'warning',
  });
  result && updateProductStatus($row);
};

// 修改
const updateProductStatus = async ($row: any) => {
  update($row, (data: any) => {
    data.productStatus = data.productStatus === 0 ? 1 : 0;
    return reqUpdateProduct(data);
  });
};

// 通用的修改函数
const update = async (data: any, callback: Function) => {
  // 浅拷贝避免修改原数据
  data = { ...data };
  // 将数据中的提成比例转为小数
  if (data.productCommissionValue > 1) {
    data.productCommissionValue = data.productCommissionValue / 100;
  }

  // 如果没有产品状态属性赋默认值
  data.productStatus = data?.productStatus || 0;

  // 发送请求
  const res: any = await callback(data);
  if (res.code === ReponseCode.SUCCESS) {
    $Notification.success(res.data); // 显示成功消息
    drawer.value.visible = false; // 关闭抽屉
    getProductList(); // 重新获取数据
  } else {
    $Notification.error(res.data); // 显示错误消息
  }
};

// 单位管理
const unitManger = () => {
  console.log('单位管理');
};

// #endregion

// #region 搜索模块
const searchParams = ref({
  productName: '',
  productStatus: 0,
});

const search = () => {
  getProductList();
};
// #endregion

// #region 表单模块

// 表单数据
const formData: any = ref({});

// 重置表单数据模型
const resetFormData = () => {
  formData.value = {
    id: 0,
    remark: '',
    productName: '',
    productEncode: '',
    productPrice: 0,
    vipProductPrice: 0,
    isDiscount: 0,
    commissioinType: 1,
    productCommissionValue: 0,
    productCommissionPrice: 0,
    productCommissionValueType: 0,
    productStatus: 0,
    unit: 0,
  };
};

// 表单验证规则
const formRules = {
  productEncode: [{ required: false, message: '请输入产品编码', trigger: 'blur' }],
  productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  productPrice: [{ required: true, message: '请输入产品价格', trigger: 'blur' }],
  vipProductPrice: [{ required: true, message: '请输入会员价格', trigger: 'blur' }],
  productCommissionValue: [{ required: false, message: '请输入提成价格', trigger: 'blur' }],
  productCommissionPrice: [{ required: false, message: '请输入提成比例', trigger: 'blur' }],
  productCommissionValueType: [{ required: false, message: '请选择提成价格类型', trigger: 'blur' }],
};

/**
 * 表单提交
 * @param model 表单数据
 */
const handleFormSubmit = async (model: any) => {
  update(model, (data: any) => {
    return data?.id ? reqUpdateProduct(data) : reqAddProduct(data);
  });
};

// 表单重置触发
const handleFormReset = () => {
  resetFormData();
};
// #endregion

// #region 抽屉
const drawer: any = ref({
  title: '新增产品信息',
  visible: false,
  disabled: false,
});

// 抽屉标题
const drawerTitles = ['新增产品信息', '修改产品信息', '产品信息'];

// 添加产品
const showDrawer = (titleIndex: number, $row: any = {}) => {
  // 修改抽屉标题
  drawer.value.title = drawerTitles[titleIndex];
  // 显示抽屉
  drawer.value.visible = true;

  // 如果点击更多 禁用表单
  titleIndex === 2 && (drawer.value.disabled = true);

  // 浅拷贝防止直接操作原对象
  $row = { ...$row };
  // 如果提成比例小于1，将其转为整数
  if ($row && $row.productCommissionValue < 1) {
    $row.productCommissionValue = Math.floor($row.productCommissionValue * 100);
  }
  // 表单数据回显
  if ($row?.id) {
    formData.value = $row;
  } else {
    resetFormData();
  }
};

// 关闭抽屉触发
const handleDrawerClose = () => {
  // 当抽屉关闭时重置表单
  resetFormData();
  // 去除预览禁用
  drawer.value.disabled = false;
};
// #endregion
</script>

<style scoped lang="scss">
.table-main {
  height: 100%;
}

:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

<template>
  <div class="list-container">
    <!-- 搜索组件区域 -->
    <Card class="operation-card">
      <div class="header-container">
        <el-button type="primary" @click="showDrawer(0)" class="add-button">添加产品</el-button>
      </div>
      <div class="search-container">
        <div class="search-item">
          <label for="staffStatus" class="search-label">商品状态：</label>
          <el-select v-model="searchParams.status" id="staffStatus" style="width: 120px" placeholder="Select">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="search-item">
          <el-input v-model="searchParams.word" :prefix-icon="Search" placeholder="编码|产品名称" class="search-input">
            <template #append>
              <el-button @click="search" class="">搜索</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </Card>

    <!-- 表格组件 -->
    <Card class="table-card">
      <Table
        :data="tableData"
        :border="true"
        :stripe="true"
        :pagination="false"
        :total="100"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
        class="table-main"
      >
        <el-table-column prop="productName" label="产品" min-width="120" />
        <el-table-column prop="productEncode" label="编码" min-width="60" />
        <el-table-column prop="unit" label="单位/规格" min-width="100" />
        <el-table-column prop="productPrice" label="标准价(元)" min-width="100" />
        <el-table-column prop="vipProductPrice" label="会员价(元)" min-width="100" />
        <el-table-column prop="isDiscount" label="参与折扣卡打折" min-width="130" />
        <el-table-column label="操作" min-width="150">
          <template #default="scope">
            <div class="operation-bths">
              <el-link type="info" @click="showDrawer(1, scope.row)">更多</el-link>
              <el-link type="primary" @click="showDrawer(2, scope.row)">编辑</el-link>
              <el-link type="warning" @click="disableProduct(scope.row)">禁用</el-link>
            </div>
          </template>
        </el-table-column>
      </Table>
    </Card>
  </div>

  <!-- 抽屉表单 -->
  <Drawer v-model="drawerVisible" :title="drawerTitle" @close="handleDrawerClose">
    <!-- 表单 -->
    <Form :model="formData" :rules="formRules" @submit="handleFormSubmit" @reset="handleFormReset">
      <!-- 产品编码 -->
      <el-form-item label="产品编码" prop="number">
        <el-input v-model="formData.productEncode" placeholder="请输入产品编码"></el-input>
      </el-form-item>
      <!-- 产品名称 -->
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="formData.productName" placeholder="请输入产品名称"></el-input>
      </el-form-item>
      <!-- 商品单位 -->
      <el-form-item label="商品单位">
        <div style="width: 100%; display: flex; gap: 10px">
          <el-select v-model="formData.unit" style="width: 200px" placeholder="选择商品单位">
            <el-option v-for="item in unitOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <div><el-link type="primary" @click="unitManger">单位管理</el-link></div>
        </div>
      </el-form-item>
      <!-- 价格设置 -->
      <el-form-item label="价格设置">
        <Card>
          <el-form-item label="标准价：" style="margin-bottom: 15px">
            <el-input-number size="small" v-model="formData.productPrice" :controls="false" />
            &nbsp;元
          </el-form-item>
          <el-form-item label="会员价：">
            <el-input-number size="small" v-model="formData.vipProductPrice" :controls="false" />
            &nbsp;元
          </el-form-item>
        </Card>
      </el-form-item>
      <!-- 允许打折 -->
      <el-form-item label="允许打折" prop="name">
        <el-switch
          v-model="formData.isDiscount"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          :active-value="true"
          :inactive-value="false"
        />
      </el-form-item>
      <!-- 提成类型 -->
      <el-form-item label="提成类型">
        <el-radio-group v-model="formData.commissionType">
          <el-radio value="1" :border="true">固定金额</el-radio>
          <el-radio value="2" :border="true">比例提成</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 固定金额 -->
      <el-form-item v-show="formData.commissionType == '1'" key="1" label="提成值">
        <el-input-number size="small" v-model="formData.productCommissionPrice" :controls="false" />
        &nbsp;元
      </el-form-item>
      <!-- 比例提成 -->
      <template v-if="formData.commissionType == '2'">
        <el-form-item label="提成比例" style="margin-bottom: 15px">
          <el-input-number size="small" v-model="formData.productCommissionValue" :controls="false" />
          &nbsp;%
        </el-form-item>
        <el-form-item label="提成价格">
          <el-select v-model="formData.commissionRatioType" style="width: 200px">
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
          type="textarea"
          placeholder="请输入产品描述"
        />
      </el-form-item>

      <!-- 抽屉操作按钮 -->
      <template #buttons>
        <el-button @click="drawerVisible = false">取消</el-button>
      </template>
    </Form>
  </Drawer>

  <!-- 对话框 -->
  <!-- <Dialog v-model="dialogVisible" title="这是一个对话框" width="30%" @close="handleDialogClose">
    <div style="padding: 20px">对话框内容</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </span>
    </template>
  </Dialog> -->
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref, onMounted } from 'vue';
import { reqProductList } from '@/api/ps/product';

// #region 初始化渲染
const tableData = ref();
const unitOptions: any = ref([]);
const statusOptions: any = ref([]);
const commissionOptions: any = ref([]);

onMounted(() => {
  // init()
  tableData.value = new Array(30).fill({
    productEncode: '0003',
    productName: '肤康抑菌颗粒',
    unit: '个',
    productPrice: '15',
    vipProductPrice: '10',
    isDiscount: '不允许',
  });

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

  statusOptions.value = [
    {
      value: 'Option1',
      label: '全部状态',
    },
    {
      value: 'Option2',
      label: '启用',
    },
    {
      value: 'Option3',
      label: '禁用',
    },
  ];

  commissionOptions.value = [
    {
      value: 0,
      label: '标准价提成',
    },
    {
      value: 1,
      label: '实收价提成',
    },
  ];
});
// #endregion

// #region 数据交互

// 初始化
const init = async () => {
  const res = await reqProductList();
  tableData.value = res.data;
};

// 添加
const addProduct = () => {
  console.log('添加产品');
};

// 预览单个
const previewProduct = ($row: any) => {
  console.log('预览：', $row);
};

// 修改
const updateProduct = ($row: any) => {
  console.log('修改：', $row);
};

// 禁用
const disableProduct = ($row: any) => {
  console.log('禁用：', $row);
};

// 单位管理
const unitManger = () => {
  console.log('单位管理');
};

// #endregion

// #region 搜索模块
const searchParams = ref({
  word: '',
  status: 'Option2',
});

const search = () => {
  console.log('搜索参数：', searchParams.value);
};

// #endregion

// #region 表格模块
const handlePageChange = (page: number) => {
  console.log('页码变化:', page);
};

const handleSizeChange = (size: number) => {
  console.log('每页条数变化:', size);
};
//#endregion

// #region 表单模块
const formData = ref({
  productEncode: '',
  productName: '',
  unit: '',
  productPrice: 0,
  vipProductPrice: 0,
  isDiscount: 0,
  commissionType: '1',
  productCommissionPrice: 0,
  productCommissionValue: 0,
  commissionRatioType: 0,
  remark: '',
});

const formRules = {
  number: [{ required: false, message: '请输入产品编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
};

const handleFormSubmit = (model: any) => {
  console.log('表单提交:', model);
};

const handleFormReset = () => {
  console.log('表单重置');
};
// #endregion

// #region 抽屉
const drawerTitles = ['新增产品信息', '产品信息', '修改产品信息'];
const drawerTitle = ref(drawerTitles[0]);
const drawerVisible = ref(false);

// 添加产品
const showDrawer = (titleIndex: number, $row?: any) => {
  drawerTitle.value = drawerTitles[titleIndex];
  drawerVisible.value = true;
  switch (titleIndex) {
    case 0:
      addProduct();
      break;
    case 1:
      previewProduct($row);
      break;
    case 2:
      updateProduct($row);
      break;
    default:
      previewProduct($row);
      break;
  }
};

const handleDrawerClose = () => {
  console.log('抽屉关闭事件触发');
};
// #endregion
</script>

<style scoped lang="scss">
.table-main {
  height: 100%;
}

/* 操作按钮布局 */
.operation-bths {
  display: flex;
  gap: $main-padding;
}
</style>

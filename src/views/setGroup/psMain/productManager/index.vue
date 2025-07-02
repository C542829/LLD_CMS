<template>
  <div class="main-container">
    <!-- 搜索组件区域 -->
    <Card class="operation-card">
      <div class="header-container">
        <el-button type="primary" @click="showDrawer(0)" class="add-button">添加产品</el-button>
      </div>
      <div class="search-container">
        <!-- 选择门店 -->
        <div class="search-item" v-if="false">
          <label for="staffStatus" class="search-label">选择门店：</label>
          <el-select v-model="productStore.searchParams.storeId" id="staffStatus" style="width: 120px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <!-- 产品状态 -->
        <div class="search-item">
          <label for="staffStatus" class="search-label">产品状态：</label>
          <el-select v-model="productStore.searchParams.productStatus" id="staffStatus" style="width: 120px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <!-- 搜索框 -->
        <div class="search-item">
          <el-input
            v-model="productStore.searchParams.productName"
            @keydown.enter="search"
            :prefix-icon="Search"
            placeholder="编码 | 产品名称"
            clearable
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
      <Table
        :data="productStore.productList"
        :border="true"
        :stripe="true"
        :row-class-name="getRowClassName"
        class="table-main"
      >
        <el-table-column prop="productName" label="产品" min-width="120" />
        <el-table-column prop="productEncode" label="编码" min-width="60" />
        <el-table-column prop="unit" label="单位/规格" min-width="100" />
        <el-table-column prop="productPrice" label="标准价(元)" min-width="100" />
        <el-table-column prop="vipProductPrice" label="会员价(元)" min-width="100" />
        <el-table-column prop="isDiscountStr" label="参与折扣卡打折" min-width="100" />
        <el-table-column label="操作" min-width="120">
          <template #default="scope">
            <el-button link type="info" @click="showDrawer(2, scope.row)">更多</el-button>
            <el-button link type="primary" :disabled="!!scope.row.productStatus" @click="showDrawer(1, scope.row)">
              编辑
            </el-button>
            <el-button
              link
              type="warning"
              v-if="scope.row.productStatus"
              @click="productStore.updateProductStatus(scope.row)"
            >
              启用
            </el-button>
            <el-button link type="warning" v-else @click="showConfirm(scope.row)">禁用</el-button>
          </template>
        </el-table-column>
      </Table>
    </Card>
  </div>

  <!-- 抽屉表单 -->
  <Drawer v-model="drawer.visible" :title="drawer.title" @close="handleDrawerClose">
    <!-- 表单 -->
    <ProductForm :disabled="drawer.disabled" @close-drawer="drawer.visible = false" />
    <!-- 抽屉操作按钮 -->
    <template v-if="drawer.disabled">
      <div class="drawer-buttons">
        <el-button @click="drawer.visible = false">取消</el-button>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref, onMounted, inject } from 'vue';
import ProductForm from './form.vue';

// 导入枚举数据
import { statusOptions } from '@/enums/index';
// 引入产品数据仓库
import { useProductStore } from '@/store/modules/setGroup/product';
const productStore = useProductStore();

// 引入消息提示组件
const $MessageBox: any = inject('$MessageBox');

onMounted(() => {
  productStore.setProductList();
});

// 搜索产品
const search = () => {
  productStore.setProductList();
};

// 禁用产品
const showConfirm = async ($row: any) => {
  const result = await $MessageBox.confirm({
    title: '确认操作',
    message: `你确定要禁用产品【${$row.productName}】吗？`,
    type: 'warning',
  });
  result && productStore.updateProductStatus($row);
};

const drawer: any = ref({
  title: '新增产品信息',
  visible: false,
  disabled: false,
});

// 抽屉标题
const drawerTitles = ['新增产品信息', '修改产品信息', '产品信息'];

// 打开抽屉
const showDrawer = (titleIndex: number, $row: any = {}) => {
  drawer.value.title = drawerTitles[titleIndex]; // 修改抽屉标题
  drawer.value.visible = true; // 显示抽屉

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
    productStore.formData = $row;
  } else {
    productStore.resetFormData();
  }
};

// 关闭抽屉触发
const handleDrawerClose = () => {
  const timer = setTimeout(() => {
    // 当抽屉关闭时重置表单
    productStore.resetFormData();
    // 去除预览禁用
    drawer.value.disabled = false;
    // 清除定时器
    timer && clearTimeout(timer);
  }, 100);
};

// 设置行样式
const getRowClassName = ({ row }: { row: { productStatus: number } }) => {
  return row.productStatus ? 'disabled-row' : '';
};
</script>

<style scoped lang="scss">
.table-main {
  height: 100%;
}

:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

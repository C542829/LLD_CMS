<template>
  <div class="main-container">
    <!-- 搜索组件区域 -->
    <Card class="operation-card">
      <div class="header-container">
        <el-button type="primary" @click="showDrawer(0)" class="add-button">添加优惠券</el-button>
      </div>
      <div class="search-container">
        <!-- 选择门店 -->
        <div class="search-item" v-if="false">
          <label for="staffStatus" class="search-label">选择门店：</label>
          <el-select v-model="store.searchParams.storeId" id="staffStatus" style="width: 120px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <!-- 状态 -->
        <div class="search-item">
          <label for="staffStatus" class="search-label">优惠券状态：</label>
          <el-select v-model="store.searchParams.ticketStatus" id="staffStatus" style="width: 120px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <!-- 搜索框 -->
        <div class="search-item">
          <el-input
            v-model="store.searchParams.ticketName"
            @keydown.enter="search"
            :prefix-icon="Search"
            placeholder="优惠券名称"
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
    <Card v-loading="settingStore.loading" :element-loading-text="settingStore.loadingMsg" flex="row" :gap="7">
      <CouponCard
        v-for="item in store.tableData"
        :coupon="item"
        @disable="handleDisable"
        @more="handleMore"
      ></CouponCard>
    </Card>
  </div>
  <!-- 抽屉表单 -->
  <Drawer v-model="drawer.visible" :title="drawer.title" @close="handleDrawerClose">
    <!-- 表单 -->
    <CouponForm :disabled="drawer.disabled" @close-drawer="drawer.visible = false" />
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
import CouponForm from './form.vue';
import CouponCard from '@/components/CouponCard/index.vue';

// 导入枚举数据
import { statusOptions } from '@/enums/index';
// 引入数据仓库
import { useSettingStore } from '@/store/modules/acl/setting';
const settingStore = useSettingStore();
import { useCouponStore } from '@/store/modules/member/memberCoupon';
const store = useCouponStore();

// 引入消息提示组件
const $MessageBox: any = inject('$MessageBox');

onMounted(() => {
  store.setTableData();
});

// 搜索
const search = () => {
  store.setTableData();
};

// 禁用
const handleDisable = async (coupon: any) => {
  const handleStr = coupon.isValid ? '禁用' : '启用';
  const result = await $MessageBox.confirm({
    title: '确认操作',
    message: `你确定要${handleStr}优惠券【${coupon.couponName}】吗？`,
    type: 'warning',
  });
  coupon.isValid = coupon.isValid ? 0 : 1;
  result && store.update(coupon);
};

// 更多
const handleMore = (coupon: any) => {
  showDrawer(1, coupon);
};

const drawer: any = ref({
  title: '新增优惠券',
  visible: false,
  disabled: false,
});

// 抽屉标题
const drawerTitles = ['新增优惠券', '优惠券详情'];

// 打开抽屉
const showDrawer = (index: number, row: any = {}) => {
  drawer.value.title = drawerTitles[index]; // 修改抽屉标题
  drawer.value.visible = true; // 显示抽屉

  // 如果点击更多 禁用表单
  index === 1 && (drawer.value.disabled = true);

  // 表单数据回显
  row?.id ? (store.formData = row) : store.resetFormData();
};

// 关闭抽屉触发
const handleDrawerClose = () => {
  const timer = setTimeout(() => {
    // 当抽屉关闭时重置表单
    store.resetFormData();
    // 去除预览禁用
    drawer.value.disabled = false;
    // 清除定时器
    timer && clearTimeout(timer);
  }, 100);
};
</script>

<style scoped lang="scss">
:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

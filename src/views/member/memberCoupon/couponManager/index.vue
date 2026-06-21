<template>
  <div class="main-container">
    <!-- 搜索组件区域 -->
    <Card class="operation-card">
      <div class="header-container">
        <el-button type="primary" @click="showDrawer('add')" class="add-button">添加优惠券</el-button>
      </div>
      <div class="search-container">
        <!-- 状态 -->
        <div class="search-item">
          <label>
            <span>优惠券状态：</span>
            <el-select v-model="searchParams.ticketStatus" @change="search" class="w-100">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </label>
        </div>
        <!-- 类型 -->
        <div class="search-item">
          <label>
            <span>优惠券类型：</span>
            <el-select v-model="filterType" clearable class="w-80" placeholder="类型" @clear="filterType = ''">
              <el-option v-for="item in couponTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </label>
        </div>
        <template v-if="userStore.isAdmin || userStore.isAreaManager">
          <div class="search-item">
            <label>
              门店：
              <OrgSelect
                v-model="searchParams.orgId"
                placeholder="门店"
                class="w-100"
                :multiple="false"
                @change="search"
                @clear="search"
              />
            </label>
          </div>
        </template>

        <!-- 搜索框 -->
        <div class="search-item">
          <el-input
            v-model="searchParams.ticketName"
            @keydown.enter="search"
            @clear="search"
            :prefix-icon="Search"
            clearable
            placeholder="优惠券名称"
            class="search-input w-240"
          >
            <template #append>
              <el-button type="primary" @click="search">搜索</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </Card>

    <!-- 表格组件 -->
    <Card v-loading="loading" :element-loading-text="LOADING_MSG" flex="row" :gap="7">
      <template v-if="filteredTableData.length === 0">
        <div class="el-full el-center">
          <el-empty></el-empty>
        </div>
      </template>
      <template v-else>
        <CouponCard
          v-for="item in filteredTableData"
          :coupon="item"
          @disable="handleDisable"
          @edit="handleEdit"
          @more="handleMore"
        />
      </template>
    </Card>
  </div>

  <!-- 优惠券表单 -->
  <CouponForm
    v-model="drawer.visible"
    :formData="formData"
    :disabled="drawer.disabled"
    :title="drawer.title"
    @success="fetchList"
  />
</template>

<script setup lang="ts">
import MessageBox from '@/components/MessageBox';
import CouponForm from './components/CouponForm.vue';
import CouponCard from './components/CouponCard.vue';
import { Search } from '@element-plus/icons-vue';
import { onMounted, reactive, ref, computed } from 'vue';
import { LOADING_MSG } from '@/utils/constants';
import { statusOptions, CouponType, couponTypeOptions } from '@/enums/index';
import { type Types, reqTicketList, reqUpdateTicketStatus } from '@/api/member/coupon';
import { parseResList, parseResMsg } from '@/utils/parseResponse';
import { useMasterDataStore } from '@/store/modules/masterData/index';
import { useUserStore } from '@/store/modules/acl/user';

const userStore = useUserStore();

// #region 页面状态
const loading = ref(false);
const searchParams = ref<Types.SearchTicketParams>({ ticketName: '', ticketStatus: 0, orgId: '' });
const tableData = ref<any[]>([]);
const filterType = ref<number | ''>('');
const filteredTableData = computed(() => {
  if (filterType.value === '') return tableData.value;
  return tableData.value.filter((item) => item.ticketType === filterType.value);
});
const formData = ref(CouponForm.createDefaultForm());
// #endregion

// #region 数据获取
const fetchList = async () => {
  loading.value = true;
  try {
    const params = { ...searchParams.value };
    const res = await reqTicketList(params);
    const data = parseResList(res);
    for (const coupon of data) {
      coupon.orgIds = coupon.orgs?.map((e: any) => e.id) || [];
      if (coupon.serverItems?.length) coupon.serverItemIds = coupon.serverItems.map((i: any) => i.id);
      if (coupon.productList?.length) coupon.productIds = coupon.productList.map((i: any) => i.productId);
    }
    tableData.value = data;
  } finally {
    loading.value = false;
  }
};

const handleStatusToggle = async (coupon: any) => {
  const id = coupon.id;
  const status = coupon.ticketStatus === 0 ? 1 : 0;
  const res = await reqUpdateTicketStatus(id, status);
  const result = parseResMsg(res);
  if (result) {
    fetchList();
    useMasterDataStore().invalidate('ticket');
  }
};
// #endregion

onMounted(() => {
  fetchList();
});

// 搜索
const search = () => {
  if (searchParams.value.orgId === undefined) {
    searchParams.value.orgId = '';
  }
  fetchList();
};

// 禁用
const handleDisable = async (coupon: any) => {
  const handleStr = coupon.ticketStatus ? '启用' : '禁用';
  const result = await MessageBox.confirm({
    title: '确认操作',
    message: `你确定要${handleStr}优惠券【${coupon.ticketName}】吗？`,
    type: 'warning',
  });
  result && handleStatusToggle(coupon);
};

// 编辑
const handleEdit = (coupon: any) => {
  showDrawer('edit', coupon);
};

// 更多
const handleMore = (coupon: any) => {
  showDrawer('view', coupon);
};

const drawerTitleMap: Record<DialogType, string> = {
  add: '新增优惠券',
  view: '优惠券详情',
  edit: '修改优惠券',
};

const drawer = reactive({
  title: '新增优惠券',
  visible: false,
  disabled: false,
});

// 打开抽屉
const showDrawer = (type: DialogType, row?: any) => {
  formData.value = row?.id ? { ...row } : CouponForm.createDefaultForm();
  drawer.disabled = type === 'view';
  drawer.title = drawerTitleMap[type];
  drawer.visible = true;
};
</script>

<style scoped lang="scss">
:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

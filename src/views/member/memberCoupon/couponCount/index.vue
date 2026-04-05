<template>
  <div class="main-container">
    <!-- 搜索组件区域 -->
    <Card class="operation-card">
      <div class="search-container">
        <!-- 状态 -->
        <div class="search-item">
          <label>
            <span>优惠券状态：</span>
            <el-select v-model="recordParams.status" @change="search" clearable style="width: 120px">
              <el-option
                v-for="item in CouponStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </label>
        </div>

        <!-- 优惠券 -->
        <div class="search-item">
          <label>
            <span>优惠券：</span>
            <el-select v-model="recordParams.vipTicketId" @change="search" clearable style="width: 120px">
              <el-option v-for="item in coupons" :key="item.id" :label="item.ticketName" :value="item.id" />
            </el-select>
          </label>
        </div>

        <!-- 活动 -->
        <div class="search-item">
          <label>
            <span>活动：</span>
            <el-select v-model="recordParams.activeId" @change="search" clearable style="width: 120px">
              <el-option v-for="item in activities" :key="item.id" :label="item.activeName" :value="item.id" />
            </el-select>
          </label>
        </div>

        <!-- 发放员 -->
        <!-- <div class="search-item">
          <label>
            <span>发放员：</span>
            <el-select v-model="recordParams.ticketStatus" @change="search" style="width: 120px">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </label>
        </div> -->
        <div class="search-item">
          <el-input
            v-model="recordParams.vipInfoFiled"
            @keydown.enter="search"
            @clear="search"
            :prefix-icon="Search"
            clearable
            placeholder="会员信息关键字"
          >
            <template #append>
              <el-button type="primary" @click="search">搜索</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </Card>

    <!-- 数据列表 -->
    <Card padding="0">
      <PaginationTable
        v-loading="loading"
        element-loading-text="加载中..."
        :data="couponRecords"
        :total="recordParams.total"
        v-model:currentPage="recordParams.pageNum"
        v-model:pageSize="recordParams.pageSize"
        @size-change="handleSizeChange"
        @pagination-current-change="handleCurrentChange"
      >
        <el-table-column prop="ticketName" label="代金券名称" min-width="100" />
        <el-table-column label="领取人" min-width="80">
          <template #default="{ row }">
            <p>会员姓名：{{ row.vipName }}</p>
            <p>会员卡号：{{ row.vipCardNumber }}</p>
            <p>电话号码：{{ row.vipPhoneNumber }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="使用状态" min-width="60">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="时间" min-width="60">
          <template #default="{ row }">
            <p>领取时间：{{ row.claimTime }}</p>
            <p>到期时间：{{ row.expiryDate || '长期有效' }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="60" />
        <!-- <el-table-column prop="fromType" label="领取来源类型" min-width="60" />
        <el-table-column prop="expandStaffName" label="销售员" min-width="50" /> -->
        <!-- <el-table-column label="操作" min-width="50">
          <template #default="{ row }">
            <el-button link type="info" @click="">延期</el-button>
          </template>
        </el-table-column> -->
      </PaginationTable>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref, reactive, onMounted } from 'vue';

import { CouponStatusOptions, CouponStatus, CouponStatusMap } from '@/enums/index';

import { reqCountTicket, reqTicketList } from '@/api/member/coupon/index';
import { reqActiveList } from '@/api/member/rechargeActivity/index';
import { parseResObj, parseResList } from '@/utils/parseResponse';

const loading = ref(false);

const recordParams = reactive({
  activeId: '',
  vipTicketId: '',
  status: '',
  vipInfoFiled: '',
  pageNum: 1,
  pageSize: 50,
  total: 0,
});

const couponRecords = ref<any[]>([]);

onMounted(() => {
  search();
  getActivities();
  getCoupons();
});

const search = () => {
  if (recordParams.status == undefined) {
    recordParams.status = '';
  }
  if (recordParams.vipInfoFiled == undefined) {
    recordParams.vipInfoFiled = '';
  }
  if (recordParams.activeId == undefined) {
    recordParams.activeId = '';
  }
  if (recordParams.vipTicketId == undefined) {
    recordParams.vipTicketId = '';
  }
  loadCouponRecords();
};

const handleSizeChange = (val: number) => {
  recordParams.pageSize = val;
  loadCouponRecords();
};

const handleCurrentChange = (val: number) => {
  recordParams.pageNum = val;
  loadCouponRecords();
};

const loadCouponRecords = async () => {
  loading.value = true;
  try {
    const res = await reqCountTicket(recordParams);
    const pageData = parseResObj(res);
    couponRecords.value = pageData.rows || [];
    recordParams.total = pageData.total || 0;
  } finally {
    loading.value = false;
  }
};

const activities = ref<any[]>([]);
const getActivities = async () => {
  const res = await reqActiveList({ activeStatus: 0 });
  activities.value = parseResList(res);
};

const coupons = ref<any[]>([]);
const getCoupons = async () => {
  const res = await reqTicketList({ ticketStatus: 0 });
  coupons.value = parseResList(res);
};

const getStatusTagType = (status: CouponStatus): ElTagType => {
  const statusMap: Record<number | string, string> = {
    [CouponStatus.UnUsed]: 'success',
    [CouponStatus.Used]: 'info',
    [CouponStatus.Canceled]: 'danger',
  };
  return (statusMap[status] || 'info') as ElTagType;
};

const getStatusLabel = (status: CouponStatus) => {
  if (typeof status === 'number') {
    return CouponStatusMap[status] || status;
  }
  return status;
};
</script>

<style scoped lang="scss">
:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

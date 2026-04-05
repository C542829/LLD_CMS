<template>
  <div class="coupon-list-container">
    <PaginationTable
      v-loading="loading"
      element-loading-text="加载中..."
      :data="coupons"
      :total="pagination.total"
      v-model:currentPage="pagination.pageNum"
      v-model:pageSize="pagination.pageSize"
      @size-change="handleSizeChange"
      @pagination-current-change="handleCurrentChange"
      @selection-change="handleSelectionChange"
      :border="true"
      stripe
      class="table-container"
    >
      <el-table-column type="selection" width="50" :selectable="checkSelectable" />
      <el-table-column prop="vipName" label="会员" min-width="50" />
      <el-table-column prop="ticketName" label="优惠券名称" min-width="80" />
      <el-table-column prop="ticketCode" label="优惠券编码" min-width="60" />
      <el-table-column prop="claimTime" label="领取时间" width="100" />
      <el-table-column prop="expiryDate" label="到期时间" width="100">
        <template #default="{ row }">
          {{ row.expiryDate || '长期有效' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="80" />
    </PaginationTable>
    <div>
      <el-button :disabled="selectedCoupons.length === 0" type="primary" @click="handleCancelCoupon">
        取消优惠券
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';

import { reqCountTicket, Types } from '@/api/member/coupon/index';
import { reqCancelTicket } from '@/api/member/member/index';
import { parseResObj, parseResMsg } from '@/utils/parseResponse';
import { CouponStatus, CouponStatusMap } from '@/enums/index';

import { useMemberStore } from '@/store/modules/member/member';
const store = useMemberStore();

const loading = ref(false);
const coupons = ref<Types.TicketCountVO[]>([]);
const selectedCoupons = ref<Types.TicketCountVO[]>([]);

const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const fromTypeMap: Record<number, string> = {
  1: '实体券',
  2: '线上领取',
  3: '地推活动领取',
  4: '手动赠送',
  5: '充值活动获赠',
  7: '疗程项目获得',
};

const formatFromType = (type: number) => {
  return fromTypeMap[type] || '未知';
};

const getStatusTagType = (status: CouponStatus): '' | 'success' | 'warning' | 'info' | 'danger' => {
  const statusMap: Record<number, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    [CouponStatus.UnUsed]: 'success',
    [CouponStatus.Used]: 'info',
    [CouponStatus.Canceled]: 'danger',
  };
  return statusMap[status] || 'info';
};

const getStatusLabel = (status: CouponStatus) => {
  return CouponStatusMap[status] || status;
};

const checkSelectable = (row: Types.TicketCountVO) => {
  return row.status === CouponStatus.UnUsed;
};

const handleSelectionChange = (selection: Types.TicketCountVO[]) => {
  selectedCoupons.value = selection;
};

const handleSizeChange = (val: number) => {
  pagination.pageSize = val;
  loadCoupons();
};

const handleCurrentChange = (val: number) => {
  pagination.pageNum = val;
  loadCoupons();
};

const loadCoupons = async () => {
  loading.value = true;
  try {
    const cardNumber = store.formData.cardNumber;
    const params: Types.TicketListRequest = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      vipInfoFiled: cardNumber,
      status: CouponStatus.UnUsed,
    };
    const res = await reqCountTicket(params);
    const pageData = parseResObj(res);
    coupons.value = pageData.rows || [];
    pagination.total = pageData.total || 0;
  } finally {
    loading.value = false;
  }
};

const handleCancelCoupon = async () => {
  if (selectedCoupons.value.length === 0) {
    ElMessage.warning('请选择要取消的优惠券');
    return;
  }

  try {
    await ElMessageBox.confirm(`确定要取消选中的 ${selectedCoupons.value.length} 张优惠券吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    loading.value = true;
    const vipId = store.formData.id;
    const ticketIds = selectedCoupons.value.map((item) => item.id!);
    const res = await reqCancelTicket(vipId, ticketIds);
    const success = parseResMsg(res, '取消优惠券成功');
    if (success) {
      await loadCoupons();
      selectedCoupons.value = [];
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消优惠券失败:', error);
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadCoupons();
});
</script>

<style lang="scss" scoped>
.coupon-list-container {
  height: 500px;
  display: flex;
  flex-direction: column;
  gap: $main-padding;
  padding: $main-padding $main-padding * 2;

  > div:first-child {
    flex: 1;
    overflow: auto;
  }

  > div:last-child {
    display: flex;
    justify-content: flex-end;
  }
}

:deep(.table-container .el-table__header-wrapper th) {
  background-color: $base-child-nav-bg;
}
</style>

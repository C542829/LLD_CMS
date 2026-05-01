<template>
  <div class="coupon-list-container">
    <PaginationTable
      v-loading="loading"
      :element-loading-text="LOADING_MSG"
      :data="coupons"
      :show-pagination="false"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" :selectable="checkSelectable" />
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="vipName" label="会员" min-width="50" />
      <el-table-column prop="ticketName" label="优惠券名称" min-width="80" />
      <el-table-column prop="ticketCode" label="优惠券编码" min-width="65" />
      <el-table-column prop="claimTime" label="领取时间" width="100" />
      <el-table-column prop="expiryDate" label="到期时间" width="100">
        <template #default="{ row }">
          {{ row.expiryDate || '长期有效' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="90" sortable>
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="80" sortable />
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
import { reqCancelTicket, reqVipTicketList } from '@/api/member/member/index';
import { parseResObj, parseResMsg } from '@/utils/parseResponse';
import { CouponStatus, CouponStatusMap } from '@/enums/index';
import { LOADING_MSG } from '@/utils/constants';

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
    // const cardNumber = store.formData.cardNumber;
    // const params: Types.TicketListRequest = {
    //   pageNum: pagination.pageNum,
    //   pageSize: pagination.pageSize,
    //   vipInfoFiled: cardNumber,
    //   status: CouponStatus.UnUsed,
    // };
    // const res = await reqCountTicket(params);
    const vipId = store.formData.id;
    const { data } = await reqVipTicketList(vipId);
    // const pageData = parseResObj(res);
    coupons.value = data || [];
    // pagination.total = pageData.total || 0;
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

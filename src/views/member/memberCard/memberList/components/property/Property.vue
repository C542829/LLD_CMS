<template>
  <div class="container" v-loading="loading" element-loading-text="加载中...">
    <div class="section-title">会员卡资产</div>
    <PaginationTable
      :data="assetList"
      :border="true"
      stripe
      height="auto"
      containerHeight="auto"
      size="small"
      :showPagination="false"
      class="table-container"
    >
      <el-table-column prop="assetNum" label="资产编号" min-width="100" />
      <el-table-column prop="createTime" label="创建时间" min-width="80" />
      <el-table-column prop="assetBalance" label="余额" width="80">
        <template #default="{ row }">￥{{ row.assetBalance }}</template>
      </el-table-column>
      <el-table-column prop="assetType" label="资产类型" width="80">
        <template #default="{ row }">
          <el-tag :type="row.assetType === 0 ? 'success' : 'primary'" size="small">
            {{ row.assetType === 0 ? '充值' : '赠送' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="assetDiscountBase" label="折扣基础" width="80">
        <template #default="{ row }">
          <el-tag :type="row.assetDiscountBase === 0 ? 'success' : 'primary'" size="small">
            {{ row.assetDiscountBase === 0 ? '标准价' : '会员价' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="assetDiscountRate" label="折扣率" width="80">
        <template #default="{ row }">
          {{ row.assetDiscountRate ? `${row.assetDiscountRate}%` : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="assetIsCrossStore" label="跨店消费" width="80">
        <template #default="{ row }">
          <el-tag :type="row.assetIsCrossStore === 1 ? 'success' : 'info'" size="small">
            {{ row.assetIsCrossStore === 1 ? '允许' : '不允许' }}
          </el-tag>
        </template>
      </el-table-column>
    </PaginationTable>

    <div class="section-title">优惠券资产</div>
    <PaginationTable
      :data="ticketList"
      :border="true"
      stripe
      size="small"
      height="auto"
      containerHeight="auto"
      :showPagination="false"
      class="table-container"
    >
      <el-table-column prop="ticketName" label="优惠券名称" min-width="100" />
      <el-table-column prop="ticketInfo.ticketType" label="类型" width="80">
        <template #default="{ row }">
          <el-tag :type="getTicketTypeTagType(row.ticketInfo.ticketType)" size="small">
            {{ couponTypeMap[row.ticketInfo.ticketType as CouponType] || '未知' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ticketInfo.ticketValue" label="面值" width="80">
        <template #default="{ row }">
          <template v-if="row.ticketInfo.ticketType === CouponType.voucher">
            ￥{{ row.ticketInfo.ticketValue }}
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="ticketInfo.ticketFullPayment" label="使用门槛" min-width="100">
        <template #default="{ row }">
          <template v-if="row.ticketInfo.ticketType === CouponType.voucher">
            {{ row.ticketInfo.ticketFullPayment ? `满${row.ticketInfo.ticketFullPayment}元可用` : '无门槛' }}
          </template>
          <template v-else>
            可用项目：{{ row.ticketInfo.serverItems.map((item: any) => item.itemName).join('、') }}
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="expiryDate" label="有效期" width="80">
        <template #default="{ row }">
          {{ row.expiryDate === -1 || row.expiryDate === null ? '永久有效' : `${row.expiryDate}` }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="使用状态" width="80">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)" size="small">
            {{ CouponStatusMap[row.status as CouponStatus] || '未知' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="100" />
    </PaginationTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CouponType, couponTypeMap, CouponStatus, CouponStatusMap } from '@/enums/index';
import { reqVipAssetList, Types } from '@/api/member/member/index';
import { parseResObj } from '@/utils/parseResponse';

import { useMemberStore } from '@/store/modules/member/member';
const store = useMemberStore();

const loading = ref(false);
const assetList = ref<Types.VipAssetVO[]>([]);
const ticketList = ref<Types.VipTicketVO[]>([]);

const getTicketTypeTagType = (type?: number): ElTagType => {
  const typeMap: Record<number, ElTagType> = {
    [CouponType.voucher]: 'success',
    [CouponType.experience]: 'primary',
  };
  return typeMap[type!] || 'info';
};

const getStatusTagType = (status?: CouponStatus): ElTagType => {
  const statusMap: Record<number, ElTagType> = {
    [CouponStatus.UnUsed]: 'success',
    [CouponStatus.Used]: 'info',
    [CouponStatus.Canceled]: 'danger',
  };
  return statusMap[status!] || 'info';
};

const loadPropertyData = async () => {
  loading.value = true;
  try {
    const vipId = store.formData.id;
    const res = await reqVipAssetList(vipId);
    const data = parseResObj(res);
    assetList.value = data.vipAssetVOList || [];
    ticketList.value = data.vipTicketVOList || [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadPropertyData();
});
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  padding: $main-padding;
  overflow: auto;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  padding-left: 10px;

  &:not(:first-child) {
    margin-top: 20px;
  }
}

.table-container {
  margin-bottom: 10px;
}
</style>

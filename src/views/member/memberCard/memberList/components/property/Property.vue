<template>
  <div class="container" v-loading="loading" :element-loading-text="LOADING_MSG">
    <div class="section-title">
      <span>会员卡资产</span>
      <div v-has="'member:memberCard:memberList:RefundCard'" class="section-title__actions">
        <span v-if="selectedAssets.length > 0" class="selected-info">
          已选 {{ selectedAssets.length }} 项，合计金额：￥{{ totalSelectedBalance }}
        </span>
        <el-button :disabled="selectedAssets.length === 0" type="danger" size="small" @click="handleRefundCard">
          批量退卡
        </el-button>
      </div>
    </div>
    <PaginationTable
      :data="assetList"
      :border="true"
      stripe
      height="auto"
      containerHeight="auto"
      size="small"
      :showPagination="false"
      :row-class-name="getAssetRowClassName"
      class="table-container"
      @selection-change="handleAssetSelectionChange"
    >
      <el-table-column type="selection" width="45" :selectable="checkAssetSelectable" />
      <el-table-column type="index" label="序号" width="45" />
      <el-table-column prop="assetNum" label="资产编号" min-width="100" />
      <el-table-column prop="createTime" label="创建时间" min-width="80" />
      <el-table-column prop="assetBalance" label="余额" sortable min-width="80">
        <template #default="{ row }">￥{{ row.assetBalance }}</template>
      </el-table-column>
      <el-table-column prop="assetType" label="资产类型" min-width="80">
        <template #default="{ row }">
          <el-tag :type="row.assetType === 0 ? 'success' : 'primary'" size="small">
            {{ row.assetType === 0 ? '充值' : '赠送' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="assetDiscountBase" label="折扣基础" min-width="80">
        <template #default="{ row }">
          <el-tag :type="row.assetDiscountBase === 0 ? 'success' : 'primary'" size="small">
            {{ row.assetDiscountBase === 0 ? '标准价' : '会员价' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="assetDiscountRate" label="折扣率" min-width="80">
        <template #default="{ row }">
          {{ row.assetDiscountRate ? `${row.assetDiscountRate}%` : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="assetIsCrossStore" label="跨店消费" min-width="80">
        <template #default="{ row }">
          <el-tag :type="row.assetIsCrossStore === 1 ? 'success' : 'info'" size="small">
            {{ row.assetIsCrossStore === 1 ? '允许' : '不允许' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="80" v-has="'member:memberCard:memberList:UpdateAsset'">
        <template #default="{ row }">
          <el-button type="primary" size="small" link :disabled="!!row.status" @click="handleEditProperty(row)">
            编辑
          </el-button>
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
      <el-table-column type="index" label="序号" width="45" />
      <el-table-column prop="ticketName" label="优惠券名称" sortable min-width="100" />
      <el-table-column prop="ticketInfo.ticketType" label="类型" sortable width="80">
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
          <template v-else>￥{{ row.amount || 0 }}</template>
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

    <PropertyModify ref="propertyModifyRef" @refresh="loadPropertyData" />
  </div>
</template>

<script setup lang="ts">
import PropertyModify from './PropertyModify.vue';
import { ref, computed, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { CouponType, couponTypeMap, CouponStatus, CouponStatusMap, Status } from '@/enums/index';
import { reqVipAssetList, reqRefundCard, Types } from '@/api/member/member/index';
import { parseResObj, parseResMsg } from '@/utils/parseResponse';
import { LOADING_MSG } from '@/utils/constants';

import { useMemberStore } from '@/store/modules/member/member';
const store = useMemberStore();

const loading = ref(false);
const assetList = ref<Types.VipAssetVO[]>([]);
const ticketList = ref<Types.VipTicketVO[]>([]);
const selectedAssets = ref<Types.VipAssetVO[]>([]);

/** 已选资产合计金额 */
const totalSelectedBalance = computed(() => {
  return selectedAssets.value.reduce((sum, item) => sum + (item.assetBalance || 0), 0);
});

/** 控制行是否可选中：余额大于0的资产才可退卡 */
const checkAssetSelectable = (row: Types.VipAssetVO) => {
  return (row.assetBalance ?? 0) > 0;
};

/** 多选变更事件 */
const handleAssetSelectionChange = (selection: Types.VipAssetVO[]) => {
  selectedAssets.value = selection;
};

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

const propertyModifyRef = ref();
const handleEditProperty = (row: any) => {
  propertyModifyRef.value.initInfo(row);
  console.log('handleEditProperty', row);
};

/** 批量退卡操作 */
const handleRefundCard = async () => {
  if (selectedAssets.value.length === 0) {
    ElMessage.warning('请选择要退卡的资产');
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要退回选中的 ${selectedAssets.value.length} 张会员卡吗？合计金额：￥${totalSelectedBalance.value}`,
      '批量退卡确认',
      {
        confirmButtonText: '确定退卡',
        cancelButtonText: '取消',
        type: 'warning',
      },
    );

    loading.value = true;
    const assetIds = selectedAssets.value.map((item) => item.id!);
    const res = await reqRefundCard(assetIds);
    const success = parseResMsg(res, '退卡成功');
    if (success) {
      await loadPropertyData();
      selectedAssets.value = [];
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量退卡失败:', error);
    }
  } finally {
    loading.value = false;
  }
};

// 设置行样式
const getAssetRowClassName = ({ row }: { row: { status: number } }) => {
  return row.status === Status.Disabled ? 'disabled-row' : '';
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  padding: $main-padding;
  overflow: auto;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  padding-left: 10px;

  &:not(:first-child) {
    margin-top: 20px;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 12px;

    .selected-info {
      font-size: 13px;
      color: var(--el-text-color-regular);
    }
  }
}

.table-container {
  margin-bottom: 10px;
}
</style>

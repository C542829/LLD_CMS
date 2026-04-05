<template>
  <div class="container">
    <PaginationTable
      v-loading="loading"
      element-loading-text="加载中..."
      :data="rechargeRecords"
      :total="pagination.total"
      v-model:currentPage="pagination.pageNum"
      v-model:pageSize="pagination.pageSize"
      @size-change="handleSizeChange"
      @pagination-current-change="handleCurrentChange"
      :border="true"
      height="100%"
      stripe
      class="table-container"
    >
      <el-table-column prop="orgName" label="充值门店" min-width="80" />
      <el-table-column prop="rechargeTime" label="充值时间" min-width="80">
        <template #default="{ row }">
          {{ formatDateTime(row.rechargeTime) }}
        </template>
      </el-table-column>
      <el-table-column label="充值金额" min-width="100">
        <template #default="{ row }">
          <div v-if="row.rechargeValue" class="text">充值：￥{{ row.rechargeValue }} &nbsp;({{ row.assetCode }})</div>
          <div v-if="row.presentValue" class="text">
            赠送：￥{{ row.presentValue }}&nbsp;({{ row.presentAssetCode }})
          </div>
          <!-- <span v-if="row.assetCode">&nbsp;({{ row.assetCode }})</span> -->
          <!-- <span v-if="row.presentAssetCode">&nbsp;({{ row.presentAssetCode }})</span> -->
        </template>
      </el-table-column>
      <el-table-column label="充值状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.rechargeStatus === 0 ? 'success' : 'danger'">
            {{ row.rechargeStatus === 0 ? '充值成功' : '已冲正' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="activeName" label="充值活动" min-width="80" />
      <el-table-column prop="userName" label="操作员" width="80" />
      <el-table-column prop="remark" label="备注" min-width="80" />
    </PaginationTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { formatDateTime } from '@/utils/time';

import { reqRechargeHistoryList, Types } from '@/api/member/recharge/index';
import { parseResObj } from '@/utils/parseResponse';

import { useMemberStore } from '@/store/modules/member/member';
const store = useMemberStore();

const loading = ref(false);
const rechargeRecords = ref<Types.RechargeHistoryVO[]>([]);

const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const handleSizeChange = (val: number) => {
  pagination.pageSize = val;
  loadRechargeRecords();
};

const handleCurrentChange = (val: number) => {
  pagination.pageNum = val;
  loadRechargeRecords();
};

const loadRechargeRecords = async () => {
  loading.value = true;
  try {
    const cardNumber = store.formData.cardNumber;
    const params: Types.RechargeRecordRequest = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      vipInfoFiled: cardNumber,
    };
    const res = await reqRechargeHistoryList(params);
    const pageData = parseResObj(res);
    rechargeRecords.value = pageData.rows || [];
    pagination.total = pageData.total || 0;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadRechargeRecords();
});
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}

:deep(.table-container .el-table__header-wrapper th) {
  background-color: $base-child-nav-bg;
}
</style>

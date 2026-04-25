<template>
  <div class="container">
    <PaginationTable
      v-loading="loading"
      :element-loading-text="LOADING_MSG"
      :data="tableData.list"
      :total="tableData.total"
      :row-class-name="getRowClassName"
      v-model:currentPage="searchParams.pageNum"
      v-model:pageSize="searchParams.pageSize"
      @size-change="handleSizeChange"
      @pagination-current-change="handleCurrentChange"
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
          <el-tag :type="row.rechargeStatus === RechargeStatus.SUCCESS ? 'success' : 'danger'">
            {{ row.rechargeStatus === RechargeStatus.SUCCESS ? '充值成功' : '已冲正' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="activeName" label="充值活动" min-width="80" />
      <el-table-column prop="userName" label="操作员" width="80" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" link @click="showDetailDialog(scope.row)">明细</el-button>
        </template>
      </el-table-column>
    </PaginationTable>
  </div>
  <RechargeDetailDialog v-model="detailDialogVisible" :data="detailDialogData" />
</template>

<script setup lang="ts">
import RechargeDetailDialog from '@/views/member/memberRecharge/rechargeRecord/components/RechargeDetailDialog.vue';
import { ref, reactive, onMounted } from 'vue';
import { formatDateTime } from '@/utils/time';
import { reqRechargeHistoryList, Types } from '@/api/member/recharge/index';
import { LOADING_MSG } from '@/utils/constants';
import { RechargeStatus } from '@/enums';

interface IProps {
  params: any;
}

const props = withDefaults(defineProps<IProps>(), {
  params: {},
});

const loading = ref(false);
const tableData = reactive<TableData<Types.RechargeHistoryVO>>({ total: 0, list: [] });

const searchParams = reactive({
  pageNum: 1,
  pageSize: 20,
  vipInfoFiled: '',
  startTime: '',
  endTime: '',
});

const handlerParams = () => {
  if (Array.isArray(props.params.date) && props.params.date.length === 2) {
    searchParams.startTime = props.params.date[0];
    searchParams.endTime = props.params.date[1];
  } else {
    searchParams.startTime = '';
    searchParams.endTime = '';
  }
  if (props.params.member) {
    searchParams.vipInfoFiled = props.params.member.cardNumber;
  } else {
    searchParams.vipInfoFiled = '';
  }
};

const handleSizeChange = (val: number) => {
  searchParams.pageSize = val;
  searchParams.pageNum = 1;
  loadRechargeRecords();
};

const handleCurrentChange = (val: number) => {
  searchParams.pageNum = val;
  loadRechargeRecords();
};

const loadRechargeRecords = async () => {
  try {
    loading.value = true;
    handlerParams();
    const { data } = await reqRechargeHistoryList(searchParams);
    tableData.list = data.rows || [];
    tableData.total = data.total || 0;
  } catch {
  } finally {
    loading.value = false;
  }
};

// #region 充值详情对话框
const detailDialogVisible = ref(false);
const detailDialogData = ref<any>({});

/** 查看充值详情 */
const showDetailDialog = (row: any) => {
  detailDialogData.value = row;
  detailDialogVisible.value = true;
};
// #endregion

onMounted(() => {
  loadRechargeRecords();
});

defineExpose({
  getData: loadRechargeRecords,
});

// 设置行样式
const getRowClassName = ({ row }: { row: { rechargeStatus: number } }) => {
  return row.rechargeStatus !== RechargeStatus.SUCCESS ? 'disabled-row' : '';
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
</style>

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
      <el-table-column prop="orgName" label="消费门店" min-width="40" />
      <el-table-column prop="manualOrderNo" label="手写单号" min-width="50" />
      <el-table-column prop="orderCode" label="关联单号" min-width="50" />
      <el-table-column prop="settleTime" label="消费时间" min-width="60" />
      <el-table-column prop="actualAmount" label="消费金额" min-width="50" :formatter="amountFormatter" />
      <el-table-column prop="orderStatusName" label="订单状态" min-width="50" />
      <!-- <el-table-column prop="orgName" label="消费门店" min-width="50" /> -->
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" link @click="showDrawer(scope.row)">明细</el-button>
        </template>
      </el-table-column>
    </PaginationTable>
  </div>
  <OrderDetailDrawer v-model="drawer.visible" :order="drawer.orderData" />
</template>

<script setup lang="ts">
import OrderDetailDrawer from '@/views/dataGroup/saleData/saleRecord/components/OrderDetailDrawer.vue';
import { onMounted, reactive, ref } from 'vue';
import { reqSaleRecord, type Types } from '@/api/dataGroup/saleData/index';
import { amountFormatter } from '@/utils/formatter';
import { OrderStatus } from '@/enums/index';
import { LOADING_MSG } from '@/utils/constants';

interface IProps {
  params: any;
}

const props = withDefaults(defineProps<IProps>(), {
  params: {},
});

onMounted(() => {
  getConsumptionRecord();
});

const drawer = reactive({
  visible: false,
  orderData: null,
});

const showDrawer = (row: any) => {
  drawer.orderData = row;
  drawer.visible = true;
};

const loading = ref(false);

const searchParams = reactive({
  pageNum: 1,
  pageSize: 20,
  vipInfoFiled: '',
  startTime: '',
  endTime: '',
});

const tableData: TableData<Types.OrderInfoVO> = reactive({ total: 0, list: [] });

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

const getConsumptionRecord = async () => {
  loading.value = true;
  try {
    handlerParams();
    const res = await reqSaleRecord(searchParams);
    tableData.total = res.data.total;
    tableData.list = res.data.rows;
  } catch (error) {
    console.error('查询会员消费记录失败：', error);
  } finally {
    loading.value = false;
  }
};

// 处理分页变化
const handleSizeChange = (val: number) => {
  searchParams.pageSize = val;
  searchParams.pageNum = 1;
  getConsumptionRecord();
};

const handleCurrentChange = (val: number) => {
  searchParams.pageNum = val;
  getConsumptionRecord();
};

defineExpose({
  getData: getConsumptionRecord,
});

// 设置行样式
const getRowClassName = ({ row }: { row: { orderStatus: number } }) => {
  return row.orderStatus !== OrderStatus.SETTLED ? 'disabled-row' : '';
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
</style>

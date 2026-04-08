<template>
  <div class="container">
    <PaginationTable
      v-loading="loading"
      :data="tableData.list"
      :total="tableData.total"
      v-model:currentPage="searchParams.pageNum"
      v-model:pageSize="searchParams.pageSize"
      @size-change="handleSizeChange"
      @pagination-current-change="handleCurrentChange"
    >
      <el-table-column prop="orgName" label="消费门店" min-width="40" />
      <el-table-column prop="orderCode" label="关联单号" min-width="50" />
      <el-table-column prop="settleTime" label="消费时间" min-width="60" />
      <el-table-column prop="actualAmount" label="消费金额" min-width="50" />
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

  <!-- 
  <Dialog v-model="visible" title="消费明细" width="60%">
    <div class="dialog-container">
      <article class="consumption-detail">
        <div>
          <span>单据编号: 125070314590016</span>
          <span>单据日期: 2025-07-03</span>
        </div>
        <div>
          <span>会员卡号: N145900813</span>
          <span>会员姓名: 刘涵</span>
        </div>
      </article>

      <div class="tab-container">
        <el-tabs type="border-card" style="height: 100%">
          <el-tab-pane class="tab-pane-content" style="height: 100%">
            <template #label>
              <span>项目/产品消费</span>
            </template>
            <el-table :data="consumptions" :border="true" height="100%" stripe class="table-container">
              <el-table-column prop="tradeTime" label="项目/产品消费" />
              <el-table-column prop="actualAmount" label="标准价" />
              <el-table-column prop="salesNo" label="数量" />
              <el-table-column prop="orgName" label="金额" />
              <el-table-column prop="orgName" label="上钟类型" />
              <el-table-column prop="orgName" label="技师/销售" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane>
            <template #label>
              <span>支付明细</span>
            </template>
            <article class="pay-detail">
              <div>
                <span>会员卡支付</span>
                <span>118</span>
              </div>
              <div>
                <span>消费资产明细</span>
                <el-tag>0005:118元</el-tag>
              </div>
            </article>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </Dialog> -->
</template>

<script setup lang="ts">
import OrderDetailDrawer from '@/views/dataGroup/saleData/saleRecord/components/OrderDetailDrawer.vue';
import { onMounted, reactive, ref } from 'vue';
import { isEmpty } from 'lodash';
import { reqSaleRecord } from '@/api/dataGroup/saleData/index';
import { OrderStatus } from '@/enums/index';
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

const visible = ref(false);
const loading = ref(false);

const searchParams = reactive({
  pageNum: 1,
  pageSize: 10,
  status: OrderStatus.SETTLED,
  date: [],
  vipInfoFiled: '',
});

const tableData = reactive({ total: 0, list: [] });

const handlerParams = () => {
  if (!isEmpty(props.params.date) && props.params.date.length === 2) {
    searchParams.date = props.params.date;
  } else {
    delete searchParams.date;
  }
  if (props.params.member) {
    searchParams.vipInfoFiled = props.params.member.cardNumber;
  }
};

const getConsumptionRecord = async () => {
  loading.value = true;
  try {
    handlerParams();
    const res: ApiResponseData<any> = await reqSaleRecord(searchParams);
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
  getConsumptionRecord();
};

const handleCurrentChange = (val: number) => {
  searchParams.pageNum = val;
  getConsumptionRecord();
};

defineExpose({
  getData: getConsumptionRecord,
});
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}

.dialog-container {
  height: 60vh;
  display: flex;
  flex-direction: column;

  > div:last-child {
    flex: 1;
  }
  .tab-container {
    height: calc(60vh - 90px);
  }

  .consumption-detail {
    width: 60%;
    padding: 15px;
    line-height: 30px;
    height: 90px;

    > div {
      display: flex;
      > span {
        flex: 1;
      }
    }
  }

  .pay-detail {
    padding: 30px;
    line-height: 30px;

    > div {
      display: flex;
      align-items: flex-end;
      > span:first-child {
        width: 120px;
      }
    }
  }
}
</style>

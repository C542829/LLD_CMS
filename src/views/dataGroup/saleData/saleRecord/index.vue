<template>
  <div class="main-container">
    <!-- 数据筛选 -->
    <Card class="operation-card">
      <!-- 第一行 -->
      <div class="search-container">
        <div class="search-item">
          <label>
            开单时段：
            <IDateTimePicker v-model="dateRange" class="w-220" @change="search" @clear="search" />
          </label>
        </div>
        <template v-if="userStore.isAdmin || userStore.isAreaManager">
          <div class="search-item">
            <label>
              门店：
              <OrgSelect
                v-model="searchParams.orgIds"
                placeholder="门店"
                class="w-120"
                :multiple="true"
                :max-collapse-tags="0"
                @change="search"
                @clear="search"
              />
            </label>
          </div>
        </template>
        <div class="search-item">
          <label for="saleStaff">收银员：</label>
          <UserSelect
            v-model="searchParams.userId"
            placeholder="收银员"
            class="w-100"
            :multiple="false"
            @change="search"
            @clear="search"
          />
        </div>
        <div class="search-item">
          <el-switch
            v-model="searchParams.payZero"
            :active-value="0"
            :inactive-value="1"
            id="payZero"
            @change="search"
          />
          <label for="payZero">&nbsp;仅查看支付为0的订单</label>
        </div>
      </div>

      <!-- 第二行 -->
      <div class="search-container">
        <div class="search-item">
          <label for="orderStatus">订单状态：</label>
          <el-select v-model="searchParams.status" clearable id="orderStatus" class="w-100" @change="search">
            <el-option v-for="item in orderStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="search-item">
          <label for="payType">支付类型：</label>
          <el-select
            v-model="searchParams.paymentType"
            clearable
            id="payType"
            placeholder="支付类型"
            class="w-120"
            @change="search"
          >
            <el-option v-for="item in paymentTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="search-item">
          <label for="memberInfo">会员信息：</label>
          <div>
            <el-input
              v-model="searchParams.vipInfoFiled"
              id="memberInfo"
              class="w-160"
              placeholder="会员卡号 | 手机号"
              clearable
            />
          </div>
        </div>
        <div class="search-item">
          <label for="orderID">订单号：</label>
          <div>
            <el-input
              v-model="searchParams.orderCode"
              id="orderID"
              class="w-160"
              placeholder="请输入销售单号"
              clearable
            />
          </div>
        </div>
        <div class="search-item">
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </div>
      </div>
    </Card>

    <!-- 数据列表 -->
    <Card padding="0">
      <PaginationTable
        v-loading="loading"
        :element-loading-text="LOADING_MSG"
        :data="saleRecord.data"
        :total="saleRecord.total"
        :row-class-name="getRowClassName"
        v-model:pageNum="searchParams.pageNum"
        v-model:pageSize="searchParams.pageSize"
        @size-change="handleSizeChange"
        @pagination-current-change="handleCurrentChange"
      >
        <el-table-column type="index" label="序号" width="55" />
        <el-table-column prop="orgName" label="门店" min-width="50" />
        <el-table-column prop="orderTime" label="开单日期" width="105" :formatter="dateFormatter" />
        <el-table-column prop="orderTime" label="开单时间" width="85" :formatter="timeFormatter" />
        <el-table-column prop="settleTime" label="结算时间" width="85" :formatter="timeFormatter" />
        <el-table-column prop="manualOrderNo" label="单号" width="60" />
        <!-- <el-table-column prop="orderCode" label="系统单号" min-width="70" /> -->
        <el-table-column label="顾客信息" min-width="100">
          <template #default="{ row }">
            <p>姓名：{{ row.vipName || row.customerName }}</p>
            <p class="text" v-if="row.vipCardNumber">卡号：{{ row.vipCardNumber }}</p>
            <p class="text" v-if="row.vipPhoneNumber">电话：{{ row.vipPhoneNumber }}</p>
            <p class="text" v-if="row.vipName">余额：{{ row.afterBalance }}元</p>
          </template>
        </el-table-column>
        <el-table-column label="应收/实收" min-width="90">
          <template #default="{ row }">
            <p class="text">应收：￥{{ row.totalAmount }}</p>
            <p class="text">实收：￥{{ row.actualAmount }}</p>
            <p class="text">优惠：￥{{ row.discountAmount }}</p>
          </template>
        </el-table-column>
        <!-- <el-table-column label="实收金额" min-width="60">
          <template #default="scope">￥{{ scope.row.actualAmount }}</template>
        </el-table-column> -->
        <!-- <el-table-column label="优惠金额" min-width="60">
          <template #default="scope">￥{{ scope.row.discountAmount }}</template>
        </el-table-column> -->
        <el-table-column label="付款方式" min-width="90">
          <template #default="scope">
            <p v-for="item in scope.row.payments" :key="item.paymentType">
              {{ item.paymentName }}：￥{{ item.totalAmount }}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="技师/销售" min-width="100">
          <template #default="{ row }">
            <div v-for="(detail, index) in row.orderDetails" :key="index" class="text-overflow">
              <template v-if="detail.technicians">
                <div v-for="(item, index) in detail.technicians" :key="index" class="text-overflow">
                  {{ item.userName }}({{ item.userCode }})
                </div>
              </template>
              <template v-else>
                {{ detail.userName }}
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="70">
          <template #default="scope">
            <p class="text">状态：{{ scope.row.orderStatusName }}</p>
            <p class="text">收银：{{ scope.row.userName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template #default="{ row }">
            <el-button @click="showDrawer(row)" link type="info">明细</el-button>
            <el-button :disabled="row.orderStatus !== OrderStatus.SETTLED" @click="reversal(row)" link type="danger">
              冲正
            </el-button>
            <br />
            <el-button :disabled="true" @click="showDialog(row)" link type="warning">修改销售单据</el-button>
            <br />
            <el-button
              :disabled="row.orderStatus !== OrderStatus.SETTLED"
              :loading="row.loading"
              @click="printReceipt(row)"
              link
              type="primary"
            >
              重打小票
            </el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <OrderDetailDrawer v-model="drawer.visible" :order="drawer.orderData" />
  <OrderModify v-model:visible="dialog.visible" :data="dialog.data" />
</template>

<script setup lang="ts">
import OrderDetailDrawer from './components/OrderDetailDrawer.vue';
import OrderModify from './OrderModify.vue';
import Message from '@/components/Message';
import MessageBox from '@/components/MessageBox';
import { reactive, onMounted, ref } from 'vue';
import { cloneDeep, isEmpty } from 'lodash';
import { printer } from '@/utils/lodop';
import { dateFormatter, timeFormatter } from '@/utils/formatter';
import { parseResMsg } from '@/utils/parseResponse';
import { OrderStatus, orderStatusOptions, paymentTypeOptions, ResponseCode } from '@/enums';
import { isFullDaysSince } from '@/utils/time';
import { reqQueryOrder, reqRollBackOrder } from '@/api/order';
import { reqOrgInfo } from '@/api/acl/org';
import { reqSaleRecord } from '@/api/dataGroup/saleData';
import { LOADING_MSG } from '@/utils/constants';
import useUserStore from '@/store/modules/acl/user';

const userStore = useUserStore();

const loading = ref(false);

/** 日期范围 */
const dateRange = ref<string[]>([]);

const searchParams = reactive({
  pageNum: 1,
  pageSize: 50,
  startTime: '',
  endTime: '',
  orgIds: [] as number[],
  userId: undefined as number | undefined,
  payZero: 1,
  status: OrderStatus.SETTLED,
  paymentType: undefined as number | undefined,
  vipInfoFiled: '',
  orderCode: '',
});

/** 处理搜索参数 */
const handleSearchParams = () => {
  if (dateRange.value.length === 0) {
    searchParams.startTime = '';
    searchParams.endTime = '';
  } else {
    searchParams.startTime = dateRange.value[0] as string;
    searchParams.endTime = dateRange.value[1] as string;
  }
};

const saleRecord = reactive({
  total: 0,
  data: [] as any[],
});

const setSaleRecord = async () => {
  loading.value = true;
  try {
    handleSearchParams();
    const { data } = await reqSaleRecord(searchParams);
    saleRecord.total = data.total;
    saleRecord.data = data.rows;
  } catch (error) {
    console.error('获取销售记录失败:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  search();
});

const search = () => {
  // searchParams.pageNum = 1;
  setSaleRecord();
};

/**
 * 重置搜索参数
 */
const reset = () => {
  // 重置搜索参数到初始状态
  searchParams.pageNum = 1;
  searchParams.pageSize = 50;
  searchParams.orgIds = [];
  searchParams.userId = undefined;
  searchParams.payZero = 1;
  searchParams.status = OrderStatus.SETTLED;
  searchParams.paymentType = undefined;
  searchParams.vipInfoFiled = '';
  searchParams.orderCode = '';
  dateRange.value = [];

  // 重新加载数据
  search();
};

const handleSizeChange = (val: number) => {
  searchParams.pageSize = val;
  setSaleRecord();
};

const handleCurrentChange = (val: number) => {
  searchParams.pageNum = val;
  setSaleRecord();
};

/**
 * 冲正
 * @param row 销售订单
 */
const reversal = async (row: any) => {
  if (isFullDaysSince(row.settleTime, 2)) {
    Message.warning('只能对两天以内的记录进行修改或冲正');
    return;
  }

  try {
    const prompt = await MessageBox.prompt({
      title: '销售订单-冲正',
      message: '冲正后，订单将退还"会员卡支付"的金额, 同时将不计算此单业绩，你确定要对此订单进行冲正吗？',
      inputValue: '',
      inputPlaceholder: '输入冲正原因',
      inputType: 'textarea',
    });
    const res = await reqRollBackOrder(row.id, prompt.value);
    parseResMsg(res);
    search();
  } catch (error) {}
};

/**
 * 重打小票
 * @param row 销售订单
 */
const printReceipt = async (row: any) => {
  if (row.orderStatus !== OrderStatus.SETTLED) {
    Message.warning('订单未结算，无法打印小票！');
    return;
  }
  try {
    row.loading = true;

    const res = await reqOrgInfo(row.orgId);
    const org = res.data || {};
    const order = await getOrder(row.orderCode);
    if (isEmpty(order)) {
      return;
    }
    const data: any = { ...order, ...org };
    printer.printOrderByHTML(data, false);
  } catch (error) {
  } finally {
    row.loading = false;
  }
};

/**
 * 获取订单信息
 * @param orderCode 订单号
 * @returns 订单信息
 */
const getOrder = async (orderCode: string) => {
  try {
    const res = await reqQueryOrder(orderCode);
    if (res.code === ResponseCode.SUCCESS) {
      return res.data;
    } else {
      Message.error('请求订单信息错误');
      return {};
    }
  } catch (error) {
    console.error(error);
    Message.error('请求订单信息错误');
    return {};
  }
};

const drawer = reactive({
  visible: false,
  orderData: null,
});

const showDrawer = (row: any) => {
  drawer.orderData = cloneDeep(row);
  drawer.visible = true;
};

const dialog = reactive({
  visible: false,
  data: {},
});

const showDialog = (row: any) => {
  if (isFullDaysSince(row.settleTime, 2)) {
    Message.warning('只能对两天以内的记录进行修改或冲正');
    return;
  }

  dialog.data = cloneDeep(row);
  dialog.visible = true;
};

// 设置行样式
const getRowClassName = ({ row }: { row: { orderStatus: number } }) => {
  return row.orderStatus !== 2 ? 'disabled-row' : '';
};
</script>

<style scoped lang="scss"></style>

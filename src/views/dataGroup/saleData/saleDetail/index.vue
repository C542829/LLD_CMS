<template>
  <div class="main-container">
    <!-- 数据筛选 -->
    <Card class="operation-card">
      <div class="search-container">
        <div class="search-item">
          <label>
            开单时段：
            <DatePicker v-model="searchParams.date" class="w-240" @change="search" />
          </label>
        </div>
        <template v-if="userStore.isAdmin || userStore.isAreaManager">
          <div class="search-item">
            <label>
              门店：
              <OrgSelect
                v-model="searchParams.orgIds"
                placeholder="门店"
                class="w-100"
                :multiple="true"
                @change="search"
                @clear="search"
              />
            </label>
          </div>
        </template>
        <div class="search-item">
          <label>
            销售员：
            <UserSelect
              v-model="searchParams.userId"
              placeholder="销售员"
              class="w-100"
              :multiple="false"
              @change="search"
              @clear="search"
            />
          </label>
        </div>
        <!-- <div class="search-item">
          <label>
            产品：
            <ProductSelect
              v-model="store.searchParams.businessCode"
              placeholder="选择产品"
              class="w-100"
              :multiple="false"
              @change="search"
              @clear="search"
            />
          </label>
        </div> -->
        <!-- <div class="search-item">
          <label>
            项目：
            <ServiceItemSelect
              v-model="store.searchParams.businessCode"
              placeholder="选择项目"
              class="w-100"
              :multiple="false"
              @change="search"
              @clear="search"
            />
          </label>
        </div> -->
        <div class="search-item">
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
        <!-- <div class="search-item">
          <el-button type="primary" @click="">导出表格</el-button>
        </div> -->
      </div>
    </Card>

    <!-- 数据列表 -->
    <Card padding="0">
      <PaginationTable
        v-loading="loading"
        :element-loading-text="LOADING_MSG"
        :data="saleDetail.data"
        :total="saleDetail.total"
        v-model:currentPage="searchParams.pageNum"
        v-model:pageSize="searchParams.pageSize"
        @size-change="handleSizeChange"
        @pagination-current-change="handleCurrentChange"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="orgName" label="门店" min-width="30" />
        <el-table-column prop="orderCode" label="订单编号" />
        <el-table-column prop="detailCode" label="明细编号" />
        <el-table-column label="名称/标准价">
          <template #default="scope">
            <p>{{ scope.row.businessName }}</p>
            <p>标准价：¥{{ scope.row.stdPrice }}</p>
          </template>
        </el-table-column>
        <el-table-column label="实收单价/销售数量">
          <template #default="scope">
            <p>实收单价：¥{{ scope.row.truePrice }}</p>
            <p>销售数量：{{ scope.row.quantity }}</p>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template #default="{ row }">
            <ServiceTypeTag :type="row.detailType" />
          </template>
        </el-table-column>
        <el-table-column label="技师/销售">
          <template #default="{ row }">
            <template v-if="row.technicians">
              {{ row.technicians.map((item: any) => item.userName).join('、') }}
              <ClockInTypeTag :type="row.serverType" />
            </template>
            <template v-else>
              {{ row.userName }}
              <ClockInTypeTag :type="row.serverType" />
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="settledTime" label="结算时间" :formatter="datetimeFormatter" />
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button
              @click="showDialog(scope.row)"
              link
              type="primary"
              :loading="loadingOrderCode === scope.row.orderCode"
            >
              查看原单
            </el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <el-dialog v-model="dialog.visible" title="销售单据" width="800px">
    <Receipt :orderData="currentOrderData" />
  </el-dialog>
</template>

<script setup lang="ts">
import ProductSelect from '@/components/FormComponents/ProductSelect.vue';
import ServiceItemSelect from '@/components/FormComponents/ServiceItemSelect.vue';
import { reactive, onMounted, ref } from 'vue';
import { datetimeFormatter } from '@/utils/formatter';
import Receipt from './Receipt.vue';
import { ElMessage } from 'element-plus';
import { reqSaleDetail, reqOrderInfo } from '@/api/dataGroup/saleData';
import { parseResObj } from '@/utils/parseResponse';
import { LOADING_MSG } from '@/utils/constant';
import useUserStore from '@/store/modules/acl/user';

const userStore = useUserStore();

onMounted(() => {
  search();
});

const search = () => {
  setSaleDetail();
};

const handleSizeChange = (val: number) => {
  searchParams.pageSize = val;
  search();
};

const handleCurrentChange = (val: number) => {
  searchParams.pageNum = val;
  search();
};

const loading = ref(false);

const searchParams = reactive({
  pageNum: 1,
  pageSize: 50,
  date: [] as string[],
  orgIds: [] as number[],
  userId: undefined as number | undefined,
  businessCode: '',
});

const saleDetail = reactive({
  total: 0,
  data: [] as any[],
});

const setSaleDetail = async () => {
  loading.value = true;
  try {
    const params = { ...searchParams };
    const res = await reqSaleDetail(params);
    const data: any = parseResObj(res) || {};
    saleDetail.total = data.total;
    saleDetail.data = data.rows;
  } catch (error) {
    console.error('获取订单详情失败:', error);
  } finally {
    loading.value = false;
  }
};

const dialog = reactive({
  visible: false,
});

const currentOrderData = ref(null);
const loadingOrderCode = ref('');

const showDialog = async (row: any) => {
  try {
    loadingOrderCode.value = row.orderCode;
    const res = await reqOrderInfo(row.orderCode);
    const orderData = parseResObj(res);

    if (orderData) {
      currentOrderData.value = orderData;
      dialog.visible = true;
    } else {
      ElMessage.error('获取订单详情失败');
    }
  } catch (error) {
    console.error('获取订单详情失败:', error);
    ElMessage.error('获取订单详情失败，请稍后重试');
  } finally {
    loadingOrderCode.value = '';
  }
};
</script>

<style scoped lang="scss"></style>

<template>
  <div class="right-table-container" v-loading="loading" :element-loading-text="LOADING_MSG">
    <h2 class="right-table-title">
      <span>充值统计</span>
      <el-button size="small" plain @click="exportRechargeData">导出</el-button>
    </h2>
    <PaginationTable
      :data="rechargeTableData"
      :showPagination="false"
      :stripe="false"
      containerHeight="auto"
      size="small"
      height="auto"
      show-summary
    >
      <el-table-column prop="name" label="充值活动名称" :align="'center'">
        <template #default="{ row }">
          {{ row.name || '会员卡' }}
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="数量" :align="'center'" sortable />
      <el-table-column prop="amount" label="金额" :align="'center'" sortable />
    </PaginationTable>

    <h2 class="right-table-title">
      <span>疗程券统计</span>
      <el-button size="small" plain @click="exportCureTicketData">导出</el-button>
    </h2>
    <PaginationTable
      :data="cureTicketTableData"
      :showPagination="false"
      :stripe="false"
      containerHeight="auto"
      size="small"
      height="auto"
      show-summary
    >
      <el-table-column prop="name" label="疗程券名称" :align="'center'" />
      <el-table-column prop="quantity" label="数量" :align="'center'" sortable />
      <el-table-column prop="amount" label="金额" :align="'center'" sortable />
    </PaginationTable>

    <h2 class="right-table-title">
      <span>项目统计</span>
      <el-button size="small" plain @click="exportServiceItemData">导出</el-button>
    </h2>
    <PaginationTable
      :data="serviceTableData"
      :showPagination="false"
      :summary-method="summaryMethod"
      :stripe="false"
      size="small"
      height="auto"
      containerHeight="auto"
      show-summary
      class="service-item-table"
    >
      <el-table-column prop="name" label="项目名称" :align="'center'" />
      <el-table-column prop="quantity" label="点 | 轮 | 加" :align="'center'">
        <template #default="{ row }">
          <div class="count-num">
            <span class="text-overflow" :title="row.designatedCount">{{ row.designatedCount }}</span>
            <span class="text-overflow" :title="row.rotationCount">{{ row.rotationCount }}</span>
            <span class="text-overflow" :title="row.addCount">{{ row.addCount }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" :align="'center'" sortable />
    </PaginationTable>

    <h2 class="right-table-title">
      <span>产品统计</span>
      <el-button size="small" plain @click="exportProductData">导出</el-button>
    </h2>
    <PaginationTable
      :data="productTableData"
      :showPagination="false"
      :stripe="false"
      containerHeight="auto"
      size="small"
      height="auto"
      show-summary
    >
      <el-table-column prop="name" label="产品名称" :align="'center'" />
      <el-table-column prop="quantity" label="数量" :align="'center'" sortable />
      <el-table-column prop="amount" label="金额" :align="'center'" sortable />
    </PaginationTable>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { type Types, reqProductSales, reqRechargeDetail, reqServiceStats, reqCureTicketSales } from '@/api/home/index';
import { LOADING_MSG } from '@/utils/constants';
import { exportExcel, type ExportColumn } from '@/utils/exportExcel';

const emit = defineEmits(['businessData']);

const loading = ref(false);

/** 充值/开卡数据 */
const rechargeTableData = ref<any[]>([]);
/** 获取充值/开卡数据 */
const getRechargeDetail = async (params: Types.DataViewQuery) => {
  try {
    reqRechargeDetail(params).then((res) => {
      const data = res.data;
      rechargeTableData.value = data.items || [];
    });
  } catch (error) {
    console.error(error);
  }
};

/** 充值/开卡数据 */
const productTableData = ref<any[]>([]);
/** 获取充值/开卡数据 */
const getProductDetail = async (params: Types.DataViewQuery) => {
  try {
    reqProductSales(params).then((res) => {
      const data = res.data;
      productTableData.value = data.items || [];
    });
  } catch (error) {
    console.error(error);
  }
};

/** 充值/开卡数据 */
const serviceTableData = ref<any[]>([]);
/** 获取充值/开卡数据 */
const getServiceDetail = async (params: Types.DataViewQuery) => {
  loading.value = true;
  try {
    reqServiceStats(params)
      .then((res) => {
        const data = res.data;
        serviceTableData.value = data.items || [];
        emit('businessData', data);
      })
      .finally(() => {
        loading.value = false;
      });
  } catch (error) {
    console.error(error);
  }
};

/** 充值/开卡数据 */
const cureTicketTableData = ref<any[]>([]);
/** 获取充值/开卡数据 */
const getCureTicketDetail = async (params: Types.DataViewQuery) => {
  reqCureTicketSales(params).then((res) => {
    const data = res.data;
    cureTicketTableData.value = data.items || [];
  });
};

/** 初始化数据 */
const initData = async (params: Types.DataViewQuery) => {
  getServiceDetail(params);
  getRechargeDetail(params);
  getProductDetail(params);
  getCureTicketDetail(params);
};

defineExpose({
  initData,
});

const summaryMethod = (data: { columns: any[]; data: any[] }) => {
  const { columns, data: rows } = data;
  const sums: any = [];
  columns.forEach((item, index) => {
    if (index === 0) {
      sums[index] = '合计';
      return;
    }
    if (item.property === 'quantity') {
      const lun = calcTotal(rows, 'rotationCount');
      const dian = calcTotal(rows, 'designatedCount');
      const jia = calcTotal(rows, 'addCount');
      sums[index] = `点钟：${dian}\n轮牌：${lun}\n加钟：${jia}`;
      return;
    }

    sums[index] = calcTotal(rows, item.property).toFixed(2);
  });
  return sums;
};
const calcTotal = (rows: any, key: string) => {
  const values = rows.map((row: any) => row[key]);
  const result = values.reduce((prev: any, cur: any) => {
    const value = Number(cur);
    if (!isNaN(value)) {
      return prev + value;
    } else {
      return prev;
    }
  }, 0);
  return result;
};

//#region 导出表格

/** 充值统计列配置 */
const rechargeColumns: ExportColumn<Types.RechargeItem>[] = [
  { key: 'name', title: '充值活动名称', width: 20 },
  { key: 'quantity', title: '数量', width: 10 },
  { key: 'amount', title: '金额', width: 12 },
];

/** 项目统计列配置 */
const serviceColumns: ExportColumn<Types.ServiceItem>[] = [
  { key: 'name', title: '项目名称', width: 20 },
  { key: 'designatedCount', title: '点钟', width: 10 },
  { key: 'rotationCount', title: '轮钟', width: 10 },
  { key: 'addCount', title: '加钟', width: 10 },
  { key: 'amount', title: '金额', width: 12 },
];

/** 产品统计列配置 */
const productColumns: ExportColumn<Types.ProductItem>[] = [
  { key: 'name', title: '产品名称', width: 20 },
  { key: 'quantity', title: '数量', width: 10 },
  { key: 'amount', title: '金额', width: 12 },
];

/** 产品统计列配置 */
const cureTicketColumns: ExportColumn<Types.CureTicketItem>[] = [
  { key: 'name', title: '疗程券名称', width: 20 },
  { key: 'quantity', title: '数量', width: 10 },
  { key: 'amount', title: '金额', width: 12 },
];

/** 导出充值统计数据 */
const exportRechargeData = () => {
  if (!rechargeTableData.value.length) return ElMessage.warning('暂无数据可导出');
  exportExcel<Types.RechargeItem>({
    fileName: '充值统计',
    sheets: {
      sheetName: '充值统计',
      columns: rechargeColumns,
      data: rechargeTableData.value,
    },
  });
};

/** 导出项目统计数据 */
const exportServiceItemData = () => {
  if (!serviceTableData.value.length) return ElMessage.warning('暂无数据可导出');
  exportExcel<Types.ServiceItem>({
    fileName: '项目统计',
    sheets: {
      sheetName: '项目统计',
      columns: serviceColumns,
      data: serviceTableData.value,
    },
  });
};

/** 导出产品统计数据 */
const exportProductData = () => {
  if (!productTableData.value.length) return ElMessage.warning('暂无数据可导出');
  exportExcel<Types.ProductItem>({
    fileName: '产品统计',
    sheets: {
      sheetName: '产品统计',
      columns: productColumns,
      data: productTableData.value,
    },
  });
};

/** 导出疗程券统计数据 */
const exportCureTicketData = () => {
  if (!cureTicketTableData.value.length) return ElMessage.warning('暂无数据可导出');
  exportExcel<Types.CureTicketItem>({
    fileName: '疗程券统计',
    sheets: {
      sheetName: '疗程券统计',
      columns: cureTicketColumns,
      data: cureTicketTableData.value,
    },
  });
};
//#endregion 导出表格
</script>

<style lang="scss" scoped>
.right-table-container {
  height: 100%;
  overflow: auto;

  .right-table-title {
    color: var(--el-text-color-secondary);
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 12px 0;
  }
  .right-table-title:first-child {
    margin-top: 0;
  }

  .service-item-table {
    :deep(.el-table) {
      .el-table__footer-wrapper {
        .cell {
          white-space: pre-line;
        }
      }
    }
  }

  .count-num {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 1fr;
    span:first-child {
      border-right: 1px dashed gray;
    }
    span:last-child {
      border-left: 1px dashed gray;
    }
  }
}
</style>

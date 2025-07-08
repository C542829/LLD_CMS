<template>
  <div class="main-container">
    <!-- 数据筛选 -->
    <Card class="operation-card">
      <div class="search-container">
        <div class="search-item" v-if="false">
          <label for="staffStatus" class="search-label">选择店铺：</label>
          <el-select v-model="store.searchParams.storeId" id="staffStatus" style="width: 120px" placeholder="Select">
            <el-option
              v-for="item in [{ value: 1, label: '' }]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="search-item">
          <label>
            时间：
            <DatePicker v-model="store.activeParams.date" style="width: 260px" />
          </label>
        </div>
        <div class="search-item">
          范围：
          <el-input
            v-model="store.activeParams.fullAmount"
            :disabled="!!store.activeParams.moreAmount"
            style="max-width: 180px"
            placeholder="输入金额"
            clearable
          >
            <template #prepend>消费满</template>
          </el-input>
          &nbsp;
          <el-input
            v-model="store.activeParams.moreAmount"
            :disabled="!!store.activeParams.fullAmount"
            style="max-width: 210px"
            placeholder="输入金额"
            clearable
          >
            <template #prepend>单词消费超过</template>
          </el-input>
        </div>
        <div class="search-item">
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
        <div class="search-item">
          <el-button type="success" @click="">导出所有会员</el-button>
        </div>
      </div>
    </Card>

    <!-- 数据列表 -->
    <Card padding="15px 15px 0 15px">
      <PaginationTable
        v-loading="store.isLoading"
        :data="store.activeRecord.data"
        :total="store.activeRecord.total"
        v-model:currentPage="store.activeParams.currentPage"
        v-model:pageSize="store.activeParams.pageSize"
        @size-change="handleSizeChange"
        @pagination-current-change="handleCurrentChange"
      >
        <el-table-column prop="infoName" label="姓名" min-width="80" />
        <el-table-column prop="infoGender" label="性别" width="60" :formatter="sexMap" />
        <el-table-column prop="infoCardNumber" label="卡号" min-width="80" />
        <el-table-column prop="infoPhoneNumber" label="手机号" width="120" />
        <el-table-column prop="infoLastConsumptionTime" label="末次消费" width="170" />
        <el-table-column prop="infoLastRechargeTime" label="末次充值" width="170" />
        <el-table-column prop="remark" label="备注" min-width="50" />
        <el-table-column label="操作" min-width="80">
          <template #default="scope">
            <el-button link type="primary" @click="showDialog(scope.row)">资产详情</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <el-dialog v-model="dialog.visible" :title="dialog.title" width="800px">
    <PropertyDetail @close-dialog="dialog.visible = false"></PropertyDetail>
  </el-dialog>
</template>

<script setup lang="ts">
import PropertyDetail from '../PropertyDetail.vue';
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { sexMap } from '@/enums/mapFormatter';

// 引入数据仓库
import { useMemberStore } from '@/store/modules/member/member';
const store = useMemberStore();

// 初始化
onMounted(() => {});

onUnmounted(() => {
  store.isLoading = false;
});

// 搜索
const search = () => {
  store.setActiveRecord();
};

// 处理分页变化
const handleSizeChange = (val: number) => {
  store.searchParams.pageSize = val;
  store.setActiveRecord();
};

const handleCurrentChange = (val: number) => {
  store.searchParams.currentPage = val;
  store.setActiveRecord();
};

// 模态框
const dialog: any = reactive({
  title: '优惠券列表',
  visible: false,
});

// 打开模态框
const showDialog = (row: any) => {
  // 显示模态框
  dialog.title = `会员${row.infoName}在本店的资产详情`;
  dialog.visible = true;

  // 表单数据回显
  store.formData = row;
};
</script>

<style scoped lang="scss">
.table-main {
  height: 100%;
}

:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

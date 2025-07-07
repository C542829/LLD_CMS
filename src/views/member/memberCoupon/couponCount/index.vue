<template>
  <div class="main-container">
    <!-- 搜索组件区域 -->
    <Card class="operation-card">
      <div class="search-container">
        <!-- 选择门店 -->
        <div class="search-item" v-if="false">
          <label for="storeId">选择门店：</label>
          <el-select v-model="store.searchParams.storeId" id="storeId" style="width: 120px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <!-- 状态 -->
        <div class="search-item">
          <label for="staffStatus2">优惠券状态：</label>
          <el-select v-model="store.searchParams.ticketStatus" id="staffStatus2" style="width: 120px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <!-- 活动 -->
        <div class="search-item">
          <label for="activity">活动：</label>
          <el-select v-model="store.searchParams.ticketStatus" id="activity" style="width: 120px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <!-- 发放员 -->
        <div class="search-item">
          <label for="staff">发放员：</label>
          <el-select v-model="store.searchParams.ticketStatus" id="staff" style="width: 120px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </div>
      <div class="search-container">
        <!-- 搜索框 -->
        <div class="search-item">
          <label for="searchStaffKey">关键字：</label>
          <div>
            <el-input
              v-model="store.searchParams.ticketName"
              @keydown.enter="search"
              :prefix-icon="Search"
              clearable
              placeholder="优惠券名称"
              id="searchStaffKey"
            >
              <template #append>
                <el-button type="primary" @click="search">搜索</el-button>
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </Card>

    <!-- 数据列表 -->
    <Card class="table-card" padding="15px 15px 0 15px">
      <PaginationTable
        v-loading="store.loading"
        :data="store.couponRecord"
        :total="store.page.total"
        v-model:currentPage="store.page.currentPage"
        v-model:pageSize="store.page.pageSize"
        @size-change="handleSizeChange"
        @pagination-current-change="handleCurrentChange"
      >
        <el-table-column prop="couponName" label="代金券名称" min-width="80" />
        <el-table-column label="领取人" min-width="60">
          <template #default="scope">
            <p>会员姓名：{{ scope.row.memName }}</p>
            <p>会员卡号：{{ scope.row.memCode }}</p>
            <p>电话号码：{{ scope.row.memPhone }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="isEntityTicket" label="使用状态" width="90" />
        <el-table-column label="时间" width="200">
          <template #default="scope">
            <p>领取时间：{{ formatDate(new Date(scope.row.updateTime)) }}</p>
            <p>到期时间：{{ formatDate(new Date(scope.row.limitTime)) }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="fromType" label="领取来源类型" min-width="60" />
        <el-table-column prop="expandStaffName" label="销售员" min-width="50" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button link type="info" @click="">延期</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ElInput } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import { ref, onMounted, inject } from 'vue';
import { formatDate } from '@/utils/time';
// 导入枚举数据
import { statusOptions } from '@/enums/index';
// 引入数据仓库
import { useCouponStore } from '@/store/modules/member/memberCoupon';
const store = useCouponStore();

onMounted(() => {
  store.setCouponRecord();
});

// 搜索
const search = () => {
  store.setCouponRecord();
};

// 处理分页变化
const handleSizeChange = (val: number) => {
  store.page.pageSize = val;
  store.setCouponRecord();
};

const handleCurrentChange = (val: number) => {
  store.page.currentPage = val;
  store.setCouponRecord();
};
</script>

<style scoped lang="scss">
:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

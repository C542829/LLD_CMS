<template>
  <div class="main-container">
    <!-- 数据筛选 -->
    <Card class="operation-card">
      <!-- 第一行 -->
      <div class="search-container">
        <div class="search-item">
          <label>
            销售时段：
            <DatePicker v-model="store.searchParams.date" @change="search" style="width: 260px" />
          </label>
        </div>
      </div>

      <!-- 第二行 -->
      <div class="search-container">
        <template v-if="userStore.isAdmin || userStore.isAreaManager">
          <div class="search-item">
            <label>
              门店：
              <OrgSelect
                v-model="store.searchParams.orgIds"
                placeholder="门店"
                class="w-120"
                :multiple="true"
                @change="search"
                @clear="search"
              />
            </label>
          </div>
        </template>
        <div class="search-item">
          <label>
            技师：
            <UserSelect
              v-model="store.searchParams.userId"
              placeholder="技师"
              class="w-100"
              :multiple="false"
              @change="search"
              @clear="search"
            />
          </label>
        </div>
        <div class="search-item">
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="success" :disabled="true" @click="search">导出表格</el-button>
        </div>
      </div>
    </Card>

    <!-- 数据列表 -->
    <Card padding="0">
      <PaginationTable
        v-loading="settingStore.loading"
        :element-loading-text="settingStore.loadingMsg"
        :data="store.performanceSummary"
        :showPagination="false"
        show-summary
        style="width: 100%"
        row-key="userName"
      >
        <el-table-column type="expand" width="60" fixed>
          <template #default="{ row }">
            <PersonalPerformanceTable :data="row" />
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="60" fixed />
        <el-table-column prop="orgName" label="门店" width="60" fixed />
        <el-table-column prop="userName" label="技师" width="100" fixed />
        <el-table-column prop="totalPerformance" label="总业绩" min-width="85" fixed />
        <el-table-column prop="totalCommission" label="总提成" min-width="85" fixed />
        <el-table-column prop="totalProjectCount" label="总项目次" min-width="85" />
        <el-table-column prop="appointmentCount" label="点钟次数" min-width="85" />
        <el-table-column prop="rotationCount" label="轮牌次数" min-width="85" />
        <el-table-column prop="extendCount" label="加钟次数" min-width="85" />
        <el-table-column prop="projectPerformance" label="项目业绩" min-width="85" />
        <el-table-column prop="projectCommission" label="项目提成" min-width="85" />
        <el-table-column prop="productPerformance" label="产品业绩" min-width="85" />
        <el-table-column prop="productCommission" label="产品提成" min-width="85" />
        <el-table-column prop="cureTicketPerformance" label="疗程销售业绩" min-width="110" />
        <el-table-column prop="cureTicketCommission" label="疗程销售提成" min-width="110" />
        <el-table-column prop="rechargePerformance" label="卡金业绩" min-width="85" />
        <el-table-column prop="rechargeCommission" label="卡金提成" min-width="85" />
      </PaginationTable>
    </Card>
  </div>
</template>

<script setup lang="ts">
import PersonalPerformanceTable from '../components/PersonalPerformanceTable.vue';
import { ref, reactive, onMounted } from 'vue';
// 引入数据仓库
import { useSettingStore } from '@/store/modules/acl/setting';
import { useStaffPerformanceStore } from '@/store/modules/dataGroup/staffPerformance';
import { useDataEnumStore } from '@/store/modules/enums/index';
import useUserStore from '@/store/modules/acl/user';

const userStore = useUserStore();
const settingStore = useSettingStore();
const store = useStaffPerformanceStore();
const dataEnumStore = useDataEnumStore();

// 技师列表
const staffList: any = ref([]);
const loadStaffList = async () => {
  try {
    staffList.value = await dataEnumStore.getStaffList();
  } catch (error) {
    console.error('加载技师列表失败:', error);
  }
};

// 初始化
onMounted(() => {
  loadStaffList();
  store.setPerformanceSummary();
});

// 搜索
const search = () => {
  store.setPerformanceSummary();
};
</script>

<style scoped lang="scss"></style>

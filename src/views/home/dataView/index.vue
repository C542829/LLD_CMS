<template>
  <div class="data-view-container" v-loading="loading" :element-loading-text="LOADING_MSG">
    <div class="left-content">
      <div class="content-top">
        <div class="filter-row">
          <div>日记单</div>
          <div>
            <template v-if="userStore.isAdmin || userStore.isAreaManager">
              <label>
                门店：
                <OrgSelect
                  v-model="searchParams.orgIds"
                  placeholder="门店"
                  class="w-100"
                  :multiple="true"
                  :maxCollapseTags="0"
                  @change="search"
                  @clear="search"
                />
              </label>
            </template>
            <label style="margin: 0 10px">
              统计日期：
              <DatePicker v-model="dateRange" @change="search" @clear="search" class="w-240" />
            </label>
            <el-button disabled @click="" plain>打印数据</el-button>
          </div>
        </div>
        <div class="chart-container">
          <div class="pie-chart-list">
            <div class="chart-item">
              <PieChart :data="incomeData" title="实收合计" radius="[40%, 70%]" height="100%" />
            </div>
            <div class="chart-item">
              <PieChart
                :data="performanceData"
                title="劳动业绩"
                radius="[40%, 70%]"
                height="100%"
                centerText="劳动业绩"
              />
            </div>
            <div class="chart-item">
              <PieChart
                :data="businessData"
                title="业务统计"
                radius="[40%, 70%]"
                height="100%"
                unit="次"
                :centerText="`总项目次\n${totalItem}次`"
              />
              <!-- <PieChart
                :data="memberStats"
                title="会员统计"
                radius="[40%, 70%]"
                height="100%"
                unit="次"
                centerText="劳动业绩"
              /> -->
              <!-- :centerText="`会员数\n${memberStats[0].value}次`" -->
            </div>
          </div>
          <div class="bar-chart-list">
            <BarChart :data="revenueSummary" title="收入划分" xAxisName="" yAxisName="单位(元)" height="100%" />
            <BarChart
              :data="technicianRanking"
              :title="`技师业绩排名（前十）`"
              xAxisName=""
              yAxisName="单位(元)"
              height="100%"
            />
          </div>
        </div>
      </div>
      <!-- <div class="content-bottom">
        <div class="bottom-item">
          <span></span>
          <span>会员公众号</span>
        </div>
        <div class="bottom-item">
          <span></span>
          <span>会员小程序</span>
        </div>
        <div class="bottom-item">
          <span></span>
          <span>员工小程序</span>
        </div>
        <div class="bottom-item">
          <span></span>
          <span>管理小程序</span>
        </div>
      </div> -->
    </div>
    <div class="right-content">
      <RightTable ref="rightTableRef" @businessData="setBusinessData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PieChart from '@/views/home/components/PieChart.vue';
import BarChart from '@/views/home/components/BarChart.vue';
import RightTable from './components/RightTable.vue';
import { ref, reactive, onMounted, computed } from 'vue';
import { type Types } from '@/api/home/index';
import { formatDate, generateDateRange } from '@/utils/time';
import { LOADING_MSG } from '@/utils/constant';
import {
  DEFAULT_SEARCH_PARAMS,
  colors,
  getRevenueSummary,
  getTechnicianRanking,
  getMemberStats,
  getServiceStats,
} from './utils/index';
import useUserStore from '@/store/modules/acl/user';
const userStore = useUserStore();

interface ChartData {
  name?: string;
  value: number;
  itemStyle?: any;
}

onMounted(() => {
  search();
});

/** 收入划分数据 */
const revenueSummary = ref<ChartData[]>([]);
/** 技师业绩排名数据 */
const technicianRanking = ref<ChartData[]>([]);
/** 会员统计数据 */
const memberStats = ref<ChartData[]>([]);
/** 实收合计数据 */
const incomeData: any = ref([
  { name: '扫码', value: 0 },
  { name: '现金', value: 0 },
  { name: '抖音', value: 0 },
  { name: '美团', value: 0 },
  { name: 'POS', value: 0 },
]);
/** 劳动业绩数据 */
const performanceData = ref([
  { name: '应收', value: 0 },
  { name: '优惠', value: 0 },
  { name: '实收', value: 0 },
]);

const loading = ref(false);
const rightTableRef = ref<typeof RightTable>();
const dateRange = ref(generateDateRange());
const searchParams = reactive<Types.DataViewQuery>(DEFAULT_SEARCH_PARAMS);

const handleSearchParams = () => {
  if (dateRange.value.length === 0) {
    searchParams.startDate = '';
    searchParams.endDate = '';
    return;
  } else {
    searchParams.startDate = formatDate(dateRange.value[0]) as string;
    searchParams.endDate = formatDate(dateRange.value[1]) as string;
  }
};

const search = async () => {
  loading.value = true;
  try {
    // 处理搜索参数
    handleSearchParams();

    // 获取收入划分数据
    const { actualIncome, allIncome, performance } = await getRevenueSummary(searchParams);
    revenueSummary.value = allIncome;
    incomeData.value = actualIncome;
    performanceData.value = performance;

    // 获取技师业绩排名数据
    // technicianRanking.value = await getTechnicianRanking(searchParams);
    getTechnicianRanking(searchParams).then((data: any) => {
      technicianRanking.value = data || [];
    });

    // 获取会员统计数据
    // memberStats.value = await getMemberStats(searchParams);
    getMemberStats(searchParams).then((data: any) => {
      memberStats.value = data || [];
    });

    // 初始化右侧表格数据
    rightTableRef.value?.initData(searchParams);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

/** 业务统计数据 */
const businessData = ref([
  { name: '点钟', value: 0 },
  { name: '加钟', value: 0 },
  { name: '轮牌', value: 0 },
]);

const totalItem = computed(() => {
  return businessData.value.reduce((acc, cur) => acc + cur.value, 0);
});

const setBusinessData = (data: ChartData[]) => {
  const result = getServiceStats(data);
  businessData.value = result || [];
};
</script>

<style scoped lang="scss">
.data-view-container {
  width: 100%;
  height: 100%;
  background-color: $base-bg;
  display: flex;
  gap: 15px;

  .left-content {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
    > div {
      border-radius: 5px;
      background-color: $base-main-bg;
    }
    .content-top {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 15px;
      padding: 10px;
      color: var(--el-text-color-regular);
      overflow: auto;
      .filter-row {
        height: 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
      }
      .chart-container {
        height: calc(100% - 52px);
        > div {
          height: 50%;
        }

        .pie-chart-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: 1fr;
          gap: 15px;
          .chart-item {
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
          }
        }
        .bar-chart-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: 1fr;
        }
      }
    }
    .content-bottom {
      height: 160px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: 1fr;
      padding: 10px;
      gap: 10px;

      .bottom-item {
        height: 100%;
        font-size: 14px;
        text-align: center;
        > span:first-child {
          display: inline-block;
          width: 100%;
          height: calc(100% - 30px);
          margin-bottom: 10px;
          border-radius: 5px;
          background-color: $base-bg;
        }
      }
    }
  }

  .right-content {
    width: 400px;
    padding: 10px;
    height: 100%;
    border-radius: 5px;
    overflow: auto;
    background-color: $base-main-bg;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
}
</style>

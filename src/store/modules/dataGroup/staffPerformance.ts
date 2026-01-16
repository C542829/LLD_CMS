import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { reqPerformanceRecord, reqPerformanceSummary } from '@/api/dataGroup/staffPerformance';
import { reqQueryOrder } from '@/api/order';
import { parseResMsg, parseResList, parseResObj } from '@/utils/parseResponse';

import { useSettingStore } from '@/store/modules/acl/setting';

export const useStaffPerformanceStore = defineStore('StaffPerformance', () => {
  const settingStore = useSettingStore();

  const searchParams: any = ref({
    pageNum: 1,
    pageSize: 50,
    userId: null, // 技师ID
    date: [], // 日期范围
  });

  // 员工绩效记录
  const performanceRecord = reactive({
    total: 0,
    data: [],
  });
  const setPerformanceRecord = async () => {
    settingStore.loading = true;
    const params = { ...searchParams.value };
    const res = await reqPerformanceRecord(params);
    let data: any = parseResObj(res);
    performanceRecord.total = data.total;
    performanceRecord.data = data.rows;
    settingStore.loading = false;
  };

  // 员工绩效汇总
  const performanceSummary = ref([]);
  const setPerformanceSummary = async () => {
    settingStore.loading = true;

    const params = {
      userId: searchParams.value.userId,
      date: searchParams.value.date,
    };
    const res = await reqPerformanceSummary(params);
    let data: any = parseResList(res);

    performanceSummary.value = data || [];
    settingStore.loading = false;
  };

  // 查询订单详情
  const queryOrderDetail = async (orderCode: string) => {
    try {
      settingStore.loading = true;

      const res = await reqQueryOrder(orderCode);
      const data = parseResObj(res, '查询订单详情成功');

      return data;
    } catch (error) {
      console.error('查询订单详情失败:', error);
      throw error;
    } finally {
      settingStore.loading = false;
    }
  };

  return {
    searchParams,
    performanceRecord,
    setPerformanceRecord,
    performanceSummary,
    setPerformanceSummary,
    queryOrderDetail,
  };
});

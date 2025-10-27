import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { reqSaleRecord, reqSaleDetail, reqSaleSummary } from '@/api/dataGroup/saleData';
import { parseResMsg, parseResList, parseResObj } from '@/utils/parseResponse';

import { useSettingStore } from '@/store/modules/acl/setting';

export const useSaleStore = defineStore('SaleData', () => {
  const settingStore = useSettingStore();

  const searchParams: any = ref({
    pageNum: 1,
    pageSize: 50,
  });

  const saleRecord = reactive({
    total: 0,
    data: [],
  });
  const setSaleRecord = async () => {
    settingStore.loading = true;

    const params = { ...searchParams.value };
    const res = await reqSaleRecord(params);
    let data: any = parseResObj(res, '获取销售记录成功') || [];
    console.log(data);

    saleRecord.total = data.total;
    saleRecord.data = data.rows;
    settingStore.loading = false;
  };

  const saleSummary = reactive({
    total: 0,
    data: [],
  });
  const setSaleSummary = async () => {
    settingStore.loading = true;

    const params = { ...searchParams.value };
    const res = await reqSaleSummary(params);
    let data: any = parseResList(res, '获取销售汇总成功') || [];
    console.log(data);

    saleSummary.data = data;
    settingStore.loading = false;
  };

  const saleDetail = reactive({
    total: 0,
    data: [],
  });
  const setSaleDetail = async () => {
    settingStore.loading = true;

    const params = { ...searchParams.value };
    const res = await reqSaleDetail(params);
    let data: any = parseResObj(res, '获取销售详情成功') || {};
    console.log(data);

    saleDetail.total = data.total;
    saleDetail.data = data.rows;
    settingStore.loading = false;
  };

  return {
    searchParams,
    saleRecord,
    saleSummary,
    setSaleRecord,
    setSaleSummary,
    saleDetail,
    setSaleDetail,
  };
});

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
    let data: any = parseResObj(res, '获取销售记录失败') || [];
    console.log(data);

    saleRecord.total = data.total;
    saleRecord.data = data.rows;
    settingStore.loading = false;
  };

  return {
    searchParams,
    saleRecord,
    setSaleRecord,
  };
});

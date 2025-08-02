import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { reqRechargeHistoryList, reqUpdateRechargeHistory } from '@/api/member/recharge';
import { parseResList, parseResMsg, parseResObj } from '@/utils/parseResponse';
import { formatDate } from '@/utils/time';

import { useSettingStore } from '@/store/modules/acl/setting';

export const useRechargeStore = defineStore('Recharge', () => {
  const settingStore = useSettingStore();

  const member: any = ref({});

  const rechargeFormData: any = ref({
    amount: 0,
    discountRate: 100,
    discountBase: 'member',
    crossStoreSettlement: 'allow',
    salesperson: '',
    performanceTechnicians: [{ name: '', amount: 0 }],
    paymentMethods: [{ method: 'douyin', amount: 0 }],
  });

  const rechargeActivity: any = ref({});

  const recharge = () => {
    console.log('rechargeFormData = ', rechargeFormData.value);
    console.log('rechargeActivity = ', rechargeActivity.value);
  };

  const reset = () => {
    member.value = {};
    rechargeActivity.value = {};
    rechargeFormData.value = {
      amount: 0,
      discountRate: 100,
      discountBase: 'member',
      crossStoreSettlement: 'allow',
      salesperson: '',
      performanceTechnicians: [{ name: '', amount: 0 }],
      paymentMethods: [{ method: 'douyin', amount: 0 }],
    };
  };

  // 请求参数
  const recordSearch = reactive({
    date: [],
    payType: '',
    inputValue: '',
    rechargeStatus: '',
    memberId: '',
    pageNum: 1,
    pageSize: 50,
  });

  const resetRecordSearchParams = () => {
    recordSearch.inputValue = '';
    recordSearch.payType = '';
    recordSearch.rechargeStatus = '';
    recordSearch.memberId = '';
    recordSearch.date = [];
    setRechargeRecord();
  };

  // 处理请求参数
  const handleParams = () => {
    const params: any = { ...recordSearch };

    if (params.date.length !== 0) {
      params.startTime = formatDate(params.date[0]);
      params.endTime = formatDate(params.date[1]);
    }

    // 移除多余参数
    delete params.date;

    return params || {};
  };

  // 响应结果
  const rechargeRecord: any = reactive({ total: 0, list: [] });
  const setRechargeRecord = async () => {
    settingStore.loading = true;

    // 获取数据列表
    const params = handleParams();
    // const res = await reqVipList(params);
    // const data = parseResObj(res);

    const data = { total: 0, list: [] };
    // 处理数据
    rechargeRecord.total = data.total;
    rechargeRecord.list = data.list;

    settingStore.loading = false;
  };

  // #endregion

  return {
    member,
    rechargeFormData,
    rechargeActivity,
    recharge,
    reset,
    rechargeRecord,
    setRechargeRecord,
    recordSearch,
    resetRecordSearchParams,
  };
});

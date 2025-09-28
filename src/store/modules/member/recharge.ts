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
    vipId: 999,
    vipName: '陆睿',
    vipPhoneNumber: '17909590614',
    vipCardNumber: 'FD-BE-6193-M',
    activeId: 2,
    activeName: '充1000送5次99元项目',
    rechargeValue: 1000,
    assetDiscountRate: 100,
    assetDiscountBase: 0,
    assetIsCrossStore: 1,
    rechargeRoleId: 1,
    userKpi: {
      userId: 6,
      userName: '张秀英',
      kpi: 500,
    },
    userKpiList: [
      {
        userId: 6,
        userName: '张秀英',
        kpi: 500,
      },
      {
        userId: 11,
        userName: '朱晓明',
        kpi: 500,
      },
    ],
    paymentInfoList: [
      {
        paymentType: 0,
        paymentName: '微信支付',
        paymentAmount: 1000,
      },
    ],
  });

  const rechargeActivity: any = ref({});

  const recharge = () => {
    console.log('member = ', member.value);
    console.log('rechargeFormData = ', rechargeFormData.value);
    console.log('rechargeActivity = ', rechargeActivity.value);
  };

  const reset = () => {
    member.value = {};
    rechargeActivity.value = {};
    rechargeFormData.value = {
      vipId: '',
      vipName: '',
      vipPhoneNumber: '',
      vipCardNumber: '',
      activeId: '',
      activeName: '',
      rechargeValue: 0,
      assetDiscountRate: 100,
      assetDiscountBase: 0,
      assetIsCrossStore: 0,
      rechargeRoleId: '',
      userKpi: {
        userId: '',
        userName: '',
        kpi: 0,
      },
      userKpiList: [
        {
          userId: '',
          userName: '',
          kpi: 0,
        },
      ],
      paymentInfoList: [
        {
          paymentType: '',
          paymentName: '',
          paymentAmount: 0,
        },
      ],
    };
  };

  // #region 充值记录
  // 充值记录请求参数
  const recordSearch = reactive({
    date: [],
    paymentType: '',
    vipInfoFiled: '',
    rechargeStatus: '',
    userId: '',
    pageNum: 1,
    pageSize: 50,
  });

  const resetRecordSearchParams = () => {
    recordSearch.vipInfoFiled = '';
    recordSearch.paymentType = '';
    recordSearch.rechargeStatus = '';
    recordSearch.userId = '';
    recordSearch.date = [];
    setRechargeRecord();
  };

  // 处理请求参数
  const handleParams = () => {
    const params: any = { ...recordSearch };
    if (params.date && params.date.length !== 0) {
      params.startDate = formatDate(params.date[0]);
      params.endDate = formatDate(params.date[1]);
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
    const res = await reqRechargeHistoryList(params);
    const data = parseResList(res);
    rechargeRecord.total = data.length;
    rechargeRecord.list = data;

    // 处理数据
    // const data = parseResObj(res);
    // rechargeRecord.total = data.total;
    // rechargeRecord.list = data.list;

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

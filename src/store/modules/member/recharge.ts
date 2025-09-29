import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import Message from '@/components/Message';
import { reqRecharge, reqRechargeHistoryList, reqUpdateRechargeHistory } from '@/api/member/recharge';
import { parseResList, parseResMsg, parseResObj } from '@/utils/parseResponse';
import { formatDate } from '@/utils/time';
import { ResponseCode, paymentTypeMap } from '@/enums/index';

import { useSettingStore } from '@/store/modules/acl/setting';

export const useRechargeStore = defineStore('Recharge', () => {
  const settingStore = useSettingStore();

  const member: any = ref({});
  const rechargeActivity: any = ref({});
  const rcRule: any = ref({});

  const rechargeFormData: any = ref({
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
        paymentType: 0,
        paymentName: '',
        paymentAmount: 0,
      },
    ],
  });

  // 计算支付金额总和
  const calcTotal = (params: any) => {
    let total = 0;
    if (params.paymentInfoList && params.paymentInfoList.length !== 0) {
      params.paymentInfoList.forEach((item: any) => {
        total += item.paymentAmount;
      });
    }
    return total;
  };

  // 处理充值参数
  const handleRechargeParams = () => {
    const params: any = { ...rechargeFormData.value };
    if (!params.rechargeValue) {
      Message.error('请输入充值金额');
      return;
    }
    if (params.paymentInfoList && params.paymentInfoList.length === 0) {
      Message.error('请添加支付方式');
      return;
    } else if (calcTotal(params) !== params.rechargeValue) {
      Message.error('支付金额总和与充值金额不一致');
      return;
    } else {
      for (const item of params.paymentInfoList) {
        item.paymentName = paymentTypeMap[item.paymentType];
      }
    }
    if (member.value && member.value.id) {
      params.vipId = member.value.id;
      params.vipName = member.value.name;
      params.vipPhoneNumber = member.value.phoneNumber;
      params.vipCardNumber = member.value.cardNumber;
    } else {
      Message.error('请先选择会员');
      return;
    }
    if (rechargeActivity.value && rechargeActivity.value.id) {
      params.activeId = rechargeActivity.value.id;
      params.activeName = rechargeActivity.value.activeName;
    }
    if (params.userKpi && params.userKpi.id) {
      params.userKpiList = [
        {
          userId: params.userKpi?.id,
          userName: params.userKpi?.userName,
          kpi: params.rechargeValue || 0,
        },
      ];
      delete params.userKpi;
    } else {
      for (let item of params.userKpiList) {
        // element.kpi = element.kpi || 0;
        const data = {
          userId: item.user.id,
          userName: item.user.userName,
          kpi: item.kpi || 0,
        };
        item.userId = item.user.id;
        item.userName = item.user.userName;
        delete item.user;
      }
    }
    if ((params.userKpiList && params.userKpiList.length === 0) || !params.userKpiList[0].userId) {
      Message.error('请选择销售员');
      return;
    }
    if (rcRule.value && rcRule.value.id) {
      params.rechargeRoleId = rcRule.value.id;
    } else {
      Message.error('充值提成规则不能为空');
      return;
    }
    return params || {};
  };

  // 充值
  const recharge = async () => {
    const params = handleRechargeParams();
    if (!params) {
      Message.error('充值信息填写不完整');
      return;
    }
    settingStore.loading = true;
    const res: any = await reqRecharge(params);
    const data = parseResMsg(res);
    data && reset();
    settingStore.loading = false;
    return data;
  };

  // 重置充值表单
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
    rcRule,
    rechargeActivity,
    recharge,
    reset,
    rechargeRecord,
    setRechargeRecord,
    recordSearch,
    resetRecordSearchParams,
  };
});

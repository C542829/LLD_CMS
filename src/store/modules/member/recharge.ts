import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { reqVipList, reqVipInfo, reqAddVip, reqUpdateVip } from '@/api/member/memberList';
import {
  reqRechargeHistoryList,
  reqUpdateRechargeHistory,
  reqActiveList,
  reqAddActive,
  reqActiveInfo,
} from '@/api/member/recharge';
import { parseResList, parseResMsg, parseResObj } from '@/utils/parseResponse';
import { formatDate } from '@/utils/time';

import { useSettingStore } from '@/store/modules/acl/setting';

export const useRechargeStore = defineStore('Recharge', () => {
  const settingStore = useSettingStore();

  // #region 会员充值

  const member: any = ref({});

  const setMember = async (params: any) => {
    settingStore.loading = true;

    // 获取数据列表
    const res = await reqVipInfo(params);
    let data = parseResObj(res) || {};

    // 处理数据
    member.value = data;
    settingStore.loading = false;
  };

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

  // #endregion

  // #region 充值记录

  // 请求参数
  const rechargeRecordParams = reactive({
    amount: null,
    amountType: 0,
    date: [],
    pageSize: 50,
    currentPage: 1,
  });

  // 处理请求参数
  const handleTotalParams = () => {
    const params: any = { ...rechargeRecordParams };

    // 处理参数
    if (params.amount) {
      params.amountType === 0 ? (params.less = params.amount) : (params.greater = params.amount);
    }
    if (params.date.length !== 0) {
      params.startTime = formatDate(params.date[0]);
      params.endTime = formatDate(params.date[1]);
    }

    // 移除多余参数
    delete params.amount;
    delete params.amountType;
    delete params.date;

    return params;
  };

  // 响应结果
  const totalRecord: any = reactive({
    total: 0,
    data: [],
  });
  const setTotalRecord = async () => {
    settingStore.loading = true;

    // 获取数据列表
    const params = handleTotalParams();
    const res = await reqVipList(params);
    let data = parseResList(res);

    // 处理数据
    totalRecord.total = data.length;
    const start = rechargeRecordParams.pageSize * (rechargeRecordParams.currentPage - 1);
    const end = rechargeRecordParams.pageSize * rechargeRecordParams.currentPage;
    data = data.slice(start, end);
    totalRecord.data = data;

    settingStore.loading = false;
  };

  // #endregion

  // #region 充值活动

  // 请求参数
  const activityParams = reactive({
    storeId: null,
    status: 0,
    inputValue: '',
  });

  // 响应结果
  const activityList: any = ref([]);
  const setActivityList = async () => {
    settingStore.loading = true;

    // 获取数据列表
    const params = activityParams;
    // const res = await reqActiveList(params);
    // let data = parseReqList(res);

    // 数据处理
    // activityList.value = data;
    activityList.value = [
      { id: 1, title: '1380两个月半价1', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
      { id: 2, title: '1380两个月半价2', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
      { id: 3, title: '1380两个月半价3', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
      { id: 4, title: '1380两个月半价4', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
      { id: 5, title: '1380两个月半价5', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
      { id: 6, title: '1380两个月半价6', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
      { id: 7, title: '1380两个月半价6', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
      { id: 8, title: '1380两个月半价6', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
      { id: 9, title: '1380两个月半价6', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
      { id: 10, title: '1380两个月半价6', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
      { id: 11, title: '1380两个月半价6', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
      { id: 12, title: '1380两个月半价6', subtitle: '标准价6.9折', status: 'active', 'end-date': '2026-06-16' },
    ];
    settingStore.loading = false;
  };

  const update = async (data: any) => {
    // 浅拷贝防止操作原对象
    data = { ...data };
    console.log('更新充值活动数据 = ', data);

    // 发送请求
    const res = await reqAddActive(data);
    const result = parseResMsg(res);
    // 刷新数据
    result && setActivityList();
    return result;
  };

  // 表单数据
  const formData: any = ref({});

  // 重置表单数据模型
  const resetFormData = () => {
    formData.value = {
      id: 0,
      infoName: '',
      infoPwd: '',
      infoCardNumber: '',
      infoGender: 0,
      infoPhoneNumber: '',
      infoIdentity: '普通会员',
      infoBirthday: '',
      infoAddress: '',
      infoLastConsumptionTime: '',
      infoLastRechargeTime: '',
      remark: '',
      assetBalance: 0,
    };
  };

  // #endregion

  return {
    member,
    rechargeFormData,
    rechargeActivity,
    recharge,
    reset,
    setMember,

    rechargeRecordParams,
    totalRecord,
    setTotalRecord,

    activityList,
    activityParams,
    setActivityList,
    update,
    formData,
    resetFormData,
  };
});

import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { reqVipList, reqVipInfo, reqAddVip, reqUpdateVip } from '@/api/member/memberList';
import { parseResList, parseResObj, parseResMsg } from '@/utils/parseResponse';

import { formatDate } from '@/utils/time';

import { useSettingStore } from '@/store/modules/acl/setting';

export const useMemberStore = defineStore('Member', () => {
  const settingStore = useSettingStore();

  // #region 会员列表

  // 搜索参数
  const search = reactive<any>({
    queryField: '',
    pageNum: 1,
    pageSize: 20,
  });

  // 会员列表
  const tableData: any = reactive({ total: 0, list: [] });
  const setTableData = async () => {
    settingStore.loading = true;
    // 获取数据列表
    const res = await reqVipList(search);
    let data = parseResList(res);

    // 处理数据
    tableData.total = data.length;
    const start = search.pageSize * (search.pageNum - 1);
    const end = search.pageSize * search.pageNum;
    data = data.slice(start, end);
    tableData.list = data;
    settingStore.loading = false;
  };

  // #endregion

  // #region 会员统计

  // 请求参数
  const totalParams = reactive({
    amount: null,
    amountType: 0,
    date: [],
    pageSize: 50,
    currentPage: 1,
  });

  // 处理请求参数
  const handleTotalParams = () => {
    const params: any = { ...totalParams };

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
    const start = totalParams.pageSize * (totalParams.currentPage - 1);
    const end = totalParams.pageSize * totalParams.currentPage;
    data = data.slice(start, end);
    totalRecord.data = data;

    settingStore.loading = false;
  };

  // #endregion

  // #region 会员活跃分析

  // 请求参数
  const activeParams = reactive({
    moreAmount: null,
    fullAmount: null,
    date: [],
    pageSize: 50,
    currentPage: 1,
  });

  // 处理请求参数
  const handleActiveParams = () => {
    const params: any = { ...activeParams };

    // 处理参数
    if (params.date.length !== 0) {
      params.startTime = formatDate(params.date[0]);
      params.endTime = formatDate(params.date[1]);
    }
    !params.moreAmount && delete params.moreAmount;
    !params.fullAmount && delete params.fullAmount;

    // 移除多余参数
    delete params.date;

    return params || {};
  };

  // 响应结果
  const activeRecord: any = reactive({
    total: 0,
    data: [],
  });
  const setActiveRecord = async () => {
    settingStore.loading = true;

    // 获取数据列表
    const params = handleActiveParams();
    const res = await reqVipList(params);
    let data = parseResList(res);

    // 处理数据
    activeRecord.total = data.length;
    const start = params.pageSize * (params.currentPage - 1);
    const end = params.pageSize * params.currentPage;
    data = data.slice(start, end);
    activeRecord.data = data;

    settingStore.loading = false;
  };

  // #endregion

  // #region 数据更新

  const update = async (data: any) => {
    // 浅拷贝防止操作原对象
    data = { ...data };

    // 发送请求
    data.infoCardNumber = 'VIP000001';
    data.infoBirthday = data.infoBirthday + ' 00:00:00';

    const res = await (data?.id ? reqUpdateVip(data) : reqAddVip(data));
    const result = parseResMsg(res);
    // 刷新数据
    result && setTableData();
  };
  const updatePwd = async (infoPwd = '123456') => {
    const data = { ...formData.value, infoPwd };
    const res = await reqUpdateVip(data);
    const result = parseResMsg(res);
    // 刷新数据
    result && setTableData();
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
    search,
    tableData,
    setTableData,
    update,
    formData,
    resetFormData,
    updatePwd,

    totalParams,
    totalRecord,
    setTotalRecord,

    activeParams,
    activeRecord,
    setActiveRecord,
  };
});

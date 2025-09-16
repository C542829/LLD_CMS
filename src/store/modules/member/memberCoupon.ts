import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import {
  reqTicketList,
  reqAddTicket,
  reqUpdateTicket,
  reqUpdateTicketStatus,
  reqCountTicket,
} from '@/api/member/coupon/index';
import { parseResList, parseResMsg, parseResObj } from '@/utils/parseResponse';
import { formatDate } from '@/utils/time';

import { useSettingStore } from '@/store/modules/acl/setting';

export const useCouponStore = defineStore('CouponStore', () => {
  const settingStore = useSettingStore();
  // 搜索参数
  const searchParams = ref<any>({
    ticketName: '',
    ticketStatus: 0,
    dateRange: [new Date(), new Date()],
  });

  const page = reactive({
    total: 0,
    currentPage: 1,
    pageSize: 50,
  });

  const getCouponList = async (params = { ticketName: '', ticketStatus: 1 }) => {
    const res = await reqTicketList(params);
    let data = parseResList(res);
    return data;
  };

  // 优惠券列表
  const tableData: any = ref([]);
  const setTableData = async () => {
    settingStore.loading = true;
    const params = {
      ...searchParams.value,
    };
    delete params.dateRange;
    let data = await getCouponList(params);
    // 处理数据
    tableData.value = data;
    settingStore.loading = false;
  };

  /**
   * 增改操作
   * @param data 修改的数据
   * @returns 是否操作成功
   */
  const update = async (data: any) => {
    data = { ...data };
    // 发送请求
    const res = await (data?.id ? reqUpdateTicket(data) : reqAddTicket(data));
    const result = parseResMsg(res);
    // 刷新数据
    result && setTableData();
    return result;
  };

  /**
   * 优惠券状态修改
   * @param data 修改的数据
   * @returns 是否操作成功
   */
  const updateStatus = async (data: any) => {
    data.ticketStatus = data.ticketStatus === 0 ? 1 : 0;
    const params = { id: data.id, status: data.ticketStatus };
    const res = await reqUpdateTicketStatus(params);
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
      id: null,
      ticketName: '',
      ticketType: 0,
      ticketEffectiveTime: null,
      ticketFullPayment: null,
      ticketValue: null,
      ticketDescription: '',
      serverItemIds: [],
    };
  };

  // 优惠券发放记录
  const recordParams = reactive({
    activeId: null,
    vipTicketId: null,
    status: null,
    vipInfoFiled: '',
    pageNum: 1,
    pageSize: 50,
    total: 0,
  });
  const couponRecords: any = ref([]);
  const getCouponRecords = async (params: {}) => {
    const res = await reqCountTicket(params);
    const pageData = parseResObj(res);
    return pageData;
  };

  const setCouponRecords = async () => {
    settingStore.loading = true;
    const { rows, total } = await getCouponRecords(recordParams);
    // 处理数据
    couponRecords.value = rows;
    recordParams.total = total;
    settingStore.loading = false;
  };

  // 优惠券统计
  const couponTotal: any = ref([]);
  const setCouponTotal = async () => {
    settingStore.loading = true;

    // const res = await reqTicketList(searchParams.value);
    // let data = parseReqList(res);

    // 处理数据
    // tableData.value = data;
    couponTotal.value = [
      {
        couponStatType: 1,
        numOfSend: 0,
        amountOfSend: 0,
        numOfUse: 0,
        amountOfUse: 0,
        numOfCancel: 0,
        amountOfCancel: 0,
      },
      {
        couponStatType: 2,
        numOfSend: 0,
        amountOfSend: 0,
        numOfUse: 0,
        amountOfUse: 0,
        numOfCancel: 0,
        amountOfCancel: 0,
      },
      {
        couponStatType: 3,
        numOfSend: 1,
        amountOfSend: 88,
        numOfUse: 1,
        amountOfUse: 88,
        numOfCancel: 0,
        amountOfCancel: 0,
      },
      {
        couponStatType: 4,
        numOfSend: 8,
        amountOfSend: 704,
        numOfUse: 4,
        amountOfUse: 352,
        numOfCancel: 0,
        amountOfCancel: 0,
      },
      {
        couponStatType: 7,
        numOfSend: 0,
        amountOfSend: 0,
        numOfUse: 0,
        amountOfUse: 0,
        numOfCancel: 0,
        amountOfCancel: 0,
      },
      {
        couponStatType: 0,
        amountOfUse: 225,
      },
    ];

    settingStore.loading = false;
  };

  return {
    searchParams,
    page,
    tableData,
    getCouponList,
    setTableData,
    update,
    formData,
    resetFormData,

    recordParams,
    couponRecords,
    getCouponRecords,
    setCouponRecords,
    couponTotal,
    setCouponTotal,
    updateStatus,
  };
});

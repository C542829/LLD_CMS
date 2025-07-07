import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import $Message from '@/components/Message';
import { reqTicketList, reqAddTicket, reqUpdateTicket } from '@/api/member/coupon/index';
import { parseReqInform, parseReqList } from '@/utils/feedback';
import { formatDate } from '@/utils/time';

export const useCouponStore = defineStore('CouponStore', () => {
  const loading = ref(false);
  // 搜索参数
  const searchParams = ref({
    storeId: 0,
    ticketName: '',
    ticketStatus: 0,
    dateRange: [new Date(), new Date()],
  });

  const page = reactive({
    total: 0,
    currentPage: 1,
    pageSize: 50,
  });

  // 优惠券列表
  const tableData: any = ref([]);
  const setTableData = async () => {
    loading.value = true;
    // @ts-ignore 获取数据列表
    // delete searchParams.value.dateRange;
    // const res = await reqTicketList(searchParams.value);
    // let data = parseReqList(res);

    // 处理数据
    // tableData.value = data;
    let data = [
      {
        content: 'A 78代金券',
        couponName: 'A 78代金券',
        couponType: 151,
        couponTypeName: '代金券',
        createTime: '2025-05-04 17:37:57',
        creator: 19149,
        id: 8467,
        isEntityTicket: 1,
        isValid: 1,
        orgID: 1459,
        orgName: '郑州棉纺路店',
        quantityLimit: 1,
        remark: '',
        shouldPay: 0,
        timeLimit: 999,
        updateTime: '2025-05-04 17:37:56',
        updateUser: 19149,
        useLimitRule: '{"value":78,"limitBuy":78}',
      },
      {
        content: '699水洗头疗10次',
        couponName: '699水洗头疗10次',
        couponType: 151,
        couponTypeName: '代金券',
        createTime: '2024-07-12 16:20:06',
        creator: 19149,
        id: 7219,
        isEntityTicket: 1,
        isValid: 1,
        orgID: 1459,
        orgName: '郑州棉纺路店',
        quantityLimit: 1,
        remark: '',
        shouldPay: 0,
        timeLimit: 999,
        updateTime: '2024-07-12 16:20:05',
        updateUser: 19149,
        useLimitRule: '{"value":128,"limitBuy":0}',
      },
      {
        content: '精油开背代金券',
        couponName: '138元代金券',
        couponType: 151,
        couponTypeName: '代金券',
        createTime: '2024-07-06 00:01:41',
        creator: 19149,
        id: 7187,
        isEntityTicket: 1,
        isValid: 1,
        orgID: 1459,
        orgName: '郑州棉纺路店',
        quantityLimit: 1,
        remark: '',
        shouldPay: 0,
        timeLimit: 999,
        updateTime: '2024-07-06 00:01:41',
        updateUser: 19149,
        useLimitRule: '{"value":138,"limitBuy":0}',
      },
      {
        content: '128元水洗头疗',
        couponName: '128元代金券',
        couponType: 151,
        couponTypeName: '代金券',
        createTime: '2024-07-06 00:00:09',
        creator: 19149,
        id: 7185,
        isEntityTicket: 1,
        isValid: 1,
        orgID: 1459,
        orgName: '郑州棉纺路店',
        quantityLimit: 1,
        remark: '',
        shouldPay: 0,
        timeLimit: 999,
        updateTime: '2024-07-06 00:00:09',
        updateUser: 19149,
        useLimitRule: '{"value":128,"limitBuy":0}',
      },
      {
        content: '138元精油开背',
        couponName: '138元代金券',
        couponType: 151,
        couponTypeName: '代金券',
        createTime: '2024-07-05 23:59:24',
        creator: 19149,
        id: 7183,
        isEntityTicket: 1,
        isValid: 0,
        orgID: 1459,
        orgName: '郑州棉纺路店',
        quantityLimit: 1,
        remark: '',
        shouldPay: 0,
        timeLimit: 7,
        updateTime: '2024-07-06 00:00:57',
        updateUser: 19149,
        useLimitRule: '{"value":138,"limitBuy":0}',
      },
      {
        content: '138元代金券',
        couponName: '138元精油开背',
        couponType: 151,
        couponTypeName: '代金券',
        createTime: '2024-07-05 23:57:53',
        creator: 19149,
        id: 7181,
        isEntityTicket: 1,
        isValid: 0,
        orgID: 1459,
        orgName: '郑州棉纺路店',
        quantityLimit: 1,
        remark: '',
        shouldPay: 0,
        timeLimit: 999,
        updateTime: '2025-07-06 14:08:02',
        updateUser: 46713,
        useLimitRule: '{"value":0,"limitBuy":0}',
      },
      {
        content: '88元代金券',
        couponName: '88元代金券',
        couponType: 151,
        couponTypeName: '代金券',
        createTime: '2024-07-05 23:55:58',
        creator: 19149,
        id: 7179,
        isEntityTicket: 1,
        isValid: 1,
        orgID: 1459,
        orgName: '郑州棉纺路店',
        quantityLimit: 1,
        remark: '',
        shouldPay: 0,
        timeLimit: 999,
        updateTime: '2024-07-05 23:55:58',
        updateUser: 19149,
        useLimitRule: '{"value":88,"limitBuy":0}',
      },
      {
        content: '68元代金券',
        couponName: '68元代金券',
        couponType: 151,
        couponTypeName: '代金券',
        createTime: '2021-12-08 14:36:54',
        creator: 19149,
        id: 2849,
        isEntityTicket: 1,
        isValid: 0,
        orgID: 1459,
        orgName: '郑州棉纺路店',
        quantityLimit: 1,
        remark: '',
        shouldPay: 0,
        timeLimit: 999,
        updateTime: '2024-07-05 23:56:17',
        updateUser: 19149,
        useLimitRule: '{"value":68,"limitBuy":0}',
      },
    ];

    tableData.value = data.map((item: any) => {
      item.useLimitRule = JSON.parse(item.useLimitRule);
      item.isDisabled = item.isValid === 0;
      return item;
    });

    console.log(tableData.value);

    loading.value = false;
  };

  // 优惠券发放记录
  const couponRecord: any = ref([]);
  const setCouponRecord = async () => {
    loading.value = true;
    // const res = await reqTicketList(searchParams.value);
    // let data = parseReqList(res);

    // 处理数据
    // tableData.value = data;
    couponRecord.value = [
      {
        id: 1414381,
        orgId: 1459,
        couponId: 2849,
        couponNo: '145900000084',
        getTime: '2023-02-10 19:13:29',
        limitTime: '2025-11-05',
        memberId: 767765,
        status: 0,
        promotionId: 0,
        expandStaffId: 19149,
        fromType: 3,
        fromBusId: 103837,
        transOutBusId: 0,
        updateUser: 19149,
        updateTime: '2023-02-10 19:13:28',
        shortDate: 230210,
        memName: '星星',
        memPhone: '13673381195',
        memCode: '145900433',
        levelCode: 'N',
        expandStaffName: '管理员',
        couponName: '68元代金券',
        isEntityTicket: 1,
        couponType: 151,
      },
      {
        id: 1414383,
        orgId: 1459,
        couponId: 2849,
        couponNo: '145900000085',
        getTime: '2023-02-10 19:13:29',
        limitTime: '2025-11-05',
        memberId: 767765,
        status: 0,
        promotionId: 0,
        expandStaffId: 19149,
        fromType: 3,
        fromBusId: 103837,
        transOutBusId: 0,
        updateUser: 19149,
        updateTime: '2023-02-10 19:13:28',
        shortDate: 230210,
        memName: '星星',
        memPhone: '13673381195',
        memCode: '145900433',
        levelCode: 'N',
        expandStaffName: '管理员',
        couponName: '68元代金券',
        isEntityTicket: 1,
        couponType: 151,
      },
    ];

    loading.value = false;
  };

  // 优惠券统计
  const couponTotal: any = ref([]);
  const setCouponTotal = async () => {
    loading.value = true;

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

    loading.value = false;
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
    const result = parseReqInform(res);
    // 刷新数据
    result && setTableData();
    return result;
  };

  // 表单数据
  const formData: any = ref({});

  // 重置表单数据模型
  const resetFormData = () => {
    formData.value = {
      content: 'A 78代金券',
      couponName: 'A 78代金券',
      couponType: 151,
      couponTypeName: '代金券',
      createTime: '2025-05-04 17:37:57',
      creator: 19149,
      id: 8467,
      isEntityTicket: 1,
      isValid: 1,
      orgID: 1459,
      orgName: '郑州棉纺路店',
      quantityLimit: 1,
      remark: '',
      shouldPay: 0,
      timeLimit: 999,
      updateTime: '2025-05-04 17:37:56',
      updateUser: 19149,
      useLimitRule: {
        value: 0,
        limitBuy: 0,
      },
    };
  };

  const formRules: any = {};

  return {
    loading,
    searchParams,
    page,
    tableData,
    setTableData,
    update,
    formData,
    formRules,
    resetFormData,
    couponRecord,
    setCouponRecord,
    couponTotal,
    setCouponTotal,
  };
});

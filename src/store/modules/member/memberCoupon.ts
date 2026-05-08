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
import { CommissionType } from '@/enums';

export const useCouponStore = defineStore('CouponStore', () => {
  const settingStore = useSettingStore();

  // #region 优惠券管理

  // 搜索参数
  const searchParams = ref<any>({
    ticketName: '',
    ticketStatus: 0,
  });

  /**
   * 获取优惠券列表
   * @param params 查询参数
   * @returns
   */
  const getCoupons = async (params = { ticketName: '', ticketStatus: 0 }) => {
    const res = await reqTicketList(params);
    let data = parseResList(res);
    for (const coupon of data) {
      if (coupon.serverItems && coupon.serverItems.length > 0) {
        coupon.serverItemIds = coupon.serverItems.map((item: any) => item.id);
      }
    }
    return data;
  };

  /**
   * 获取优惠券列表
   * @param params 查询参数
   * @returns
   */
  const getCouponList = async (params = { ticketName: '', ticketStatus: 0 }) => {
    const res = await reqTicketList(params);
    let data = parseResList(res);
    for (const coupon of data) {
      coupon.orgIds = coupon.orgs?.map((e: any) => e.id) || [];
      if (coupon.serverItems && coupon.serverItems.length > 0) {
        coupon.serverItemIds = coupon.serverItems.map((item: any) => item.id);
      }
      if (coupon.productList && coupon.productList.length > 0) {
        coupon.productIds = coupon.productList.map((item: any) => item.productId);
      }
    }
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
      ticketEffectiveTime: -1,
      ticketFullPayment: null,
      ticketValue: null,
      ticketDescription: '',
      serverItemIds: [],
      productIds: [],
      orgIds: [],
    };
  };
  //#endregion

  return {
    searchParams,
    tableData,
    formData,
    getCoupons,
    getCouponList,
    setTableData,
    update,
    updateStatus,
    resetFormData,
  };
});

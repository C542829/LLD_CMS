import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import {
  reqActiveList,
  reqActiveInfo,
  reqAddActive,
  reqUpdateActive,
  reqUpdateActiveStatus,
} from '@/api/member/rechargeActivity';

import { parseResMsg, parseResList, parseResObj } from '@/utils/parseResponse';
import { formatDate } from '@/utils/time';

import { useSettingStore } from '@/store/modules/acl/setting';

export const useRechargeActivityStore = defineStore('RechargeActivity', () => {
  const settingStore = useSettingStore();

  /**
   * 获取充值活动详情
   * @param id 充值活动ID
   * @returns 充值活动详情
   */
  const getActiveInfo = async (id: number) => {
    const res = await reqActiveInfo({ id });
    const result = parseResObj(res);
    return result;
  };

  /**
   * 获取充值活动列表
   * @param params - 搜索参数
   * @returns 产品列表
   */
  const getActiveList = async (params: { keyWord?: string; activeStatus?: number }) => {
    const res = await reqActiveList(params);
    const data = parseResList(res);
    return data;
  };

  // 搜索参数
  const search = reactive({
    keyWord: '',
    activeStatus: 0,
  });

  /**
   * 数据列表
   */
  const tableData = ref<any>([]);

  /**
   * 刷新数据列表
   */
  const setTableData = async () => {
    settingStore.loading = true;
    tableData.value = await getActiveList(search);
    settingStore.loading = false;
  };

  /**
   * 更新数据
   * @param data - 数据对象
   * @returns 更新结果
   */
  const update = async (data: any) => {
    data.activeBeginTime = formatDate(data.activeTime[0]);
    data.activeFinalTime = formatDate(data.activeTime[1]);
    // 发送请求
    const res = await (data?.id ? reqUpdateActive(data) : reqAddActive(data));
    const result = parseResMsg(res);
    // 刷新数据
    result && setTableData();
    return result;
  };

  /**
   * 更新数据状态
   * @param data - 数据对象
   * @returns 更新结果
   */
  const updateStatus = async (data: any) => {
    const status = data.activeStatus === 0 ? 1 : 0;
    const params = { id: data.id, status };
    const res = await reqUpdateActiveStatus(params);
    let msg = status === 0 ? '启用' : '禁用';
    msg = `充值活动${msg}成功`;
    const result = parseResMsg(res, msg);
    // 刷新数据
    result && setTableData();
    return result;
  };

  // 表单数据
  const formData = ref<any>({});

  // 重置表单数据模型
  const resetFormData = () => {
    formData.value = {
      id: null,
      activeName: '',
      activeType: '赠送储值金',
      activeCapital: null,
      activeDiscount: 100,
      activeBaseOn: '会员价',
      isCrossStore: 1,
      activePresent: null,
      activePresentTicket: null,
      isDiscountSameAs: 1,
      isAccum: 0,
      remark: '',

      activeTime: [],
    };
  };

  return {
    search,
    tableData,
    setTableData,
    update,
    updateStatus,
    formData,
    resetFormData,
    getActiveInfo,
    getActiveList,
  };
});

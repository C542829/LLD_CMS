import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  reqTreatmentCouponList,
  reqTreatmentCouponInfo,
  reqAddTreatmentCoupon,
  reqUpdateTreatmentCoupon,
} from '@/api/setGroup/treatmentCoupon';
import { parseResMsg, parseResList } from '@/utils/parseResponse';

import { useSettingStore } from '@/store/modules/acl/setting';

export const useTreatmentCouponStore = defineStore('TreatmentCoupon', () => {
  const settingStore = useSettingStore();
  // 搜索参数
  const searchParams = ref({
    storeId: 0,
    cureTicketName: '',
    cureTicketStatus: 0,
  });

  // 数据列表
  const dataList: any = ref([]);
  const setDataList = async () => {
    settingStore.loading = true;
    // 获取数据列表
    const res = await reqTreatmentCouponList(searchParams.value);
    const data = parseResList(res, '获取疗程券列表失败');

    // 处理数据
    // dataList.value = data.map((item, i) => {
    //   item.id = i + 1;
    //   item.cureTicketDetailInfoDTOList = item.cureTicketDetailInfoDTOList.map((item: any) => ({
    //     ...item,
    //     value: item.vipTicketName,
    //     number: item.vipTicketNum,
    //   }));
    //   return item;
    // });

    dataList.value = [
      {
        id: 1,
        cureTicketId: 1,
        isDelete: 0,
        remark: '',
        cureTicketName: '1380精油开背20次',
        cureTicketEncode: '1380精油开背20次',
        cureTicketPrice: 1380,
        cureTicketType: 1,
        cureTicketCommissionPrice: 300,
        cureTicketCommissionValue: null,
        cureTicketDetailInfoDTOList: [
          {
            id: 1,
            isDelete: 0,
            cureTicketId: 1,
            vipTicketId: 1,
            vipTicketNum: 100,
            vipTicketName: '88 代金券',
          },
          {
            id: 1,
            isDelete: 0,
            cureTicketId: 1,
            vipTicketId: 1,
            vipTicketNum: 200,
            vipTicketName: '99 代金券',
          },
          {
            id: 1,
            isDelete: 0,
            cureTicketId: 1,
            vipTicketId: 1,
            vipTicketNum: 1000,
            vipTicketName: '888 代金券',
          },
        ],
      },
    ];
    settingStore.loading = false;
  };

  // 更新数据
  const updateData = async (data: any) => {
    // 如果没有状态属性赋默认值
    data.packageStatus = data?.packageStatus || 0;

    // 发送请求
    const res = await (data?.id ? reqUpdateTreatmentCoupon(data) : reqAddTreatmentCoupon(data));
    const result = parseResMsg(res);
    // 刷新数据
    result && setDataList();
    return result;
  };

  // 更新数据状态
  const updateDataStatus = async (data: any) => {
    data = { ...data };
    data.cureTicketStatus = data.cureTicketStatus === 0 ? 1 : 0;
    updateData(data);
  };

  // 表单数据
  const formData: any = ref({});

  // 重置表单数据模型
  const resetFormData = () => {
    formData.value = {
      cureTicketId: 0,
      remark: '',
      cureTicketName: '',
      cureTicketEncode: '',
      cureTicketPrice: null,
      cureTicketType: 1,
      cureTicketCommissionValue: null,
      cureTicketCommissionBy: 0,
      cureTicketCommissionPrice: null,
      cureTicketDetailInfoDTOList: [],
    };
  };

  return {
    searchParams,
    dataList,
    setDataList,
    updateData,
    updateDataStatus,
    formData,
    resetFormData,
  };
});

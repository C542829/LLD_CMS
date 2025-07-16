import { defineStore } from 'pinia';
import { ref } from 'vue';
import { parseResMsg, parseResList } from '@/utils/feedback';
import { reqItemList, reqItemInfo, reqAddItem, reqUpdateItem } from '@/api/setGroup/serviceItem';

import { useEnumsStore } from '@/store/modules/enums/index';
const enumsStore = useEnumsStore();
import { useSettingStore } from '@/store/modules/acl/setting';
const settingStore = useSettingStore();

export const useServiceItemStore = defineStore('ServiceItem', () => {
  // 搜索参数
  const searchParams = ref({
    storeId: 0,
    itemName: '',
    itemStatus: 0,
  });

  // 数据列表
  const dataList: any = ref([]);
  const setDataList = async () => {
    settingStore.loading = true;
    // 获取数据列表
    const res = await reqItemList(searchParams.value);
    const data = parseResList(res, '获取服务项目列表失败');

    // 处理数据
    dataList.value = data.map((item, i) => {
      item.id = i + 1;
      return item;
    });
    settingStore.loading = false;
  };

  // 更新数据
  const updateData = async (data: any) => {
    // 如果没有状态属性赋默认值
    data.itemStatus = data?.itemStatus || 0;

    // 发送请求
    const res = await (data?.id ? reqUpdateItem(data) : reqAddItem(data));
    const result = parseResMsg(res);
    // 刷新数据
    result && setDataList();
    return result;
  };

  // 更新数据状态
  const updateDataStatus = async (data: any) => {
    data = { ...data };
    data.itemStatus = data.itemStatus === 0 ? 1 : 0;
    updateData(data);
  };

  // 表单数据
  const formData: any = ref({});

  // 重置表单数据模型
  const resetFormData = () => {
    formData.value = {
      id: null,
      itemName: '',
      itemEncode: '',
      employeeType: '',
      serverTime: 0,
      itemPrice: null,
      vipItemPrice: null,
      isDiscounts: 0, // 允许打折
      commissionType: 1, // 提成类型
      commissionValueRotation: 0, // 提成值(轮牌)
      commissionValueAppointment: 0, // 提成值(点钟)
      commissionValueExtend: 0, // 提成值(加钟)
      commissionBase: 0, // 提成价格
      remark: '',
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

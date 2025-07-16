import { defineStore } from 'pinia';
import { ref } from 'vue';
import { parseResMsg, parseResList } from '@/utils/feedback';
import { reqProductList, reqAddProduct, reqUpdateProduct } from '@/api/setGroup/product';

import { useEnumsStore } from '@/store/modules/enums/index';
const enumsStore = useEnumsStore();
import { useSettingStore } from '@/store/modules/acl/setting';
const settingStore = useSettingStore();

export const useProductStore = defineStore('Product', () => {
  // 搜索参数
  const searchParams = ref({
    storeId: 0,
    productName: '',
    productStatus: 0,
  });

  // 数据列表
  const dataList: any = ref([]);
  const setDataList = async () => {
    settingStore.loading = true;
    // 初始化单位列表
    await enumsStore.setUnitList();
    // 获取数据列表
    const res = await reqProductList(searchParams.value);
    const data = parseResList(res, '获取产品列表失败');

    // 处理数据
    dataList.value = data.map((item: any) => {
      item.unit = enumsStore.unitOptions.find((unit: any) => unit.value === item.unit)?.label || '未知';
      return item;
    });
    settingStore.loading = false;
  };

  // 更新数据
  const updateData = async (data: any) => {
    // 将数据中的提成比例转为小数
    if (data.productCommissionValue > 1) {
      data.productCommissionValue = data.productCommissionValue / 100;
    }

    // 如果没有产品状态属性赋默认值
    data.productStatus = data?.productStatus || 0;

    // 发送请求
    const res = await (data?.id ? reqUpdateProduct(data) : reqAddProduct(data));
    const result = parseResMsg(res);
    // 刷新数据
    result && setDataList();
    return result;
  };

  // 更新数据状态
  const updateDataStatus = async (data: any) => {
    data = { ...data };
    data.productStatus = data.productStatus === 0 ? 1 : 0;
    updateData(data);
  };

  // 表单数据
  const formData: any = ref({});

  // 重置表单数据模型
  const resetFormData = () => {
    formData.value = {
      id: null,
      remark: '',
      productName: '',
      productEncode: '',
      productPrice: null,
      vipProductPrice: null,
      isDiscount: 0,
      commissioinType: 1,
      productCommissionValue: null,
      productCommissionPrice: null,
      productCommissionValueType: 0,
      productStatus: 0,
      unit: null,
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

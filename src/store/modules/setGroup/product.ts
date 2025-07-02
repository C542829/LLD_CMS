import { defineStore } from 'pinia';
import { ref } from 'vue';
import $Message from '@/components/Message';
import { reqProductList, reqAddProduct, reqUpdateProduct, reqUnitList } from '@/api/setGroup/product';
import { parseReqInform, parseReqList } from '@/utils/feedback';

import { useEnumsStore } from '@/store/modules/enums/index';
const enumsStore = useEnumsStore();

export const useProductStore = defineStore('Product', () => {
  // 是否允许折扣
  const isDiscount: any = { 0: '允许', 1: '不允许' };

  // 搜索参数
  const searchParams = ref({
    storeId: 0,
    productName: '',
    productStatus: 0,
  });

  // 产品
  const productList: any = ref([]);
  const setProductList = async () => {
    // 获取数据列表
    const res = await reqProductList(searchParams.value);
    const data = parseReqList(res);

    await enumsStore.setUnitList();

    // 处理数据
    productList.value = data.map((item: any) => {
      item.isDiscountStr = isDiscount[item.isDiscount] || '未知';
      item.unit = enumsStore.unitOptions.find((unit: any) => unit.value === item.unit)?.label || '未知';
      return item;
    });
  };

  const updateProduct = async (data: any) => {
    // 浅拷贝避免修改原数据
    data = { ...data };
    // 将数据中的提成比例转为小数
    if (data.productCommissionValue > 1) {
      data.productCommissionValue = data.productCommissionValue / 100;
    }

    // 如果没有产品状态属性赋默认值
    data.productStatus = data?.productStatus || 0;

    // 发送请求
    const res = await (data?.id ? reqUpdateProduct(data) : reqAddProduct(data));
    const result = parseReqInform(res);

    // 刷新数据
    result && setProductList();
    return result;
  };

  const updateProductStatus = async (data: any) => {
    data = { ...data };
    data.productStatus = data.productStatus === 0 ? 1 : 0;
    updateProduct(data);
  };

  // 表单数据
  const formData: any = ref({});

  // 重置表单数据模型
  const resetFormData = () => {
    formData.value = {
      id: 0,
      remark: '',
      productName: '',
      productEncode: '',
      productPrice: 0,
      vipProductPrice: 0,
      isDiscount: 0,
      commissioinType: 1,
      productCommissionValue: 0,
      productCommissionPrice: 0,
      productCommissionValueType: 0,
      productStatus: 0,
      unit: 0,
    };
  };

  // 表单验证规则
  const formRules = {
    productEncode: [{ required: false, message: '请输入产品编码', trigger: 'blur' }],
    productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
    productPrice: [{ required: true, message: '请输入产品价格', trigger: 'blur' }],
    vipProductPrice: [{ required: true, message: '请输入会员价格', trigger: 'blur' }],
    productCommissionValue: [{ required: false, message: '请输入提成价格', trigger: 'blur' }],
    productCommissionPrice: [{ required: false, message: '请输入提成比例', trigger: 'blur' }],
    productCommissionValueType: [{ required: false, message: '请选择提成价格类型', trigger: 'blur' }],
  };

  return {
    searchParams,
    productList,
    setProductList,
    updateProduct,
    updateProductStatus,
    formData,
    resetFormData,
    formRules,
  };
});

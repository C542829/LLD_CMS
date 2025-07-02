import { defineStore } from 'pinia';
import { ref } from 'vue';
import $Message from '@/components/Message';
import { validChinese, validPhone } from '@/utils/strHandle';
import { reqVipList, reqVipInfo, reqAddVip, reqUpdateVip } from '@/api/member/memberList';
import { parseReqInform, parseReqList } from '@/utils/feedback';

export const useMemberListStore = defineStore('MemberList', () => {
  // 搜索参数
  const searchParams = ref({
    storeId: 0,
    inputValue: '',
  });

  // 处理搜索参数
  const handleSearchParams = () => {
    const inputValue = searchParams.value.inputValue.trim();
    if (!inputValue && inputValue === '') {
      return;
    }

    const params: SearchParams = {};
    // 判断参数类型
    if (validPhone(inputValue)) {
      params.vipPhone = inputValue;
    } else if (validChinese(inputValue)) {
      params.vipName = inputValue;
    } else {
      params.vipCardNumber = inputValue;
    }

    return params;
  };

  // 会员列表
  const tableData: any = ref([]);
  const setTableData = async () => {
    try {
      // 获取数据列表
      const params = handleSearchParams() || {};
      const res = await reqVipList(params);
      const data = parseReqList(res);

      // 处理数据
      tableData.value = data;
    } catch (error) {
      $Message.error('获取会员列表失败');
    }
  };

  const update = async (data: any) => {
    // 发送请求
    data.infoCardNumber = 'VIP000001';
    data.infoBirthday = data.infoBirthday + ' 00:00:00';
    console.log('更新会员数据 = ', data);
    const res = await (data?.id ? reqUpdateVip(data) : reqAddVip(data));
    const result = parseReqInform(res);
    // 刷新数据
    result && setTableData();
    return result;
  };

  const updatePwd = async (infoPwd = '123456') => {
    const data = { ...formData.value, infoPwd };
    const res = await reqUpdateVip(data);
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

  return {
    searchParams,
    tableData,
    setTableData,
    update,
    formData,
    resetFormData,
    updatePwd,
  };
});

// 搜索参数类型
interface SearchParams {
  storeId?: number;
  vipName?: string;
  vipPhone?: string;
  vipCardNumber?: string;
}

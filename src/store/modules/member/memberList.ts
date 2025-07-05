import { defineStore } from 'pinia';
import { ref } from 'vue';
import $Message from '@/components/Message';
import { validChinese, validPhone } from '@/utils/strHandle';
import { reqVipList, reqVipInfo, reqAddVip, reqUpdateVip } from '@/api/member/memberList';
import { parseReqInform, parseReqList } from '@/utils/feedback';

export const useMemberListStore = defineStore('MemberList', () => {
  // 加载状态
  const isLoading = ref(true);

  // 搜索参数
  const searchParams = ref({
    storeId: 0,
    inputValue: '',
    pageSize: 20,
    currentPage: 1,
    total: 0,
  });

  // 处理搜索参数
  const handleSearchParams = () => {
    const inputValue = searchParams.value.inputValue.trim();
    if (!inputValue && inputValue === '') {
      return;
    }

    const params: any = { ...searchParams.value };

    // 删除多余参数
    delete params.inputValue;
    delete params.total;

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
    isLoading.value = true;
    // 获取数据列表
    const params = handleSearchParams() || {};
    // const res = await reqVipList(params);
    // let data = parseReqList(res);

    // 处理数据
    // searchParams.value.total = data.length;
    searchParams.value.total = 10;
    const start = searchParams.value.pageSize * (searchParams.value.currentPage - 1);
    const end = searchParams.value.pageSize * searchParams.value.currentPage;
    // data = data.slice(start, end);
    // tableData.value = data;
    tableData.value = [
      {
        id: 1,
        infoName: '駱梓晴',
        infoGender: 0,
        infoCardNumber: 'CA-FD-4445-Q',
        infoPhoneNumber: '13545581994',
        infoLastConsumptionTime: '2009-06-19 21:12:24',
        infoLastRechargeTime: '2010-11-18 04:34:13',
        remark: null,
      },
      {
        id: 2,
        infoName: '徐慧琳',
        infoGender: 0,
        infoCardNumber: 'DC-DE-4834-V',
        infoPhoneNumber: '14684863000',
        infoLastConsumptionTime: '2014-06-02 16:05:15',
        infoLastRechargeTime: '2002-08-15 18:41:58',
        remark: null,
      },
      {
        id: 3,
        infoName: '元俊宇',
        infoGender: 0,
        infoCardNumber: 'FC-CD-3149-L',
        infoPhoneNumber: '18181381423',
        infoLastConsumptionTime: '2022-06-16 10:43:54',
        infoLastRechargeTime: '2007-12-06 14:43:15',
        remark: null,
      },
      {
        id: 4,
        infoName: '李秀英',
        infoGender: 0,
        infoCardNumber: 'CD-CE-9484-O',
        infoPhoneNumber: '13552515356',
        infoLastConsumptionTime: '2015-01-17 21:25:34',
        infoLastRechargeTime: '2023-12-25 22:55:02',
        remark: null,
      },
      {
        id: 5,
        infoName: '胡詠詩',
        infoGender: 0,
        infoCardNumber: 'CA-DC-6835-M',
        infoPhoneNumber: '16833238723',
        infoLastConsumptionTime: '2001-07-20 14:49:41',
        infoLastRechargeTime: '2000-12-28 02:02:15',
        remark: null,
      },
      {
        id: 6,
        infoName: '郝杰宏',
        infoGender: 1,
        infoCardNumber: 'BA-FB-8600-K',
        infoPhoneNumber: '17719861665',
        infoLastConsumptionTime: '2003-11-10 16:19:18',
        infoLastRechargeTime: '2024-04-15 07:32:19',
        remark: null,
      },
      {
        id: 7,
        infoName: '雷慧琳',
        infoGender: 0,
        infoCardNumber: 'CA-DC-7835-O',
        infoPhoneNumber: '16074902677',
        infoLastConsumptionTime: '2013-03-10 10:22:13',
        infoLastRechargeTime: '2024-02-04 23:47:05',
        remark: null,
      },
      {
        id: 8,
        infoName: '龙睿',
        infoGender: 0,
        infoCardNumber: 'CF-EC-3936-T',
        infoPhoneNumber: '18847483257',
        infoLastConsumptionTime: '2010-04-13 04:23:38',
        infoLastRechargeTime: '2004-04-10 22:32:01',
        remark: null,
      },
      {
        id: 9,
        infoName: '黄璐',
        infoGender: 0,
        infoCardNumber: 'AE-DE-1093-S',
        infoPhoneNumber: '19217491313',
        infoLastConsumptionTime: '2015-08-30 04:09:08',
        infoLastRechargeTime: '2019-12-29 02:58:59',
        remark: null,
      },
      {
        id: 10,
        infoName: '段云熙',
        infoGender: 0,
        infoCardNumber: 'AF-EC-6456-Y',
        infoPhoneNumber: '16722761432',
        infoLastConsumptionTime: '2004-06-03 13:52:07',
        infoLastRechargeTime: '2003-12-13 09:02:07',
        remark: null,
      },
    ];
    isLoading.value = false;
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
    isLoading,
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

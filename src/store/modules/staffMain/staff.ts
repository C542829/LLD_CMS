import { defineStore } from 'pinia';
import { ref } from 'vue';
import $Message from '@/components/Message';
import $Notification from '@/components/Notification';
import { reqStaffList, reqAddStaff, reqUpdateStaff } from '@/api/staffMain/staff/index';
import { reqNotification, reqList } from '@/utils/feedback';

export const useStaffStore = defineStore('Staff', () => {
  // 搜索参数
  const searchParams = ref({
    storeId: 0,
    userName: '',
    userStatus: '在职',
  });

  // 人员
  const tableData: any = ref([]);
  const setStaffList = async () => {
    // 获取人员列表
    const data: any = await reqList(async () => {
      return (await reqStaffList(searchParams.value)).data;
    }, '获取人员列表失败');

    // 处理数据
    tableData.value = data;
  };

  const updateStaff = async (data: any) => {
    // 浅拷贝避免修改原数据
    data = { ...data };

    // 发送请求
    const result = await reqNotification(async () => {
      console.log('员工数据 = ', data);
      return await (data?.id ? reqUpdateStaff(data) : reqAddStaff(data));
    });
    // 刷新数据
    result && setStaffList();
    return result;
  };

  // 表单数据
  const formData: any = ref({});

  // 重置表单数据模型
  const resetFormData = () => {
    formData.value = {
      id: 0,
      userCode: '',
      userPassword: '',
      userName: '',
      userNumber: '',
      userPosition: '',
      userSex: 1,
      userBirthday: '',
      userDept: '',
      userEntryDate: null,
      userStatus: '',
      userIdCard: '',
      userAddress: '',
      userMarry: '',
      userEdu: '',
      userHealth: null,
    };
  };

  // 表单验证规则
  const formRules = {
    userCode: [{ required: true, message: '人员编号为必填项', trigger: 'blur' }],
    userName: [
      { required: true, message: '姓名为必填项', trigger: 'blur' },
      { min: 2, max: 20, message: '姓名长度在2到20个字符之间', trigger: 'blur' },
    ],
    userNumber: [
      { required: true, message: '手机号为必填项', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
    ],
    userPosition: [{ required: true, message: '请选择人员职位', trigger: 'change' }],
    userIdCard: [
      { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号码', trigger: 'blur' },
    ],
    userAddress: [{ max: 200, message: '人员地址长度不能超过200个字符', trigger: 'blur' }],
  };

  return {
    searchParams,
    tableData,
    setStaffList,
    updateStaff,
    formData,
    resetFormData,
    formRules,
  };
});

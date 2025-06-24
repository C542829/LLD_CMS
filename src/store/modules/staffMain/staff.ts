import { defineStore } from 'pinia';
import { ref } from 'vue';
import $Message from '@/components/Message';
import $Notification from '@/components/Notification';
import { reqStaffList, reqAddStaff, reqUpdateStaff } from '@/api/staffMain/staff/index';
import { ReponseCode, ReponseCodeMeaning } from '@/enums/response';

export const useStaffStore = defineStore('Staff', () => {
  // #region

  // 性别
  const sex = [
    {
      value: 0,
      label: '男',
    },
    {
      value: 1,
      label: '女',
    },
  ];

  // 婚姻状态
  const maritalStatusOptions = [
    { label: '未知', value: '未知' },
    { label: '未婚', value: '未婚' },
    { label: '已婚', value: '已婚' },
    { label: '离异', value: '离异' },
    { label: '丧偶', value: '丧偶' },
  ];

  // 学历
  const educationOptions = [
    { label: '未知', value: '未知' },
    { label: '小学', value: '小学' },
    { label: '初中', value: '初中' },
    { label: '高中', value: '高中' },
    { label: '中专', value: '中专' },
    { label: '大专', value: '大专' },
    { label: '本科', value: '本科' },
    { label: '硕士', value: '硕士' },
    { label: '博士', value: '博士' },
    { label: '技校', value: '技校' },
  ];

  // 在职状态
  const formEmployedOptions = [
    {
      value: '未知',
      label: '未知',
    },
    {
      value: '在职',
      label: '在职',
    },
    {
      value: '已离职',
      label: '已离职',
    },
    {
      value: '试用期',
      label: '试用期',
    },
    {
      value: '停薪留职',
      label: '停薪留职',
    },
  ];

  // 在职状态
  const employedOptions: any = ref([]);
  const setStatusList = async () => {
    try {
      // const data = await reqUnitList();
      // unitOptions.value = data;
      employedOptions.value = [
        {
          value: '全部状态',
          label: '全部状态',
        },
        {
          value: '在职',
          label: '在职',
        },
        {
          value: '已离职',
          label: '已离职',
        },
        {
          value: '试用期',
          label: '试用期',
        },
        {
          value: '停薪留职',
          label: '停薪留职',
        },
      ];
    } catch (error) {
      $Message.error('获取在职状态列表失败');
    }
  };

  // 职位
  const positionOptions: any = ref([]);
  const setPositionList = async () => {
    try {
      // const data = await reqUnitList();
      // unitOptions.value = data;
      positionOptions.value = [
        {
          value: '店长',
          label: '店长',
        },
        {
          value: '收银员',
          label: '收银员',
        },
        {
          value: '采耳师',
          label: '采耳师',
        },
        {
          value: '修脚师',
          label: '修脚师',
        },
      ];
    } catch (error) {
      $Message.error('获取职位列表失败');
    }
  };

  // 部门
  const deptOptions: any = ref([]);
  const setDeptList = async () => {
    try {
      // const data = await reqUnitList();
      // unitOptions.value = data;
      deptOptions.value = [
        {
          value: '管理部',
          label: '管理部',
        },
        {
          value: '技师部',
          label: '技师部',
        },
      ];
    } catch (error) {
      $Message.error('获取部门列表失败');
    }
  };

  // 职称
  const titleOptions: any = ref([]);
  const setTitleList = async () => {
    try {
      // const data = await reqUnitList();
      // unitOptions.value = data;
      titleOptions.value = [
        {
          value: '无',
          label: '无',
        },
        {
          value: '店长',
          label: '店长',
        },
        {
          value: '技师',
          label: '技师',
        },
      ];
    } catch (error) {
      $Message.error('获取部门列表失败');
    }
  };

  // #endregion

  // 搜索参数
  const searchParams = ref({
    storeId: 0,
    userName: '',
    userStatus: '在职',
  });

  // 人员
  const tableData: any = ref([]);
  const setStaffList = async () => {
    try {
      // 获取人员列表
      const data: any = (await reqStaffList(searchParams.value)).data;
      // 处理数据
      tableData.value = data.map((item: any) => {
        item.sexStr = item.userSex ? '女' : '男';
        return item;
      });
    } catch (error) {
      $Message.error('获取人员列表失败');
    }
  };

  const updateStaff = async (data: any) => {
    // 浅拷贝避免修改原数据
    data = { ...data };

    try {
      // 发送请求
      let res: any = {};
      if (data?.id) {
        res = await reqUpdateStaff(data);
      } else {
        res = await reqAddStaff(data);
      }
      if (res.code === ReponseCode.SUCCESS) {
        $Notification.success(res.data); // 显示成功消息
        setStaffList(); // 重新获取数据
        return true;
      } else {
        $Notification.error(res.data); // 显示错误消息
        return false;
      }
    } catch (error) {
      console.error(error);
      $Message.error(ReponseCodeMeaning.FAIL);
    }
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
    tableData,
    setStatusList,
    setStaffList,
    updateStaff,
    employedOptions,
    formData,
    resetFormData,
    formRules,
    positionOptions,
    setPositionList,
    deptOptions,
    setDeptList,
    titleOptions,
    setTitleList,
    sex,
    educationOptions,
    maritalStatusOptions,
    formEmployedOptions,
  };
});

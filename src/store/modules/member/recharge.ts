import Message from '@/components/Message';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Types, reqRecharge } from '@/api/member/recharge';
import { parseResMsg } from '@/utils/parseResponse';
import { paymentTypeMap } from '@/enums/index';
import { getOrgInfo } from '@/utils/localStorageTools';
import { useSettingStore } from '@/store/modules/acl/setting';
import { cloneDeep, isEmpty } from 'lodash';

const DEFAULT_RECHARGE_FORM_DATA: Types.RechargeDTO = {
  vipId: 0,
  vipName: '',
  vipPhoneNumber: '',
  vipCardNumber: '',
  activeId: undefined,
  activeName: '',
  rechargeValue: 0,
  assetDiscountRate: 100,
  assetDiscountBase: 0,
  assetIsCrossStore: 0,
  rechargeRoleId: 0,
  userKpiList: [
    {
      userId: 0,
      userName: '',
      kpi: 0,
    },
  ],
  paymentInfoList: [
    {
      paymentType: 0,
      paymentName: '',
      paymentAmount: 0,
    },
  ],
};

export const useRechargeStore = defineStore('Recharge', () => {
  const settingStore = useSettingStore();

  const member: any = ref({});
  const rechargeActivity: any = ref({});
  const rcRule: any = ref({});

  const rechargeFormData = ref<Types.RechargeDTO>(cloneDeep(DEFAULT_RECHARGE_FORM_DATA));

  // 计算支付金额总和
  const calcTotal = (params: Types.RechargeDTO) => {
    let total = 0;
    if (params.paymentInfoList && params.paymentInfoList.length !== 0) {
      params.paymentInfoList.forEach((item: any) => {
        total += item.paymentAmount;
      });
    }
    return total;
  };

  // 计算技师kpi总和
  const calcKpi = (params: Types.RechargeDTO) => {
    let total = 0;
    if (params.userKpiList && params.userKpiList.length !== 0) {
      params.userKpiList.forEach((item: any) => {
        total += item.kpi;
      });
    }
    return total;
  };

  // 处理充值参数
  const handleRechargeParams = () => {
    try {
      const params: any = cloneDeep(rechargeFormData.value);
      // 充值金额
      if (!params.rechargeValue) {
        Message.warning('请输入充值金额');
        return false;
      }

      // 会员信息
      if (member.value && member.value.id) {
        params.vipId = member.value.id;
        params.vipName = member.value.name;
        params.vipPhoneNumber = member.value.phoneNumber;
        params.vipCardNumber = member.value.cardNumber;
      } else {
        Message.warning('请先选择会员');
        return false;
      }

      // 充值活动
      if (rechargeActivity.value && rechargeActivity.value.id) {
        params.activeId = rechargeActivity.value.id;
        params.activeName = rechargeActivity.value.activeName;
      }

      // 销售员
      if (params.userKpiList && params.userKpiList[0].user) {
        if (params.userKpiList.length === 1) {
          params.userKpiList[0].kpi = params.rechargeValue || 0;
          rechargeFormData.value.userKpiList[0].kpi = params.rechargeValue || 0;
        }
        for (let item of params.userKpiList) {
          if (item.user) {
            item.userId = item.user.id;
            item.userName = item.user.userName;
          }
          // delete item.user;
        }
      } else {
        Message.warning('请选择销售员');
        console.log('充值参数：', params);
        return false;
      }

      if (calcKpi(params) !== params.rechargeValue) {
        Message.warning('技师业绩和充值金额不一致');
        console.log('充值参数：', params);
        return false;
      }

      // 支付信息
      if (params.paymentInfoList && params.paymentInfoList.length === 0) {
        Message.warning('请添加支付方式');
        console.log('充值参数：', params);
        return false;
      } else if (calcTotal(params) !== params.rechargeValue) {
        Message.warning('支付金额总和与充值金额不一致');
        console.log('充值参数：', params);
        return false;
      } else {
        for (const item of params.paymentInfoList) {
          item.paymentName = paymentTypeMap[item.paymentType];
        }
      }

      // if (rcRule.value && rcRule.value.id) {
      //   params.rechargeRoleId = rcRule.value.id;
      // } else {
      //   Message.warning('充值提成规则不能为空');
      //   return false;
      // }
      return params;
    } catch (error) {
      console.error(error);
    }
    return false;
  };

  // 充值
  const recharge = async () => {
    const params = handleRechargeParams();
    if (!params) {
      // Message.warning('充值信息填写不完整');
      return;
    }

    // if (!params.userKpiList[0].userId) {
    //   Message.warning('请选择销售员');
    //   return;
    // }

    // console.log('会员充值：', params);
    // return;
    settingStore.loading = true;
    const res: any = await reqRecharge(params);
    const data = parseResMsg(res);
    data && reset();
    settingStore.loading = false;
    return data;
  };

  /** 设置默认折扣率 */
  const setDefaultDiscount = () => {
    const org = getOrgInfo();
    rechargeFormData.value.assetDiscountRate = org.defaultDiscountRate || 100;
    rechargeFormData.value.assetDiscountBase = org.defaultDiscountBase || 0;
    rechargeFormData.value.assetIsCrossStore = org.defaultIsCrossStore || 0;
  };

  // 重置充值表单
  const reset = () => {
    member.value = {};
    rechargeActivity.value = {};
    rechargeFormData.value = cloneDeep(DEFAULT_RECHARGE_FORM_DATA);
    // setDefaultDiscount();
  };

  return {
    member,
    rechargeFormData,
    rcRule,
    rechargeActivity,
    recharge,
    reset,
    setDefaultDiscount,
  };
});

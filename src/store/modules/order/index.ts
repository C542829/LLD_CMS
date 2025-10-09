import { cloneDeep } from 'lodash';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  reqOrderInfo,
  reqAddOrder,
  reqAddOrderDetail,
  reqSettleOrder,
  reqDeleteOrderDetail,
  reqCancelOrder,
} from '@/api/order/index';
import { parseResObj } from '@/utils/parseResponse';
import Message from '@/components/Message';
import { useSettingStore } from '@/store/modules/acl/setting';

/**
 * 订单管理模块 - Pinia Store
 * 负责处理订单的创建、修改、重置等操作
 */
export const useOrderStore = defineStore('Order', () => {
  // #region 状态管理
  const settingStore = useSettingStore();

  /**
   * 订单表单数据
   */
  const orderForm = ref({
    vipId: '', // 会员ID
    vipName: '', // 会员姓名
    vipCardNumber: '', // 会员卡号
    vipPhoneNumber: '', // 会员手机号
    customerType: 0, // 客户类型
    customerName: '', // 客户姓名
    bedId: '', // 床位ID
    bedName: '', // 床位名称
    remark: '', // 备注
    orderDetails: [], // 订单明细列表
  });

  /**
   * 订单明细表单数据
   */
  const detailForm = ref({
    bid: '', // 订单业务ID（产品ID、服务ID或疗程券ID）
    userId: '', // 用户ID
    userName: '', // 用户姓名
    detailType: 1, // 明细类型
    businessName: '', // 业务名称
    stdPrice: 0, // 标准价格
    truePrice: 0, // 实际价格
    quantity: 1, // 数量
    serverType: 0, // 服务类型
  });
  // #endregion

  // #region 订单表单验证
  /**
   * 验证订单表单数据
   * @param params 订单表单参数
   * @returns 验证结果
   */
  const validateOrderForm = (params: any) => {
    // 校验会员信息
    if (!params.vipId || !params.vipName || !params.vipCardNumber || !params.vipPhoneNumber) {
      Message.error('请填写完整会员信息');
      return false;
    }
    // 校验订单明细
    if (params.orderDetails.length === 0) {
      Message.error('请添加订单明细');
      return false;
    }
    return true;
  };

  /**
   * 验证订单明细数据
   * @param params 订单明细参数
   * @returns 验证结果（true表示验证失败，false表示验证成功）
   */
  const validOrderDetail = (params: any) => {
    return (
      !params.bid ||
      !params.userId ||
      !params.userName ||
      !params.quantity ||
      !params.stdPrice ||
      !params.truePrice ||
      !params.businessName
    );
  };
  // #endregion

  // #region 订单操作
  /**
   * 创建订单
   * @param cb 回调函数
   */
  const createOrder = (cb: Function) => {
    if (!validateOrderForm(orderForm.value)) {
      return;
    }

    // 移除索引
    for (const item of orderForm.value.orderDetails as any) {
      delete item.index;
    }

    settingStore.loading = true;

    // 发送请求创建订单
    reqAddOrder(orderForm.value)
      .then((res) => {
        const result: any = parseResObj(res);
        if (Object.keys(result).length !== 0) {
          Message.success('订单创建成功');
          cb();
          resetOrderForm();
        } else {
          Message.error(result.message || '订单创建失败');
        }
      })
      .catch((err) => {
        Message.error(err.message || '订单创建失败');
      })
      .finally(() => {
        settingStore.loading = false;
      });
  };

  /**
   * 重置订单表单
   */
  const resetOrderForm = () => {
    orderForm.value = {
      vipId: '',
      vipName: '',
      vipCardNumber: '',
      vipPhoneNumber: '',
      customerType: 0,
      bedId: '',
      bedName: '',
      remark: '',
      orderDetails: [],
    };
  };
  // #endregion

  // #region 订单明细操作
  /**
   * 添加订单明细
   * @param detail 订单明细数据
   * @returns 操作结果
   */
  const addOrderDetail = (detail: any) => {
    // 校验明细是否完整
    if (validOrderDetail(detail)) {
      Message.error('请填写完整订单明细');
      return false;
    }

    detail = { index: orderForm.value.orderDetails.length, ...cloneDeep(detail) };
    orderForm.value.orderDetails.push(detail);
    return true;
  };

  /**
   * 更新订单明细
   * @param detail 订单明细数据
   * @returns 操作结果
   */
  const updateOrderDetail = (detail: any) => {
    // 校验明细是否完整
    if (validOrderDetail(detail)) {
      Message.error('请填写完整订单明细');
      return false;
    }

    orderForm.value.orderDetails[detail.index] = detail;
    return true;
  };

  /**
   * 重置订单明细表单
   */
  const resetDetailForm = () => {
    detailForm.value = {
      bid: '',
      userId: '',
      userName: '',
      detailType: 1,
      businessName: '',
      stdPrice: 0,
      truePrice: 0,
      quantity: 1,
      serverType: 0,
    };
  };
  // #endregion

  // #region 导出状态和方法
  return {
    // 订单表单状态
    orderForm,
    createOrder,
    resetOrderForm,

    // 订单明细状态
    detailForm,
    resetDetailForm,
    addOrderDetail,
    updateOrderDetail,
  };
  // #endregion
});

import { cloneDeep } from 'lodash';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
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
import { CustomerType, OrderDetailType } from '@/enums';
import { useDataEnumStore } from '@/store/modules/enums/index';
/**
 * 订单管理模块 - Pinia Store
 * 负责处理订单的创建、修改、重置等操作
 */
export const useOrderStore = defineStore('Order', () => {
  // #region 状态管理
  const settingStore = useSettingStore();
  const enumStore = useDataEnumStore();

  /**
   * 订单表单数据
   */
  const orderForm: any = ref({
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
  const detailForm: any = ref({
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

  // 会员信息
  const member: any = ref({});
  // 选中资产信息
  const checkedAssetInfo = ref<any>({
    assetIds: [], // 资产ID
    assetTitle: '', // 资产类型
    assetAmount: 0, // 资产金额
    assetDiscountRate: 0, // 资产折扣率
  });
  // 应付金额 16608179703
  const payAmount: any = computed(() => {
    let amount = order.value.discountAmount;
    order.value.details.forEach((item: any) => {
      amount += item.truePrice * item.quantity;
    });
    return amount;
  });
  const discountAmount: any = computed(() => {
    let amount = order.value.discountAmount;
    if (order.value.ticketUseList && order.value.ticketUseList.length > 0) {
      for (const item of order.value.ticketUseList) {
        const ticket = member.value.vipTicketVOList.find((ticket: any) => ticket.id === item.ticketId);
        if (ticket) {
          amount += ticket.ticketInfo.ticketValue;
        }
      }
    }
    return amount;
  });
  // 订单明细数量
  const orderCount: any = computed(() => {
    return order.value.details.length || 0;
  });
  const truePayAmount: any = computed(() => {
    let result = payAmount.value - discountAmount.value;
    return result < 0 ? 0 : result.toFixed(2);
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
    } else {
      // 校验订单明细
      for (const item of params.orderDetails) {
        if (validSubmitOrderDetail(item)) {
          Message.error('请填写完整订单明细信息');
          return false;
        }
      }
    }
    return true;
  };

  /**
   * 验证订单明细数据
   * @param params 订单明细参数
   * @returns 验证结果（true表示验证失败，false表示验证成功）
   */
  const validOrderDetail = (params: any) => {
    return !params.bid || !params.stdPrice || !params.truePrice || !params.businessName;
  };
  const validSubmitOrderDetail = (params: any) => {
    return (
      !params.bid ||
      !params.userId ||
      !params.userName ||
      !params.detailType ||
      !params.stdPrice ||
      !params.truePrice ||
      !params.businessName
    );
  };
  // #endregion

  // #region 开单操作
  /**
   * 创建订单
   * @param cb 回调函数
   */
  const createOrder = (cb: Function) => {
    if (!validateOrderForm(orderForm.value)) {
      return;
    }

    // 移除索引
    for (const item of orderForm.value.orderDetails) {
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
  const parseServiceData = (serviceItem: any) => {
    return {
      name: serviceItem?.name || serviceItem?.productName || serviceItem?.itemName || '',
      stdPrice: serviceItem?.productPrice || serviceItem?.itemPrice || serviceItem?.price || 0,
      vipPrice:
        serviceItem?.vipProductPrice || serviceItem?.vipItemPrice || serviceItem?.vipPrice || serviceItem.price || 0,
    };
  };

  /**
   * 处理订单明细参数
   * @param params 订单明细参数
   * @returns 处理后的订单明细参数
   */
  const handleDetailParam = (params: any) => {
    const result: any = {};
    // 查找用户和服务项
    const user = enumStore.staffList.find((item: any) => item.id === params.userId);
    if (user) {
      result.userId = user.id;
      result.userName = user.userName;
    }
    // 定义服务类型映射
    const serviceMap: any = {
      [OrderDetailType.Product]: enumStore.productList,
      [OrderDetailType.Service]: enumStore.serviceItemList,
      [OrderDetailType.TreatmentCoupon]: enumStore.treatmentCouponList,
    };
    // console.log();

    const serviceItem = serviceMap[params.detailType].find((item: any) => item.id === params.id);
    if (!serviceItem) {
      Message.warning('服务项不存在');
      return;
    }
    const serviceData = parseServiceData(serviceItem);

    result.bid = params.id || ''; // 订单业务ID（产品ID、服务ID或疗程券ID）
    result.detailType = params.detailType; // 明细类型
    result.businessName = serviceData.name; // 业务名称
    result.stdPrice = serviceData.stdPrice; // 标准价格
    result.truePrice = serviceData.stdPrice; // 实际价格
    result.quantity = params.quantity || 1; // 数量
    if (params.serverType !== undefined || params.serverType !== null) {
      result.serverType = params.serverType || 0; // 服务类型
    }
    // 设置价格
    if (orderForm.value.customerType === CustomerType.Member) {
      result.stdPrice = serviceData.stdPrice;
      result.truePrice = serviceData.vipPrice;
    }
    console.log('添加项:', params);
    console.log('添加订单:', result);

    return result;
  };

  /**
   * 添加订单明细
   * @param detail 订单明细数据
   * @returns 操作结果
   */
  const addOrderDetail = (detail: any) => {
    if (!orderForm.value.vipId) {
      Message.error('请先选择会员');
      return false;
    }

    // 处理订单明细参数
    const data = handleDetailParam(detail);

    // 校验明细是否完整
    if (validOrderDetail(data)) {
      Message.error('请填写完整订单明细');
      return false;
    }
    // 生成订单明细索引
    const index = orderForm.value.orderDetails.length;
    // 添加订单明细
    detail = { index, ...data };
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

  // #region 结算操作

  // 订单结算信息
  const order: any = ref({
    orderId: null,
    vipId: 0,
    bedId: 0,
    bedName: '',
    customerType: 0,
    customerName: '',
    remark: '',
    totalAmount: 0,
    actualAmount: 0,
    discountAmount: 0,
    orderTime: null,
    details: [],
    ticketUseList: [],
    assetIds: [],
    paymentInfoList: [],
  });
  /**
   * 添加订单明细
   * @param detail 订单明细数据
   * @returns 操作结果
   */
  const addOrderItem = (detail: any) => {
    if (!order.value.vipId) {
      Message.error('请先选择会员');
      return false;
    }

    // 处理订单明细参数
    const data = handleDetailParam(detail);

    // 校验明细是否完整
    if (validOrderDetail(data)) {
      Message.error('请填写完整订单明细');
      return false;
    }
    // 生成订单明细索引
    const index = order.value.details.length;
    // 添加订单明细
    detail = { index, ...data };
    order.value.details.push(detail);
    return true;
  };
  const resetOrder = () => {
    order.value = {
      orderId: null,
      vipId: 0,
      bedId: 0,
      bedName: '',
      customerType: 0,
      customerName: '',
      remark: '',
      totalAmount: 0,
      actualAmount: 0,
      discountAmount: 0,
      orderTime: null,
      details: [],
      ticketUseList: [],
      assetIds: [],
      paymentInfoList: [],
    };
  };
  // @endregion

  /**
   * 重置订单状态
   */
  const reset = () => {
    resetOrder();
    resetOrderForm();
    resetDetailForm();
    member.value = {};
  };

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

    // 会员状态
    member,
    // 应付金额
    payAmount,
    discountAmount,
    truePayAmount,
    // 订单总金额
    orderCount,
    reset,
    checkedAssetInfo,

    order,
    addOrderItem,
    resetOrder,
  };
  // #endregion
});

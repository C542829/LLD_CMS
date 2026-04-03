import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { cloneDeep, isEmpty } from 'lodash';
import { mul, div, add } from '@/utils/bigMethods';
import { useDataEnumStore } from '@/store/modules/enums/index';
import { CustomerType, DiscountType, IsDiscount, OrderDetailType } from '@/enums';
import { type Types } from '@/api/order/index';
import { DEFAULT_ORDER_FORM, DEFAULT_CHECKED_ASSET_INFO } from './utils';

/**
 * 订单管理模块 - Pinia Store
 * 负责处理订单的创建、修改、重置等操作
 */
export const useOrderStore = defineStore('Order', () => {
  // #region 状态管理

  const enumStore = useDataEnumStore();

  /**
   * 定义服务类型映射
   */
  const serviceMap: any = {
    [OrderDetailType.Product]: enumStore.productList,
    [OrderDetailType.Service]: enumStore.serviceItemList,
    [OrderDetailType.TreatmentCoupon]: enumStore.treatmentCouponList,
  };

  /**
   * 初始化服务类型映射
   */
  const initServiceMap = () => {
    serviceMap[OrderDetailType.Product] = enumStore.productList;
    serviceMap[OrderDetailType.Service] = enumStore.serviceItemList;
    serviceMap[OrderDetailType.TreatmentCoupon] = enumStore.treatmentCouponList;
  };

  // #endregion 状态管理

  /** 会员信息 */
  const member: any = ref({});

  /** 订单结算信息 */
  const order = ref<Types.OrderSettleDTO>(cloneDeep(DEFAULT_ORDER_FORM));
  /** 重置订单 */
  const resetOrder = () => {
    order.value = cloneDeep(DEFAULT_ORDER_FORM);
  };

  /** 选中资产信息 */
  const checkedAssetInfo = ref<any>(cloneDeep(DEFAULT_CHECKED_ASSET_INFO));
  /** 重置选中资产信息 */
  const resetCheckedAssetInfo = () => {
    checkedAssetInfo.value = cloneDeep(DEFAULT_CHECKED_ASSET_INFO);
  };

  //#region 概览状态数据

  /** 是否开单 */
  const isCreated = computed(() => {
    return !!order.value.orderId && order.value.orderId != 0;
  });

  /** 是否是会员 */
  const isMember = computed(() => {
    return order.value.customerType === CustomerType.Member;
  });

  /** 应付金额 */
  const payAmount = computed<number>(() => {
    let amount = 0;
    order.value.orderDetails.forEach((item: any) => {
      // 不为项目时计算数量
      if (item.detailType !== OrderDetailType.Service) {
        amount = add(amount, mul(item.truePrice, item.quantity));
      } else {
        amount = add(amount, item.truePrice);
      }
    });
    return amount;
  });

  /** 订单折扣金额 */
  const discountAmount = computed<number>(() => {
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

  /** 应付金额 = 订单金额 - 订单折扣金额 */
  const truePayAmount = computed<number>(() => {
    const result = payAmount.value - discountAmount.value;
    return result < 0 ? 0 : result;
  });

  /** 订单明细数量 */
  const orderCount = computed<number>(() => {
    return order.value.orderDetails.length || 0;
  });

  //#endregion 概览状态数据

  // #region 订单明细操作

  /** 解析明细数据 */
  const parseServiceData = (serviceItem: any) => {
    return {
      name: serviceItem?.name || serviceItem?.productName || serviceItem?.itemName || '',
      stdPrice: serviceItem?.productPrice || serviceItem?.itemPrice || serviceItem?.price || 0,
      vipPrice:
        serviceItem?.vipProductPrice || serviceItem?.vipItemPrice || serviceItem?.vipPrice || serviceItem.price || 0,
    };
  };

  /** 更新订单明细的折扣价格 */
  const updateOrderDetailPrice = () => {
    // 如果未选择会员卡或者订单详情为空则停止
    if (
      checkedAssetInfo.value.assetIds.length === 0 ||
      order.value.orderDetails.length === 0 ||
      (member.value && member.value.vipAssetVOList && member.value.vipAssetVOList.length === 0)
    ) {
      console.warn('更新订单明细价格前置条件不满足');
      return;
    }

    try {
      // 查找当前选择的会员卡
      const assets = member.value.vipAssetVOList;
      const asset = assets.find((item: { id: number }) => item.id === checkedAssetInfo.value.assetIds[0]);
      console.log('updateOrderItemPrice - 当前选择会员卡：', asset);

      // 折算基础
      const discountBase = asset.assetDiscountBase;
      // 折算率
      const discountRate = asset.assetDiscountRate / 100;

      // 订单明细
      const details = order.value.orderDetails;
      console.log('updateOrderItemPrice - 当前订单明细：', details);

      for (const detail of details) {
        // 如果绑定有优惠券，则跳过
        if (detail.coupon) {
          continue;
        }

        // 获取当前订单项目的原始参数
        const curServiceList = serviceMap[detail.detailType];
        const curService = curServiceList.find((item: { id: number }) => item.id === detail.bid);
        // 解析参数
        const parseCurService = parseServiceData(curService);

        // 如果折扣基础基于会员价，先将价格更新为会员价
        if (discountBase === DiscountType.Member) {
          detail.truePrice = parseCurService.vipPrice;
        }

        // 如果设置为不打折则不进行更新
        if (curService.isDiscounts === IsDiscount.No || curService.isDiscount === IsDiscount.No) {
          continue;
        }

        // 更新明细价格
        if (curService) {
          const discountPrice =
            discountBase === DiscountType.Member
              ? mul(parseCurService.vipPrice, discountRate)
              : mul(parseCurService.stdPrice, discountRate);
          detail.truePrice = discountPrice;
          console.log('更新订单明细价格：', detail);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  /** 重置订单明细价格 */
  const resetOrderDetailPrice = () => {
    // 订单明细
    const details = order.value.orderDetails;
    for (const detail of details) {
      // 如果绑定有优惠券，则跳过
      if (detail.coupon) {
        continue;
      }

      // 获取当前订单项目的原始参数
      detail.truePrice = detail.stdPrice;
    }
  };

  // #endregion 订单明细操作

  /**
   * 重置订单状态
   */
  const reset = () => {
    member.value = {};
    resetOrder();
    resetCheckedAssetInfo();
  };

  return {
    order,
    resetOrder,
    initServiceMap,
    updateOrderDetailPrice,
    resetOrderDetailPrice,

    // 会员状态
    member,
    // 应付金额
    payAmount,
    // 优惠金额
    discountAmount,
    // 实付金额
    truePayAmount,
    // 订单总金额
    orderCount,
    isCreated,
    isMember,

    checkedAssetInfo,
    resetCheckedAssetInfo,
    reset,
  };
});

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { cloneDeep, isEmpty } from 'lodash';
import { mul, div, add, sub } from '@/utils/bigMethods';
import { CustomerType, DiscountType, IsDiscount } from '@/enums';
import { type Types } from '@/api/order/index';
import { DEFAULT_ORDER_FORM, DEFAULT_CHECKED_ASSET_INFO } from './utils';

/**
 * 订单管理模块 - Pinia Store
 * 负责处理订单的创建、修改、重置等操作
 */
export const useOrderStore = defineStore('Order', () => {
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

  //#region 状态数据

  /** 是否开单 */
  const isCreated = computed(() => {
    return !!order.value.id && order.value.id != 0;
  });

  /** 是否是会员 */
  const isMember = computed(() => {
    return order.value.customerType === CustomerType.Member;
  });

  /** 是否选择了会员资产 */
  const isSelectedMemberAsset = computed(() => {
    return checkedAssetInfo.value.assetIds.length > 0;
  });

  /** 优惠总额 */
  const discountAmount = computed<number>(() => {
    let amount = order.value.discountAmount;
    amount = add(amount, discountTotal.value);
    return amount;
  });

  /** 通过订单明细的 stdPrice * quantity -  truePrice 计算出优惠总额 */
  const discountTotal = computed<number>(() => {
    let amount = 0;
    for (const item of order.value.orderDetails) {
      // 如果绑定有优惠券，则跳过
      if (item.coupon) {
        continue;
      }
      const discount = sub(mul(item.stdPrice!, item.quantity), item.truePrice!);
      amount = add(amount, discount);
    }
    return amount;
  });

  /** 优惠券折扣金额 */
  const couponDiscountAmount = computed<number>(() => {
    let amount = 0;
    if (Array.isArray(order.value.ticketUseList)) {
      for (const item of order.value.ticketUseList) {
        amount = add(amount, item.amount);
      }
    }
    return amount;
  });

  /** 订单总额（标准价） */
  const payAmount = computed<number>(() => {
    let amount = 0;
    for (const item of order.value.orderDetails) {
      // 如果绑定有优惠券，则使用 truePrice
      if (item.coupon) {
        amount = add(amount, item.truePrice!);
        continue;
      }
      amount = add(amount, mul(item.stdPrice!, item.quantity));
    }
    return amount;
  });

  /** 订单应付总额 = 订单总额 - 订单折扣金额 - 优惠券折扣金额 */
  const truePayAmount = computed<number>(() => {
    const discount = add(discountAmount.value, couponDiscountAmount.value);
    const result = sub(payAmount.value, discount);
    return result < 0 ? 0 : result;
  });

  /** 订单明细数量 */
  const orderCount = computed<number>(() => {
    return order.value.orderDetails.length || 0;
  });

  //#endregion 状态数据

  // #region 订单明细操作

  /** 更新订单明细的折扣价格 */
  const updateOrderDetailPrice = () => {
    // 如果未选择会员卡或者订单详情为空则停止
    if (orderCount.value === 0) {
      console.warn('updateOrderDetailPrice - 订单明细为空不进行更新');
      return;
    }

    try {
      // 订单明细
      const details = order.value.orderDetails;
      // console.log('updateOrderItemPrice - 当前订单明细：', details);

      // 遍历订单明细更新价格
      for (const detail of details) {
        // 如果绑定有优惠券，则跳过
        if (detail.coupon) {
          continue;
        }

        console.log('updateOrderItemPrice - 更新当前订单明细项：', detail);

        // 如果选择了折扣卡 - 则根据折扣卡更新价格
        if (isSelectedMemberAsset.value) {
          // 当前选择折扣卡的折扣率
          const assetDiscountRate = checkedAssetInfo.value.assetDiscountRate;
          // 判断当前选择折扣卡，折扣基础，是否基于会员价
          const isMemberPrice = checkedAssetInfo.value.assetDiscountBase === DiscountType.Member;
          // 当前选择折扣卡的折扣率
          const discountRate = div(assetDiscountRate, 100);

          // 如果是标准价，且折扣率为100%，则优先使用会员价
          if (!isMemberPrice && assetDiscountRate === 100) {
            detail.trueUnitPrice = detail.vipPrice;
            // detail.truePrice = mul(detail.trueUnitPrice, detail.quantity);
            continue;
          }

          // 数量更新时
          // if (isMemberPrice) {
          //   detail.trueUnitPrice = detail.vipPrice;
          //   detail.truePrice = mul(detail.trueUnitPrice, detail.quantity);
          // } else {
          //   detail.trueUnitPrice = detail.stdPrice;
          //   detail.truePrice = mul(detail.trueUnitPrice, detail.quantity);
          // }
          detail.truePrice = mul(detail.trueUnitPrice, detail.quantity);

          // 如果设置为不打折则不进行更新
          if (detail.isDiscount === IsDiscount.No) {
            continue;
          }

          // 根据折扣卡计算实收单价
          const discountPrice = isMemberPrice
            ? mul(detail.vipPrice, discountRate)
            : mul(detail.stdPrice!, discountRate);
          // 更新实收单价
          detail.trueUnitPrice = discountPrice;
          // 计算实收总价
          detail.truePrice = mul(detail.trueUnitPrice, detail.quantity);
        } else {
          // 如果没选择折扣卡，先将价格更新为标准价
          detail.trueUnitPrice = detail.stdPrice;
          detail.truePrice = mul(detail.trueUnitPrice, detail.quantity);
        }
      }
    } catch (error) {
      console.error('更新明细价格失败：', error);
    }
  };

  /** 重置订单明细价格 */
  const resetOrderDetailPrice = () => {
    updateOrderDetailPrice();
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
    updateOrderDetailPrice,
    resetOrderDetailPrice,

    // 会员状态
    member,
    // 应付金额
    payAmount,
    // 优惠金额
    discountAmount,
    // 优惠券折扣金额
    couponDiscountAmount,
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

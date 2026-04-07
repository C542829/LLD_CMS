import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { cloneDeep, isEmpty } from 'lodash';
import { mul, div, add } from '@/utils/bigMethods';
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

  /** 应付金额 */
  const payAmount = computed<number>(() => {
    let amount = 0;
    order.value.orderDetails.forEach((item: any) => {
      amount = add(amount, item.truePrice);
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

  //#endregion 状态数据

  // #region 订单明细操作

  /** 更新订单明细的折扣价格 */
  const updateOrderDetailPrice = () => {
    // 如果未选择会员卡或者订单详情为空则停止
    if (orderCount.value === 0) {
      console.warn('更新订单明细价格前置条件不满足');
      return;
    }

    try {
      // 订单明细
      const details = order.value.orderDetails;
      console.log('updateOrderItemPrice - 当前订单明细：', details);

      for (const detail of details) {
        // 如果绑定有优惠券，则跳过
        if (detail.coupon) {
          continue;
        }

        if (isSelectedMemberAsset.value) {
          // 如果折扣基础基于会员价，先将价格更新为会员价
          if (checkedAssetInfo.value.assetDiscountBase === DiscountType.Member) {
            detail.trueUnitPrice = detail.vipPrice;
            detail.truePrice = mul(detail.trueUnitPrice, detail.quantity);
          } else {
            detail.trueUnitPrice = detail.stdPrice;
            detail.truePrice = mul(detail.trueUnitPrice, detail.quantity);
          }
          // 如果设置为不打折则不进行更新
          if (detail.isDiscount === IsDiscount.No) {
            continue;
          }

          // 如果折扣基础基于会员价，先将价格更新为会员价
          const isMemberPrice = checkedAssetInfo.value.assetDiscountBase === DiscountType.Member;
          // 折算率
          const discountRate = div(checkedAssetInfo.value.assetDiscountRate, 100);
          // 更新明细价格
          const discountPrice = isMemberPrice
            ? mul(detail.vipPrice, discountRate)
            : mul(detail.stdPrice!, discountRate);
          detail.trueUnitPrice = discountPrice;
          detail.truePrice = mul(detail.trueUnitPrice, detail.quantity);
        } else {
          // 如果折扣基础基于标准价，先将价格更新为标准价
          detail.trueUnitPrice = detail.stdPrice;
          detail.truePrice = mul(detail.trueUnitPrice, detail.quantity);
        }

        // console.log('更新订单明细价格：', detail);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /** 重置订单明细价格 */
  const resetOrderDetailPrice = () => {
    try {
      // 订单明细
      const details = order.value.orderDetails;
      for (const detail of details) {
        // 如果绑定有优惠券，则跳过
        if (detail.coupon) {
          continue;
        }

        // 重置当前订单项目的折扣价格
        detail.trueUnitPrice = detail.stdPrice;
        detail.truePrice = mul(detail.stdPrice!, detail.quantity);
      }
    } catch (error) {}
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

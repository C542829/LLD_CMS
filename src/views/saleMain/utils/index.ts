import { CustomerType, DiscountType, IsDiscount, OrderDetailType, ResponseCode } from '@/enums';
import { OrderSettleDTO } from '@/api/order/types';

/**
 * 默认订单表单数据
 */
export const DEFAULT_ORDER_FORM: OrderSettleDTO = {
  orderId: 0,
  vipId: 0,
  bedId: 0,
  bedName: '',
  customerType: CustomerType.Guest,
  customerName: '散客',
  remark: '',
  totalAmount: 0,
  actualAmount: 0,
  discountAmount: 0,
  orderTime: undefined,
  orderDetails: [],
  ticketUseList: [],
  assetIds: [],
  paymentInfoList: [],
};

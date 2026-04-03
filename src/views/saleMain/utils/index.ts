import Message from '@/components/Message';
import { CustomerType } from '@/enums';
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

/**
 * 验证订单
 * @param order 订单内容
 */
export const verifyOrder = (order: OrderSettleDTO) => {
  for (const detail of order.orderDetails) {
    if (detail.technicians && detail.technicians.length === 0) {
      Message.warning('请选择销售人员');
      return false;
    }
  }

  return true;
};

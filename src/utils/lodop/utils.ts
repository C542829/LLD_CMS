import { OrderData, OrderDetail, RechargeData, Technician } from './types';
import { OrderDetailType, ServiceType } from '@/enums/index';

/**
 * 服务类型映射
 */
const ServiceTypeMap: Record<number, string> = {
  [ServiceType.Point]: '点',
  [ServiceType.Add]: '加',
  [ServiceType.Round]: '轮',
};

/**
 * 获取技师姓名列表
 * @param list 技师列表
 * @returns 技师姓名列表
 */
export const getUserNameList = (list: Technician[], detail: OrderDetail) => {
  if (!Array.isArray(list) || list.length === 0) {
    return '';
  }
  return list
    .map(
      (item) =>
        item.userName + (OrderDetailType.Service === detail.bizType ? `-${ServiceTypeMap[detail.serverType]}` : ''),
    )
    .join('\n');
};

/**
 * 计算订单打印所需的高度（单位：毫米）
 * @param data 订单数据
 * @returns 估算的打印高度（毫米）
 */
export function calculateOrderPrintHeight(data: OrderData): number {
  // 21 * 3 = 63
  const baseHeight = 70; // 基础内容高度（固定部分）
  // const baseHeight = 120; // 基础内容高度（固定部分）
  const detailRowHeight = 4; // 每行订单明细的高度（毫米）
  const paymentRowHeight = 3; // 每行支付明细的高度（毫米）
  const faultTolerance = 10; // 容错空间

  // 动态部分高度
  let detailHeight = 0;
  for (const item of data.orderDetails) {
    if (Array.isArray(item.technicians)) {
      detailHeight += item.technicians.length * detailRowHeight;
    } else {
      detailHeight += detailRowHeight;
    }
  }
  const paymentHeight = data.payments.length * paymentRowHeight;

  // 总高度 = 基础高度 + 动态部分高度 + 容错空间
  return baseHeight + detailHeight + paymentHeight + faultTolerance;
}

/**
 * 计算充值单打印所需的高度（单位：毫米）
 * @param data 充值数据
 * @returns 估算的打印高度（毫米）
 */
export function calculateRechargePrintHeight(data: RechargeData): number {
  const baseHeight = 140; // 基础内容高度（固定部分）
  const paymentRowHeight = 6; // 每行支付明细的高度（毫米）
  const kpiRowHeight = 6; // 每行业绩归属的高度（毫米）
  const faultTolerance = 30; // 容错空间

  // 动态部分高度
  const paymentHeight = data.paymentInfoList.length * paymentRowHeight;
  const kpiHeight = data.userKpiList.length * kpiRowHeight;

  // 总高度 = 基础高度 + 动态部分高度 + 容错空间
  return baseHeight + paymentHeight + kpiHeight + faultTolerance;
}

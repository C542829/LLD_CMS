import { OrderData, RechargeData } from './types';

/**
 * 生成订单HTML模板字符串
 * @param data 订单数据
 * @returns 完整的HTML模板
 */
export const generateOrderHtmlTemplate = (data: OrderData): string => {
  const detailRows = data.orderDetails
    .map((item) => {
      const addFlag = item.serverType === 1 ? '-加' : '';
      return `
          <tr>
            <td>${item.businessName}￥${item.stdPrice.toFixed(2)}</td>
            <td>${item.userName}${addFlag}</td>
            <td>${item.quantity}</td>
            <td>￥${item.truePrice.toFixed(2)}</td>
          </tr>
        `;
    })
    .join('');

  const paymentItems = data.payments
    .map((pay) => {
      return `<p style="margin: 0; text-indent: 2em;">${pay.paymentName}支付: ￥${pay.totalAmount.toFixed(2)}</p>`;
    })
    .join('');

  return `
      <div style="width: 80mm; font-family: 'SimHei', 'Microsoft YaHei', Arial; padding: 10px;">
        <h2 style="text-align: center; margin: 0; font-size: 16px; font-weight: bold;">${data.orgName || ''}</h2>
        <p style="text-align: center; margin: 0 0 10px; font-size: 14px;">消费单</p>

        <p style="margin: 5px 0; font-size: 12px;">账务时间: ${data.orderTime || ''}</p>
        <p style="margin: 5px 0; font-size: 12px;">买单时间: ${data.settleTime || ''}</p>
        <hr style="border: none; border-top: 1px dashed #333; margin: 10px 0;">

        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="border-bottom: 1px solid #333;">
              <th style="text-align: left; padding: 5px 0;">项目/标准价</th>
              <th style="text-align: left; padding: 5px 0;">技师</th>
              <th style="text-align: left; padding: 5px 0;">数量</th>
              <th style="text-align: left; padding: 5px 0;">金额</th>
            </tr>
          </thead>
          <tbody>${detailRows}</tbody>
        </table>
        <hr style="border: none; border-top: 1px dashed #333; margin: 10px 0;">

        <p style="margin: 5px 0; font-size: 12px;">房间编号: ${data.bedName || ''}</p>

        <p style="margin: 10px 0 5px; font-size: 12px; font-weight: bold;">支付明细</p>
        <div style="margin-bottom: 10px;">${paymentItems}</div>
        <hr style="border: none; border-top: 1px dashed #333; margin: 10px 0;">

        <p style="margin: 5px 0; font-size: 12px;">原价总计: ￥${data.totalAmount.toFixed(2) || ''}</p>
        <p style="margin: 5px 0; font-size: 12px;">实付总计: ￥${data.actualAmount.toFixed(2) || ''}</p>
        <p style="margin: 5px 0; font-size: 12px;">节省总计: ￥${data.discountAmount.toFixed(2) || ''}</p>

        <p style="margin: 10px 0 5px; font-size: 12px;">系统单号: ${data.orderCode || ''}</p>
        <p style="margin: 5px 0; font-size: 12px;">收银员: ${data.userName || ''}</p>
        <p style="margin: 5px 0; font-size: 12px;">开单时间: ${data.orderTime || ''}</p>

        <p style="margin: 15px 0 5px; font-size: 12px;">顾客签名: ______________</p>

        <p style="text-align: center; margin: 15px 0 5px; font-size: 12px;">恭侯您下次光临</p>
        <p style="margin: 5px 0; font-size: 12px;">服务电话: ${data.servicePhone || data.orgNumber || ''}</p>
        <p style="margin: 5px 0; font-size: 12px; word-break: break-all;">门店地址: ${data.orgAddress || ''}</p>
        <p style="text-align: center; margin: 15px 0 0; font-size: 12px;">加盟门店 自主经营</p>
      </div>
    `;
};

/**
 * 生成充值单HTML模板字符串
 * @param data 充值数据
 * @returns 完整的HTML模板
 */
export const generateRechargeHtmlTemplate = (data: RechargeData): string => {
  // 处理支付明细
  const paymentItems = data.paymentInfoList
    .map((pay) => {
      return `<p style="margin: 0; text-indent: 2em;">${pay.paymentName}支付: ￥${pay.paymentAmount.toFixed(2)}</p>`;
    })
    .join('');

  // 处理赠送内容（兼容null值）
  const presentContent =
    data.ticketInfo || data.presentValue
      ? data.ticketInfo || `赠送金额: ￥${data.presentValue?.toFixed(2) || '0.00'}`
      : '无赠送内容';

  // 格式化时间（将ISO格式转为本地时间字符串）
  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    return date
      .toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      .replace(/\//g, '-');
  };

  return `
    <div style="width: 80mm; font-family: 'SimHei', 'Microsoft YaHei', Arial; padding: 10px;">
      <h2 style="text-align: center; margin: 0; font-size: 16px; font-weight: bold;">${
        data.orgName || '会员充值中心'
      }</h2>
      <p style="text-align: center; margin: 0 0 10px; font-size: 14px;">充值单</p>

      <p style="margin: 5px 0; font-size: 12px;">充值时间: ${formatTime(data.rechargeTime)}</p>
      <p style="margin: 5px 0; font-size: 12px;">充值类型: ${data.rechargeType}</p>
      <hr style="border: none; border-top: 1px dashed #333; margin: 10px 0;">

      <p style="margin: 5px 0; font-size: 12px;">会员卡号: ${data.vipCardNumber || '无'}</p>
      <p style="margin: 5px 0; font-size: 12px;">会员姓名: ${data.vipName || '匿名会员'}</p>
      <p style="margin: 5px 0; font-size: 12px;">联系电话: ${data.vipPhoneNumber || '未预留'}</p>
      <p style="margin: 5px 0; font-size: 12px;">充值活动: ${data.activeName || '无活动'}</p>
      <hr style="border: none; border-top: 1px dashed #333; margin: 10px 0;">

      <p style="margin: 10px 0 5px; font-size: 12px; font-weight: bold;">充值明细</p>
      <p style="margin: 5px 0; font-size: 12px;">充值金额: ￥${data.rechargeValue.toFixed(2)}</p>
      <p style="margin: 5px 0; font-size: 12px;">赠送内容: ${presentContent}</p>
      <hr style="border: none; border-top: 1px dashed #333; margin: 10px 0;">

      <p style="margin: 10px 0 5px; font-size: 12px; font-weight: bold;">支付明细</p>
      <div style="margin-bottom: 10px;">${paymentItems}</div>
      <hr style="border: none; border-top: 1px dashed #333; margin: 10px 0;">

      <p style="margin: 5px 0; font-size: 12px;">系统单号: ${data.historyCode || ''}</p>
      <p style="margin: 5px 0; font-size: 12px;">操作员: ${data.userName || '未知操作员'}</p>
      <p style="margin: 5px 0; font-size: 12px;">资产编号: ${data.assetCode || '无'}</p>

      ${
        data.userKpiList.length > 0
          ? `
        <p style="margin: 10px 0 5px; font-size: 12px; font-weight: bold;">业绩归属</p>
        ${data.userKpiList
          .map(
            (kpi) => `
          <p style="margin: 3px 0; font-size: 12px;">${kpi.userName}: ￥${kpi.kpi.toFixed(2)}</p>
        `,
          )
          .join('')}
      `
          : ''
      }

      <p style="margin: 15px 0 5px; font-size: 12px;">顾客签名: ______________</p>

      <p style="text-align: center; margin: 15px 0 5px; font-size: 12px;">恭侯您下次光临</p>
      <p style="margin: 5px 0; font-size: 12px;">服务电话: ${data.servicePhone || data.orgNumber || '400-888-8888'}</p>
      <p style="margin: 5px 0; font-size: 12px; word-break: break-all;">门店地址: ${data.orgAddress || '未设置地址'}</p>
      <p style="text-align: center; margin: 15px 0 0; font-size: 12px;">加盟门店 自主经营</p>
      <p style="text-align: center; margin: 5px 0 0; font-size: 11px; color: #666;">注: 本单据为充值凭证，请妥善保管</p>
    </div>
  `;
};

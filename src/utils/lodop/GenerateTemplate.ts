import { OrderData, RechargeData } from './types';
import { formatDateTime } from '@/utils/time';
import { hidePhone } from '@/utils/index';
import { getUserNameList } from './utils';

const FONT_FAMILY = 'font-family: 黑体, 宋体';
const FONT_SIZE = '3mm';
const FONT_SIZE_TITLE = '4mm';
const FONT_SIZE_TABLE = '2.5mm';
const FONT_SIZE_SMALL = '2.5mm';
// const MARGIN_TOP = '';
const MARGIN_TOP = '0mm';
const MARGIN = '2mm';
const HR_STYLE = `border-top: 1px solid #333; margin: 1mm 0;`;

/**
 * 生成订单HTML模板字符串
 * @param data 订单数据
 * @returns 完整的HTML模板
 */
export const generateOrderHtmlTemplate = (data: OrderData, width = '48mm'): string => {
  // 表格一行高度 3.5
  // 支付详情一行高度 4.5
  // 分割线 4 * 3
  // 4 + 6 + 3.5 + 6 + 4.5 * 12 + 9*3 + 4 * 3 = 112.5
  // 4 + 6 + 3.5 + 6 + 4.5 * 12 + 9*3 + 4 * 3 + 3.5*6+4.5*3 =147

  const detailRows = data.orderDetails
    .map((item) => {
      // const addFlag = item.serverType === 1 ? '-加' : '';
      return `
          <tr>
            <td style="width: 45%; ">
            ${item.businessName} ￥${item.trueUnitPrice}
            </td>
            <td style="width: 20%;" align="center">${getUserNameList(item.technicians)}</td>
            <td style="width: 15%;" align="center">${item.quantity}</td>
            <td style="width: 20%;" align="center">￥${item.truePrice}</td>
          </tr>
        `;
    })
    .join('');

  const paymentItems = data.payments
    .map((pay) => {
      return `<p style="text-indent: 2em;">
                ${pay.paymentName}支付: ￥${pay.totalAmount || '0'}
              </p>`;
    })
    .join('');

  return `
      <div style="width: ${width}; ${FONT_FAMILY}; color: #000; font-size: ${FONT_SIZE}; padding-top: 3mm;">
        <h2 style="text-align: center; font-size: ${FONT_SIZE_TITLE}; font-weight: bold;">${data.orgName || '门店'}</h2>
        <p style="margin: 1mm 0 2mm 0; text-align: center; font-size: ${FONT_SIZE};">消费单</p>

        <p>系统单号: ${data.orderCode || '-'}</p>

        <p>买单时间: ${data.settleTime || '-'}</p>
        <p>顾客: ${data.vipName || data.customerName || '-'}</p>
        <p>手机号: ${hidePhone(data.vipPhoneNumber) || '-'}</p>

        <div style="${HR_STYLE}"></div>

        <table border="1" style="width: 100%; border-collapse: collapse; font-size: ${FONT_SIZE_TABLE};">
          <thead>
            <tr style="font-weight:bold;">
              <td style="width: 45%; padding-bottom: 1mm;">项目/单价</td>
              <td style="width: 20%;" align="center">技师</td>
              <td style="width: 15%;" align="center">数量</td>
              <td style="width: 20%;" align="center">金额</td>
            </tr>
          </thead>
          <tbody>${detailRows}</tbody>
        </table>

        <div style="${HR_STYLE}"></div>

        <p style="font-weight: bold;">支付明细：</p>
        <div>${paymentItems}</div>
        <p>实付总计: ￥${data.actualAmount || '0'}</p>
        <p>消费后余额:￥${data.afterBalance || '-'}</p>

        <div style="${HR_STYLE}"></div>


        <p>收银员: ${data.userName || '-'}</p>

        <p style="margin: ${MARGIN} 0;">顾客签名: ______________</p>

        <p style="margin: ${MARGIN} 0; text-align: center;">恭侯您下次光临</p>
        <p>服务电话: ${data.servicePhone || data.orgNumber || '-'}</p>
        <p>门店地址: ${data.orgAddress || '-'}</p>
        <p style="margin: ${MARGIN} 0; text-align: center;">加盟门店 自主经营</p>
      </div>
    `;
};

/**
 * 生成充值单HTML模板字符串
 * @param data 充值数据
 * @returns 完整的HTML模板
 */
export const generateRechargeHtmlTemplate = (data: RechargeData, width = '48mm'): string => {
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

  return `
    <div style="width: ${width}; ${FONT_FAMILY}; padding: 10px 0; font-size: ${FONT_SIZE};">
      <h2 style="text-align: center; font-size: ${FONT_SIZE_TITLE}; font-weight: bold;">${data.orgName || '会员'}</h2>
      <p style="text-align: center; margin: 0 0 10px;">充值单</p>

      <p style="margin-top: ${MARGIN_TOP};">充值时间: ${formatDateTime(new Date(data.rechargeTime))}</p>
      <p style="margin-top: ${MARGIN_TOP};">充值类型: ${data.rechargeType}</p>

      <div style="${HR_STYLE}"></div>

      <p style="margin-top: ${MARGIN_TOP};">会员卡号: ${data.vipCardNumber || '无'}</p>
      <p style="margin-top: ${MARGIN_TOP};">会员姓名: ${data.vipName || '匿名会员'}</p>
      <p style="margin-top: ${MARGIN_TOP};">联系电话: ${data.vipPhoneNumber || '未预留'}</p>
      <p style="margin-top: ${MARGIN_TOP};">充值活动: ${data.activeName || '无活动'}</p>

      <div style="${HR_STYLE}"></div>

      <p style="margin: 10px 0 5px; font-weight: bold;">充值明细</p>
      <p style="margin-top: ${MARGIN_TOP};">充值金额: ￥${data.rechargeValue.toFixed(2)}</p>
      <p style="margin-top: ${MARGIN_TOP};">赠送内容: ${presentContent}</p>
      <div style="${HR_STYLE}"></div>

      <p style="margin: 10px 0 5px; font-weight: bold;">支付明细</p>
      <div style="margin-bottom: 10px;">${paymentItems}</div>
      <div style="${HR_STYLE}"></div>

      <p style="margin-top: ${MARGIN_TOP};">系统单号: ${data.historyCode || ''}</p>
      <p style="margin-top: ${MARGIN_TOP};">操作员: ${data.userName || '未知操作员'}</p>
      <p style="margin-top: ${MARGIN_TOP};">资产编号: ${data.assetCode || '无'}</p>

      ${
        data.userKpiList.length > 0
          ? `
        <p style="margin: 10px 0 5px; font-weight: bold;">业绩归属</p>
        ${data.userKpiList
          .map(
            (kpi) => `
          <p style="margin: 3px 0; text-indent: 2em;">${kpi.userName}: ￥${kpi.kpi.toFixed(2)}</p>
        `,
          )
          .join('')}
      `
          : ''
      }

      <p style="margin: 15px 0 5px;">顾客签名: ______________</p>

      <p style="text-align: center; margin: 10px 0;">恭侯您下次光临</p>
      <p style="margin-top: ${MARGIN_TOP};">服务电话: ${data.servicePhone || data.orgNumber || '400-888-8888'}</p>
      <p style="margin-top: ${MARGIN_TOP}; word-break: break-all;">门店地址: ${data.orgAddress || '未设置地址'}</p>
      <p style="text-align: center; margin: 10px 0 0;">加盟门店 自主经营</p>
      <p style="text-align: center; margin: 5px 0 0; font-size: ${FONT_SIZE_SMALL}; color: #333;">注: 本单据为充值凭证，请妥善保管</p>
    </div>
  `;
};

export const _generateOrderHtmlTemplate = (data: OrderData, width = '48mm'): string => {
  const detailRows = data.orderDetails
    .map((item) => {
      // const addFlag = item.serverType === 1 ? '-加' : '';
      return `
          <tr>
            <td >${item.businessName} ￥${item.stdPrice.toFixed(2)}</td>
            <td >${item.userName}</td>
            <td align="center">${item.quantity}</td>
            <td >￥${item.truePrice.toFixed(2)}</td>
          </tr>
        `;
    })
    .join('');

  const paymentItems = data.payments
    .map((pay) => {
      return `<p style="margin: 0; text-indent: 2em;">
                ${pay.paymentName}支付: ￥${pay.totalAmount.toFixed(2) || '0'}
              </p>`;
    })
    .join('');

  return `
      <div style="width: ${width}; ${FONT_FAMILY}; padding: 10px 0; color: #000; font-size: ${FONT_SIZE};">
        <h2 style="text-align: center; font-size: ${FONT_SIZE_TITLE}; font-weight: bold;">${data.orgName || '门店'}</h2>
        <p style="text-align: center; margin: 3px 0 10px 0; font-size: ${FONT_SIZE};">消费单</p>

        <p style="margin-top: ${MARGIN_TOP};">账务时间: ${data.orderTime || '-'}</p>
        <p style="margin-top: ${MARGIN_TOP};">买单时间: ${data.settleTime || '-'}</p>

        <div style="${HR_STYLE}"></div>

        <table border="1" style="width: 100%; border-collapse: collapse; font-size: ${FONT_SIZE_TABLE};">
          <thead>
            <tr style="font-weight:bold;">
              <td style="width: 45%;">项目/标准价</td>
              <td style="width: 20%;">技师</td>
              <td style="width: 15%;" align="center">数量</td>
              <td style="width: 20%;">金额</td>
            </tr>
          </thead>
          <tbody>${detailRows}</tbody>
        </table>

        <div style="${HR_STYLE}"></div>

        <p style="margin-top: ${MARGIN_TOP};">房间编号: ${data.bedName || '-'}</p>

        <p style="margin: 10px 0 5px; font-weight: bold;">支付明细：</p>
        <div style="margin-bottom: 10px;">${paymentItems}</div>

        <div style="${HR_STYLE}"></div>

        <p style="margin-top: ${MARGIN_TOP};">原价总计: ￥${data.totalAmount.toFixed(2) || '0'}</p>
        <p style="margin-top: ${MARGIN_TOP};">实付总计: ￥${data.actualAmount.toFixed(2) || '0'}</p>
        <p style="margin-top: ${MARGIN_TOP};">节省总计: ￥${data.discountAmount.toFixed(2) || '0'}</p>

        <p style="margin: 10px 0 5px;">系统单号: ${data.orderCode || '-'}</p>
        <p style="margin-top: ${MARGIN_TOP};">收银员: ${data.userName || '-'}</p>
        <p style="margin-top: ${MARGIN_TOP};">开单时间: ${data.orderTime || '-'}</p>

        <p style="margin: 15px 0 5px;">顾客签名: ______________</p>

        <p style="text-align: center; margin: 10px 0;">恭侯您下次光临</p>
        <p style="margin-top: ${MARGIN_TOP};">服务电话: ${data.servicePhone || data.orgNumber || '-'}</p>
        <p style="margin-top: ${MARGIN_TOP};">门店地址: ${data.orgAddress || '-'}</p>
        <p style="text-align: center; margin: 10px 0;">加盟门店 自主经营</p>
      </div>
    `;
};

// <p style="margin-top: ${MARGIN_TOP};">账务时间: ${data.orderTime || '-'}</p>
// <p style="margin-top: ${MARGIN_TOP};">开单时间: ${data.orderTime || '-'}</p>;
// <p style="margin-top: ${MARGIN_TOP};">消费前余额: ${data.beforeBalance || '-'}</p>;
// <p style="margin-top: ${MARGIN_TOP};">原价总计: ￥${data.totalAmount.toFixed(2) || '0'}</p>
// <p style="margin-top: ${MARGIN_TOP};">节省总计: ￥${data.discountAmount.toFixed(2) || '0'}</p>;

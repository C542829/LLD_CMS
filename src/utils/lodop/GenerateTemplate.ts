import { OrderData, RechargeData } from './types';
import { formatDateTime } from '@/utils/time';
import { hidePhone } from '@/utils/index';
import { getUserNameList } from './utils';
import { CustomerType, RechargeTypeMap } from '@/enums';

const FONT_SIZE = '3mm';
const FONT_SIZE_TITLE = '4mm';
const FONT_SIZE_TABLE = '2.5mm';
const FONT_SIZE_SMALL = '2.5mm';
const MARGIN = '6px';
const HR_STYLE = `border-top: 1px solid #333; margin: 1mm 0;`;

/**
 * 生成订单HTML模板字符串
 * @param data 订单数据
 * @returns 完整的HTML模板
 */
export const generateOrderHtmlTemplate = (data: OrderData, width = '48mm'): string => {
  // 是否会员
  const isMember = data.customerType === CustomerType.Member;

  // 处理订单详情行
  const detailRows = (data.orderDetails || [])
    .map((item) => {
      // const addFlag = item.serverType === 1 ? '-加' : '';
      return `
          <tr>
            <td style="width: 40%; ">
            ${item.businessName}￥${item.stdPrice}
            </td>
            <td style="width: 25%; white-space: pre-wrap;" align="center">${getUserNameList(
              item.technicians,
              item,
            )}</td>
            <td style="width: 15%; white-space: pre-wrap;" align="center">${item.quantity}</td>
            <td style="width: 20%; white-space: pre-wrap;" align="center">￥${item.truePrice}</td>
          </tr>
        `;
    })
    .join('');

  // 处理支付明细
  const paymentItems = (data.payments || [])
    .map((pay) => {
      return `<p style="text-indent: 1em;">
                ${pay.paymentName}支付: ￥${pay.totalAmount || '0'}
              </p>`;
    })
    .join('');

  // 处理项目券剩余明细
  const ticketUsages = (data.ticketUsages || [])
    .map((item) => {
      return `<p style="text-indent: 1em;">
                ${item.ticketName}  余:${item.remainingCount || '0'}次
              </p>`;
    })
    .join('');

  return `
  <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          line-height: 4mm;
          font-family:
            "SimHei",
            "黑体",
            "SimSun",
            "宋体",
            "Microsoft YaHei",
            "微软雅黑",
            "Arial",
            sans-serif;
        }
      </style>
    </head>
    <body>
      <div style="width: ${width}; font-size: ${FONT_SIZE}; line-height: 3mm; color: #000; padding-top: 3mm;">
        <h2 style="text-align: center; font-size: ${FONT_SIZE_TITLE}; font-weight: bold;">${data.orgName || '门店'}</h2>
        <p style="margin: 1mm 0 2mm 0; text-align: center; font-size: ${FONT_SIZE};">消费单</p>

        <p style="font-weight: 600;">手写单号: ${data.manualOrderNo || '-'}</p>
        <p>系统单号: ${data.orderCode || '-'}</p>

        <p>买单时间: ${data.settleTime || '-'}</p>
        <p>顾客: ${data.vipName || data.customerName || '-'}</p>
        ${isMember ? `<p>手机号: ${hidePhone(data.vipPhoneNumber) || '-'}</p>` : ''}

        <div style="${HR_STYLE}"></div>

        <table border="1" style="width: 100%; border-collapse: collapse; font-size: ${FONT_SIZE_TABLE};">
          <thead>
            <tr style="font-weight:bold;">
              <td style="width: 40%; padding-bottom: 1mm;">项目/单价</td>
              <td style="width: 25%;" align="center">技师</td>
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
        ${isMember ? `<p>消费前余额:￥${data.beforeBalance || '-'}</p>` : ''}
        ${isMember ? `<p>消费后余额:￥${data.afterBalance || '-'}</p>` : ''}
        ${data?.ticketUsages && data?.ticketUsages?.length > 0 ? `<p>疗程卡余额：</p><div>${ticketUsages}</div>` : ''}
        <div style="${HR_STYLE}"></div>


        <p>收银员: ${data.userName || '-'}</p>
        <p>备注: ${data.remark || '-'}</p>

        <p style="margin: ${MARGIN} 0;">顾客签名: ______________</p>

        <p style="margin: ${MARGIN} 0; text-align: center;">恭侯您下次光临</p>
        <p>服务电话: ${data.servicePhone || data.orgNumber || '-'}</p>
        <p>门店地址: ${data.orgAddress || '-'}</p>
      </div>
    </body>
    </html>
    `;
};

/**
 * 生成充值单HTML模板字符串
 * @param data 充值数据
 * @returns 完整的HTML模板
 */
export const generateRechargeHtmlTemplate = (data: RechargeData, width = '48mm'): string => {
  // 处理支付明细
  const paymentItems = (data.paymentInfoList || [])
    .map((pay) => {
      return `<p style="text-indent: 2em;">
                ${pay.paymentName}支付: ￥${pay.paymentAmount.toFixed(2)}
              </p>`;
    })
    .join('');

  // 处理赠送内容（兼容null值）
  const presentContent =
    data.ticketInfo || data.presentValue
      ? data.ticketInfo || `赠送金额: ￥${data.presentValue?.toFixed(2) || '0.00'}`
      : '无赠送内容';

  return `
  <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          line-height: 4mm;
          font-family:
            "SimHei",
            "黑体",
            "SimSun",
            "宋体",
            "Microsoft YaHei",
            "微软雅黑",
            "Arial",
            sans-serif;
        }
      </style>
    </head>
    <body>
      <div style="width: ${width}; font-size: ${FONT_SIZE}; line-height: 3mm; color: #000; padding-top: 3mm;">
        <h2 style="text-align: center; font-size: ${FONT_SIZE_TITLE}; font-weight: bold;">${data.orgName || '门店'}</h2>
        <p style="margin: 1mm 0 2mm 0; text-align: center; font-size: ${FONT_SIZE};">充值单</p>

        <p>充值时间: ${formatDateTime(new Date(data.rechargeTime))}</p>
        <p>充值类型: ${RechargeTypeMap[data.rechargeType]}</p>

        <div style="${HR_STYLE}"></div>

        <p>会员卡号: ${data.vipCardNumber || '-'}</p>
        <p>会员姓名: ${data.vipName || '-'}</p>
        <p>联系电话: ${hidePhone(data.vipPhoneNumber) || '-'}</p>
        <p>充值活动: ${data.activeName || '-'}</p>

        <div style="${HR_STYLE}"></div>

        <p style="font-weight: bold;">充值明细</p>
        <p>充值金额: ￥${data.rechargeValue.toFixed(2)}</p>
        <p>赠送内容: ${presentContent}</p>

        <div style="${HR_STYLE}"></div>

        <p style="font-weight: bold;">支付明细：</p>
        <div>${paymentItems}</div>

        <div style="${HR_STYLE}"></div>

        <p>系统单号: ${data.historyCode || '-'}</p>
        <p>操作员: ${data.userName || '-'}</p>
        <p>资产编号: ${data.assetCode || '-'}</p>

        ${
          data.userKpiList.length > 0
            ? `
        <div style="${HR_STYLE}"></div>
        <p style="font-weight: bold;">业绩归属</p>
        ${data.userKpiList
          .map((kpi) => `<p style="text-indent: 2em;">${kpi.userName}: ￥${kpi.kpi.toFixed(2)}</p>`)
          .join('')}
        `
            : ''
        }

        <p style="margin: ${MARGIN} 0;">顾客签名: ______________</p>

        <p style="margin: ${MARGIN} 0; text-align: center;">恭侯您下次光临</p>
        <p>服务电话: ${data.servicePhone || data.orgNumber || '-'}</p>
        <p>门店地址: ${data.orgAddress || '-'}</p>
        <p style="text-align: center; margin: 1mm 0 0; font-size: ${FONT_SIZE_SMALL}; color: #333;">注: 本单据为充值凭证，请妥善保管</p>
      </div>
    </body>
    </html>
    `;
};

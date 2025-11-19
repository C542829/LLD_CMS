// src/utils/lodop.ts
import { getLodop } from './LodopFuncs.js';
import ElMessage from '@/components/Message'; // 若使用Element Plus，可用于提示

// 定义数据类型（匹配后端返回结构）
export interface OrderDetail {
  businessName: string;
  userName: string;
  stdPrice: number;
  quantity: number;
  truePrice: number;
  serverType: number; // 0-主项目 1-加项
}

export interface Payment {
  paymentName: string;
  totalAmount: number;
}

export interface OrderData {
  orderCode: string;
  orderTime: string;
  settleTime: string;
  totalAmount: number;
  actualAmount: number;
  discountAmount: number;
  bedName: string;
  userName: string; // 收银员
  orderDetails: OrderDetail[];
  payments: Payment[];
  orgName: string; // 门店名称，需补充到data中
  servicePhone: string; // 服务电话，需补充到data中
  orgAddress: string; // 门店地址，需补充到data中
}

export class LodopPrinter {
  private LODOP: LodopObject | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    this.LODOP = getLodop();
    if (!this.LODOP) {
      setTimeout(() => {
        this.LODOP = getLodop();
        if (!this.LODOP) {
          ElMessage.error('Lodop打印控件未安装或未启动');
        }
      }, 300);
    }
  }

  printReceipt(data: OrderData, preview = false): void {
    if (!this.LODOP) {
      ElMessage.error('Lodop控件初始化失败');
      return;
    }

    // 初始化打印区域（80mm宽）
    this.LODOP.PRINT_INITA(0, 0, 800, 1200, `${data.orgName}消费单`);

    // 标题栏
    let yPos = 30;
    this.LODOP.ADD_PRINT_TEXT(yPos, 0, 800, 40, `${data.orgName}消费单`);
    this.LODOP.SET_PRINT_STYLEA(0, 'FontSize', 16);
    this.LODOP.SET_PRINT_STYLEA(0, 'Align', 2);
    this.LODOP.SET_PRINT_STYLEA(0, 'Bold', 1);
    yPos += 50;

    // 时间信息
    this.LODOP.ADD_PRINT_TEXT(yPos, 50, 300, 25, `账务时间: ${data.orderTime}`);
    this.LODOP.ADD_PRINT_TEXT(yPos, 450, 300, 25, `买单时间: ${data.settleTime}`);
    yPos += 30;

    // 表格标题行
    this.LODOP.ADD_PRINT_TEXT(yPos, 50, 200, 25, '项目/标准价');
    this.LODOP.ADD_PRINT_TEXT(yPos, 250, 150, 25, '技师');
    this.LODOP.ADD_PRINT_TEXT(yPos, 400, 100, 25, '数量');
    this.LODOP.ADD_PRINT_TEXT(yPos, 500, 150, 25, '金额');
    this.LODOP.SET_PRINT_STYLEA(0, 'Bold', 1);
    yPos += 30;

    // 项目明细行
    data.orderDetails.forEach((item) => {
      const itemType = item.serverType === 0 ? '' : '-加';
      this.LODOP.ADD_PRINT_TEXT(yPos, 50, 200, 25, `${item.businessName}¥${item.stdPrice}${itemType}`);
      this.LODOP.ADD_PRINT_TEXT(yPos, 250, 150, 25, item.userName);
      this.LODOP.ADD_PRINT_TEXT(yPos, 400, 100, 25, item.quantity.toString());
      this.LODOP.ADD_PRINT_TEXT(yPos, 500, 150, 25, `¥${item.truePrice.toFixed(2)}`);
      yPos += 30;
    });

    // 分隔线
    yPos += 20;
    this.LODOP.ADD_PRINT_TEXT(yPos, 50, 700, 20, '--------------------------------------------------');
    yPos += 30;

    // 房间信息
    this.LODOP.ADD_PRINT_TEXT(yPos, 50, 300, 25, `房间编号: ${data.bedName}`);
    yPos += 30;

    // 支付明细
    yPos += 20;
    this.LODOP.ADD_PRINT_TEXT(yPos, 50, 200, 25, '支付明细');
    this.LODOP.SET_PRINT_STYLEA(0, 'Bold', 1);
    yPos += 30;
    data.payments.forEach((pay) => {
      this.LODOP.ADD_PRINT_TEXT(yPos, 80, 300, 25, `${pay.paymentName}支付: ¥${pay.totalAmount.toFixed(2)}`);
      yPos += 30;
    });

    // 分隔线
    yPos += 20;
    this.LODOP.ADD_PRINT_TEXT(yPos, 50, 700, 20, '--------------------------------------------------');
    yPos += 30;

    // 金额统计
    this.LODOP.ADD_PRINT_TEXT(yPos, 50, 300, 25, `原价总计: ¥${data.totalAmount.toFixed(2)}`);
    this.LODOP.ADD_PRINT_TEXT(yPos + 30, 50, 300, 25, `实付总计: ¥${data.actualAmount.toFixed(2)}`);
    this.LODOP.ADD_PRINT_TEXT(yPos + 60, 50, 300, 25, `节省总计: ¥${data.discountAmount.toFixed(2)}`);
    yPos += 90;

    // 系统单号与收银员
    this.LODOP.ADD_PRINT_TEXT(yPos, 50, 300, 25, `系统单号: ${data.orderCode}`);
    this.LODOP.ADD_PRINT_TEXT(yPos + 30, 50, 300, 25, `收银员: ${data.userName}`);
    this.LODOP.ADD_PRINT_TEXT(yPos + 60, 50, 300, 25, `开单时间: ${data.orderTime}`);
    yPos += 90;

    // 顾客签名
    this.LODOP.ADD_PRINT_TEXT(yPos, 50, 300, 25, '顾客签名: ______________');
    yPos += 40;

    // 感谢语
    this.LODOP.ADD_PRINT_TEXT(yPos, 0, 800, 25, '恭侯您下次光临');
    this.LODOP.SET_PRINT_STYLEA(0, 'Align', 2);
    yPos += 30;

    // 服务信息
    this.LODOP.ADD_PRINT_TEXT(yPos, 50, 300, 25, `服务电话: ${data.servicePhone || data.orgNumber || ''}`);
    this.LODOP.ADD_PRINT_TEXT(yPos + 30, 50, 500, 25, `门店地址: ${data.orgAddress}`);
    yPos += 60;

    // 加盟信息
    this.LODOP.ADD_PRINT_TEXT(yPos, 0, 800, 25, '加盟门店 自主经营');
    this.LODOP.SET_PRINT_STYLEA(0, 'Align', 2);

    // 执行打印
    preview ? this.LODOP.PREVIEW() : this.LODOP.PRINT();
  }

  /**
   * 生成HTML模板字符串
   * @param data 订单数据
   * @returns 完整的HTML模板
   */
  private generateHtmlTemplate(data: OrderData): string {
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
  }

  /**
   * 打印HTML模板
   * @param data 订单数据
   * @param preview 是否预览
   */
  printByHTML(data: OrderData, preview = false): void {
    if (!this.LODOP) {
      ElMessage.error('Lodop控件初始化失败');
      return;
    }

    const html = this.generateHtmlTemplate(data);
    this.LODOP.PRINT_INITA(0, 0, 800, 1200, `${data.orgName}消费单`);
    this.LODOP.ADD_PRINT_HTML(0, 0, 800, 1200, html);
    preview ? this.LODOP.PREVIEW() : this.LODOP.PRINT();
  }

  getPrinters(): string[] {
    if (!this.LODOP) return [];
    const count = this.LODOP.GET_PRINTER_COUNT();
    return Array.from({ length: count }, (_, i) => this.LODOP!.GET_PRINTER_NAME(i));
  }

  setPrinter(index: number): void {
    this.LODOP?.SET_PRINTER_INDEX(index);
  }
}

// src/utils/lodop.ts
import { getLodop } from './LodopFuncs.js';
import { OrderData, RechargeData } from './types';
import { generateOrderHtmlTemplate, generateRechargeHtmlTemplate } from './GenerateTemplate';
import ElMessage from '@/components/Message'; // 若使用Element Plus，可用于提示

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
   * 生成订单HTML模板字符串
   * @param data 订单数据
   * @returns 完整的HTML模板
   */
  generateOrderHtmlTemplate: (data: OrderData) => string = generateOrderHtmlTemplate;

  /**
   * 生成充值单HTML模板字符串
   * @param data 充值数据
   * @returns 完整的HTML模板
   */
  generateRechargeHtmlTemplate: (data: RechargeData) => string = generateRechargeHtmlTemplate;

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

    const html = this.generateOrderHtmlTemplate(data);
    this.LODOP.PRINT_INITA(0, 0, 800, 1200, `${data.orgName}消费单`);
    this.LODOP.ADD_PRINT_HTML(0, 0, 800, 1200, html);
    preview ? this.LODOP.PREVIEW() : this.LODOP.PRINT();
  }

  /**
   * 打印HTML模板
   * @param data 订单数据
   * @param preview 是否预览
   */
  printRechargeByHTML(data: RechargeData, preview = false): void {
    if (!this.LODOP) {
      ElMessage.error('Lodop控件初始化失败');
      return;
    }

    const html = this.generateRechargeHtmlTemplate(data);
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

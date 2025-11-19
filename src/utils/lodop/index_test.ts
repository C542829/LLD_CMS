// src/utils/lodop.ts 小票打印工具类
import { getLodop } from './LodopFuncs.js';
import ElMessage from '@/components/Message';

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

  // 打印配置常量
  private readonly PAGE_HEIGHT = 1200; // 每页高度（1/10mm）
  private readonly HEADER_HEIGHT = 180; // 页头高度（包含标题、时间信息、表头）
  private readonly FOOTER_HEIGHT = 300; // 页脚高度（包含统计信息、签名等）
  private readonly ITEM_HEIGHT = 30; // 每个项目的高度
  private readonly PAYMENT_HEIGHT = 30; // 每个支付方式的高度
  private readonly LINE_SPACING = 10; // 行间距

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

  /**
   * 计算每页可容纳的项目数量
   */
  private calculateItemsPerPage(): number {
    const availableHeight = this.PAGE_HEIGHT - this.HEADER_HEIGHT - this.FOOTER_HEIGHT;
    return Math.floor(availableHeight / (this.ITEM_HEIGHT + this.LINE_SPACING));
  }

  /**
   * 打印页头
   */
  private printHeader(data: OrderData, pageNum: number, totalPages: number): number {
    let yPos = 30;

    // 标题栏
    this.LODOP!.ADD_PRINT_TEXT(yPos, 0, 800, 40, `${data.orgName}消费单`);
    this.LODOP!.SET_PRINT_STYLEA(0, 'FontSize', 16);
    this.LODOP!.SET_PRINT_STYLEA(0, 'Align', 2);
    this.LODOP!.SET_PRINT_STYLEA(0, 'Bold', 1);
    yPos += 50;

    // 页码信息（多页时显示）
    if (totalPages > 1) {
      this.LODOP!.ADD_PRINT_TEXT(yPos, 600, 200, 25, `第 ${pageNum} 页/共 ${totalPages} 页`);
      this.LODOP!.SET_PRINT_STYLEA(0, 'FontSize', 10);
      this.LODOP!.SET_PRINT_STYLEA(0, 'Align', 2);
    }
    yPos += 30;

    // 时间信息
    this.LODOP!.ADD_PRINT_TEXT(yPos, 50, 300, 25, `账务时间: ${data.orderTime}`);
    this.LODOP!.ADD_PRINT_TEXT(yPos, 450, 300, 25, `买单时间: ${data.settleTime}`);
    yPos += 30;

    // 表格标题行
    this.LODOP!.ADD_PRINT_TEXT(yPos, 50, 200, 25, '项目/标准价');
    this.LODOP!.ADD_PRINT_TEXT(yPos, 250, 150, 25, '技师');
    this.LODOP!.ADD_PRINT_TEXT(yPos, 400, 100, 25, '数量');
    this.LODOP!.ADD_PRINT_TEXT(yPos, 500, 150, 25, '金额');
    this.LODOP!.SET_PRINT_STYLEA(0, 'Bold', 1);
    yPos += 30;

    return yPos;
  }

  /**
   * 打印项目明细
   */
  private printItems(items: OrderDetail[], startIndex: number, count: number, startY: number): number {
    let yPos = startY;
    const endIndex = Math.min(startIndex + count, items.length);

    for (let i = startIndex; i < endIndex; i++) {
      const item = items[i];
      const itemType = item.serverType === 0 ? '' : '-加';

      this.LODOP!.ADD_PRINT_TEXT(yPos, 50, 200, 25, `${item.businessName}¥${item.stdPrice}${itemType}`);
      this.LODOP!.ADD_PRINT_TEXT(yPos, 250, 150, 25, item.userName);
      this.LODOP!.ADD_PRINT_TEXT(yPos, 400, 100, 25, item.quantity.toString());
      this.LODOP!.ADD_PRINT_TEXT(yPos, 500, 150, 25, `¥${item.truePrice.toFixed(2)}`);
      yPos += this.ITEM_HEIGHT;
    }

    return yPos;
  }

  /**
   * 打印页脚
   */
  private printFooter(data: OrderData, isLastPage: boolean): void {
    let yPos = this.PAGE_HEIGHT - this.FOOTER_HEIGHT + 30;

    // 分隔线
    this.LODOP!.ADD_PRINT_TEXT(yPos, 50, 700, 20, '--------------------------------------------------');
    yPos += 30;

    // 房间信息
    this.LODOP!.ADD_PRINT_TEXT(yPos, 50, 300, 25, `房间编号: ${data.bedName}`);
    yPos += 30;

    // 只在最后一页显示完整页脚
    if (isLastPage) {
      // 支付明细
      yPos += 20;
      this.LODOP!.ADD_PRINT_TEXT(yPos, 50, 200, 25, '支付明细');
      this.LODOP!.SET_PRINT_STYLEA(0, 'Bold', 1);
      yPos += 30;
      data.payments.forEach((pay) => {
        this.LODOP!.ADD_PRINT_TEXT(yPos, 80, 300, 25, `${pay.paymentName}支付: ¥${pay.totalAmount.toFixed(2)}`);
        yPos += this.PAYMENT_HEIGHT;
      });

      // 分隔线
      yPos += 20;
      this.LODOP!.ADD_PRINT_TEXT(yPos, 50, 700, 20, '--------------------------------------------------');
      yPos += 30;

      // 金额统计
      this.LODOP!.ADD_PRINT_TEXT(yPos, 50, 300, 25, `原价总计: ¥${data.totalAmount.toFixed(2)}`);
      this.LODOP!.ADD_PRINT_TEXT(yPos + 30, 50, 300, 25, `实付总计: ¥${data.actualAmount.toFixed(2)}`);
      this.LODOP!.ADD_PRINT_TEXT(yPos + 60, 50, 300, 25, `节省总计: ¥${data.discountAmount.toFixed(2)}`);
      yPos += 90;

      // 系统单号与收银员
      this.LODOP!.ADD_PRINT_TEXT(yPos, 50, 300, 25, `系统单号: ${data.orderCode}`);
      this.LODOP!.ADD_PRINT_TEXT(yPos + 30, 50, 300, 25, `收银员: ${data.userName}`);
      this.LODOP!.ADD_PRINT_TEXT(yPos + 60, 50, 300, 25, `开单时间: ${data.orderTime}`);
      yPos += 90;

      // 顾客签名
      this.LODOP!.ADD_PRINT_TEXT(yPos, 50, 300, 25, '顾客签名: ______________');
      yPos += 40;

      // 感谢语
      this.LODOP!.ADD_PRINT_TEXT(yPos, 0, 800, 25, '恭侯您下次光临');
      this.LODOP!.SET_PRINT_STYLEA(0, 'Align', 2);
      yPos += 30;

      // 服务信息
      this.LODOP!.ADD_PRINT_TEXT(yPos, 50, 300, 25, `服务电话: ${data.servicePhone}`);
      this.LODOP!.ADD_PRINT_TEXT(yPos + 30, 50, 500, 25, `门店地址: ${data.orgAddress}`);
      yPos += 60;

      // 加盟信息
      this.LODOP!.ADD_PRINT_TEXT(yPos, 0, 800, 25, '加盟门店 自主经营');
      this.LODOP!.SET_PRINT_STYLEA(0, 'Align', 2);
    } else {
      // 非最后一页显示续页提示
      this.LODOP!.ADD_PRINT_TEXT(yPos, 0, 800, 25, '(续下页)');
      this.LODOP!.SET_PRINT_STYLEA(0, 'Align', 2);
      this.LODOP!.SET_PRINT_STYLEA(0, 'FontSize', 10);
    }
  }

  /**
   * 打印小票（支持多页）
   */
  printReceipt(data: OrderData, preview = false): void {
    if (!this.LODOP) {
      ElMessage.error('Lodop控件初始化失败');
      return;
    }

    // 计算分页信息
    const itemsPerPage = this.calculateItemsPerPage();
    const totalItems = data.orderDetails.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // 如果只有一页，使用单页打印
    if (totalPages <= 1) {
      this.printSinglePage(data, preview);
      return;
    }

    // 多页打印 - 使用连续打印模式
    this.printMultiPage(data, totalPages, itemsPerPage, preview);
  }

  /**
   * 多页连续打印
   */
  private printMultiPage(data: OrderData, totalPages: number, itemsPerPage: number, preview: boolean): void {
    // 初始化打印任务
    this.LODOP!.PRINT_INITA(0, 0, 800, this.PAGE_HEIGHT, `${data.orgName}消费单`);

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      // 清空上一页内容
      if (pageNum > 1) {
        this.LODOP!.NEWPAGE();
      }

      // 打印当前页
      this.printPageContent(data, pageNum, totalPages, itemsPerPage);
    }

    // 执行打印
    preview ? this.LODOP!.PREVIEW() : this.LODOP!.PRINT();
  }

  /**
   * 单页打印（兼容原始逻辑）
   */
  private printSinglePage(data: OrderData, preview = false): void {
    // 初始化打印区域（80mm宽）
    this.LODOP!.PRINT_INITA(0, 0, 800, this.PAGE_HEIGHT, `${data.orgName}消费单`);

    // 打印页头
    let yPos = this.printHeader(data, 1, 1);

    // 打印所有项目
    yPos = this.printItems(data.orderDetails, 0, data.orderDetails.length, yPos);

    // 打印完整页脚
    this.printFooter(data, true);

    // 执行打印
    preview ? this.LODOP!.PREVIEW() : this.LODOP!.PRINT();
  }

  /**
   * 打印页面内容
   */
  private printPageContent(data: OrderData, pageNum: number, totalPages: number, itemsPerPage: number): void {
    // 打印页头
    let yPos = this.printHeader(data, pageNum, totalPages);

    // 计算当前页项目范围
    const startItemIndex = (pageNum - 1) * itemsPerPage;

    // 打印项目明细
    yPos = this.printItems(data.orderDetails, startItemIndex, itemsPerPage, yPos);

    // 打印页脚（只在最后一页显示完整信息）
    const isLastPage = pageNum === totalPages;
    this.printFooter(data, isLastPage);
  }

  /**
   * 生成多页HTML模板字符串
   */
  private generateMultiPageHtmlTemplate(
    data: OrderData,
    pageNum: number,
    totalPages: number,
    itemsPerPage: number,
  ): string {
    const startIndex = (pageNum - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.orderDetails.length);
    const currentPageItems = data.orderDetails.slice(startIndex, endIndex);

    const detailRows = currentPageItems
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

    const pageInfo =
      totalPages > 1
        ? `<p style="text-align: right; margin: 5px 0; font-size: 10px;">第 ${pageNum} 页/共 ${totalPages} 页</p>`
        : '';
    const continueText =
      pageNum < totalPages ? '<p style="text-align: center; margin: 10px 0; font-size: 12px;">(续下页)</p>' : '';

    const footerSection =
      pageNum === totalPages
        ? `
      <p style="margin: 5px 0; font-size: 12px;">房间编号: ${data.bedName}</p>

      <p style="margin: 10px 0 5px; font-size: 12px; font-weight: bold;">支付明细</p>
      <div style="margin-bottom: 10px;">${paymentItems}</div>
      <hr style="border: none; border-top: 1px dashed #333; margin: 10px 0;">

      <p style="margin: 5px 0; font-size: 12px;">原价总计: ￥${data.totalAmount.toFixed(2)}</p>
      <p style="margin: 5px 0; font-size: 12px;">实付总计: ￥${data.actualAmount.toFixed(2)}</p>
      <p style="margin: 5px 0; font-size: 12px;">节省总计: ￥${data.discountAmount.toFixed(2)}</p>

      <p style="margin: 10px 0 5px; font-size: 12px;">系统单号: ${data.orderCode}</p>
      <p style="margin: 5px 0; font-size: 12px;">收银员: ${data.userName}</p>
      <p style="margin: 5px 0; font-size: 12px;">开单时间: ${data.orderTime}</p>

      <p style="margin: 15px 0 5px; font-size: 12px;">顾客签名: ______________</p>

      <p style="text-align: center; margin: 15px 0 5px; font-size: 12px;">恭侯您下次光临</p>
      <p style="margin: 5px 0; font-size: 12px;">服务电话: ${data.servicePhone}</p>
      <p style="margin: 5px 0; font-size: 12px; word-break: break-all;">门店地址: ${data.orgAddress}</p>
      <p style="text-align: center; margin: 15px 0 0; font-size: 12px;">加盟门店 自主经营</p>
    `
        : '';

    return `
      <div style="width: 80mm; font-family: 'SimHei', 'Microsoft YaHei', Arial; padding: 10px;">
        <h2 style="text-align: center; margin: 0; font-size: 16px; font-weight: bold;">${data.orgName}</h2>
        <p style="text-align: center; margin: 0 0 10px; font-size: 14px;">消费单</p>

        <p style="margin: 5px 0; font-size: 12px;">账务时间: ${data.orderTime}</p>
        <p style="margin: 5px 0; font-size: 12px;">买单时间: ${data.settleTime}</p>
        ${pageInfo}
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
        
        ${continueText}
        ${footerSection}
      </div>
    `;
  }

  /**
   * 生成单页HTML模板字符串
   */
  private generateSinglePageHtmlTemplate(data: OrderData): string {
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
        <h2 style="text-align: center; margin: 0; font-size: 16px; font-weight: bold;">${data.orgName}</h2>
        <p style="text-align: center; margin: 0 0 10px; font-size: 14px;">消费单</p>

        <p style="margin: 5px 0; font-size: 12px;">账务时间: ${data.orderTime}</p>
        <p style="margin: 5px 0; font-size: 12px;">买单时间: ${data.settleTime}</p>
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

        <p style="margin: 5px 0; font-size: 12px;">房间编号: ${data.bedName}</p>

        <p style="margin: 10px 0 5px; font-size: 12px; font-weight: bold;">支付明细</p>
        <div style="margin-bottom: 10px;">${paymentItems}</div>
        <hr style="border: none; border-top: 1px dashed #333; margin: 10px 0;">

        <p style="margin: 5px 0; font-size: 12px;">原价总计: ￥${data.totalAmount.toFixed(2)}</p>
        <p style="margin: 5px 0; font-size: 12px;">实付总计: ￥${data.actualAmount.toFixed(2)}</p>
        <p style="margin: 5px 0; font-size: 12px;">节省总计: ￥${data.discountAmount.toFixed(2)}</p>

        <p style="margin: 10px 0 5px; font-size: 12px;">系统单号: ${data.orderCode}</p>
        <p style="margin: 5px 0; font-size: 12px;">收银员: ${data.userName}</p>
        <p style="margin: 5px 0; font-size: 12px;">开单时间: ${data.orderTime}</p>

        <p style="margin: 15px 0 5px; font-size: 12px;">顾客签名: ______________</p>

        <p style="text-align: center; margin: 15px 0 5px; font-size: 12px;">恭侯您下次光临</p>
        <p style="margin: 5px 0; font-size: 12px;">服务电话: ${data.servicePhone}</p>
        <p style="margin: 5px 0; font-size: 12px; word-break: break-all;">门店地址: ${data.orgAddress}</p>
        <p style="text-align: center; margin: 15px 0 0; font-size: 12px;">加盟门店 自主经营</p>
      </div>
    `;
  }

  /**
   * 生成多页HTML模板字符串
   */
  private generateMultiPageHtmlTemplate(
    data: OrderData,
    pageNum: number,
    totalPages: number,
    itemsPerPage: number,
  ): string {
    const startIndex = (pageNum - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.orderDetails.length);
    const currentPageItems = data.orderDetails.slice(startIndex, endIndex);

    const detailRows = currentPageItems
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

    const pageInfo =
      totalPages > 1
        ? `<p style="text-align: right; margin: 5px 0; font-size: 10px;">第 ${pageNum} 页/共 ${totalPages} 页</p>`
        : '';
    const continueText =
      pageNum < totalPages ? '<p style="text-align: center; margin: 10px 0; font-size: 12px;">(续下页)</p>' : '';

    const footerSection =
      pageNum === totalPages
        ? `
      <p style="margin: 5px 0; font-size: 12px;">房间编号: ${data.bedName}</p>

      <p style="margin: 10px 0 5px; font-size: 12px; font-weight: bold;">支付明细</p>
      <div style="margin-bottom: 10px;">${paymentItems}</div>
      <hr style="border: none; border-top: 1px dashed #333; margin: 10px 0;">

      <p style="margin: 5px 0; font-size: 12px;">原价总计: ￥${data.totalAmount.toFixed(2)}</p>
      <p style="margin: 5px 0; font-size: 12px;">实付总计: ￥${data.actualAmount.toFixed(2)}</p>
      <p style="margin: 5px 0; font-size: 12px;">节省总计: ￥${data.discountAmount.toFixed(2)}</p>

      <p style="margin: 10px 0 5px; font-size: 12px;">系统单号: ${data.orderCode}</p>
      <p style="margin: 5px 0; font-size: 12px;">收银员: ${data.userName}</p>
      <p style="margin: 5px 0; font-size: 12px;">开单时间: ${data.orderTime}</p>

      <p style="margin: 15px 0 5px; font-size: 12px;">顾客签名: ______________</p>

      <p style="text-align: center; margin: 15px 0 5px; font-size: 12px;">恭侯您下次光临</p>
      <p style="margin: 5px 0; font-size: 12px;">服务电话: ${data.servicePhone}</p>
      <p style="margin: 5px 0; font-size: 12px; word-break: break-all;">门店地址: ${data.orgAddress}</p>
      <p style="text-align: center; margin: 15px 0 0; font-size: 12px;">加盟门店 自主经营</p>
    `
        : '';

    return `
      <div style="width: 80mm; font-family: 'SimHei', 'Microsoft YaHei', Arial; padding: 10px;">
        <h2 style="text-align: center; margin: 0; font-size: 16px; font-weight: bold;">${data.orgName}</h2>
        <p style="text-align: center; margin: 0 0 10px; font-size: 14px;">消费单</p>

        <p style="margin: 5px 0; font-size: 12px;">账务时间: ${data.orderTime}</p>
        <p style="margin: 5px 0; font-size: 12px;">买单时间: ${data.settleTime}</p>
        ${pageInfo}
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
        
        ${continueText}
        ${footerSection}
      </div>
    `;
  }

  /**
   * 计算HTML打印每页项目数（基于字符高度估算）
   */
  private calculateHtmlItemsPerPage(): number {
    // HTML模式下每页大约可显示35-40个项目（基于经验值）
    return 35;
  }

  /**
   * 多页HTML打印
   */
  printByHTML(data: OrderData, preview = false): void {
    if (!this.LODOP) {
      ElMessage.error('Lodop控件初始化失败');
      return;
    }

    // 计算分页信息
    const itemsPerPage = this.calculateHtmlItemsPerPage();
    const totalItems = data.orderDetails.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // 如果只有一页，使用单页HTML打印
    if (totalPages <= 1) {
      this.printSinglePageByHTML(data, preview);
      return;
    }

    // 多页HTML打印
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const html = this.generateMultiPageHtmlTemplate(data, pageNum, totalPages, itemsPerPage);
      this.LODOP.PRINT_INITA(0, 0, 800, this.PAGE_HEIGHT, `${data.orgName}消费单 - 第${pageNum}页`);
      this.LODOP.ADD_PRINT_HTML(0, 0, 800, this.PAGE_HEIGHT, html);

      if (preview) {
        this.LODOP.PREVIEW();
      } else {
        this.LODOP.PRINT();
      }
    }
  }

  /**
   * 单页HTML打印
   */
  private printSinglePageByHTML(data: OrderData, preview = false): void {
    const html = this.generateSinglePageHtmlTemplate(data);
    this.LODOP!.PRINT_INITA(0, 0, 800, this.PAGE_HEIGHT, `${data.orgName}消费单`);
    this.LODOP!.ADD_PRINT_HTML(0, 0, 800, this.PAGE_HEIGHT, html);
    preview ? this.LODOP!.PREVIEW() : this.LODOP!.PRINT();
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

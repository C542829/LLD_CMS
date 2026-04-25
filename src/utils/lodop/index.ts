// src/utils/lodop.ts
// @ts-expect-error 忽略js文件检查
import { getLodop } from './LodopFuncs.js';
import { OrderData, RechargeData, Config, PrintType } from './types';
import { calculateOrderPrintHeight, calculateRechargePrintHeight } from './utils';
import { generateOrderHtmlTemplate, generateRechargeHtmlTemplate } from './GenerateTemplate';
import { orderTemplate } from './GenerateLodopTemplate';
import ElMessage from '@/components/Message'; // 若使用Element Plus，可用于提示
import { CustomerType } from '@/enums/index.js';

export class LodopPrinter {
  private LODOP: LODOP | null = null;

  constructor() {
    this.init();
  }

  /** 初始化Lodop控件 */
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
   * 打开打印设计窗口
   */
  printDesign() {
    if (!this.LODOP) {
      ElMessage.error('Lodop控件初始化失败');
      return;
    }

    this.LODOP.PRINT_INIT(new Date().getTime().toString());
    this.LODOP.PRINT_DESIGN();
  }
  /**
   * 打开打印维护窗口
   */
  printSetup() {
    if (!this.LODOP) {
      ElMessage.error('Lodop控件初始化失败');
      return;
    }

    this.LODOP.PRINT_INIT(new Date().getTime().toString());
    this.LODOP.PRINT_SETUP();
  }

  /**
   * 获取打印机列表
   * @returns 打印机列表
   */
  getPrinters(): string[] {
    if (!this.LODOP) return [];
    const count = this.LODOP.GET_PRINTER_COUNT();
    return Array.from({ length: count }, (_, i) => this.LODOP!.GET_PRINTER_NAME(i));
  }

  /** 设置打印机 */
  setPrinter(index: number): void {
    this.LODOP?.SET_PRINTER_INDEX(index);
  }

  /**
   * 获取打印配置（单位：毫米）
   * @param data 数据
   * @param type 1:订单 2:充值单
   * @returns 打印配置
   */
  getPrintConfig(data: OrderData | RechargeData, type: PrintType) {
    const config: Config = {
      width: 58,
      height: 0,
    };

    // 计算打印高度
    if (type === PrintType.ORDER) {
      config.height = calculateOrderPrintHeight(data as OrderData) || 0;
    } else if (type === PrintType.RECHARGE) {
      config.height = calculateRechargePrintHeight(data as RechargeData) || 0;
    }

    return config;
  }

  /**
   * 打印HTML模板
   * @param data 订单数据
   * @param preview 是否预览
   */
  printOrderByHTML(data: OrderData, preview = false): void {
    if (!this.LODOP) {
      ElMessage.error('Lodop控件初始化失败');
      return;
    }

    // 开启预览打印
    // preview = true;

    const isMember = data.customerType === CustomerType.Member;

    // 获取打印配置（单位：毫米）
    const { width, height } = this.getPrintConfig(data, PrintType.ORDER);
    // LODOP的打印页面宽度
    const printWidth = `${width - 10}mm`;
    // LODOP的打印页面高度
    const printHeight = `${isMember ? height : height - 9}mm`;

    console.log('订单打印尺寸：', { printWidth, printHeight });

    // LODOP的打印任务名称
    const taskName = `${data.orderCode}-${data.orgName}消费单`;
    // 初始化打印任务
    this.LODOP.PRINT_INIT(taskName);
    // 设置打印页面大小
    this.LODOP.SET_PRINT_PAGESIZE(0, printWidth, printHeight);
    // 按纸张定位，而非屏幕
    this.LODOP.SET_PRINT_MODE('POS_BASEON_PAPER', 1);
    // 关闭自动缩放，强制1:1打印
    this.LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', 100);

    // 生成HTML模板
    const html = generateOrderHtmlTemplate(data, printWidth);
    // 添加HTML模板
    this.LODOP.ADD_PRINT_HTM(0, 0, printWidth, printHeight, html);
    // 执行打印或预览
    preview ? this.LODOP.PREVIEW() : this.LODOP.PRINT();
  }

  /**
   * 打印HTML模板
   * @param data 充值数据
   * @param preview 是否预览
   */
  printRechargeByHTML(data: RechargeData, preview = false): void {
    if (!this.LODOP) {
      ElMessage.error('Lodop控件初始化失败');
      return;
    }

    // 开启预览打印
    // preview = true;

    // 获取打印配置（单位：毫米）
    const { width, height } = this.getPrintConfig(data, PrintType.RECHARGE);
    // LODOP的打印页面宽度
    const printWidth = `${width - 10}mm`;
    // LODOP的打印页面高度
    const printHeight = `${height}mm`;

    // 打印任务名称
    const taskName = `${data.historyCode}-${data.orgName}充值单`;
    // 初始化打印任务
    this.LODOP.PRINT_INIT(taskName);
    // 设置打印页面大小
    this.LODOP.SET_PRINT_PAGESIZE(0, printWidth, printHeight);
    // 按纸张定位，而非屏幕
    this.LODOP.SET_PRINT_MODE('POS_BASEON_PAPER', 1);
    // 关闭自动缩放，强制1:1打印
    this.LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', 100);

    // 生成HTML模板
    const html = generateRechargeHtmlTemplate(data, printWidth);
    // 添加HTML模板
    this.LODOP.ADD_PRINT_HTM(0, 0, printWidth, printHeight, html);
    // 执行打印或预览
    preview ? this.LODOP.PREVIEW() : this.LODOP.PRINT();
  }

  /**
   * 打印订单（基于Lodop ADD_PRINT_TEXT() 方法）
   * @param data 订单数据
   * @param preview 是否预览
   */
  printReceipt(data: OrderData, preview = false): void {
    if (!this.LODOP) {
      ElMessage.error('Lodop控件初始化失败');
      return;
    }

    // 获取打印配置（单位：毫米）
    const config = this.getPrintConfig(data, PrintType.ORDER);
    console.log('打印配置:', config);

    // 生成订单打印模板
    orderTemplate(this.LODOP, data, config);
    // 执行打印或预览
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
}

export const printer = new LodopPrinter();

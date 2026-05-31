// src/utils/lodop.ts
// @ts-expect-error 忽略js文件检查
import { getLodop, retryLoadCLodop } from './LodopFuncs.js';
import { OrderData, RechargeData, Config, PrintType } from './types';
import { calculateOrderPrintHeight, calculateRechargePrintHeight } from './utils';
import { generateOrderHtmlTemplate, generateRechargeHtmlTemplate } from './GenerateTemplate';
import { orderTemplate } from './GenerateLodopTemplate';
import ElMessage from '@/components/Message'; // 若使用Element Plus，可用于提示
import { CustomerType } from '@/enums/index.js';

export class LodopPrinter {
  private LODOP: LODOP | null = null;
  private retryCount = 0;
  private readonly maxRetries = 3;

  constructor() {
    this.init();
  }

  /** 初始化Lodop控件，带重试上限和指数退避 */
  private init(): void {
    this.LODOP = getLodop();
    if (!this.LODOP) {
      this.scheduleRetry();
    }
  }

  private scheduleRetry(): void {
    if (this.retryCount >= this.maxRetries) {
      return;
    }
    const delay = 500 * Math.pow(2, this.retryCount); // 500ms, 1s, 2s
    this.retryCount++;
    setTimeout(() => {
      this.LODOP = getLodop();
      if (!this.LODOP) {
        this.scheduleRetry();
      }
    }, delay);
  }

  /** 是否初始化失败 */
  isFailed(): boolean {
    return !this.LODOP && this.retryCount >= this.maxRetries;
  }

  /** 重置打印服务（手动重试） */
  reset(): void {
    this.retryCount = 0;
    this.LODOP = null;
    this.init();
  }

  /** 尝试重新连接 Lodop，返回是否成功 */
  async reconnect(): Promise<boolean> {
    this.LODOP = getLodop();
    if (this.LODOP) return true;

    // 重新触发 WebSocket 连接，加载 CLodop 脚本
    retryLoadCLodop();

    // 等待 WebSocket 连接建立并重试
    for (let i = 0; i < this.maxRetries; i++) {
      await new Promise((r) => setTimeout(r, 500 * Math.pow(2, i)));
      this.LODOP = getLodop();
      if (this.LODOP) return true;
    }
    return false;
  }

  /** 已连接则直接执行回调，否则先重连再执行 */
  private async withLodop(cb: (LODOP: LODOP) => void): Promise<void> {
    if (!this.LODOP && !(await this.reconnect())) {
      ElMessage.error('Lodop打印控件未安装或未启动，请检查CLodop服务');
      return;
    }
    await this.callWithRetry(cb);
  }

  /** 执行 LODOP 操作，捕获 WebSocket 未就绪错误后自动重试 */
  private async callWithRetry(cb: (LODOP: LODOP) => void, retries = 2): Promise<void> {
    try {
      cb(this.LODOP!);
    } catch (e: any) {
      const msg = String(e?.message ?? e);
      if (retries > 0 && /WebSocket/i.test(msg)) {
        await new Promise((r) => setTimeout(r, 1000));
        await this.callWithRetry(cb, retries - 1);
      } else {
        throw e;
      }
    }
  }

  /**
   * 打开打印设计窗口
   */
  async printDesign() {
    await this.withLodop((LODOP) => {
      LODOP.PRINT_INIT(new Date().getTime().toString());
      LODOP.PRINT_DESIGN();
    });
  }
  /**
   * 打开打印维护窗口
   */
  async printSetup() {
    await this.withLodop((LODOP) => {
      LODOP.PRINT_INIT(new Date().getTime().toString());
      LODOP.PRINT_SETUP();
    });
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
  async printOrderByHTML(data: OrderData, preview = false): Promise<void> {
    if (!this.LODOP && !(await this.reconnect())) {
      ElMessage.error('Lodop打印控件未安装或未启动，请检查CLodop服务');
      return;
    }

    const isMember = data.customerType === CustomerType.Member;
    const { width, height } = this.getPrintConfig(data, PrintType.ORDER);
    const printWidth = `${width - 10}mm`;
    const printHeight = `${isMember ? height : height - 9}mm`;

    console.log('订单打印尺寸：', { printWidth, printHeight });

    const taskName = `${data.orderCode}-${data.orgName}消费单`;
    const html = generateOrderHtmlTemplate(data, printWidth);

    await this.callWithRetry((LODOP) => {
      LODOP.PRINT_INIT(taskName);
      LODOP.SET_PRINT_PAGESIZE(0, printWidth, printHeight);
      LODOP.SET_PRINT_MODE('POS_BASEON_PAPER', 1);
      LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', 100);
      LODOP.ADD_PRINT_HTM(0, 0, printWidth, printHeight, html);
      preview ? LODOP.PREVIEW() : LODOP.PRINT();
    });
  }

  /**
   * 打印HTML模板
   * @param data 充值数据
   * @param preview 是否预览
   */
  async printRechargeByHTML(data: RechargeData, preview = false): Promise<void> {
    if (!this.LODOP && !(await this.reconnect())) {
      ElMessage.error('Lodop打印控件未安装或未启动，请检查CLodop服务');
      return;
    }

    const { width, height } = this.getPrintConfig(data, PrintType.RECHARGE);
    const printWidth = `${width - 10}mm`;
    const printHeight = `${height}mm`;
    const taskName = `${data.historyCode}-${data.orgName}充值单`;
    const html = generateRechargeHtmlTemplate(data, printWidth);

    await this.callWithRetry((LODOP) => {
      LODOP.PRINT_INIT(taskName);
      LODOP.SET_PRINT_PAGESIZE(0, printWidth, printHeight);
      LODOP.SET_PRINT_MODE('POS_BASEON_PAPER', 1);
      LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', 100);
      LODOP.ADD_PRINT_HTM(0, 0, printWidth, printHeight, html);
      preview ? LODOP.PREVIEW() : LODOP.PRINT();
    });
  }

  /**
   * 打印订单（基于Lodop ADD_PRINT_TEXT() 方法）
   * @param data 订单数据
   * @param preview 是否预览
   */
  async printReceipt(data: OrderData, preview = false): Promise<void> {
    if (!this.LODOP && !(await this.reconnect())) {
      ElMessage.error('Lodop打印控件未安装或未启动，请检查CLodop服务');
      return;
    }

    const config = this.getPrintConfig(data, PrintType.ORDER);
    console.log('打印配置:', config);

    await this.callWithRetry((LODOP) => {
      orderTemplate(LODOP, data, config);
      preview ? LODOP.PREVIEW() : LODOP.PRINT();
    });
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

let _printer: LodopPrinter | null = null;

/** 获取 LodopPrinter 单例（懒加载，首次调用时才初始化，失败后允许重建） */
export function getPrinter(): LodopPrinter {
  if (!_printer || _printer.isFailed()) {
    _printer = new LodopPrinter();
  }
  return _printer;
}

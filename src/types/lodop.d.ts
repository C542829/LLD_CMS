// src/types/lodop.d.ts
declare global {
  interface Window {
    CLODOP?: LodopObject;
    getCLodop: () => LodopObject | null;
  }

  /** Lodop 核心对象类型 */
  interface LodopObject {
    // 初始化打印页
    PRINT_INITA: (x1: number, y1: number, width: number, height: number, title: string) => void;
    // 添加文本
    ADD_PRINT_TEXT: (x: number, y: number, width: number, height: number, text: string) => void;
    // 设置打印样式
    SET_PRINT_STYLEA: (index: number, styleName: string, value: number | string) => void;
    // 打印（直接打印）
    PRINT: () => void;
    // 打印预览
    PREVIEW: () => void;
    // 获取打印机数量
    GET_PRINTER_COUNT: () => number;
    // 获取打印机名称
    GET_PRINTER_NAME: (index: number) => string;
    // 设置打印机（通过索引）
    SET_PRINTER_INDEX: (index: number) => void;
    // 打印HTML模板
    ADD_PRINT_HTML: (x: number, y: number, width: number, height: number, html: string) => void;
  }
}

export {};

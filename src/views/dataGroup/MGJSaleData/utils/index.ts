import { MgjSaleDataParsed, MgjSaleDataVO, SaleDataCard, SaleDataCash, SaleDataItem } from './types';

export enum StoreId {
  MGJ_1 = 1594232,
  MGJ_2 = 1599512,
  MGJ_3 = 1646391,
  MGJ_5 = 1029151,
  MGJ_7 = 1700433,
}

export const StoreMap: Record<number, string> = {
  [StoreId.MGJ_1]: '锦艺城1店',
  [StoreId.MGJ_2]: '锦艺城2店',
  [StoreId.MGJ_3]: '须水3店',
  [StoreId.MGJ_5]: '广电路5店',
  [StoreId.MGJ_7]: '富田太阳城7店',
};

export const StoreOptions = [
  { value: StoreId.MGJ_1, label: StoreMap[StoreId.MGJ_1] },
  { value: StoreId.MGJ_2, label: StoreMap[StoreId.MGJ_2] },
  { value: StoreId.MGJ_3, label: StoreMap[StoreId.MGJ_3] },
  { value: StoreId.MGJ_5, label: StoreMap[StoreId.MGJ_5] },
  { value: StoreId.MGJ_7, label: StoreMap[StoreId.MGJ_7] },
];

/**
 * MGJ 销售数据模块类型定义
 */

// ==================== 枚举映射 ====================

/** 账单类型映射 */
export const BILL_TYPE_MAP: Record<number, string> = {
  0: '消费',
  1: '充值',
  2: '退款',
};

/** 账单类型下拉选项 */
export const BILL_TYPE_OPTIONS: OptionItem[] = [
  { value: 0, label: '消费' },
  { value: 1, label: '充值' },
  { value: 2, label: '退款' },
];

/** 是否会员 0=散客，1=会员，不传=全部 */
export const MEMBER_TYPE_OPTIONS: OptionItem[] = [
  { value: '', label: '全部' },
  { value: 0, label: '散客' },
  { value: 1, label: '会员' },
];

/** 账单状态映射 */
export const BILL_STATUS_MAP: Record<number, string> = {
  0: '已完成',
  1: '已取消',
};

/** 账单状态下拉选项 */
export const BILL_STATUS_OPTIONS: OptionItem[] = [
  { value: 0, label: '已完成' },
  { value: 1, label: '已取消' },
];

/** 性别映射 */
export const SEX_MAP: Record<string, string> = {
  M: '男',
  F: '女',
};

/** 消费类型映射 */
export const CONSUME_TYPE_MAP: Record<number, string> = {
  0: '服务',
  1: '产品',
  3: '套餐',
  4: '疗程',
  5: '会员卡',
  [-1]: '其他',
};

/** 消费项目类型映射 */
export const ITEM_TYPE_MAP: Record<number, string> = {
  0: '服务',
  3: '套餐',
  4: '疗程',
};

// ==================== 工具函数 ====================

/**
 * 解析 MgjSaleDataVO 中的 JSON 字段
 * @param vo 原始 VO 数据
 * @returns 解析后的数据
 */
export function parseSaleDataVO(vo: MgjSaleDataVO): MgjSaleDataParsed {
  return {
    ...vo,
    cards: safeJsonParse<SaleDataCard[]>(vo.cards, []),
    cashs: safeJsonParse<SaleDataCash[]>(vo.cashs, []),
    items: safeJsonParse<SaleDataItem[]>(vo.items, []),
  };
}

/**
 * 安全解析 JSON 字符串
 * @param jsonStr JSON 字符串
 * @param fallback 解析失败时的默认值
 * @returns 解析结果
 */
function safeJsonParse<T>(jsonStr: string | null | undefined, fallback: T): T {
  if (!jsonStr) return fallback;
  try {
    return JSON.parse(jsonStr) as T;
  } catch {
    return fallback;
  }
}

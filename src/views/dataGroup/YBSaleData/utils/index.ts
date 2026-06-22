/**
 * 杨波销售数据模块枚举映射和工具函数
 */

import type { YbSaleDataVO, YbSaleDataParsed, YbSaleDataDetail } from './types';

// ==================== 枚举映射 ====================

/** 会员等级映射 */
export const MEMBER_LEVEL_MAP: Record<string, string> = {
  N: '普通会员',
  S: '白银会员',
  G: '黄金会员',
  P: '铂金会员',
  D: '钻石会员',
};

/** 会员等级 Tag 类型映射 */
export const MEMBER_LEVEL_TAG_TYPE: Record<string, string> = {
  N: 'info',
  S: '',
  G: 'warning',
  P: 'danger',
  D: 'danger',
};

/** 产品类型映射 */
export const PRODUCT_TYPE_MAP: Record<number, string> = {
  69: '项目',
  71: '产品',
  73: '耗材',
  75: '疗程券',
  77: '其他',
};

/** 产品类型下拉选项 */
export const PRODUCT_TYPE_OPTIONS: OptionItem[] = [
  { value: 69, label: '项目' },
  { value: 71, label: '产品' },
  { value: 73, label: '耗材' },
  { value: 75, label: '疗程券' },
  { value: 77, label: '其他' },
];

/** 服务(上钟)类型映射 */
export const SERVICE_TYPE_MAP: Record<number, string> = {
  89: '轮牌',
  91: '点工',
  92: '加钟',
};

/** 服务类型下拉选项 */
export const SERVICE_TYPE_OPTIONS: OptionItem[] = [
  { value: 89, label: '轮牌' },
  { value: 91, label: '点工' },
  { value: 92, label: '加钟' },
];

/** 财务支付类型映射 */
export const FIN_PAY_TYPE_MAP: Record<number, string> = {
  1: '现金',
  2: '会员卡',
};

/** 是否在线支付映射 */
export const ONLINE_PAY_MAP: Record<number, string> = {
  0: '否',
  1: '是',
};

/** 是否转账映射 */
export const TRAN_FIN_MAP: Record<number, string> = {
  0: '否',
  1: '是',
};

// ==================== 门店配置 ====================

export const STORE_MAP: Record<number, string> = {
  1459: '锦绣4店',
  197: '升龙6店',
  2219: '冉屯8店',
};

/** 门店选项 */
export const STORE_OPTIONS: OptionItem[] = [
  { value: 1459, label: '锦绣4店' },
  { value: 197, label: '升龙6店' },
  { value: 2219, label: '冉屯8店' },
];

// ==================== 支付方式汇总 ====================

/** 支付方式字段列表 */
export const PAY_FIELDS = [
  { key: 'cashPay', label: '现金' },
  { key: 'memberCardPay', label: '会员卡' },
  { key: 'bankCardPay', label: '银行卡' },
  { key: 'wechatPay', label: '微信' },
  { key: 'aliPay', label: '支付宝' },
  { key: 'couponsPay', label: '电子券' },
  { key: 'entityCouponPay', label: '实体券' },
  { key: 'meiTuanPay', label: '美团' },
  { key: 'kouBeiPay', label: '口碑' },
  { key: 'douYinPay', label: '抖音' },
  { key: 'lianLianPay', label: '连连' },
  { key: 'otherPay', label: '其他' },
] as const;

// ==================== 工具函数 ====================

/**
 * 安全解析 JSON 字符串
 */
function safeJsonParse<T>(jsonStr: string | null | undefined, fallback: T): T {
  if (!jsonStr) return fallback;
  try {
    return JSON.parse(jsonStr) as T;
  } catch {
    return fallback;
  }
}

/**
 * 将 API 原始 VO 解析为可用的 Parsed 类型
 * details 字段为 JSON 字符串，需解析为数组
 */
export function parseSaleDataVO(vo: YbSaleDataVO): YbSaleDataParsed {
  return {
    ...vo,
    details: safeJsonParse<YbSaleDataDetail[]>(vo.details, []),
  };
}

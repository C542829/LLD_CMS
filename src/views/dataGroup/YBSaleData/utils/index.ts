/**
 * 杨波销售数据模块枚举映射和工具函数
 */

// ==================== 枚举映射 ====================

/** 订单状态映射 */
export const ORDER_STATUS_MAP: Record<number, string> = {
  37: '已开单',
  39: '已结账',
  41: '已取消',
  43: '已挂账(签单)',
  45: '已挂单',
  46: '已冲正',
};

/** 订单状态下拉选项 */
export const ORDER_STATUS_OPTIONS: OptionItem[] = [
  { value: 37, label: '已开单' },
  { value: 39, label: '已结账' },
  { value: 41, label: '已取消' },
  { value: 43, label: '已挂账(签单)' },
  { value: 45, label: '已挂单' },
  { value: 46, label: '已冲正' },
];

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

/**
 * 获取订单状态 Tag 类型
 */
export function getOrderStatusTagType(status: number): string {
  switch (status) {
    case 39:
      return 'success';
    case 41:
    case 46:
      return 'danger';
    case 43:
    case 45:
      return 'warning';
    default:
      return 'info';
  }
}

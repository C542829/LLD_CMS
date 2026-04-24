// ==================== JSON 子类型定义 ====================

/** 消费项目 - 技师信息 */
export interface SaleDataItemEmp {
  /** 技师ID */
  empid: number;
  /** 账单ID */
  billid: number;
  /** 技师姓名 */
  empName: string;
  /** 明细ID */
  detailid: number;
  /** 是否自动分配 */
  automatic: number;
  /** 是否展示 */
  mgjshowinmyk: number;
}

/** 消费项目明细 */
export interface SaleDataItem {
  /** 项目ID */
  itemId: string;
  /** 消费类型 */
  consumetype: number;
  /** 项目名称 */
  serviceItemName: string;
  /** 技师列表 */
  emps: SaleDataItemEmp[];
  /** 单价 */
  price: string;
  /** 赠送 */
  largess: string | null;
  /** 数量 */
  num: number;
  /** 疗程项目ID */
  treatmentItemId: string | null;
  /** 明细ID */
  id: number;
  /** 类型 0-服务 3-套餐 4-疗程 */
  type: number;
  /** 消费类型 */
  consumeType: number;
}

/** 现金支付明细 */
export interface SaleDataCash {
  /** 现金 */
  cash: number;
  /** 微信 */
  weixin: number;
  /** 点评 */
  dianpin: number;
  /** 银联 */
  unionPay: number;
  /** 优惠券 */
  coupon: number;
  /** 红包 */
  luckymoney: number;
  /** 支付金额 */
  pay: number;
  /** 消费时间 */
  consumeTime: string;
  /** 支付类型 */
  type: number;
  /** 状态 */
  status: number;
  /** 账单ID */
  billId: number;
  /** 门店ID */
  shopId: number;
  /** 积分 */
  pointfee: number;
}

/** 会员卡支付明细 */
export interface SaleDataCard {
  /** 卡金支付 */
  cardFee: number;
  /** 疗程支付 */
  treatFee: number;
  /** 赠送支付 */
  presentFee: number;
  /** 卡类型ID */
  cardTypeId: string;
  /** 卡类型 */
  cardType: string;
  /** 会员卡ID */
  memCardId: number;
  /** 会员ID */
  memberId: number;
  /** 消费时间 */
  consumeTime: string;
  /** 消费类型 */
  consumeType: number;
  /** 类型 */
  type: number;
  /** 状态 */
  status: number;
  /** 账单ID */
  billId: number;
  /** 门店ID */
  shopId: number;
}

// ==================== 查询参数 ====================

/**
 * MGJ 销售数据查询参数
 */
export interface MgjSaleDataQuery {
  /** 账单状态 */
  billstatus?: number;
  /** 消费类型 */
  consumeType?: number;
  /** 结束时间（格式：YYYY-MM-DD HH:mm:ss，左闭右开区间） */
  endTime?: string;
  /** 会员ID */
  memberId?: number | string;
  /** 是否为会员 */
  isVip?: number | string;
  /** 客户姓名 */
  name?: string;
  /** 页码 */
  pageNum?: number;
  /** 每页大小 */
  pageSize?: number;
  /** 开始时间（格式：YYYY-MM-DD HH:mm:ss，左闭右开区间） */
  startTime?: string;
  /** 门店ID */
  storeId?: number | string;
}

// ==================== 响应数据 ====================

/**
 * MGJ 销售数据 VO
 * 注意：cards、cashs、items 字段后端返回 JSON 字符串，需前端解析
 */
export interface MgjSaleDataVO {
  /** 账单号 */
  billno: string;
  /** 账单状态 */
  billstatus: number;
  /** 账单类型 */
  billtype: number;
  /** 卡消费明细(JSON字符串，需解析为 SaleDataCard[]) */
  cards: string;
  /** 卡类型 */
  cardType: number;
  /** 支付明细(JSON字符串，需解析为 SaleDataCash[]) */
  cashs: string;
  /** 渠道 */
  channel: string;
  /** 备注 */
  comment: string;
  /** 消费金额 */
  consumefee: string;
  /** 消费门店名称 */
  consumeshopname: string;
  /** 消费类型 */
  consumeType: number;
  /** 创建时间（时间戳毫秒） */
  createDate: string;
  /** 客户ID */
  custId: number;
  /** EA金额（实收金额） */
  eafee: string;
  /** 消费金额(支出) */
  expense: string;
  /** 消费分类 */
  expenseCategory: number;
  /** 评价内容 */
  feedbackComment: string;
  /** 主键ID */
  id: number;
  /** 服务项目(JSON字符串，需解析为 SaleDataItem[]) */
  items: string;
  /** 会员ID */
  memberId: number;
  /** 客户姓名 */
  name: string;
  /** 总评分 */
  overallScore: number;
  /** 剩余金额 */
  remainFee: string;
  /** 性别 */
  sex: string;
  /** 门店ID */
  storeId: number;
}

/**
 * 解析后的销售数据（将 JSON 字符串解析为数组）
 */
export interface MgjSaleDataParsed extends Omit<MgjSaleDataVO, 'cards' | 'cashs' | 'items'> {
  /** 卡消费明细（解析后） */
  cards: SaleDataCard[];
  /** 支付明细（解析后） */
  cashs: SaleDataCash[];
  /** 消费项目（解析后） */
  items: SaleDataItem[];
}

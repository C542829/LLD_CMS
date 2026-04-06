export interface ConsumeBillItemEmp {
  empid: number;
  billid: number;
  empName: string;
  detailid: number;
  automatic: number;
  mgjshowinmyk: number;
}

export interface ConsumeBillItem {
  itemId: string;
  consumetype: number;
  serviceItemName: string;
  emps: ConsumeBillItemEmp[];
  price: string;
  largess: string | null;
  num: number;
  treatmentItemId: number | null;
  id: number;
  type: number;
  consumeType: number;
}

export interface ConsumeBillCash {
  mdFee: number;
  dianpin: number;
  unionPay: number;
  type: number;
  voucherFee: number;
  otherfee6: number;
  otherfee7: number;
  otherfee8: number;
  tableName: string | null;
  otherfee9: number;
  debtFee: number;
  luckymoney: number;
  id: number;
  shopId: number;
  cash: number;
  depcode: string;
  mallOrderFee: number;
  payedUnionPay: number;
  consumeType: number;
  cooperation: number;
  payedAliPay: number;
  consumeTime: string;
  coupon: number;
  mall: number;
  jdFee: number;
  pay: number;
  otherfee10: number;
  payedWechatPay: number;
  otherfee2: number;
  otherfee3: number;
  otherfee4: number;
  weixin: number;
  otherfee5: number;
  cancelTime: string | null;
  billId: number;
  otherfee1: number;
  billDetailId: string | null;
  pointfee: number;
  status: number;
}

export interface ConsumeBillCard {
  type: number;
  tableName: string | null;
  cardFee: number;
  onlineCredit: number;
  offlineCredit: number;
  treatPresentFee: number;
  id: number;
  shopId: number;
  cardTypeId: string;
  depcode: string;
  consumeType: number;
  divideFee: number;
  offlineCreditPay: number;
  memberId: number;
  consumeTime: string;
  otherFlag: number;
  memCardId: number;
  onlineCreditPay: number;
  cardType: string;
  presentFee: number;
  cancelTime: string | null;
  billId: number;
  treatFee: number;
  billDetailId: string | null;
  yearFee: number;
  status: number;
}

export interface ConsumeBill {
  id: number;
  cashs: ConsumeBillCash[];
  cards: ConsumeBillCard[];
  channel: string | null;
  jsonStr: string;
  clientflag: string;
  feedbackComment: string | null;
  billtype: number;
  eafee: string;
  custId: number;
  lotteryStatus: number | null;
  feedbackDT: string | null;
  consumefee: string;
  consumeshopname: string | null;
  consumeType: number;
  mgjIsHighQualityCust: string;
  createDate: number;
  memberId: number;
  remainFee: string | null;
  addOverallScore: number | null;
  billstatus: number;
  debtBillId: string;
  expenseCategory: number;
  overallScore: number;
  sex: string;
  cardType: number;
  settlementChannel: string | null;
  expense: string;
  storeId: number;
  lotteryType: number | null;
  otherflag: number;
  name: string;
  comment: string | null;
  addFeedbackComment: string | null;
  auditingFlag: number;
  items: ConsumeBillItem[];
  billno: string;
  freezeType: number;
  billingChannel: string | null;
}

export interface ConsumeBillQuery {
  pageNum: number;
  pageSize: number;
  startTime?: string;
  endTime?: string;
  billno?: string;
  name?: string;
  memberId?: number;
  billtype?: number;
  billstatus?: number;
}

export interface ConsumeBillListResponse {
  total: number;
  rows: ConsumeBill[];
}

export const BILL_TYPE_OPTIONS = [
  { value: 0, label: '消费' },
  { value: 1, label: '充值' },
  { value: 2, label: '办卡' },
  { value: 3, label: '套餐' },
  { value: 4, label: '疗程' },
];

export const BILL_STATUS_OPTIONS = [
  { value: 0, label: '正常' },
  { value: 1, label: '已取消' },
  { value: 2, label: '已冲正' },
];

export const BILL_TYPE_MAP: Record<number, string> = {
  0: '消费',
  1: '充值',
  2: '办卡',
  3: '套餐',
  4: '疗程',
};

export const BILL_STATUS_MAP: Record<number, string> = {
  0: '正常',
  1: '已取消',
  2: '已冲正',
};

export const SEX_MAP: Record<string, string> = {
  M: '男',
  F: '女',
};

export const CASH_TYPE_MAP: Record<number, string> = {
  1: '现金',
  2: '银行卡',
  3: '微信',
  4: '支付宝',
  5: '会员卡',
};

export const CARD_TYPE_MAP: Record<number, string> = {
  1: '储值卡',
  2: '疗程卡',
  3: '次卡',
  4: '折扣卡',
  5: '套餐卡',
};

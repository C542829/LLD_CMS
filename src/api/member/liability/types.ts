/** 负债统计查询参数 */
export interface LiabilityQuery {
  /** 门店 ID 列表（支持多选）。不传则查询当前登录用户关联的所有门店 */
  orgIds?: number[];
}

/** 负债统计响应 */
export interface LiabilityVO {
  /** 总负债 = cardTotal + ticketTotal */
  totalLiability: number;
  /** 会员卡总计 = rechargeTotal + presentTotal */
  cardTotal: number;
  /** 充值金小计（assetType=0 的余额汇总） */
  rechargeTotal: number;
  /** 赠送金小计（assetType=1 的余额汇总） */
  presentTotal: number;
  /** 次卡总计 = consumerTicketTotal + itemTicketTotal + productTicketTotal */
  ticketTotal: number;
  /** 代金券小计（ticketType=0 的金额汇总） */
  consumerTicketTotal: number;
  /** 体验券小计（ticketType=1 的金额汇总） */
  itemTicketTotal: number;
  /** 产品券小计（ticketType=2 的金额汇总） */
  productTicketTotal: number;
}

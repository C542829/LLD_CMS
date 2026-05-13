/** 套餐明细DTO */
export interface PackageDetailDTO {
  /** 套餐明细名称 */
  packageDetailName: string;
  /** 套餐明细使用物品数量 */
  packageToolNumber: number;
  /** 套餐ID */
  packageId?: number;
}

/** 套餐查询参数 */
export interface PackageQueryParams {
  /** 套餐名称 */
  packageName?: string;
  /** 套餐编码 */
  packageEncode?: string;
}

/** 套餐列表VO */
export interface PackageListVO {
  /** 套餐ID */
  id?: number;
  /** 套餐名称 */
  packageName?: string;
  /** 套餐编码 */
  packageEncode?: string;
  /** 散客价 */
  packagePrice?: number;
  /** 会员价 */
  packagePriceVip?: number;
  /** 套餐状态（0 启用，1 禁用） */
  packageStatus?: number;
  /** 套餐项目信息 */
  packageDetailDTOList?: PackageDetailDTO[];
  [property: string]: any;
}

/** 套餐详情VO */
export interface PackageInfoVO {
  /** 套餐ID */
  id?: number;
  /** 创建时间 */
  createTime?: string;
  /** 更新时间 */
  updateTime?: string;
  /** 删除状态(0 存在，1 删除) */
  isDelete?: number;
  /** 备注 */
  remark?: string;
  /** 套餐名称 */
  packageName: string;
  /** 套餐编码 */
  packageEncode: string;
  /** 散客价 */
  packagePrice?: number;
  /** 会员价 */
  packagePriceVip?: number;
  /** 套餐项目信息 */
  packageDetailDTOList?: PackageDetailDTO[];
}

/** 套餐创建/更新DTO */
export interface PackageInfoDTO {
  /** 套餐ID（更新时必填） */
  id?: number;
  /** 备注 */
  remark?: string;
  /** 套餐名称 */
  packageName: string;
  /** 套餐编码 */
  packageEncode: string;
  /** 散客价 */
  packagePrice?: number;
  /** 会员价 */
  packagePriceVip?: number;
  /** 套餐项目信息 */
  packageDetailDTOList?: PackageDetailDTO[];
}

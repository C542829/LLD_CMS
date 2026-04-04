/**
 * org.haut.common.domain.vo.system.DictTypeVO
 */
export interface DictTypeVO {
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 字典编码
   */
  dictCode?: string;
  /**
   * 字典项列表
   */
  dictItems?: DictItemVO[];
  /**
   * 字典名称
   */
  dictName?: string;
  /**
   * 主键
   * 字典类型ID
   */
  dictTypeId?: number;
  /**
   * 删除状态(0 存在，1 删除)
   */
  isDelete?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 排序权重
   */
  sort?: number;
  /**
   * 更新时间
   */
  updateTime?: string;
  [property: string]: any;
}

/**
 * org.haut.common.domain.vo.system.DictItemVO
 */
export interface DictItemVO {
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 关联字典编码
   */
  dictCode?: string;
  /**
   * 主键
   * 字典项ID
   */
  dictItemId?: number;
  /**
   * 删除状态(0 存在，1 删除)
   */
  isDelete?: number;
  /**
   * 字典项标签
   */
  itemLabel?: string;
  /**
   * 字典项内容
   */
  itemValue?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 排序权重
   */
  sort?: number;
  /**
   * 更新时间
   */
  updateTime?: string;
  [property: string]: any;
}

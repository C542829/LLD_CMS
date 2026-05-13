/** 房间查询参数 */
export interface RoomQueryParams {
  /** 房间名称 */
  roomName?: string;
}

/** 房间VO */
export interface RoomInfoVO {
  /** 主键 */
  id?: number;
  /** 备注 */
  remark?: string;
  /** 房间名 */
  roomName?: string;
  /** 房间床位总数 */
  bedCount?: number;
  /** 房间空闲床位数 */
  freeBedCount?: number;
  /** 组织ID */
  orgId?: number;
}

/** 房间创建DTO */
export interface RoomCreateDTO {
  /** 房间名称 */
  roomName: string;
  /** 备注 */
  remark?: string;
}

/** 房间更新DTO */
export interface RoomUpdateDTO {
  /** 房间ID */
  id: number;
  /** 房间名称 */
  roomName: string;
  /** 备注 */
  remark?: string;
}

/** 床位查询参数 */
export interface BedQueryParams {
  /** 房间ID */
  roomId: number;
}

/** 床位VO */
export interface RoomBedVO {
  /** 主键 */
  id?: number;
  /** 创建时间 */
  createTime?: string;
  /** 更新时间 */
  updateTime?: string;
  /** 删除状态(0 存在，1 删除) */
  isDelete?: number;
  /** 备注 */
  remark?: string;
  /** 床位名称 */
  bedName?: string;
  /** 房间ID */
  roomInfoId?: number;
  /** 床位状态（0 空闲中，1 服务中，2 暂停使用） */
  status?: number;
  /** 组织ID */
  orgId?: number;
}

/** 床位创建DTO */
export interface BedCreateDTO {
  /** 床位名称 */
  bedName: string;
  /** 房间ID */
  roomId: number;
  /** 备注 */
  remark?: string;
}

/** 更新床位名称DTO */
export interface UpdateBedNameDTO {
  /** 床位名称 */
  bedName: string;
  /** 房间ID */
  roomId: number;
}

/** 更新床位状态DTO */
export interface UpdateBedStatusDTO {
  /** 床位ID */
  bedId: number;
  /** 状态 */
  status: number;
}

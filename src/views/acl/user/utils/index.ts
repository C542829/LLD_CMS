import { reqEnumItemList } from '@/api/enums';
import { RoleCode } from '@/enums';
import { formatDate } from '@/utils/time';

export const DEFAULT_SEARCH_PARAMS = {
  roleId: '',
  userName: '',
  userStatus: '在职',
  userNumber: '',
  pageNum: 1,
  pageSize: 30,
  orgIds: [],
};

export const DEFAULT_FORMDATA = {
  id: null,
  userCode: '',
  userPassword: '123456',
  userName: '',
  userNumber: '',
  userPosition: '',
  userSex: 0,
  userBirthday: '',
  userDept: '',
  userEntryDate: formatDate(new Date()),
  userStatus: '在职',
  userIdCard: '',
  userAddress: '',
  userMarry: '未知',
  userEdu: '未知',
  userHealth: '',
  roleId: null,
  orgId: undefined,
  orgIds: [],
};

export const RoleCodeFilterMap = {
  [RoleCode.SuperAdmin]: [],
  [RoleCode.Admin]: [RoleCode.SuperAdmin],
  [RoleCode.AreaManager]: [RoleCode.Admin, RoleCode.SuperAdmin],
  [RoleCode.StoreManager]: [RoleCode.Admin, RoleCode.SuperAdmin, RoleCode.AreaManager],
};

/**
 * 获取枚举项列表
 * @param dictCode 枚举编码
 * @returns 枚举项列表
 */
export const getEnumItemList = async (dictCode: string) => {
  try {
    const params = { dictCode };
    const res = await reqEnumItemList(params);
    const data = res.data;
    return data;
  } catch (error) {
    console.error('获取字典列表失败：', error);
    return [];
  }
};

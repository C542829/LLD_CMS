import { RoleCode } from '@/enums';
import { formatDate } from '@/utils/time';

export const DEFAULT_SEARCH_PARAMS = {
  roleId: '',
  userName: '',
  userStatus: '在职',
  userNumber: '',
  pageNum: 1,
  pageSize: 20,
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
  orgIds: [],
};

export const RoleCodeFilterMap = {
  [RoleCode.SuperAdmin]: [],
  [RoleCode.Admin]: [RoleCode.SuperAdmin],
  [RoleCode.AreaManager]: [RoleCode.Admin, RoleCode.SuperAdmin],
  [RoleCode.StoreManager]: [RoleCode.Admin, RoleCode.SuperAdmin, RoleCode.AreaManager],
};

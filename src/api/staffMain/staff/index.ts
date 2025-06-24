import request from '@/utils/request';
import { get, post, put, del } from '@/utils/request';

// 人员管理模块接口地址
enum API {
  // 获取人员列表
  LIST_URL = '/system/user/query-list',
  ADD_URL = '/system/user/add-user',
  UPDATE_URL = '/system/user/update-user',
}

export const reqStaffList = (params = {}) => get(API.LIST_URL, params);

export const reqAddStaff = (data = {}) => post(API.ADD_URL, data);

export const reqUpdateStaff = (data = {}) => put(API.UPDATE_URL, data);

// {
//     "id": 1,
//     "userCode": "EMP002",
//     "userPassword": "password123",
//     "userName": "张三",
//     "userNumber": "13800138000",
//     "userPosition": "店长",
//     "userSex": 1,
//     "userBirthday": "2025-03-11",
//     "userDept": "管理部",
//     "userEntryDate": null,
//     "userStatus": "在职",
//     "userIdCard": "110101199001011234",
//     "userAddress": "北京市朝阳区",
//     "userMarry": "已婚",
//     "userEdu": "本科",
//     "userHealth": null
// },

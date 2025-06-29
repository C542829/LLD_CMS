import { ReponseCode, ReponseCodeMeaning } from '@/enums/response';

export { ReponseCode, ReponseCodeMeaning };

export const statusOptions = [
  { value: 3, label: '全部状态' },
  { value: 0, label: '启用' },
  { value: 1, label: '禁用' },
];

export const commissionOptions = [
  { value: 0, label: '标准价提成' },
  { value: 1, label: '实收价提成' },
];

export const vipLevelOptions = [
  { value: '普通会员', label: '普通会员' },
  { value: '白银会员', label: '白银会员' },
  { value: '黄金会员', label: '黄金会员' },
  { value: '铂金会员', label: '铂金会员' },
  { value: '钻石会员', label: '钻石会员' },
];

export const sexOptions = [
  { value: 2, label: '未知' },
  { value: 0, label: '男' },
  { value: 1, label: '女' },
];

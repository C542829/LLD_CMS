import { ReponseCode, ReponseCodeMeaning } from '@/enums/response';

export { ReponseCode, ReponseCodeMeaning };

export const statusOptions = [
  {
    value: 3,
    label: '全部状态',
  },
  {
    value: 0,
    label: '启用',
  },
  {
    value: 1,
    label: '禁用',
  },
];

export const commissionOptions = [
  {
    value: 0,
    label: '标准价提成',
  },
  {
    value: 1,
    label: '实收价提成',
  },
];

import { ResponseCode, ResponseCodeMeaning } from '@/enums/response';

export { ResponseCode, ResponseCodeMeaning };

/**
 * 搜索状态
 */
export const statusOptions = [
  { value: '', label: '全部状态' },
  { value: 0, label: '启用' },
  { value: 1, label: '禁用' },
];

/**
 * 提成类型
 */
export const commissionOptions = [
  { value: 0, label: '标准价提成' },
  { value: 1, label: '实收价提成' },
];

/**
 * 会员等级
 */
export const vipLevelOptions = [
  { value: '普通会员', label: '普通会员' },
  { value: '白银会员', label: '白银会员' },
  { value: '黄金会员', label: '黄金会员' },
  { value: '铂金会员', label: '铂金会员' },
  { value: '钻石会员', label: '钻石会员' },
];

/**
 * 性别
 */
export const sexOptions = [
  { value: 2, label: '未知' },
  { value: 0, label: '男' },
  { value: 1, label: '女' },
];

/**
 * 婚姻状态
 */
export const maritalStatusOptions = [
  { label: '未知', value: '未知' },
  { label: '未婚', value: '未婚' },
  { label: '已婚', value: '已婚' },
  { label: '离异', value: '离异' },
  { label: '丧偶', value: '丧偶' },
];

/**
 * 学历
 */
export const educationOptions = [
  { label: '未知', value: '未知' },
  { label: '小学', value: '小学' },
  { label: '初中', value: '初中' },
  { label: '高中', value: '高中' },
  { label: '中专', value: '中专' },
  { label: '大专', value: '大专' },
  { label: '本科', value: '本科' },
  { label: '硕士', value: '硕士' },
  { label: '博士', value: '博士' },
  { label: '技校', value: '技校' },
];

/**
 * 在职状态
 */
export const employedOptions = [
  { value: '在职', label: '在职' },
  { value: '离职', label: '离职' },
  { value: '试用期', label: '试用期' },
  { value: '停薪留职', label: '停薪留职' },
];

/**
 * 过滤框的在职状态
 */
export const searchEmployedOptions = [{ value: '', label: '全部状态' }, ...employedOptions];

/**
 * 活动类型
 */
export const activityTypeOptions = [
  { value: '赠送储值金', label: '赠送储值金' },
  { value: '赠送优惠券', label: '赠送优惠券' },
  { value: '赠送优惠券和储值金', label: '赠送优惠券和储值金' },
];

/**
 * 折扣类型
 */
export const discountTypeOptions = [
  { value: '标准价', label: '标准价' },
  { value: '会员价', label: '会员价' },
];

/**
 * 优惠券类型
 */
export const couponTypeOptions = [
  { value: '体验券', label: '体验券' },
  { value: '代金券', label: '代金券' },
];

/**
 * 支付类型
 */
export const paymentTypeOptions = [
  { value: '微信', label: '微信' },
  { value: '支付宝', label: '支付宝' },
  { value: '银行卡', label: '银行卡' },
  { value: '现金', label: '现金' },
];

import { RoleLevel } from './constant';
import { formatDateTime, formatDate } from './time';

export { formatDateTime, formatDate };

/**
 * 判断角色等级是否大于等于另一个角色等级
 * @param roleA 角色A
 * @param roleB 角色B
 * @returns 是否大于等于角色B的等级
 */
export function isRoleHigherOrEqual(roleA: RoleCode, roleB: RoleCode) {
  // 超级管理员大于等于所有角色
  if (RoleLevel[roleB] === RoleLevel.SUPER_ADMIN) {
    return false;
  }
  // 角色B为空时，默认返回false
  if (!roleA || !roleB) {
    return false;
  }
  return RoleLevel[roleA] >= RoleLevel[roleB];
}

/**
 * 隐藏手机号中间四位
 * @param phone 手机号
 * @returns 隐藏后的手机号
 */
export function hidePhone(phone: string) {
  if (!phone) return '';
  return phone.toString().replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

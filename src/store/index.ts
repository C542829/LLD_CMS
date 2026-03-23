import { reactive, readonly, ref } from 'vue';
import { createPinia, type Pinia } from 'pinia';
const pinia = createPinia();

export default pinia;

// 用户信息
let userInfo_ = {} as UserInfo;
const storeUserInfo_ = reactive(userInfo_);
/** 用户信息 */
export const storeUserInfo = readonly(storeUserInfo_);
export function setStoreUserInfo(val: Partial<UserInfo>) {
  Object.assign(storeUserInfo_, val);
}

// 门店信息
let orgInfo_ = {} as OrgInfo;
const storeOrgInfo_ = reactive(orgInfo_);
/** 门店信息 */
export const storeOrgInfo = readonly(storeOrgInfo_);
export function setStoreOrgInfo(val: Partial<OrgInfo>) {
  Object.assign(storeOrgInfo_, val);
}

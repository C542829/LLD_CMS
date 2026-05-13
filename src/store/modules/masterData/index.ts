import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isEmpty } from 'lodash';

import { reqTicketList } from '@/api/member/coupon/index';
import { reqActiveList } from '@/api/member/rechargeActivity/index';
import { reqProductList } from '@/api/setGroup/product/index';
import { reqServiceItemList } from '@/api/setGroup/serviceItem/index';
import { reqPackageList } from '@/api/setGroup/package/index';
import { reqBedListAll } from '@/api/setGroup/room/index';
import { reqTreatmentCouponList } from '@/api/setGroup/treatmentCoupon/index';
import { reqOrgList } from '@/api/acl/org/index';
import { reqRoleList } from '@/api/acl/role';
import { reqUserList } from '@/api/user/index';

import { parseResList, parseResObj } from '@/utils/parseResponse';

export const useMasterDataStore = defineStore('MasterData', () => {
  /**
   * 通用加载逻辑：空数据或强制刷新时请求，否则直接返回缓存
   */
  const load = async <T>(listRef: { value: T[] }, fetcher: () => Promise<T[]>, refresh = false): Promise<T[]> => {
    if (!isEmpty(listRef.value) && !refresh) return listRef.value;
    listRef.value = await fetcher();
    return listRef.value;
  };

  /** 优惠券列表 */
  const ticketList: any = ref([]);
  const getTicketList = (refresh = false, params = { ticketName: '', ticketStatus: 0 }) =>
    load(ticketList, () => reqTicketList(params).then(parseResList), refresh);

  /** 充值活动列表 */
  const activeList: any = ref([]);
  const getActiveList = (refresh = false, params = { pageNum: 1, pageSize: 100 }) =>
    load(
      activeList,
      () =>
        reqActiveList(params)
          .then(parseResObj)
          .then((d) => d.rows),
      refresh,
    );

  /** 产品列表 */
  const productList: any = ref([]);
  const getProductList = (refresh = false, params = { productStatus: 0 }) =>
    load(productList, () => reqProductList(params).then(parseResList), refresh);

  /** 服务项目列表 */
  const serviceItemList: any = ref([]);
  const getServiceItemList = (refresh = false, params = { itemStatus: 0 }) =>
    load(serviceItemList, () => reqServiceItemList(params).then(parseResList), refresh);

  /** 套餐列表 */
  const packageList: any = ref([]);
  const getPackageList = (refresh = false, params = {}) =>
    load(packageList, () => reqPackageList(params).then(parseResList), refresh);

  /** 床位列表 */
  const getAllBedList = async () => {
    try {
      const { data } = await reqBedListAll();
      return data.filter((item: any) => item.status !== 2).sort((a: any, b: any) => a.roomInfoId - b.roomInfoId);
    } catch (error) {
      console.error('获取床位列表失败', error);
      return [];
    }
  };

  /** 治疗券列表 */
  const treatmentCouponList: any = ref([]);
  const getTreatmentCouponList = (refresh = false, params = { status: 0 }) =>
    load(treatmentCouponList, () => reqTreatmentCouponList(params).then(parseResList), refresh);

  /** 门店列表 */
  const orgList: any = ref([]);
  const getOrgList = (refresh = false, params = {}) =>
    load(
      orgList,
      () => reqOrgList(params).then((res) => res.data.filter((item: any) => !item?.orgCode.includes('Test'))),
      refresh,
    );

  /** 角色列表 */
  const roleList: any = ref([]);
  const getRoleList = (refresh = false, params = { status: 0 }) =>
    load(roleList, () => reqRoleList(params).then((res) => res.data), refresh);

  /** 用户列表 */
  const userList: any = ref([]);
  const getUserList = (refresh = false) =>
    load(
      userList,
      () =>
        reqUserList({
          roleId: '',
          userName: '',
          userStatus: '在职',
          userNumber: '',
          pageNum: 1,
          pageSize: 200,
          orgIds: [],
        }).then((res) =>
          res.data.rows.map((item: any) => ({
            id: item.id,
            userId: item.id,
            userName: item.userName,
            userCode: item.userCode,
          })),
        ),
      refresh,
    );

  /** 缓存 key → ref 映射 */
  const listMap: Record<string, { value: any[] }> = {
    ticket: ticketList,
    active: activeList,
    product: productList,
    serviceItem: serviceItemList,
    package: packageList,
    treatmentCoupon: treatmentCouponList,
    org: orgList,
    role: roleList,
    user: userList,
  };

  /** 清除指定列表缓存并立即重新加载；不传 key 则清除全部 */
  const invalidate = async (key?: string) => {
    if (key && fetcherMap[key]) {
      await fetcherMap[key]();
    } else if (!key) {
      $reset();
    }
  };

  /** 缓存 key → 重新获取函数映射 */
  const fetcherMap: Record<string, () => Promise<any>> = {
    ticket: () => getTicketList(true),
    active: () => getActiveList(true),
    product: () => getProductList(true),
    serviceItem: () => getServiceItemList(true),
    package: () => getPackageList(true),
    treatmentCoupon: () => getTreatmentCouponList(true),
    org: () => getOrgList(true),
    role: () => getRoleList(true),
    user: () => getUserList(true),
  };

  /** 预加载轻量级列表（门店、角色），大列表按需加载 */
  const init = () => {
    Promise.allSettled([getOrgList(), getRoleList(), getUserList()]);
  };

  const $reset = () => {
    ticketList.value = [];
    activeList.value = [];
    productList.value = [];
    serviceItemList.value = [];
    packageList.value = [];
    treatmentCouponList.value = [];
    orgList.value = [];
    roleList.value = [];
    userList.value = [];
  };

  return {
    $reset,
    load,
    init,
    invalidate,

    ticketList,
    getTicketList,

    activeList,
    getActiveList,

    productList,
    getProductList,

    serviceItemList,
    getServiceItemList,

    packageList,
    getPackageList,

    getAllBedList,

    treatmentCouponList,
    getTreatmentCouponList,

    orgList,
    getOrgList,

    roleList,
    getRoleList,

    userList,
    getUserList,
  };
});

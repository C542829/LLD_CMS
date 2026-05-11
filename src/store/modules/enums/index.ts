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

import { parseResList, parseResObj } from '@/utils/parseResponse';

export const useDataEnumStore = defineStore('DataEnum', () => {
  // 员工列表
  // const staffList: any = ref([]);
  // /**
  //  * 获取员工列表
  //  * @param refresh 是否刷新
  //  * @param params 请求参数
  //  * @returns 枚举项列表
  //  */
  // const getStaffList = async (refresh = false, params = { userStatus: '在职', pageNum: 1, pageSize: 100 }) => {
  //   if (isEmpty(staffList.value) || refresh) {
  //     await setStaffList(params);
  //     return staffList.value;
  //   } else {
  //     return staffList.value;
  //   }
  // };
  // const setStaffList = async (params: any) => {
  //   const res = await reqUserList(params);
  //   const data = parseResObj(res);
  //   staffList.value = data.rows.map((item: any) => {
  //     return {
  //       id: item.id,
  //       userId: item.id,
  //       userName: item.userName,
  //     };
  //   });
  //   // for (const staff of staffList.value) {
  //   //   staff.userId = staff.id;
  //   // }
  // };

  /** 优惠券列表 */
  const ticketList: any = ref([]);
  /**
   * 获取优惠券列表
   * @param refresh 是否刷新
   * @param params 请求参数
   * @returns 优惠券列表
   */
  const getTicketList = async (refresh = false, params = { ticketName: '', ticketStatus: 0 }) => {
    if (isEmpty(ticketList.value) || refresh) {
      await setTicketList(params);
      return ticketList.value;
    } else {
      return ticketList.value;
    }
  };
  const setTicketList = async (params: any) => {
    const res = await reqTicketList(params);
    const data = parseResList(res);
    // const data = parseResList(res).filter((item) => {
    //   return item.ticketType === CouponType.voucher;
    // });
    ticketList.value = data;
  };

  /** 充值活动列表 */
  const activeList: any = ref([]);
  /**
   * 获取充值活动列表
   * @param refresh 是否刷新
   * @param params 请求参数
   * @returns 充值活动列表
   */
  const getActiveList = async (refresh = false, params = { pageNum: 1, pageSize: 100 }) => {
    if (isEmpty(activeList.value) || refresh) {
      await setActiveList(params);
      return activeList.value;
    } else {
      return activeList.value;
    }
  };
  const setActiveList = async (params: any) => {
    const res = await reqActiveList(params);
    const data = parseResObj(res);
    activeList.value = data.rows;
  };

  /** 产品列表 */
  const productList: any = ref([]);
  /**
   * 获取产品列表
   * @param refresh 是否刷新
   * @param params 请求参数
   * @returns 产品列表
   */
  const getProductList = async (refresh = false, params = { productStatus: 0 }) => {
    if (isEmpty(productList.value) || refresh) {
      await setProductList(params);
      return productList.value;
    } else {
      return productList.value;
    }
  };
  const setProductList = async (params: any) => {
    const res = await reqProductList(params);
    const data = parseResList(res);
    productList.value = data;
  };

  // 服务项目列表
  const serviceItemList: any = ref([]);
  /**
   * 获取服务项目列表
   * @param refresh 是否刷新
   * @param params 请求参数
   * @returns 服务项目列表
   */
  const getServiceItemList = async (refresh = false, params = { itemStatus: 0 }) => {
    if (isEmpty(serviceItemList.value) || refresh) {
      await setServiceItemList(params);
      return serviceItemList.value;
    } else {
      return serviceItemList.value;
    }
  };
  const setServiceItemList = async (params: any) => {
    const res = await reqServiceItemList(params);
    const data = parseResList(res);
    serviceItemList.value = data;
  };

  // 套餐列表
  const packageList: any = ref([]);
  /**
   * 获取套餐列表
   * @param refresh 是否刷新
   * @param params 请求参数
   * @returns 套餐列表
   */
  const getPackageList = async (refresh = false, params = {}) => {
    if (isEmpty(packageList.value) || refresh) {
      await setPackageList(params);
      return packageList.value;
    } else {
      return packageList.value;
    }
  };
  const setPackageList = async (params: any) => {
    const res = await reqPackageList(params);
    const data = parseResList(res);
    packageList.value = data;
  };

  // 床位列表
  /**
   * 所有床位列表
   */
  const getAllBedList = async () => {
    const res = await reqBedListAll();
    const data = parseResList(res);
    return data.filter((item: any) => item.status !== 2).sort((a: any, b: any) => a.roomInfoId - b.roomInfoId);
  };

  // 治疗券列表
  const treatmentCouponList: any = ref([]);
  /**
   * 获取治疗券列表
   * @param refresh 是否刷新
   * @param params 请求参数
   * @returns 治疗券列表
   */
  const getTreatmentCouponList = async (refresh = false, params = { status: 0 }) => {
    if (isEmpty(treatmentCouponList.value) || refresh) {
      await setTreatmentCouponList(params);
      return treatmentCouponList.value;
    } else {
      return treatmentCouponList.value;
    }
  };
  const setTreatmentCouponList = async (params: any) => {
    const res = await reqTreatmentCouponList(params);
    const data = parseResList(res);
    treatmentCouponList.value = data;
  };

  // 门店列表
  const orgList: any = ref([]);
  /**
   * 获取门店列表
   * @param refresh 是否刷新
   * @param params 请求参数
   * @returns 门店列表
   */
  const getOrgList = async (refresh = false, params = {}) => {
    if (isEmpty(orgList.value) || refresh) {
      await setOrgList(params);
      return orgList.value;
    } else {
      return orgList.value;
    }
  };

  const setOrgList = async (params: any) => {
    try {
      const res = await reqOrgList(params);
      const data = res.data;
      orgList.value = data.filter((item) => !item?.orgCode.includes('Test'));
    } catch (error) {}
  };

  /** 角色列表 */
  const roleList: any = ref([]);
  /**
   * 获取门店列表
   * @param refresh 是否刷新
   * @param params 请求参数
   * @returns 门店列表
   */
  const getRoleList = async (refresh = false, params = { status: 0 }) => {
    if (isEmpty(roleList.value) || refresh) {
      await setRoleList(params);
      return roleList.value;
    } else {
      return roleList.value;
    }
  };
  const setRoleList = async (params: any) => {
    try {
      const res = await reqRoleList(params);
      roleList.value = res.data;
    } catch (error) {
      console.error('获取角色列表失败：', error);
    }
  };

  const $reset = () => {
    // staffList.value = [];
    ticketList.value = [];
    activeList.value = [];
    productList.value = [];
    serviceItemList.value = [];
    packageList.value = [];
    treatmentCouponList.value = [];
    orgList.value = [];
    roleList.value = [];
  };

  return {
    $reset,
    // 员工相关
    // staffList,
    // setStaffList,
    // getStaffList,

    // 优惠券相关
    ticketList,
    setTicketList,
    getTicketList,

    // 充值活动相关
    activeList,
    setActiveList,
    getActiveList,

    // 产品相关
    productList,
    setProductList,
    getProductList,

    // 服务项目相关
    serviceItemList,
    setServiceItemList,
    getServiceItemList,

    // 套餐相关
    packageList,
    setPackageList,
    getPackageList,

    // 床位相关
    getAllBedList,

    // 治疗券相关
    treatmentCouponList,
    setTreatmentCouponList,
    getTreatmentCouponList,

    // 门店相关
    orgList,
    setOrgList,
    getOrgList,

    // 角色列表
    roleList,
    setRoleList,
    getRoleList,
  };
});

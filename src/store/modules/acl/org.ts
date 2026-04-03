import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { type Types, reqList, reqListOne, reqAdd, reqUpdate, reqUpdateStatus } from '@/api/acl/org';
import { parseResList, parseResMsg, parseResObj } from '@/utils/parseResponse';
import { getUserInfo } from '@/utils/localStorageTools';
import { isEmpty, cloneDeep } from 'lodash';
import { setStoreOrgInfo } from '@/store/index';

import { useSettingStore } from '@/store/modules/acl/setting';

export const useOrgStore = defineStore('Org', () => {
  const settingStore = useSettingStore();

  /**
   * 获取门店详情
   * @param id 门店id
   * @returns 门店详情
   */
  const getOrgInfo = async (id: number): Promise<OrgInfo | {}> => {
    try {
      const res = await reqListOne(id);
      const orgInfo = parseResObj(res);
      orgInfo.orgArea && (orgInfo.orgArea = JSON.parse(orgInfo.orgArea as string));
      return orgInfo;
    } catch (error) {
      console.error(`获取门店信息报错：${error}`);
    }
    return {};
  };

  // 存储当前登录用户的门店信息
  let _org: OrgInfo | {} = {};
  /**
   * 获取当前登录用户的门店信息
   * @returns 门店信息
   */
  const getOrg = async (): Promise<OrgInfo | {}> => {
    try {
      const user = getUserInfo();
      // 未登录
      if (isEmpty(user)) {
        return {};
      }
      // 已登录 - 直接返回
      if (_org && _org?.id === user.orgId) {
        return _org;
      } else {
        // 门店信息与当前登录用户不一致 - 刷新门店信息
        _org = await getOrgInfo(user.orgId);
        return _org;
      }
    } catch (error) {
      console.log('获取门店信息报错：', error);
      return {};
    }
  };

  /**
   * 搜索参数
   */
  const search = reactive<Types.SearchListParams>({
    orgName: '',
    orgCode: '',
    orgStatus: '',
  });

  /**
   * 表格数据
   */
  const tableData: any = ref([]);

  /**
   * 刷新列表
   */
  const setTableData = async () => {
    settingStore.loading = true;
    const res = await reqList(search);
    const data: Types.Org[] = parseResList(res);
    for (const item of data) {
      item.orgArea && (item.orgArea = JSON.parse(item.orgArea as string));
    }

    tableData.value = data.filter((item) => !item.orgCode.includes('Test'));
    settingStore.loading = false;
  };

  /**
   * 新增/更新
   * @param data 数据
   * @returns 是否成功
   */
  const update = async (data: Types.Org) => {
    data = { ...data };
    data.orgArea && (data.orgArea = JSON.stringify(data.orgArea));
    const res = await (data?.id ? reqUpdate(data) : reqAdd(data));
    const result = parseResMsg(res);
    // 刷新数据
    result && setTableData();
    return result;
  };

  /**
   * 更新状态
   * @param data 数据
   * @returns 是否成功
   */
  const updateStatus = async (data: Types.Org) => {
    const params = {
      id: data.id,
      status: data.orgState ? 0 : 1,
    };
    const res = await reqUpdateStatus(params);
    const result = parseResMsg(res);
    // 刷新数据
    result && setTableData();
    return result;
  };

  // 默认表单数据模型
  const DEFAULT_FORMDATA = {
    id: 0,
    orgState: 0,
    orgName: '',
    orgShortName: '',
    orgCode: '',
    orgParent: '无',
    orgProperty: '实体门店',
    orgType: '自营',
    orgArea: ['河南省', '郑州市', '中原区'],
    orgNumber: '',
    orgLeader: '',
    orgLeaderNum: '',
    orgAddress: '',
    remark: '',
  };

  /**
   * 表单数据
   */
  const formData = ref<Types.Org>(cloneDeep(DEFAULT_FORMDATA));

  /**
   * 重置表单数据模型
   */
  const resetFormData = () => {
    formData.value = cloneDeep(DEFAULT_FORMDATA);
  };

  return {
    search,
    tableData,
    setTableData,
    update,
    formData,
    resetFormData,
    updateStatus,
    getOrgInfo,

    getOrg,
  };
});

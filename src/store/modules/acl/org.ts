import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { reqList, reqListOne, reqAdd, reqUpdate, reqUpdateStatus } from '@/api/acl/org';
import { Org } from '@/api/acl/org/type';
import { parseResList, parseResMsg, parseResObj } from '@/utils/parseResponse';

import { useSettingStore } from '@/store/modules/acl/setting';
const settingStore = useSettingStore();

export const useOrgStore = defineStore('Org', () => {
  /**
   * 搜索参数
   */
  const search = reactive({
    orgName: '',
    orgCode: '',
    orgStatus: '',
  });

  /**
   * 获取门店详情
   * @param id 门店id
   * @returns 门店详情
   */
  const getOrgInfo = async (id: number) => {
    const res = await reqListOne(id);
    const orgInfo = parseResObj(res);
    orgInfo.orgArea && (orgInfo.orgArea = JSON.parse(orgInfo.orgArea as string));
    return orgInfo;
  };

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
    let data: Org[] = parseResList(res);
    for (const item of data) {
      item.orgArea && (item.orgArea = JSON.parse(item.orgArea as string));
    }
    tableData.value = data;
    settingStore.loading = false;
  };

  /**
   * 新增/更新
   * @param data 数据
   * @returns 是否成功
   */
  const update = async (data: Org) => {
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
  const updateStatus = async (data: Org) => {
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

  /**
   * 表单数据
   */
  const formData = ref<Org>({
    id: 0,
    orgState: 0,
    orgName: '',
    orgShortName: '',
    orgCode: '',
    orgParent: '',
    orgProperty: '',
    orgType: '',
    orgArea: [],
    orgNumber: '',
    orgLeader: '',
    orgLeaderNum: '',
    orgAddress: '',
    remark: '',
  });

  /**
   * 重置表单数据模型
   */
  const resetFormData = () => {
    formData.value = {
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
  };
});

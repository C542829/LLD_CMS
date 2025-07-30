import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';

import {
  reqEnumList,
  reqAddEnum,
  reqUpdateEnum,
  reqDelEnum,
  reqEnumItemList,
  reqAddEnumItem,
  reqUpdateEnumItem,
  reqDelEnumItem,
} from '@/api/enums/index';

import { parseResList, parseResMsg } from '@/utils/parseResponse';

export enum Enums {
  BED_STATUS = 'bed_status',
  UNIT = 'unit',
  POSITION = 'position',
  DEPARTMENT = 'department',
}

import { useSettingStore } from '@/store/modules/acl/setting';

export const useEnumStore = defineStore('Enum', () => {
  const settingStore = useSettingStore();

  // 搜索参数
  const search = reactive({
    dictName: '',
    dictCode: '',
  });

  const tableData: any = ref([]);
  const setTableData = async () => {
    settingStore.loading = true;
    const res = await reqEnumList(search);
    let data = parseResList(res);
    tableData.value = data;
    settingStore.loading = false;
  };

  const dict: any = ref({});
  const resetDict = () => {
    dict.value = {
      dictTypeId: null,
      dictName: '',
      dictCode: '',
      sort: 0,
      remark: '',
    };
  };

  const updateDict = async () => {
    const res = await (dict.value.dictTypeId ? reqUpdateEnum(dict.value) : reqAddEnum(dict.value));
    const result = parseResMsg(res);
    result && setTableData();
    return result;
  };

  const delDict = async (dictTypeId: number) => {
    const res = await reqDelEnum(dictTypeId);
    const result = parseResMsg(res);
    result && setTableData();
    return result;
  };

  const dictItem: any = ref({});
  const resetDictItem = () => {
    dictItem.value = {
      dictItemId: null,
      dictCode: '',
      itemValue: '',
      itemLabel: '',
      sort: 0,
      remark: '',
    };
  };

  const updateDictItem = async (data?: any) => {
    const params = data || dictItem.value;
    const res = await (params.dictItemId ? reqUpdateEnumItem(params) : reqAddEnumItem(params));
    const result = parseResMsg(res);
    return result;
  };

  const delDictItem = async (dictItemId: number) => {
    const res = await reqDelEnumItem(dictItemId);
    const result = parseResMsg(res);
    return result;
  };

  /**
   * 获取枚举项列表
   * @param dictCode 枚举编码
   * @returns 枚举项列表
   */
  const getEnumItemList = async (dictCode: string) => {
    const params = { dictCode };
    const res = await reqEnumItemList(params);
    const data = parseResList(res);
    return data;
  };

  /**
   * 获取单位列表
   * @returns 单位列表
   */
  const getUnits = async () => {
    return await getEnumItemList(Enums.UNIT);
  };

  /**
   * 获取岗位列表
   * @returns 岗位列表
   */
  const getPositionList = async () => {
    return await getEnumItemList(Enums.POSITION);
  };

  /**
   * 获取部门列表
   * @returns 部门列表
   */
  const getDeptList = async () => {
    return await getEnumItemList(Enums.DEPARTMENT);
  };

  return {
    getDeptList,
    getUnits,
    getPositionList,
    getEnumItemList,

    search,
    tableData,
    setTableData,
    dict,
    resetDict,
    updateDict,
    dictItem,
    resetDictItem,
    updateDictItem,
    delDict,
    delDictItem,
  };
});

export const useEnumsStore = useEnumStore;

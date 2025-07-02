import { defineStore } from 'pinia';
import { ref } from 'vue';
import $Message from '@/components/Message';

// 导入请求方法
import { reqPositionList } from '@/api/enums/position';
import { parseReqList } from '@/utils/feedback';

export const useEnumsStore = defineStore('Enums', () => {
  // 职位
  const positionOptions: any = ref([]);
  const setPositionList = async () => {
    const params = { parentId: 1 };
    const res = await reqPositionList(params);
    const data = parseReqList(res);

    positionOptions.value = [
      { value: '店长', label: '店长' },
      { value: '收银员', label: '收银员' },
      { value: '采耳师', label: '采耳师' },
      { value: '修脚师', label: '修脚师' },
    ];
  };

  // 部门
  const deptOptions: any = ref([]);
  const setDeptList = async () => {
    const params = { parentId: 1 };
    const res = await reqPositionList(params);
    const data = parseReqList(res);
    deptOptions.value = [
      { value: '管理部', label: '管理部' },
      { value: '技师部', label: '技师部' },
    ];
  };

  // 职称
  const titleOptions: any = ref([]);
  const setTitleList = async () => {
    const params = { parentId: 1 };
    const res = await reqPositionList(params);
    const data = parseReqList(res);
    titleOptions.value = [
      { value: '无', label: '无' },
      { value: '店长', label: '店长' },
      { value: '技师', label: '技师' },
    ];
  };

  // 单位
  const unitOptions: any = ref([]);
  const setUnitList = async () => {
    const params = { parentId: 1 };
    const res = await reqPositionList(params);
    const data = parseReqList(res);
    unitOptions.value = [
      { value: 0, label: '盒' },
      { value: 1, label: '个' },
      { value: 2, label: '瓶' },
    ];
  };

  return {
    positionOptions,
    setPositionList,
    deptOptions,
    setDeptList,
    titleOptions,
    setTitleList,
    unitOptions,
    setUnitList,
  };
});

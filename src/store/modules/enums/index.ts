import { defineStore } from 'pinia';
import { ref } from 'vue';
import $Message from '@/components/Message';

// 导入请求方法
import { reqPositionList } from '@/api/enums/position';

export const useEnumsStore = defineStore('Enums', () => {
  // 职位
  const positionOptions: any = ref([]);
  const setPositionList = async () => {
    try {
      // 获取数据列表
      // const params = { parentId: 1 };
      // const data: any = (await reqPositionList(params)).data;
      // positionList.value = data;
      positionOptions.value = [
        {
          value: '店长',
          label: '店长',
        },
        {
          value: '收银员',
          label: '收银员',
        },
        {
          value: '采耳师',
          label: '采耳师',
        },
        {
          value: '修脚师',
          label: '修脚师',
        },
      ];
    } catch (error) {
      $Message.error('获取职位列表失败');
    }
  };

  // 部门
  const deptOptions: any = ref([]);
  const setDeptList = async () => {
    try {
      // 获取数据列表
      // const params = { parentId: 1 };
      // const data: any = (await reqPositionList(params)).data;
      // positionList.value = data;
      deptOptions.value = [
        {
          value: '管理部',
          label: '管理部',
        },
        {
          value: '技师部',
          label: '技师部',
        },
      ];
    } catch (error) {
      $Message.error('获取部门列表失败');
    }
  };

  // 职称
  const titleOptions: any = ref([]);
  const setTitleList = async () => {
    try {
      // 获取数据列表
      // const params = { parentId: 1 };
      // const data: any = (await reqPositionList(params)).data;
      // positionList.value = data;
      titleOptions.value = [
        {
          value: '无',
          label: '无',
        },
        {
          value: '店长',
          label: '店长',
        },
        {
          value: '技师',
          label: '技师',
        },
      ];
    } catch (error) {
      $Message.error('获取职称列表失败');
    }
  };

  return {
    positionOptions,
    setPositionList,
    deptOptions,
    setDeptList,
    titleOptions,
    setTitleList,
  };
});

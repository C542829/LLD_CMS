import { defineStore } from 'pinia';
import { ref } from 'vue';
import $Message from '@/components/Message';
import $Notification from '@/components/Notification';
import { parseReqInform, parseReqList } from '@/utils/feedback';
import {
  reqRoomList,
  reqAddRoom,
  reqUpdateRoom,
  reqBedList,
  reqAddBed,
  reqUpdateBed,
  reqUpdateBedStatus,
} from '@/api/setGroup/room';

export const useRoomStore = defineStore('Room', () => {
  const loading = ref(false);

  // 搜索参数
  const searchParams = ref({
    storeId: 0,
    roomName: '',
  });

  // #region 房间
  const roomList: any = ref([]);
  const setRoomList = async () => {
    loading.value = true;
    // 获取房间列表
    const res = await reqRoomList(searchParams.value);
    const data = parseReqList(res);
    // 处理数据
    roomList.value = data;
    loading.value = false;
  };

  const updateRoom = async (data: any) => {
    // 浅拷贝避免修改原数据
    data = { ...data };

    // 发送请求
    console.log('房间数据 = ', data);
    const res = await (data?.id ? reqUpdateRoom(data) : reqAddRoom(data));
    const result = parseReqInform(res);

    // 刷新数据
    result && setRoomList();
    return result;
  };
  // #endregion

  // #region 床位
  const bedList: any = ref([]);
  const setBedList = async (id: number) => {
    loading.value = true;
    // 获取床位列表
    const res = await reqBedList({ roomId: id });
    const data = parseReqList(res);
    // 处理数据
    bedList.value = data;
    loading.value = false;
  };

  const updateBed = async (data: any) => {
    // 发送请求
    let res: any = {};
    if (data?.id) {
      res = await reqUpdateBed(data);
    } else {
      data.status = '空闲';
      res = await reqAddBed(data);
    }
    const result = parseReqInform(res);

    // 刷新数据
    result && setBedList(data.roomInfoId);
    return result;
  };

  const updateBedStatus = async (data: { id: number; status: string; roomInfoId: number }) => {
    // 发送请求
    const res = await reqUpdateBedStatus(data);
    const result = parseReqInform(res);

    // 刷新数据
    result && setBedList(data.roomInfoId);
    return result;
  };
  // #endregion

  return {
    loading,
    searchParams,
    roomList,
    setRoomList,
    updateRoom,
    bedList,
    setBedList,
    updateBed,
    updateBedStatus,
  };
});

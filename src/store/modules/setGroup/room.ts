import { defineStore } from 'pinia';
import { ref } from 'vue';
import $Message from '@/components/Message';
import $Notification from '@/components/Notification';
import { reqRoomList, reqAddRoom, reqUpdateRoom, reqBedList, reqAddBed, reqUpdateBed } from '@/api/setGroup/room';
import { ReponseCode, ReponseCodeMeaning } from '@/enums/response';

export const useRoomStore = defineStore('Room', () => {
  // 搜索参数
  const searchParams = ref({
    storeId: 0,
    roomName: '',
  });

  // #region 房间
  const roomList: any = ref([]);
  const setRoomList = async () => {
    try {
      // 获取房间列表
      const data: any = (await reqRoomList(searchParams.value)).data;
      // 处理数据
      roomList.value = data;
    } catch (error) {
      $Message.error('获取房间列表失败');
    }
  };

  const updateRoom = async (data: any) => {
    // 浅拷贝避免修改原数据
    data = { ...data };

    try {
      // 发送请求
      let res: any = {};
      if (data?.id) {
        res = await reqUpdateRoom(data);
      } else {
        res = await reqAddRoom(data);
      }
      if (res.code === ReponseCode.SUCCESS) {
        $Notification.success(res.data); // 显示成功消息
        setRoomList(); // 重新获取数据
        return true;
      } else {
        $Notification.error(res.data); // 显示错误消息
        return false;
      }
    } catch (error) {
      console.error(error);
      $Message.error(ReponseCodeMeaning.FAIL);
    }
  };
  // #endregion

  // 床位
  const bedList: any = ref([]);
  const setBedList = async (id: number) => {
    try {
      // 获取床位列表
      const data: any = (await reqBedList(id)).data;
      // 处理数据
      bedList.value = data;
    } catch (error) {
      $Message.error('获取床位列表失败');
    }
  };
  const updateBed = async (data: any) => {
    // 浅拷贝避免修改原数据
    data = { ...data };

    try {
      // 发送请求
      let res: any = {};
      if (data?.id) {
        res = await reqUpdateRoom(data);
      } else {
        res = await reqAddRoom(data);
      }
      if (res.code === ReponseCode.SUCCESS) {
        $Notification.success(res.data); // 显示成功消息
        setBedList(data.roomInfoId); // 重新获取数据
        return true;
      } else {
        $Notification.error(res.data); // 显示错误消息
        return false;
      }
    } catch (error) {
      console.error(error);
      $Message.error(ReponseCodeMeaning.FAIL);
    }
  };

  return {
    searchParams,
    roomList,
    setRoomList,
    updateRoom,
    bedList,
    setBedList,
    updateBed,
  };
});

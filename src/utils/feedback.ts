// 导入消息提示组件
import $Message from '@/components/Message';
import $Notification from '@/components/Notification';

// 业务状态码
import { ResponseCode, ResponseCodeMeaning } from '@/enums/response';

export const reqNotification = async (callback: Function) => {
  try {
    const res: { code: number; message: string; data: string } = await callback();
    if (res.code === ResponseCode.SUCCESS) {
      $Notification.success(res.data); // 显示成功消息
      return true;
    } else {
      $Notification.error(`${res.message}：${res.data}`); // 显示错误消息
      return false;
    }
  } catch (error) {
    console.warn('请求出错：', error);
    $Message.error(ResponseCodeMeaning.FAIL);
  }
  return false;
};

export const reqList = async (callback: Function, msg = '获取数据列表失败') => {
  try {
    // 获取数据列表
    return await callback();
  } catch (error) {
    $Message.error(msg);
  }
  return [];
};

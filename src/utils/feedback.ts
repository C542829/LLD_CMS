// 导入消息提示组件
import $Message from '@/components/Message';
import $Notification from '@/components/Notification';

// 业务状态码
import { ResponseCode, ResponseCodeMeaning } from '@/enums/response';

interface ResponseType {
  code: number;
  message: string;
  data: string | Array<object>;
}

export const parseReqInform = (res: any) => {
  if (!res) {
    $Message.error('响应数据为空');
    return false;
  }

  try {
    if (res.code === ResponseCode.SUCCESS) {
      $Notification.success(res.data as string); // 显示成功消息
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

export const parseReqList = (res: any, msg = '获取数据列表失败') => {
  if (!res) {
    $Message.error('响应数据为空');
    return [];
  }

  try {
    if (res?.code !== ResponseCode.SUCCESS) {
      $Notification.error(`${res.message}：${res.data}`);
    }

    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.warn('请求出错：', error);
    $Message.error(msg);
  }
  return [];
};

// 导入消息提示组件
import $Message from '@/components/Message';
import $Notification from '@/components/Notification';

// 业务状态码
import { ResponseCode, ResponseCodeMeaning } from '@/enums/response';

/**
 * 解析请求通知
 * @param res 响应数据
 * @returns 是否解析成功
 * @deprecated 该函数即将被弃用，请使用 parseResMsg 替代。
 */
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

/**
 * 解析请求列表
 * @param res 响应数据
 * @param msg 失败提示
 * @returns 解析后的数据列表
 * @deprecated 该函数即将被弃用，请使用 parseResList 替代。
 */
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

// -----------------------------------------------------------------------------------

/**
 * 基础响应解析器
 * @param res - 后端响应对象
 * @returns 成功时返回响应数据，失败时返回false
 * @description 处理通用的响应格式校验，包括：
 * 1. 响应是否存在
 * 2. 状态码是否为成功状态
 * 3. 错误提示处理
 */
export const parseRes = (res: any) => {
  // 处理无响应情况
  if (!res) {
    $Message.error('服务器无响应');
    return false;
  }

  try {
    // 检查状态码是否成功
    if (res?.code !== ResponseCode.SUCCESS) {
      $Notification.error(`${res.message}：${res.data}`);
      return false;
    }
    // 返回响应中的数据字段
    return res.data;
  } catch (error) {
    // 处理解析异常
    $Message.error('请求出错：' + error);
  }

  return false;
};

/**
 * 增删改操作专用解析器
 * @param res - 后端响应对象
 * @param msg - 成功提示消息（可选）
 * @returns 操作是否成功的布尔值
 * @description 适用于增删改类操作，特点是：
 * 1. 使用parseRes进行基础校验
 * 2. 成功时显示成功通知
 * 3. 返回布尔值结果
 */
export const parseResMsg = (res: any, msg = '') => {
  // 调用基础解析器
  let data = parseRes(res);
  // 成功时显示通知
  data && $Notification.success(msg || data);
  return !!data;
};

/**
 * 对象类型响应解析器
 * @param res - 后端响应对象
 * @param msg - 失败提示消息（可选）
 * @returns 解析后的对象数据（失败时返回空对象）
 * @description 适用于预期返回对象数据的接口，特点是：
 * 1. 使用parseRes进行基础校验
 * 2. 验证返回数据是否为对象类型
 * 3. 处理空对象情况
 */
export const parseResObj = (res: any, msg = '获取数据失败') => {
  // 调用基础解析器
  const data = parseRes(res);
  // 验证是否为对象类型
  const isObj = isObject(data);
  // 非对象类型提示警告
  !isObj && $Message.warning(msg);
  // 空对象提示
  isObj && Object.keys(data).length === 0 && $Message.success('数据为空');
  // 确保返回对象类型
  return isObj ? data : {};
};

/**
 * 列表类型响应解析器
 * @param res - 后端响应对象
 * @param msg - 失败提示消息（可选）
 * @returns 解析后的数组数据（失败时返回空数组）
 * @description 适用于预期返回列表数据的接口，特点是：
 * 1. 使用parseRes进行基础校验
 * 2. 验证返回数据是否为数组类型
 * 3. 处理空列表情况
 */
export const parseResList = (res: any, msg = '获取数据列表失败') => {
  // 调用基础解析器
  const data = parseRes(res);
  // 验证是否为数组类型
  const isArray = Array.isArray(data);
  // 非数组类型提示警告
  !isArray && $Message.warning(msg);
  // 空数组提示
  data?.length === 0 && $Message.success('暂无数据');
  // 确保返回数组类型
  return isArray ? data : [];
};

/**
 * 判断值是否为普通对象
 * @param value - 待判断的值
 * @returns 是否为普通对象的布尔值
 * @description 使用Object.getPrototypeOf进行判断，确保：
 * 1. 排除null和非对象类型
 * 2. 排除数组、函数等特殊对象
 * 3. 仅允许Object.prototype为原型的普通对象
 */
function isObject(value: any) {
  if (typeof value !== 'object' || value === null) return false;
  return Object.getPrototypeOf(value) === Object.prototype;
}

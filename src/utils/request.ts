import { isEmpty } from 'lodash';
// 进行axios二次封装:
import axios from 'axios';
// 引入消息提示
import Message from '@/components/Message/index';
// 业务状态码
import { ResponseCode } from '@/enums/response';
// 引入用户相关的仓库
import useUserStore from '@/store/modules/acl/user';
// 引入配置相关的仓库
import { useSettingStore } from '@/store/modules/acl/setting';

// 扩展config自定义参数
declare module 'axios' {
  interface AxiosRequestConfig {
    form_urlencoded?: boolean; // Content-Type = application/x-www-form-urlencoded
    noToken?: boolean; // 接口请求是否携带token
    serviceName?: string; // 接口调用时的服务，不传时默认为VITE_BASE_API（服务名称在public文件夹下config.json中配置，并在global.d.ts中的EnvConfig定义中声明类型）
  }
}

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // 基础路径
  timeout: 1000 * 10, // 超时时间
});

// 添加请求拦截器
request.interceptors.request.use((config) => {
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  if (Object.prototype.toString.call(config.data) === '[object FormData]') {
    config.headers['Content-Type'] = 'multipart/form-data;charset=UTF-8';
  } else {
    // if (config.form_urlencoded) {
    //   config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    //   config.data = qs.stringify(config.data);
    // } else {
    //   config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    //   if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
    //     config.data = JSON.stringify(config.data);
    //   } else {
    //     config.data = qs.stringify(config.data);
    //   }
    // }
  }

  // 如果用户登录成功,则会携带token
  const userStore = useUserStore();
  if (userStore.token && !config.noToken) {
    config.headers['Authorization'] = userStore.token;
  }
  // 判断data是否为空
  if (isEmpty(config.data)) {
    config.data = null;
  }

  //返回配置对象
  return config;
});

// 添加响应拦截器
request.interceptors.response.use(
  (response) => {
    const apiData = response.data;
    const code = apiData.code;

    // 二进制数据则直接返回
    const responseType = response.request?.responseType;
    if (responseType === 'blob' || responseType === 'arraybuffer') return apiData;

    // 如果没有 code, 代表这不是项目后端开发的 api
    if (code === undefined) {
      Message.error('服务器开小差！');
      return Promise.reject(apiData);
    }

    // 根据 code 进行判断
    switch (code) {
      // 业务正常
      case ResponseCode.SUCCESS:
        return apiData;
        break;
      // 业务失败
      case ResponseCode.FAIL:
        Message.error('服务器开小差！');
        break;
      // 用户未登录
      case ResponseCode.UNAUTHORIZED:
        logout();
        break;
      // 没有相关权限
      case ResponseCode.FORBIDDEN:
        Message.error('没有相关权限');
        break;
      // 服务器错误
      case ResponseCode.SERVER_ERROR:
        Message.error('服务器错误');
        // window.location.href = '/#/500';
        break;
      // 上传参数异常
      case ResponseCode.PARAMS_INVALID:
        Message.error('上传参数异常');
        break;
      // ContentType错误
      case ResponseCode.CONTENT_TYPE_ERR:
        Message.error('ContentType错误');
        break;
      // 功能尚未实现
      case ResponseCode.API_UN_IMPL:
        Message.error('功能尚未实现');
        break;
      // 服务器繁忙
      case ResponseCode.SERVER_BUSY:
        Message.error('服务器繁忙');
        break;
      // 不是正确的 code
      default:
        Message.error(apiData.message || 'Error');
    }
    return Promise.reject(apiData);
  },
  (error) => {
    // 关闭加载状态
    const settingStore = useSettingStore();
    settingStore.loading = false;
    // errorHandler(error);
    // return Promise.reject(error);
    if (error.code === 'ECONNABORTED') {
      Message.error('请求超时！');
    }
    return Promise.reject(error);
  },
);

/**
 * 登出操作
 */
const logout = () => {
  Message.error('登录失效，请重新登录！');
  const userStore = useUserStore();
  userStore.clearUserInfo();
  // window.location.reload();
  window.location.href = '/#/login';
};

/**
 * 错误处理函数
 * @param error 错误对象
 */
const errorHandler = (error: any) => {
  // 关闭加载状态
  const settingStore = useSettingStore();
  settingStore.loading = false;

  // 失败回调：处理http网络错误的
  try {
    let message = '';
    const status = error.response?.status || 0;
    console.log('响应错误 = ', error);

    switch (status) {
      case 400:
        message = '请求参数错误';
        break;
      case 401:
        logout();
        break;
      case 403:
        message = '无权访问';
        break;
      case 404:
        message = '请求地址错误';
        break;
      case 500:
        message = '服务器出现问题';
        if (error.response.data.code === ResponseCode.UNAUTHORIZED) {
          logout();
        } else {
          window.location.href = '/#/500';
        }
        break;
      default:
        message = '网络出现问题';
        break;
    }
    //提示错误信息
    Message.error(message);
  } catch (error: any) {
    console.error(error);
    Message.error('网络出现问题');
  }
};

/**
 * 封装GET请求
 * @param url 请求地址
 * @param params 请求参数
 * @param config 请求配置
 * @returns 响应数据
 */
export const get = <T>(url: string, params = {}, config = {}): Promise<T> => {
  return request({
    method: 'GET',
    url,
    params,
    ...config,
  });
};

/**
 * 封装POST请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 请求配置
 * @returns 响应数据
 */
export const post = <T>(url: string, data = {}, config = {}): Promise<T> => {
  return request({
    method: 'POST',
    url,
    data,
    ...config,
  });
};

/**
 * 封装PUT请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 请求配置
 * @returns 响应数据
 */
export const put = <T>(url: string, data = {}, config = {}): Promise<T> => {
  return request({
    method: 'PUT',
    url,
    data,
    ...config,
  });
};

/**
 * 封装DELETE请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 请求配置
 * @returns 响应数据
 */
export const del = <T>(url: string, params = {}, config = {}): Promise<T> => {
  return request({
    method: 'DELETE',
    url,
    params,
    ...config,
  });
};

/**
 * 封装PATCH请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 请求配置
 * @returns 响应数据
 */
export const patch = <T>(url: string, data = {}, config = {}): Promise<T> => {
  return request({
    method: 'PATCH',
    url,
    data,
    ...config,
  });
};

// 统一导出所有方法
export { get as GET, post as POST, put as PUT, del as DELETE, patch as PATCH };

/**
 * Content-Type 类型枚举
 */
export const ContentType = {
  JSON: { headers: { 'Content-Type': 'application/json' } },
  FormData: { headers: { 'Content-Type': 'multipart/form-data' } },
  URLencoded: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
};

// 对外暴露原始request实例
export default request;

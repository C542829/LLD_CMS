// 进行axios二次封装:使用请求与响应拦截器
import axios from 'axios';
import $Message from '@/components/Message/index';
// 引入用户相关的仓库
import useUserStore from '@/store/modules/user';

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // 基础路径
  timeout: 5000, // 超时的时间的设置
});

// 添加请求拦截器
request.interceptors.request.use((config) => {
  // 如果用户登录成功,则会携带token
  const userStore = useUserStore();
  if (userStore.token) {
    config.headers.token = userStore.token;
  }
  //返回配置对象
  return config;
});

// 添加响应拦截器
request.interceptors.response.use(
  (response) => {
    // 成功回调
    // 简化数据
    return response.data;
  },
  (error) => {
    // 失败回调:处理http网络错误的
    let message = '';
    if (error.response.status) {
      const status = error.response.status;
      switch (status) {
        case 401:
          message = 'TOKEN过期';
          break;
        case 403:
          message = '无权访问';
          break;
        case 404:
          message = '请求地址错误';
          break;
        case 500:
          message = '服务器出现问题';
          break;
        default:
          message = '网络出现问题';
          break;
      }
      //提示错误信息
      $Message.error(message);
    } else {
      console.error(error.response);
      $Message.error(error.response);
    }

    return Promise.reject(error);
  },
);

// 封装GET请求
export const get = (url: string, params = {}, config = {}) => {
  return request({
    method: 'GET',
    url,
    params,
    ...config,
  });
};

// 封装POST请求
export const post = (url: string, data = {}, config = {}) => {
  return request({
    method: 'POST',
    url,
    data,
    ...config,
  });
};

// 封装PUT请求
export const put = (url: string, data = {}, config = {}) => {
  return request({
    method: 'PUT',
    url,
    data,
    ...config,
  });
};

// 封装DELETE请求
export const del = (url: string, params = {}, config = {}) => {
  return request({
    method: 'DELETE',
    url,
    params,
    ...config,
  });
};

// 封装PATCH请求（额外提供）
export const patch = (url: string, data = {}, config = {}) => {
  return request({
    method: 'PATCH',
    url,
    data,
    ...config,
  });
};

// 统一导出所有方法
export { get as GET, post as POST, put as PUT, del as DELETE, patch as PATCH };

export interface ResponseData<T> {
  code: number;
  message: string;
  data: T;
}

//对外暴露原始request实例
export default request;

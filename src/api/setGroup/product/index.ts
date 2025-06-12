import { get, post, put, del } from '@/utils/request';

// 产品管理模块接口地址
enum API {
  // 产品
  LIST_URL = '/server/product/query-list',
  ADD_URL = '/server/product/add-product',
  UPDATE_URL = '/server/product/update-product',

  // 产品单位
  UNIT_LIST = '/server/product/update-product',
}

// 产品管理模块接口方法
export const reqProductList = (params = {}) => get(API.LIST_URL, params);

export const reqAddProduct = (data = {}) => post(API.ADD_URL, data);

export const reqUpdateProduct = (data = {}) => put(API.UPDATE_URL, data);

// 产品单位管理模块接口方法
export const reqUnitList = () => get(API.UNIT_LIST);

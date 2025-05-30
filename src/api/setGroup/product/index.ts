import request from '@/utils/request';
// 产品管理模块接口地址
enum API {
  // 获取产品列表
  LIST_URL = '/server/product/query-list',
  ADD_URL = '/server/product/add-product',
  UPDATE_URL = '/server/product/update-product',
}

export const reqProductList = (data: any) => request.get<any, any>(API.LIST_URL + data);

export const reqAddProduct = (data: any) => request.post<any, any>(API.ADD_URL, data);

export const reqUpdateProduct = (data: any) => request.post<any, any>(API.UPDATE_URL, data);

// {
//     "id": 1,
//     "isDelete": 0,
//     "remark": "string",
//     "productName": "服务产品名称",
//     "productEncode": "0001",
//     "productPrice": 0,
//     "vipProductPrice": 0,
//     "isDiscount": 0,
//     "commissionType": "string",
//     "productCommissionValue": 0,
//     "productCommissionPrice": 0
// }

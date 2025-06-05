// 产品相关的数据ts类型
export interface ResponseData {
  code: number;
  message: string;
  data: string;
}

// 产品对象的ts类型
export interface Product {
  id: number;
  remark: string;
  productName: string;
  productEncode: string;
  productPrice: number;
  vipProductPrice: number;
  isDiscount: number;
  commissioinType: number;
  productCommissionValue: number;
  productCommissionPrice: number;
  productStatus: number;
  unit: number;
}

// 产品列表返回的数据类型
export interface ResponseDataList {
  code: number;
  message: string;
  data: Product[];
}

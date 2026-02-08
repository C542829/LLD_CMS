import type { ElPagination, TableInstance, FormInstance, ButtonInstance, TagInstance } from 'element-plus';
declare global {
  type ButtonType = ButtonInstance['type'];
  type SizeType = ButtonInstance['size'];
  type ElTagType = TagInstance['type'];
  type ElTableProps = TableInstance['$props'];
  type ElFormInstance = FormInstance;

  // 弹窗类型
  type DialogType = 'add' | 'view' | 'edit';

  /** 所有 api 接口的响应数据都应该准守该格式 */
  interface ApiResponseData<T> {
    code: number;
    data: T;
    message: string;
  }
  /** api 响应数据格式（函数返回值） */
  type ApiResponse<T> = Promise<ApiResponseData<T>>;

  // element 类型问题，去掉只读属性限制
  interface ElPaginationProps
    extends Omit<InstanceType<typeof ElPagination>['$props'], 'currentPage' | 'pageSize' | 'total'> {
    currentPage?: number;
    pageSize?: number;
    total?: number;
  }
  interface OptionItem {
    value: string | number;
    label: string;
    // [key: string]: any;
  }
  interface TreeDataItem {
    label: string; //	树节点显示的内容	string|slot	'---'
    value?: string; //	树节点显示的内容	string|slot	'---'
    disabled?: boolean; //是否禁用	boolean	false
    isLeaf?: boolean; //	是否是叶子节点	boolean	false 叶子节点就是有展开框
    children?: TreeDataItem[];
  }

  interface CommonPageListParam {
    page?: number; // 当前页码
    limit?: number; // 当前页码
  }
  interface PageInfo extends CommonPageListParam {
    total: number; //	总条目数
    page: number; //	当前页码
    limit: number; //	每页条数
  }
  // 分页列表参数 可以扩展额外参数
  type PageListParam<OtherParam = unknown> = CommonPageListParam & {
    [P in keyof OtherParam]: OtherParam[P];
  };

  // 分页列表接口返回值
  interface PageListInfo<List = unknown> {
    pageNo: number; // 当前页码
    pageSize: number; // 每页多少个
    records: List[];
    totalCount: number;
  }
  // 分页列表接口返回值
  interface PageListInfo<List = unknown> {
    rows: List[];
    total: number;
  }
}

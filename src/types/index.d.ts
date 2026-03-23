import type { ElPagination, TableInstance, FormInstance, ButtonInstance, TagInstance } from 'element-plus';
declare global {
  type ButtonType = ButtonInstance['type'];
  type SizeType = ButtonInstance['size'];
  type ElTagType = TagInstance['type'];
  type ElTableProps = TableInstance['$props'];
  type ElFormInstance = FormInstance;

  /** 弹窗类型 */
  type DialogType = 'add' | 'view' | 'edit';

  /** 所有 api 接口的响应数据都应该准守该格式 */
  interface ApiResponseData<T> {
    code: number;
    data: T;
    message: string;
  }
  /** api 响应数据格式（函数返回值） */
  type ApiResponse<T> = Promise<ApiResponseData<T>>;

  /** 分页列表接口返回值 */
  interface PageListInfo<List = unknown> {
    pageNum: number; // 当前页码
    pageSize: number; // 每页大小
    rows: List[]; // 当前页数据
    total: number; // 总记录数
    totalPage?: number; // 总页数
  }

  /** element 类型问题，去掉只读属性限制 */
  interface ElPaginationProps
    extends Omit<InstanceType<typeof ElPagination>['$props'], 'currentPage' | 'pageSize' | 'total'> {
    currentPage?: number;
    pageSize?: number;
    total?: number;
  }

  /** 下拉选择项 */
  interface OptionItem {
    value: string | number;
    label: string;
    // [key: string]: any;
  }

  /** 树节点数据 */
  interface TreeDataItem {
    label: string; //	树节点显示的内容	string|slot	'---'
    value?: string; //	树节点显示的内容	string|slot	'---'
    disabled?: boolean; //是否禁用	boolean	false
    isLeaf?: boolean; //	是否是叶子节点	boolean	false 叶子节点就是有展开框
    children?: TreeDataItem[];
  }

  /** 分页列表参数 */
  interface PageInfo {
    pageNum: number; //	当前页码
    pageSize: number; //	每页大小
    total: number; //	总记录数
  }
}

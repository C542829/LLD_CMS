import { reqQueryPermTreeByUser } from '@/api/acl/permission';
import { parseResList } from '@/utils/parseResponse';

/**
 * 用于过滤当前用户需要展示的异步路由
 * @param asyncRoute 异步路由
 * @param routes 当前用户权限
 * @returns
 */
export function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes);
      }
      return true;
    }
  });
}

/**
 * 根据用户ID获取权限树
 * @param userId 用户ID
 * @returns 用户权限树
 */
const getPermTreeByUserId = async (userId: number) => {
  const res = await reqQueryPermTreeByUser(userId);
  let data = parseResList(res);
  return data;
};

// export const getRoutes = (item) => {
//   const result = { routes: [], buttons: [] };
//   const perms = await getPermTreeByUserId(this.userId);
//   const routes = perms.treeMap((item) => item.component);
//   this.buttons = perms
//     .treeMap((item) => item.permCode)
//     .filter((item: string) => {
//       const btnCode = ['add', 'update', 'disabled'];
//       for (const code of btnCode) {
//         if (item.includes(code)) {
//           return true;
//         }
//       }
//     });
//   this.tabs = perms.treeMap((item) => item.remark && [...item.children.map((child: any) => child.name)]).flat();
//   const userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), routes);
//   this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute];
//   return result;
// };

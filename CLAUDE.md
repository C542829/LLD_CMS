# LLD_CMS - 刘丽德采耳修脚 POS 前端

Vue 3 + TypeScript + Vite POS/CMS 系统，用于采耳修脚连锁门店管理。

## 技术栈

Vue 3, TypeScript, Pinia, Vue Router 4, Element Plus, UnoCSS, Axios, ECharts, XLSX, moment, lodash, sass

## 常用命令

```bash
pnpm dev          # 启动开发服务器 (http://localhost:5173)
pnpm build        # 生产构建
pnpm build:test   # 测试环境构建
pnpm build:pro    # 生产环境构建
pnpm lint         # ESLint 检查
pnpm lint:eslint  # ESLint 修复
pnpm lint:style   # Stylelint 修复
pnpm format       # Prettier 格式化
```

## 项目结构

```
src/
├── api/            # API 层，按业务域划分子目录
│   ├── acl/        # 权限管理 (组织/角色/权限/字典)
│   ├── member/     # 会员 (会员卡/充值/优惠券/充值活动)
│   ├── order/      # 订单
│   ├── setGroup/   # 设置 (产品/服务/套餐/房间/库存)
│   ├── dataGroup/  # 数据统计 (销售数据/员工业绩)
│   ├── home/       # 首页数据
│   ├── sys/        # 系统
│   └── user/       # 用户
├── components/     # 全局共享组件 (通过 Vue plugin 注册)
├── composables/    # Vue 组合式函数
├── directive/      # 自定义指令 (has: 按钮级权限控制)
├── enums/          # 枚举和常量
├── layout/         # 应用布局壳
├── router/         # 路由定义与权限过滤
├── store/          # Pinia 状态管理 (modules/ 下按域划分)
├── styles/         # 全局 SCSS 样式
├── types/          # 全局 TypeScript 类型声明
├── utils/          # 工具函数
└── views/          # 页面级视图组件
```

## 核心约定

### API 模式

每个业务域一个子目录，包含：

- `index.ts` — 导出请求函数（前缀 `req`，如 `reqRoleList`）
- `types.ts` — 导出 DTO/VO 接口类型
- URL 以本地 `enum API` 定义

```typescript
enum API {
  LIST = '/role/list',
  ADD = '/role',
}
export const reqRoleList = (params: RoleListParams) => get<ApiResponse<PageResult<RoleVO>>>(API.LIST, params);
```

### Store 模式

Pinia Options API 风格，Store ID 用 PascalCase 字符串：

```typescript
export const useUserStore = defineStore('User', {
  state: () => ({ ... }),
  getters: { ... },
  actions: { ... },
})
```

### 路由与权限

- 三类路由：`constantRoute`（公开）、`asyncRoute`（权限控制）、`anyRoute`（兜底）
- 动态注入：登录后从后端获取权限树，过滤 `asyncRoute` 后通过 `router.addRoute()` 注册
- 路由 meta：`title`（菜单标题）、`icon`（图标）、`hidden`（隐藏菜单）、`tabs`（标签页）

### 响应处理

- HTTP 客户端：`@/utils/request` — Axios 封装，自动注入 token，处理 401/403
- 业务响应码：`ResponseCode.SUCCESS = 10000` 表示成功
- 解析工具：`parseRes`（通用）、`parseResMsg`（带消息提示）、`parseResObj`（返回对象）、`parseResList`（返回数组）

### 枚举三件套

每个业务枚举包含三部分：

1. `enum` 声明（如 `PaymentType`）
2. `Map` 对象（如 `paymentTypeMap`，用于显示）
3. `Options` 数组（如 `paymentTypeOptions`，用于表单控件）

### 全局组件

在 `src/components/index.ts` 中通过 `app.component()` 全局注册，无需单独引入。
常用：`Table`、`PaginationTable`、`Dialog`、`Drawer`、`Form`、`Select`、`DictSelect`、`SearchMember`、`SvgIcon`

### 日期业务逻辑

`useDateShortcuts` 中实现业务日逻辑：0:00-7:00 算作前一天。

## 环境配置

开发环境代理 `/api` 到后端服务器，配置在 `.env.development`。

### Git 提交规范

- 格式：`模块名[类型] 描述`
- 类型：`feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`test`、`chore`、`build`
- 优先使用中文提交信息
- 描述最多 50 个字符
- 不要添加与本次提交无关的信息

## Superpowers 文档规范

所有 superpowers 产出的设计文档和计划文档统一放在 `docs/superpowers/<日期>-<需求名称>/` 目录下，按需求分类组织，不使用 `plans/` 或 `specs/` 等平面目录。

### 目录结构

```
docs/superpowers/
├── 2026-04-01-组织关系/                          # 需求名称（中文）
│   ├── 2026-04-01-org-relation-design.md    # 设计文档
│   ├── 2026-04-01-org-relation.md           # 实现计划
│   └── 门店关联关系重构-后端接口文档.md      # 附加文档
├── 2026-04-09-券作为支付方式/
│   ├── 2026-04-09-ticket-as-payment-design.md
│   └── 2026-04-09-ticket-as-payment.md
└── ...
```

### 文件命名规则

- **设计文档**：`YYYY-MM-DD-<英文短名>-design.md`
- **实现计划**：`YYYY-MM-DD-<英文短名>.md`
- **附加文档**：使用中文名称（如前端对接文档）
- 日期使用文档创建日期

### 创建流程

1. 新需求启动时，先在 `docs/superpowers/` 下创建中文命名的需求文件夹
2. brainstorming/设计阶段产出的文档直接写入该文件夹
3. 实现计划也写入同一文件夹
4. 如果需求迭代产生新版本，使用新日期前缀创建新文件，保留旧文件

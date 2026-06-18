# setGroup 模块重构报告

> **重构周期**：2026 年 5 月 11 日 ~ 2026 年 5 月 13 日
> **生成时间**：2026 年 5 月 13 日
> **提交者**：Cai

---

## 一、重构背景

`src/views/setGroup/` 下的子模块（产品管理、服务项目管理、疗程券管理等）存在以下问题：

1. **数据逻辑耦合在 Pinia store 中**：store 过于臃肿，包含了搜索参数、表单数据、列表数据、CRUD 操作等所有逻辑
2. **全局 loading 状态**：使用 `settingStore.loading` 控制加载状态，无法支持多模块并行加载
3. **类型定义不完整**：大量使用 `any`，缺乏 DTO/VO 类型定义
4. **表单组件与列表页耦合**：Drawer 未独立封装，部分模块使用 `form.vue` + 父组件管理 Drawer 的方式

**重构目标**：将数据逻辑下沉到组件内部、完善类型定义、统一封装独立的 DrawerForm 组件。

---

## 二、涉及模块清单

### 2.1 psMain 下的子模块（5 个）

| 模块         | 路径                                             | 原 Store 文件                                       |
| ------------ | ------------------------------------------------ | --------------------------------------------------- |
| 产品管理     | `views/setGroup/psMain/productManager/`          | `store/modules/setGroup/product.ts`                 |
| 服务项目管理 | `views/setGroup/psMain/serviceItemManager/`      | `store/modules/setGroup/serviceItem.ts`             |
| 疗程券管理   | `views/setGroup/psMain/treatmentCouponManager/`  | `store/modules/setGroup/treatmentCoupon.ts`         |
| 套餐管理     | `views/setGroup/psMain/packageManager/`          | `store/modules/setGroup/package.ts`                 |
| 充值提成规则 | `views/setGroup/psMain/rechargeCommissionRules/` | `store/modules/setGroup/rechargeCommissionRules.ts` |

### 2.2 stock 下的子模块（3 个）

| 模块     | 路径                             | 原 Store 文件                     |
| -------- | -------------------------------- | --------------------------------- |
| 入库管理 | `views/setGroup/stock/inStock/`  | `store/modules/setGroup/stock.ts` |
| 出库管理 | `views/setGroup/stock/outStock/` | `store/modules/setGroup/stock.ts` |
| 库存流水 | `views/setGroup/stock/stockLog/` | `store/modules/setGroup/stock.ts` |

### 2.3 roomBed 模块（1 个）

| 模块         | 路径                      | 原 Store 文件                    |
| ------------ | ------------------------- | -------------------------------- |
| 房间床位管理 | `views/setGroup/roomBed/` | `store/modules/setGroup/room.ts` |

---

## 三、重构方案

### 3.1 统一 DrawerForm 组件模式

为每个子模块创建独立的 `DrawerForm.vue` 组件，采用自管理 Drawer 模式：

**标准接口设计：**

```typescript
/** 弹窗类型 — 全局定义于 src/types/index.d.ts */
type DialogType = 'add' | 'view' | 'edit';

interface DrawerFormProps {
  modelValue: boolean; // 控制抽屉显示/隐藏（v-model）
  type: DialogType; // 操作类型
  data?: XxxVO; // 编辑/查看时的行数据
}

interface DrawerFormEmits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void; // 提交成功回调，通知父组件刷新列表
}
```

**内部实现要点：**

- 使用本地 `ref` 管理表单数据，不再依赖 store
- 使用 `cloneDeep` 初始化表单数据
- 提交时使用本地 `submitLoading` 控制按钮 loading
- 直接调用 API 函数（`reqAddXxx` / `reqUpdateXxx`）
- 成功后 emit `success` 事件，由父组件决定是否刷新列表

### 3.2 列表页改造

移除 store 依赖，改为组件内部管理：

```typescript
// 本地状态
const loading = ref(false)
const tableData = ref<XxxVO[]>([])
const searchParams = reactive({ ... })

// 查询方法
const fetchList = async () => {
  loading.value = true
  try {
    const res = await reqXxxList(searchParams)
    tableData.value = res.data || []
  } finally {
    loading.value = false
  }
}
```

### 3.3 类型定义完善

根据 OpenAPI 文档补充缺失的类型定义，命名规范：

- 查询参数：`XxxQueryParams`
- 响应对象：`XxxVO`
- 提交对象：`XxxDTO`
- 状态更新：`UpdateXxxStatusDTO`

### 3.4 Loading 状态管理

| 场景     | 实现方式                                           |
| -------- | -------------------------------------------------- |
| 列表查询 | 组件内部 `const loading = ref(false)`              |
| 表单提交 | DrawerForm 内部 `const submitLoading = ref(false)` |
| 状态切换 | 直接调用 API，无需额外 loading                     |

---

## 四、实施详情

### 4.1 阶段一：完善 API 类型定义

#### 新建的类型文件（3 个）

| 文件路径                                    | 新增类型                                                                                                                                                                |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/api/setGroup/treatmentCoupon/types.ts` | `CureTicketQueryParams`、`CureTicketVO`、`CureTicketCreateDTO`、`CureTicketUpdateDTO`、`UpdateCureTicketStatusDTO`、`RelatedTicketDTO`、`TicketDetailVO`、`OrgSimpleVO` |
| `src/api/setGroup/package/types.ts`         | `PackageQueryParams`、`PackageListVO`、`PackageInfoVO`、`PackageInfoDTO`、`PackageDetailDTO`                                                                            |
| `src/api/setGroup/room/types.ts`            | `RoomInfoVO`、`RoomCreateDTO`、`RoomUpdateDTO`、`RoomBedVO`、`BedCreateDTO`、`UpdateBedNameDTO`、`UpdateBedStatusDTO`、`BedQueryParams`、`RoomQueryParams`              |

#### 更新的类型文件（3 个）

| 文件路径                                            | 变更内容                                                                                                                                       |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/api/setGroup/serviceItem/types.ts`             | 新增 `ServerItemCreateDTO`、`ServerItemUpdateDTO`、`UpdateServerItemStatusDTO`                                                                 |
| `src/api/setGroup/rechargeCommissionRules/types.ts` | 从空文件补充完整：`RechargeRoleQueryParams`、`RechargeRoleVO`、`RechargeRoleCreateDTO`、`RechargeRoleUpdateDTO`、`UpdateRechargeRoleStatusDTO` |
| `src/api/setGroup/product/type.ts`                  | `ProductDTO` 中 `null` 类型改为 `undefined` 以兼容 `el-input-number`                                                                           |

#### 更新的 API 接口文件（6 个）

| 文件路径                                            | 变更内容                                                                                     |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `src/api/setGroup/serviceItem/index.ts`             | 所有函数签名补充类型参数                                                                     |
| `src/api/setGroup/treatmentCoupon/index.ts`         | 补充类型、修正函数签名                                                                       |
| `src/api/setGroup/package/index.ts`                 | 补充类型                                                                                     |
| `src/api/setGroup/rechargeCommissionRules/index.ts` | 补充类型、新增 `reqUpdateRechargeRoleStatus`                                                 |
| `src/api/setGroup/room/index.ts`                    | 所有函数签名补充类型参数                                                                     |
| `src/api/setGroup/stock/index.ts`                   | 补充 `SearchParams`、`InStockAddRequest`、`OutStockAddRequest` 类型；移除未使用的 `put` 导入 |

---

### 4.2 阶段二：创建独立 DrawerForm 组件

共创建 **8 个** DrawerForm 组件：

| 文件路径                                                                      | 模块               |
| ----------------------------------------------------------------------------- | ------------------ |
| `src/views/setGroup/psMain/productManager/components/DrawerForm.vue`          | 产品管理           |
| `src/views/setGroup/psMain/serviceItemManager/components/DrawerForm.vue`      | 服务项目管理       |
| `src/views/setGroup/psMain/treatmentCouponManager/components/DrawerForm.vue`  | 疗程券管理（重写） |
| `src/views/setGroup/psMain/packageManager/components/DrawerForm.vue`          | 套餐管理           |
| `src/views/setGroup/psMain/rechargeCommissionRules/components/DrawerForm.vue` | 充值提成规则       |
| `src/views/setGroup/stock/inStock/components/DrawerForm.vue`                  | 入库管理（后删除） |
| `src/views/setGroup/stock/outStock/components/DrawerForm.vue`                 | 出库管理（后删除） |
| `src/views/setGroup/roomBed/components/DrawerForm.vue`                        | 房间床位管理       |

> **注**：入库/出库的 DrawerForm 后因 index.vue 仍使用 `CreateOrder.vue` 组件模式（Dialog + 产品选择器），未实际集成，已删除。

**标准 DrawerForm 模板（以产品管理为参考）：**

```vue
<template>
  <Drawer v-model="drawerVisible" :title="drawerTitle" @closed="handleDrawerClose">
    <Form
      :model="formdata"
      :rules="formRules"
      :showButtons="!formDisabled"
      :disabled="formDisabled"
      :loading="submitLoading"
      @submit="handleFormSubmit"
      @reset="handleFormReset"
    >
      <!-- 表单字段 -->
    </Form>
    <div v-show="formDisabled" class="drawer-buttons">
      <el-button @click="drawerVisible = false">取消</el-button>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
interface Props {
  type: DialogType;
  modelValue: boolean;
  data?: XxxVO;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  modelValue: false,
});

const emit = defineEmits(['update:model-value', 'close', 'success']);

// 双向绑定
watch(
  () => props.modelValue,
  (newVal) => {
    drawerVisible.value = newVal;
  },
);

// 本地状态
const drawerVisible = ref(false);
const submitLoading = ref(false);
const formdata = ref<XxxDTO>(cloneDeep(DEFAULT_FORMDATA));

// 计算属性
const drawerTitle = computed(() => {
  switch (props.type) {
    case 'add':
      return '新增 XXX';
    case 'edit':
      return '编辑 XXX';
    case 'view':
      return 'XXX 详情';
  }
});
const formDisabled = computed(() => props.type === 'view');

// 提交
const handleFormSubmit = async () => {
  submitLoading.value = true;
  try {
    const res = await reqAddXxx(formdata.value); // 或 reqUpdateXxx
    if (res.code === 10000) {
      Message.success('操作成功');
      drawerVisible.value = false;
      emit('success');
    }
  } finally {
    submitLoading.value = false;
  }
};
</script>
```

---

### 4.3 阶段三：重构列表页

共重构 **9 个** 列表页 `index.vue`：

| 文件路径                                                      | 模块         |
| ------------------------------------------------------------- | ------------ |
| `src/views/setGroup/psMain/productManager/index.vue`          | 产品管理     |
| `src/views/setGroup/psMain/serviceItemManager/index.vue`      | 服务项目管理 |
| `src/views/setGroup/psMain/treatmentCouponManager/index.vue`  | 疗程券管理   |
| `src/views/setGroup/psMain/packageManager/index.vue`          | 套餐管理     |
| `src/views/setGroup/psMain/rechargeCommissionRules/index.vue` | 充值提成规则 |
| `src/views/setGroup/stock/inStock/index.vue`                  | 入库管理     |
| `src/views/setGroup/stock/outStock/index.vue`                 | 出库管理     |
| `src/views/setGroup/stock/stockLog/index.vue`                 | 库存流水     |
| `src/views/setGroup/roomBed/index.vue`                        | 房间床位管理 |

**改造要点：**

1. 移除 `useXxxStore` 导入和依赖
2. 添加本地 `loading`、`tableData`、`searchParams` 状态
3. 实现本地 `fetchList` 方法直接调用 API
4. 集成独立的 DrawerForm 组件
5. `v-loading` 绑定本地 `loading` 而非 `settingStore.loading`
6. 状态切换操作直接调用 API，成功后调用 `masterDataStore.invalidate()` 清除缓存

---

### 4.4 阶段四：清理废弃文件

#### 删除的 Store 文件（5 个）

| 文件路径                                                | 说明                                     |
| ------------------------------------------------------- | ---------------------------------------- |
| `src/store/modules/setGroup/product.ts`                 | 产品管理 Store，已被组件内部逻辑替代     |
| `src/store/modules/setGroup/stock.ts`                   | 库存管理 Store，已被组件内部逻辑替代     |
| `src/store/modules/setGroup/treatmentCoupon.ts`         | 疗程券管理 Store，已被组件内部逻辑替代   |
| `src/store/modules/setGroup/package.ts`                 | 套餐管理 Store，已被组件内部逻辑替代     |
| `src/store/modules/setGroup/rechargeCommissionRules.ts` | 充值提成规则 Store，已被组件内部逻辑替代 |

#### 保留的 Store 文件（2 个）

| 文件路径                                    | 保留原因                                  |
| ------------------------------------------- | ----------------------------------------- |
| `src/store/modules/setGroup/room.ts`        | 被 `bedStatus` 和 `saleMain` 模块外部引用 |
| `src/store/modules/setGroup/serviceItem.ts` | 被 `member/memberCoupon` 模块外部引用     |

#### 删除的旧表单文件（5 个）

| 文件路径                                                     | 说明                     |
| ------------------------------------------------------------ | ------------------------ |
| `src/views/setGroup/psMain/productManager/form.vue`          | 已被 DrawerForm.vue 替代 |
| `src/views/setGroup/psMain/serviceItemManager/form.vue`      | 已被 DrawerForm.vue 替代 |
| `src/views/setGroup/psMain/treatmentCouponManager/form.vue`  | 已被 DrawerForm.vue 替代 |
| `src/views/setGroup/psMain/packageManager/form.vue`          | 已被 DrawerForm.vue 替代 |
| `src/views/setGroup/psMain/rechargeCommissionRules/form.vue` | 已被 DrawerForm.vue 替代 |

#### 删除的未使用文件（2 个 + 2 个空目录）

| 文件路径                                                      | 说明                                            |
| ------------------------------------------------------------- | ----------------------------------------------- |
| `src/views/setGroup/stock/inStock/components/DrawerForm.vue`  | 入库 index.vue 使用 CreateOrder 而非 DrawerForm |
| `src/views/setGroup/stock/outStock/components/DrawerForm.vue` | 出库 index.vue 使用 CreateOrder 而非 DrawerForm |
| `src/views/setGroup/stock/inStock/components/`                | 空目录已清理                                    |
| `src/views/setGroup/stock/outStock/components/`               | 空目录已清理                                    |

---

## 五、附加修复

### 5.1 CreateOrder.vue 移除 Store 依赖

`src/views/setGroup/stock/components/CreateOrder.vue` 是入库/出库共用的创建订单组件，原本依赖 `useStockStore` 和 `useProductStore`。

**修改内容：**

- 移除 `useStockStore`、`useProductStore` 导入
- 改用直接 API 调用：`reqProductList`、`reqInStockAdd`、`reqOutStockAdd`
- 移除 `$Message` inject，改用 `import Message from '@/components/Message'`
- 移除 `inject` 从 vue 导入

### 5.2 TypeScript 类型修复

| 文件                                                | 修复内容                                                              |
| --------------------------------------------------- | --------------------------------------------------------------------- | --- | ----------------------- |
| `treatmentCouponManager/components/DrawerForm.vue`  | `getVipTicketList()` → `getTicketList()`（方法名错误）                |
| `store/modules/setGroup/room.ts`                    | `reqRoomList(searchParams.value)` → `reqRoomList()`（参数不匹配）     |
| `api/setGroup/package/types.ts`                     | `PackageListVO` 补充 `packageStatus` 字段                             |
| `api/setGroup/product/type.ts`                      | `ProductDTO` 中 `number \| null` 改为 `number \| undefined`           |
| `packageManager/components/DrawerForm.vue`          | `DEFAULT_FORMDATA.id` 从 `null` 改为 `undefined`                      |
| `rechargeCommissionRules/components/DrawerForm.vue` | `DEFAULT_FORMDATA.rechargeCommissionValue` 从 `null` 改为 `undefined` |
| `productManager/components/DrawerForm.vue`          | `DEFAULT_FORMDATA` 中所有 `null` 改为 `undefined`                     |
| `packageManager/components/DrawerForm.vue`          | `:selectedList` 增加 `                                                |     | []` 防止 undefined 传递 |

### 5.3 代码格式化

对以下 API 文件执行 Prettier 格式化修复：

- `src/api/setGroup/package/index.ts`
- `src/api/setGroup/room/index.ts`
- `src/api/setGroup/stock/index.ts`
- `src/api/setGroup/treatmentCoupon/index.ts`

---

## 六、变更文件总览

### 新增文件（11 个）

| 序号 | 文件路径                                                                      | 类型       |
| ---- | ----------------------------------------------------------------------------- | ---------- |
| 1    | `src/api/setGroup/treatmentCoupon/types.ts`                                   | API 类型   |
| 2    | `src/api/setGroup/package/types.ts`                                           | API 类型   |
| 3    | `src/api/setGroup/room/types.ts`                                              | API 类型   |
| 4    | `src/views/setGroup/psMain/productManager/components/DrawerForm.vue`          | DrawerForm |
| 5    | `src/views/setGroup/psMain/serviceItemManager/components/DrawerForm.vue`      | DrawerForm |
| 6    | `src/views/setGroup/psMain/treatmentCouponManager/components/DrawerForm.vue`  | DrawerForm |
| 7    | `src/views/setGroup/psMain/packageManager/components/DrawerForm.vue`          | DrawerForm |
| 8    | `src/views/setGroup/psMain/rechargeCommissionRules/components/DrawerForm.vue` | DrawerForm |
| 9    | `src/views/setGroup/roomBed/components/DrawerForm.vue`                        | DrawerForm |
| 10   | `doc/setGroup模块重构报告-2026年5月13日.md`                                   | 文档       |

### 修改文件（18 个）

| 序号 | 文件路径                                                      | 变更摘要                         |
| ---- | ------------------------------------------------------------- | -------------------------------- |
| 1    | `src/api/setGroup/serviceItem/types.ts`                       | 补充 DTO 类型                    |
| 2    | `src/api/setGroup/serviceItem/index.ts`                       | 函数签名补充类型                 |
| 3    | `src/api/setGroup/treatmentCoupon/index.ts`                   | 补充类型、格式化                 |
| 4    | `src/api/setGroup/package/index.ts`                           | 补充类型、格式化                 |
| 5    | `src/api/setGroup/rechargeCommissionRules/types.ts`           | 从空文件补充完整类型             |
| 6    | `src/api/setGroup/rechargeCommissionRules/index.ts`           | 补充类型、新增状态更新接口       |
| 7    | `src/api/setGroup/room/index.ts`                              | 补充类型、格式化                 |
| 8    | `src/api/setGroup/stock/index.ts`                             | 补充类型、移除 unused import     |
| 9    | `src/api/setGroup/product/type.ts`                            | `null` → `undefined` 类型修正    |
| 10   | `src/views/setGroup/psMain/productManager/index.vue`          | 移除 store 依赖，集成 DrawerForm |
| 11   | `src/views/setGroup/psMain/serviceItemManager/index.vue`      | 移除 store 依赖，集成 DrawerForm |
| 12   | `src/views/setGroup/psMain/treatmentCouponManager/index.vue`  | 移除 store 依赖，集成 DrawerForm |
| 13   | `src/views/setGroup/psMain/packageManager/index.vue`          | 移除 store 依赖，集成 DrawerForm |
| 14   | `src/views/setGroup/psMain/rechargeCommissionRules/index.vue` | 移除 store 依赖，集成 DrawerForm |
| 15   | `src/views/setGroup/stock/inStock/index.vue`                  | 移除 store 依赖，本地 loading    |
| 16   | `src/views/setGroup/stock/outStock/index.vue`                 | 移除 store 依赖，本地 loading    |
| 17   | `src/views/setGroup/stock/stockLog/index.vue`                 | 移除 store 依赖，本地 loading    |
| 18   | `src/views/setGroup/roomBed/index.vue`                        | 移除 store 依赖，集成 DrawerForm |
| 19   | `src/views/setGroup/stock/components/CreateOrder.vue`         | 移除 store 依赖，直接 API 调用   |
| 20   | `src/store/modules/setGroup/room.ts`                          | 修复参数问题                     |

### 删除文件（12 个）

| 序号 | 文件路径                                                      | 类型       |
| ---- | ------------------------------------------------------------- | ---------- |
| 1    | `src/store/modules/setGroup/product.ts`                       | Store      |
| 2    | `src/store/modules/setGroup/stock.ts`                         | Store      |
| 3    | `src/store/modules/setGroup/treatmentCoupon.ts`               | Store      |
| 4    | `src/store/modules/setGroup/package.ts`                       | Store      |
| 5    | `src/store/modules/setGroup/rechargeCommissionRules.ts`       | Store      |
| 6    | `src/views/setGroup/psMain/productManager/form.vue`           | 旧表单     |
| 7    | `src/views/setGroup/psMain/serviceItemManager/form.vue`       | 旧表单     |
| 8    | `src/views/setGroup/psMain/treatmentCouponManager/form.vue`   | 旧表单     |
| 9    | `src/views/setGroup/psMain/packageManager/form.vue`           | 旧表单     |
| 10   | `src/views/setGroup/psMain/rechargeCommissionRules/form.vue`  | 旧表单     |
| 11   | `src/views/setGroup/stock/inStock/components/DrawerForm.vue`  | 未使用组件 |
| 12   | `src/views/setGroup/stock/outStock/components/DrawerForm.vue` | 未使用组件 |

---

## 七、验证结果

### 7.1 ESLint 检查

```bash
pnpm lint
```

setGroup 相关文件无新增 error（仅剩 `room.ts` 中一个已修复的 `prefer-const` 警告）。

### 7.2 构建验证

```bash
pnpm build
```

setGroup 相关文件全部通过 TypeScript 类型检查，无编译错误。其余报错均为项目中已存在的历史问题。

---

## 八、后续建议

| 项目                                    | 说明                                                                                  | 优先级 |
| --------------------------------------- | ------------------------------------------------------------------------------------- | ------ |
| `room.ts` / `serviceItem.ts` Store 清理 | 这两个 Store 仍被外部模块引用，待外部模块也迁移后可删除                               | 中     |
| `CreateOrder.vue` 进一步重构            | 入库/出库的创建订单组件仍使用 Dialog + CreateOrder 模式，可考虑统一为 DrawerForm 模式 | 低     |
| 外部模块 Store 依赖迁移                 | `bedStatus`、`saleMain`、`memberCoupon` 仍依赖 setGroup 下的 Store                    | 中     |
| 补充单元测试                            | 为 DrawerForm 组件和列表页的关键交互逻辑补充测试                                      | 低     |

<template>
  <!-- 使用高阶组件渲染 Element-Plus 对话框 -->
  <component :is="h(ElDialog, { ...$attrs, ...props, ref: changeRef }, $slots)" style="max-width: 550px">
    <div class="main">
      <!-- 添加类型的表单组件 -->
      <div>
        <BtnForm @submit="add" btnText="新增类型" tipText="请输入" />
        <el-button type="success" @click="getList" ref="refBtn">刷新数据</el-button>
      </div>

      <!-- 类型列表表格 -->
      <el-table :data="tableData" :border="true" max-height="400" stripe class="enum-table">
        <!-- 类型名列 - 使用动态输入组件支持编辑 -->
        <el-table-column prop="value" label="类型名" min-width="230">
          <template #default="scope">
            <DynamicInput :value="scope.row.value" :params="scope.row" @update="update" />
          </template>
        </el-table-column>

        <!-- 操作列 - 包含删除按钮 -->
        <el-table-column label="操作" min-width="100" :align="'center'">
          <template #default="scope">
            <el-button link type="warning" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </component>
</template>

<script setup lang="ts">
import { ElDialog, type DialogProps } from 'element-plus';
import { ref, onMounted, inject, h, getCurrentInstance } from 'vue';
import { parseReqInform, parseReqList } from '@/utils/feedback';

// 注入 Element-Plus 的消息框服务
const $MessageBox: any = inject('$MessageBox');

/**
 * 组件属性接口定义
 * - 继承 DialogProps 并覆盖/扩展部分属性
 * - config: 配置对象，包含API调用方法和父级ID
 */
interface MyDialogProps extends Omit<Partial<DialogProps>, 'config'> {
  config: {
    parentId: number; // 父级ID，用于API调用
    setListFn: Function; // 获取列表数据的函数
    addFn: Function; // 添加类型的API方法
    updateFn: Function; // 更新类型的API方法
    delFn: Function; // 删除类型的API方法
  };
}

// 定义组件属性
const props = defineProps<MyDialogProps>();

// 获取当前组件实例，用于暴露对话框方法
const vm: any = getCurrentInstance();
function changeRef(dialogInstance: any) {
  // 将对话框实例挂载到组件实例上，便于父组件调用
  vm.exposeProxy = vm.exposed = dialogInstance || {};
}

// 表格数据
const tableData: any = ref([]);

const refBtn = ref(null);

// 组件挂载后初始化表格数据
onMounted(async () => {
  getList();
});

const getList = async () => {
  const params = { parentId: props.config.parentId };
  const res = await props.config.setListFn(params);
  tableData.value = parseReqList(res);
  console.log('枚举数据：', tableData.value);
};

/**
 * 添加类型处理函数
 * @param value - 输入的类型名称
 */
const add = async (value: string) => {
  // 使用统一的通知处理函数（显示加载状态、成功/失败提示）
  const data = { parentId: props.config.parentId, value };
  const res = await props.config.addFn(data);
  const result = parseReqInform(res);
  result && getList();
};

/**
 * 更新类型处理函数
 * @param data - 包含更新参数和新值的对象
 */
const update = async (data: any) => {
  const params = { id: data.params.id, parentId: data.params.parentId, value: data.value };
  const res = await props.config.updateFn(params);
  const result = parseReqInform(res);
  result && getList();
};

/**
 * 删除类型处理函数
 * @param row - 当前行数据
 */
const del = async (row: any) => {
  // 显示确认对话框
  const confirm = await $MessageBox.confirm({
    title: '确认操作',
    message: `你确定要删除【${row.value}】吗？`,
    type: 'warning',
  });

  // 用户确认后执行删除
  if (confirm) {
    const params = { id: row.id };
    const res = await props.config.delFn(params);
    const result = parseReqInform(res);
    result && getList();
  }
};
</script>

<script lang="ts">
export default {
  name: 'EnumHandler',
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  gap: $main-padding; // 使用变量定义元素间距
  padding: $main-padding; // 使用变量定义内边距
  border-top: 1px solid var(--el-color-info-light-5); // 使用Element-Plus颜色变量
}

/* 使用深度选择器修改表格表头样式 */
:deep(.enum-table .el-table__header-wrapper th) {
  background-color: $base-child-nav-bg; // 使用自定义颜色变量
}
</style>

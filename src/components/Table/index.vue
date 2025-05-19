<template>
  <div>
    <el-table
      v-sticky-header
      :data="props.data"
      :height="tableHeight"
      :max-height="props.maxHeight"
      :stripe="props.stripe"
      :border="props.border"
      :size="props.size"
      :fit="props.fit"
      :show-header="props.showHeader"
      :highlight-current-row="props.highlightCurrentRow"
      :row-class-name="props.rowClassName"
      :row-style="props.rowStyle"
      :cell-class-name="props.cellClassName"
      :cell-style="props.cellStyle"
      :header-row-class-name="props.headerRowClassName"
      :header-row-style="props.headerRowStyle"
      :header-cell-class-name="props.headerCellClassName"
      :header-cell-style="props.headerCellStyle"
      :row-key="props.rowKey"
      :empty-text="props.emptyText"
      :default-expand-all="props.defaultExpandAll"
      :tree-props="props.treeProps"
      :default-sort="props.defaultSort"
      :tooltip-effect="props.tooltipEffect"
      :show-summary="props.showSummary"
      :sum-text="props.sumText"
      :summary-method="props.summaryMethod"
      :span-method="props.spanMethod"
      :select-on-indeterminate="props.selectOnIndeterminate"
      :indent="props.indent"
      :lazy="props.lazy"
      :load="props.load"
      :table-layout="props.tableLayout"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @selection-change="handleSelectionChange"
      @cell-mouse-enter="handleCellMouseEnter"
      @cell-mouse-leave="handleCellMouseLeave"
      @cell-click="handleCellClick"
      @cell-dblclick="handleCellDblclick"
      @cell-contextmenu="handleCellContextmenu"
      @row-click="handleRowClick"
      @row-contextmenu="handleRowContextmenu"
      @row-dblclick="handleRowDblclick"
      @header-click="handleHeaderClick"
      @header-contextmenu="handleHeaderContextmenu"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
      @current-change="handleCurrentChange"
      @header-dragend="handleHeaderDragend"
      @expand-change="handleExpandChange"
    >
      <!-- 表格列 -->
      <slot></slot>

      <!-- 自定义空数据显示 -->
      <template #empty v-if="$slots.empty">
        <slot name="empty"></slot>
      </template>

      <!-- 自定义表尾合计行 -->
      <template #append v-if="$slots.append">
        <slot name="append"></slot>
      </template>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, withDefaults } from 'vue';

// 定义事件
const $emit = defineEmits([
  'select',
  'select-all',
  'selection-change',
  'cell-mouse-enter',
  'cell-mouse-leave',
  'cell-click',
  'cell-dblclick',
  'cell-contextmenu',
  'row-click',
  'row-contextmenu',
  'row-dblclick',
  'header-click',
  'header-contextmenu',
  'sort-change',
  'filter-change',
  'current-change',
  'header-dragend',
  'expand-change',
]);

// 使用 withDefaults 添加默认值
const props = withDefaults(
  defineProps<{
    data: any[];
    height?: string | number;
    maxHeight?: string | number;
    stripe?: boolean;
    border?: boolean;
    size?: 'large' | 'default' | 'small';
    fit?: boolean;
    showHeader?: boolean;
    highlightCurrentRow?: boolean;
    rowClassName?: string | ((params: { row: any; rowIndex: number }) => string);
    rowStyle?: object | ((params: { row: any; rowIndex: number }) => object);
    cellClassName?: string | ((params: { row: any; column: any; rowIndex: number; columnIndex: number }) => string);
    cellStyle?: object | ((params: { row: any; column: any; rowIndex: number; columnIndex: number }) => object);
    headerRowClassName?: string | ((params: { row: any; rowIndex: number }) => string);
    headerRowStyle?: object | ((params: { row: any; rowIndex: number }) => object);
    headerCellClassName?:
      | string
      | ((params: { row: any; column: any; rowIndex: number; columnIndex: number }) => string);
    headerCellStyle?: object | ((params: { row: any; column: any; rowIndex: number; columnIndex: number }) => object);
    rowKey?: string | ((row: any) => string);
    emptyText?: string;
    defaultExpandAll?: boolean;
    treeProps?: { children: string; hasChildren: string };
    defaultSort?: { prop: string; order: 'ascending' | 'descending' };
    tooltipEffect?: 'dark' | 'light';
    showSummary?: boolean;
    sumText?: string;
    summaryMethod?: (params: { columns: any[]; data: any[] }) => any[];
    spanMethod?: (params: {
      row: any;
      column: any;
      rowIndex: number;
      columnIndex: number;
    }) => number[] | { rowspan: number; colspan: number };
    selectOnIndeterminate?: boolean;
    indent?: number;
    lazy?: boolean;
    load?: (row: any, treeNode: any, resolve: (data: any[]) => void) => void;
    tableLayout?: 'fixed' | 'auto';
  }>(),
  {
    data: () => [],
    height: window.innerHeight - 324,
    maxHeight: 'auto',
    stripe: false,
    border: true,
    size: 'default',
    fit: true,
    showHeader: true,
    highlightCurrentRow: false,
    emptyText: '暂无数据',
    defaultExpandAll: false,
    tooltipEffect: 'dark',
    showSummary: false,
    sumText: '合计',
    selectOnIndeterminate: true,
    indent: 16,
    lazy: false,
    tableLayout: 'fixed',
  },
);

// #region 动态修改表格元素的高度
// @ts-ignore
import { debounce } from 'lodash';
const tableHeight = ref(props.data.length == 0 ? 'auto' : props.height);
const resizeHandler = debounce(() => {
  tableHeight.value = props.data.length == 0 ? 'auto' : props.height;
}, 100);
window.addEventListener('resize', resizeHandler);
// #endregion

// #region 表格事件处理函数
const handleSelect = (selection: any[], row: any) => {
  $emit('select', selection, row);
};

const handleSelectAll = (selection: any[]) => {
  $emit('select-all', selection);
};

const handleSelectionChange = (selection: any[]) => {
  $emit('selection-change', selection);
};

const handleCellMouseEnter = (row: any, column: any, cell: HTMLElement, event: Event) => {
  $emit('cell-mouse-enter', row, column, cell, event);
};

const handleCellMouseLeave = (row: any, column: any, cell: HTMLElement, event: Event) => {
  $emit('cell-mouse-leave', row, column, cell, event);
};

const handleCellClick = (row: any, column: any, cell: HTMLElement, event: Event) => {
  $emit('cell-click', row, column, cell, event);
};

const handleCellDblclick = (row: any, column: any, cell: HTMLElement, event: Event) => {
  $emit('cell-dblclick', row, column, cell, event);
};

const handleCellContextmenu = (row: any, column: any, cell: HTMLElement, event: Event) => {
  $emit('cell-contextmenu', row, column, cell, event);
};

const handleRowClick = (row: any, column: any, event: Event) => {
  $emit('row-click', row, column, event);
};

const handleRowContextmenu = (row: any, column: any, event: Event) => {
  $emit('row-contextmenu', row, column, event);
};

const handleRowDblclick = (row: any, column: any, event: Event) => {
  $emit('row-dblclick', row, column, event);
};

const handleHeaderClick = (column: any, event: Event) => {
  $emit('header-click', column, event);
};

const handleHeaderContextmenu = (column: any, event: Event) => {
  $emit('header-contextmenu', column, event);
};

const handleSortChange = (params: { column: any; prop: string; order: string }) => {
  $emit('sort-change', params);
};

const handleFilterChange = (filters: any) => {
  $emit('filter-change', filters);
};

const handleCurrentChange = (currentRow: any, oldCurrentRow: any) => {
  $emit('current-change', currentRow, oldCurrentRow);
};

const handleHeaderDragend = (newWidth: number, oldWidth: number, column: any, event: Event) => {
  $emit('header-dragend', newWidth, oldWidth, column, event);
};

const handleExpandChange = (row: any, expanded: boolean) => {
  $emit('expand-change', row, expanded);
};
// #endregion
</script>
<style lang="scss" scoped></style>

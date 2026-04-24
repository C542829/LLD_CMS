<template>
  <div class="search-container">
    <div class="search-item">
      <label>
        <span>时间段：</span>
        <IDatePicker v-model="dateRange" @change="search" @clear="clearDate" class="w-220" />
      </label>
    </div>
    <div class="search-item">
      <label>
        <span>操作人：</span>
        <el-input v-model="searchParams.operator" placeholder="请输入操作人" clearable style="width: 110px" />
      </label>
    </div>
    <div class="search-item">
      <label>
        <span>订单号：</span>
        <el-input v-model="searchParams.orderCode" placeholder="请输入库存单号" clearable style="width: 180px" />
      </label>
    </div>
    <div class="search-item">
      <el-button type="primary" @click="search">搜索</el-button>
    </div>
    <div class="search-item">
      <el-button type="info" @click="reset">重置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const emit = defineEmits(['search']);

/** 日期范围 */
const dateRange = ref<string[]>([]);

const searchParams = reactive<any>({
  operator: '',
  orderCode: '',
  startTime: '',
  endTime: '',
});

const search = () => {
  // 处理日期范围参数
  if (Array.isArray(dateRange.value) && dateRange.value.length === 2) {
    searchParams.startTime = dateRange.value[0];
    searchParams.endTime = dateRange.value[1];
  } else {
    searchParams.startTime = '';
    searchParams.endTime = '';
  }
  emit('search', searchParams);
};

const reset = () => {
  searchParams.operator = '';
  searchParams.orderCode = '';
  searchParams.startTime = '';
  searchParams.endTime = '';
  dateRange.value = [];
  emit('search', searchParams);
};

const clearDate = () => {
  dateRange.value = [];
  searchParams.startTime = '';
  searchParams.endTime = '';
  emit('search', searchParams);
};
</script>

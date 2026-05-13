<template>
  <div class="search-container">
    <div class="search-item">
      <label>
        <span>时间段：</span>
        <IDatePicker v-model="dateRange" :default="false" @change="search" @clear="clearDate" class="w-220" />
      </label>
    </div>
    <div class="search-item">
      <label>
        <span>操作人：</span>
        <el-input v-model="searchParams.operator" placeholder="请输入操作人" clearable class="w-120" />
      </label>
    </div>
    <div class="search-item">
      <label>
        <span>订单号：</span>
        <el-input v-model="searchParams.orderCode" placeholder="请输入库存单号" clearable class="w-160" />
      </label>
    </div>
    <template v-if="type === 'log' && (userStore.isAdmin || userStore.isAreaManager)">
      <div class="search-item">
        <label>
          <span>门店：</span>
          <OrgSelect
            v-model="searchParams.orgId"
            placeholder="全部门店"
            class="w-120"
            :multiple="false"
            @change="search"
            @clear="search"
          />
        </label>
      </div>
    </template>
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
import useUserStore from '@/store/modules/acl/user';

interface Props {
  type: 'in' | 'out' | 'log';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'in',
});

const emit = defineEmits(['search']);

const userStore = useUserStore();

/** 日期范围 */
const dateRange = ref<string[]>([]);

const searchParams = reactive<any>({
  operator: '',
  orderCode: '',
  startTime: '',
  endTime: '',
  orgId: '',
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
  searchParams.orgId = '';
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

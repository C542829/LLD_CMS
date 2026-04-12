<template>
  <el-autocomplete
    v-model="inputValue"
    @input="(val: string) => emit('update:modelValue', val)"
    @select="handleSelect"
    :fetch-suggestions="querySearchAsync"
    :prefix-icon="Search"
    :placeholder="placeholder"
    :size="size"
    value-key="name"
    placement="bottom"
    clearable
    style="width: 200px"
  >
    <template #default="{ item }">
      <div class="mem-info-card">
        <p class="row text-overflow" :title="`姓名：${item.name}`">
          <span>姓名：</span>
          <span>{{ item.name }}</span>
        </p>
        <p class="row text-overflow" :title="`电话：${item.phoneNumber}`">
          <span>电话：</span>
          <span>{{ item.phoneNumber }}</span>
        </p>
        <p class="row text-overflow" :title="`卡号：${item.cardNumber}`">
          <span>卡号：</span>
          <span>{{ item.cardNumber }}</span>
        </p>
        <p class="row text-overflow" :title="`备注：${item.remark}`">
          <span>备注：</span>
          <span>{{ item.remark }}</span>
        </p>
      </div>
    </template>
    <template v-if="showSearchButton" #append>
      <el-button type="primary" size="large">搜索</el-button>
    </template>
  </el-autocomplete>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref, PropType, watch } from 'vue';
import { useMemberStore } from '@/store/modules/member/member';
const memberStore = useMemberStore();
const props = defineProps({
  modelValue: {
    type: String,
    default: () => '',
  },
  size: {
    type: String as PropType<'large' | 'default' | 'small'>,
    default: () => 'large',
  },
  placeholder: {
    type: String,
    default: () => '姓名 | 手机号 | 会员卡号',
  },
  showSearchButton: {
    type: Boolean,
    default: () => true,
  },
});
watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal;
  },
);
const emit = defineEmits(['update:modelValue', 'selected']);
// 搜索会员
const inputValue = ref(props.modelValue);
// 搜索联想会员列表
const querySearchAsync: (queryString: string, cb: (arg: any) => void) => void = async (
  queryString: string,
  cb: (arg: any) => void,
) => {
  if (!queryString) {
    cb([]);
    return;
  }
  const results = await memberStore.getAssociateList(queryString, 50);
  cb(results);
};

// 选中会员
const handleSelect = (item: Record<string, any>) => {
  inputValue.value = '';
  emit('update:modelValue', '');
  emit('selected', { ...item });
};
</script>

<style lang="scss" scoped>
// 搜索提示会员信息
.mem-info-card {
  margin: 10px auto;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--el-border-color);
  width: 240px;
  .row {
    height: 18px;
    line-height: 18px;
  }
  .phone {
    color: var(--el-color-primary);
    font-weight: 500;
  }
}

:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

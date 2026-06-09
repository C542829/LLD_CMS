<template>
  <el-select
    v-model="selectedValue"
    :placeholder="placeholder"
    :class="class"
    :value-key="valueKey"
    :multiple="multiple"
    :collapse-tags="multiple"
    :collapse-tags-tooltip="multiple"
    :max-collapse-tags="multiple ? maxCollapseTags : 1"
    :clearable="clearable"
    :placement="placement"
    :loading="loading"
    :filterable="filterable"
    :no-data-text="noDataText"
    @change="handleChange"
    @clear="handleClear"
  >
    <el-option
      v-for="item in userList"
      :key="item[defaultProps.value]"
      :label="item[defaultProps.label]"
      :value="emitObject ? item : item[defaultProps.value]"
    />

    <template #header>
      <div class="el-align-center">
        <el-input v-model="searchKeyword" size="small" placeholder="员工账号" class="w-140" @keyup.enter="handleSearch">
          <template #append>
            <el-button :icon="Search" size="small" @click="handleSearch" />
          </template>
        </el-input>
      </div>
    </template>
    <template #footer>
      <div class="el-align-center">
        <el-pagination
          v-model:current-page="pagination.pageNum"
          v-model:page-size="pagination.pageSize"
          size="small"
          layout="prev, pager, next"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          @current-change="handlePageChange"
        />
      </div>
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { reqUserList, type Types } from '@/api/user/index';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { SelectInstance } from 'element-plus';
import { useMasterDataStore } from '@/store/modules/masterData/index';

type ElSelectProps = SelectInstance['$props'];

interface Props extends /* @vue-ignore */ Partial<ElSelectProps> {
  modelValue: number | number[] | UserInfo | UserInfo[] | string;
  placeholder?: string;
  class?: string;
  valueKey?: string;
  maxCollapseTags?: number;
  clearable?: boolean;
  multiple?: boolean;
  emitObject?: boolean;
  defaultProps?: any;
  filterable?: boolean;
  placement?: PlacementType;
  noDataText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  placeholder: '请选择用户',
  class: 'w-120',
  valueKey: 'userId',
  maxCollapseTags: 0,
  clearable: true,
  multiple: false,
  emitObject: false,
  filterable: true,
  placement: 'bottom',
  noDataText: '暂无数据',
  defaultProps: () => ({
    label: 'userName',
    value: 'userId',
  }),
});

const emit = defineEmits(['update:modelValue', 'change', 'clear']);

const masterDataStore = useMasterDataStore();

onMounted(() => {
  handleSearch();
});

const selectedValue = ref<any>(props.multiple ? [] : undefined);

const loading = ref(false);

const searchKeyword = ref('');

const pagination = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 0,
});

watch(
  () => props.modelValue,
  (val) => {
    if (props.emitObject) {
      if (props.multiple) {
        selectedValue.value = Array.isArray(val) ? val : [];
      } else {
        selectedValue.value = val || undefined;
      }
    } else {
      if (props.multiple) {
        selectedValue.value = Array.isArray(val) ? val : [];
      } else {
        selectedValue.value = Array.isArray(val) ? (val.length > 0 ? val[0] : undefined) : val;
      }
    }
  },
  { immediate: true },
);

const handleChange = (val: any) => {
  emit('update:modelValue', val);
  emit('change', val);
};

const handleClear = () => {
  const value = props.multiple ? [] : '';
  emit('update:modelValue', value);
  emit('clear');
};

const userList = ref<UserInfo[]>([]);

const handleSearch = async () => {
  pagination.pageNum = 1;
  await loadUserList();
};

const handlePageChange = async () => {
  await loadUserList();
};

const loadUserList = async () => {
  loading.value = true;
  try {
    const params: Types.SearchUserParams = {
      roleId: '',
      userStatus: '在职',
      userNumber: searchKeyword.value.trim(),
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      orgIds: [],
      // orgIds: orgIds.value,
    };
    const res = await reqUserList(params);
    const data = res.data.rows.map((item: UserInfo) => {
      return {
        id: item.id,
        userId: item.id,
        userName: item.userName,
      };
    });
    userList.value = data || [];
    pagination.total = res.data.total || 0;
  } catch (error) {
    console.error('加载用户列表失败:', error);
  } finally {
    loading.value = false;
  }
};

const orgIds = computed(() => {
  return (masterDataStore.filteredOrgList || []).map((item: any) => item.id);
});
</script>

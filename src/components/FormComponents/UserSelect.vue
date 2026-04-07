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
    :filter-method="filterMethod"
    @change="handleChange"
    @clear="handleClear"
  >
    <el-option
      v-for="item in filterOptions"
      :key="item[defaultProps.value]"
      :label="item[defaultProps.label]"
      :value="emitObject ? item : item[defaultProps.value]"
    >
      {{ item[defaultProps.label] }}({{ item[defaultProps.code] }})
    </el-option>

    <template #header>
      <div class="el-align-center">
        <el-button v-if="multiple" type="primary" size="small" link @click="handleClear">取消选择</el-button>
        <el-button type="success" size="small" link @click="getUserList">刷新数据</el-button>
      </div>
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { reqUserList, type Types } from '@/api/user/index';
import { computed, onMounted, ref, watch } from 'vue';
import { SelectInstance } from 'element-plus';
import useUserStore from '@/store/modules/acl/user';

type ElSelectProps = SelectInstance['$props'];

interface Props extends Partial<ElSelectProps> {
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
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  placeholder: '用户',
  class: 'w-120',
  valueKey: 'userId',
  maxCollapseTags: 0,
  clearable: true,
  multiple: true,
  emitObject: false,
  filterable: true,
  placement: 'bottom',
  defaultProps: () => ({
    label: 'userName',
    value: 'userId',
    code: 'userCode',
  }),
});

const emit = defineEmits(['update:modelValue', 'change', 'clear']);

const selectedValue = ref<any>(props.multiple ? [] : undefined);

const loading = ref(false);

const userStore = useUserStore();

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

/**
 * 选择用户
 */
const handleChange = (val: any) => {
  emit('update:modelValue', val);
  emit('change', val);
};

/**
 * 取消选择用户
 */
const handleClear = () => {
  const value = props.multiple ? [] : '';
  emit('update:modelValue', value);
  emit('clear');
};

onMounted(() => {
  getUserList();
});

/** 当前用户选项列表 */
const options = computed(() => {
  return userList.value;
});

const filterOptions = ref<UserInfo[]>([]);

/** 门店列表 */
const userList = ref<UserInfo[]>([]);

const params: Types.SearchUserParams = {
  roleId: '',
  userName: '',
  userStatus: '在职',
  userNumber: '',
  pageNum: 1,
  pageSize: 200,
  orgIds: [],
};

const orgIds = computed(() => {
  if (userStore.user.orgs) {
    return userStore.user.orgs.map((item) => item.id);
  } else {
    return [userStore.user.orgId];
  }
});

/**
 * 过滤用户 根据用户名和编码进行匹配
 */
const filterMethod = (query: string) => {
  if (!query.trim()) {
    // return true;
    filterOptions.value = userList.value;
  }
  // console.log(99999, item);
  filterOptions.value = userList.value.filter(
    (item) =>
      item[props.defaultProps.label].toLowerCase().includes(query.toLowerCase()) ||
      item[props.defaultProps.code].toLowerCase().includes(query.toLowerCase()),
  );
};

/**
 * 获取用户列表
 */
const getUserList = async () => {
  loading.value = true;
  try {
    params.orgIds = orgIds.value;
    const res = await reqUserList(params);
    const data = res.data.rows.map((item: UserInfo) => {
      return {
        id: item.id,
        userId: item.id,
        userName: item.userName,
        userCode: item.userCode,
      };
    });
    userList.value = data || [];
    filterOptions.value = data || [];
  } catch (error) {
  } finally {
    loading.value = false;
  }
};
</script>

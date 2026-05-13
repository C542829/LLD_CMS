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
      <!-- 套餐编码 -->
      <el-form-item label="套餐编码" prop="packageEncode">
        <el-input v-model="formdata.packageEncode" placeholder="请输入套餐编码" clearable />
      </el-form-item>

      <!-- 套餐名称（必填） -->
      <el-form-item label="套餐名称" prop="packageName">
        <el-input v-model="formdata.packageName" placeholder="请输入套餐名称" clearable />
      </el-form-item>

      <!-- 价格设置 -->
      <el-form-item label="价格设置">
        <Card style="width: 75%">
          <el-form-item label="散客价：" prop="packagePrice">
            <el-input-number size="small" v-model="formdata.packagePrice" :controls="false" />
            &nbsp;元
          </el-form-item>
          <el-form-item label="会员价：" prop="packagePriceVip">
            <el-input-number size="small" v-model="formdata.packagePriceVip" :controls="false" />
            &nbsp;元
          </el-form-item>
        </Card>
      </el-form-item>

      <!-- 套餐明细 -->
      <el-form-item label="套餐明细" prop="packageDetailDTOList">
        <el-alert title="点击胶囊按钮, 可修改产品数量哦" type="warning" style="width: 75%; margin-bottom: 10px" />
        <Card style="width: 75%">
          <Autocomplete
            :dataList="packages"
            :selectedList="formdata.packageDetailDTOList || []"
            @submit="submitSelect"
            @update-number="updateNumber"
          >
            <template #selected="{ item }">
              {{ item.packageDetailName }} &nbsp; 数量：{{ item.packageToolNumber }}
            </template>
            <!-- 套餐明细 -->
            <template #default="{ item }">
              <Card padding="10px" :gap="5" bgColor="#fff" shadow="always" class="package-card">
                <div class="package-item">
                  <span>名称：</span>
                  <span>{{ item.packageDetailName }}</span>
                </div>
                <div class="package-item" style="color: var(--el-text-color-secondary)">
                  <span>编码：</span>
                  <span>{{ item.packageToolNumber }}</span>
                </div>
              </Card>
            </template>
          </Autocomplete>
        </Card>
      </el-form-item>

      <!-- 其他描述 -->
      <el-form-item label="其他描述" prop="remark">
        <el-input v-model="formdata.remark" type="textarea" placeholder="请输入其他描述" clearable />
      </el-form-item>
    </Form>

    <!-- 抽屉操作按钮 -->
    <div v-show="formDisabled" class="drawer-buttons">
      <el-button @click="drawerVisible = false">取消</el-button>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import Autocomplete from '../Autocomplete.vue';
import { ref, computed, watch } from 'vue';
import { cloneDeep } from 'lodash';
import { type Types, reqAddPackage, reqUpdatePackage } from '@/api/setGroup/package';
import { useMasterDataStore } from '@/store/modules/masterData/index';
import Message from '@/components/Message';

const masterDataStore = useMasterDataStore();

const DEFAULT_FORMDATA: Types.PackageInfoDTO = {
  id: undefined,
  packageName: '',
  packageEncode: '',
  packagePrice: 0,
  packagePriceVip: 0,
  packageDetailDTOList: [],
  remark: '',
};

interface Props {
  type: DialogType;
  modelValue: boolean;
  data?: Types.PackageListVO;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  modelValue: false,
});

const emit = defineEmits(['update:model-value', 'close', 'success']);

watch(
  () => props.modelValue,
  (newVal) => {
    drawerVisible.value = newVal;
  },
);

const drawerVisible = ref(false);
const submitLoading = ref(false);
const formdata = ref<Types.PackageInfoDTO>(cloneDeep(DEFAULT_FORMDATA));

const drawerTitle = computed(() => {
  switch (props.type) {
    case 'add':
      formdata.value = cloneDeep(DEFAULT_FORMDATA);
      return '新增套餐信息';
    case 'edit':
      formdata.value = cloneDeep(props.data) as Types.PackageInfoDTO;
      return '修改套餐信息';
    default:
      formdata.value = cloneDeep(props.data) as Types.PackageInfoDTO;
      return '套餐信息';
  }
});

const formDisabled = computed(() => props.type === 'view');

const handleDrawerClose = () => {
  emit('update:model-value', false);
  emit('close');
};

/**
 * 选择框选择方法 - 将选择的内容添加到已选择数组
 * @param data 选择的内容
 */
const submitSelect = (data: any) => {
  formdata.value.packageDetailDTOList = data;
};

/**
 * 更新数量
 * @param item 已选择的内容
 */
const updateNumber = (item: any) => {
  item.packageToolNumber = item.number;
};

const handleFormSubmit = async () => {
  try {
    submitLoading.value = true;
    const res = formdata.value.id
      ? await reqUpdatePackage(formdata.value as Types.PackageInfoDTO)
      : await reqAddPackage(formdata.value as Types.PackageInfoDTO);
    if (res.code === 10000) {
      Message.success(formdata.value.id ? '更新成功' : '添加成功');
      drawerVisible.value = false;
      emit('success');
      masterDataStore.invalidate('package');
    }
  } catch (error) {
    console.error(error);
  } finally {
    submitLoading.value = false;
  }
};

const handleFormReset = () => {
  formdata.value = cloneDeep(DEFAULT_FORMDATA);
};

// 模拟套餐明细数据
const packages = new Array(10)
  .fill({
    packageDetailName: '',
    packageToolNumber: 1,
    packageId: 1,
  })
  .map((item, i) => ({
    ...item,
    packageDetailName: `一次性工具${i + 1}`,
    value: `一次性工具${i + 1}`,
  }));

// 表单验证规则
const formRules = {
  packageEncode: [{ required: true, message: '请输入套餐编码', trigger: 'blur' }],
  packageName: [{ required: true, message: '请输入套餐名称', trigger: 'blur' }],
  packagePrice: [
    { required: true, message: '请输入散客价', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
  ],
  packagePriceVip: [
    { required: true, message: '请输入会员价', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
  ],
  packageDetailDTOList: [{ required: true, message: '请选择套餐项目信息', trigger: 'blur' }],
};
</script>

<style lang="scss" scoped>
.package-card {
  margin: 5px 0;

  .package-item {
    color: var(--el-text-color-primary);
    line-height: 20px;
  }
}
</style>

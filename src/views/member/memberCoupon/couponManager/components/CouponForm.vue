<template>
  <Drawer v-model="visible" :title="title" @closed="handleClosed">
    <Form
      :model="formModel"
      :rules="formRules"
      :showButtons="!disabled"
      :disabled="disabled"
      @submit="handleFormSubmit"
      @reset="handleFormReset"
    >
      <!-- 关联门店 -->
      <template v-if="userStore.isAdmin">
        <el-form-item label="关联门店" prop="orgIds">
          <OrgSelect v-model="formModel.orgIds" placeholder="关联门店" class="w-240" />
        </el-form-item>
      </template>

      <!-- 优惠券名称 -->
      <el-form-item label="优惠券名称" prop="ticketName">
        <el-input v-model="formModel.ticketName" clearable class="w-240" placeholder="请输入优惠券名称" />
      </el-form-item>

      <!-- 优惠券描述 -->
      <el-form-item label="优惠券描述" prop="ticketDescription">
        <el-input v-model="formModel.ticketDescription" clearable class="w-240" placeholder="请输入优惠券描述" />
      </el-form-item>

      <!-- 优惠券类型 -->
      <el-form-item label="优惠券类型" prop="ticketType">
        <el-select v-model="formModel.ticketType" clearable class="w-160" placeholder="请选择优惠券类型">
          <el-option v-for="item in couponTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <!-- 领取后有效天数 -->
      <el-form-item label="领取后有效天数" prop="ticketEffectiveTime">
        <el-input v-model.number="formModel.ticketEffectiveTime" placeholder="请输入有效天数" class="w-160">
          <template #suffix>天</template>
        </el-input>
        <el-alert title="值为 -1 代表无限期" type="warning" style="margin-top: 8px" />
      </el-form-item>

      <!-- 代金券 -->
      <template v-if="formModel.ticketType === CouponType.voucher">
        <!-- 限制满额 -->
        <el-form-item label="限制满额" prop="ticketFullPayment">
          <el-input v-model.number="formModel.ticketFullPayment" placeholder="请输入限制满额" class="w-160">
            <template #suffix>元</template>
          </el-input>
          <el-alert title="限制满额为 0 表示无限制，可任意使用" type="error" style="margin-top: 8px" />
        </el-form-item>

        <!-- 代金券面值 -->
        <el-form-item label="代金券面值" prop="ticketValue">
          <el-input v-model.number="formModel.ticketValue" placeholder="请输入代金券面值" class="w-160">
            <template #suffix>元</template>
          </el-input>
          <el-alert
            :title="`规则：满 ${formModel.ticketFullPayment || 0} 元，可使用优惠券抵扣 ${
              formModel.ticketValue || 0
            } 元`"
            type="warning"
            style="margin-top: 8px"
          />
        </el-form-item>
      </template>

      <!-- 体验券 -->
      <template v-if="formModel.ticketType === CouponType.experience">
        <!-- 可体验项目 -->
        <el-form-item label="选择项目" prop="serverItemIds">
          <el-select
            v-model="formModel.serverItemIds"
            clearable
            multiple
            filterable
            :filter-method="filterServiceItem"
            class="w-240"
            placeholder="请选择项目"
          >
            <el-option
              v-for="item in filteredServiceItemOptions"
              :key="item.id"
              :value="item.id"
              :label="item.itemName"
            >
              {{ item.itemName }}({{ item.itemEncode }})
            </el-option>
          </el-select>
          <el-alert title="项目支持名称和编码搜索过滤" type="warning" style="margin-top: 8px" />
        </el-form-item>
      </template>

      <!-- 产品券 -->
      <template v-if="formModel.ticketType === CouponType.product">
        <!-- 关联产品 -->
        <el-form-item label="选择产品" prop="productIds">
          <ProductSelect
            v-model="formModel.productIds"
            show-code
            :max-collapse-tags="20"
            placeholder="请选择产品"
            class="w-240"
          />
          <el-alert title="产品支持名称和编码搜索过滤" type="warning" style="margin-top: 8px" />
        </el-form-item>
      </template>
    </Form>
    <div v-show="disabled" class="drawer-buttons">
      <el-button @click="visible = false">取消</el-button>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/acl/user';
import ProductSelect from '@/components/FormComponents/ProductSelect.vue';
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { CouponType, couponTypeOptions } from '@/enums/index';
import { useMasterDataStore } from '@/store/modules/masterData/index';
import { reqAddTicket, reqUpdateTicket } from '@/api/member/coupon';
import { parseResMsg } from '@/utils/parseResponse';

const masterDataStore = useMasterDataStore();
const userStore = useUserStore();

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    formData: Record<string, any>;
    disabled?: boolean;
    title?: string;
  }>(),
  { disabled: false, title: '新增优惠券' },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

// v-model 控制 drawer
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

// 本地表单副本
const formModel = reactive<Record<string, any>>({ ...props.formData });
watch(
  () => props.formData,
  (val) => Object.assign(formModel, val),
  { deep: true },
);

// 提交
const handleFormSubmit = async (model: any) => {
  const res = await (model.id ? reqUpdateTicket(model) : reqAddTicket(model));
  const result = parseResMsg(res);
  if (result) {
    visible.value = false;
    useMasterDataStore().invalidate('ticket');
    emit('success');
  }
};

// 重置
const handleFormReset = () => {
  Object.assign(formModel, createDefaultForm());
};

// drawer 关闭后通知父组件
const handleClosed = () => {};

// #region 项目选项
onMounted(() => {
  getServiceItemOptions();
});

const serviceItemOptions = ref<any[]>([]);
const filteredServiceItemOptions = ref<any[]>([]);

const getServiceItemOptions = async () => {
  const data = await masterDataStore.getServiceItemList();
  serviceItemOptions.value = data;
  filteredServiceItemOptions.value = data;
};

const filterServiceItem = (query: string) => {
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredServiceItemOptions.value = serviceItemOptions.value.filter((item) => {
      return item.itemName.toLowerCase().includes(lowerQuery) || item.itemEncode.toLowerCase().includes(lowerQuery);
    });
  } else {
    filteredServiceItemOptions.value = serviceItemOptions.value;
  }
};
// #endregion

// #region 表单验证规则
const formRules = {
  ticketName: [
    { required: true, message: '优惠券名称不能为空', trigger: 'blur' },
    { type: 'string', message: '优惠券名称必须为字符串', trigger: 'blur' },
    { min: 1, max: 100, message: '优惠券名称长度必须在1-100个字符之间', trigger: 'blur' },
  ],
  ticketType: [{ required: true, message: '优惠券类型不能为空', trigger: 'blur' }],
  ticketDescription: [{ type: 'string', message: '优惠券描述必须为字符串', trigger: 'blur' }],
  ticketEffectiveTime: [
    { required: true, message: '有效天数不能为空', trigger: 'blur' },
    { type: 'number', message: '有效天数必须为数字', trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value < -1) return callback(new Error('有效天数不能小于-1'));
        callback();
      },
      trigger: 'blur',
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (!Number.isInteger(value)) return callback(new Error('有效天数必须为整数'));
        callback();
      },
      trigger: 'blur',
    },
  ],
  ticketFullPayment: [
    { type: 'number', message: '限额必须为数字', trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value !== undefined && value < 0) return callback(new Error('限额不能为负数'));
        callback();
      },
      trigger: 'blur',
    },
  ],
  ticketValue: [{ type: 'number', message: '优惠券面值必须为数字', trigger: 'blur' }],
  productIds: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (formModel.ticketType === CouponType.product && (!value || value.length === 0)) {
          return callback(new Error('产品券必须选择关联产品'));
        }
        callback();
      },
      trigger: 'change',
    },
  ],
};
// #endregion
</script>

<script lang="ts">
function createDefaultForm() {
  return {
    id: null,
    ticketName: '',
    ticketType: 0,
    ticketEffectiveTime: -1,
    ticketFullPayment: null,
    ticketValue: null,
    ticketDescription: '',
    serverItemIds: [],
    productIds: [],
    orgIds: [],
  };
}

export default {
  name: 'CouponForm',
  createDefaultForm,
};
</script>

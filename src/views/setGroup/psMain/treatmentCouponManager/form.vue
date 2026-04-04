<template>
  <div>
    <Form
      :model="store.formData"
      :rules="formRules"
      :showButtons="!disabled"
      :disabled="disabled"
      @submit="handleFormSubmit"
      @reset="handleFormReset"
      label-width="100px"
    >
      <!-- 关联门店 -->
      <template v-if="userStore.isAdmin">
        <el-form-item label="关联门店" prop="orgIds">
          <OrgSelect v-model="store.formData.orgIds" />
        </el-form-item>
      </template>

      <!-- 疗程券编码 -->
      <el-form-item label="疗程券编码" prop="encode">
        <el-input v-model="store.formData.encode" clearable class="w-240" placeholder="请输入疗程券编码" />
      </el-form-item>

      <!-- 疗程券名称（必填） -->
      <el-form-item label="疗程券名称" prop="name">
        <el-input v-model="store.formData.name" clearable class="w-240" placeholder="请输入疗程券名称" />
      </el-form-item>

      <!-- 价格设置 -->
      <el-form-item label="价格设置">
        <Card>
          <el-form-item label="疗程价：" prop="price" class="form-item-m-l-0">
            <el-input-number v-model="store.formData.price" :controls="false" class="w-130">
              <template #suffix>元</template>
            </el-input-number>
          </el-form-item>
        </Card>
      </el-form-item>

      <!-- 提成类型 -->
      <el-form-item label="提成类型" prop="type">
        <el-radio-group v-model="store.formData.type">
          <el-radio
            v-for="item in commissionTypeOptions"
            :value="item.value"
            :label="item.label"
            :key="item.value"
            :border="true"
          />
        </el-radio-group>
      </el-form-item>

      <!-- 固定金额 -->
      <template v-if="store.formData.type === CommissionType.FixedAmount">
        <el-form-item label="提成值" prop="commissionValue">
          <el-input-number v-model="store.formData.commissionValue" :controls="false" class="w-120">
            <template #suffix>元</template>
          </el-input-number>
        </el-form-item>
      </template>

      <!-- 比例提成 -->
      <template v-if="store.formData.type === CommissionType.Proportion">
        <el-form-item label="提成比例" prop="commissionValue" style="margin-bottom: 15px">
          <el-input-number v-model="store.formData.commissionValue" :controls="false" class="w-120">
            <template #suffix>%</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="提成基准" prop="commissionBase">
          <el-select v-model="store.formData.commissionBase" class="w-120">
            <el-option v-for="item in commissionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </template>

      <el-form-item label="优惠券" prop="vipTicketList">
        <MultipleSelect
          v-model="store.formData.vipTicketList"
          :displayProps="defaultProps"
          @visible-change="visibleChange"
          value-key="vipTicketId"
          class="w-240"
        >
          <el-option v-for="item in couponOptions" :key="item.vipTicketId" :label="item.vipTicketName" :value="item" />
        </MultipleSelect>
      </el-form-item>

      <!-- 其他描述 -->
      <el-form-item label="其他描述" prop="remark">
        <el-input v-model="store.formData.remark" class="w-240" type="textarea" placeholder="请输入其他描述" />
      </el-form-item>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, reactive, ref } from 'vue';
import { commissionOptions, commissionTypeOptions, CommissionType } from '@/enums/index';
// 引入数据仓库
import { useTreatmentCouponStore } from '@/store/modules/setGroup/treatmentCoupon';
import { useDataEnumStore } from '@/store/modules/enums/index';
import { useCouponStore } from '@/store/modules/member/memberCoupon';
import useUserStore from '@/store/modules/acl/user';
const userStore = useUserStore();
const couponStore = useCouponStore();
const store = useTreatmentCouponStore();
const dataEnumStore = useDataEnumStore();

// 定义组件触发的事件 - 关闭抽屉
const $emit = defineEmits(['close-drawer']);

// 定义组件接收的props - 是否禁用表单
defineProps(['disabled']);

// 组件挂载后执行的生命周期钩子
onMounted(() => {
  // 可在此处添加组件初始化逻辑
  // store.resetFormData();
  dataEnumStore.getTicketList();
  getCouponList();
});

// 下拉框展示区显示的属性
const defaultProps = reactive({ label: 'vipTicketName', value: 'vipTicketNum' });
// 优惠券列表
const couponOptions = ref<any[]>([]);

// 当下拉框打开时加载数据
const visibleChange = (visible: boolean) => {
  if (visible && couponOptions.value.length === 0) {
    getCouponList();
  }
};

// 获取优惠券列表
const getCouponList = async () => {
  const couponList = await couponStore.getCouponList();
  couponOptions.value = couponList.map((item) => {
    return {
      vipTicketId: item.id,
      vipTicketName: item.ticketName,
      vipTicketNum: 1,
    };
  });
};

/**
 * 表单提交处理函数
 * @param model 表单数据对象
 */
const handleFormSubmit = async (model: any) => {
  console.log('疗程券数据：', model);
  // 调用数据仓库的更新方法
  const result = await store.updateData(model);
  // 更新成功则触发关闭抽屉事件
  result && $emit('close-drawer');
};

/**
 * 表单重置处理函数
 * 调用数据仓库的重置表单数据方法
 */
const handleFormReset = () => {
  store.resetFormData();
};

// 表单验证规则
const formRules = {
  orgIds: [{ required: true, message: '请选择关联门店', trigger: 'blur' }],
  encode: [{ required: true, message: '请输入疗程券编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入疗程券名称', trigger: 'blur' }],
  price: [
    { required: true, message: '请输入疗程价', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
  ],
  type: [{ required: true, message: '请输入疗程券名称', trigger: 'blur' }],
  commissionValue: [
    { required: true, message: '请输入提成比例', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
  ],
  commissionBase: [{ required: true, message: '请选择提成基准', trigger: 'blur' }],
  vipTicketList: [{ required: true, message: '请选择优惠券', trigger: 'blur' }],
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

.form-item-m-l-0 {
  :deep(.el-form-item__label-wrap) {
    margin-left: 0 !important;
  }
}
</style>

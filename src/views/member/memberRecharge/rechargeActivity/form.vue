<template>
  <div>
    <Form
      :model="store.formData"
      :rules="formRules"
      :showButtons="!disabled"
      :disabled="disabled"
      @submit="handleFormSubmit"
      @reset="handleFormReset"
    >
      <!-- 关联门店 -->
      <template v-if="userStore.isAdmin">
        <el-form-item label="关联门店" prop="orgIds">
          <OrgSelect v-model="store.formData.orgIds" />
        </el-form-item>
      </template>

      <!-- 活动名称 -->
      <el-form-item label="活动名称" prop="activeName">
        <el-input v-model="store.formData.activeName" clearable class="w-240" placeholder="请输入活动名称" />
      </el-form-item>

      <!-- 活动时间 -->
      <el-form-item label="活动时间" prop="activeTime">
        <div style="width: 240px">
          <el-date-picker
            v-model="store.formData.activeTime"
            :shortcuts="shortcuts"
            clearable
            unlink-panels
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            class="w-240"
          />
        </div>
      </el-form-item>

      <!-- 活动类型 -->
      <el-form-item label="活动类型" prop="activeType">
        <el-select v-model="store.formData.activeType" clearable class="w-240" placeholder="请选择活动类型">
          <el-option v-for="item in activityTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <!-- #region 本金设置 -->
      <h1 class="title">本金设置</h1>

      <!-- 充值本金 -->
      <el-form-item label="充值本金" prop="activeCapital">
        <el-input-number
          v-model="store.formData.activeCapital"
          :min="0"
          :controls="false"
          placeholder="充值本金"
          class="w-120"
        >
          <template #suffix>元</template>
        </el-input-number>
      </el-form-item>

      <!-- 消费折扣 -->
      <el-form-item label="消费折扣" prop="activeDiscount">
        <el-input-number
          v-model="store.formData.activeDiscount"
          :min="0"
          :max="100"
          :controls="false"
          placeholder="请输入消费折扣"
          class="w-120"
        >
          <template #suffix>%</template>
        </el-input-number>
      </el-form-item>

      <!-- 折扣基础 -->
      <el-form-item label="折扣基础" prop="activeBase">
        <el-radio-group v-model="store.formData.activeBase">
          <el-radio
            v-for="item in discountTypeOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            :border="true"
          />
        </el-radio-group>
      </el-form-item>

      <!-- 跨店结算 -->
      <el-form-item label="跨店结算" prop="isCrossStore">
        <el-switch
          v-model="store.formData.isCrossStore"
          :active-value="IsCrossStore.YES"
          :inactive-value="IsCrossStore.NO"
        />
      </el-form-item>
      <!-- #endregion 本金设置 -->

      <!-- #region 赠送储值金 -->
      <template
        v-if="
          store.formData.activeType === ActivityType.PresentValue ||
          store.formData.activeType === ActivityType.PresentValueAndCoupon
        "
      >
        <h1 class="title">赠送金设置</h1>

        <!-- 赠送金额 -->
        <el-form-item label="赠送金额" prop="presentValue">
          <el-input-number
            v-model="store.formData.presentValue"
            :min="0"
            :controls="false"
            placeholder="赠送金额"
            class="w-120"
          >
            <template #suffix>元</template>
          </el-input-number>
        </el-form-item>

        <!-- 折扣同本金 -->
        <el-form-item label="折扣同本金" prop="presentDiscountIsSame">
          <el-switch v-model="store.formData.presentDiscountIsSame" :active-value="1" :inactive-value="0" />
        </el-form-item>

        <!-- 手动赠送金折扣设置 -->
        <template v-if="!store.formData.presentDiscountIsSame">
          <!-- 消费折扣 -->
          <el-form-item label="消费折扣" prop="presentDiscount">
            <el-input-number
              v-model="store.formData.presentDiscount"
              :min="0"
              :max="100"
              :controls="false"
              placeholder="请输入消费折扣"
              class="w-120"
            >
              <template #suffix>%</template>
            </el-input-number>
          </el-form-item>

          <!-- 折扣基础 -->
          <el-form-item label="折扣基础" prop="presentBase">
            <el-radio-group v-model="store.formData.presentBase">
              <el-radio
                v-for="item in discountTypeOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
                :border="true"
              />
            </el-radio-group>
          </el-form-item>

          <!-- 跨店结算 -->
          <el-form-item label="跨店结算" prop="presentIsCrossStore">
            <el-switch
              v-model="store.formData.presentIsCrossStore"
              :active-value="IsCrossStore.YES"
              :inactive-value="IsCrossStore.NO"
            />
          </el-form-item>
        </template>

        <!-- <el-form-item label="累加赠送" prop="isAccum">
          <el-checkbox v-model="store.formData.isAccum" :true-value="1" :false-value="0">是否累加</el-checkbox>
          <el-alert type="warning">
            <span style="padding: 0 20px">
              勾选累加后，会根据充值金额累计赠送。比如“充值100送10元”活动，用户充值200则会赠送20元
            </span>
          </el-alert>
        </el-form-item> -->
      </template>
      <!-- #endregion 赠送储值金 -->

      <!-- #region 赠送优惠券 -->
      <template
        v-if="
          store.formData.activeType === ActivityType.PresentCoupon ||
          store.formData.activeType === ActivityType.PresentValueAndCoupon
        "
      >
        <h1 class="title">赠送优惠券设置</h1>
        <el-form-item label="优惠券" prop="ticketIds">
          <MultipleSelect
            v-model="store.formData.ticketIds"
            :displayProps="defaultProps"
            @visible-change="visibleChange"
            value-key="vipTicketId"
            class="w-240"
            filterable
          >
            <el-option
              v-for="item in couponOptions"
              :key="item.vipTicketId"
              :label="item.vipTicketName"
              :value="item"
            />
          </MultipleSelect>
        </el-form-item>
      </template>
      <!-- #endregion 赠送优惠券 -->

      <!-- #region 提成设置 -->
      <h1 class="title">提成设置</h1>

      <!-- 提成类型 -->
      <el-form-item label="提成类型" prop="commissionType">
        <el-radio-group v-model.number="store.formData.commissionType">
          <el-radio v-for="item in commissionTypeOptions" :value="item.value" :border="true">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 固定金额 -->
      <template v-if="store.formData.commissionType === CommissionType.FixedAmount">
        <el-form-item label="提成值" prop="commissionValue">
          <el-input-number
            v-model="store.formData.commissionValue"
            :controls="false"
            class="w-120"
            placeholder="提成值"
          >
            <template #suffix>元</template>
          </el-input-number>
        </el-form-item>
      </template>

      <!-- 比例提成 -->
      <template v-if="store.formData.commissionType === CommissionType.Proportion">
        <el-form-item label="提成比例" prop="commissionValue">
          <el-input-number v-model="store.formData.commissionValue" :controls="false" class="w-120">
            <template #suffix>%</template>
          </el-input-number>
        </el-form-item>
      </template>
      <!-- #endregion 提成设置 -->

      <!-- 其他描述 -->
      <el-form-item label="其他描述">
        <el-input
          v-model="store.formData.remark"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          class="w-240"
          placeholder="请输入活动描述"
        />
      </el-form-item>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { reqTicketList } from '@/api/member/coupon/index';
import {
  activityTypeOptions,
  ActivityType,
  discountTypeOptions,
  IsCrossStore,
  commissionTypeOptions,
  CommissionType,
} from '@/enums/index';
// 引入数据仓库
import { useRechargeActivityStore } from '@/store/modules/member/rechargeActivity';
import { useUserStore } from '@/store/modules/acl/user';

const store = useRechargeActivityStore();
const userStore = useUserStore();

// 定义组件触发的事件 - 关闭抽屉
const $emit = defineEmits(['close-drawer']);

// 定义组件接收的props - 是否禁用表单
defineProps(['disabled']);

onMounted(() => {
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
  try {
    const { data } = await reqTicketList();
    couponOptions.value = data.map((item) => {
      return {
        vipTicketId: item.id,
        vipTicketName: item.ticketName,
        vipTicketNum: 1,
      };
    });
  } catch (error) {}
};

/**
 * 表单提交处理函数
 * @param model 表单数据对象
 */
const handleFormSubmit = async (model: any) => {
  const result = await store.update(model);
  result && $emit('close-drawer');
};

/**
 * 表单重置处理函数
 * 调用数据仓库的重置表单数据方法
 */
const handleFormReset = () => {
  store.resetFormData();
};

defineExpose({
  getCouponList,
});

// 表单验证规则
const formRules = {
  orgIds: [{ required: true, message: '请选择关联门店', trigger: 'change' }],
  activeName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  activeTime: [{ required: true, message: '请选择活动时间', trigger: 'blur' }],
  activeType: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  activeCapital: [
    { required: true, message: '请输入充值本金', trigger: 'blur' },
    { type: 'number', message: '请输入有效金额', trigger: 'blur' },
  ],
  activeDiscount: [
    { required: true, message: '请输入消费折扣', trigger: 'blur' },
    { type: 'number', message: '请输入有效折扣', trigger: 'blur' },
  ],
  activeBaseOn: [{ required: true, message: '请选择折扣基础', trigger: 'change' }],
  isCrossStore: [{ required: true, message: '请选择跨店结算', trigger: 'change' }],
  activePresent: [
    { required: true, message: '请输入赠送金额', trigger: 'blur' },
    { type: 'number', message: '请输入有效金额', trigger: 'blur' },
  ],
  commissionType: [{ required: true, message: '请选择提成类型', trigger: 'change' }],
  commissionValue: [
    { required: true, message: '请输入提成值', trigger: 'blur' },
    { type: 'number', message: '请输入有效提成值', trigger: 'blur' },
  ],
};

const shortcuts = [
  {
    text: '未来一年',
    value: () => {
      const end = new Date();
      const start = new Date();
      end.setTime(start.getTime() + 3600 * 1000 * 24 * 365);
      return [start, end];
    },
  },
  {
    text: '未来两年',
    value: () => {
      const end = new Date();
      const start = new Date();
      end.setTime(start.getTime() + 3600 * 1000 * 24 * 365 * 2);
      return [start, end];
    },
  },
  {
    text: '未来三年',
    value: () => {
      const end = new Date();
      const start = new Date();
      end.setTime(start.getTime() + 3600 * 1000 * 24 * 365 * 3);
      return [start, end];
    },
  },
  {
    text: '未来五年',
    value: () => {
      const end = new Date();
      const start = new Date();
      end.setTime(start.getTime() + 3600 * 1000 * 24 * 365 * 5);
      return [start, end];
    },
  },
  {
    text: '未来十年',
    value: () => {
      const end = new Date();
      const start = new Date();
      end.setTime(start.getTime() + 3600 * 1000 * 24 * 365 * 10);
      return [start, end];
    },
  },
];
</script>

<style lang="scss" scoped>
.title {
  color: var(--el-color-info-light-3);
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
}
</style>

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
      <!-- 关联门店 -->
      <template v-if="userStore.isAdmin">
        <el-form-item label="关联门店" prop="orgIds">
          <OrgSelect v-model="formdata.orgIds" />
        </el-form-item>
      </template>

      <!-- 疗程券编码 -->
      <el-form-item label="疗程券编码" prop="encode">
        <el-input v-model="formdata.encode" clearable class="w-240" placeholder="请输入疗程券编码" />
      </el-form-item>

      <!-- 疗程券名称（必填） -->
      <el-form-item label="疗程券名称" prop="name">
        <el-input v-model="formdata.name" clearable class="w-240" placeholder="请输入疗程券名称" />
      </el-form-item>

      <!-- 价格设置 -->
      <el-form-item label="价格设置">
        <Card>
          <el-form-item label="疗程价：" prop="price" class="form-item-m-l-0">
            <el-input-number v-model="formdata.price" :controls="false" class="w-130">
              <template #suffix>元</template>
            </el-input-number>
          </el-form-item>
        </Card>
      </el-form-item>

      <!-- 提成类型 -->
      <el-form-item label="提成类型" prop="type">
        <el-radio-group v-model="formdata.type">
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
      <template v-if="formdata.type === CommissionType.FixedAmount">
        <el-form-item label="提成值" prop="commissionValue">
          <el-input-number v-model="formdata.commissionValue" :controls="false" class="w-120">
            <template #suffix>元</template>
          </el-input-number>
        </el-form-item>
      </template>

      <!-- 比例提成 -->
      <template v-if="formdata.type === CommissionType.Proportion">
        <el-form-item label="提成比例" prop="commissionValue" style="margin-bottom: 15px">
          <el-input-number v-model="formdata.commissionValue" :controls="false" class="w-120">
            <template #suffix>%</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="提成基准" prop="commissionBase">
          <el-select v-model="formdata.commissionBase" class="w-120">
            <el-option v-for="item in commissionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </template>

      <el-form-item label="优惠券" prop="vipTicketList">
        <MultipleSelect
          v-model="formdata.vipTicketList"
          :displayProps="defaultProps"
          @visible-change="visibleChange"
          value-key="vipTicketId"
          class="w-240"
          filterable
        >
          <el-option v-for="item in couponOptions" :key="item.vipTicketId" :label="item.vipTicketName" :value="item" />
        </MultipleSelect>
      </el-form-item>

      <!-- 其他描述 -->
      <el-form-item label="其他描述" prop="remark">
        <el-input v-model="formdata.remark" class="w-240" type="textarea" placeholder="请输入其他描述" />
      </el-form-item>
    </Form>

    <!-- 抽屉操作按钮 -->
    <div v-show="formDisabled" class="drawer-buttons">
      <el-button @click="drawerVisible = false">取消</el-button>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import Message from '@/components/Message';
import { ref, computed, watch, onMounted } from 'vue';
import { cloneDeep } from 'lodash';
import { type Types, reqAddTreatmentCoupon, reqUpdateTreatmentCoupon } from '@/api/setGroup/treatmentCoupon';
import { CommissionType, commissionTypeOptions, commissionOptions, Status } from '@/enums/index';
import useUserStore from '@/store/modules/acl/user';
import { useMasterDataStore } from '@/store/modules/masterData/index';

const userStore = useUserStore();
const masterDataStore = useMasterDataStore();

const DEFAULT_FORMDATA: Types.CureTicketCreateDTO & { id: number | null } = {
  id: null,
  remark: '',
  name: '',
  encode: '',
  price: 0,
  type: CommissionType.FixedAmount,
  commissionValue: 0,
  commissionBase: 1,
  status: Status.Enabled,
  vipTicketList: [],
  orgIds: [],
};

interface Props {
  type: DialogType;
  modelValue: boolean;
  data?: Types.CureTicketVO;
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
const formdata = ref(cloneDeep(DEFAULT_FORMDATA));

const drawerTitle = computed(() => {
  switch (props.type) {
    case 'add':
      formdata.value = cloneDeep(DEFAULT_FORMDATA);
      return '新增疗程券信息';
    case 'edit':
      formdata.value = {
        ...cloneDeep(props.data!),
        orgIds: props.data!.orgs?.map((item) => item.id!) ?? [],
        vipTicketList: props.data!.ticketDetails ?? [],
      } as any;
      return '修改疗程券信息';
    default:
      formdata.value = {
        ...cloneDeep(props.data!),
        orgIds: props.data!.orgs?.map((item) => item.id!) ?? [],
        vipTicketList: props.data!.ticketDetails ?? [],
      } as any;
      return '疗程券信息';
  }
});

const formDisabled = computed(() => props.type === 'view');

const handleDrawerClose = () => {
  emit('update:model-value', false);
  emit('close');
};

const handleFormSubmit = async () => {
  try {
    submitLoading.value = true;
    const res = formdata.value.id
      ? await reqUpdateTreatmentCoupon(formdata.value as Types.CureTicketUpdateDTO)
      : await reqAddTreatmentCoupon(formdata.value as Types.CureTicketCreateDTO);
    if (res.code === 10000) {
      Message.success(formdata.value.id ? '更新成功' : '添加成功');
      drawerVisible.value = false;
      emit('success');
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

//#region 优惠券选择
const couponOptions = ref<any[]>([]);
const defaultProps = { label: 'vipTicketName', value: 'vipTicketNum' };

const visibleChange = async (visible: boolean) => {
  if (visible) {
    const couponList = await masterDataStore.getTicketList();
    couponOptions.value = couponList.map((item) => {
      return {
        vipTicketId: item.id,
        vipTicketName: item.ticketName,
        vipTicketNum: 1,
      };
    });
  }
};

onMounted(() => {
  visibleChange(true);
});
//#endregion

const formRules = {
  orgIds: [{ required: true, message: '请选择关联门店', trigger: 'blur' }],
  encode: [{ required: true, message: '请输入疗程券编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入疗程券名称', trigger: 'blur' }],
  price: [{ required: true, message: '请输入疗程价', trigger: 'blur' }],
  type: [{ required: true, message: '请选择提成类型', trigger: 'blur' }],
  commissionValue: [{ required: true, message: '请输入提成值', trigger: 'blur' }],
  commissionBase: [{ required: true, message: '请选择提成基准', trigger: 'blur' }],
};
</script>

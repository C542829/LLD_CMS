<template>
  <Dialog :title="title" v-model="dialogVisible" @closed="closeDialog" width="400px" center class="settle-dialog">
    <div class="dialog-body">
      <el-descriptions :column="1">
        <template v-if="orderStore.order.customerType === CustomerType.Member">
          <el-descriptions-item label="会员姓名:">{{ orderStore.member.name }}</el-descriptions-item>
          <el-descriptions-item label="会员卡号:">{{ orderStore.member.cardNumber }}</el-descriptions-item>
          <el-descriptions-item label="会员电话:">{{ orderStore.member.phoneNumber }}</el-descriptions-item>
          <el-descriptions-item label="可用余额:">
            <span class="amount">{{ orderStore.checkedAssetInfo.assetAmount }} 元</span>
          </el-descriptions-item>
        </template>
        <template v-else>
          <el-descriptions-item label="客户姓名:">{{ orderStore.order.customerName }}</el-descriptions-item>
        </template>
        <el-descriptions-item label="应付总额:">
          <span class="price-text">{{ orderStore.truePayAmount }} 元</span>
        </el-descriptions-item>
      </el-descriptions>
      <PayMethod />
    </div>
    <template #footer>
      <el-button type="default" @click="dialogVisible = false">取消</el-button>
      <el-button :loading="loading" type="primary" @click="handleSubmit">确认</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import PayMethod from './PayMethod.vue';
import Message from '@/components/Message';

import { ref, watch, onMounted } from 'vue';
import { CustomerType } from '@/enums/index';
import { type FormInstance } from 'element-plus';
import { useOrderStore } from '@/store/modules/order/index';
import { useDataEnumStore } from '@/store/modules/enums/index';
const orderStore = useOrderStore();
const enumStore = useDataEnumStore();

interface Props {
  modelValue: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
});

watch(
  () => props.modelValue,
  (newVal) => {
    dialogVisible.value = newVal;
  },
);

const emit = defineEmits(['update:model-value', 'close']);

onMounted(async () => {});

const dialogVisible = ref(false);
const title = ref('结算确认单');
const loading = ref(false);

const handleSubmit = async () => {
  const payMethods = orderStore.order.paymentInfoList.filter((item: any) => item.paymentType !== '');
  if (payMethods.length === 0) {
    Message.warning('请选择支付方式');
    return;
  }
  loading.value = true;
  const isSuccess = await orderStore.settleOrder();
  if (isSuccess) {
    closeDialog();
  }
  loading.value = false;
};

const closeDialog = () => {
  dialogVisible.value = false;
  emit('update:model-value', false);
  emit('close');
};
</script>

<style scoped lang="scss">
.settle-dialog {
  .dialog-body {
    padding: 0 40px;
  }

  .amount {
    color: var(--el-color-success);
  }
  .price-text {
    color: red;
  }
}
</style>

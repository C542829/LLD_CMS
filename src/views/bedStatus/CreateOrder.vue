<template>
  <Drawer v-model="drawerVisible" :title="drawerTitle" @closed="closeDrawer" size="550px" style="max-width: 600px">
    <div v-loading="loading">
      <!-- 客户信息 -->
      <el-descriptions size="large" :column="1">
        <el-descriptions-item label="床位名称：">{{ orderStore.order.bedName }}</el-descriptions-item>
        <el-descriptions-item label="顾客类型：">
          <el-radio-group v-model="orderStore.order.customerType" :disabled="true">
            <el-radio
              v-for="item in CustomerTypeOptions"
              :value="item.value"
              :label="item.label"
              :key="item.value"
              :border="true"
            />
          </el-radio-group>
        </el-descriptions-item>
        <el-descriptions-item v-show="orderStore.order.customerType == CustomerType.Member" label="开单会员：">
          <!-- <SearchMember
            v-model="orderStore.order.vipName"
            size="default"
            :showSearchButton="false"
            :disabled="true"
            @selected="handleMemberSelected"
          /> -->
          <el-input
            v-model="orderStore.order.vipName"
            placeholder="请输入会员姓名"
            clearable
            :disabled="true"
            class="w-180"
          />
        </el-descriptions-item>
        <el-descriptions-item v-show="orderStore.order.customerType == CustomerType.Guest" label="散客姓名：">
          <el-input
            v-model="orderStore.order.customerName"
            placeholder="请输入散客姓名"
            clearable
            :disabled="true"
            class="w-180"
          />
        </el-descriptions-item>
      </el-descriptions>

      <!-- 订单信息 -->
      <Card padding="0px">
        <!-- <div style="margin: 10px 0 0 10px">
          <el-button type="primary" :disabled="type == 'view'" @click="showDialog(false)">新增明细</el-button>
        </div> -->
        <PaginationTable :data="orderStore.order.orderDetails" :showPagination="false">
          <el-table-column prop="businessName" label="名称" />
          <el-table-column prop="truePrice" label="价格">
            <template #default="{ row }">
              <p>标准价￥{{ row.stdPrice }}</p>
              <p>实收价￥{{ row.trueUnitPrice }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="技师/销售" min-width="100">
            <template #default="{ row }">
              <template v-if="row.technicians">
                <div v-for="(item, index) in row.technicians" :key="index" class="text-overflow">
                  {{ item.userName }}({{ item.userCode }})
                </div>
              </template>
              <template v-else>
                {{ row.userName }}
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="serverType" label="上钟类型" width="85">
            <template #default="{ row }">
              <template v-if="row.bizType === OrderDetailType.Service">
                <ClockInTypeTag :type="row.serverType" />
              </template>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button @click="deleteOrderDetail(row)" link type="danger">删除</el-button>
            </template>
          </el-table-column>
        </PaginationTable>
      </Card>

      <!-- 操作 -->
      <footer style="text-align: center; margin: 20px 0">
        <el-button type="default" @click="closeDrawer">关闭</el-button>
        <!-- <el-button v-if="type === 'add'" type="primary" @click="createOrder">开单</el-button> -->
        <el-button v-if="type === 'view'" type="primary" @click="goCheckout">去结账</el-button>
        <el-button v-if="type === 'view'" type="danger" :loading="btnLoading" @click="handleCancel">取消订单</el-button>
      </footer>
    </div>
  </Drawer>

  <!-- <DetailForm v-model="dialogVisible" :handleType="handleType"></DetailForm> -->
</template>

<script setup lang="ts">
import Message from '@/components/Message';
import DetailForm from './DetailForm.vue';
import SearchMember from '@/components/Input/SearchMember.vue';
import { ref, onMounted, watch } from 'vue';
import { cloneDeep } from 'lodash';
import { reqCancelOrder, reqDeleteOrderDetail, reqQueryOrderByBedId, Types } from '@/api/order';
import { CashierRouteSign, CustomerType, CustomerTypeOptions, OrderDetailType } from '@/enums/index';
import { useOrderStore } from '@/store/modules/order/index';

const orderStore = useOrderStore();

// #region 初始化信息

const emit = defineEmits(['update:model-value', 'close', 'refresh', 'checkout']);

interface Props {
  modelValue: boolean;
  type: DialogType;
  params: any;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'view',
  params: () => ({}),
});

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      getOrderInfo();
    }
    drawerVisible.value = val;
  },
);

watch(
  () => props.type,
  (val: DialogType) => {
    if (val === 'view') {
      drawerTitle.value = '账单';
    } else if (val === 'add') {
      drawerTitle.value = '开单';
    }
  },
);

// #endregion 初始化信息

// 加载状态
const loading = ref(false);
const btnLoading = ref(false);
// 抽屉信息
const drawerVisible = ref(false);
const drawerTitle = ref('账单');

/** 关闭抽屉 */
const closeDrawer = () => {
  drawerVisible.value = false;
  emit('update:model-value', false);
  emit('close');
};

/**
 * 查询订单信息
 */
const getOrderInfo = async () => {
  try {
    loading.value = true;
    const res = await reqQueryOrderByBedId(props.params.id);
    orderStore.order = res.data as Types.OrderSettleDTO;
  } catch (error) {
    console.error('查询订单信息失败：', error);
  } finally {
    loading.value = false;
  }
};

/** 取消订单 */
const handleCancel = async () => {
  btnLoading.value = true;
  try {
    const res = await reqCancelOrder(orderStore.order.id);
    orderStore.reset();
    emit('close');
    emit('refresh');
    Message.success('取消订单成功');
  } catch (error) {
    Message.error('取消订单失败');
  } finally {
    btnLoading.value = false;
  }
};

/** 去结账 */
const goCheckout = () => {
  const params = {
    id: orderStore.order.bedId,
    bedName: orderStore.order.bedName,
  };
  emit('checkout', { params, sign: CashierRouteSign.Settle });
};

/**
 * 处理删除订单明细项事件
 * @param item 订单明细项
 */
const deleteOrderDetail = async (item: any) => {
  try {
    loading.value = true;
    const res = await reqDeleteOrderDetail(item.id);
    const index = orderStore.order.orderDetails.findIndex((detail: any) => detail.id === item.id);
    orderStore.order.orderDetails.splice(index, 1);
  } catch (error) {
    console.log('删除订单明细项失败：', error);
  } finally {
    loading.value = false;
  }
};

const handleMemberSelected = (item: any) => {
  // console.log('会员', item);
  orderStore.order.vipId = item.id;
  orderStore.order.vipName = item.name;
  orderStore.order.vipPhoneNumber = item.phoneNumber;
  orderStore.order.vipCardNumber = item.cardNumber;
};

// #region 新增开单明细
const dialogVisible = ref(false);
const handleType = ref('add');
const showDialog = (type: boolean, row: any = {}) => {
  //   if (orderStore.order.customerType === CustomerType.Member && !orderStore.order.vipId) {
  //     Message.warning('请选择会员');
  //     return;
  //   }
  //   if (orderStore.order.customerType === CustomerType.Guest && !orderStore.order.customerName) {
  //     Message.warning('请输入散客姓名');
  //     return;
  //   }
  //   dialogVisible.value = true;
  //   if (type) {
  //     // 编辑
  //     handleType.value = 'edit';
  //     orderStore.detailForm = cloneDeep(row);
  //   } else {
  //     // 新增
  //     handleType.value = 'add';
  //     orderStore.resetDetailForm();
  //   }
};
</script>

<template>
  <Drawer v-model="drawerVisible" title="销售明细" @closed="handleDrawerClose">
    <div class="detail-container" v-loading="loading" :element-loading-text="LOADING_MSG">
      <!-- 上方信息区域 -->
      <div class="info-section">
        <div class="detail-item">
          <span>销售门店：</span>
          <span>{{ orderData.orgName || orgInfo.orgName }}</span>
        </div>
        <div class="detail-item">
          <span>手写单号：</span>
          <span>{{ orderData.manualOrderNo || '-' }}</span>
        </div>
        <div class="detail-item">
          <span>销售单号：</span>
          <span>{{ orderData.orderCode }}</span>
        </div>
        <div class="detail-item">
          <span>客户姓名：</span>
          <span>{{ orderData.vipName || orderData.customerName }}</span>
        </div>
        <div class="detail-item">
          <span>消费前余额：</span>
          <span>{{ orderData.beforeBalance }} 元</span>
        </div>
        <div class="detail-item">
          <span>消费后余额：</span>
          <span>{{ orderData.afterBalance }} 元</span>
        </div>
        <div class="detail-item">
          <span>实收总额：</span>
          <span>{{ orderData.actualAmount }} 元</span>
        </div>
        <div class="detail-item">
          <span>开单时间：</span>
          <span>{{ orderData.orderTime }}</span>
        </div>
        <div class="detail-item">
          <span>结算时间：</span>
          <span>{{ orderData.settleTime }}</span>
        </div>
        <div class="detail-item">
          <span>支付方式：</span>
          <span class="highlight" v-for="(item, index) in orderData.payments" :key="index">
            {{ item.paymentName }} ￥{{ item.totalAmount }}&nbsp;&nbsp;
          </span>
        </div>
        <!-- <div class="detail-item">
        <span>使用的优惠券：</span>
        <span>{{ orderData.discountAmount }}</span>
      </div> -->
        <div class="detail-item">
          <span>消费资产明细：</span>
          <div class="asset-tag">
            <el-tag v-for="(item, index) in orderData.payments" :key="index">
              <span>{{ item.assetCode || item.paymentName }}: ￥{{ item.totalAmount }}</span>
            </el-tag>
          </div>
        </div>
      </div>
      <!-- 下方表格区域 -->
      <div class="table-area">
        <PaginationTable :data="orderData.orderDetails" height="100%" size="small" :showPagination="false">
          <el-table-column prop="businessName" label="名称/标准价" min-width="80">
            <template #default="scope">
              <div>{{ scope.row.businessName }}</div>
              <div>标准价：{{ scope.row.stdPrice }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="truePrice" label="价格/数量" min-width="80">
            <template #default="scope">
              <div>单价：{{ scope.row.trueUnitPrice }} 元</div>
              <div>数量：{{ scope.row.quantity }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="bedName" label="床位" min-width="50">
            <template #default="{ row }">
              {{ orderData.bedName }}
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
          <el-table-column prop="serverType" label="上钟类型" min-width="60">
            <template #default="{ row }">
              <template v-if="row.bizType === OrderDetailType.Service">
                <ClockInTypeTag :type="row.serverType" />
              </template>
            </template>
          </el-table-column>
        </PaginationTable>
      </div>
      <div class="btn-area">
        <el-button
          type="primary"
          :disabled="orderData.orderStatus !== OrderStatus.SETTLED"
          :loading="btnLoading"
          @click="reconcileOrder"
        >
          对单
        </el-button>
      </div>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import MessageBox from '@/components/MessageBox';
import Message from '@/components/Message';
import { ref, onMounted, watch } from 'vue';
import { OrderDetailType } from '@/enums';
import { reqOrgInfo } from '@/api/acl/org';
import { parseResObj } from '@/utils/parseResponse';
import { reqReconcileOrder, reqQueryOrder } from '@/api/order/index';
import { OrderStatus } from '@/enums';
import { LOADING_MSG } from '@/utils/constants';

//#region 父子组件交互
interface Props {
  modelValue: boolean;
  order?: any;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
});

const emit = defineEmits(['update:model-value', 'close']);

watch(
  () => props.modelValue,
  (newVal: boolean) => {
    drawerVisible.value = newVal;
    if (newVal) {
      getOrder(props.order.orderCode);
    }
  },
);

const drawerVisible = ref<boolean>(false);

const handleDrawerClose = () => {
  emit('update:model-value', false);
  emit('close');
};
//#endregion

const orderData = ref<any>({});
const loading = ref(false);
/** 获取订单信息 */
const getOrder = async (orderCode: string) => {
  try {
    loading.value = true;
    const { data } = await reqQueryOrder(orderCode);
    orderData.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// watch(
//   () => props.order.orderCode,
//   (val: string) => {
//     if (val) {
//       if (val) {
//         getOrder(val);
//       }
//     }
//   },
//   { immediate: true },
// );

// 门店信息
const orgInfo = ref<any>({});

/** 获取门店详情 */
const getOrgDetail = async (orgId: number) => {
  if (orgId) {
    try {
      const res = await reqOrgInfo(orgId);
      orgInfo.value = parseResObj(res);
    } catch (error) {
      console.error('获取门店详情失败:', error);
      orgInfo.value = {};
    }
  }
};

// 使用计算属性，优先使用传入的数据，否则使用默认数据
// const order = computed(() => {
//   return props.orderData || {};
// });

// 监听订单数据变化，获取门店详情
watch(
  () => orderData.value.orgId,
  (newOrgId: number) => {
    if (newOrgId) {
      getOrgDetail(newOrgId);
    }
  },
);

// 组件挂载时获取门店详情
onMounted(() => {
  if (orderData.value.orgId) {
    getOrgDetail(orderData.value.orgId);
  }
});

// 对单按钮 loading
const btnLoading = ref(false);
/** 对单 */
const reconcileOrder = async () => {
  try {
    const prompt = await MessageBox.prompt({
      message: '输入对单备注',
      inputValue: '',
      inputPlaceholder: '输入对单备注',
      inputType: 'textarea',
    });

    btnLoading.value = true;
    const res = await reqReconcileOrder(orderData.value.id, prompt.value);
    // const result = parseResMsg(res);
    Message.success('对单成功');
    // console.log('对单结果：', res);
  } catch (error) {
    console.error(error);
  } finally {
    btnLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
.detail-container {
  height: 100%;

  .info-section {
    border-radius: 5px;
    font-size: 14px;
    padding: $main-padding;
    color: var(--el-text-color-regular);
    border: 1px solid var(--el-border-color);
    overflow: scroll;
    height: 270px;

    .detail-item {
      display: flex;
      align-items: center;
      line-height: 24px;

      > span:last-child {
        flex: 1;
      }

      .highlight {
        font-weight: bold;
      }
    }

    .asset-tag {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }
  }

  .table-area {
    margin-top: 15px;
    height: calc(100% - 270px - 50px - 15px);
  }

  .btn-area {
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
}

.tag {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  color: #259ce0;
}
</style>

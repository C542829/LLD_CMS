<template>
  <div class="main-container">
    <!-- 上方信息区域 -->
    <div class="info-section">
      <div class="detail-item">
        <span>销售门店：</span>
        <span>{{ orgInfo.orgName || order.orgId }}</span>
      </div>
      <div class="detail-item">
        <span>销售单号：</span>
        <span>{{ order.orderCode }}</span>
      </div>
      <div class="detail-item">
        <span>会员姓名：</span>
        <span>{{ order.vipName }}</span>
      </div>
      <div class="detail-item">
        <span>门店余额：</span>
        <span>{{ order.afterBalance }} 元</span>
      </div>
      <div class="detail-item">
        <span>联盟余额：</span>
        <span>{{ order.afterBalance }} 元</span>
      </div>
      <div class="detail-item">
        <span>开单时间：</span>
        <span>{{ order.orderTime }}</span>
      </div>
      <div class="detail-item">
        <span>结算时间：</span>
        <span>{{ order.settleTime }}</span>
      </div>
      <div class="detail-item">
        <span>实收总额：</span>
        <span>{{ order.actualAmount }} 元</span>
      </div>
      <div class="detail-item">
        <span>支付方式：</span>
        <span class="highlight" v-for="(item, index) in order.payments" :key="index">
          {{ item.paymentName }} ￥{{ item.totalAmount }}
        </span>
      </div>
      <!-- <div class="detail-item">
        <span>使用的优惠券：</span>
        <span>{{ order.discountAmount }}</span>
      </div> -->
      <div class="detail-item">
        <span>消费资产明细：</span>
        <div class="asset-tag">
          <el-tag v-for="(item, index) in order.payments" :key="index">
            <span>{{ item.assetCode }}: ￥{{ item.totalAmount }}</span>
          </el-tag>
        </div>
      </div>
    </div>
    <!-- 下方表格区域 -->
    <el-table :data="order.orderDetails" :border="true" size="small" stripe>
      <el-table-column prop="businessName" label="名称/标准价" min-width="120">
        <template #default="scope">
          <div>{{ scope.row.businessName }}</div>
          <div>标准价：{{ scope.row.stdPrice }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="truePrice" label="价格/数量" min-width="120">
        <template #default="scope">
          <div>单价：{{ scope.row.truePrice }} 元</div>
          <div>数量：{{ scope.row.quantity }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="bedName" label="床位" min-width="80">
        <template #default="scope">
          <div>{{ order.bedName }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="技师/销售" min-width="120">
        <template #default="scope">
          <div>
            {{ scope.row.userName }}
            <span v-if="scope.row.detailType === 1" class="tag" :style="{ color: scope.row.tagColor }">
              [{{ ServiceTypeMap[scope.row.serverType] || scope.row.serverType }}]
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { ServiceTypeMap } from '@/enums';
import { useOrgStore } from '@/store/modules/acl/org';

// 定义 props 接收父组件传递的数据
const props = defineProps<{
  orderData?: any;
}>();

// 门店store
const orgStore = useOrgStore();

// 门店信息
const orgInfo = ref<any>({});

// 获取门店详情
const getOrgDetail = async (orgId: number) => {
  if (orgId) {
    try {
      orgInfo.value = await orgStore.getOrgInfo(orgId);
    } catch (error) {
      console.error('获取门店详情失败:', error);
      orgInfo.value = {};
    }
  }
};

// 模拟后端返回数据（作为默认数据）
const defaultOrder = {
  saleStore: '郑州棉纺路店',
  orderNo: '125071114590007',
  memberName: '史先生 (N145900770)',
  storeBalance: '1248.60',
  allianceBalance: '1248.60',
  createTime: '2025-07-11 16:50:52',
  settleTime: '2025-07-11 16:52:40',
  totalAmount: '606.02',
  payMethod: '会员卡付 ¥606.02',
  couponInfo: '145900000574, 优惠88.0元',
  assetDetails: ['004F204F : 474.62元', '005105D7 : 131.4元'],
  productList: [
    {
      name: '经典足疗(112)',
      standardPrice: 88,
      price: 88,
      quantity: 1,
      bed: '卡6',
      staff: '技师:26(李小展)',
      tag: '点钟',
      tagColor: 'blue',
    },
    {
      name: '经络疏通40分钟(607)',
      standardPrice: 158,
      price: 109.02,
      quantity: 1,
      bed: '卡6',
      staff: '技师:26(李小展)',
      tag: '加钟',
      tagColor: 'orange',
    },
    {
      name: '惠嘉抑菌液(03)',
      standardPrice: 249,
      price: 199,
      quantity: 1,
      bed: '卡6',
      staff: '销售:88(刘)',
      tag: '',
      tagColor: '',
    },
    {
      name: '惠嘉抑菌液(03)',
      standardPrice: 249,
      price: 199,
      quantity: 1,
      bed: '卡6',
      staff: '销售:88(刘)',
      tag: '',
      tagColor: '',
    },
    {
      name: '惠嘉抑菌液(03)',
      standardPrice: 249,
      price: 199,
      quantity: 1,
      bed: '卡6',
      staff: '销售:88(刘)',
      tag: '',
      tagColor: '',
    },
    {
      name: '惠嘉抑菌液(03)',
      standardPrice: 249,
      price: 199,
      quantity: 1,
      bed: '卡6',
      staff: '销售:88(刘)',
      tag: '',
      tagColor: '',
    },
    {
      name: '惠嘉抑菌液(03)',
      standardPrice: 249,
      price: 199,
      quantity: 1,
      bed: '卡6',
      staff: '销售:88(刘)',
      tag: '',
      tagColor: '',
    },
  ],
};

// 使用计算属性，优先使用传入的数据，否则使用默认数据
const order = computed(() => {
  return props.orderData || defaultOrder;
});

// 监听订单数据变化，获取门店详情
watch(
  () => order.value.orgId,
  (newOrgId) => {
    if (newOrgId) {
      getOrgDetail(newOrgId);
    }
  },
  { immediate: true },
);

// 组件挂载时获取门店详情
onMounted(() => {
  if (order.value.orgId) {
    getOrgDetail(order.value.orgId);
  }
});
</script>

<style scoped lang="scss">
.info-section {
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  font-size: 14px;
  gap: $main-padding;
  padding: $main-padding;
  color: var(--el-text-color-regular);
  border: 1px solid var(--el-border-color);

  .detail-item {
    display: flex;
    align-items: center;

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

.tag {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  color: #259ce0;
}
</style>

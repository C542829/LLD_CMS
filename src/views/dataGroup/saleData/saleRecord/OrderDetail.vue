<template>
  <div class="main-container">
    <!-- 上方信息区域 -->
    <div class="info-section">
      <div class="detail-item">
        <span>销售门店：</span>
        <span>{{ order.saleStore }}</span>
      </div>
      <div class="detail-item">
        <span>销售单号：</span>
        <span>{{ order.orderNo }}</span>
      </div>
      <div class="detail-item">
        <span>会员姓名：</span>
        <span>{{ order.memberName }}</span>
      </div>
      <div class="detail-item">
        <span>门店余额：</span>
        <span>{{ order.storeBalance }} 元</span>
      </div>
      <div class="detail-item">
        <span>联盟余额：</span>
        <span>{{ order.allianceBalance }} 元</span>
      </div>
      <div class="detail-item">
        <span>开单时间：</span>
        <span>{{ order.createTime }}</span>
      </div>
      <div class="detail-item">
        <span>结算时间：</span>
        <span>{{ order.settleTime }}</span>
      </div>
      <div class="detail-item">
        <span>实收总额：</span>
        <span>{{ order.totalAmount }} 元</span>
      </div>
      <div class="detail-item">
        <span>支付方式：</span>
        <span class="highlight">{{ order.payMethod }}</span>
      </div>
      <div class="detail-item">
        <span>使用的优惠券：</span>
        <span>{{ order.couponInfo }}</span>
      </div>
      <div class="detail-item">
        <span>消费资产明细：</span>
        <div class="asset-tag">
          <el-tag v-for="(item, index) in order.assetDetails" :key="index">
            {{ item }}
          </el-tag>
        </div>
      </div>
    </div>
    <!-- 下方表格区域 -->
    <el-table :data="order.productList" :border="true" size="small" stripe>
      <el-table-column prop="name" label="名称/标准价" min-width="120">
        <template #default="scope">
          <div>{{ scope.row.name }}</div>
          <div>标准价：{{ scope.row.standardPrice }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格/数量" min-width="120">
        <template #default="scope">
          <div>单价：{{ scope.row.price }} 元</div>
          <div>数量：{{ scope.row.quantity }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="bed" label="床位" min-width="80"></el-table-column>
      <el-table-column prop="staff" label="技师/销售" min-width="120">
        <template #default="scope">
          <div>{{ scope.row.staff }}</div>
          <div>
            <span class="tag" :style="{ color: scope.row.tagColor }">[{{ scope.row.tag }}]</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// 模拟后端返回数据
const order = {
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
}
</style>

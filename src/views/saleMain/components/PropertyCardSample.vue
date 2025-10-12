<template>
  <div class="property-card-sample">
    <h3>PropertyCard 组件使用示例</h3>

    <div class="sample-intro">
      <p>PropertyCard 组件用于展示资产属性信息，支持通过 props 传递资产数据、门店名称、是否赠送和应付金额等信息。</p>
    </div>

    <div class="examples-container">
      <!-- 基础用法 -->
      <div class="example-section">
        <h4>基础用法</h4>
        <div class="cards-grid">
          <PropertyCard :propertyData="samplePropertyData" :orgName="'郑州棉纺路店'" :amount="198" />
        </div>
      </div>

      <!-- 赠送类型 -->
      <div class="example-section">
        <h4>赠送类型</h4>
        <div class="cards-grid">
          <PropertyCard :propertyData="samplePropertyData" :orgName="'郑州棉纺路店'" :isGiving="true" :amount="0" />
        </div>
      </div>

      <!-- 折扣类型 -->
      <div class="example-section">
        <h4>折扣类型</h4>
        <div class="cards-grid">
          <PropertyCard :propertyData="discountPropertyData" :orgName="'郑州中原路店'" :amount="158.4" />
        </div>
      </div>

      <!-- 无门店名称 -->
      <div class="example-section">
        <h4>无门店名称</h4>
        <div class="cards-grid">
          <PropertyCard :propertyData="samplePropertyData" :amount="198" />
        </div>
      </div>
    </div>

    <!-- 数据源展示 -->
    <div class="data-source">
      <h4>数据源示例</h4>
      <div class="data-tabs">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="标准数据">
            <pre>{{ JSON.stringify(samplePropertyData, null, 2) }}</pre>
          </el-tab-pane>
          <el-tab-pane label="折扣数据">
            <pre>{{ JSON.stringify(discountPropertyData, null, 2) }}</pre>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PropertyCard from './PropertyCard.vue';

/**
 * 资产属性数据接口
 */
interface PropertyData {
  id: number;
  createTime: string;
  updateTime: string;
  isDelete: number;
  remark: string | null;
  assetNum: string;
  assetBalance: number;
  assetType: number;
  assetDiscountBase: number;
  assetDiscountRate: number;
  assetIsCrossStore: number;
  assetCardNumber: string | null;
  vipId: number;
  orgId: number;
  version: number;
}

/**
 * 标准资产数据示例
 */
const samplePropertyData = ref<PropertyData>({
  id: 9,
  createTime: '2025-08-26 14:30:52',
  updateTime: '2025-08-26 14:30:52',
  isDelete: 0,
  remark: null,
  assetNum: 'A17561898522237448',
  assetBalance: 1000.0,
  assetType: 0,
  assetDiscountBase: 1,
  assetDiscountRate: 100,
  assetIsCrossStore: 1,
  assetCardNumber: null,
  vipId: 4,
  orgId: 1,
  version: 1,
});

/**
 * 折扣资产数据示例
 */
const discountPropertyData = ref<PropertyData>({
  id: 10,
  createTime: '2025-08-27 10:15:30',
  updateTime: '2025-08-27 10:15:30',
  isDelete: 0,
  remark: null,
  assetNum: 'A17561898522237449',
  assetBalance: 800.5,
  assetType: 0,
  assetDiscountBase: 1,
  assetDiscountRate: 80,
  assetIsCrossStore: 1,
  assetCardNumber: null,
  vipId: 5,
  orgId: 2,
  version: 1,
});

/**
 * 当前激活的标签页
 */
const activeTab = ref('0');
</script>

<style scoped lang="scss">
.property-card-sample {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

h3 {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 18px;
}

h4 {
  margin: 0 0 16px 0;
  color: #606266;
  font-size: 16px;
  font-weight: 500;
}

.sample-intro {
  margin-bottom: 24px;
  padding: 12px 16px;
  background: #ecf5ff;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.sample-intro p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.examples-container {
  margin-bottom: 32px;
}

.example-section {
  margin-bottom: 24px;
}

.cards-grid {
  display: flex;
  justify-content: center;
}

.data-source {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.data-tabs {
  margin-top: 12px;
}

.data-tabs pre {
  margin: 0;
  padding: 12px;
  background: #f8f8f8;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  font-size: 13px;
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>

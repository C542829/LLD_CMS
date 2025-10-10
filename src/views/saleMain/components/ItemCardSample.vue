<template>
  <div class="item-card-sample">
    <h3>ItemCard 组件使用示例</h3>

    <div class="sample-intro">
      <p>ItemCard 组件用于展示商品信息，支持通过 props 自定义数据结构和属性键名。</p>
    </div>

    <div class="examples-container">
      <!-- 基础用法 -->
      <div class="example-section">
        <h4>基础用法</h4>
        <div class="cards-grid">
          <ItemCard v-for="item in basicItems" :key="item.id" :data="item" @add="handleAddItem" />
        </div>
      </div>

      <!-- 自定义属性键名 -->
      <div class="example-section">
        <h4>自定义属性键名</h4>
        <div class="cards-grid">
          <ItemCard
            v-for="item in customItems"
            :key="item.productId"
            :data="item"
            :config="customConfig"
            @add="handleAddItem"
          />
        </div>
      </div>

      <!-- 嵌套属性访问 -->
      <div class="example-section">
        <h4>嵌套属性访问</h4>
        <div class="cards-grid">
          <ItemCard
            v-for="item in nestedItems"
            :key="item.id"
            :data="item"
            :config="nestedConfig"
            @add="handleAddItem"
          />
        </div>
      </div>

      <!-- 禁用状态 -->
      <div class="example-section">
        <h4>禁用状态</h4>
        <div class="cards-grid">
          <ItemCard :data="basicItems[0]" :disabled="true" @add="handleAddItem" />
        </div>
      </div>
    </div>

    <!-- 添加的商品列表 -->
    <div class="added-items" v-if="addedItems.length > 0">
      <h4>已添加商品</h4>
      <ul>
        <li v-for="(item, index) in addedItems" :key="index">
          {{ getItemName(item) }} - 数量: {{ item.quantity || 1 }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ItemCard from './ItemCard.vue';

/**
 * 基础商品数据（使用默认属性名）
 */
const basicItems = ref([
  {
    id: '1',
    name: '一次性工具',
    code: '0001',
    retailPrice: 15,
    memberPrice: 10,
    isDiscount: true,
  },
  {
    id: '2',
    name: '高级护理套装',
    code: '0002',
    retailPrice: 88,
    memberPrice: 68,
    isDiscount: false,
  },
]);

/**
 * 自定义属性键名的商品数据
 */
const customItems = ref([
  {
    productId: '3',
    title: '专业按摩精油',
    productCode: 'P003',
    originalPrice: 128,
    vipPrice: 98,
    noDiscount: true,
  },
  {
    productId: '4',
    title: '面部护理套装',
    productCode: 'P004',
    originalPrice: 198,
    vipPrice: 158,
    noDiscount: false,
  },
]);

/**
 * 嵌套结构的商品数据
 */
const nestedItems = ref([
  {
    id: '5',
    info: {
      name: '深层清洁面膜',
      code: 'M005',
    },
    pricing: {
      retail: 68,
      member: 58,
    },
    flags: {
      discount: false,
    },
  },
]);

/**
 * 自定义属性键名配置
 */
const customConfig = ref({
  nameKey: 'title',
  codeKey: 'productCode',
  retailPriceKey: 'originalPrice',
  memberPriceKey: 'vipPrice',
  isDiscountKey: 'noDiscount',
});

/**
 * 嵌套属性配置
 */
const nestedConfig = ref({
  nameKey: 'info.name',
  codeKey: 'info.code',
  retailPriceKey: 'pricing.retail',
  memberPriceKey: 'pricing.member',
  isDiscountKey: 'flags.discount',
});

/**
 * 已添加的商品列表
 */
const addedItems = ref<Record<string, any>[]>([]);

/**
 * 处理添加商品事件
 */
const handleAddItem = (item: Record<string, any>) => {
  // 检查商品是否已存在，如果存在则增加数量
  const existingItem = addedItems.value.find((i) => {
    // 根据不同的数据结构查找唯一标识
    return i.id === item.id || i.productId === item.productId;
  });

  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    // 深拷贝商品数据，避免修改原数据
    const newItem = { ...item, quantity: 1 };
    addedItems.value.push(newItem);
  }

  console.log('已添加商品:', addedItems.value);
};

/**
 * 获取商品名称（适配不同的数据结构）
 */
const getItemName = (item: Record<string, any>): string => {
  return item.name || item.title || item.info?.name || '未知商品';
};
</script>

<style scoped lang="scss">
.item-card-sample {
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
  margin-bottom: 24px;
}

.example-section {
  margin-bottom: 32px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.added-items {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.added-items ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.added-items li {
  margin-bottom: 8px;
  color: #606266;
  font-size: 14px;
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>

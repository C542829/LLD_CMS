<template>
  <!-- 服务中且有订单数据时，显示悬浮订单详情 -->
  <el-popover
    v-if="bedData.status === 1 && bedData.order"
    placement="right"
    :width="400"
    trigger="hover"
    :popper-class="'order-summary-popover'"
  >
    <template #reference>
      <div class="bed-card-box">
        <div class="bed-card">
          <!-- 卡片头部 -->
          <div class="bed-card__header">
            <div class="bed-card__header-left">
              <span>{{ bedData.bedName }}</span>
            </div>
            <div class="bed-card__header-right">
              <!-- <ModifyBed :bill="{}" /> -->
            </div>
          </div>

          <!-- 服务状态 -->
          <div class="bed-card__bottom bed-card__bottom--occupied">
            <div class="bed-card__info">
              <div class="bed-card__info-left">
                <span>服务中...</span>
              </div>
              <div class="bed-card__progress">
                <!-- <Progress :bed="bedData"></Progress> -->
              </div>
            </div>
            <div class="bed-card__option">
              <el-button @click="handleShowDrawer" type="primary" plain size="small">账单</el-button>
              <el-button @click="handleCheckout" type="primary" plain size="small">去结账</el-button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 订单详情内容 -->
    <OrderSummary :order-data="bedData.order" />
  </el-popover>

  <!-- 空闲状态或服务中但无订单数据时，不显示悬浮框 -->
  <div v-else class="bed-card-box">
    <div class="bed-card">
      <!-- 卡片头部 -->
      <div class="bed-card__header">
        <div class="bed-card__header-left">
          <span>{{ bedData.bedName }}</span>
        </div>
        <div v-if="bedData.status === 1" class="bed-card__header-right">
          <!-- <ModifyBed :bill="{}" /> -->
        </div>
      </div>

      <!-- 空闲状态 -->
      <div v-if="bedData.status === 0" class="bed-card__bottom bed-card__bottom--free">
        <div class="bed-card__info">
          <div class="bed-card__info-left">
            <span>空闲中...</span>
          </div>
        </div>
        <div class="bed-card__option">
          <el-button @click="handleCreate" type="primary" plain size="small">开单</el-button>
        </div>
      </div>

      <!-- 服务状态（无订单数据） -->
      <div v-if="bedData.status === 1 && !bedData.order" class="bed-card__bottom bed-card__bottom--occupied">
        <div class="bed-card__info">
          <div class="bed-card__info-left">
            <span>服务中...</span>
          </div>
          <div class="bed-card__progress">
            <!-- <Progress :bed="bedData"></Progress> -->
          </div>
        </div>
        <div class="bed-card__option">
          <el-button @click="handleShowDrawer" type="primary" plain size="small">账单</el-button>
          <el-button @click="handleCheckout" type="primary" plain size="small">去结账</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import OrderSummary from './OrderSummary.vue';
import { CashierRouteSign } from '@/enums/index';

/**
 * 床位卡片组件
 * @description 展示单个床位的状态信息和操作按钮
 */

// Props 定义
interface Props {
  /** 床位数据 */
  bedData: {
    id: number;
    bedName: string;
    status: number;
    order?: any;
  };
}

const props = defineProps<Props>();

// Emits 定义
interface Emits {
  /** 结账/开单事件 */
  (e: 'checkout', data: any, sign: CashierRouteSign): void;
  /** 显示抽屉事件 */
  (e: 'showDrawer', data: any): void;
}

const emit = defineEmits<Emits>();

/** 开单操作 */
const handleCreate = () => {
  emit('checkout', props.bedData, CashierRouteSign.Create);
};

/** 显示抽屉 */
const handleShowDrawer = () => {
  emit('showDrawer', props.bedData);
};

/** 去结账 */
const handleCheckout = () => {
  emit('checkout', props.bedData, CashierRouteSign.Settle);
};
</script>

<style scoped lang="scss">
.bed-card-box {
  color: #fff;
  width: 230px;
  height: 150px;
  margin: 10px 10px 30px 10px;
  border-radius: 5px;
  overflow: hidden;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 0 10px #68afff;
    transform: translateY(-1px);
  }

  .bed-card {
    height: 100%;
    display: flex;
    flex-direction: column;

    &__header {
      height: 30px;
      line-height: 30px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
      background-image: linear-gradient(to right top, #68afff, #b3d6ff);

      &-left {
        flex: 1;
      }
    }

    &__bottom {
      font-size: 14px;
      flex: 1;
      padding: 10px;
      line-height: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      &--free {
        background-image: linear-gradient(to right top, #68afff, #b3d6ff);
      }

      &--occupied {
        background-image: linear-gradient(to right top, #68afff, #e280f3);
      }
    }

    &__info {
      flex: 1;
      display: flex;

      &-left {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
    }

    &__option {
      height: 24px;
      display: flex;
      gap: 8px;
    }
  }
}
</style>

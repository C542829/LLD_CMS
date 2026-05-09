<template>
  <el-dialog v-model="visible" title="负债统计" width="600px" @open="fetchData">
    <div class="liability-dialog">
      <div v-if="userStore.isAdmin || userStore.isAreaManager" class="filter-row">
        <label>
          门店：
          <OrgSelect
            v-model="orgIds"
            placeholder="门店"
            class="w-240"
            :multiple="true"
            :max-collapse-tags="1"
            @change="fetchData"
            @clear="fetchData"
          />
        </label>
      </div>

      <div v-loading="loading" :element-loading-text="LOADING_MSG">
        <!-- 总负债 -->
        <div class="total-section">
          <div class="total-label">总负债</div>
          <div class="total-value">¥ {{ formatAmount(data.totalLiability) }}</div>
        </div>

        <!-- 会员卡总计 & 次卡总计 -->
        <el-row :gutter="20" class="detail-section">
          <el-col :span="12">
            <el-card shadow="never" class="stat-card">
              <template #header>
                <div class="stat-card-header">
                  <span>会员卡总计</span>
                  <span class="stat-card-total">¥ {{ formatAmount(data.cardTotal) }}</span>
                </div>
              </template>
              <div class="stat-item">
                <span class="stat-item-label">充值金</span>
                <span class="stat-item-value">¥ {{ formatAmount(data.rechargeTotal) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-item-label">赠送金</span>
                <span class="stat-item-value">¥ {{ formatAmount(data.presentTotal) }}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="never" class="stat-card">
              <template #header>
                <div class="stat-card-header">
                  <span>次卡总计</span>
                  <span class="stat-card-total">¥ {{ formatAmount(data.ticketTotal) }}</span>
                </div>
              </template>
              <div class="stat-item">
                <span class="stat-item-label">代金券</span>
                <span class="stat-item-value">¥ {{ formatAmount(data.consumerTicketTotal) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-item-label">项目券</span>
                <span class="stat-item-value">¥ {{ formatAmount(data.itemTicketTotal) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-item-label">产品券</span>
                <span class="stat-item-value">¥ {{ formatAmount(data.productTicketTotal) }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { reqLiability } from '@/api/member/liability';
import type { LiabilityVO } from '@/api/member/liability/types';
import { parseResObj } from '@/utils/parseResponse';
import { LOADING_MSG } from '@/utils/constants';
import useUserStore from '@/store/modules/acl/user';

const props = defineProps<{ visible: boolean }>();
const emit = defineEmits<{ (e: 'update:visible', val: boolean): void }>();

const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
});
const userStore = useUserStore();
const loading = ref(false);
const orgIds = ref<number[]>([]);

const data = reactive<LiabilityVO>({
  totalLiability: 0,
  cardTotal: 0,
  rechargeTotal: 0,
  presentTotal: 0,
  ticketTotal: 0,
  consumerTicketTotal: 0,
  itemTicketTotal: 0,
  productTicketTotal: 0,
});

const formatAmount = (val?: number) => (val ?? 0).toFixed(2);

const fetchData = async () => {
  loading.value = true;
  try {
    const params = orgIds.value.length ? { orgIds: orgIds.value } : undefined;
    const res = await reqLiability(params);
    const result = parseResObj(res);
    if (result) {
      Object.assign(data, result);
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.liability-dialog {
  .filter-row {
    margin-bottom: 16px;
  }

  .total-section {
    text-align: center;
    padding: 10px 0 20px;

    .total-label {
      font-size: 14px;
      color: #909399;
      margin-bottom: 8px;
    }

    .total-value {
      font-size: 32px;
      font-weight: 700;
      color: #303133;
    }
  }

  .detail-section {
    padding-bottom: 10px;
  }

  .stat-card {
    .stat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;

      .stat-card-total {
        font-size: 18px;
        color: #409eff;
      }
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .stat-item-label {
        color: #606266;
        font-size: 14px;
      }

      .stat-item-value {
        color: #303133;
        font-size: 16px;
        font-weight: 500;
      }
    }
  }
}
</style>

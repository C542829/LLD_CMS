<template>
  <el-dialog v-model="dialogVisible" title="打折优惠" width="30%" :before-close="handleClose">
    <div class="discount-content">
      <div class="discount-item">
        <span>待款总金额:</span>
        <span class="price-text">¥ {{ totalAmount }}</span>
      </div>
      <div class="discount-item">
        <span>优惠后金额:</span>
        <span class="price-text">¥ {{ discountedAmount }}</span>
      </div>
      <div class="discount-input-wrapper">
        <span>优惠金额:</span>
        <el-input
          v-model.number="discountAmount"
          type="number"
          placeholder="请输入优惠金额"
          :min="0"
          :max="totalAmount"
          class="discount-input"
        >
          <template #append>
            <el-button v-if="discountAmount > 0" @click="discountAmount = 0" size="small" type="text" class="clear-btn">
              <el-icon><CircleClose /></el-icon>
            </el-button>
            <span v-else class="currency-unit">元</span>
          </template>
        </el-input>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElDialog, ElInput, ElButton, ElIcon } from 'element-plus';
import { CircleClose } from '@element-plus/icons-vue';

interface Props {
  /**
   * 控制对话框显示状态
   */
  visible: boolean;
  /**
   * 待款总金额
   */
  totalAmount: number;
  /**
   * 初始优惠金额
   */
  initialDiscountAmount?: number;
}

interface Emits {
  /**
   * 对话框关闭事件
   */
  (e: 'update:visible', value: boolean): void;
  /**
   * 确认优惠事件
   */
  (e: 'confirm', discountAmount: number): void;
  /**
   * 取消优惠事件
   */
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  initialDiscountAmount: 0,
});

const emit = defineEmits<Emits>();

// 对话框显示状态
const dialogVisible = ref(props.visible);

// 优惠金额
const discountAmount = ref(props.initialDiscountAmount);

// 监听visible属性变化
watch(
  () => props.visible,
  (newValue) => {
    dialogVisible.value = newValue;
  },
);

// 监听dialogVisible变化，向父组件发出更新
watch(dialogVisible, (newValue) => {
  emit('update:visible', newValue);
});

// 监听初始优惠金额变化
watch(
  () => props.initialDiscountAmount,
  (newValue) => {
    discountAmount.value = newValue;
  },
);

// 优惠后金额
const discountedAmount = computed(() => {
  // 确保优惠金额不大于总金额且不为负数
  const validDiscountAmount = Math.max(0, Math.min(discountAmount.value || 0, props.totalAmount));
  return (props.totalAmount - validDiscountAmount).toFixed(2);
});

// 处理关闭事件
const handleClose = () => {
  emit('update:visible', false);
};

// 处理取消事件
const handleCancel = () => {
  emit('cancel');
  emit('update:visible', false);
};

// 处理确认事件
const handleConfirm = () => {
  // 确保优惠金额有效
  const validDiscountAmount = Math.max(0, Math.min(discountAmount.value || 0, props.totalAmount));
  emit('confirm', validDiscountAmount);
  emit('update:visible', false);
};
</script>

<style lang="scss" scoped>
.discount-content {
  padding: 10px 0;
}

.discount-item {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-text {
  color: #626681;
  font-size: 16px;
  font-weight: 500;
}

.discount-input-wrapper {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.discount-input {
  width: 180px;
}

.currency-unit {
  padding: 0 10px;
  color: #606266;
}

.clear-btn {
  padding: 0 5px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>

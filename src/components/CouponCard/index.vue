<template>
  <div :class="couponCardClass">
    <div class="coupon-card-box">
      <div class="card-title">
        <div class="card-title-vertical">{{ props.coupon.couponTypeName }}</div>
      </div>
      <div class="card-content">
        <div class="card-top-content">
          <div class="header">
            <el-popover
              title="优惠券描述"
              placement="right"
              trigger="click"
              width="auto"
              :popper-style="{ maxWidth: '350px' }"
            >
              <!-- 触发按钮 -->
              <template #reference>
                <el-button class="link" link size="small">{{ props.btnText }}</el-button>
              </template>

              <!-- 弹框内容 -->
              <template #default>
                <div class="popover-content">
                  <div>名称：{{ props.coupon.couponName }}</div>
                  <div>描述：{{ props.coupon.content }}</div>
                  <div>
                    使用条件：满{{ props.coupon.useLimitRule.limitBuy }}元，优惠{{ props.coupon.useLimitRule.value }}元
                  </div>
                  <div style="text-align: center">
                    <el-button v-if="props.coupon.isDisabled" @click="handleDisable" type="primary" link size="small">
                      启用
                    </el-button>
                    <el-button v-else @click="handleDisable" type="primary" link size="small">禁用</el-button>
                    <el-button :disabled="props.coupon.isDisabled" @click="handleMore" type="primary" link size="small">
                      更多
                    </el-button>
                  </div>
                </div>
              </template>
            </el-popover>
          </div>
          <div class="content">
            <span>{{ props.coupon.couponName }}</span>
          </div>
        </div>
        <div class="card-bottom-content">{{ props.coupon.couponTypeName }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElPopover } from 'element-plus';
import { defineProps, defineEmits, ref, computed, withDefaults } from 'vue';

interface CouponCard {
  coupon: any;
  title?: string;
  btnText?: string;
}

const props = withDefaults(defineProps<CouponCard>(), { title: '代金券', btnText: '详情' });

// 定义事件
const emit = defineEmits(['disable', 'more']);

// 禁用按钮事件
const handleDisable = () => {
  emit('disable', props.coupon);
};

// 更多按钮事件
const handleMore = () => {
  emit('more', props.coupon);
};

const couponCardClass = computed(() => {
  let classList = 'coupon-card ';
  classList += props.coupon.isDisabled ? 'coupon-card-disable' : 'coupon-card-entity';
  return classList;
});
</script>

<style scoped lang="scss">
.coupon-card {
  display: inline-block;
  user-select: none;
  margin: 10px;
  padding: 10px;
  width: 240px;
  height: 110px;
  background-image: radial-gradient(circle at 9px 8px, transparent 0, transparent 8px, #f0706a 0, #f0706a 100%);
  background-position: 60px -8px;
  transition: all 0.2s ease-in-out;
  color: #fff;
}

.coupon-card-entity {
  background-image: radial-gradient(circle at 9px 8px, transparent 0, transparent 8px, #6aaeee 0, #6aaeee 100%);
  color: #fff;
}

.coupon-card-disable {
  background-image: radial-gradient(circle at 9px 8px, transparent 0, transparent 8px, #a59c9b 0, #a59c9b 100%);
  color: #666;
}

.coupon-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 10px #c6d2f3;
}

.coupon-card-box {
  display: flex;
  height: 100%;
}

.coupon-card-box > div {
  background-color: transparent;
}

.card-title {
  font-size: 20px;
  width: 59px;
  flex: none;
  text-align: center;
  display: flex;
  align-items: center;
  border-right: 1px dashed;
}

.card-title-vertical {
  writing-mode: vertical-lr;
  text-align: center;
}

.card-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  clear: both;
}

.card-top-content {
  flex: auto;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-top-content .content {
  height: 100%;
  flex: auto;
  font-size: 14px;
  margin-top: 10px;
}

.card-top-content .header {
  height: 15px;
  flex: none;
}

.card-top-content .link {
  float: right;
  color: #ffe8fe;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.card-top-content .link:hover {
  color: #fff;
}

.card-bottom-content {
  text-align: center;
  font-size: 12px;
  color: #dedfe4;
  height: 30px;
  flex: none;
}

.popover-content {
  line-height: 30px;
}
</style>

<template>
  <div class="row-item">
    <div class="item-top">
      <!-- 商品名称 -->
      <div class="item-top-left">
        <span>
          <span>{{ index }}、{{ data?.businessName || '名称' }}</span>
        </span>
      </div>

      <!-- 商品信息 -->
      <div class="item-top-right">
        <!-- 总价 -->
        <span class="total-price">总价:{{ data.truePrice }}</span>
        <!-- 优惠券 -->
        <template v-if="data.bizType === OrderDetailType.Service">
          <template v-if="!orderStore.isCreated">
            <el-tooltip effect="dark" content="开单后才能选择优惠券" placement="top">
              <span class="item-coupon-info">
                <el-button
                  type="primary"
                  link
                  size="large"
                  icon="Ticket"
                  :disabled="!orderStore.isCreated"
                  style="transform: scale(1.3)"
                />
              </span>
            </el-tooltip>
          </template>
          <template v-else>
            <span class="item-coupon-info">
              <CouponSelect :detailItem="data" @change="selectCoupon"></CouponSelect>
            </span>
          </template>
        </template>
        <!-- 自定义价格 -->
        <span class="edit-price">
          <el-input-number
            v-model="data.trueUnitPrice"
            :min="0"
            :disabled="data.disabled"
            controls-position="right"
            class="w-100"
            @change="handleChangePrice"
          />
        </span>
        <!-- 删除按钮 -->
        <span class="item-del">
          <el-icon @click="handleDelete"><Delete /></el-icon>
        </span>
      </div>
    </div>

    <!-- 订单明细项参数 -->
    <div class="item-bottom">
      <!-- 订单明细项参数 -->
      <div class="bottom-left">
        <!-- 销售人 -->
        <label>
          <span>销售：</span>
          <UserSelect
            v-model="data.technicians"
            :maxCollapseTags="1"
            emitObject
            placeholder="销售人"
            class="w-180"
            @change="handleChangeUser"
          />
        </label>
        <!-- 数量 -->
        <template v-if="data.bizType !== OrderDetailType.Service">
          <label class="m-l-10">
            <span>数量：</span>
            <el-input-number
              v-model="data.quantity"
              :min="1"
              :max="1000"
              :step="1"
              controls-position="right"
              style="width: 80px"
              @change="handleChangeQuantity"
            />
          </label>
        </template>
        <!-- 上钟类型 -->
        <template v-if="data.bizType === OrderDetailType.Service">
          <label class="m-l-10">
            <span>上钟类型：</span>
            <el-select
              v-model="data.serverType"
              value-key="value"
              clearable
              placeholder="类型"
              style="width: 80px"
              @change="handleChangeServerType"
            >
              <el-option v-for="item in ServiceTypeOptions" :value="item.value" :label="item.label" :key="item.value" />
            </el-select>
          </label>
        </template>
      </div>

      <!-- 优惠券标签 -->
      <div class="bottom-right">
        <template v-if="data?.coupon">
          <el-tag type="primary" closable @close="handleCloseTag">
            <span>{{ data?.coupon?.ticketName || '无' }}</span>
          </el-tag>
        </template>
      </div>
    </div>

    <!-- 标签 -->
    <div :class="isPT.class">{{ isPT.text }}</div>
  </div>
</template>

<script setup lang="ts">
import Message from '@/components/Message';
import CouponSelect from '@/views/saleMain/components/CouponSelect.vue';
import { computed } from 'vue';
import { type Types, reqUpdateServerEmployee, reqUpdateServerType } from '@/api/order/index';
import { CouponType, OrderDetailType, ServiceTypeOptions } from '@/enums/index';
import { useOrderStore } from '@/store/modules/order/index';
import { isEmpty } from 'lodash';
import { mul } from '@/utils/bigMethods';

const orderStore = useOrderStore();

interface Props {
  index: number; // 订单明细项索引
  data: Types.OrderDetailVO; // 订单明细数据
}

/**
 * 组件属性定义
 */
const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits(['cancel-coupon', 'delete']);

/**
 * 修改销售人员
 * @param id 员工ID
 */
const handleChangeUser = (technicians: Types.OrderDetailTechnicianDTO[]) => {
  if (props.data.id) {
    updateServiceEmployee(props.data.id!, technicians);
  }
};

/**
 * 同步销售信息
 * @param detailId 订单明细ID
 * @param params 销售信息
 */
const updateServiceEmployee = async (detailId: number, technicians: Types.OrderDetailTechnicianDTO[]) => {
  try {
    const res = await reqUpdateServerEmployee(detailId, technicians);
    console.log('修改技师成功：', res);
    Message.success('修改销售成功');
  } catch (error) {
    console.error('修改技师失败：', error);
  }
};

/**
 * 修改上钟类型
 * @param serverType
 */
const handleChangeServerType = async (serverType: number) => {
  if (!props.data?.id) {
    return;
  }

  try {
    const res = await reqUpdateServerType(props.data.id, serverType);
    Message.success('更新上钟类型成功');
  } catch (error) {}
};

/**
 * 修改数量
 * @param quantity 数量
 */
const handleChangeQuantity = (cur: number | undefined, prev: number | undefined) => {
  orderStore.updateOrderDetailPrice();
};

/**
 * 修改价格
 * @param price 价格
 */
const handleChangePrice = (cur: number | undefined, prev: number | undefined) => {
  props.data.truePrice = mul(props.data.trueUnitPrice, props.data.quantity!);

  // 如果修改使用项目券，则更新项目券金额
  if (props.data.coupon) {
    const coupon = orderStore?.order?.ticketUseList?.find((item: any) => item.ticketId === props.data.coupon.id);
    if (coupon) {
      coupon.amount = props.data.truePrice;
    }
  }
};

/**
 * 删除选择的项目券
 */
const handleCloseTag = () => {
  if (!orderStore.order.ticketUseList) {
    return;
  }

  const index = orderStore.order.ticketUseList.findIndex((item: any) => item.ticketId === props.data.coupon.id);
  if (index !== -1) {
    orderStore.order.ticketUseList.splice(index, 1);
  }
  // props.data.truePrice = props.data.stdPrice;
  // if (props.data.coupon) {
  //   props.data.coupon.active = false;
  // }
  props.data.coupon = null;
  // props.data.disabled = false;
  orderStore.updateOrderDetailPrice();
};

/**
 * 选择项目券
 * @param coupon 项目券
 */
const selectCoupon = (coupon: any) => {
  if (!isEmpty(props.data.coupon)) {
    handleCloseTag();
  }

  if (coupon?.ticketInfo?.ticketType === CouponType.experience) {
    // 将优惠券挂载到当前明细用于UI展示
    props.data.coupon = coupon;

    // coupon.active = true;
    // 选择项目券时将价格重置为标准价
    // props.data.trueUnitPrice = props.data.stdPrice;
    // props.data.truePrice = props.data.stdPrice;

    // 选择项目券时将价格设置为券面值
    props.data.trueUnitPrice = coupon.amount ?? coupon.ticketInfo?.ticketValue ?? props.data.stdPrice;
    props.data.truePrice = props.data.trueUnitPrice;

    // 禁用当前修改单价的编辑框
    // props.data.disabled = true;

    const useCoupon: any = {
      ticketId: coupon.id,
      ticketType: coupon.ticketInfo.ticketType,
      amount: props.data.truePrice,
      detailName: props.data.businessName,
      coupon: props.data.coupon,
    };
    if (props.data?.id) {
      useCoupon.detailId = props.data.id;
    }
    if (props.data.index) {
      useCoupon.detailIndex = props.data.index;
    }
    orderStore.order.ticketUseList && orderStore.order.ticketUseList.push(useCoupon);
  }
};

/**
 * 删除订单明细项
 */
const handleDelete = () => {
  // 处理删除事件
  emit('delete', props.data);
};

/**
 * 订单明细标签
 */
const isPT = computed(() => {
  const result = { class: '', text: '' };
  if (props.data?.bizType === OrderDetailType.Product) {
    result.class = 'is-pt-prod';
    result.text = '产 品';
  } else if (props.data?.bizType === OrderDetailType.Service) {
    result.class = 'is-pt-svr';
    result.text = '项 目';
  } else if (props.data?.bizType === OrderDetailType.TreatmentCoupon) {
    result.class = 'is-pt-treat';
    result.text = '疗 程';
  }
  return result;
});
</script>

<style lang="scss" scoped>
.row-item {
  position: relative;
  background-color: #f7f8fa;
  height: 100px;
  margin-top: 5px;
  margin-bottom: 10px;
  border-radius: 4px;
  padding: 10px 15px;
  transition: box-shadow 0.2s ease-in-out;
  min-width: 360px;
  overflow: hidden;
}

.row-item:hover {
  box-shadow: 0 0 10px #ddd;
}

.row-item .item-top {
  position: relative;
  height: 40px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .item-top-left {
    //
  }
  .item-top-right {
    display: flex;
    align-items: center;

    .total-price {
      font-size: 14px;
      font-weight: 600;
      color: var(--el-color-danger);
    }
    .item-coupon-info {
      margin-left: 12px;
    }
    .edit-price {
      margin-left: 12px;
    }
    .item-del {
      margin-left: 12px;
    }
    .item-del:hover {
      color: var(--el-color-primary);
      cursor: pointer;
    }
  }
}

.item-bottom {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bottom-left {
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.bottom-right {
  //
}

.row-item .is-pt-prod {
  background-color: #3408f7;
}

.row-item .is-pt-prod,
.row-item .is-pt-svr {
  position: absolute;
  left: -30px;
  top: 41px;
  height: 15px;
  width: 100px;
  line-height: 15px;
  color: #fff;
  text-align: center;
  transform-origin: left top;
  transform: rotate(-45deg);
  font-size: 10px;
}

.row-item .is-pt-svr {
  background-color: #02af45;
}

.row-item .is-pt-treat {
  position: absolute;
  background-color: #fd5f5f;
  left: -30px;
  top: 41px;
  height: 15px;
  width: 100px;
  line-height: 15px;
  color: #fff;
  text-align: center;
  transform-origin: left top;
  transform: rotate(-45deg);
  font-size: 10px;
}
</style>

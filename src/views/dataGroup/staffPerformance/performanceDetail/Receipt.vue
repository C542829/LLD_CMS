<template>
  <div class="dialog-container">
    <article class="consumption-detail">
      <div>
        <span>单据编号: 125070314590016</span>
        <span>单据日期: 2025-07-03</span>
      </div>
      <div>
        <span>会员卡号: N145900813</span>
        <span>会员姓名: 刘涵</span>
      </div>
    </article>

    <div class="tab-container">
      <el-tabs type="border-card" style="height: 100%">
        <el-tab-pane class="tab-pane-content" style="height: 100%">
          <template #label>
            <span>项目/产品消费</span>
          </template>
          <el-table :data="consumptions" :border="true" height="100%" stripe class="table-container">
            <el-table-column prop="tradeTime" label="项目/产品消费" />
            <el-table-column prop="actualAmount" label="标准价" />
            <el-table-column prop="salesNo" label="数量" />
            <el-table-column prop="orgName" label="金额" />
            <el-table-column prop="orgName" label="上钟类型" />
            <el-table-column prop="orgName" label="技师/销售" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <span>支付明细</span>
          </template>
          <article class="pay-detail">
            <div>
              <span>会员卡支付</span>
              <span>118</span>
            </div>
            <div>
              <span>消费资产明细</span>
              <el-tag>0005:118元</el-tag>
            </div>
          </article>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps(['receipt']);

const consumptions = ref([
  {
    id: 23003453,
    orgId: 1459,
    salesNo: '125070414590006',
    tradeTime: '2025-07-04 18:47:09',
    memberId: 866407,
    beforeBalance: 583.8,
    afterBalance: 499.43,
    beforeUnionBalance: 583.8,
    afterUnionBalance: 499.43,
    shouldAmount: 143,
    actualAmount: 84.37,
    discountAmount: 58.63,
    optDiscount: 0,
    optDisId: 0,
    totalCost: 0,
    commissionAmount: 41,
    cashPay: 0,
    memberCardPay: 84.37,
    bankCardPay: 0,
    wechatPay: 0,
    aliPay: 0,
    couponsPay: 0,
    entityCouponPay: 0,
    meiTuanPay: 0,
    kouBeiPay: 0,
    douYinPay: 0,
    lianLianPay: 0,
    otherPay: 0,
    createrUserId: 46713,
    settleUserId: 46713,
    orderStatus: 39,
    transSettleAmount: 0,
    transBrandId: 0,
    signBillStaffId: 0,
    timesCardInfo: '',
    createTime: '2025-07-04 18:10:14',
    updateTime: '2025-07-04 18:47:09',
    updateUserId: 46713,
    batchFlag: '',
    batchNum: 1,
    shortDate: 250704,
    onlinePay: 0,
    onlinePayAmount: 0,
    payState: 0,
    receiptCoupon: 0,
    orgName: '郑州棉纺路店',
    memName: '杨丹',
    memCode: '145900499',
    levelCode: 'N',
    cellPhoneNo: '15039056751',
    createUserName: '刘',
    settleUserName: '刘',
  },
  {
    id: 22846567,
    orgId: 1459,
    salesNo: '125062214590011',
    tradeTime: '2025-06-22 18:13:22',
    memberId: 866407,
    beforeBalance: 616.25,
    afterBalance: 583.8,
    beforeUnionBalance: 616.25,
    afterUnionBalance: 583.8,
    shouldAmount: 55,
    actualAmount: 32.45,
    discountAmount: 22.55,
    optDiscount: 0,
    optDisId: 0,
    totalCost: 0,
    commissionAmount: 17,
    cashPay: 0,
    memberCardPay: 32.45,
    bankCardPay: 0,
    wechatPay: 0,
    aliPay: 0,
    couponsPay: 0,
    entityCouponPay: 0,
    meiTuanPay: 0,
    kouBeiPay: 0,
    douYinPay: 0,
    lianLianPay: 0,
    otherPay: 0,
    createrUserId: 46713,
    settleUserId: 46713,
    orderStatus: 39,
    transSettleAmount: 0,
    transBrandId: 0,
    signBillStaffId: 0,
    timesCardInfo: '',
    createTime: '2025-06-22 18:12:33',
    updateTime: '2025-06-22 18:13:22',
    updateUserId: 46713,
    batchFlag: '',
    batchNum: 1,
    shortDate: 250622,
    onlinePay: 0,
    onlinePayAmount: 0,
    payState: 0,
    receiptCoupon: 0,
    orgName: '郑州棉纺路店',
    memName: '杨丹',
    memCode: '145900499',
    levelCode: 'N',
    cellPhoneNo: '15039056751',
    createUserName: '刘',
    settleUserName: '刘',
  },
]);
</script>

<style lang="scss" scoped>
.dialog-container {
  height: 60vh;
  display: flex;
  flex-direction: column;
  padding: 0 $main-padding;

  .consumption-detail {
    width: 60%;
    line-height: 30px;
    height: 70px;

    > div {
      display: flex;
      > span {
        flex: 1;
      }
    }
  }

  .tab-container {
    flex: 1;
    height: calc(60vh - 70px);
  }

  .pay-detail {
    padding: 20px;
    line-height: 30px;

    > div {
      display: flex;
      align-items: flex-end;
      > span:first-child {
        width: 120px;
      }
    }
  }
}
</style>

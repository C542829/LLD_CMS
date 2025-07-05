<template>
  <div class="vip-info-container">
    <!-- 会员基本信息 -->
    <el-card>
      <!-- 会员卡 -->
      <div class="member-card" style="">
        <div>
          <h1>王鹏</h1>
          <span>先生</span>
        </div>
        <div>普通会员</div>
        <div>N434526</div>
      </div>

      <!-- 基本信息 -->
      <Card :padding="10" shadow="always" bgColor="#fff" style="margin-top: 10px; line-height: 20px">
        <p>
          <span>微信：</span>
          <el-button type="primary" link icon="Promotion">去绑定</el-button>
        </p>
        <p>生日：</p>
        <p>电话：</p>
        <p>地址：</p>
        <p>备注：</p>
      </Card>

      <!-- 资产信息 -->
      <Card :padding="10" shadow="always" bgColor="#fff" style="margin-top: 10px; line-height: 20px">
        <p>
          <span>本店余额：</span>
          <el-button type="primary" link icon="Promotion">去充值</el-button>
        </p>
        <p>可用余额：</p>
        <p>本店可用优惠券：</p>
      </Card>

      <!-- 标签 -->
      <Card
        :padding="10"
        shadow="always"
        bgColor="#fff"
        style="margin-top: 10px; line-height: 20px; padding-bottom: 10px"
      >
        <h2>郑州棉纺路店</h2>
        <div>
          <el-button size="small" plain icon="Plus">标签</el-button>
        </div>
      </Card>
    </el-card>

    <!-- 资产明细 -->
    <Card bgColor="#fff" shadow="always">
      <div style="margin-top: 10px; flex-grow: 0">
        <span>时间段：</span>
        <DatePicker @selectDate="selectDate" :default="defaultDate" style="width: 260px; margin-right: 10px" />
        <el-button type="primary">查询</el-button>
      </div>

      <PropertyDetail />
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import PropertyDetail from './property/index.vue';

// 默认最近一月日期
const defaultDate = computed(() => {
  const end = new Date();
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
  return [start, end];
});

const selectDate = (start: string, end: string) => {
  console.log('选择的日期范围:', start, end);
};
</script>

<style lang="scss" scoped>
.vip-info-container {
  height: 85vh;
  display: flex;
  gap: $main-padding;

  > div:last-child {
    flex: 1;
  }
}

.member-card {
  height: 160px;
  width: 320px;
  border-radius: 8px;
  color: #eee;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 0 10px #d4b2eb;
  background: linear-gradient(to right top, rgb(144, 108, 156), rgb(138, 140, 247));

  > div:first-child {
    display: flex;
    gap: 5px;
    h1 {
      font-weight: bold;
      font-size: 24px;
    }
    span {
      align-self: flex-end;
    }
  }
}
</style>

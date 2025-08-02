<template>
  <div class="main-container">
    <!-- 数据筛选 -->
    <Card class="operation-card">
      <!-- 第一行 -->
      <div class="search-container">
        <div class="search-item">
          <label>
            充值时段：
            <DatePicker v-model="store.recordSearch.date" @change="search" style="width: 260px" />
          </label>
        </div>
      </div>

      <!-- 第二行 -->
      <div class="search-container">
        <div class="search-item">
          <label for="rechargeStatus">
            <span>充值状态：</span>
            <el-select v-model="store.recordSearch.rechargeStatus" style="width: 120px">
              <el-option
                v-for="item in rechargeStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </label>
        </div>
        <div class="search-item">
          <label>
            <span>支付类型：</span>
            <el-select v-model="store.recordSearch.payType" style="width: 120px">
              <el-option v-for="item in paymentTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </label>
        </div>
        <div class="search-item">
          <label>
            <span>销售人员：</span>
            <el-select v-model="store.recordSearch.memberId" style="width: 120px">
              <el-option key="未指定" label="未指定" :value="''" />
              <!-- <el-option
                v-for="item in [{ value: '', label: '' }]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              /> -->
            </el-select>
          </label>
        </div>
        <div class="search-item">
          <label>
            <span>会员信息：</span>
            <div>
              <el-input v-model="store.recordSearch.inputValue" placeholder="姓名 | 卡号 | 手机号" clearable />
            </div>
          </label>
        </div>
        <div class="search-item">
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
        <div class="search-item">
          <el-button type="info" @click="store.resetRecordSearchParams">重置</el-button>
        </div>
      </div>
    </Card>

    <!-- 数据列表 -->
    <Card padding="0">
      <PaginationTable
        v-loading="settingStore.loading"
        :element-loading-text="settingStore.loadingMsg"
        :data="[{}, {}]"
        :total="store.rechargeRecord.total"
        v-model:currentPage="store.recordSearch.pageNum"
        v-model:pageSize="store.recordSearch.pageSize"
        @size-change="handleSizeChange"
        @pagination-current-change="handleCurrentChange"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="infoGender" label="充值时间" width="170" />
        <el-table-column prop="infoCardNumber" label="相关人员">
          <template #default="scope">
            <p>销售员：{{ scope.row.a }}</p>
            <p>操作员：{{ scope.row.a }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="infoPhoneNumber" label="充值会员">
          <template #default="scope">
            <p>姓名：{{ scope.row.a }}</p>
            <p>卡号：{{ scope.row.a }}</p>
            <p>电话：{{ scope.row.a }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="infoLastConsumptionTime" label="充值金额及资产编号">
          <template #default="scope">
            <p>充值：{{ scope.row.a }}</p>
            <p>赠券：{{ scope.row.a }}</p>
            <p>活动：{{ scope.row.a }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="infoLastRechargeTime" label="充值">
          <template #default="scope">
            <p>类型：{{ scope.row.a }}</p>
            <p>微信支付：{{ scope.row.a }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button link type="primary" @click="">冲正</el-button>
            <br />
            <el-button link type="primary" @click="">修改充值单据</el-button>
            <br />
            <el-button link type="primary" @click="">重打小票</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <el-dialog v-model="dialog.visible" :title="dialog.title" width="800px"></el-dialog>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';

import { rechargeStatusOptions, paymentTypeOptions } from '@/enums/index';

// 引入数据仓库
import { useSettingStore } from '@/store/modules/acl/setting';
import { useRechargeStore } from '@/store/modules/member/recharge';
const settingStore = useSettingStore();
const store = useRechargeStore();

// 初始化
onMounted(() => {});

// 搜索
const search = () => {
  store.setRechargeRecord();
};

// 处理分页变化
const handleSizeChange = (val: number) => {
  store.rechargeRecord.pageSize = val;
  store.setRechargeRecord();
};

const handleCurrentChange = (val: number) => {
  store.rechargeRecord.pageNum = val;
  store.setRechargeRecord();
};

// 模态框
const dialog = reactive({
  title: '优惠券列表',
  visible: false,
});

// 打开模态框
const showDialog = (row: any) => {
  // 显示模态框
  dialog.title = `会员${row.name}在本店的资产详情`;
  dialog.visible = true;

  // 表单数据回显
  // store.formData = row;
};
</script>

<style scoped lang="scss"></style>

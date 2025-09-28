<template>
  <div class="main-container">
    <!-- 数据筛选 -->
    <Card class="operation-card">
      <!-- 第一行 -->
      <div class="search-container">
        <div class="search-item">
          <label>
            充值时段：
            <DatePicker
              v-model="store.recordSearch.date"
              @change="search"
              @clear="search"
              clearable
              style="width: 260px"
            />
          </label>
        </div>
      </div>

      <!-- 第二行 -->
      <div class="search-container">
        <div class="search-item">
          <label for="rechargeStatus">
            <span>充值状态：</span>
            <el-select
              v-model="store.recordSearch.rechargeStatus"
              @change="search"
              @clear="search"
              clearable
              style="width: 120px"
            >
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
            <el-select
              v-model="store.recordSearch.paymentType"
              @change="search"
              @clear="search"
              clearable
              style="width: 120px"
            >
              <el-option v-for="item in paymentTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </label>
        </div>
        <div class="search-item">
          <label>
            <span>销售人员：</span>
            <el-select
              v-model="store.recordSearch.userId"
              @change="search"
              @clear="search"
              clearable
              style="width: 120px"
            >
              <el-option key="未指定" label="未指定" :value="''" />
              <el-option v-for="item in staffList" :key="item.id" :label="item.userName" :value="item.id" />
            </el-select>
          </label>
        </div>
        <div class="search-item">
          <label>
            <span>会员信息：</span>
            <div>
              <el-input
                v-model="store.recordSearch.vipInfoFiled"
                clearable
                @clear="search"
                placeholder="姓名 | 卡号 | 手机号"
              />
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
        :data="store.rechargeRecord.list"
        :total="store.rechargeRecord.total"
        :row-class-name="getRowClassName"
        v-model:currentPage="store.recordSearch.pageNum"
        v-model:pageSize="store.recordSearch.pageSize"
        @size-change="handleSizeChange"
        @pagination-current-change="handleCurrentChange"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="rechargeTime" label="充值时间" width="155" :formatter="datetimeFormatter" />
        <el-table-column prop="infoCardNumber" label="相关人员" min-width="80">
          <template #default="{ row }">
            <div>
              <div>
                <span>销售员：</span>
                <span>{{ row.userKpiList.map((e: any) => e.userName).join('、') }}</span>
              </div>
              <div>操作员：{{ row.userName }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="infoPhoneNumber" label="充值会员" width="180">
          <template #default="scope">
            <p>姓名：{{ scope.row.vipName }}</p>
            <p>卡号：{{ scope.row.vipCardNumber }}</p>
            <p>电话：{{ scope.row.vipPhoneNumber }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="infoLastConsumptionTime" label="充值金额及资产编号" min-width="100">
          <template #default="{ row }">
            <p>充值：￥{{ row.rechargeValue }}({{ row.assetCode }})</p>
            <template v-if="row.ticketInfo">
              <p>赠券：{{ row.ticketInfo }}</p>
            </template>
            <template v-if="row.activeName">
              <p>活动：{{ row.activeName }}</p>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="infoLastRechargeTime" label="充值" min-width="60">
          <template #default="{ row }">
            <div>
              <div>类型：{{ row.rechargeType }}</div>
              <div v-for="(item, key) in row.paymentInfoList" :key="key">
                <span>{{ item.paymentName }}</span>
                <span>：￥{{ item.paymentAmount }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button link type="primary" @click="billReversal(row)">冲正</el-button>
            <br />
            <el-button link type="primary" @click="showDialog(row)">修改充值单据</el-button>
            <br />
            <el-button link type="primary" @click="reprint(row)">重打小票</el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <el-dialog v-model="dialog.visible" :title="dialog.title" width="800px"></el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { datetimeFormatter } from '@/utils/formatter';

import { rechargeStatusOptions, paymentTypeOptions } from '@/enums/index';

// 引入数据仓库
import { useSettingStore } from '@/store/modules/acl/setting';
import { useRechargeStore } from '@/store/modules/member/recharge';
import { useDynamicDataStore } from '@/store/modules/enums/dynamicData';
const settingStore = useSettingStore();
const store = useRechargeStore();
const dynamicDataStore = useDynamicDataStore();

// 初始化
onMounted(() => {
  search();
  getStaffList();
});

// 销售员列表
const staffList = ref<any>([]);
const getStaffList = async () => {
  const res = await dynamicDataStore.getUserList();
  if (res && res.data && res.data.rows) {
    staffList.value = res.data.rows || [];
  }
};
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

const billReversal = (row: any) => {
  // store.billReversal(row);
};

const reprint = (row: any) => {
  // store.billReversal(row);
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
// 设置行样式
const getRowClassName = ({ row }: { row: { rechargeStatus: number } }) => {
  return row.rechargeStatus ? 'disabled-row' : '';
};
</script>

<style scoped lang="scss"></style>

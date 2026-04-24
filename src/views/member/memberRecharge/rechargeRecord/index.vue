<template>
  <div class="main-container">
    <!-- 数据筛选 -->
    <Card class="operation-card">
      <!-- 第一行 -->
      <div class="search-container">
        <div class="search-item">
          <label>
            充值时段：
            <IDatePicker v-model="dateRange" @change="search" @clear="search" class="w-220" />
          </label>
        </div>
        <template v-if="userStore.isAdmin || userStore.isAreaManager">
          <div class="search-item">
            <label>
              门店：
              <OrgSelect
                v-model="recordSearch.orgIds"
                placeholder="门店"
                class="w-100"
                :multiple="true"
                :max-collapse-tags="0"
                @change="search"
                @clear="search"
              />
            </label>
          </div>
        </template>
      </div>

      <!-- 第二行 -->
      <div class="search-container">
        <div class="search-item">
          <label for="rechargeStatus">
            <span>充值状态：</span>
            <el-select v-model="recordSearch.rechargeStatus" clearable class="w-100" @change="search" @clear="search">
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
            <el-select v-model="recordSearch.paymentType" clearable class="w-100" @change="search" @clear="search">
              <el-option v-for="item in paymentTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </label>
        </div>
        <div class="search-item">
          <label>
            <span>销售人员：</span>
            <UserSelect
              v-model="recordSearch.userId"
              placeholder="销售人员"
              class="w-100"
              :multiple="false"
              @change="search"
              @clear="search"
            />
          </label>
        </div>
        <div class="search-item">
          <label>
            <span>会员信息：</span>
            <div>
              <el-input
                v-model="recordSearch.vipInfoFiled"
                clearable
                placeholder="姓名 | 卡号 | 手机号"
                class="w-150"
                @clear="search"
              />
            </div>
          </label>
        </div>
        <div class="search-item">
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
        <div class="search-item">
          <el-button type="info" @click="resetRecordSearchParams">重置</el-button>
        </div>
      </div>
    </Card>

    <!-- 数据列表 -->
    <Card padding="0">
      <PaginationTable
        v-loading="loading"
        :element-loading-text="LOADING_MSG"
        :data="rechargeRecord.list"
        :total="rechargeRecord.total"
        :row-class-name="getRowClassName"
        v-model:currentPage="recordSearch.pageNum"
        v-model:pageSize="recordSearch.pageSize"
        @size-change="handleSizeChange"
        @pagination-current-change="handleCurrentChange"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="orgName" label="门店" min-width="30" />
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
        <el-table-column prop="infoPhoneNumber" label="充值会员" min-width="80">
          <template #default="scope">
            <p>姓名：{{ scope.row.vipName }}</p>
            <p>卡号：{{ scope.row.vipCardNumber }}</p>
            <p>电话：{{ scope.row.vipPhoneNumber }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="infoLastConsumptionTime" label="充值金额及资产编号" min-width="100">
          <template #default="{ row }">
            <div class="el-v-center">
              <p>充值：￥{{ row.rechargeValue }}</p>
              <el-tag style="margin-left: 8px">({{ row.assetCode }})</el-tag>
            </div>
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
              <div>类型：{{ RechargeTypeMap[row.rechargeType as RechargeType] }}</div>
              <div v-for="(item, key) in row.paymentInfoList" :key="key">
                <span>{{ item.paymentName }}</span>
                <span>：￥{{ item.paymentAmount }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button link type="primary" @click="showDetailDialog(row)">详情</el-button>
            <el-button
              link
              type="primary"
              :disabled="row.rechargeStatus !== RechargeStatus.SUCCESS"
              @click="billReversal(row)"
            >
              冲正
            </el-button>
            <br />
            <el-button link type="primary" :disabled="true" @click="showDialog(row)">修改充值单据</el-button>
            <br />
            <el-button
              link
              type="primary"
              :disabled="row.rechargeStatus !== RechargeStatus.SUCCESS"
              @click="reprint(row)"
            >
              重打小票
            </el-button>
          </template>
        </el-table-column>
      </PaginationTable>
    </Card>
  </div>

  <OrderModify v-model:visible="dialog.visible" :data="dialog.data" />
  <RechargeDetailDialog v-model="detailDialogVisible" :data="detailDialogData" />
</template>

<script setup lang="ts">
import OrderModify from './OrderModify.vue';
import RechargeDetailDialog from './components/RechargeDetailDialog.vue';
import MessageBox from '@/components/MessageBox/index';
import Message from '@/components/Message';

import { ref, reactive, onMounted } from 'vue';
import { datetimeFormatter } from '@/utils/formatter';
import { isFullDaysSince } from '@/utils/time';
import { LOADING_MSG } from '@/utils/constants';
import { type Types, reqRechargeHistoryList, reqRollBackRecharge } from '@/api/member/recharge/index';
import {
  RechargeStatus,
  rechargeStatusOptions,
  paymentTypeOptions,
  RechargeType,
  RechargeTypeMap,
} from '@/enums/index';
import { printer } from '@/utils/lodop';
import { parseResMsg, parseResObj } from '@/utils/parseResponse';
import useUserStore from '@/store/modules/acl/user';

const userStore = useUserStore();

// 初始化
onMounted(() => {
  search();
});

// #region 充值记录
/** 日期范围 */
const dateRange = ref<string[]>([]);

// 充值记录请求参数
const recordSearch = reactive<Types.RechargeRecordRequest>({
  orgIds: [],
  paymentType: '',
  vipInfoFiled: '',
  rechargeStatus: RechargeStatus.SUCCESS,
  userId: '',
  pageNum: 1,
  pageSize: 50,
  startTime: '',
  endTime: '',
});

const resetRecordSearchParams = () => {
  recordSearch.vipInfoFiled = '';
  recordSearch.paymentType = '';
  recordSearch.rechargeStatus = RechargeStatus.SUCCESS;
  recordSearch.userId = '';
  recordSearch.startTime = '';
  recordSearch.endTime = '';
  dateRange.value = [];
  search();
};

// 处理请求参数
const handleParams = () => {
  const params: any = { ...recordSearch };
  // 处理日期范围参数
  if (Array.isArray(dateRange.value) && dateRange.value.length === 2) {
    params.startTime = dateRange.value[0];
    params.endTime = dateRange.value[1];
  } else {
    params.startTime = '';
    params.endTime = '';
  }

  if (params.rechargeStatus === undefined) {
    params.rechargeStatus = '';
  }
  if (params.paymentType === undefined) {
    params.paymentType = '';
  }
  if (params.userId === undefined) {
    params.userId = '';
  }
  return params || {};
};

const loading = ref(false);

// 响应结果
const rechargeRecord: any = reactive({ total: 0, list: [] });
const setRechargeRecord = async () => {
  loading.value = true;
  try {
    // 获取数据列表
    const params = handleParams();
    const res = await reqRechargeHistoryList(params);
    const { rows, total } = parseResObj(res);
    rechargeRecord.total = total;
    rechargeRecord.list = rows;
  } catch (error) {
    console.error('获取充值记录失败：', error);
  } finally {
    loading.value = false;
  }
};

// #endregion

// 搜索
const search = () => {
  setRechargeRecord();
};

// 处理分页变化
const handleSizeChange = (val: number) => {
  recordSearch.pageSize = val;
  search();
};

const handleCurrentChange = (val: number) => {
  recordSearch.pageNum = val;
  search();
};

const billReversal = async (row: any) => {
  if (isFullDaysSince(row.rechargeTime, 2)) {
    Message.warning('只能对两天以内的记录进行修改或冲正');
    return;
  }

  try {
    const prompt = await MessageBox.prompt({
      title: '充值记录-冲正',
      message: `冲正后，将不计算此单业绩，你确定要冲正会员“ ${row.vipName} ”这条充值记录吗？`,
      inputValue: '',
      inputPlaceholder: '输入冲正原因',
      inputType: 'textarea',
    });
    const res = await reqRollBackRecharge(row.historyCode, prompt.value);
    parseResMsg(res);
    search();
  } catch (error) {}
};

const reprint = async (row: any) => {
  // 打印小票
  if (row.rechargeStatus !== RechargeStatus.SUCCESS) {
    Message.warning('充值记录无效，无法打印小票！');
    return;
  }

  const org = userStore.org;
  const data = { ...row, ...org };
  printer.printRechargeByHTML(data, false);
};

// 模态框
const dialog = reactive({
  title: '优惠券列表',
  visible: false,
  data: {},
});

// 打开模态框
const showDialog = (row: any) => {
  // if (isFullDaysSince(row.rechargeTime, 2)) {
  //   Message.warning('只能对两天以内的记录进行修改或冲正');
  //   return;
  // }

  // 显示模态框
  dialog.data = row;
  dialog.title = `修改单据`;
  dialog.visible = true;
  // 表单数据回显
  // formData = row;
};

// const isUpdate = (row: any) => {
//   const rechargeTime = new Date(row.rechargeTime);
//   const nowTime = new Date();
//   console.log();
//   return isFullDaysSince
// };

// #region 充值详情对话框
const detailDialogVisible = ref(false);
const detailDialogData = ref<any>({});

/** 查看充值详情 */
const showDetailDialog = (row: any) => {
  detailDialogData.value = row;
  detailDialogVisible.value = true;
};
// #endregion

/** 设置行样式 */
const getRowClassName = ({ row }: { row: { rechargeStatus: number } }) => {
  return row.rechargeStatus !== RechargeStatus.SUCCESS ? 'disabled-row' : '';
};
</script>

<style scoped lang="scss"></style>

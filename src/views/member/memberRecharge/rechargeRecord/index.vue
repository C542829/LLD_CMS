<template>
  <div class="main-container">
    <!-- 数据筛选 -->
    <Card class="operation-card">
      <!-- 第一行 -->
      <div class="search-container">
        <div class="search-item" v-if="false">
          <label for="staffStatus" class="search-label">选择店铺：</label>
          <el-select v-model="store.search.storeId" id="staffStatus" style="width: 120px" placeholder="选择店铺">
            <el-option
              v-for="item in [{ value: 1, label: '' }]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="search-item">
          <label>
            充值时段：
            <DatePicker v-model="store.totalParams.date" style="width: 260px" />
          </label>
        </div>
      </div>

      <!-- 第二行 -->
      <div class="search-container">
        <div class="search-item">
          <label for="rechargeStatus">充值状态：</label>
          <el-select v-model="store.search.status" id="rechargeStatus" style="width: 120px">
            <el-option key="全部状态" label="全部状态" :value="2" />
            <el-option key="充值成功" label="充值成功" :value="0" />
            <el-option key="已冲正" label="已冲正" :value="1" />
          </el-select>
        </div>
        <div class="search-item">
          <label for="payType">支付类型：</label>
          <el-select v-model="store.search.payType" id="payType" placeholder="选择支付类型" style="width: 120px">
            <el-option
              v-for="item in [{ value: 1, label: '' }]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="search-item">
          <label for="saleStaff">销售人员：</label>
          <el-select v-model="store.search.salesperson" id="saleStaff" style="width: 120px">
            <el-option key="未指定" label="未指定" :value="0" />
            <el-option
              v-for="item in [{ value: 1, label: '' }]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="search-item">
          <label for="memberInfo">会员信息：</label>
          <div>
            <el-input v-model="store.search.inputValue" id="memberInfo" placeholder="姓名 | 卡号 | 手机号" clearable />
          </div>
        </div>
        <div class="search-item">
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
      </div>
    </Card>

    <!-- 数据列表 -->
    <Card padding="0">
      <PaginationTable
        v-loading="settingStore.loading"
        :element-loading-text="settingStore.loadingMsg"
        :data="[{}, {}]"
        :total="store.totalRecord.total"
        v-model:currentPage="store.totalParams.currentPage"
        v-model:pageSize="store.totalParams.pageSize"
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

// 引入数据仓库
import { useSettingStore } from '@/store/modules/acl/setting';
import { useMemberStore } from '@/store/modules/member/member';
const settingStore = useSettingStore();
const store = useMemberStore();

// 初始化
onMounted(() => {});

// 搜索
const search = () => {
  store.setTotalRecord();
};

// 处理分页变化
const handleSizeChange = (val: number) => {
  store.activeParams.pageSize = val;
  store.setTotalRecord();
};

const handleCurrentChange = (val: number) => {
  store.activeParams.currentPage = val;
  store.setTotalRecord();
};

// 模态框
const dialog = reactive({
  title: '优惠券列表',
  visible: false,
});

// 打开模态框
const showDialog = (row: any) => {
  // 显示模态框
  dialog.title = `会员${row.infoName}在本店的资产详情`;
  dialog.visible = true;

  // 表单数据回显
  store.formData = row;
};
</script>

<style scoped lang="scss"></style>

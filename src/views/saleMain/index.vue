<template>
  <div class="top-content">
    <div class="top-item"></div>
    <div class="top-item search">
      <el-autocomplete
        v-model="inputValue"
        @select="handleSelect"
        :fetch-suggestions="querySearchAsync"
        :prefix-icon="Search"
        placeholder="姓名 | 手机号 | 会员卡号"
        size="large"
        value-key="name"
        clearable
      >
        <template #default="{ item }">
          <div class="mem-info-card">
            <p>
              <span>姓名：</span>
              <span>{{ item.name }}</span>
            </p>
            <p>
              <span>电话：</span>
              <span>{{ item.phoneNumber }}</span>
            </p>
            <p>
              <span>卡号：</span>
              <span>{{ item.cardNumber }}</span>
            </p>
          </div>
        </template>
        <template #append>
          <el-button type="primary" size="large">搜索</el-button>
        </template>
      </el-autocomplete>
    </div>
    <div class="top-item"></div>
    <!-- <div class="top-item"></div> -->
    <div class="top-item bed">
      <!-- <el-alert title="Warning alert" type="info" /> -->
      <div class="bed-info" v-show="bed.id">
        <div>
          <span>床位：</span>
          <span>{{ bed.bedName }}</span>
          <span>&nbsp;{{ bed.status === 0 ? '空闲' : '占用' }}</span>
        </div>
        <div @click="clearBed" class="hover-pointer">
          <el-icon :size="24"><Close /></el-icon>
        </div>
      </div>
    </div>
    <div class="top-item"></div>
    <div class="top-item">
      <el-dropdown placement="bottom" trigger="click" @command="selectBed">
        <el-button plain>选择床位订单</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command="bed" v-for="bed in bedList" :key="bed.id">
              <span>{{ bed.bedName }}</span>
              &nbsp;&nbsp;
              <span :style="{ color: bed.status === 0 ? 'green' : 'red' }">
                {{ bed.status === 0 ? '空闲' : '占用' }}
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="top-item"></div>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref, watch, onMounted } from 'vue';
import { useSettingStore } from '@/store/modules/acl/setting';
import { useMemberStore } from '@/store/modules/member/member';
import { useRechargeStore } from '@/store/modules/member/recharge';
import { useRoomStore } from '@/store/modules/setGroup/room';
const roomStore = useRoomStore();
const settingStore = useSettingStore();
const memberStore = useMemberStore();
const store = useRechargeStore();

const bedList: any = ref([]);
const bed: any = ref({});
const clearBed = () => {
  bed.value = {};
};

const selectBed = (e: any) => {
  bed.value = e;
};
onMounted(async () => {
  bedList.value = await roomStore.getAllBedList();
});

// 搜索会员
const inputValue = ref('');
// 搜索联想会员列表
const querySearchAsync = async (queryString: string, cb: (arg: any) => void) => {
  if (!queryString) {
    cb([]);
    return;
  }
  const results = await memberStore.getAssociateList(queryString, 50);
  // if (results.length === 1) {
  //   store.member = { ...results[0] };
  // }
  cb(results);
};

// 选中会员
const handleSelect = (item: Record<string, any>) => {
  inputValue.value = '';
  store.member = { ...item };
};
</script>

<style scoped lang="scss">
.top-content {
  height: 70px;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: 1fr;
  border-bottom: 1px solid var(--el-border-color);

  .top-item {
    // border: 1px red solid;
    // height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .top-item.search {
    grid-column: 2 / 4;
  }
  .top-item.bed {
    grid-column: 5 / 7;
    .bed-info {
      height: 45px;
      line-height: 45px;
      width: 100%;
      font-weight: 600;
      color: var(--el-text-color-secondary);
      background-color: $base-bg;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 10px;

      > div:first-child {
        flex: 1;
        text-align: center;
      }
      > div:last-child {
        display: flex;
        align-items: center;
      }
    }
  }
}

// 搜索提示会员信息
.mem-info-card {
  line-height: 20px;
  margin: 10px;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

<template>
  <div class="main-container">
    <!-- 搜索操作 -->
    <Card flex="row" :gap="20">
      <div><BtnForm @submit="addRoom" btnText="添加房间" tipText="请输入房间名称" /></div>
      <div>
        <el-input
          v-model="searchKeyword"
          :prefix-icon="Search"
          @keydown.enter="search"
          @clear="search"
          placeholder="搜索房间名称"
          clearable
          class="search-input"
        >
          <template #append>
            <el-button type="primary" @click="search">搜索</el-button>
          </template>
        </el-input>
      </div>
    </Card>

    <!-- 房间列表 -->
    <Card v-loading="loading" :element-loading-text="LOADING_MSG" flex="row" :gap="30" class="room-list">
      <Card v-for="room in filteredRoomList" wrap="nowrap" bgColor="#5cb3cc" class="room-card">
        <div class="card-top">
          <span class="name">{{ room.roomName }}</span>
          <el-button @click="editRoomInfo(room)" link size="small" style="color: #dff9fb">编辑</el-button>
        </div>
        <div class="card-bottom">
          <span>总床位：{{ room.bedCount }}</span>
          <span>空闲数：{{ room.freeBedCount }}</span>
        </div>
      </Card>
    </Card>
  </div>

  <!-- 抽屉 -->
  <keep-alive>
    <Drawer v-model="drawerVisible" title="房间信息">
      <div class="bed-list">
        <!-- 房间信息 -->
        <Card>
          <div class="room-name-area">
            <span>房间名：</span>
            <DynamicInput :value="editRoom.roomName" @change="updateRoomName" />
          </div>
          <div>床位数：{{ editRoom.bedCount }}</div>
          <div>空闲中：{{ editRoom.freeBedCount }}</div>
        </Card>

        <!-- 床位列表 -->
        <Card padding="10px">
          <div class="bed-list-header">
            <span>床位信息</span>
            <BtnForm @submit="addBed" btnText="添加床位" tipText="请输入床位名称" />
          </div>

          <!-- 床位列表 -->
          <PaginationTable
            :data="bedList"
            v-loading="bedLoading"
            :border="true"
            :showPagination="false"
            :element-loading-text="LOADING_MSG"
            :row-class-name="getRowClassName"
          >
            <el-table-column prop="bedName" label="床位名" width="230">
              <template #default="{ row }">
                <DynamicInput :value="row.bedName" :params="row" @change="updateBedName" width="100%" :key="row.id" />
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" :formatter="bedStatusMap" min-width="50" />
            <el-table-column label="操作" width="60">
              <template #default="{ row }">
                <template v-if="row.status !== 2">
                  <el-button @click="disabledBed(row)" :disabled="row.status === 1" link type="warning">停用</el-button>
                </template>
                <template v-else>
                  <el-button @click="enabledBed(row)" link type="primary">恢复</el-button>
                </template>
              </template>
            </el-table-column>
          </PaginationTable>
        </Card>
      </div>
    </Drawer>
  </keep-alive>
</template>

<script setup lang="ts">
import MessageBox from '@/components/MessageBox';
import { Search } from '@element-plus/icons-vue';
import { ref, computed, onMounted, inject } from 'vue';
import { bedStatusMap } from '@/utils/formatter';
import { LOADING_MSG } from '@/utils/constants';
import { parseResMsg } from '@/utils/parseResponse';
import {
  type Types,
  reqRoomList,
  reqAddRoom,
  reqUpdateRoom,
  reqBedList,
  reqAddBed,
  reqUpdateBed,
  reqUpdateBedStatus,
} from '@/api/setGroup/room';

// 本地状态
const loading = ref(false);
const bedLoading = ref(false);
const roomList = ref<Types.RoomInfoVO[]>([]);
const bedList = ref<Types.RoomBedVO[]>([]);
const searchKeyword = ref('');

// 搜索过滤
const filteredRoomList = computed(() => {
  if (!searchKeyword.value) return roomList.value;
  return roomList.value.filter((item) =>
    item.roomName?.toLocaleLowerCase().includes(searchKeyword.value.toLocaleLowerCase()),
  );
});

// 获取房间列表
const fetchRoomList = async () => {
  loading.value = true;
  try {
    const res = await reqRoomList();
    roomList.value = res.data || [];
  } finally {
    loading.value = false;
  }
};

// 获取床位列表
const fetchBedList = async (roomId: number) => {
  bedLoading.value = true;
  try {
    const res = await reqBedList({ roomId });
    bedList.value = res.data || [];
  } finally {
    bedLoading.value = false;
  }
};

// 搜索
const search = () => {
  // 使用 computed 自动过滤，无需额外操作
};

// 添加房间
const addRoom = async (value: string) => {
  const res = await reqAddRoom({ roomName: value }).catch(() => null);
  if (!res) return;
  const result = parseResMsg(res);
  if (result) fetchRoomList();
};

// 修改房间名
const updateRoomName = async (value: string) => {
  const res = await reqUpdateRoom({ id: editRoom.value.id!, roomName: value }).catch(() => null);
  if (!res) return;
  const result = parseResMsg(res);
  if (result) {
    fetchRoomList();
    editRoom.value.roomName = value;
  }
};

// 当前编辑的房间信息
const editRoom = ref<Types.RoomInfoVO>({} as Types.RoomInfoVO);
const editRoomInfo = (room: Types.RoomInfoVO) => {
  editRoom.value = { ...room };
  fetchBedList(room.id!);
  drawerVisible.value = true;
};

// 添加床位
const addBed = async (value: string) => {
  const res = await reqAddBed({ roomId: editRoom.value.id!, bedName: value }).catch(() => null);
  if (!res) return;
  const result = parseResMsg(res);
  if (result) {
    fetchBedList(editRoom.value.id!);
    fetchRoomList();
  }
};

// 修改床位名称
const updateBedName = async (value: string, params: any) => {
  const res = await reqUpdateBed({ roomId: params.roomInfoId, bedName: value }).catch(() => null);
  if (!res) return;
  const result = parseResMsg(res);
  if (result) {
    fetchBedList(editRoom.value.id!);
    fetchRoomList();
  }
};

// 停用床位
const disabledBed = async (row: Types.RoomBedVO) => {
  const result = await MessageBox.confirm({
    title: '确认操作',
    message: `你确定要禁用床位【${row.bedName}】吗？`,
    type: 'warning',
  });
  if (result) {
    const status = row.status === 0 ? 2 : 0;
    const res = await reqUpdateBedStatus({ bedId: row.id!, status }).catch(() => null);
    if (!res) return;
    const success = parseResMsg(res);
    if (success) {
      fetchBedList(editRoom.value.id!);
      fetchRoomList();
    }
  }
};

// 启用床位
const enabledBed = async (row: Types.RoomBedVO) => {
  const res = await reqUpdateBedStatus({ bedId: row.id!, status: 0 }).catch(() => null);
  if (!res) return;
  const result = parseResMsg(res);
  if (result) {
    fetchBedList(editRoom.value.id!);
    fetchRoomList();
  }
};

// 控制抽屉
const drawerVisible = ref(false);
// 禁用行
const getRowClassName = ({ row }: { row: { status: number } }) => {
  return row.status === 2 ? 'disabled-row' : '';
};

onMounted(() => {
  fetchRoomList();
});
</script>

<style scoped lang="scss">
.main-container {
  padding: $main-padding;

  // 房间
  .room-list {
    > div > div {
      width: 180px;
    }

    > div > div:hover {
      transform: translateY(-3px);
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    }

    .room-card {
      color: white;

      .card-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 35px;
      }

      .card-bottom {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        line-height: 30px;
      }
    }
  }
}

// 床位
.bed-list {
  display: flex;
  flex-direction: column;
  gap: $main-padding;

  .room-name-area {
    display: flex;
    align-items: center;
    height: $main-padding * 2;
    line-height: $main-padding * 2;
    > div {
      flex: 1;
    }
  }

  .bed-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $main-padding - 5px;
  }
}

:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

<template>
  <div class="room-container">
    <!-- 搜索操作 -->
    <Card shadow="never">
      <div class="room-header">
        <div class="header-container">
          <BtnForm @submit="addRoom" btnText="添加房间" tipText="请输入房间名称" />
        </div>
        <div class="search-container">
          <div class="search-item">
            <el-input
              v-model="store.searchParams.roomName"
              :prefix-icon="Search"
              @keydown.enter="search"
              placeholder="搜索房间名称"
              class="search-input"
            >
              <template #append>
                <el-button type="primary" @click="search">搜索</el-button>
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </Card>

    <!-- 房间列表 -->
    <Card>
      <div class="room-list">
        <Card v-for="room in store.roomList" class="room-content" bgColor="#5cb3cc">
          <div class="room-card">
            <div class="card-top">
              <span class="name">{{ room.roomName }}</span>
              <el-button @click="editRoomInfo(room)" link size="small" style="color: #dff9fb">编辑</el-button>
            </div>
            <div class="card-bottom">
              <span>总床位：{{ room.bedTotal }}</span>
              <span>空闲数：{{ room.bedRemaining }}</span>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  </div>

  <!-- 抽屉 -->
  <keep-alive>
    <Drawer v-model="drawerVisible" title="房间信息" :key="editRoom.id">
      <div class="bed-list">
        <!-- 房间信息 -->
        <Card :padding="15">
          <div class="room-name-area">
            <span>房间名：</span>
            <DynamicInput :value="editRoom.roomName" @update="updateRoomName" />
          </div>
          <div>床位数：{{ editRoom.bedTotal }}</div>
          <div>空闲中：{{ editRoom.bedRemaining }}</div>
        </Card>

        <!-- 床位列表 -->
        <Card :padding="15">
          <div class="bed-list-header">
            <span>床位信息</span>
            <BtnForm @submit="addBed" btnText="添加床位" tipText="请输入床位名称" />
          </div>
          <Table :data="store.bedList" :border="true" :row-class-name="getRowClassName">
            <el-table-column prop="bedName" label="床位名" width="230">
              <template #default="scope">
                <DynamicInput :value="scope.row.bedName" :params="scope.row.id" @update="updateBedName" :width="120" />
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" min-width="50" />
            <el-table-column label="操作" width="60">
              <template #default="scope">
                <el-button @click="showConfirm(scope.row)" link type="warning">暂停</el-button>
              </template>
            </el-table-column>
          </Table>
        </Card>
      </div>
    </Drawer>
  </keep-alive>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref, onMounted, inject } from 'vue';

// 导入房间仓库
import { useRoomStore } from '@/store/modules/setGroup/room';
const store = useRoomStore();

const $MessageBox: any = inject('$MessageBox');

// 初始化
onMounted(() => {
  store.setRoomList();
});

// 搜索
const search = () => {
  store.setRoomList();
};

// 添加房间
const addRoom = (value: object) => {
  store.updateRoom({ roomName: value });
};

// 修改房间名
const updateRoomName = (data: { value: string }) => {
  store.updateRoom({ id: editRoom.value.id, roomName: data.value });
};

// 当前编辑的房间信息
const editRoom: any = ref({});
// 点击编辑获取当前房间的床位数据列表
const editRoomInfo = (room: { id: number }) => {
  editRoom.value = { ...room };
  console.log('当前房间信息 = ', editRoom.value);
  store.setBedList(room.id);
  drawerVisible.value = true;
};

// 添加床位
const addBed = (value: string) => {
  const params = { roomInfoId: editRoom.value.id, bedName: value };
  store.updateBed(params);
};

// 修改床位名称
const updateBedName = (data: { value: string; params: number }) => {
  store.updateBed({ id: data.params, bedName: data.value });
};

// 禁用
const showConfirm = async ($row: any) => {
  const result = await $MessageBox.confirm({
    title: '确认操作',
    message: `你确定要禁用床位【${$row.bedName}】吗？`,
    type: 'warning',
  });
  result && store.updateBedStatus({ ...$row, status: '暂停使用' });
};

// 控制抽屉
const drawerVisible = ref(false);
// 禁用行
const getRowClassName = ({ row }: { row: { status: string } }) => {
  return row.status === '暂停使用' ? 'disabled-row' : '';
};
</script>

<style scoped lang="scss">
.room-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: $main-padding;
  padding: $main-padding;

  .room-header {
    display: flex;
    gap: $main-padding;
  }
  .room-list {
    display: flex;
    flex-wrap: wrap;
    gap: $main-padding * 2;

    .room-content {
      color: white;
      line-height: 30px;
      width: 180px;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
      }

      .room-card {
        display: flex;
        flex-direction: column;
        gap: $main-padding;
        justify-content: space-between;
        > div {
          display: flex;
          justify-content: space-between;
        }

        .card-bottom {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
        }
      }
    }
  }
}

.bed-list {
  display: flex;
  flex-direction: column;
  gap: $main-padding;

  .room-name-area {
    display: flex;
    align-items: center;
    height: $main-padding * 2;
    line-height: $main-padding * 2;
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

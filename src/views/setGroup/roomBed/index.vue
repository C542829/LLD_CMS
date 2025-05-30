<template>
  <div class="room-container">
    <Card shadow="never">
      <div class="room-header">
        <div class="header-container">
          <el-button type="primary">添加房间</el-button>
        </div>
        <div class="search-container">
          <div class="search-item">
            <el-input v-model="searchWord" :prefix-icon="Search" placeholder="搜索房间名称" class="search-input">
              <template #append>
                <el-button type="primary" @click="search">搜索</el-button>
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </Card>
    <Card shadow="never">
      <div class="room-list">
        <Card :bgColor="'#5cb3cc'" :shadow="'hover'" v-for="room in roomList" class="room-content">
          <div class="room-card">
            <div class="card-top">
              <span class="name">{{ room.roomName }}</span>
              <span>
                <button type="button" style="color: #dff9fb" class="el-button el-button--text el-button--small">
                  <span @click="drawerVisible = true">编辑</span>
                </button>
              </span>
            </div>
            <div data-v-549672f4="" class="card-bottom">
              <span data-v-549672f4="">总床位:{{ room.bedTotal }}</span>
              <span data-v-549672f4="">空闲数:{{ room.bedRemaining }}</span>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  </div>
  <!-- 抽屉表单 -->
  <Drawer v-model="drawerVisible" :title="drawerTitle" @close="handleDrawerClose">
    <div class="drawer-content">
      <Card>
        <div>
          <div>
            <span>房间名：</span>
            <span>
              <div>
                <span>二楼</span>
                <el-link type="primary" @click="" ref="inputStatus">修改</el-link>
              </div>
              <div>
                <el-input type="text" />
                <el-link type="primary" @click="">取消</el-link>
                <el-link type="primary" @click="">确定</el-link>
              </div>
            </span>
          </div>
          <div>
            <span>床位数：</span>
            <span></span>
          </div>
          <div>
            <span>空闲中：</span>
            <span></span>
          </div>
        </div>
      </Card>

      <Card>
        <Table :data="tableData" :border="true" :stripe="true" :pagination="false" :total="100" class="table-main">
          <el-table-column prop="bedName" label="床位名" min-width="120" />
          <el-table-column prop="status" label="状态" min-width="60" />
          <el-table-column label="操作" min-width="150">
            <template #default="scope">
              <div class="operation-bths">
                <el-link type="primary" @click="">修改</el-link>
                <el-link type="warning" @click="">暂停</el-link>
              </div>
            </template>
          </el-table-column>
        </Table>
      </Card>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref, onMounted } from 'vue';

const inputStatus: any = ref(null);

const tableData: any = ref([]);
const roomList: any = ref([]);

onMounted(() => {
  tableData.value = new Array(10).fill({
    remark: '',
    bedName: '卡1',
    status: '空闲',
  });
  roomList.value = [
    {
      id: 0,
      remark: '',
      roomName: '二楼',
      bedTotal: 9,
      bedRemaining: 7,
    },
    {
      id: 1,
      remark: '',
      roomName: '大厅',
      bedTotal: 8,
      bedRemaining: 6,
    },
    {
      id: 0,
      remark: '',
      roomName: 'Test',
      bedTotal: 9,
      bedRemaining: 7,
    },
  ];
});

// #region 搜索模块
const searchWord = ref('');

const search = () => {
  console.log('搜索参数：', searchWord);
};

// #endregion
// #region 表格模块
const handlePageChange = (page: number) => {
  console.log('页码变化:', page);
};

const handleSizeChange = (size: number) => {
  console.log('每页条数变化:', size);
};
//#endregion
// #region 抽屉
const drawerTitle = ref('房间信息');
const drawerVisible = ref(false);

const handleDrawerClose = () => {
  console.log('抽屉关闭事件触发');
};
// #endregion
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

      .room-card {
        display: flex;
        flex-direction: column;
        gap: $main-padding;
        justify-content: space-between;
        > div {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
}
.drawer-content {
  display: flex;
  flex-direction: column;
  gap: $main-padding;

  .operation-bths {
    display: flex;
    gap: $main-padding;
  }
}

:deep(.el-input-group__append .el-button--primary) {
  @include primary-button;
}
</style>

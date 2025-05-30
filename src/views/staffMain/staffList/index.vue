<template>
  <div class="list-container">
    <Card class="operation-card">
      <div class="header-container">
        <el-button type="primary" @click="showDrawer(0)" class="add-button">添加人员</el-button>
      </div>
      <div class="search-container">
        <div class="search-item">
          <label for="staffStatus" class="search-label">人员在职状态&nbsp;</label>
          <el-select v-model="value" id="staffStatus" style="width: 120px" placeholder="Select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="search-item">
          <el-input v-model="input3" :prefix-icon="Search" placeholder="姓名|登录名" class="search-input">
            <template #append>
              <el-button class="el-button--primary search-btn">搜索</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </Card>
    <Card class="table-card">
      <Table
        :data="tableData"
        :border="true"
        :stripe="true"
        :pagination="false"
        :total="100"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
        class="table-main"
      >
        <el-table-column prop="userName" label="姓名" min-width="80" />
        <el-table-column prop="userSex" label="性别" min-width="60" />
        <el-table-column prop="userNumber" label="手机号" min-width="120" />
        <el-table-column prop="userCode" label="编号" min-width="60" />
        <el-table-column prop="userDept" label="部门" min-width="70" />
        <el-table-column prop="userPosition" label="职位" min-width="70" />
        <el-table-column prop="userBirthday" label="入职时间" min-width="110" />
        <el-table-column prop="userStatus" label="在职状态" min-width="90" />
        <el-table-column label="操作" min-width="120">
          <template #default="scope">
            <div class="operation-bths">
              <el-link type="primary" @click="handleEdit(scope.row, 1)">更多</el-link>
              <el-link type="success" @click="handleEdit(scope.row, 2)">编辑</el-link>
            </div>
          </template>
        </el-table-column>
      </Table>
    </Card>
  </div>
  <Drawer v-model="drawerVisible" :title="drawerTitle" @close="handleDrawerClose">
    <div style="padding: 20px">抽屉内容</div>
    <template #footer>
      <div style="text-align: right">
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="drawerVisible = false">确定</el-button>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref, onMounted } from 'vue';
import { reqStaffList } from '@/api/staffMain/index';

const value = ref('Option2');

// select选择器
const options = [
  {
    value: 'Option1',
    label: '全部状态',
  },
  {
    value: 'Option2',
    label: '在职',
  },
  {
    value: 'Option3',
    label: '已离职',
  },
  {
    value: 'Option4',
    label: '试用期',
  },
  {
    value: 'Option5',
    label: '停薪留职',
  },
];

const input3 = ref('');

const tableData: any = ref([]);

const init = async () => {
  const res = await reqStaffList();
  tableData.value = res.data;
};
onMounted(() => {
  // init();
  tableData.value = new Array(30).fill({
    id: 1,
    userCode: 'EMP002',
    userPassword: 'password123',
    userName: '张三',
    userNumber: '13800138000',
    userPosition: '店长',
    userSex: 1,
    userBirthday: '2025-03-11',
    userDept: '管理部',
    userEntryDate: null,
    userStatus: '在职',
    userIdCard: '110101199001011234',
    userAddress: '北京市朝阳区',
    userMarry: '已婚',
    userEdu: '本科',
    userHealth: null,
  });
});

// #region 表格事件
const handleEdit = (row: any, titleIndex: number) => {
  showDrawer(titleIndex);
  console.log('编辑行:', row);
};

const handleDelete = (row: any) => {
  console.log('删除行:', row);
};

const handlePageChange = (page: number) => {
  console.log('页码变化:', page);
};

const handleSizeChange = (size: number) => {
  console.log('每页条数变化:', size);
};
//#endregion

// #region 抽屉
const drawerTitles = ['新增人员信息', '人员信息', '修改人员信息'];
const drawerTitle = ref(drawerTitles[0]);
const drawerVisible = ref(false);
const showDrawer = (titleIndex: number) => {
  drawerTitle.value = drawerTitles[titleIndex];
  drawerVisible.value = !drawerVisible.value;
};
const handleDrawerClose = () => {
  console.log('抽屉关闭事件触发');
};
// #endregion
</script>

<style scoped lang="scss">
.table-main {
  height: 100%;
}

/* 操作按钮布局 */
.operation-bths {
  display: flex;
  gap: $main-padding;
}
</style>

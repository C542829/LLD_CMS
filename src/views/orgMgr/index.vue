<template>
  <div class="org-container">
    <ul>
      <li>
        <span>机构全称：</span>
        <span>
          {{ org.orgName }}
          <el-button type="primary" link size="small" @click="showDrawer">编辑</el-button>
        </span>
      </li>
      <li>
        <span>机构简称：</span>
        <span>{{ org.orgShortName }}</span>
      </li>
      <li>
        <span>机构编码：</span>
        <span>{{ org.orgCode }}</span>
      </li>
      <li>
        <span>机构性质：</span>
        <span>{{ org.orgProperty }}</span>
      </li>
      <li>
        <span>机构类型：</span>
        <span>{{ org.orgType }}</span>
      </li>
      <li>
        <span>行政区域：</span>
        <span>{{ org.orgAreaStr }}</span>
      </li>
      <li>
        <span>详细地址：</span>
        <span>{{ org.orgAddress }}</span>
      </li>
      <li>
        <span>联系电话：</span>
        <span>{{ org.orgNumber }}</span>
      </li>
      <li>
        <span>负责人：</span>
        <span>{{ org.orgLeader }}</span>
      </li>
      <li>
        <span>负责人电话：</span>
        <span>{{ org.orgLeaderNum }}</span>
      </li>
      <li>
        <span>备注信息：</span>
        <span>{{ org.remark }}</span>
      </li>
    </ul>
    <ul>
      <li>
        <span>机构状态：</span>
        <span>
          <el-tag :type="org.orgState === 0 ? 'success' : 'danger'" @click="handleOpenSettingDialog">
            {{ org.orgState === 0 ? '正常' : '停用' }}
          </el-tag>
        </span>
      </li>
      <li>
        <span>折扣率：</span>
        <span>{{ org.defaultDiscountRate }}%</span>
      </li>
      <li>
        <span>折扣基础：</span>
        <span>{{ discountTypeMap[org.defaultDiscountBase as DiscountType] }}</span>
      </li>
      <li>
        <span>跨店结算：</span>
        <span>{{ IsCrossStoreMap[org.defaultIsCrossStore as IsCrossStore] }}</span>
      </li>
      <!-- <li>
        <span>打印宽度：</span>
        <span>
          <DynamicInput :value="String(org.printWidth)" :width="200" @change="updatePrintWidth" />
        </span>
      </li> -->
      <template v-if="org.printWidth !== undefined">
        <li>
          <span>小票默认打印：</span>
          <span>
            <el-switch
              v-model="org.printWidth"
              active-text="开启"
              inactive-text="关闭"
              :active-value="58"
              :inactive-value="0"
              @change="updatePrintWidth"
            />
          </span>
        </li>
      </template>
      <li>
        <span>项目分类：</span>
        <span>
          <el-button type="primary" link @click="customCategory(DictCode.ITEM_CATEGORY)">管理项目分类</el-button>
        </span>
      </li>
      <li>
        <span>产品分类：</span>
        <span>
          <el-button type="primary" link @click="customCategory(DictCode.PRODUCT_CATEGORY)">管理产品分类</el-button>
        </span>
      </li>
      <li>
        <span>创建日期：</span>
        <span>{{ org.createTime }}</span>
      </li>
      <li>
        <span>修改日期：</span>
        <span>{{ org.updateTime }}</span>
      </li>
      <li>
        <span>谷歌浏览器：</span>
        <span>
          <a href="https://pan.huang1111.cn/s/P6KvXim" target="_blank">点击下载</a>
          <!-- <a href="https://caihao.lanzouu.com/imwZf3miidrc" target="_blank">点击下载</a>
          提取码：gk8j -->
        </span>
      </li>
      <li>
        <span>Lodop：</span>
        <span>
          <a href="https://www.lodop.net/download.html" target="_blank">点击下载</a>
        </span>
      </li>
      <li>
        <span>XP58驱动：</span>
        <span>
          <a href="./Pdriver.exe" target="_blank">点击下载</a>
        </span>
      </li>
    </ul>
  </div>
  <!-- 抽屉表单 -->
  <Drawer v-model="drawer.visible" :title="drawer.title" width="450">
    <!-- 表单 -->
    <OrgForm :form-data="currentFormData" @close-drawer="closeDrawer" @submit-success="onSubmitSuccess" />
  </Drawer>

  <!-- 自定义分类 -->
  <CustomCategoryTab v-model="dialog.visible" :dict-code="dialog.category" :title="dialog.title" />
  <!-- 机构状态设置 -->
  <SettingDialog v-model="settingDialog" />
</template>

<script setup lang="ts">
import CustomCategoryTab from './components/CustomCategoryTab.vue';
import SettingDialog from './components/SettingDialog.vue';
import OrgForm from '@/views/acl/orgMgr/form.vue';
import Message from '@/components/Message';
import { ref, reactive, onMounted } from 'vue';
import { getUserInfo } from '@/utils/localStorageTools';
import { reqOrgInfo, reqSetPrintWidth } from '@/api/acl/org/index';
import { parseResObj } from '@/utils/parseResponse';
import { IsCrossStoreMap, discountTypeMap, IsCrossStore, DiscountType, DictCode } from '@/enums/index';

import useUserStore from '@/store/modules/acl/user';

const userStore = useUserStore();

onMounted(() => {
  init();
});

const org = ref<any>({});

/** 当前表单数据（传递给子组件） */
const currentFormData = ref<any>({});

/** 获取门店详情 */
const fetchOrgInfo = async (id: number) => {
  try {
    const res = await reqOrgInfo(id);
    const info = parseResObj(res);
    info.orgArea && (info.orgArea = JSON.parse(info.orgArea as string));
    return info;
  } catch (error) {
    console.error('获取门店信息报错：', error);
    return {};
  }
};

const init = async () => {
  const userInfo = getUserInfo();
  org.value = await fetchOrgInfo(userInfo.orgId);
  org.value.orgAreaStr = org.value.orgArea?.join('/');
};

const dialog = reactive({
  visible: false,
  title: '',
  category: '',
});
const customCategory = (category: DictCode) => {
  dialog.title = category === DictCode.ITEM_CATEGORY ? `管理项目分类` : `管理产品分类`;
  dialog.category = category;
  dialog.visible = true;
};

// 更新打印宽度
const updatePrintWidth = async (printWidth: number) => {
  try {
    const params = { id: org.value.id, printWidth: Number(printWidth) };
    await reqSetPrintWidth(params);
    org.value.printWidth = printWidth;
    // 同步 pinia 中的数据
    userStore.org.printWidth = printWidth;
    // 修改消息提示
    const msg = printWidth ? '开启' : '关闭';
    Message.success(`${msg}默认打印成功`);
  } catch (error) {
    Message.error('设置默认打印失败');
    console.error(`更新打印宽度失败：${error}`);
  }
};

const drawer: any = reactive({
  title: '编辑门店信息',
  visible: false,
});

const showDrawer = () => {
  currentFormData.value = { ...org.value };
  drawer.visible = true;
};

const closeDrawer = () => {
  init();
  drawer.visible = false;
};

/** 表单提交成功回调 */
const onSubmitSuccess = () => {
  drawer.visible = false;
  init();
};

const settingDialog = ref(false);
const handleOpenSettingDialog = () => {
  settingDialog.value = true;
};
</script>

<style scoped lang="scss">
.org-container {
  display: flex;
  height: 100%;
  gap: 2px;
  background-color: var(--el-color-primary-light-5);

  > ul {
    background-color: $base-main-bg;
    flex: 1;
    padding: 15px 20px;
    li {
      line-height: 40px;
      display: flex;
      letter-spacing: 0.1rem;

      > span:first-child {
        display: inline-block;
        width: 130px;
        text-align: right;
        color: var(--el-text-color-placeholder);
      }
      > span:last-child {
        flex: 1;
        color: var(--el-text-color-regular);
      }
    }
  }
}
</style>

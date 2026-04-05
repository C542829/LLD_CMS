<template>
  <div class="drawer-form">
    <Form
      :model="store.formData"
      :rules="formRules"
      :showButtons="!disabled"
      :disabled="disabled"
      @submit="handleFormSubmit"
      @reset="handleFormReset"
    >
      <!-- 关联门店 -->
      <template v-if="userStore.isAdmin">
        <el-form-item label="关联门店" prop="orgIds">
          <OrgSelect v-model="store.formData.orgIds" />
        </el-form-item>
      </template>

      <!-- 项目编码 -->
      <el-form-item label="项目编码" prop="itemEncode">
        <el-input v-model="store.formData.itemEncode" clearable class="w-240" placeholder="请输入项目编码" />
      </el-form-item>

      <!-- 项目名称（必填） -->
      <el-form-item label="项目名称" prop="itemName">
        <el-input v-model="store.formData.itemName" clearable class="w-240" placeholder="请输入项目名称" />
      </el-form-item>

      <!-- 服务时长 -->
      <el-form-item label="服务时长" prop="serverTime">
        <el-input
          v-model.number="store.formData.serverTime"
          clearable
          :controls="false"
          placeholder="请输入服务时长"
          class="w-240"
        >
          <template #suffix>分钟</template>
        </el-input>
      </el-form-item>

      <!-- 项目分类 -->
      <el-form-item label="项目分类" prop="category">
        <el-select
          v-model="store.formData.category"
          placeholder="选择项目分类"
          style="width: 160px; margin-right: 15px"
        >
          <el-option
            v-for="item in serviceItemsCategoryList"
            :key="item.itemValue"
            :label="item.itemLabel"
            :value="item.itemValue"
          />
        </el-select>
        <el-button link type="primary" @click="serviceItemsCategoryMgr">分类管理</el-button>
      </el-form-item>

      <!-- 价格设置 -->

      <!-- 价格设置 -->
      <el-form-item label="价格设置">
        <Card>
          <el-form-item label="标准价：" prop="itemPrice" class="form-item-m-l-0">
            <el-input-number v-model="store.formData.itemPrice" :controls="false" class="w-130">
              <template #suffix>元</template>
            </el-input-number>
          </el-form-item>
          <el-form-item label="会员价：" prop="vipItemPrice" class="form-item-m-l-0">
            <el-input-number v-model="store.formData.vipItemPrice" :controls="false" class="w-130">
              <template #suffix>元</template>
            </el-input-number>
          </el-form-item>
        </Card>
      </el-form-item>

      <!-- 允许打折（开关） -->
      <el-form-item label="允许打折" prop="isDiscounts">
        <el-switch
          v-model="store.formData.isDiscounts"
          :active-value="IsDiscount.Yes"
          :inactive-value="IsDiscount.No"
        />
      </el-form-item>

      <!-- 提成类型（单选） -->
      <el-form-item label="提成类型" prop="commissionType">
        <el-radio-group v-model.number="store.formData.commissionType">
          <el-radio v-for="item in commissionTypeOptions" :value="item.value" :border="true">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 提成值（根据提成类型动态显示单位：元/百分比） -->
      <template v-if="store.formData.commissionType === CommissionType.FixedAmount">
        <el-form-item label="提成值(轮牌)" prop="commissionValueRotation">
          <el-input-number v-model.number="store.formData.commissionValueRotation" :controls="false" class="w-120">
            <template #suffix>元</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="提成值(点钟)" prop="commissionValueAppointment">
          <el-input-number v-model.number="store.formData.commissionValueAppointment" :controls="false" class="w-120">
            <template #suffix>元</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="提成值(加钟)" prop="commissionValueExtend">
          <el-input-number v-model.number="store.formData.commissionValueExtend" :controls="false" class="w-120">
            <template #suffix>元</template>
          </el-input-number>
        </el-form-item>
      </template>
      <!-- 比例提成 -->
      <template v-else>
        <el-form-item label="提成值(轮牌)" prop="commissionValueRotation">
          <el-input-number
            v-model.number="store.formData.commissionValueRotation"
            :min="0"
            :max="100"
            :controls="false"
            class="w-120"
          >
            <template #suffix>%</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="提成值(点钟)" prop="commissionValueAppointment">
          <el-input-number
            v-model.number="store.formData.commissionValueAppointment"
            :min="0"
            :max="100"
            :controls="false"
            class="w-120"
          >
            <template #suffix>%</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="提成值(加钟)" prop="commissionValueExtend">
          <el-input-number
            v-model.number="store.formData.commissionValueExtend"
            :min="0"
            :max="100"
            :controls="false"
            class="w-120"
          >
            <template #suffix>%</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="提成价格" prop="commissionBase">
          <el-select v-model="store.formData.commissionBase" placeholder="请选择提成基数" class="w-120" clearable>
            <el-option v-for="item in commissionOptions" :label="item.label" :value="item.value" :key="item.value" />
          </el-select>
        </el-form-item>
      </template>

      <!-- 其他描述 -->
      <el-form-item label="其他描述" prop="remark">
        <el-input v-model="store.formData.remark" class="w-240" type="textarea" placeholder="请输入其他描述" />
      </el-form-item>
    </Form>
    <EnumHandler
      v-model="enumHandler.visible"
      :title="enumHandler.title"
      :dictCode="enumHandler.dictCode"
      @refresh="initEnum"
    />
  </div>
</template>

<script setup lang="ts">
import EnumHandler from '@/components/EnumHandler/index.vue';
import { ref, onMounted, reactive } from 'vue';
import { CommissionType, IsDiscount, commissionTypeOptions, commissionOptions, DictCode } from '@/enums';
// 引入数据仓库
import { useServiceItemStore } from '@/store/modules/setGroup/serviceItem';
import { useEnumStore } from '@/store/modules/enums/index';
import useUserStore from '@/store/modules/acl/user';

const store = useServiceItemStore();
const enumStore = useEnumStore();
const userStore = useUserStore();

// 定义组件触发的事件 - 关闭抽屉
const emit = defineEmits(['close-drawer']);

// 定义组件接收的props - 是否禁用表单
defineProps(['disabled']);

// 组件挂载后执行的生命周期钩子
onMounted(async () => {
  // 可在此处添加组件初始化逻辑
  await getServiceItems();
  initEnum();
});

const serviceItems = ref<any>([]);
const getServiceItems = async () => {
  const params: any = { itemStatus: '' };
  serviceItems.value = await store.getServiceItems(params);
};

/**
 * 表单提交处理函数
 * @param model 表单数据对象
 */
const handleFormSubmit = async (model: any) => {
  // 调用数据仓库的更新方法
  const result = await store.updateData(model);
  // 更新成功则触发关闭抽屉事件
  result && emit('close-drawer');
};

/**
 * 表单重置处理函数
 * 调用数据仓库的重置表单数据方法
 */
const handleFormReset = () => {
  store.resetFormData();
};

//#region 字典管理

const serviceItemsCategoryList = ref<any>([]);

const initEnum = async () => {
  serviceItemsCategoryList.value = await enumStore.getServiceItemCategoryList();
};

const enumHandler = reactive({
  title: '项目分类管理',
  visible: false,
  dictCode: DictCode.ITEM_CATEGORY,
  defaultData: <any>[],
});

const serviceItemsCategoryMgr = () => {
  enumHandler.visible = true;
  enumHandler.title = '项目分类管理';
  enumHandler.dictCode = DictCode.ITEM_CATEGORY;
  enumHandler.visible = true;
};

//#endregion 字典管理

// 表单验证规则
const formRules = {
  orgIds: [{ required: true, message: '请选择关联门店', trigger: 'blur' }],
  itemEncode: [
    { required: true, message: '请输入服务项目编码', trigger: 'blur' },
    // {
    //   validator: (rule: any, value: any, callback: any) => {
    //     const item = serviceItems.value.filter((item: any) => item.itemEncode === value);
    //     if (item.length === 0) {
    //       callback();
    //       return;
    //     }
    //     if (item.length === 1 && store.formData.id === item[0].id) {
    //       callback();
    //       return;
    //     }
    //     callback(new Error('编码已存在'));
    //   },
    //   trigger: 'blur',
    // },
  ],
  itemName: [{ required: true, message: '请输入服务项目名称', trigger: 'blur' }],
  serverTime: [
    { required: true, message: '请输入服务时间', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
  ],
  category: [{ required: true, message: '请选择服务项目分类', trigger: 'blur' }],
  itemPrice: [{ required: true, message: '请输入服务项目价格', trigger: 'blur' }],
  vipItemPrice: [{ required: true, message: '请输入会员价格', trigger: 'blur' }],
  isDiscounts: [{ required: true, message: '请输入是否提成', trigger: 'blur' }],
  commissionType: [{ required: true, message: '请选择提成类型', trigger: 'blur' }],
  commissionValueRotation: [
    { required: true, message: '请输入提成值(轮牌)', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
  ],
  commissionValueAppointment: [
    { required: true, message: '请输入提成值(点钟)', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
  ],
  commissionValueExtend: [
    { required: true, message: '请输入提成值(加钟)', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
  ],
  commissionBase: [{ required: true, message: '请选择提成价格', trigger: 'blur' }],
};
</script>

<style lang="scss" scoped>
.drawer-form {
}
.form-item-m-l-0 {
  :deep(.el-form-item__label-wrap) {
    margin-left: 0 !important;
  }
}
</style>

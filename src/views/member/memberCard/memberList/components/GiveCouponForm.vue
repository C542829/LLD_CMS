<template>
  <div>
    <!-- 表单 -->
    <Form :model="formData" :rules="formRules" :loading="loading" @submit="handleFormSubmit" @reset="handleFormReset">
      <el-form-item label="添加优惠券" prop="vipTicketId">
        <el-select v-model="formData.vipTicketId" placeholder="请选择优惠券" class="w-240">
          <el-option v-for="item in enumStore.ticketList" :key="item.id" :label="item.ticketName" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="数量" prop="number">
        <el-input-number v-model="formData.number" :min="1" :max="100" controls-position="right" class="w-120" />
      </el-form-item>

      <el-form-item label="备注：" prop="remark">
        <el-input
          type="textarea"
          v-model="formData.remark"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :maxlength="500"
          show-word-limit
          class="w-240"
        />
      </el-form-item>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { reqPresentTicket } from '@/api/member/member';
import { cloneDeep } from 'lodash';
import { parseResMsg } from '@/utils/parseResponse';

// 导入数据仓库
import { useMemberStore } from '@/store/modules/member/member';
import { useDataEnumStore } from '@/store/modules/enums/index';
const store = useMemberStore();
const enumStore = useDataEnumStore();

const $emit = defineEmits(['close-drawer']);

onMounted(() => {
  // 获取枚举数据
  enumStore.getTicketList(true);
});

watch(
  () => store.formData.id,
  (val) => {
    if (val) {
      handleFormReset();
    }
  },
);

const DEFAULT_FORMDATA = {
  vipTicketId: '',
  number: 1,
  remark: '手动赠送',
};

const loading = ref(false);
const formData = ref(cloneDeep(DEFAULT_FORMDATA));

// 表单提交
const handleFormSubmit = async () => {
  try {
    loading.value = true;
    const id = store.formData.id;
    const res = await reqPresentTicket(id, formData.value);
    parseResMsg(res, '赠送优惠券成功');
    $emit('close-drawer');
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 表单重置
const handleFormReset = () => {
  formData.value = cloneDeep(DEFAULT_FORMDATA);
};

// 表单验证规则
const formRules = {
  vipTicketId: [{ required: true, message: '请选择优惠券', trigger: 'blur' }],
  number: [{ required: true, message: '请输入数量', trigger: 'blur' }],
};
</script>

<style lang="scss" scoped>
.popover {
  width: 90%;
  height: 80px;
  margin: 0 auto;
  margin-bottom: 10px;
  margin-top: 10px;

  .popover-item {
    display: flex;
    line-height: 25px;

    > span:first-child {
      width: 70px;
      text-align: right;
    }

    > span:last-child {
      flex: 1;
    }
  }
}
</style>

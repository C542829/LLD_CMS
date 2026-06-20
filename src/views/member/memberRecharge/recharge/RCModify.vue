<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    destroy-on-close
    center
    width="420px"
    @open="initInfo"
    @closed="close"
  >
    <div class="content">
      <el-alert type="success" style="margin: 15px 0">如果存在充值活动，优先使用活动的折扣设置</el-alert>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="auto" label-position="right">
        <el-form-item label=" 折 扣 率：" prop="defaultDiscountRate">
          <el-input-number v-model="formData.defaultDiscountRate" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="折扣基础：" prop="defaultDiscountBase">
          <el-select v-model="formData.defaultDiscountBase" placeholder="请选择">
            <el-option v-for="item in discountTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="跨店结算：" prop="defaultIsCrossStore">
          <el-select v-model="formData.defaultIsCrossStore" placeholder="请选择">
            <el-option v-for="item in isCrossStoreOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="submit-area">
        <el-button type="default" @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submit">设置</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { reqSetOrgDefaultCommissionRule } from '@/api/acl/org/index';
import type { OrgDefaultRuleUpdateDTO } from '@/api/acl/org/types';
import { DiscountType, IsCrossStore, discountTypeOptions, isCrossStoreOptions } from '@/enums/index';
import { cloneDeep } from 'lodash';
import { parseResMsg } from '@/utils/parseResponse';
import { getOrgInfo } from '@/utils/localStorageTools';

// #region  参数定义

interface Props {
  // 弹窗显隐
  visible: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
});

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'refresh'): void;
}>();

watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val || false;
  },
);

// 控制弹窗显隐
const dialogVisible = ref<boolean>(false);
const dialogTitle = ref('门店默认充值价格和折扣率设置');
// 关闭弹窗
const close = () => {
  emit('update:visible', false);
};

// #endregion  参数定义

const initInfo = async () => {
  let org = getOrgInfo();

  formData.value.defaultDiscountBase = org.defaultDiscountBase || DiscountType.Member;
  formData.value.defaultDiscountRate = org.defaultDiscountRate || 100;
  formData.value.defaultIsCrossStore = org.defaultIsCrossStore || IsCrossStore.YES;
};

const DEFAULT_RC_FORM = {
  defaultDiscountBase: DiscountType.Member,
  defaultDiscountRate: 100,
  defaultIsCrossStore: IsCrossStore.YES,
};

// 提交按钮loading
const btnLoading = ref<boolean>(false);
// 当前充值记录
const formData = ref<OrgDefaultRuleUpdateDTO>(cloneDeep(DEFAULT_RC_FORM));
const formRules = ref({});

const submit = async () => {
  try {
    btnLoading.value = true;
    const res = await reqSetOrgDefaultCommissionRule(formData.value);
    parseResMsg(res);
  } catch (error) {
    console.error(error);
  } finally {
    btnLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
.content {
  width: 85%;
  margin: 0 auto;
}
</style>

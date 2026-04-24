<template>
  <el-dialog v-model="dialogVisible" :title="dialogTitle" destroy-on-close center width="420px" @closed="close">
    <div class="content">
      <!-- <el-alert type="success" style="margin: 15px 0">如果存在充值活动，优先使用活动的折扣设置</el-alert> -->
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="auto" label-position="right">
        <el-form-item label=" 折 扣 率：" prop="assetDiscountRate">
          <el-input-number v-model="formData.assetDiscountRate" :min="0" :max="100" :step="10" class="w-200" />
        </el-form-item>
        <el-form-item label="折扣基础：" prop="assetDiscountBase">
          <el-select v-model="formData.assetDiscountBase" placeholder="请选择" class="w-200">
            <el-option v-for="item in discountTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="跨店结算：" prop="assetIsCrossStore">
          <el-select v-model="formData.assetIsCrossStore" placeholder="请选择" class="w-200">
            <el-option v-for="item in isCrossStoreOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="submit-area">
        <el-button type="default" @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submit">修改</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { reqUpdateVipAsset } from '@/api/member/member/index';
import type { VipAssetDiscountDTO } from '@/api/member/member/type';
import { DiscountType, IsCrossStore, discountTypeOptions, isCrossStoreOptions } from '@/enums/index';
import { cloneDeep } from 'lodash';
import { parseResMsg } from '@/utils/parseResponse';

// #region  参数定义

// interface Props {
//   // 弹窗显隐
//   visible?: boolean;
// }

// const props = withDefaults(defineProps<Props>(), {
//   visible: false,
// });

// watch(
//   () => props.visible,
//   (val) => {
//     dialogVisible.value = val || false;
//   },
// );

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'refresh'): void;
}>();

// 控制弹窗显隐
const dialogVisible = ref<boolean>(false);
const dialogTitle = ref('修改会员资产属性');

// 关闭弹窗
const close = () => {
  // emit('update:visible', false);
};

// #endregion  参数定义

const DEFAULT_FORM_DATA = {
  assetId: 0,
  assetDiscountBase: DiscountType.Member,
  assetDiscountRate: 100,
  assetIsCrossStore: IsCrossStore.YES,
};

const initInfo = (row: any) => {
  row = cloneDeep(row);
  row.assetId = row.id;
  formData.value = row;
  dialogVisible.value = true;
};

// 提交按钮loading
const btnLoading = ref<boolean>(false);
// 当前充值记录
const formData = ref<VipAssetDiscountDTO>(cloneDeep(DEFAULT_FORM_DATA));
const formRules = ref({});

const submit = async () => {
  try {
    btnLoading.value = true;
    const res = await reqUpdateVipAsset(formData.value);
    parseResMsg(res);
    emit('refresh');
    dialogVisible.value = false;
  } catch (error) {
    console.error('修改会员资产属性失败：', error);
  } finally {
    btnLoading.value = false;
  }
};

defineExpose({
  initInfo,
});
</script>

<style scoped lang="scss">
.content {
  width: 85%;
  margin: 0 auto;
  padding-top: 20px;
}
</style>

<template>
  <div>
    <!-- 表单 -->
    <Form :model="formData" :rules="formRules" @submit="handleFormSubmit" @reset="handleFormReset">
      <el-form-item label="添加优惠券" prop="ticketId">
        <el-autocomplete
          v-model="state"
          :fetch-suggestions="querySearch"
          @select="handleSelect"
          placeholder="选择优惠券"
          clearable
        >
          <template #default="{ item }">
            <el-card class="popover">
              <div class="popover-item">
                <span>名称：</span>
                <span>{{ item.couponName }}</span>
              </div>
              <div class="popover-item">
                <span>有效期：</span>
                <span>{{ item.timeLimit }}天</span>
              </div>
              <div class="popover-item">
                <span>使用条件：</span>
                <span>{{ item.ruleDis }}</span>
              </div>
            </el-card>
          </template>
        </el-autocomplete>
      </el-form-item>

      <el-form-item label="数量" prop="ticketQuantity">
        <el-input-number v-model="formData.ticketQuantity" :min="1" :max="100" size="small" controls-position="right" />
      </el-form-item>
      <!-- <el-form-item label="已选优惠券" prop="ticketQuantity">
        <el-card class="popover">
          <div class="popover-item">
            <span>名称：</span>
            <span>{{ selectedTicket.couponName }}</span>
          </div>
          <div class="popover-item">
            <span>有效期：</span>
            <span>{{ selectedTicket.timeLimit }}天</span>
          </div>
          <div class="popover-item">
            <span>使用条件：</span>
            <span>{{ selectedTicket.ruleDis }}</span>
          </div>
          <div class="popover-item">
            <span>数量：</span>
            <el-input-number
              v-model="formData.ticketQuantity"
              :min="1"
              :max="100"
              size="small"
              controls-position="right"
            />
          </div>
        </el-card>
      </el-form-item> -->

      <el-form-item label="备注信息" prop="confirmPwd">
        <el-input v-model="formData.remark" placeholder="备注信息" />
      </el-form-item>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

// 导入数据仓库
import { useMemberStore } from '@/store/modules/member/member';
const store = useMemberStore();

const $emit = defineEmits(['close-drawer']);

const tickets: any = ref([]);
tickets.value = [
  {
    id: 7179,
    orgId: 1459,
    isEntityTicket: 1,
    couponType: 151,
    couponName: '88元代金券',
    content: '88元代金券',
    quantityLimit: 1,
    useLimitRule: '{"value":88,"limitBuy":0}',
    shouldPay: 0.0,
    timeLimit: 999,
    isValid: 1,
    creator: 19149,
    createTime: '2024-07-05 23:55:58',
    updateUser: 19149,
    updateTime: '2024-07-05 23:55:58',
    remark: '',
    ruleDis: '优惠88.0元',
  },
  {
    id: 7185,
    orgId: 1459,
    isEntityTicket: 1,
    couponType: 151,
    couponName: '128元代金券',
    content: '128元水洗头疗',
    quantityLimit: 1,
    useLimitRule: '{"value":128,"limitBuy":0}',
    shouldPay: 0.0,
    timeLimit: 999,
    isValid: 1,
    creator: 19149,
    createTime: '2024-07-06 00:00:09',
    updateUser: 19149,
    updateTime: '2024-07-06 00:00:09',
    remark: '',
    ruleDis: '优惠128.0元',
  },
  {
    id: 7187,
    orgId: 1459,
    isEntityTicket: 1,
    couponType: 151,
    couponName: '138元代金券',
    content: '精油开背代金券',
    quantityLimit: 1,
    useLimitRule: '{"value":138,"limitBuy":0}',
    shouldPay: 0.0,
    timeLimit: 999,
    isValid: 1,
    creator: 19149,
    createTime: '2024-07-06 00:01:41',
    updateUser: 19149,
    updateTime: '2024-07-06 00:01:41',
    remark: '',
    ruleDis: '优惠138.0元',
  },
  {
    id: 7219,
    orgId: 1459,
    isEntityTicket: 1,
    couponType: 151,
    couponName: '699水洗头疗10次',
    content: '699水洗头疗10次',
    quantityLimit: 1,
    useLimitRule: '{"value":128,"limitBuy":0}',
    shouldPay: 0.0,
    timeLimit: 999,
    isValid: 1,
    creator: 19149,
    createTime: '2024-07-12 16:20:06',
    updateUser: 19149,
    updateTime: '2024-07-12 16:20:05',
    remark: '',
    ruleDis: '优惠128.0元',
  },
  {
    id: 8467,
    orgId: 1459,
    isEntityTicket: 1,
    couponType: 151,
    couponName: 'A 78代金券',
    content: 'A 78代金券',
    quantityLimit: 1,
    useLimitRule: '{"value":78,"limitBuy":78}',
    shouldPay: 0.0,
    timeLimit: 999,
    isValid: 1,
    creator: 19149,
    createTime: '2025-05-04 17:37:57',
    updateUser: 19149,
    updateTime: '2025-05-04 17:37:56',
    remark: '',
    ruleDis: '满78.0元，优惠78.0元',
  },
];

const state = ref('');
const selectedTicket: any = ref({});
const ticketList: any = ref(tickets.value.map((item: any) => ({ ...item, value: item.couponName, link: item.id })));

const querySearch = (queryString: string, cb: Function) => {
  const results = queryString ? ticketList.value.filter(createFilter(queryString)) : ticketList.value;
  // 返回过滤过的数据
  cb(results);
};

// filter的回调函数
const createFilter = (queryString: string) => {
  return (item: any) => {
    return item.value.toLowerCase().includes(queryString.toLowerCase());
  };
};

const handleSelect = (item: Record<string, any>) => {
  selectedTicket.value = item;
  formData.ticketId = item.id;
  console.log(item);
  console.log(store.formData, formData);
};

const formData = reactive({
  ticketId: null,
  ticketQuantity: 1,
  remark: '',
});

// 表单提交
const handleFormSubmit = async () => {
  const result = null;
  result && $emit('close-drawer');
};

// 表单重置
const handleFormReset = () => {
  state.value = '';
  formData.ticketId = null;
  formData.ticketQuantity = 1;
  formData.remark = '';
};

// 表单验证规则
const formRules = {
  ticketId: [{ required: true, message: '请选择优惠券', trigger: 'blur' }],
  ticketQuantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
};
</script>

<style lang="scss" scoped>
.popover {
  width: 90%;
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

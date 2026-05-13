<template>
  <Drawer v-model="drawerVisible" :title="drawerTitle" @closed="handleDrawerClose">
    <Form
      :model="formdata"
      :rules="formRules"
      :showButtons="!formDisabled"
      :disabled="formDisabled"
      :loading="submitLoading"
      @submit="handleFormSubmit"
      @reset="handleFormReset"
    >
      <!-- 房间模式 -->
      <template v-if="props.mode === 'room'">
        <!-- 房间名称 -->
        <el-form-item label="房间名称" prop="roomName">
          <el-input v-model="formdata.roomName" clearable class="w-240" placeholder="请输入房间名称" />
        </el-form-item>
      </template>

      <!-- 床位模式 -->
      <template v-if="props.mode === 'bed'">
        <!-- 床位名称 -->
        <el-form-item label="床位名称" prop="bedName">
          <el-input v-model="formdata.bedName" clearable class="w-240" placeholder="请输入床位名称" />
        </el-form-item>
      </template>

      <!-- 备注 -->
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formdata.remark"
          :autosize="{ minRows: 2, maxRows: 4 }"
          class="w-240"
          type="textarea"
          placeholder="请输入备注"
        />
      </el-form-item>
    </Form>

    <!-- 抽屉操作按钮 -->
    <div v-show="formDisabled" class="drawer-buttons">
      <el-button @click="drawerVisible = false">取消</el-button>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { cloneDeep } from 'lodash';
import { reqAddRoom, reqUpdateRoom, reqAddBed, type Types } from '@/api/setGroup/room';
import Message from '@/components/Message';

interface RoomFormData {
  id?: number;
  roomName: string;
  remark?: string;
}

interface BedFormData {
  bedName: string;
  roomId: number;
  remark?: string;
}

type FormData = RoomFormData & BedFormData;

const DEFAULT_ROOM_FORMDATA: RoomFormData = {
  roomName: '',
  remark: '',
};

const DEFAULT_BED_FORMDATA: BedFormData = {
  bedName: '',
  roomId: 0,
  remark: '',
};

interface Props {
  type: DialogType;
  modelValue: boolean;
  data?: Types.RoomInfoVO;
  mode: 'room' | 'bed';
  roomId?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  modelValue: false,
  mode: 'room',
});

const emit = defineEmits(['update:model-value', 'close', 'success']);

watch(
  () => props.modelValue,
  (newVal) => {
    drawerVisible.value = newVal;
  },
);

const drawerVisible = ref(false);
const submitLoading = ref(false);
const formdata = ref<FormData>(cloneDeep(DEFAULT_ROOM_FORMDATA) as FormData);

const drawerTitle = computed(() => {
  const isRoom = props.mode === 'room';
  switch (props.type) {
    case 'add':
      formdata.value = isRoom
        ? (cloneDeep(DEFAULT_ROOM_FORMDATA) as FormData)
        : ({ ...cloneDeep(DEFAULT_BED_FORMDATA), roomId: props.roomId } as FormData);
      return isRoom ? '添加房间' : '添加床位';
    case 'edit':
      if (isRoom && props.data) {
        formdata.value = cloneDeep(props.data) as FormData;
      }
      return isRoom ? '修改房间' : '修改床位';
    default:
      if (isRoom && props.data) {
        formdata.value = cloneDeep(props.data) as FormData;
      }
      return isRoom ? '房间信息' : '床位信息';
  }
});

const formDisabled = computed(() => props.type === 'view');

const handleDrawerClose = () => {
  emit('update:model-value', false);
  emit('close');
};

const handleFormSubmit = async () => {
  try {
    submitLoading.value = true;
    let res: any;

    if (props.mode === 'room') {
      const roomData = formdata.value as RoomFormData;
      if (roomData.id) {
        res = await reqUpdateRoom({ id: roomData.id, roomName: roomData.roomName, remark: roomData.remark });
      } else {
        res = await reqAddRoom({ roomName: roomData.roomName, remark: roomData.remark });
      }
    } else {
      const bedData = formdata.value as BedFormData;
      res = await reqAddBed({ bedName: bedData.bedName, roomId: bedData.roomId, remark: bedData.remark });
    }

    if (res.code === 10000) {
      Message.success(props.type === 'add' ? '添加成功' : '更新成功');
      drawerVisible.value = false;
      emit('success');
    }
  } catch (error) {
    console.error(error);
  } finally {
    submitLoading.value = false;
  }
};

const handleFormReset = () => {
  if (props.mode === 'room') {
    formdata.value = cloneDeep(DEFAULT_ROOM_FORMDATA) as FormData;
  } else {
    formdata.value = { ...cloneDeep(DEFAULT_BED_FORMDATA), roomId: props.roomId } as FormData;
  }
};

const formRules = computed(() => {
  if (props.mode === 'room') {
    return {
      roomName: [{ required: true, message: '请输入房间名称', trigger: 'blur' }],
    };
  }
  return {
    bedName: [{ required: true, message: '请输入床位名称', trigger: 'blur' }],
  };
});
</script>

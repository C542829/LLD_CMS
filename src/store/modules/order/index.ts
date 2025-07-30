import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { reqVipList } from '@/api/member/memberList';
import { parseResList, parseResObj, parseResMsg } from '@/utils/parseResponse';

export const useOrderStore = defineStore('Order', () => {
  return {};
});

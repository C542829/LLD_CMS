import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { reqVipList } from '@/api/member/member';
import { parseResList, parseResObj, parseResMsg } from '@/utils/parseResponse';

export const useOrderStore = defineStore('Order', () => {
  return {};
});

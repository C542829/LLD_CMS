import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { reqDictItemList, reqDictItemListByCodes, type Types } from '@/api/acl/dict/index';
import { parseResList, parseResObj } from '@/utils/parseResponse';
import { DictCode } from '@/enums/index';

/** 全量预加载的字典编码列表 */
const COMMON_DICTS: string[] = Object.values(DictCode);

export const useDictStore = defineStore('Dict', () => {
  /** 字典缓存 Map<dictCode, DictItemVO[]> */
  const cache = ref<Map<string, Types.DictItemVO[]>>(new Map());

  /**
   * 获取字典项列表（有缓存则直接返回）
   * @param dictCode 字典编码
   * @param refresh 是否强制刷新
   */
  const getDictItems = async (dictCode: string, refresh = false): Promise<Types.DictItemVO[]> => {
    if (!refresh && cache.value.has(dictCode)) {
      return cache.value.get(dictCode)!;
    }
    const res = await reqDictItemList(dictCode);
    const list = parseResList<Types.DictItemVO>(res);
    cache.value.set(dictCode, list);
    return list;
  };

  /**
   * 获取响应式字典项（基于缓存的 computed）
   */
  const dictItems = (dictCode: string) => computed(() => cache.value.get(dictCode) ?? []);

  /**
   * 清除缓存
   * @param dictCode 指定字典编码，不传则清除全部
   */
  const invalidate = (dictCode?: string) => {
    if (dictCode) {
      cache.value.delete(dictCode);
    } else {
      cache.value.clear();
    }
  };

  /** 批量预加载常用字典（单次请求） */
  const preloadCommonDicts = async () => {
    const res = await reqDictItemListByCodes(COMMON_DICTS);
    const map = res.data;
    if (map) {
      for (const [code, items] of Object.entries(map)) {
        cache.value.set(code, items);
      }
    }
  };

  return { getDictItems, dictItems, invalidate, preloadCommonDicts };
});

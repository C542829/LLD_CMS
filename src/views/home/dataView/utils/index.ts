import { reqRevenueSummary, reqMemberStats, reqTechnicianRanking, type Types } from '@/api/home/index';

/**
 * 默认搜索参数
 */
export const DEFAULT_SEARCH_PARAMS: Types.DataViewQuery = {
  startDate: '',
  endDate: '',
  orgIds: [],
};

/**
 * 颜色数组
 */
export const colors: string[] = [
  '#5b8ff9', // 蓝色
  '#5ad8a6', // 绿色
  '#5d7092', // 深蓝灰色
  '#f6bd16', // 黄色
  '#e8684a', // 橙色
  '#6dc8ec', // 浅蓝
  '#9270CA', // 紫色
  '#FF9D42', // 橙黄
  '#71EFA3', // 亮绿
  '#16C2A3', // 青蓝
  // '#409EFF',
  // '#67C23A',
  // '#FFB84C',
  // '#FA7070',
  // '#909399',
  // '#727CF5',
  // '#F7833B',
  // '#16C8D2',
  // '#9761EB',
  // '#F090B1',
  // '#65B97A',
  // '#B3B9BF',
];

/**
 * 获取数据视图的营收摘要
 */
export const getRevenueSummary = async (params: Types.DataViewQuery) => {
  try {
    const { data } = await reqRevenueSummary(params);
    const result = [
      { name: '会员卡', value: data.memberCardPayment || 0 },
      { name: '扫码', value: data.qrPayment || 0 },
      { name: '现金', value: data.cashPayment || 0 },
      { name: '抖音', value: data.douyinPayment || 0 },
      { name: '美团', value: data.meituanPayment || 0 },
      { name: '代金券', value: data.ticketConsumerPayment || 0 },
      { name: '项目券', value: data.ticketItemPayment || 0 },
      { name: 'POS', value: data.posPayment || 0 },
    ];
    return result;
  } catch (error) {
    console.log(error);
  }
  return [];
};

/**
 * 获取数据视图的技师排名
 */
export const getTechnicianRanking = async (params: Types.DataViewQuery) => {
  try {
    const { data } = await reqTechnicianRanking(params);
    let result = data?.ranking || [];
    // 取前10名
    result = result.slice(0, 10);
    return result.map((item) => ({
      name: item.userName,
      value: item.performance || 0,
    }));
  } catch (error) {
    console.log(error);
  }
};

/**
 * 获取数据视图的会员统计
 */
export const getMemberStats = async (params: Types.DataViewQuery) => {
  try {
    const { data } = await reqMemberStats(params);
    const result = [
      { name: '新会员数', value: data.newMembers || 0, itemStyle: { color: '#C9C9C9' } },
      { name: '会员总数', value: data.totalMembers || 0, itemStyle: { color: '#C0C0C0' } },
    ];
    return result;
  } catch (error) {
    console.log(error);
  }
  return [];
};

/**
 * 获取数据视图的会员统计
 */
export const getServiceStats = (data: Types.ServiceStatsVO) => {
  try {
    const result = [
      { name: '点钟', value: data.totalDesignated || 0 },
      { name: '加钟', value: data.totalAdd || 0 },
      { name: '轮牌', value: data.totalRotation || 0 },
    ];
    return result;
  } catch (error) {
    console.log(error);
  }
  return [];
};

import type { ConsumeBillQuery, ConsumeBillListResponse, ConsumeBill } from './types';
import { data } from './data';

const MOCK_DELAY = 300;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const reqConsumeBillList = async (params: ConsumeBillQuery): Promise<ApiResponse<ConsumeBillListResponse>> => {
  await sleep(MOCK_DELAY);

  let filteredData = [...data];

  if (params.billno) {
    filteredData = filteredData.filter((item) => item.billno.toLowerCase().includes(params.billno!.toLowerCase()));
  }

  if (params.name) {
    filteredData = filteredData.filter((item) => item.name.toLowerCase().includes(params.name!.toLowerCase()));
  }

  if (params.billtype !== undefined && params.billtype !== null) {
    filteredData = filteredData.filter((item) => item.billtype === params.billtype);
  }

  if (params.billstatus !== undefined && params.billstatus !== null) {
    filteredData = filteredData.filter((item) => item.billstatus === params.billstatus);
  }

  if (params.startTime) {
    const startTimestamp = new Date(params.startTime).getTime();
    filteredData = filteredData.filter((item) => item.createDate >= startTimestamp);
  }

  if (params.endTime) {
    const endTimestamp = new Date(params.endTime).getTime() + 24 * 60 * 60 * 1000 - 1;
    filteredData = filteredData.filter((item) => item.createDate <= endTimestamp);
  }

  const total = filteredData.length;
  const start = (params.pageNum - 1) * params.pageSize;
  const end = start + params.pageSize;
  const rows = filteredData.slice(start, end);

  return {
    code: 200,
    message: 'success',
    data: {
      total,
      rows,
    },
  };
};

export const reqConsumeBillDetail = async (id: number): Promise<ApiResponse<ConsumeBill>> => {
  await sleep(MOCK_DELAY);

  const bill = data.find((item) => item.id === id);

  if (!bill) {
    return {
      code: 404,
      message: '账单不存在',
      data: null as any,
    };
  }

  return {
    code: 200,
    message: 'success',
    data: bill,
  };
};

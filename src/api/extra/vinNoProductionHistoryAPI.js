import { axios } from "@/main";

const url = {
  getProductionItemsURL: 'extra/vin-no-production-history/items',
};

const getProductionItemsAPI = (params) => {
  const { vinNo, date } = params;
  return axios.get(url.getProductionItemsURL+`?vinNo=${vinNo}&date=${date}`);
}

export { getProductionItemsAPI };

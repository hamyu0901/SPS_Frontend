import { axios } from "@/main";
const url = {
  getAtomizerAlarmListURL: 'diagnostics/predict/atomizer/alarm/list',
  getAtomizerChartItemsURL: 'diagnostics/predict/atomizer/chart',
}

const getAtomizerAlarmListAPI = (params) => {
  const { robotId, prevDate, currDate } = params;
  return axios.get(url.getAtomizerAlarmListURL + `?robotId=${robotId}&prevDate='${prevDate}'&currDate='${currDate}'`);
}

const getAtomizerChartItemsAPI = (params) => {
  const { robotId, type, typeNo, prevDate, currDate } = params;
  return axios.get(url.getAtomizerChartItemsURL + `?robotId=${robotId}&type=${type}&typeNo=${typeNo}&prevDate='${prevDate}'&currDate='${currDate}'`);
}

export { getAtomizerAlarmListAPI, getAtomizerChartItemsAPI };


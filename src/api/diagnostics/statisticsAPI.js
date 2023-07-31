import { axios } from "@/main";
const url = {
  getAlarmTypeURL: 'diagnostics/statistics/alarm-type',
  getStatisticsChartURL: 'diagnostics/statistics/chart',
  getStatisticsSumZoneAlarmURL: 'diagnostics/statistics/sum/zone/alarm',
  getStatisticsSumRobotAlarmURL: 'diagnostics/statistics/sum/robot/alarm',
  getStatisticsEntireAlarmURL: 'diagnostics/statistics/entire/alarm',
}

const getAlarmTypeAPI = () => {
    return axios.get(url.getAlarmTypeURL);
}
const getStatisticsChartAPI = (params) => {
    return axios.get(url.getStatisticsChartURL, { params });
}
const getStatisticsSumZoneAlarmAPI = (params) => {
  return axios.get(url.getStatisticsSumZoneAlarmURL, { params });
}

const getStatisticsSumRobotAlarmAPI = (params) => {
  return axios.get(url.getStatisticsSumRobotAlarmURL, { params });
}

const getStatisticsEntireAlarmAPI = (params) => {
  return axios.get(url.getStatisticsEntireAlarmURL, { params });
}
export { getAlarmTypeAPI, getStatisticsChartAPI, getStatisticsSumZoneAlarmAPI, getStatisticsSumRobotAlarmAPI, getStatisticsEntireAlarmAPI };


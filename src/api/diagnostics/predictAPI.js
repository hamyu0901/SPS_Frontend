import { axios } from "@/main";

const url = {
    getPredictRobotAlarmStatusItemsURL: 'diagnostics/predict/robot/alarm/status',
    getPredictAxisAccumAlarmStatusItemsURL: 'diagnostics/predict/axis/accum/alarm/status',
    getPredictAxisAlarmStatusItemsURL: 'diagnostics/predict/axis/alarm/status',
    getPredictAccumChartItemsURL: 'diagnostics/predict/accum/chart',
    getPredictAccumAvgChartItemsURL: 'diagnostics/predict/accum/avg/chart',
    getPredictTemperatureChartItemsURL: 'diagnostics/predict/temperature/chart',
    getPredictPMTorqueChartItemsURL: 'diagnostics/predict/pm-torque/chart',
    getPredictAtomizerAlarmStatusItemsURL: 'diagnostics/predict/atomizer/alarm/status',
    getPredictAtomizerChartItemsURL: 'diagnostics/predict/atomizer/chart',
    getPredictExcelExportItemsURL: 'diagnostics/predict/export',
    getPredictAtomizerAlarmListURL: 'diagnostics/predict/atomizer/alarm/list'
};

const getPredictRobotAlarmStatusItemsAPI = (params) => {
    /** 로봇 알람 상태 조회 API */
    const { zoneId, prevDate } = params;
    return axios.get(url.getPredictRobotAlarmStatusItemsURL + `?zoneId=${zoneId}&prevDate='${prevDate}'`);
}

const getPredictAxisAccumAlarmStatusItemsAPI = (params) => {
    /** 로봇 축 알람 상태 조회 API */
    const { robotId, axisCount, prevDate } = params;
    return axios.get(url.getPredictAxisAccumAlarmStatusItemsURL + `?robotId=${robotId}&axisCount=${axisCount}&prevDate='${prevDate}'`);
}

const getPredictAxisAlarmStatusItemsAPI = (params) => {
    /** 로봇 축 알람 상태 조회 API */
    const { robotId, axisCount, predictType, prevDate } = params;
    return axios.get(url.getPredictAxisAlarmStatusItemsURL + `?robotId=${robotId}&axisCount=${axisCount}&predictType=${predictType}&prevDate='${prevDate}'`);
}

const getPredictAccumChartItemsAPI = (params) => {
    /** 예지보전 적산 차트 아이템 조회 API */
    const { robotId, axis, prevDate } = params;
    return axios.get(url.getPredictAccumChartItemsURL +`?robotId=${robotId}&axis=${axis}&prevDate='${prevDate}'`);
}

const getPredictAccumAvgChartItemsAPI = (params) => {
    const {robotId, axis, prevDate} = params;
    return axios.get(url.getPredictAccumAvgChartItemsURL + `?robotId=${robotId}&axis=${axis}&prevDate='${prevDate}'`)
}

const getPredictTemperatureChartItemsAPI = (params) => {
    /** 예지보전 온도 차트 아이템 조회 API */
    const { robotId, axis, prevDate } = params;
    return axios.get(url.getPredictTemperatureChartItemsURL + `?robotId=${robotId}&axis=${axis}&prevDate='${prevDate}'`);
}

const getPredictPMTorqueChartItemsAPI = (params) => {
    /** 예지보전 평균 차트 아이템 조회 API */
    const { robotId, axis, prevDate } = params;
    return axios.get(url.getPredictPMTorqueChartItemsURL + `?robotId=${robotId}&axis=${axis}&prevDate='${prevDate}'`);
}

const getPredictAtomizerAlarmStatusItemsAPI = (params) => {
    const { robotId, prevDate } = params;
    return axios.get(url.getPredictAtomizerAlarmStatusItemsURL + `?robotId=${robotId}&prevDate='${prevDate}'`);
}

const getPredictAtomizerChartItemsAPI = (params) => {
    const { robot_id: robotId, type, typeNo, prevDate } = params;
    return axios.get(url.getPredictAtomizerChartItemsURL + `?robotId=${robotId}&type=${type}&typeNo=${typeNo}&prevDate='${prevDate}'`);
}

const getPredictAtomizerAlarmListAPI = (params) => {
  const { robotId, prevDate } = params;
  return axios.get(url.getPredictAtomizerAlarmListURL + `?robotId=${robotId}&prevDate='${prevDate}'`);
}

const getPredictExcelExportItemsAPI = (params) => {
    const { date } = params;
    return axios.get(url.getPredictExcelExportItemsURL + `?date='${date}'`);
}

export {
    getPredictRobotAlarmStatusItemsAPI,
    getPredictAxisAccumAlarmStatusItemsAPI,
    getPredictAxisAlarmStatusItemsAPI,
    getPredictAccumChartItemsAPI,
    getPredictAccumAvgChartItemsAPI,
    getPredictTemperatureChartItemsAPI,
    getPredictPMTorqueChartItemsAPI,
    getPredictAtomizerAlarmStatusItemsAPI,
    getPredictAtomizerChartItemsAPI,
    getPredictAtomizerAlarmListAPI,
    getPredictExcelExportItemsAPI
};

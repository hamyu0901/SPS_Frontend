import { axios } from "@/main";

const url = {
    getPredictAtomizerAlarmStatusItemsURL: 'diagnostics/predict/atomizer/alarm/status',
    getPredictAtomizerChartItemsURL: 'diagnostics/predict/atomizer/chart',
    getReportAtomizerAvgDataItemsURL: 'reportview/atomizer/data/avg',
    getReportAtomizerAlarmCountItemsURL: 'reportview/atomizer/alarm/count',
};

const getPredictAtomizerAlarmStatusItemsAPI = (params) => {
    const { robotId, prevDate, currDate } = params;
    return axios.get(url.getPredictAtomizerAlarmStatusItemsURL + `?robotId=${robotId}&prevDate='${prevDate}'&currDate='${currDate}'`);
}
const getReportAtomizerAvgDataItemsAPI = (body) => {
    const {robotId, prevDate, currDate, type} = body;
    return axios.get(url.getReportAtomizerAvgDataItemsURL + `?robotId=${robotId}&prevDate='${prevDate}'&currDate='${currDate}'&type=${type}`);
}

const getReportAtomizerAlarmCountItemsAPI = (body) => {
    const {robotId, prevDate, currDate} = body;
    return axios.get(url.getReportAtomizerAlarmCountItemsURL + `?robotId=${robotId}&prevDate='${prevDate}'&currDate='${currDate}'`);
}

const getPredictAtomizerChartItemsAPI = (params) => {
    const { robot_id: robotId, type, typeNo, prevDate, currDate} = params;
    return axios.get(url.getPredictAtomizerChartItemsURL + `?robotId=${robotId}&type=${type}&typeNo=${typeNo}&prevDate='${prevDate}'&currDate='${currDate}'`);
}
export { getPredictAtomizerAlarmStatusItemsAPI, getReportAtomizerAvgDataItemsAPI, getReportAtomizerAlarmCountItemsAPI, getPredictAtomizerChartItemsAPI};
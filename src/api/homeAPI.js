import { axios } from '@/main';
const url = {
    getZoneAlarmStatisticsURL: 'home/zone-alarm/statistics',
    getZoneAlarmStatisticsResultURL: 'home/zone-alarm/statistics/zone',
    getZoneAlarmStatisticsCodeResultURL: 'home/zone-alarm/statistics/code',
    getRobotAlarmStatisticsURL: 'home/robot-alarm/statistics',
    getRobotAlarmStatisticsResultURL: 'home/robot-alarm/statistics/robot',
    getRobotAlarmStatisticsCodeResultURL: 'home/robot-alarm/statistics/code',
    getPredictAnalysisAccumResultURL: 'home/predict/analysis/accum',
    getPredictAnalysisTemperatureResultURL: 'home/predict/analysis/temperature',
    getPredictAnalysisPMTorqueResultURL: 'home/predict/analysis/pm-torque',
    getPredictAnalysisAtomizerResultURL: 'home/predict/analysis/atomizer',
}

const getZoneAlarmStatisticsAPI = () => {
    return axios.get(url.getZoneAlarmStatisticsURL);
}
const getZoneAlarmStatisticsResultAPI = () => {
    return axios.get(url.getZoneAlarmStatisticsResultURL);
}

const getZoneAlarmStatisticsCodeResultAPI = () => {
    return axios.get(url.getZoneAlarmStatisticsCodeResultURL);
}

const getRobotAlarmStatisticsAPI = () => {
    return axios.get(url.getRobotAlarmStatisticsURL);
}

const getRobotAlarmStatisticsResultAPI = () => {
    return axios.get(url.getRobotAlarmStatisticsResultURL);
}

const getRobotAlarmStatisticsCodeResultAPI = () => {
    return axios.get(url.getRobotAlarmStatisticsCodeResultURL);
}

const getPredictAnalysisAccumResultAPI = () => {
    return axios.get(url.getPredictAnalysisAccumResultURL);
}

const getPredictAnalysisTemperatureResultAPI = () => {
    return axios.get(url.getPredictAnalysisTemperatureResultURL);
}

const getPredictAnalysisPMTorqueResultAPI = () => {
    return axios.get(url.getPredictAnalysisPMTorqueResultURL);
}

const getPredictAnalysisAtomizerResultAPI = () => {
    return axios.get(url.getPredictAnalysisAtomizerResultURL);
}


export {
    getZoneAlarmStatisticsAPI,
    getZoneAlarmStatisticsResultAPI,
    getZoneAlarmStatisticsCodeResultAPI,
    getRobotAlarmStatisticsAPI,
    getRobotAlarmStatisticsResultAPI,
    getRobotAlarmStatisticsCodeResultAPI,
    getPredictAnalysisAccumResultAPI,
    getPredictAnalysisTemperatureResultAPI,
    getPredictAnalysisPMTorqueResultAPI,
    getPredictAnalysisAtomizerResultAPI
};
import { axios } from '@/main';

const url = {
    robotInfoURL: 'alarm/robot/info',
    robotTorqueURL: 'alarm/robot/torque',
    robotAccumTrendURL: 'alarm/robot/accum/trend',
    robotTemperatureTrendURL: 'alarm/robot/temperature/trend',
    robotAccumGapURL: 'alarm/robot/accum/gap',
    robotTemperatureGapURL: 'alarm/robot/temperature/gap',
    atomizerInfoURL: 'alarm/atomizer/info',
    atomizerTrendURL: 'alarm/atomizer/trend',
    atomizerListURL: 'alarm/atomizer/list',
    atomizerEntireListURL: 'alarm/atomizer/entire/list',
    zoneAlarmListURL: 'alarm/zone/list',
    robotAlarmListURL: 'alarm/robot/list',
    spcAlarmListURL: 'alarm/spc/list',
    spcAlarmFileURL: 'alarm/spc/file',
    commonAlarmDateCountURL: 'alarm/common/date/count',
    commonAlarmInfoURL:'alarm/common/info'
}

const robotInfoAPI = (params) => {
    const { alarm_id: alarmId, robot_id : robotId } = params;
    return axios.get(url.robotInfoURL + `?alarmId=${alarmId}&robotId=${robotId}`);
}

const robotTorqueAPI = (params) => {
    const { robot_id: robotId, job_name: jobName, time_stamp: time, axis_info } = params;
    const axis = axis_info.map((axisInfo, axisIndex) => axisInfo === 1 ? axisIndex+1 : '').filter(String);
    return axios.get(url.robotTorqueURL + `?robotId=${robotId}&jobName=${jobName}&time=${time}&axis=${axis}`);
}

const robotAccumTrendAPI = (params) => {
    const { robot_id: robotId, job_name: jobName, time_stamp: time, axis_info } = params;
    const axis = axis_info.map((axisInfo, axisIndex) => axisInfo === 1 ? axisIndex+1 : '').filter(String);
    return axios.get(url.robotAccumTrendURL + `?robotId=${robotId}&jobName=${jobName}&time=${time}&axis=${axis}`);
}

const robotTemperatureTrendAPI = (params) => {
    const { robot_id: robotId, time_stamp: time, axis_info } = params;
    const axis = axis_info.map((axisInfo, axisIndex) => axisInfo === 1 ? axisIndex+1 : '').filter(String);
    return axios.get(url.robotTemperatureTrendURL + `?robotId=${robotId}&time=${time}&axis=${axis}`);
}

const robotAccumGapAPI = (params) => {
    const { robot_id: robotId, job_name: jobName, time_stamp: time, axis_info } = params;
    const axis = axis_info.map((axisInfo, axisIndex) => axisInfo === 1 ? axisIndex+1 : '').filter(String);
    return axios.get(url.robotAccumGapURL + `?robotId=${robotId}&jobName=${jobName}&time=${time}&axis=${axis}`);
}

const robotTemperatureGapAPI = (params) => {
    const { robot_id: robotId, time_stamp: time, axis_info } = params;
    const axis = axis_info.map((axisInfo, axisIndex) => axisInfo === 1 ? axisIndex+1 : '').filter(String);
    return axios.get(url.robotTemperatureGapURL + `?robotId=${robotId}&time=${time}&axis=${axis}`);
}

const atomizerInfoAPI = (params) => {
    const { alarm_id: alarmId } = params;
    return axios.get(url.atomizerInfoURL + `?alarmId=${alarmId}`);
}

const atomizerTrendAPI = (params) => {
    const { alarm_id: alarmId } = params;
    return axios.get(url.atomizerTrendURL + `?alarmId=${alarmId}`);
}

const atomizerListAPI = (params) => {
    const { alarm_id: alarmId, zone_id: zoneId } = params;
    return axios.get(url.atomizerListURL + `?alarmId=${alarmId}&zoneId=${zoneId}`);
}

const atomizerEntireListAPI = (params) => {
    const { alarm_id: alarmId, zone_id: zoneId } = params;
    return axios.get(url.atomizerEntireListURL + `?alarmId=${alarmId}&zoneId=${zoneId}`);
}

const zoneAlarmListAPI = (params) => {
    const { zone_id: zoneId } = params;
    return axios.get(url.zoneAlarmListURL + `?zoneId=${zoneId}`);
}

const robotAlarmListAPI = (params) => {
    const { robot_id: robotId } = params;
    return axios.get(url.robotAlarmListURL + `?robotId=${robotId}`);
}

const getSpcAlarmListAPI = (params) => {
    const { spc_code: alarmCode } = params;
    return axios.get(url.spcAlarmListURL + `?alarmCode=${alarmCode}`);
}

const getSpcAlarmFileAPI = (params) => {
    const { alarm_code: alarmCode } = params;
    return axios.get(url.spcAlarmFileURL + `/${alarmCode}`, { responseType: 'blob' });
}
const getCommonAlarmDateCountAPI = (params) => {
    const { type_id: type, time_stamp: date, alarm_code: alarmCode, robot_id: robotId, zone_id: zoneId } = params;
    return type === 0 ?
      axios.get(url.commonAlarmDateCountURL + `?type=${type}&date=${date}&robotId=${robotId}&alarmCode=${alarmCode}`) :
      axios.get(url.commonAlarmDateCountURL + `?type=${type}&date=${date}&zoneId=${zoneId}&alarmCode=${alarmCode}`);
}
const getCommonAlarmInfoAPI = (params) => {
    const { type_id : type, alarm_id: alarmId } = params;
    return axios.get(url.commonAlarmInfoURL + `?type=${type}&alarmId=${alarmId}`);
}

export {
  robotInfoAPI,
  robotTorqueAPI,
  robotAccumTrendAPI,
  robotTemperatureTrendAPI,
  robotAccumGapAPI,
  robotTemperatureGapAPI,
  atomizerInfoAPI,
  atomizerTrendAPI,
  atomizerListAPI,
  atomizerEntireListAPI,
  zoneAlarmListAPI,
  robotAlarmListAPI,
  getSpcAlarmListAPI,
  getSpcAlarmFileAPI,
  getCommonAlarmDateCountAPI,
  getCommonAlarmInfoAPI
};

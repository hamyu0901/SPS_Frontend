import { axios } from '@/main';

const url = {
    getFactoryNameURL: 'monitoring/factory/name',
    line: {
        getRobotStatusURL: 'monitoring/line/robot/status',
        getLineZoneAlarmItemsURL: 'monitoring/line/zone/alarm',
        getHisAlarmItemsURL : 'monitoring/line/zone/robot/alarm',
        getLineRobotAlarmRemedyItemURL : 'monitoring/line/robot/remedy/alarm',
        getRobotAlarmItemURL: 'monitoring/line/robot/alarm'

    },
    detail: {
        getZoneAlarmItemsURL: 'monitoring/detail/zone/alarm',
        getProductionInfoItemsURL: 'monitoring/detail/zone/production',
        getAlarmMixCountItemsURL: 'diagnostics/alarmstatistics/data/gridtable/statistics/alarm/mix/count',
        getBoothAlarmCountItemsURL: 'diagnostics/alarmstatistics/data/gridtable/statistics/booth/alarm/count',
    }
};

const getFactoryNameAPI = () => {
    return axios.get(url.getFactoryNameURL);
}

const getRobotStatusAPI = () => {
    return axios.get(url.line.getRobotStatusURL);
}

const getLineZoneAlarmItemsAPI = () => {
    return axios.get(url.line.getLineZoneAlarmItemsURL);
}

const getHisAlarmItemsAPI = () => {
    return axios.get(url.line.getHisAlarmItemsURL)
}

const getLineRobotAlarmRemedyItemsAPI = (params) => {
    const { code, rcModel } = params
    return axios.get(url.line.getLineRobotAlarmRemedyItemURL+`?code=${code}&rc_model=${rcModel}`);
}

const getLineRobotAlarmItemAPI = (body) => {
    const { start_date, end_date, robot_id} = body;
    return axios.post(url.line.getRobotAlarmItemURL, {
        robot_id: robot_id,
        start_date : start_date,
        end_date : end_date,
    })
}

const getZoneAlarmItemsAPI = (zoneId) => {
    return axios.get(url.detail.getZoneAlarmItemsURL+`?zoneId=${zoneId}`);
}

const getProductionInfoItemsAPI = (zoneId) => {
    return axios.get(url.detail.getProductionInfoItemsURL+`?zoneId=${zoneId}`);
}

const getAlarmMixCountItemsAPI = (params) => {
    const { zoneId, code, prevDate, currDate } = params;
    return axios.get(url.detail.getAlarmMixCountItemsURL+`?zoneId=${zoneId}&code='${code}'&prevDate=${prevDate}&currDate=${currDate}`);
}

const getBoothAlarmCountItemsAPI = (params) => {
    const { code, prevDate, currDate } = params;
    return axios.get(url.detail.getBoothAlarmCountItemsURL+`?code='${code}'&prevDate=${prevDate}&currDate=${currDate}`);
}


export { getFactoryNameAPI, getRobotStatusAPI, getLineZoneAlarmItemsAPI, getZoneAlarmItemsAPI, getProductionInfoItemsAPI,
    getAlarmMixCountItemsAPI, getBoothAlarmCountItemsAPI, getLineRobotAlarmItemAPI, getHisAlarmItemsAPI, getLineRobotAlarmRemedyItemsAPI};


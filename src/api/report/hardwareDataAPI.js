import { axios } from "@/main";

const url = {
    getAccumAxisAvg: '/diagnostics/renew/avg/robot/axis',
    getAccumDailyAvgURL: '/diagnostics/renew/accum/daily/avg',
    getTemperatureAvg: '/reportview/renew/temp/avg/robot/axis',
    getTorqueAvg: '/reportview/renew/torque/avg/robot/axis',
    getAccumDataURL : '/diagnostics/renew/accum/robot/axis',
    getTemperatureDataURL : '/diagnostics/torqueTemperature/renew/data/trend/robot/axis',
    getPmTorqueDataURL : '/diagnostics/renew/torque/avg/pmtorque/robot/axis'
}

const getAccumAxisAvgAPI = (body) => {
    return axios.post(url.getAccumAxisAvg, {
        robotId: body.robotId,
        startDate: body.startDate,
        endDate : body.endDate,
        robotAxis : body.robotAxis
    })
}
const getTemperatureAvgAPI = (body) => {
    return axios.post(url.getTemperatureAvg, {
        robotId: body.robotId,
        startDate: body.startDate,
        endDate : body.endDate,
        robotAxis : body.robotAxis
    })
}
const getTorqueAvgAPI = (body) => {
    return axios.post(url.getTorqueAvg, {
        robotId: body.robotId,
        startDate: body.startDate,
        endDate : body.endDate,
        robotAxis : body.robotAxis
    })
}
const getAccumDailyAvgAPI = (body) => {
    return axios.post(url.getAccumDailyAvgURL, {
        robotId : body.robotId,
        startDate : body.startDate,
        endDate : body.endDate
    })
}
const getAccumDataAPI = (body) => {
    const { startdate, enddate, robotid, axis } = body;
    return axios.post(url.getAccumDataURL, {
        startdate : startdate,
        enddate : enddate,
        robotid : robotid,
        axis : axis
    })
}
const getTemperatureDataAPI = (body) => {
    const { startdate, enddate, robotid, axis } = body;
    return axios.post(url.getTemperatureDataURL, {
        startdate : startdate,
        enddate : enddate,
        robotid : robotid,
        axis : axis
    })
}
const getPmTorqueDataAPI = (body) => {
    const { startdate, enddate, robotid, axis } = body;
    return axios.post(url.getPmTorqueDataURL, {
        startdate : startdate,
        enddate : enddate,
        robotid : robotid,
        axis : axis
    })

}
export { getAccumAxisAvgAPI , getTemperatureAvgAPI, getTorqueAvgAPI, getAccumDailyAvgAPI, getAccumDataAPI, getTemperatureDataAPI, getPmTorqueDataAPI};
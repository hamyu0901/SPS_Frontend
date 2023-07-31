import { axios } from "@/main";

const url = {
    getDailyAccumAvgURL: 'diagnostics/torqueloadfactor/renew/accum/daily/avg',
    getRobotJobItemsURL:  'diagnostics/torqueloadfactor/robot/job/list',
}

const getDailyAccumAvgAPI = (item) => {
    return axios.post(url.getDailyAccumAvgURL, {
        robotid: item.robotid,
        axis: item.axis,
        endDate: item.endDate,
        startDate: item.startDate,
        jobname: item.jobname
    })
}
const getRobotJobItemsAPI = (params) => {
    const {robotId, startDate, endDate} = params
    return axios.get(url.getRobotJobItemsURL +`?robotId=${robotId}&startDate=${startDate}&endDate=${endDate}`);
}


export { getDailyAccumAvgAPI , getRobotJobItemsAPI };
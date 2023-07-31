import { axios } from "@/main";

const url = {
    getTorqueTempURL : 'diagnostics/torqueTemperature/data/trend/'
}

const getTorqueTempAPI = (params) => {
    const { robotId, startDate, endDate, axis} = params
    const type = params.type ? params.type : '';
    return axios.get(url.getTorqueTempURL+type +`?robotId=${robotId}&startDate=${startDate}&endDate=${endDate}&axis=${axis}`);
}

export { getTorqueTempAPI };
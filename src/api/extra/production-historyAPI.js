import { axios } from "@/main";

const url = {
    getProductionInfoItemsURL: 'extra/production-history/zone',
};

const getProductionInfoItemsAPI = (params) => {
    const zoneId = params.zoneId
    if(params.robotId){
        return axios.get(`${url.getProductionInfoItemsURL}`, { params });
    }else {
        return axios.get(`${url.getProductionInfoItemsURL}/${zoneId}`, { params });
    }
};

export {
    getProductionInfoItemsAPI
};
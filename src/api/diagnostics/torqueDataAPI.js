import { axios } from "@/main";

const url = {
    getTorqueDataRobotInfoItemURL: '/diagnostics/torquedata/robot-info/table',
    getTorqueDataItemsURL: '/diagnostics/torquedata/list'
};

const getTorqueDataRobotInfoItemAPI = (params) => {
    const { robotId } = params;
    return axios.get(url.getTorqueDataRobotInfoItemURL + `?robotId=${robotId}`);
}

const getTorqueDataItemsAPI = (params) => {
    const { robotId, date } = params;
    return axios.get(url.getTorqueDataItemsURL + `?robotId=${robotId}&date=${date}`);
}

export { getTorqueDataRobotInfoItemAPI, getTorqueDataItemsAPI };


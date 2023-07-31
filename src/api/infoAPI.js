import { axios } from '@/main';

const url = {
    getUserAuthorityURL: 'info/user/auth',
    getRobotPartItemsURL: 'info/robot/part',
    getRobotAlarmPartMatchItemsURL: 'info/robot/alarm/part/match'
}

const getUserAuthorityAPI = (userId) => {
    return axios.get(url.getUserAuthorityURL + `?userId='${userId}'`);
}

const getRobotPartItemsAPI = () => {
    return axios.get(url.getRobotPartItemsURL);
}

const getRobotAlarmPartMatchItemsAPI = () => {
    return axios.get(url.getRobotAlarmPartMatchItemsURL);
}


export { getUserAuthorityAPI, getRobotPartItemsAPI, getRobotAlarmPartMatchItemsAPI };
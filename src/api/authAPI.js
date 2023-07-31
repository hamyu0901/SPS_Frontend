import { axios } from '@/main';

const url = {
    loginCheckURL: '/auth/login/check',
    loginURL: '/auth/login',
    getUserInfoURL: '/auth/user'
}

const loginCheckAPI = () => {
    return axios.get(url.loginCheckURL);
}

const loginAPI = (params) => {
    return axios.post(url.loginURL, { ...params });
}

const getUserInfoAPI = () => {
    return axios.get(url.getUserInfoURL);
}

export { loginCheckAPI, loginAPI, getUserInfoAPI };
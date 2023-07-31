import { axios } from "@/main";

const url = {
    getPmHardURL: 'maintenance/renew/robot/pmhard'
}

const getPmHardAPI = (robotid) => {
    return axios.post(url.getPmHardURL, {
        robotid: robotid
    })
}

export { getPmHardAPI };
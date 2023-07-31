import { axios } from "@/main";

const url = {
    getBackupListItemsURL: 'extra/backup/list',
    getBackupFileURL: 'extra/backup/download/file'
};

const getBackupListItemsAPI = () => {
    return axios.get(`${url.getBackupListItemsURL}`);
};
const getBackupFileAPI = (params) => {
    const { path: path } = params;
    return axios.get(url.getBackupFileURL, {  responseType: 'blob', params: { path }  });
};

export { getBackupListItemsAPI, getBackupFileAPI };
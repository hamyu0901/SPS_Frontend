import { isEmpty } from 'lodash';

const setZoneItems = (zoneInfos, boothId) => {
    return zoneInfos.filter(zoneInfo => zoneInfo.disp_booth_id === boothId);
}

const setRobotItems = (robotInfos, zoneId) => {
    return robotInfos.filter(robotInfo => robotInfo.zone_id === zoneId);
}

const deepClone = (obj) => {
    const result = (obj === null || typeof obj !== 'object') ? obj : (Array.isArray(obj) ? [] : {});
    ( result !== obj ) && Object.keys(obj).forEach(key => {
        result[key] = deepClone(obj[key]);
    });
    return result;
}

const isEmptyObj = (obj) =>  {

    if(obj.constructor === Object
      && isEmpty(obj))  {
        return true;
    }
    return false;
  }

const sort = (array, key, type) => {
    if(type === 'asc'){
        array.sort(function (a,b) {
            return a[key] < b[key] ? -1 : 1;
        })
    }else{
        array.sort(function (a,b) {
            return a[key] > b[key] ? -1 : 1;
        })
    }
    return array
}

const orderedDate = (array, key, type) => {
    return type === 'asc' ? array.sort((a, b) => new Date(a[key]) - new Date(b[key])) : array.sort((a, b) => new Date(b[key]) - new Date(a[key]))
  }

export { setZoneItems, setRobotItems, deepClone , isEmptyObj, sort, orderedDate};
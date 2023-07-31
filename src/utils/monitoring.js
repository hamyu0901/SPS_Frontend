/** 타입 목록 정의  */
const toolType = ['paint', 'sealer', 'opener', 'etc'];
const robotStatusType = ['offline', 'standby', 'normal', 'standby', 'alarm', 'error', 'error'];

const setRobotStatus = (robotInfos, robotStatuses) => {
    const robotItems = robotStatuses && robotInfos.map(robotInfo => {
        const robotStatus = robotStatuses.data.filter(robotStatus => {
            return robotStatus.robot_id === robotInfo.robot_id;
        })
        const robotItem = {...robotInfo, ...robotStatus[0]};
        return robotItem;
    })
    return robotItems ? robotItems : [];
}

const setDirectionRobotItems = (maxRobotCount, robotItems, direction) => {
    /** 좌우측 기준으로 로봇 아이템 설정 함수 */
    /** 
        maxRobotCount: Number // 좌우측 각각을 기준으로 구성될 수 있는 로봇 최대 수
        robotItems: robotItem[] // 전체 로봇 아이템 목록
        direction: String // 좌우측 구분자(left, right) 
    */
    
    const useRobotItems = Array.from({ length: Math.ceil(maxRobotCount)}, () => new Object);
    const directionRobotItems = Array.isArray(robotItems) && robotItems.filter(robotItem => direction === 'left' ? robotItem.robot_no % 2 !== 0 : robotItem.robot_no % 2 === 0);
    directionRobotItems.forEach(directionRobotItem => {
        useRobotItems[Math.floor(direction === 'left'? Math.floor(directionRobotItem.robot_no / 2) : Math.floor(directionRobotItem.robot_no / 2) - 1)] = directionRobotItem;
    })
    return useRobotItems;
}

const getRobotImg = (tool_id, robot_status, type) => {
    const toolId = tool_id === 99 ? 3 : tool_id;
    return toolType[toolId] && robotStatusType[robot_status] && type === 'png' ? require(`@/images/monitoring/robot/${toolType[toolId]}/${robotStatusType[robot_status]}.png`) : require(`@/images/monitoring/robot/${toolType[toolId]}/${robotStatusType[robot_status]}.gif`) ;
}

const checkAlarm = (item) => {
    return item.warning === false;
}

const judgeZoneAlarm = (filter, items) => {
    /** 아이템 내 해당 필터와 동일한 아이템이 있을 경우 true, 없을 경우 false 를 리턴*/
    return filter.type_id === 0 ? items.some(item => (item['robot_id'] === filter['robot_id'] && item['code'] === filter['code'])) 
    : items.some(item => (item['zone_id'] === filter['zone_id'] && item['code'] === filter['code']))
}

const removeItems = (filter, items) => {
    return filter.type_id === 0 ? items.filter(item => !(item['robot_id'] === filter['robot_id'] && item['code'] === filter['code']))
    : items.filter(item => !(item['zone_id'] === filter['zone_id'] && item['code'] === filter['code']));
}

export { toolType, robotStatusType, setRobotStatus, setDirectionRobotItems, getRobotImg, checkAlarm, judgeZoneAlarm, removeItems };
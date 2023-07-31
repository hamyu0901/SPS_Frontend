const setProductionItems = (data) => {
    const filteredModelColorItems = Array.from(new Set(data.map(item => JSON.stringify({ model: item.model, color: item.color })))).map(JSON.parse); // 중복을 제거하여 유일한 모델과 컬러 조합을 추출

    const filteredRobotNames = Array.from(new Set(data.map(item => item.robot_name))); // 중복을 제거하여 유일한 로봇 이름 추출

    const result = [];

    filteredModelColorItems.forEach(filteredItem => {
        const model = filteredItem.model;
        const color = filteredItem.color;
        const total = 0;
        const obj = { model, color, total };

        data.forEach(item => {
            if (item.model === model && item.color === color) {
                obj[`${item.robot_name}_flow`] = item.flow;
                obj.total +=Number(item.flow);
            }
        });

        // 로봇 이름이 없는 경우 0으로 할당
        filteredRobotNames.forEach(name => {
            if (!Object.prototype.hasOwnProperty.call(obj, `${name}_flow`)) {
                obj[`${name}_flow`] = 0;
            }
        });

        result.push(obj);
    });
    return result
}

const getCalculateProductionValues = (type, array) => {
    const calculateValues = {};
    const totalCount = array.length;

    for (const item of array) {
        for (const key in item) {
            if (key !== 'result') {
                switch(type){
                    case 'average':
                        calculateValues[key] = (calculateValues[key] || 0) + item[key];
                        break;
                    case 'sum':
                        calculateValues[key] = (calculateValues[key] || 0) + item[key];
                        break;
                    case 'max':
                        calculateValues[key] = Math.max(calculateValues[key] || 0, item[key]);
                        break;
                    case 'min':
                        if (calculateValues[key] === undefined || item[key] < calculateValues[key]) {
                            calculateValues[key] = item[key];
                        }
                        break;
                }

            }
        }
    }

    if(type === 'average') {
        for (const key in calculateValues) {
            calculateValues[key] = (calculateValues[key] / totalCount) !== 0 ? (calculateValues[key] / totalCount).toFixed(2) : 0;
        }
    }
    return calculateValues
}

const convertToProductionChartItems = ( array ) => {
    const result = Object.entries(array[0]).reduce((acc, [key]) => {
        if (key !== 'Time') {
            const items = array.map((obj, index) => ({
                label: obj['Time'],
                x: index,
                y: obj[key],
            }));

            const resultItem = {
                items,
                name: key,
                color: null,
            };

            if (key === 'FLOW VOLUME(cc)') {
                resultItem.color = '#53559bcc';
                resultItem.type = 'column';
                resultItem.fillOpacity = 0.5;
            }

            acc.push(resultItem);
        }
        return acc;
    }, []);
    return result
}

export { setProductionItems, getCalculateProductionValues, convertToProductionChartItems };
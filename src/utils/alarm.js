const levelIconType = [
    require('@/images/img_alarm_low.png'),
    require('@/images/img_alarm_middle.png'),
    require('@/images/img_alarm_high.png'),
    require('@/images/img_robot_alarm.png'),
]

const levelColorType = ['#2DB67C', '#FEC706', '#E64107', '#E64107'];

const atomizerEntireType = ['flow', 'turbine_speed', 'sa_s', 'sa_v'];

const convertTorqueToChartItems = (items) => {
    let mergedStepNo = [];
    let stepNo = [];
    items.forEach(item => {
        mergedStepNo = mergedStepNo.concat(item.step_no);
    })
    stepNo = mergedStepNo.filter((no, pos) => mergedStepNo.indexOf(no) === pos);
    return items.map(item => {
        let chartItem = [];
        stepNo.forEach(st => {
            chartItem.push(
                { x: st, y: item.step_no.indexOf(st) !== -1 ? item.torque[item.step_no.indexOf(st)] : null }
            )
        })
        return { name: 'axis'+item.axis, items: chartItem.sort((a,b) => { return a.x - b.x }) }
    });
}

const convertTrendToChartItems = (items = []) => {
    let chartItems = [];
    Object.keys(items[0]).map(key => {
        key.includes('axis') && chartItems.push( { name: key, items: [] } );
    })

    items.forEach(item => {
        chartItems.forEach(chartItem => {
            chartItem.items.push( { x: new Date(item.time), y: item[chartItem.name]} );
        })
    })
    return chartItems;
}

const convertGapToChartItems = (items) => {
    const chartItems = [ { name: 'month', items: [] }, { name: 'days', items: [] } ];

    items.forEach(item => {
        chartItems.forEach(chartItem => {
            chartItem.items.push( { label: ('axis'+item.axis), y: item[chartItem.name]} );
        })
    })
    return chartItems;
}

const convertAtomizerToChartItems = (type, items= []) => {
    const item = items.length > 0 && items[0];
    let chartItems = {};

    if (type === 'entire') {
        atomizerEntireType.forEach(atomizerType => {
            chartItems[atomizerType] = [
                {
                    name: 'COMMAND',
                    items: item.step_no.map((st, index) => { return { x: st, y: item[`${atomizerType}_cmd`][index]}})
                },
                {
                    name: 'FEEDBACK',
                    items: item.step_no.map((st, index) => { return { x: st, y: item[`${atomizerType}_feedback`][index]}})
                }
            ]
        })
    } else if (type === 'hv') {
        chartItems['hv'] = [
            {
                name: 'HV-COMMAND',
                items: item.step_no.map((st, index) => { return { x: st, y: item[`hv_cmd`][index]}})
            },
            {
                name: 'HV-FEEDBACK',
                items: item.step_no.map((st, index) => { return { x: st, y: item[`hv_feedback`][index]}})
            },
            {
                name: 'HVC-FEEDBACK',
                items: item.step_no.map((st, index) => { return { x: st, y: item[`hvc_feedback`][index]}})
            }
        ]
    }

    return chartItems;
}

const convertLevelToIconItems = (alarmId, items) => {
    items.forEach(item => {
        item['focus'] = Number(item.alarm_id) === Number(alarmId);
        item.level = typeof item.level === 'number' ? levelIconType[item.level] : item.level;
    })
    return items;
}

const convertLevelToIcon = (level, type) => {
    return type === 0 ? levelIconType[3] : levelIconType[level];
}

const convertToLevelColor = (level, type) => {
  return type === 0 ? levelColorType[3] : levelColorType[level];
}

export { convertTorqueToChartItems, convertTrendToChartItems, convertGapToChartItems, convertAtomizerToChartItems, convertLevelToIconItems, convertLevelToIcon, convertToLevelColor };

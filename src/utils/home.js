import i18n from "@/plugins/i18n";
import store from '@/store/store';
i18n.locale = store.getters.getLanguage;
const zoneAlarmType = {
    system: i18n.t('home.main.zoneAlarmType.system'),
    sprayers: i18n.t('home.main.zoneAlarmType.sprayers'),
    zone: i18n.t('home.main.zoneAlarmType.zone'),
    vision: i18n.t('home.main.zoneAlarmType.vision'),
}

const zoneAlarmColorSet = ['#E8973A', '#79A133', '#3072C6', '#04CBE5', '#E8534C'];
const convertToBarChartItems = (items, hasClick = false, func = null) => {
    const barChartItems = items.map(item => {
        return {
            y: Number(item.violation_count),
            label: `${item.zone_name}${item.robot_name ? ('-' + item.robot_name) : ''}${item.axis ? ('-' + item.axis+' 축') : ''}`,
            click: hasClick ? function(e) {
               func !== null && func(item);
            } : null
        }
    })
    return barChartItems;
}

const convertToStackedBarChartZoneItems = (items, hasClick = false, func = null) => {
    const stackedBarChartZoneItems = [
        { id: 'system', name: zoneAlarmType.system, items: [] },
        { id: 'sprayers', name: zoneAlarmType.sprayers, items: [] },
        { id: 'zone', name: zoneAlarmType.zone, items: [] },
        { id: 'vision', name: zoneAlarmType.vision, items: [] }
    ]
    items.forEach(item => {
        stackedBarChartZoneItems.forEach(stackedBarChartZoneItem => {
            stackedBarChartZoneItem.items.push({
                label: item.zone_name,
                y: Number(item[stackedBarChartZoneItem.id]),
                click: hasClick ? function(e) {
                    func !== null && func(item);
                } : null
            });
        })
    })
    return stackedBarChartZoneItems;
}

const convertToPieChartItems = (items, labelType, contents) => {
    const pieChartItems = items.map(item => {
         return {
             y: Number(item.violation_count),
             label: item[labelType],
             contents: item[contents],
             color: item.type_id ? zoneAlarmColorSet[item.type_id - 1] : '',
             indexLabelFontColor: item.type_id ? zoneAlarmColorSet[item.type_id - 1] : ''
         }
    })
    return pieChartItems;
}

export { convertToBarChartItems, convertToPieChartItems, convertToStackedBarChartZoneItems };

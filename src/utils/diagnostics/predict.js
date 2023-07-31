import i18n from "@/plugins/i18n";
import store from '@/store/store';
import { isEmpty, uniqBy } from 'lodash';
i18n.locale = store.getters.getLanguage;
const atomizerValueName = {
    "CMD-FEEDBACK-UPPER-AVG": i18n.t("diagnostics.predict.main.predictLineChart.atomizerValueName.CMD-FEEDBACK-UPPER-AVG"),
    "CMD-FEEDBACK-UPPER-CONFIG": i18n.t("diagnostics.predict.main.predictLineChart.atomizerValueName.CMD-FEEDBACK-UPPER-CONFIG"),
    "CMD-FEEDBACK-UNDER-AVG": i18n.t("diagnostics.predict.main.predictLineChart.atomizerValueName.CMD-FEEDBACK-UNDER-AVG"),
    "CMD-FEEDBACK-UNDER-CONFIG": i18n.t("diagnostics.predict.main.predictLineChart.atomizerValueName.CMD-FEEDBACK-UNDER-CONFIG"),
    "ALARM-COUNT": "ALARM-COUNT"
}

const ColorType = {
    error: '#EF4C28'
}

const convertToChartItems = (items, itemType ) => {
    const chartItems = { configs: [], items: [] };
    items.sort((a, b) => new Date(a.update_time) - new Date(b.update_time)).forEach(item => {
        chartItems.configs.push( { x: Date.parse(item.update_time), y: item.config });
        chartItems.items.push( { x: Date.parse(item.update_time), y: item[itemType] ,indexLabel: (item.config < item[itemType]) ? item[itemType].toString(): null, indexLabelFontColor: ColorType.error });
    });
    return chartItems;
    /** config, job_name, torque, update_time*/
    /** x축 기준 update_time - label*/
    /**  config, */

};

const convertToAccumChartItems = ( items ) => {
    const accumChartItems = [];
    const jobNames = [...new Set(items.map(item => item.job_name))];
    let changeIndex = 0;
    jobNames.forEach(jobName => {
        const chartItem = { jobName: jobName, configs: [], items: []};
        const sliceItems = changeIndex !== 0? items.slice(changeIndex) : items;
        sliceItems.sort((a, b) => new Date(a.update_time) - new Date(b.update_time)).some((item, index) => {
            if (item.job_name !== jobName ) {
                changeIndex = index;
                return true;
            }
            chartItem.configs.push( { x: Date.parse(item.update_time), y: item.config });
            chartItem.items.push( { x: Date.parse(item.update_time), y: item.torque ,indexLabel: (item.config < item.torque) ? item.torque.toString() : null, indexLabelFontColor: ColorType.error });
        });
        accumChartItems.push(chartItem);
    })
    return accumChartItems;
}

const convertToAtomizerHVChartItems = ( items ) => {
    const maxAtomizerHVChartItem = uniqBy(items.map(i => i.item).flat(), 'name').sort((a,b) => a.name.localeCompare(b.name));
    const atomizerPredictHVChartItems = [];
    maxAtomizerHVChartItem.forEach((item, index) => {
        index % 2 === 0 && atomizerPredictHVChartItems.push(
            [
                { name: maxAtomizerHVChartItem[index].name, items: [], color:  maxAtomizerHVChartItem[index].name.toLowerCase().includes('config') ? 'red' : null },
                { name: maxAtomizerHVChartItem[index+1].name, items: [], color:  maxAtomizerHVChartItem[index+1].name.toLowerCase().includes('config') ? 'red' : null },
                { name: atomizerValueName['ALARM-COUNT'], items: [], type: 'column', fillOpacity: .5, color: '#53559bcc' }
            ]
        );
    })
    items.forEach(atomizerPredictHVItem => {
        atomizerPredictHVChartItems.forEach(atomizerPredictHVChartItem => {
            atomizerPredictHVChartItem.forEach((hvChartItem, hvChartIndex) => {
                let check = false;
                atomizerPredictHVItem.item.forEach((hvItem, hvIndex) => {
                    if( hvChartItem.name === hvItem.name ) {
                        atomizerPredictHVChartItem[hvChartIndex].items.push({
                            label: atomizerPredictHVItem.date,
                            y: hvItem.value,
                            indexLabel: (hvChartIndex % 2 === 0 && hvIndex % 2 === 0) ? ( atomizerPredictHVItem.item[hvIndex].value > atomizerPredictHVItem.item[hvIndex+1].value ? atomizerPredictHVItem.item[hvIndex].value.toString() : null ) : null,
                            indexLabelFontColor: (hvChartIndex % 2 === 0 && hvIndex % 2 === 0) ? ( atomizerPredictHVItem.item[hvIndex].value > atomizerPredictHVItem.item[hvIndex+1].value ? ColorType.error : null ) : null,
                        })
                        check = true;
                    }
                    ((atomizerPredictHVItem.item.length - 1 === hvIndex) && check === false) && (hvChartItem.name === 'ALARM-COUNT' ?
                        atomizerPredictHVChartItem[hvChartIndex].items.push( { label: atomizerPredictHVItem.date, y: Number(atomizerPredictHVItem.alarm_count) } ) :
                        atomizerPredictHVChartItem[hvChartIndex].items.push( { label: atomizerPredictHVItem.date, y: null } ))
                })
            })
        })
    })
    return atomizerPredictHVChartItems;
}

const convertToAtomizerChartItems = ( items ) => {
    const atomizerPredictChartItems = items[0].item.map(item => {
        return { name: atomizerValueName[item.name], items: [], color: item.name.toLowerCase().includes('config') ? '#EF4C28' : null }
    })
    items.forEach((atomizerPredictItem) => {
        atomizerPredictItem.item.forEach((item, index) => {
            atomizerPredictChartItems[index].items.push({
                label: atomizerPredictItem.date,
                y: item.value,
                indexLabel: (index % 2 === 0) ? ( Math.abs(atomizerPredictItem.item[index].value) > Math.abs(atomizerPredictItem.item[index+1].value) ? atomizerPredictItem.item[index].value.toString() : null ) : null,
                indexLabelFontColor:(index % 2 === 0) ? ( Math.abs(atomizerPredictItem.item[index].value) > Math.abs(atomizerPredictItem.item[index+1].value) ? ColorType.error : null ) : null,
            })
            atomizerPredictItem.item.length - 1 === index && ( !isEmpty(atomizerPredictChartItems[index+1]) ? atomizerPredictChartItems[index+1].items.push({
                label: atomizerPredictItem.date,
                y: Number(atomizerPredictItem.alarm_count)

            }) : atomizerPredictChartItems.push({
                name: atomizerValueName['ALARM-COUNT'],
                items: [{
                    label: atomizerPredictItem.date,
                    y: Number(atomizerPredictItem.alarm_count),
                }],
                type: 'column',
                fillOpacity: .5,
                color: '#53559bcc',
            }))
        })
    })
    return atomizerPredictChartItems;
}

const convertToAtomizerAlarmChartItems = ( items ) => {
  const atomizerAlarmChartItems = [{ name: atomizerValueName['ALARM-COUNT'], items: [], type: 'column', fillOpacity: .5, color: '#53559bcc'} ];
  items.forEach(atomizerPredictItem => {
    atomizerAlarmChartItems[0].items.push({ label: atomizerPredictItem.date, y: Number(atomizerPredictItem.alarm_count) });
  });
  return atomizerAlarmChartItems;
};

export { convertToChartItems, convertToAccumChartItems, convertToAtomizerHVChartItems, convertToAtomizerChartItems, convertToAtomizerAlarmChartItems };

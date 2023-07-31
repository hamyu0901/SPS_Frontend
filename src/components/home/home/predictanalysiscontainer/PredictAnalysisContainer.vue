<template>
    <v-layout :class="['predict-analysis-container']" fill-height column>
        <h1 :class="['predict-analysis-container-title', `${predictAnalysisItem.alarmType}-title-border`]">{{predictAnalysisItem.title}}</h1>
        <v-layout fill-height>
            <v-flex lg4 md4 sm4 :class="['predict-analysis-container__result']">
                <v-layout column>
                    <predict-total-count :title="predictAnalysisItem.totalCountTitle" :total-count="renderTotalAlarmCount" :predict-alarm-type="predictAnalysisItem.alarmType" :total-count-type="datas.totalCountType" />
                    <v-layout :class="['predict-analysis-container__result-predict-top']" column>
                        <predict-top
                            v-for="(topItem,index) in renderTopItems"
                            :key="'predict-top-'+index"
                            :top-item="topItem"
                            :title="topItem.zone_name && renderTopItemTitle(topItem)"
                            :count="Number(topItem.violation_count)"
                            :src="predictAnalysisItem.titleImage"
                            :check="topItem.violation_level === 1 ? 'check' : 'normal'"
                            v-on:onClickTopItem="predictItemClickHandler"
                        />
                    </v-layout>
                </v-layout>
            </v-flex>
            <v-flex lg8 md8 sm8 :class="['predict-analysis-container__chart']">
                <bar-chart
                    :alarm-type="predictAnalysisItem.alarmType"
                    :analysis-type="predictAnalysisItem.analysisType"
                    :chart-items="datas.chartItems"
                    :chart-id="predictAnalysisItem.id+'chart'"
                    :title="predictAnalysisItem.chartTitle"
                />
            </v-flex>
        </v-layout>
        <predict-modal
            v-if="datas.isOpen"
            :is-open="datas.isOpen"
            :title="predictAnalysisItem.title"
            :chart-title="renderDatePeriod"
            :chart-sub-title="renderPredictBoardModalSubTitle"
            :prev-date="datas.prevDate"
            :chart-options="datas.chartOptions"
            :axis-item="datas.selectedRobotAxisItem"
            :robot-item="datas.selectedRobotItem"
            :predict-type="datas.selectedPredictType"
            :selected-axis="datas.selectedPredictItem.axis - 1"
            @onCloseModal="closePredictModalHandler"
            @setChartLoadParams="getChartItems"
        />
        <atomizer-predict-modal
            v-if="datas.isAtomizerDlgOpen"
            :is-open="datas.isAtomizerDlgOpen"
            :title="predictAnalysisItem.title"
            :chart-title="renderDatePeriod"
            :chart-sub-title="renderPredictBoardModalSubTitle"
            :atomizer-item="datas.selectedRobotAtomizerItem"
            :atomizer-predict-items="datas.predictAtomizerItems"
            :atomizer-type-value="datas.selectedAtomizerTypeValue"
            :atomizer-alarm-list-items="datas.predictAtomizerAlarmListItems"
            @onChangeAtomizerType="changeAtomizerTypeHandler"
            @onCloseModal="closeAtomizerPredictModalHandler"
        />
    </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
import PredictTotalCount from "@/components/home/home/homepartial/predicttotalcount/PredictTotalCount";
import PredictTop from "@/components/home/home/homepartial/predicttop/PredictTop";
import BarChart from "@/components/home/home/chart/barchart/BarChart";
import { convertToBarChartItems } from "@/utils/home";
import PredictModal from "@/components/diagnostics/predict/predict/PredictModal.vue";
import AtomizerPredictModal from "@/components/diagnostics/predict/predict/AtomizerPredictModal.vue";
import {
  getPredictAccumAvgChartItemsAPI,
  getPredictAccumChartItemsAPI,
  getPredictAtomizerAlarmListAPI,
  getPredictAtomizerAlarmStatusItemsAPI,
  getPredictAtomizerChartItemsAPI,
  getPredictAxisAccumAlarmStatusItemsAPI,
  getPredictAxisAlarmStatusItemsAPI,
  getPredictPMTorqueChartItemsAPI,
  getPredictTemperatureChartItemsAPI
} from "@/api/diagnostics/predictAPI";
import {isEmpty} from "lodash";
import {convertToAccumChartItems, convertToChartItems} from "@/utils/diagnostics/predict";
import {convertLevelToIcon} from "@/utils/alarm";
export default {
    components: { PredictTotalCount, PredictTop, BarChart, PredictModal, AtomizerPredictModal },
    props: {
        predictAnalysisItem: {
            type: Object,
            required: true
        }
    },
    data: (vm) => ({
        datas: {
            predictTypeItems: [
                { id: 'robot_name', title: vm.$t('diagnostics.predict.main.predictBoard.predictTableHeaderItems.robotName') },
                { id: 'accum_alarm_status', title: vm.$t('diagnostics.predict.main.predictBoard.predictTableHeaderItems.accumAlarmStatus') },
                { id: 'pmtorque_alarm_status', title: vm.$t('diagnostics.predict.main.predictBoard.predictTableHeaderItems.pmTorqueAlarmStatus') },
                { id: 'temperature_alarm_status', title: vm.$t('diagnostics.predict.main.predictBoard.predictTableHeaderItems.temperatureAlarmStatus') },
                { id: 'atomizer_alarm_status', title: vm.$t('diagnostics.predict.main.predictBoard.predictTableHeaderItems.atomizerAlarmStatus')}
            ],
            atomizerTypeValueItems: [
                { id: 'turbine', title: 'TURBINE', value: 'turbine' },
                { id: 'sa_s', title: 'SA_S', value: 'sa_s' },
                { id: 'sa_v', title: 'SA_V', value: 'sa_v' },
                { id: 'hv', title: 'HIGH-VOLTAGE', value: 'hv' },
                { id: 'alarm', title: 'ALARM', value: 'alarm' }
            ],
            selectedPredictType: '',
            predictAnalysisResultItems: [],
            prevDate: vm.$moment(vm.$moment().subtract(1, 'day').format('YYYY-MM-DD')).subtract("1", "w").format('YYYY-MM-DD'),
            chartOptions: [],
            selectedRobotItem: {},
            selectedRobotAxisItem: {},
            selectedPredictItem: {},
            selectedRobotAtomizerItem: {},
            selectedAtomizerTypeValue: 'turbine',
            predictAtomizerItems: [],
            predictAtomizerAlarmListItems: [],
            chartItems: [],
            totalCountType: 'normal',
            locale: {
                axis: vm.$t('home.main.axis')
            },
            isOpen: false,
            isAtomizerDlgOpen: false,
        }
    }),

    async created() {
        this.datas.predictAnalysisResultItems = await this.getPredictAnalysisResultItems(this.predictAnalysisItem.api);
        this.datas.chartItems = this.convertToChartItems(this.datas.predictAnalysisResultItems);
    },

    mounted() {

    },

    destroyed() {

    },

    computed: {
        ...mapGetters({
            boothInfoItems: 'getRenewBoothInfos',
            zoneInfoItems: 'getRenewZoneInfos',
            robotInfoItems: 'getRenewRobotInfos'
        }),

        renderTotalAlarmCount() {
            return this.datas.predictAnalysisResultItems.length > 0 ? this.getTotalAlarmCount(this.datas.predictAnalysisResultItems) : 0;
        },

        renderTopItems() {
            const topItems = this.getTopItems(this.datas.predictAnalysisResultItems);
            this.datas.totalCountType = this.getTotalCountType(topItems);
            return topItems;
        },

        renderTopItemTitle() {
            return (topItem) => {
                return `${topItem.zone_name}${topItem.robot_name ? (' ' + topItem.robot_name) : ''}${topItem.axis ? (' '+topItem.axis+' ' + this.datas.locale.axis) : ''}`;
            }
        },

        renderDatePeriod() {
            return this.datas.prevDate + ' - ' + this.$moment(this.$moment().subtract(1, 'day').format('YYYY-MM-DD')).format('YYYY-MM-DD');
        },

        renderPredictBoardModalSubTitle() {
            return this.boothInfoItems.filter(boothInfoItem => boothInfoItem.booth_id === this.zoneInfoItems.filter(zoneInfoItem => zoneInfoItem.zone_id === this.datas.selectedPredictItem.zone_id).reduce(item => item).booth_id).reduce(item => item).booth_name + ' ' + this.datas.selectedPredictItem.zone_name + ' ' + this.datas.selectedPredictItem.robot_name;
        },
    },

    methods: {
        async getPredictAnalysisResultItems(api) {
            try {
                const predictAnalysisResultItems = await api;
                return predictAnalysisResultItems.data ? predictAnalysisResultItems.data : [];
            } catch(error) {
                console.error(error);
                return null;
            }
        },

        getTotalAlarmCount(predictAnalysisResultItems) {
            const totalAlarmCount = predictAnalysisResultItems.reduce((sum, { violation_count }) => sum + Number(violation_count), 0);
            return totalAlarmCount !== null ? totalAlarmCount : 0;
        },

        getTopItems(predictAnalysisResultItems) {
            const topItems = predictAnalysisResultItems.length > 0 ? predictAnalysisResultItems.sort((a,b) => b.violation_count - a.violation_count).sort((a,b) => b.violation_level - a.violation_level).filter(predictAnalysisResultItem => {
                    return Number(predictAnalysisResultItem.violation_count) > 0
            }).slice(0, 3) : [];
            return topItems.length === 3 ? topItems : this.getTopEmptyItems(topItems, topItems.length);
        },

        getTopEmptyItems(oldTopItems, length) {
            const topEmptyItems =Array(3- length).fill({ violation_count: 0, violation_level: 0 });
            const newTopEmptyItems = oldTopItems.concat(topEmptyItems);
            return newTopEmptyItems;
        },

        getTotalCountType(topItems) {
            const totalCountType = topItems.some(topItem => topItem.violation_level === 1);
            return totalCountType ? 'check' : 'normal';
        },

        convertToChartItems(predictAnalysisResultItems) {
            const filteredPredictAnalysisResultItems = predictAnalysisResultItems.length > 0 ? predictAnalysisResultItems.sort((a,b) => b.violation_count - a.violation_count).sort((a,b) => b.violation_level - a.violation_level).filter(predictAnalysisResultItem => {
                    return Number(predictAnalysisResultItem.violation_count) > 0;
            }).slice(0, 10) : [];
            const chartItems = filteredPredictAnalysisResultItems.length > 0 ? convertToBarChartItems(filteredPredictAnalysisResultItems, true, function (item) {
                    item.violation_count > 0 && this.predictItemClickHandler(item);
            }.bind(this)) : [];
            return chartItems.reverse();
        },

        predictItemClickHandler(predictItem) {
            this.predictAnalysisItem.predictType === this.datas.predictTypeItems[4].id ? this.setAtomizerPredictItem(predictItem) : this.setPredictItem(predictItem);
        },

        async setPredictItem(predictItem) {
            this.datas.isOpen = true;
            this.$emit('modalStatus', true);
            this.datas.selectedPredictType = this.predictAnalysisItem.predictType ? this.predictAnalysisItem.predictType : '';
            this.datas.selectedPredictItem = predictItem;
            const robotItem = this.robotInfoItems.filter(robotInfoItem => robotInfoItem.robot_id === predictItem.robot_id).reduce(item => item);
            this.datas.selectedRobotItem = robotItem ? robotItem : {};
            const axisItem = this.predictAnalysisItem.predictType === this.datas.predictTypeItems[1].id ? ( robotItem.rc_model_id === 0 || robotItem.tool_id === 2 ?
                await getPredictAxisAlarmStatusItemsAPI({robotId: robotItem.robot_id, axisCount: robotItem.robot_axis, predictType: 'accum_daily_status', prevDate: this.datas.prevDate }) :
                await getPredictAxisAccumAlarmStatusItemsAPI({robotId: robotItem.robot_id, axisCount: robotItem.robot_axis, prevDate: this.datas.prevDate })
            ) :  await getPredictAxisAlarmStatusItemsAPI({robotId: robotItem.robot_id, axisCount: robotItem.robot_axis, predictType: this.datas.selectedPredictType, prevDate: this.datas.prevDate })
            this.datas.selectedRobotAxisItem = axisItem.data.length > 0 && axisItem.data[0];
        },

        async setAtomizerPredictItem(predictItem) {
            this.datas.isAtomizerDlgOpen = true;
            this.datas.selectedPredictType = this.predictAnalysisItem.predictType ? this.predictAnalysisItem.predictType : '';
            this.datas.selectedPredictItem = predictItem;
            const robotItem = this.robotInfoItems.filter(robotInfoItem => robotInfoItem.robot_id === predictItem.robot_id).reduce(item => item);
            this.datas.selectedRobotItem = robotItem ? robotItem : {};
            const atomizerItem = await getPredictAtomizerAlarmStatusItemsAPI({robotId: robotItem.robot_id, prevDate: this.datas.prevDate });
            this.datas.selectedRobotAtomizerItem = atomizerItem.data.length > 0 ? atomizerItem.data[0] : {};
            const warningAtomizerTypeValueItems = Object.keys(this.datas.selectedRobotAtomizerItem).filter(atomizerItemKey => Number(this.datas.selectedRobotAtomizerItem[atomizerItemKey]) === 1);
            this.datas.selectedAtomizerTypeValue = warningAtomizerTypeValueItems.length > 0 ? warningAtomizerTypeValueItems[0] : 'turbine';
            const warningAtomizerTypeNo = warningAtomizerTypeValueItems.length > 0 ? this.datas.atomizerTypeValueItems.findIndex(atomizerTypeValue => atomizerTypeValue.value === warningAtomizerTypeValueItems[0]) : 0;
            const atomizerPredictItems = await getPredictAtomizerChartItemsAPI({ type: this.datas.selectedAtomizerTypeValue, typeNo: warningAtomizerTypeNo, prevDate: this.datas.prevDate, ...robotItem} );
            this.datas.predictAtomizerItems = atomizerPredictItems.data.length > 0 ? atomizerPredictItems.data : [];
            const atomizerAlarmListItems = await getPredictAtomizerAlarmListAPI({ robotId: robotItem.robot_id, prevDate: this.datas.prevDate });
            this.datas.predictAtomizerAlarmListItems = (typeof atomizerAlarmListItems !== 'boolean' && atomizerAlarmListItems.data.length > 0) ? this.setRobotAlarmListItems(atomizerAlarmListItems.data) : [];
        },

        async getChartItems(params) {
            this.predictAnalysisItem.predictType === this.datas.predictTypeItems[1].id && await this.getAccumChartItems(params);
            this.predictAnalysisItem.predictType === this.datas.predictTypeItems[3].id && await this.getTemperatureChartItems(params);
            this.predictAnalysisItem.predictType === this.datas.predictTypeItems[2].id && await this.getPMTorqueChartItems(params);
        },

        async getAccumChartItems(params) {
            const accumChartItems = this.datas.selectedRobotItem.rc_model_id === 0 || this.datas.selectedRobotItem.tool_id === 2 ? await getPredictAccumAvgChartItemsAPI(params) : await getPredictAccumChartItemsAPI(params);
            const chartItems = !isEmpty(accumChartItems.data) ? convertToAccumChartItems(accumChartItems.data): [];
            this.datas.chartOptions = [];
            !isEmpty(chartItems) && chartItems.forEach(chartItem => {
                this.datas.chartOptions.push({ id: 'accum_chart', items: chartItem, valueType: 'torque' } );
            })
        },

        async getTemperatureChartItems(params) {
            const temperatureChartItems = await getPredictTemperatureChartItemsAPI(params);
            const chartItems = !isEmpty(temperatureChartItems.data) ? convertToChartItems(temperatureChartItems.data, 'max_temperature') : {};
            this.datas.chartOptions = [];
            !isEmpty(chartItems) && this.datas.chartOptions.push( { id: 'temperature_chart', items: chartItems, valueType: 'temperature'});
        },

        async getPMTorqueChartItems(params) {
            const pmTorqueChartItems = await getPredictPMTorqueChartItemsAPI(params);
            const chartItems = !isEmpty(pmTorqueChartItems.data) ? convertToChartItems(pmTorqueChartItems.data, 'average') : {};
            this.datas.chartOptions = [];
            !isEmpty(chartItems) && this.datas.chartOptions.push( { id: 'pm_torque_chart', items: chartItems, valueType: 'torque'});
        },

        async changeAtomizerTypeHandler(atomizerTypeItem) {
            const atomizerPredictItems = await getPredictAtomizerChartItemsAPI({ type: atomizerTypeItem.type, typeNo: atomizerTypeItem.typeNo, prevDate: this.datas.prevDate, ...this.datas.selectedRobotItem} );
            this.datas.predictAtomizerItems = atomizerPredictItems.data.length > 0 ? atomizerPredictItems.data : [];
        },

        closePredictModalHandler() {
            this.datas.isOpen = false;
            this.$emit('modalStatus', false);
            this.datas.chartOptions = [];
        },

        closeAtomizerPredictModalHandler() {
            this.datas.isAtomizerDlgOpen = false;
        },

        setRobotAlarmListItems(robotAlarmListItems) {
          return robotAlarmListItems.map(robotAlarmListItem => {
            return { ...robotAlarmListItem, level: convertLevelToIcon(robotAlarmListItem.level) };;
          })
        }
    }
}
</script>

<style scoped lang='scss'>
    @import './PredictAnalysisContainer';
</style>

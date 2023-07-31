<template>
    <v-layout :class="['predict-board']" column fill-height>
        <v-layout :class="['predict-board__title']">
            <p>{{renderBoardTitle}}</p>
        </v-layout>
        <v-layout :class="['predict-board__contents']">
            <table :class="['predict-board__contents-table']">
                <thead>
                    <tr>
                        <th
                            v-for="headerItem in datas.predictTableHeaderItems"
                            :key="headerItem.id"
                        >{{headerItem.title}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="robotItem in sortedRobotItems"
                        :key="robotItem.robot_id"
                    >
                        <td>{{robotItem.robot_name}}</td>
                        <td>
                            <alarm-status-container
                                :component-type="'button'"
                                :alarm-type="renderAlarmType(checkAlarmType(robotItem.accum_alarm_status)? robotItem.accum_alarm_status : 0)"
                                :onClickHandler="()=>{alarmStatusButtonClickHandler(datas.predictTableHeaderItems[1].id, robotItem)}"
                            />
                        </td>
                        <td>
                            <alarm-status-container
                                :component-type="'button'"
                                :alarm-type="renderAlarmType(checkAlarmType(robotItem.pmtorque_alarm_status)? robotItem.pmtorque_alarm_status : 2)"
                                :onClickHandler="()=>{alarmStatusButtonClickHandler(datas.predictTableHeaderItems[2].id, robotItem)}"
                            />
                        </td>
                        <td>
                            <alarm-status-container
                                :component-type="'button'"
                                :alarm-type="renderAlarmType(checkAlarmType(robotItem.temperature_alarm_status)? robotItem.temperature_alarm_status : 0)"
                                :onClickHandler="()=>{alarmStatusButtonClickHandler(datas.predictTableHeaderItems[3].id, robotItem)}"
                            />
                        </td>
                        <td>
                            <alarm-status-container
                                :component-type="'button'"
                                :alarm-type="renderAlarmType(checkAlarmType(robotItem.atomizer_alarm_status)? robotItem.atomizer_alarm_status : 0)"
                                :onClickHandler="()=>{atomizerAlarmStatusButtonClickHandler(datas.predictTableHeaderItems[4].id, robotItem)}"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <predict-modal
                v-if="datas.isOpen"
                :is-open="datas.isOpen"
                :predict-type="datas.selectedPredictType"
                :title="renderPredictBoardModalTitle(datas.selectedPredictType)"
                :chart-title="renderDatePeriod"
                :chart-sub-title="renderPredictBoardModalSubTitle"
                :robot-item="datas.selectedRobotItem"
                :axis-item="datas.selectedRobotAxisItem"
                :selected-axis="datas.selectedRobotAxis"
                :chart-options="datas.chartOptions"
                :prev-date="prevDate"
                @onCloseModal="closePredictModalHandler"
                @setChartLoadParams="getChartItems"
                @setPredictRobotStatusLoadParams="getPredictRobotStatusItems"
            />
            <atomizer-predict-modal
                v-if="datas.isAtomizerDlgOpen"
                :is-open="datas.isAtomizerDlgOpen"
                :title="renderPredictBoardModalTitle(datas.selectedPredictType)"
                :chart-title="renderDatePeriod"
                :chart-sub-title="renderPredictBoardModalSubTitle"
                :atomizer-item="datas.selectedRobotAtomizerItem"
                :atomizer-predict-items="datas.predictAtomizerItems"
                :atomizer-type-value="datas.selectedAtomizerTypeValue"
                :atomizer-alarm-list-items="datas.atomizerAlarmListItems"
                @onChangeAtomizerType="changeAtomizerTypeHandler"
                @onCloseModal="closeAtomizerPredictModalHandler"
            />
        </v-layout>
    </v-layout>
</template>

<script>
import AlarmStatusContainer from "@/commons/alarmstatuscontainer/AlarmStatusContainer";
import PredictModal from "@/components/diagnostics/predict/predict/PredictModal";
import AtomizerPredictModal from "@/components/diagnostics/predict/predict/AtomizerPredictModal";
import {
  getPredictRobotAlarmStatusItemsAPI,
  getPredictAxisAccumAlarmStatusItemsAPI,
  getPredictAxisAlarmStatusItemsAPI,
  getPredictAccumChartItemsAPI,
  getPredictAccumAvgChartItemsAPI,
  getPredictTemperatureChartItemsAPI,
  getPredictPMTorqueChartItemsAPI,
  getPredictAtomizerAlarmStatusItemsAPI,
  getPredictAtomizerChartItemsAPI,
  getPredictAtomizerAlarmListAPI
} from "@/api/diagnostics/predictAPI";
import { convertToChartItems, convertToAccumChartItems } from "@/utils/diagnostics/predict";
import { isEmpty } from "lodash";
import {convertLevelToIcon} from "@/utils/alarm";

// [TODO]: 테스트 데이터, 전체 테스트 후 삭제 예정

export default {
    components: { AlarmStatusContainer, PredictModal, AtomizerPredictModal },
    props: {
        /** 부스 이름 */
        boothName: String,
        /** 이전 날짜 (검색 범위 ) */
        prevDate: {
            type: String,
            required: true
        },
        /** 존 아이템 */
        zoneItem: {
            type: Object,
            required: true
        },
        /** 로봇 아이템 목록 */
        robotItems: {
            type: Array,
            required: true
        }
    },
    data: (vm) => ({
        datas: {
            /** 예지보전 보드 헤더 아이템 목록 */
            predictTableHeaderItems: [
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
            /** 예지보전 보드 아이템 목록 */
            predictTableItems: vm.robotItems? vm.robotItems : [],
            /** 알람 타입 아이템 목록 */
            alarmTypeItems: ['normal', 'alarm', 'default'],
            /** 예지보전 모달 open flag */
            isOpen: false,
            /** 도장기 예지보전 모달 open flag*/
            isAtomizerDlgOpen: false,
            /** 선택된 예지보전 타입 */
            selectedPredictType: '',
            /** 선택된 로봇 아이템 */
            selectedRobotItem: {},
            /** 선택된 로봇 축 아이템 목록 */
            selectedRobotAxisItem: {},
            /** */
            selectedRobotAxis: 0,
            selectedAtomizerTypeValue: 'turbine',
            /** 차트 옵션 */
            chartOptions: [],
            /** 선택된 로봇 도장기 아이템 */
            selectedRobotAtomizerItem: {},
            /** 도장기 상태 경고 아이템 목록 */
            predictAtomizerItems: [],
            /** 도장기 유효 알람 리스트 아이템 */
            atomizerAlarmListItems: []
        }
    }),

    async created() {
        const robotAlarmStatusItems = await this.getRobotAlarmStatusItems(this.zoneItem.zone_id, this.prevDate);
        this.datas.predictTableItems = (Array.isArray(robotAlarmStatusItems.data) && robotAlarmStatusItems.data.length > 0) ? this.setRobotAlarmStatus(this.robotItems, robotAlarmStatusItems.data) : this.robotItems;
    },

    mounted() {
    },

    destroyed() {
    },

    watch: {
        prevDate: {
            async handler(val, oldVal) {
                if ( val !== oldVal ) {
                    const robotAlarmStatusItems = await this.getRobotAlarmStatusItems(this.zoneItem.zone_id, val);
                    this.datas.predictTableItems = (Array.isArray(robotAlarmStatusItems.data) && robotAlarmStatusItems.data.length > 0) ? this.setRobotAlarmStatus(this.robotItems, robotAlarmStatusItems.data) : this.robotItems;
                }
            }
        }
    },

    computed: {
        renderBoardTitle() {
            return this.zoneItem && this.zoneItem.zone_name;
        },

        sortedRobotItems() {
            return this.datas.predictTableItems.sort((prevRobotItem, currRobotItem) => parseInt(prevRobotItem.robot_no) - parseInt(currRobotItem.robot_no) );
        },

        renderPredictBoardModalTitle() {
            return (predictType) => {
                const predictTypeItem = this.datas.predictTableHeaderItems.find(predictTableHeaderItem => predictTableHeaderItem.id === predictType);
                return predictTypeItem.title && predictTypeItem.title;
            }
        },

        renderPredictBoardModalSubTitle() {
            return this.boothName + ' ' + this.zoneItem.zone_name + ' ' + this.datas.selectedRobotItem.robot_name;
        },

        renderDatePeriod() {
            return this.prevDate + ' - ' + this.$moment(this.$moment().subtract(1, 'day').format('YYYY-MM-DD')).format('YYYY-MM-DD');
        },

        checkAlarmType() {
            return (checkAlarmType) => {
                return typeof checkAlarmType === 'number'? true : false;
            }
        },

        renderAlarmType() {
            return (type) => {
                return this.datas.alarmTypeItems[type];
            }
        }
    },

    methods: {
        async getRobotAlarmStatusItems(zoneId, prevDate) {
            const robotAlarmStatusItems = await getPredictRobotAlarmStatusItemsAPI({zoneId: zoneId, prevDate: prevDate});
            return robotAlarmStatusItems ? robotAlarmStatusItems : [];
        },

        setRobotAlarmStatus(robotItems, robotAlarmStatusItems) {
            const predictRobotItems = robotItems.map(robotItem => {
                const robotAlarmStatusItem = robotAlarmStatusItems.find(robotAlarmStatusItem => robotItem.robot_id === robotAlarmStatusItem.robot_id);
                return {...robotItem, ...robotAlarmStatusItem };
            })
            // nx100, 오프너 여기서 구분
            predictRobotItems.forEach(el => {
                el.accum_alarm_status = el.rc_model_id === 0 || el.tool_id === 2 ? el.accum_daily_alarm_status : el.accum_alarm_status
            })
            return predictRobotItems ? predictRobotItems : robotItems;
        },

        async alarmStatusButtonClickHandler(predictType, robotItem) {
            this.datas.selectedPredictType = predictType ? predictType : '';
            this.datas.selectedRobotItem = robotItem ? robotItem : {};
            const axisItem = predictType === this.datas.predictTableHeaderItems[1].id ? ( robotItem.rc_model_id === 0 || robotItem.tool_id === 2 ?
                    await getPredictAxisAlarmStatusItemsAPI({robotId: robotItem.robot_id, axisCount: robotItem.robot_axis, predictType: 'accum_daily_alarm_status', prevDate: this.prevDate }) :
                    await getPredictAxisAccumAlarmStatusItemsAPI({robotId: robotItem.robot_id, axisCount: robotItem.robot_axis, prevDate: this.prevDate })
                ) :  await getPredictAxisAlarmStatusItemsAPI({robotId: robotItem.robot_id, axisCount: robotItem.robot_axis, predictType: predictType, prevDate: this.prevDate })

            this.datas.selectedRobotAxisItem = axisItem.data.length > 0 && axisItem.data[0];
            const warningAxisItems = Object.keys(this.datas.selectedRobotAxisItem).filter(axisKey => Number(this.datas.selectedRobotAxisItem[axisKey]) === 1);
            this.datas.selectedRobotAxis = warningAxisItems.length > 0 ? Object.keys(this.datas.selectedRobotAxisItem).findIndex(axisItem => axisItem === warningAxisItems[0]) : 0;
            this.datas.isOpen = true;
        },

        async atomizerAlarmStatusButtonClickHandler(predictType, robotItem) {
            this.datas.isAtomizerDlgOpen = true;
            this.datas.selectedPredictType = predictType ? predictType : '';
            this.datas.selectedRobotItem = robotItem ? robotItem : {};
            const atomizerItem = await getPredictAtomizerAlarmStatusItemsAPI({ robotId: robotItem.robot_id, prevDate: this.prevDate });
            this.datas.selectedRobotAtomizerItem = atomizerItem.data.length > 0 && atomizerItem.data[0];
            const warningAtomizerTypeValueItems = Object.keys(this.datas.selectedRobotAtomizerItem).filter(atomizerItemKey => Number(this.datas.selectedRobotAtomizerItem[atomizerItemKey]) === 1);
            this.datas.selectedAtomizerTypeValue = warningAtomizerTypeValueItems.length > 0 ? warningAtomizerTypeValueItems[0] : 'turbine';
            const warningAtomizerTypeNo = warningAtomizerTypeValueItems.length > 0 ? this.datas.atomizerTypeValueItems.findIndex(atomizerTypeValue => atomizerTypeValue.value === warningAtomizerTypeValueItems[0]) : 0;
            const atomizerPredictItems = await getPredictAtomizerChartItemsAPI({ type: this.datas.selectedAtomizerTypeValue, typeNo: warningAtomizerTypeNo, prevDate: this.prevDate, ...robotItem} );
            this.datas.predictAtomizerItems = atomizerPredictItems.data.length > 0 ? atomizerPredictItems.data : [];
            const atomizerAlarmListItems = await getPredictAtomizerAlarmListAPI({ robotId: robotItem.robot_id, prevDate: this.prevDate });
            this.datas.atomizerAlarmListItems = (typeof atomizerAlarmListItems !== 'boolean' && atomizerAlarmListItems.data.length > 0) ? this.setRobotAlarmListItems(atomizerAlarmListItems.data) : [];
        },

        closePredictModalHandler() {
            this.datas.isOpen = false;
            this.datas.chartOptions = [];
        },

        closeAtomizerPredictModalHandler() {
            this.datas.isAtomizerDlgOpen = false;
        },

        async changeAtomizerTypeHandler(atomizerTypeItem) {
            const atomizerPredictItems = await getPredictAtomizerChartItemsAPI({ type: atomizerTypeItem.type, typeNo: atomizerTypeItem.typeNo, prevDate: this.prevDate, ...this.datas.selectedRobotItem} );
            this.datas.predictAtomizerItems = atomizerPredictItems.data.length > 0 ? atomizerPredictItems.data : [];
        },

        async getChartItems(params) {
            params.predictType === this.datas.predictTableHeaderItems[1].id && await this.getAccumChartItems(params);
            params.predictType === this.datas.predictTableHeaderItems[3].id && await this.getTemperatureChartItems(params);
            params.predictType === this.datas.predictTableHeaderItems[2].id && await this.getPMTorqueChartItems(params);
        },

        async getAccumChartItems(params) {
            const accumChartItems = params.rc_model_id === 0 || params.tool_id === 2 ? await getPredictAccumAvgChartItemsAPI(params) : await getPredictAccumChartItemsAPI(params);
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

        async getPredictRobotStatusItems(params) {
            const axisItem = params.predictType === this.datas.predictTableHeaderItems[1].id ? await getPredictAxisAccumAlarmStatusItemsAPI({robotId: this.datas.selectedRobotItem.robot_id, axisCount: this.datas.selectedRobotItem.robot_axis, prevDate: params.prevDate }) :
                await getPredictAxisAlarmStatusItemsAPI({robotId: this.datas.selectedRobotItem.robot_id, axisCount: this.datas.selectedRobotItem.robot_axis, predictType: params.predictType, prevDate: params.prevDate })
            this.datas.selectedRobotAxisItem = {};
            this.datas.selectedRobotAxisItem = axisItem.data.length > 0 && axisItem.data[0];
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
@import './PredictBoard';
</style>

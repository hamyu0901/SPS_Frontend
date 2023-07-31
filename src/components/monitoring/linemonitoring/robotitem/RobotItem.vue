<template>
    <v-layout :class="['robot-item']" column :style="datas.styleObject">
        <button
          :class="['robot-item-button']"
          v-if="datas.robotItem.robot_id"
          @click="robotClickHandler"
        >
            <v-icon :color="renderAlarmStatus">fiber_manual_record</v-icon>
            <img
              v-if="renderRobotImg"
              :alt="'robot image'"
              :src="renderRobotImg"
            />
        </button>

        <base-modal v-model="datas.isOpen" :title="ui.title.robotInfo" :is-open="datas.isOpen" :width="1500" @onCloseModal="closeModalHandler" :class="['robot-item__modal']">
            <v-layout :class="['robot-item__modal__top']">
                <v-flex :class="['robot-item__modal__top__info']">
                    <robot-info
                        :isOpen="datas.isOpen"
                        :robotItem="robotItem"
                        :zoneName="datas.zoneName"
                    />
                </v-flex>
                <v-flex :class="['robot-item__modal__top__alarm-list']">
                    <robot-alarm-list
                        :alarmItem="datas.robotAlarmItems"
                    />
                </v-flex>
            </v-layout>
            <v-layout :class="['robot-item__modal__middle']">
                <robot-predict-status-board
                    :robotItem="robotItem"
                    :robot-status-items="datas.robotAlarmStatusItems"
                    :table-header-items="datas.predictTableHeaderItems"
                    :predictType="datas.selectedPredictType"
                    @onStatusButtonClickHandler="alarmStatusButtonClickHandler"
                />
            </v-layout>
            <v-layout :class="['robot-item__modal__bottom']">
                <robot-predict-chart-board
                    v-if="datas.selectedPredictType !== 'atomizer_alarm_status'"
                    :robotItem="robotItem"
                    :axis-item="datas.selectedRobotAxisItem"
                    :predictType="datas.selectedPredictType"
                    @setChartLoadParams="getChartItems"
                    :chartOptions="datas.chartOptions"
                    :selectedAxis="datas.selectedAxis"
                    :chart-title="renderDatePeriod"
                    :chart-sub-title="renderPredictBoardModalSubTitle"
                    :title="datas.title"
                />
            </v-layout>
            <v-layout :class="['robot-item__modal__bottom']">
                <robot-atomizer-chart-board
                    v-if="datas.selectedPredictType === 'atomizer_alarm_status'"
                    :title="datas.title"
                    :atomizer-item="datas.selectedRobotAtomizerItem"
                    :atomizer-type-value="datas.selectedAtomizerType"
                    :atomizer-predict-items="datas.predictAtomizerItems"
                    @onChangeAtomizerType="changeAtomizerTypeHandler"
                    :chart-title="renderDatePeriod"
                    :chart-sub-title="renderPredictBoardModalSubTitle"
                    :atomizer-alarm-list-items="datas.atomizerAlarmListItems"
                />

            </v-layout>
        </base-modal>
    </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
import { getRobotImg } from '@/utils/monitoring';
import BaseModal from '@/commons/basemodal/BaseModal';
import RobotInfo from '../robotInfo/RobotInfo.vue';
import RobotAlarmList from '../robotalarmlist/RobotAlarmList';
import RobotPredictStatusBoard from '../robotpredictstatus/RobotPredictStatusBoard';
import RobotPredictChartBoard from  '../robotpredictchart/RobotPredictChartBoard';
import RobotAtomizerChartBoard from "../robotatomizerchart/RobotAtomizerChartBoard.vue";
import { getLineRobotAlarmItemAPI} from '@/api/monitoringAPI'
import {
    getPredictRobotAlarmStatusItemsAPI,
    getPredictAxisAlarmStatusItemsAPI,
    getPredictAxisAccumAlarmStatusItemsAPI,
    getPredictAccumChartItemsAPI,
    getPredictAccumAvgChartItemsAPI,
    getPredictTemperatureChartItemsAPI,
    getPredictPMTorqueChartItemsAPI,
    getPredictAtomizerAlarmStatusItemsAPI,
    getPredictAtomizerChartItemsAPI,
    getPredictAtomizerAlarmListAPI

} from "@/api/diagnostics/predictAPI";

import { convertToChartItems, convertToAccumChartItems } from "@/utils/diagnostics/predict";
import { convertLevelToIcon } from "@/utils/alarm";

import { isEmpty } from 'lodash';

export default {
    components: { BaseModal, RobotInfo, RobotAlarmList, RobotPredictStatusBoard, RobotPredictChartBoard, RobotAtomizerChartBoard},
    props: {
        /** 로봇 아이템 */
        /** robotItem: {
            alarm_status, // 알람 유무
            pp_mode, // 로봇 모드 값
            rc_model_name, // 컨트롤러 이름
            robot_axis, // 로봇 축 수
            robot_id, // 로봇 id
            robot_ip, // 로봇 ip 주소
            robot_model_name, // 로봇 모델 이름
            robot_name, // 로봇 이름
            robot_no, // 로봇 위치
            robot_status, // 로봇 상태 값
            tool_id, // tool id
            zone_id // zone id
        } */
        robotItem: {
            type: Object,
        },
        /** 로봇 최대 수 */
        robotMaxCount: Number,
        /** 부스 이름 */
        boothName: String,
        /** 존 이름 */
        zoneName: String
    },

    data: vm => ({
        ui: {
            title : {
                robotInfo : vm.$t('monitoring.line.robotItem.robotInfo.title'),
                empty : vm.$t('monitoring.line.robotItem.robotInfo.empty'),
            }
        },
        datas: {
            /** 로봇 정보 */
            robotItem: vm.robotItem,
            /** 부스 이름 */
            boothName: vm.boothName ? vm.boothName : "",
            /** 존 이름 */
            zoneName: vm.zoneName ? vm.zoneName : "",
            /** render 목적으로 사용하기 위한 타입 정의 */
            robotStatusType: ['offline', 'standby', 'normal', 'standby', 'alarm', 'error', 'error'],
            /** 로봇 영역 사이즈 조절 관련 스타일 객체*/
            styleObject: {
                maxWidth: 300 / Math.round(vm.robotMaxCount) + 'px'
            },
            /** 알람 발생 여부 관련 색상 값 */
            alarmStatusColorItems: {
                alarm: '#EF4C28',
                normal: '#41BD4D'
            },
            /** 다이얼로그 상태 값 */
            isOpen: false,
            /** 다이얼로그 버튼 값 */
            dialogCardItems: [
                {id: 'zone', title: vm.$t('monitoring.line.robotItem.dialogCardItems.title.zone'), href: `/sps/monitoring/detail/zone/${vm.robotItem.zone_id}`},
                /** 예지 보전 기능 구현 시, 변경 예정 */
                {id: 'predict', title: vm.$t('monitoring.line.robotItem.dialogCardItems.title.predict'), href: '/sps/diagnostics/predict'},
                /** 유지 보수 기능 구현 시, 변경 예정*/
                {id: 'maintenance', title: vm.$t('monitoring.line.robotItem.dialogCardItems.title.maintenance'), href: '/sps/maintenance'}
            ],
            locale: {
                modalTitle: vm.$t('monitoring.line.robotItem.modalTitle')
            },
            selectedPredictType: '',
            predictTableHeaderItems: [
                { id: 'robot_name', title: vm.$t('diagnostics.predict.main.predictBoard.predictTableHeaderItems.robotName') },
                { id: 'accum_alarm_status', title: vm.$t('diagnostics.predict.main.predictBoard.predictTableHeaderItems.accumAlarmStatus') },
                { id: 'pmtorque_alarm_status', title: vm.$t('diagnostics.predict.main.predictBoard.predictTableHeaderItems.pmTorqueAlarmStatus') },
                { id: 'temperature_alarm_status', title: vm.$t('diagnostics.predict.main.predictBoard.predictTableHeaderItems.temperatureAlarmStatus') },
                { id: 'atomizer_alarm_status', title: vm.$t('diagnostics.predict.main.predictBoard.predictTableHeaderItems.atomizerAlarmStatus')},
            ],

            predictTypeItems : ['accum_alarm_status', 'pmtorque_alarm_status', 'temperature_alarm_status', 'atomizer_alarm_status','accum_daily_alarm_status'],
            robotAlarmItems: [],
            robotAlarmStatusItems: [],
            selectedRobotAxisItem: {},
            selectedRobotAtomizerItem: {},
            predictAtomizerItems: [],
            chartOptions: [],
            fixedDate: vm.$moment().subtract(1, 'day').format('YYYY-MM-DD'),
            prevDate: vm.$moment(vm.$moment().subtract(1, 'day').format('YYYY-MM-DD')).subtract("1", "w").format('YYYY-MM-DD'),
            selectedAxis : 0,
            selectedAtomizerType : '',
            title : '',
            /** 도장기 유효 알람 리스트 아이템 */
            atomizerAlarmListItems: []
       }
    }),

    created() {
        this.subscribeRobotStatus();
    },

    destroyed() {
        this.unsubscribeRobotStatus();
    },

    mounted() {

    },

    sockets: {

    },

    computed: {
        ...mapGetters({
            robotPartItems: 'getRobotPartItems',
        }),

        renderRobotImg() {
            return getRobotImg(this.datas.robotItem.tool_id, this.datas.robotItem.robot_status);
        },

        renderAlarmStatus() {
            /** alarm_status 0 또는 값이 null 경우가 정상이며 alarm_status 1이면 알람 발생 상태로 구현 */
            return this.datas.robotItem.alarm_status === 0 || this.datas.robotItem.alarm_status === null ? this.datas.alarmStatusColorItems.normal : this.datas.alarmStatusColorItems.alarm;
        },

        renderDatePeriod(){
            return `${this.datas.prevDate}` + ' - ' + `${this.datas.fixedDate}`;
        },

        renderPredictBoardModalSubTitle(){
            return this.datas.boothName + ' ' + this.datas.zoneName + ' ' + this.robotItem.robot_name;
        }
    },

    methods: {
        subscribeRobotStatus() {
            this.sockets.subscribe('robot_status', data => {
                this.datas.robotItem.robot_status = this.datas.robotItem.robot_id === data.robot_id ? data.robot_status : this.datas.robotItem.robot_status;
            })
        },
        unsubscribeRobotStatus() {
            this.sockets.unsubscribe('robot_status');
        },
        async robotClickHandler() {
            this.datas.isOpen = true;
            this.getRobotAlarm();
            await this.getRobotPredictStatus();
            this.datas.selectedPredictType !== 'atomizer_alarm_status'  ?  this.getAxisStatus() : this.getAtomizerStatus();

            // [TODO] 로봇 선택 시, 로봇 다이얼로그 출력
        },

        async getRobotAlarm(){
            const robotAlarmInfoItem = await getLineRobotAlarmItemAPI({
                robot_id : this.datas.robotItem.robot_id,
                start_date : `${this.$moment(new Date()).subtract("1", "w").format('YYYY-MM-DD')}`, // 오늘부터 일주일 전
                end_date : `${this.$moment(new Date()).format('YYYY-MM-DD')} 23:59:59`, // 오늘
            })

            this.datas.robotAlarmItems = robotAlarmInfoItem && !isEmpty(robotAlarmInfoItem.data) ? (robotAlarmInfoItem.data.forEach(alarmInfoItem => {
                alarmInfoItem.axis = alarmInfoItem.disp_alarm_axis ?  alarmInfoItem.axis_info.map((axisInfo, axisIndex) => axisInfo === 1 ? axisIndex+1 : '').filter(String) : this.ui.title.empty;
                alarmInfoItem.parts = !isEmpty(alarmInfoItem.match_parts) ? this.getPartItems(alarmInfoItem.match_parts) : this.ui.title.empty
            }), robotAlarmInfoItem.data) : []

        },

        async getRobotPredictStatus(){
            const robotAlarmStatusItems = await getPredictRobotAlarmStatusItemsAPI({zoneId: this.datas.robotItem.zone_id, prevDate: `${this.datas.prevDate}}`});
            this.datas.robotAlarmStatusItems = robotAlarmStatusItems && !isEmpty(robotAlarmStatusItems.data) && robotAlarmStatusItems.data.filter(robotAlarmStatusItem => robotAlarmStatusItem.robot_id === this.datas.robotItem.robot_id)
            const standardkey = (this.robotItem.rc_model_id === 0 || this.robotItem.tool_id === 2) ? 'accum_daily_alarm_status' : 'accum_alarm_status'
            const typeKey = !isEmpty(this.datas.robotAlarmStatusItems) && Object.keys(this.datas.robotAlarmStatusItems[0]).find(key => key !== 'robot_id' && this.datas.robotAlarmStatusItems[0][key] === 1)
            this.datas.selectedPredictType = typeKey ? typeKey : standardkey
            this.datas.title = this.setBoardTitle(this.datas.selectedPredictType)
        },

        async getAxisStatus(){
            const axisItem = (this.datas.selectedPredictType === 'accum_alarm_status') ? await getPredictAxisAccumAlarmStatusItemsAPI({robotId: this.robotItem.robot_id, axisCount: this.robotItem.robot_axis, predictType: this.datas.selectedPredictType, prevDate: `${this.datas.prevDate}` })
            : await getPredictAxisAlarmStatusItemsAPI({robotId: this.robotItem.robot_id, axisCount: this.robotItem.robot_axis, predictType: this.datas.selectedPredictType, prevDate: `${this.datas.prevDate}` })
            this.datas.selectedRobotAxisItem = axisItem.data.length > 0 && axisItem.data[0];
            this.datas.selectedAxis = Object.values(this.datas.selectedRobotAxisItem).findIndex(axisItem => Number(axisItem) === 1) === -1 ? 0 : Object.values(this.datas.selectedRobotAxisItem).findIndex(axisItem => Number(axisItem) === 1)
            await this.getChartItems({
                axis : this.datas.selectedAxis,
                predictType : this.datas.selectedPredictType,
                robotId : this.robotItem.robot_id,
                rc_model_id : this.robotItem.rc_model_id,
                tool_id : this.robotItem.tool_id
            });
        },

        async getAtomizerStatus(){
            const atomizerItem = await getPredictAtomizerAlarmStatusItemsAPI({robotId: this.robotItem.robot_id, prevDate: `${this.datas.prevDate}` });
            this.datas.selectedRobotAtomizerItem = atomizerItem.data.length > 0 && atomizerItem.data[0];
            const typeKey = Object.keys(this.datas.selectedRobotAtomizerItem).find(key => Number(this.datas.selectedRobotAtomizerItem[key]) === 1)
            const typeNo = Object.keys(this.datas.selectedRobotAtomizerItem).findIndex(key => Number(this.datas.selectedRobotAtomizerItem[key]) === 1)
            this.datas.selectedAtomizerType = typeKey ? typeKey : 'turbine'
            const atomizerPredictItems = await getPredictAtomizerChartItemsAPI({ type: this.datas.selectedAtomizerType, typeNo: typeNo === -1 ? 0 : typeNo , prevDate: `${this.datas.prevDate}`, ...this.robotItem} );
            this.datas.predictAtomizerItems = atomizerPredictItems.data.length > 0 ? atomizerPredictItems.data : [];
            const atomizerAlarmListItems = typeNo === 4 && await getPredictAtomizerAlarmListAPI({ robotId: this.robotItem.robot_id, prevDate: this.datas.prevDate });
            this.datas.atomizerAlarmListItems = (typeof atomizerAlarmListItems !== 'boolean' && atomizerAlarmListItems.data.length > 0) ? this.setRobotAlarmListItems(atomizerAlarmListItems.data) : [];
        },

        async alarmStatusButtonClickHandler(item) {
            this.datas.selectedPredictType = item.predictType ? item.predictType : '';
            this.datas.title = this.setBoardTitle(this.datas.selectedPredictType)
            this.datas.selectedPredictType !== 'atomizer_alarm_status'  ? await this.getAxisStatus() : await this.getAtomizerStatus();
        },

        getPartItems(matchParts) {
            return matchParts.map(matchPart => {
                const partItem = this.robotPartItems.filter(robotPartItem => robotPartItem.part_id === matchPart);
                return { item: partItem[0].part_name, level: partItem[0].part_level }
            })
        },

        async getChartItems(params) {
            this.datas.selectedAxis = params.axis
            Object.assign(params, {prevDate : `${this.datas.prevDate}`})
            if(params.predictType === this.datas.predictTypeItems[0] || params.predictType === this.datas.predictTypeItems[4]) await this.getAccumChartItems(params)
            params.predictType === this.datas.predictTypeItems[2] && await this.getTemperatureChartItems(params);
            params.predictType === this.datas.predictTypeItems[1] && await this.getPMTorqueChartItems(params);
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

        setBoardTitle(predictType){
            if(predictType === 'accum_alarm_status' || predictType === 'accum_daily_alarm_status'){
                return this.datas.predictTableHeaderItems[1].title
            }else{
                const predictTypeItem = this.datas.predictTableHeaderItems.find(predictTableHeaderItem => predictTableHeaderItem.id === predictType);
                return predictTypeItem.title && predictTypeItem.title;
            }
        },

        async changeAtomizerTypeHandler(atomizerTypeItem) {
            const atomizerPredictItems = await getPredictAtomizerChartItemsAPI({ type: atomizerTypeItem.type, typeNo: atomizerTypeItem.typeNo, prevDate: `${this.datas.prevDate}`, ...this.robotItem} );
            this.datas.predictAtomizerItems = atomizerPredictItems.data.length > 0 ? atomizerPredictItems.data : [];
            const atomizerAlarmListItems = atomizerTypeItem.typeNo === 4 && await getPredictAtomizerAlarmListAPI({ robotId: this.robotItem.robot_id, prevDate: this.datas.prevDate });
            this.datas.atomizerAlarmListItems = (typeof atomizerAlarmListItems !== 'boolean' && atomizerAlarmListItems.data.length > 0) ? this.setRobotAlarmListItems(atomizerAlarmListItems.data) : [];
        },

        setRobotAlarmListItems(robotAlarmListItems) {
            return robotAlarmListItems.map(robotAlarmListItem => {
                return { ...robotAlarmListItem, level: convertLevelToIcon(robotAlarmListItem.level) };
            })
        },

        closeModalHandler() {
            this.datas.isOpen = false;
            this.datas.chartOptions = [];
            this.datas.predictAtomizerItems = [];
        }
    }
}
</script>

<style scoped lang='scss'>
    @import './RobotItem.scss';
</style>

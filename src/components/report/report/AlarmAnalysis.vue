<template>
    <div>
        <v-layout class="box">
            <v-flex class="calendarbox">
                <v-text-field
                    v-model="datas.date"
                    disabled
                    outline
                    append-icon="mdi-calendar"
                    hide-details
                >
                </v-text-field>
            </v-flex>
            <v-flex class="selectbox pl-2">
                <alarm-level-selector
                    v-show="!btnBoolean"
                    v-on:clickAlarmLevel="clickAlarmLevel"
                    v-bind:selectedAlarmLevel="selectedAlarmLevel"
                />
            </v-flex>
        </v-layout>
        <v-layout>
            <date-aggregation-dlg
                v-bind:priorityFlag="this.datas.alarmDigIsOpen"
                v-bind:datePeriod="[datas.alarmDate, datas.alarmDate]"
                v-bind:alarmCodeDatas="datas.alarmCodeDatas"
                v-bind:alarmNameDatas="datas.alarmNameDatas"
                v-bind:dateAggregationDatas="datas.dateAggregationDatas"
                v-on:changePriorityFlag="datas.alarmDigIsOpen=false"
            ></date-aggregation-dlg>
            <robot-alarm-modal
                :title="ui.robotAlarmDlgTitle"
                :is-open="datas.isRobotAlarmDlgOpen"
                :info-items="datas.robotInfoItems"
                :torque-items="datas.robotTorqueItems"
                :accum-trend-items="datas.robotAccumTrendItems"
                :accum-gap-items="datas.robotAccumGapItems"
                :temperature-trend-items="datas.robotTemperatureTrendItems"
                :temperature-gap-items="datas.robotTemperatureGapItems"
                v-on:onCloseModal="datas.isRobotAlarmDlgOpen = false"
            />
            <atomizer-alarm-modal
                :title="ui.atomizerAlarmDlgTitle"
                :is-open="datas.isAtomizerAlarmDlgOpen"
                :info-items="datas.atomizerInfoItems"
                :trend-items="datas.atomizerTrendItems"
                :list-items="datas.atomizerListItems"
                :entire-list-items="datas.atomizerEntireListItems"
                v-on:onClickAtomizerListItem="getClickedAtomizerListItem"
                v-on:onCloseModal="datas.isAtomizerAlarmDlgOpen = false"
            />
            <v-dialog v-model="datas.isLoadingDlgOpen" hide-overlay persistent width="300">
                <v-card color="indigo" dark>
                    <v-card-text>
                        Loading...
                        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <v-flex class="ml-2">
                <alarm-name-table
                    v-bind:title="alarmNameContents.zone.title"
                    v-bind:header="alarmNameContents.zone.listHeader"
                    v-bind:type="'zone'"
                    v-bind:alarmNameData="zoneAlarmNameData"
                    v-on:clickAllCheckBox="clickAllCheckBox"
                    v-on:clickRowCheckBox="clickRowCheckBox"
                    v-on:clickItem="clickItem"
                    v-bind:exportFlag="false"
                />
            </v-flex>
            <v-flex class="ml-2">
                <alarm-name-table
                    v-bind:title="alarmNameContents.robot.title"
                    v-bind:header="alarmNameContents.robot.listHeader"
                    v-bind:type="'robot'"
                    v-bind:alarmNameData="robotAlarmNameData"
                    v-on:clickAllCheckBox="clickAllCheckBox"
                    v-on:clickRowCheckBox="clickRowCheckBox"
                    v-on:clickItem="clickItem"
                    v-bind:exportFlag="false"
                />
            </v-flex>
        </v-layout>
        <v-card class="middleCard">
            <v-layout>
                <v-flex class="middleCardTitle">
                    <p>{{ui.title.selectedAlarmList}}</p>
                </v-flex>
                <v-flex class="middleCardIcon"><v-icon>mdi-arrow-down</v-icon></v-flex>
            </v-layout>
        </v-card>

        <div class="alarmlisttable" >
            <alarm-select-table
                v-bind:headerData="alarmListContents"
                v-bind:contentData="datas.alarm"
                v-on:clickedItem="clickedItemHandler"
            />
        </div>
    </div>

</template>
<script>
import {
    atomizerEntireListAPI,
    atomizerInfoAPI,
    atomizerListAPI,
    atomizerTrendAPI,
    robotAccumGapAPI,
    robotAccumTrendAPI,
    robotInfoAPI,
    robotTemperatureGapAPI,
    robotTemperatureTrendAPI,
    robotTorqueAPI
} from "@/api/alarmAPI";

function deepClone(obj) {
    if (obj === null || typeof obj !== "object") {
        return obj
    }

    const result = Array.isArray(obj) ? [] : {}

    for (let key of Object.keys(obj)) {
        result[key] = deepClone(obj[key])
    }

    return result
}
import AlarmNameTable from '@/components/report/report/AlarmNameTable'
import AlarmLevelSelector from '@/components/report/report/AlarmLevelSelector'
import AlarmSelectTable from '@/components/report/report/AlarmSelectTable'
import DateAggregationDlg from "@/components/diagnostics/alarmstatistics/alarmstatistics/DateAggregationDlg";
import RobotAlarmModal from "@/commons/alarm/robotalarmmodal/RobotAlarmModal";
import AtomizerAlarmModal from "@/commons/alarm/atomizeralarmmodal/AtomizerAlarmModal";

export default {
    props: [
        'selectedZoneReport',
        'zoneAlarmNameData',
        'robotAlarmNameData',
        'alarmNameContents',
        'zoneAlarm',
        'robotAlarm',
        'alarmListContents',
        'selectedAlarm',
        'btnBoolean',
        'selectedAlarmLevel'
    ],
    /** selectedZoneReport : type: Array / 선택한 리포트 */
    /** zoneAlarmNameData: type: Array / 존 발생 알람명 Data/
    /** robotAlarmNameData : type: Array / 로봇 발생 알람명 Data/
    /** alarmNameContents : type: Object / Table card title, header data */
    /** zoneAlarm: type: Array / 존 알람 */
    /** robotAlarm : type: Array / 로봇 알람*/
    /** alarmListContents : type: Array / 선택한 알람 테이블 header*/
    /** selectedAlarm: type: Array / 선택한 알람 */
    /** btnBoolean : type: boolean / 위험도 선택 유무*/
    /** selectedAlarmLevel : type: String / 하드웨어 리포트인지 알람 리포트인지 구분*/

    components: {
        AlarmNameTable,
        AlarmLevelSelector,
        AlarmSelectTable,
        DateAggregationDlg,
        RobotAlarmModal,
        AtomizerAlarmModal
    },
    data(){
        return{
            ui : {
                title: {
                    selectedAlarmList: this.$t(`report.alarm.title.selectedAlarmList`)
                },
                robotAlarmDlgTitle: '로봇 알람 상세',
                atomizerAlarmDlgTitle: '도장기 알람 상세'
            },
            datas: {
                alarm : [],
                test: [],
                zoneAlarmNameCheck: null,
                robotAlarmNameCheck: null,
                zoneAlarmName: [],
                robotAlarmName: [],
                date: null,

                alarmDate: null,
                alarmCodeDatas: [],
                alarmNameDatas: [],
                dateAggregationDatas: [],
                alarmDigIsOpen: false, // 다이얼로그 boolean
                isRobotAlarmDlgOpen: false,
                isAtomizerAlarmDlgOpen: false,
                isLoadingDlgOpen: false,
                robotInfoItems: [],
                robotTorqueItems: [],
                robotAccumTrendItems: [],
                robotTemperatureTrendItems: [],
                robotAccumGapItems: [],
                robotTemperatureGapItems: [],
                atomizerInfoItems: [],
                atomizerTrendItems: [],
                atomizerListItems: [],
                atomizerEntireListItems: []
            }
        }
    },
    mounted(){
        this.datas.date = this.selectedZoneReport.length > 0 ? `${this.selectedZoneReport[0].start_date} ~ ${this.selectedZoneReport[0].end_date}` : null
        this.datas.alarm = deepClone(this.selectedAlarm)
    },
    destroyed() {

    },
    watch: {
        selectedZoneReport(){
            this.datas.date = this.selectedZoneReport.length > 0 ? `${this.selectedZoneReport[0].start_date} ~ ${this.selectedZoneReport[0].end_date}` : null
        },
        selectedAlarm(){
            this.datas.alarm = deepClone(this.selectedAlarm)
        },
    },
    methods: {
        initData(){
            this.datas.zoneAlarmName = [];
            this.datas.robotAlarmName = [];
            this.datas.zoneAlarmNameCheck = null;
            this.datas.robotAlarmNameCheck = null;
        },

        clickItem(item){
            this.$emit('clickItem', item)
        },

        clickAlarmLevel(alarmlevel){
            this.$emit('clickAlarmLevel', alarmlevel)
        },

        setLoadingDialog(flag) {
            this.datas.isLoadingDlgOpen = flag;
        },

        clickRowCheckBox(alarmInfo){
            this.initData();
            // if(this.alarm.length > 0){
                if(alarmInfo.type === 'zone'){
                    this.setZoneAlarm(alarmInfo);
                }
                else{
                    this.setRobotAlarm(alarmInfo)
                }
                this.$emit('clickCheckBox', {
                    data : this.datas.alarm,
                    zoneNameData: this.datas.zoneAlarmName,
                    zoneHeader: this.datas.zoneAlarmNameCheck,
                    robotNameData: this.datas.robotAlarmName,
                    robotHeader: this.datas.robotAlarmNameCheck
                })
            // }

        },
        clickAllCheckBox(alarmInfo){
            this.initData();
            // if(this.alarm.length > 0){
                if(alarmInfo.type === 'zone'){
                    this.setZoneAlarm(alarmInfo);
                }
                else{
                    this.setRobotAlarm(alarmInfo);
                }
                this.$emit('clickCheckBox', {
                    data : this.datas.alarm,
                    zoneNameData: this.datas.zoneAlarmName,
                    zoneHeader: this.datas.zoneAlarmNameCheck,
                    robotNameData: this.datas.robotAlarmName,
                    robotHeader: this.datas.robotAlarmNameCheck
                })
            // }

        },
        setZoneAlarm(alarmInfo){
            if(alarmInfo.checkbox === 'all'){
                if(alarmInfo.header.check === 'false'){
                    this.datas.alarm = this.datas.alarm.filter(item => item.type_id === 0)
                }else{
                    this.datas.alarm = this.datas.alarm.filter(item => item.type_id === 0) // 원래 기존에 있던 zone_alarm들 없애고 추가
                    this.zoneAlarm.forEach(el => {
                        this.datas.alarm.push(el)
                    })
                }
            }else{
                if(alarmInfo.row.check === 'true'){
                    let boolean = false;
                    this.datas.alarm.forEach(item => { // 중복 확인
                        if((item.alarm_code === alarmInfo.row.alarm_code && item.type_id === alarmInfo.row.type_id && item.alarm_name === alarmInfo.row.alarm_name)){
                            boolean = true
                        }
                    })
                    this.zoneAlarm.forEach(el => {
                        if(boolean === false){
                            if(el.alarm_code === alarmInfo.row.alarm_code && el.type_id === alarmInfo.row.type_id && el.alarm_name === alarmInfo.row.alarm_name){
                                this.datas.alarm.push(el)
                            }
                        }
                    })
                }else{
                    this.datas.alarm = this.datas.alarm.filter(el => !(el.alarm_code == alarmInfo.row.alarm_code && el.type_id == alarmInfo.row.type_id && el.alarm_name == alarmInfo.row.alarm_name))
                }
            }
            this.datas.zoneAlarmName = deepClone(alarmInfo.data)
            if(alarmInfo.header.check === 'true'){
                this.datas.zoneAlarmNameCheck = 'true'
            }else{
                this.datas.zoneAlarmNameCheck = 'false'
            }
        },
        setRobotAlarm(alarmInfo){
            if(alarmInfo.checkbox === 'all'){
                if(alarmInfo.header.check === 'false'){
                    this.datas.alarm = this.datas.alarm.filter(item => item.type_id !== 0)

                }else{
                    this.datas.alarm = this.datas.alarm.filter(item => item.type_id !== 0)
                    this.robotAlarm.forEach(el => {
                        this.datas.alarm.push(el)
                    })
                }
            }
            else{
                if(alarmInfo.row.check === 'true'){
                    let boolean = false;
                    this.datas.alarm.forEach(item => {
                        if((item.alarm_code === alarmInfo.row.alarm_code && item.robot_id === alarmInfo.row.robot_id && item.alarm_name === alarmInfo.row.alarm_name)){
                            boolean = true
                        }
                    })
                    this.robotAlarm.forEach(el => {
                        if(boolean === false){
                            if(el.alarm_code === alarmInfo.row.alarm_code && el.robot_id === alarmInfo.row.robot_id && el.alarm_name == alarmInfo.row.alarm_name){
                                this.datas.alarm.push(el)
                            }
                        }
                    })
                }else{
                    this.datas.alarm = this.datas.alarm.filter(el => !(el.alarm_code == alarmInfo.row.alarm_code && el.robot_id == alarmInfo.row.robot_id && el.alarm_name == alarmInfo.row.alarm_name))
                }
            }
            this.datas.robotAlarmName = deepClone(alarmInfo.data)
            if(alarmInfo.header.check === 'true'){
                this.datas.robotAlarmNameCheck = 'true'
            }else{
                this.datas.robotAlarmNameCheck = 'false'
            }
        },

        checkAlarmType(item) {
            if( item.type_id === 2 ) {
                this.getAtomizerAlarmItems(item);
            } else if (item.type_id === 0 && item.disp_alarm_axis) {
                this.getRobotAlarmItems(item);
            } else {
                this.datas.alarmDate = this.$moment(item.time_stamp).format('YYYY-MM-DD');
                this.datas.alarmDigIsOpen = true;
                this.getAlarmCodeDatas(item);
                this.getAlarmNameDatas(item);
                this.getDateAggregationDatas(item);
                this.setLoadingDialog(false);
            }
        },

        getAlarmCodeDatas(item) {
            //alarmcode
            //output: alarm_name
            let postDatas = {};
            this.datas.alarmCodeDatas = [];
            //renew
            this.datas.alarmCodeDatas = []
            this.$http.post(`/diagnostics/alarmstatistics/data/gridtable/statistics/renew/alarm/code`, {
                data : item
            })
                .then((res) => {
                    if(res.data == '') {
                        this.$popmsg(this.$t(`diagnostics.alarmstatistics.popMsg.alarmStatisticsAlarmCode`));
                    }
                    else {
                        res.data['alarm_code'] = item.alarm_code;
                        this.datas.alarmCodeDatas = res.data;
                    }
                }).catch((error) => {
                this.$log.error(error);
            })
            //renew
        },

        getAlarmNameDatas(item) {
            //alarmcode, prevtime, currtime
            //output: date, dt, count
            this.datas.alarmNameDatas = [];
            //renew
            this.$http.post(`/diagnostics/alarmstatistics/data/gridtable/statistics/renew/alarmname`, {
                data : item,
                startdate: this.datas.alarmDate,
                enddate: this.datas.alarmDate
            })
                .then((result) => {
                    if(result.data == '') {
                        this.$popmsg(this.$t(`diagnostics.alarmstatistics.popMsg.alarmStatisticsAlarmName`));
                    }
                    else {
                        this.datas.alarmNameDatas = result.data;
                    }
                }).catch((error) => {
                this.$log.error(error);
            })
            //renew
        },

        getDateAggregationDatas(item) {
            this.datas.dateAggregationDatas = [];
            //renew
            this.datas.dateAggregationDatas = [];
            this.$http.post(`/diagnostics/alarmstatistics/data/gridtable/statistics/renew/alarm/detail/chart`, {
                data : item,
                startdate: this.datas.alarmDate,
                enddate: this.datas.alarmDate
            })
                .then((result) => {
                    if(result.data == '') {
                        this.$popmsg(this.$t(`diagnostics.alarmstatistics.popMsg.alarmStatisticsAlarmName`));
                    }
                    else {
                        this.datas.dateAggregationDatas = result.data;
                    }
                }).catch((error) => {
                this.$log.error(error);
            })
            //renew

        },

        getRobotAlarmItems(item) {
            Promise.all([robotInfoAPI(item), robotTorqueAPI(item), robotAccumTrendAPI(item), robotAccumGapAPI(item), robotTemperatureTrendAPI(item), robotTemperatureGapAPI(item)])
                .then(([robotInfoRes, robotTorqueRes, robotAccumTrendRes, robotAccumGapRes, robotTemperatureTrendRes, robotTemperatureGapRes]) => {
                    this.datas.robotInfoItems = robotInfoRes.data.length > 0 ? robotInfoRes.data : [];
                    this.datas.robotTorqueItems = robotTorqueRes.data.length > 0 ? robotTorqueRes.data : [];
                    this.datas.robotAccumTrendItems = robotAccumTrendRes.data.length > 0 ? robotAccumTrendRes.data : [];
                    this.datas.robotAccumGapItems = robotAccumGapRes.data.length > 0 ? robotAccumGapRes.data : [];
                    this.datas.robotTemperatureTrendItems = robotTemperatureTrendRes.data.length > 0 ? robotTemperatureTrendRes.data : [];
                    this.datas.robotTemperatureGapItems = robotTemperatureGapRes.data.length > 0 ? robotTemperatureGapRes.data : [];
                })
                .then(() => {
                    this.setLoadingDialog(false);
                    this.datas.isRobotAlarmDlgOpen = true;
                })
                .catch((error) => {
                    this.setLoadingDialog(false);
                    console.error(error);
                })
        },

        getAtomizerAlarmItems(item) {
            Promise.all([atomizerInfoAPI(item), atomizerTrendAPI(item), atomizerListAPI(item), atomizerEntireListAPI(item)])
                .then(([atomizerInfoRes, atomizerTrendRes, atomizerListRes, atomizerEntireListRes]) => {
                    this.datas.atomizerInfoItems = atomizerInfoRes.data.length > 0 ? atomizerInfoRes.data : [];
                    this.datas.atomizerTrendItems = atomizerTrendRes.data.length > 0 ? atomizerTrendRes.data : [];
                    this.datas.atomizerListItems = atomizerListRes.data.length > 0 ? atomizerListRes.data : [];
                    this.datas.atomizerEntireListItems = atomizerEntireListRes.data.length > 0 ? atomizerEntireListRes.data : [];
                })
                .then(() => {
                    this.setLoadingDialog(false);
                    this.datas.isAtomizerAlarmDlgOpen = true;
                })
                .catch((error) => {
                    this.setLoadingDialog(false);
                    console.error(error);
                })
        },

        getAtomierEntireAlarmItems(item) {
            Promise.all([atomizerInfoAPI(item), atomizerTrendAPI(item), atomizerListAPI(item), atomizerEntireListAPI(item)])
                .then(([atomizerInfoRes, atomizerTrendRes ]) => {
                    this.datas.atomizerInfoItems = atomizerInfoRes.data.length > 0 ? atomizerInfoRes.data : [];
                    this.datas.atomizerTrendItems = atomizerTrendRes.data.length > 0 ? atomizerTrendRes.data : [];
                })
                .then(() => {
                    this.setLoadingDialog(false);
                    this.datas.isAtomizerAlarmDlgOpen = true;
                })
                .catch((error) => {
                    this.setLoadingDialog(false);
                    console.error(error);
                })
        },

        clickedItemHandler(item) {
            this.setLoadingDialog(true);
            this.checkAlarmType(item);
        },

        getClickedAtomizerListItem(item) {
            this.getAtomierEntireAlarmItems(item);
        },
    }
}
</script>
<style lang="scss" scoped>
    @import './alarmanalysis';
</style>
<template>
    <v-layout column>
        <v-layout>
            <v-flex class="pr-2" lg3>
                <date-picker v-on:getDate="getPrevDate" v-bind:setDate="datas.searchDatas.prevDate"></date-picker>
            </v-flex>

            <v-flex class="pl-2 pr-2" lg3>
                <date-picker v-on:getDate="getCurrDate" v-bind:setDate="datas.searchDatas.currDate"></date-picker>
            </v-flex>

            <v-flex class="pl-3 pr-3" lg1>
                <date-types v-on:dateTypes="getDateTypes"></date-types>
            </v-flex>
            <a><img class="pt-1 pr-2" src="@/images/selector_icon.png"/></a>
            <v-flex class="pl-2 pr-2" lg2>
                <selector
                    class="AlarmstatisticsSelector"
                    v-bind:selectorTitle="$t(String(`selector.booth`))"
                    v-bind:selectorOptions="datas.boothInfo"
                    v-on:selectedTarget="getTargetBoothId"
                ></selector>
            </v-flex>
            <v-flex class="pl-2 pr-2" lg2>
                <selector
                    class="AlarmstatisticsSelector"
                    v-bind:selectorTitle="$t(String(`selector.zone`))"
                    v-bind:selectorOptions="datas.getSelectedTargetZoneInfos"
                    v-on:selectedTarget="getTargetZoneId"
                ></selector>
            </v-flex>
            <v-flex class="pl-2" lg2>
                <selector
                    class="AlarmstatisticsSelector"
                    v-bind:selectorTitle="$t(String(`selector.robot`))"
                    v-bind:selectorOptions="datas.getSelectedTargetRobotInfos"
                    v-on:selectedTarget="getTargetRobotId"
                ></selector>
            </v-flex>
        </v-layout>
        <v-layout class="pt-2">
            <v-flex lg3 class="pr-2">
                <selector
                    class="FilterSelector"
                    v-bind:selectorTitle="ui.alarmType"
                    v-bind:selectorOptions="datas.alarmTypes"
                    v-on:selectedTarget="getTargetAlarmTypes"
                ></selector>
            </v-flex>
            <v-flex lg3 class="pl-2 pr-2">
                <alarm-level-selector
                    v-on:clickAlarmLevel="clickAlarmLevel"
                />
            </v-flex>
            <v-btn class="searchBtn buttonItem" @click="searchBtnClicked"><a class="pt-1"><img :src="ui.searchBtnIcon"></a></v-btn>
        </v-layout>
        <v-layout class="pt-3" column>
            <p v-bind:style="ui.styleObject">{{ui.alarmStatisticsTrend}}</p>
            <v-flex class="pt-1" lg12>
                <alarm-mixed-chart
                    v-bind:chartId="'alarmMixedChart'"
                    v-bind:chartHeight="ui.chartHeight"
                    v-bind:alarmMixedChartDatas="datas.chartDatas"
                ></alarm-mixed-chart>
            </v-flex>
        </v-layout>
        <v-layout class="pt-4 mt-1">
            <v-flex lg2 class="priority pr-2">
                <alarm-name-table
                    v-bind:title="ui.alarmNameContents.zone.title"
                    v-bind:header="ui.alarmNameContents.zone.listHeader"
                    v-bind:type="'zone'"
                    v-bind:alarmNameData="datas.zoneAlarmName"
                />
            </v-flex>
            <v-flex class="priority pr-2">
                <alarm-name-table
                    v-bind:title="ui.alarmNameContents.robot.title"
                    v-bind:header="ui.alarmNameContents.robot.listHeader"
                    v-bind:type="'robot'"
                    v-bind:alarmNameData="datas.robotAlarmName"
                />
            </v-flex>
             <date-aggregation-dlg
                v-bind:priorityFlag="this.datas.alarmDigIsOpen"
                v-bind:datePeriod="[datas.postDatas.prevDate, datas.postDatas.currDate]"
                v-bind:alarmCodeDatas="datas.alarmCodeDatas"
                v-bind:alarmNameDatas="datas.alarmNameDatas"
                v-bind:dateAggregationDatas="datas.dateAggregationDatas"
                v-on:changePriorityFlag="datas.alarmDigIsOpen=false"
            ></date-aggregation-dlg>
        </v-layout>
        <v-flex lg6 class="alarmInfoTable pl-2">
            <alarm-list-table
                v-bind:headerData="ui.alarmInfoTableHeaderData"
                v-bind:contentData="datas.alarmInfoTableContentData"
                v-on:clickedItem="clickedItemHandler"
            >
            </alarm-list-table>
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
        </v-flex>
        <v-dialog v-model="datas.event.dialog" hide-overlay persistent width="300">
            <v-card color="indigo" dark>
                <v-card-text>
                    Loading...
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'
import DatePicker from '@/commons/DatePicker'
import Selector from '@/commons/Selector'
import DateTypes from '@/commons/DateTypes'
import AlarmMixedChart from '@/components/diagnostics/alarmstatistics/alarmstatistics/AlarmMixedChart'
import DateAggregationDlg from '@/components/diagnostics/alarmstatistics/alarmstatistics/DateAggregationDlg'
import AlarmLevelSelector from '@/components/report/report/AlarmLevelSelector'
import AlarmNameTable from '@/components/report/report/AlarmNameTable'
import AlarmListTable from '@/components/diagnostics/report/report/alarmAnalysis/AlarmListTable';
import RobotAlarmModal from "@/commons/alarm/robotalarmmodal/RobotAlarmModal";
import AtomizerAlarmModal from "@/commons/alarm/atomizeralarmmodal/AtomizerAlarmModal";
import { convertLevelToIcon } from '@/utils/alarm';
import {
    robotInfoAPI,
    robotTorqueAPI,
    robotAccumTrendAPI,
    robotTemperatureTrendAPI,
    robotAccumGapAPI,
    robotTemperatureGapAPI,
    atomizerInfoAPI,
    atomizerTrendAPI,
    atomizerListAPI,
    atomizerEntireListAPI,
} from '@/api/alarmAPI';
import { deepClone } from "@/utils/utils";

export default {
    components: {
        DatePicker,
        Selector,
        DateTypes,
        AlarmMixedChart,
        DateAggregationDlg,
        AlarmLevelSelector,
        AlarmNameTable,
        AlarmListTable,
        RobotAlarmModal,
        AtomizerAlarmModal
    },
    data() {
        return {
            ui: {
                styleObject: null,
                chartHeight: 490,
                searchBtnIcon: require("@/images/search_icon.png"),
                alarmType: this.$t(`diagnostics.alarmstatistics.alarmType`),
                alarmStatisticsTrend: this.$t(`diagnostics.alarmstatistics.alarmStatisticsTrend`),
                alarmInfoTableHeaderData: [
                    { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.date`), value: 'time_stamp', sortable: false, align: 'center'},
                    { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.alarmtypename`), value: 'alarm_type_name', sortable: false, align: 'center'},
                    { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.alarmcode`), value: 'alarm_code', sortable: false, align: 'center'},
                    { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.alarmname`), value: 'alarm_name', sortable: false, align: 'center'},
                    { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.zonename`), value: 'zone_name', sortable: false, align: 'center'},
                    { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.jobname`), value: 'job_name', sortable: false, align: 'center'},
                    { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.robotname`), value: 'robot_name', sortable: false, align: 'center'},
                    { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.level`), value: 'level', sortable: false, align: 'center'}
                ],
                alarmNameContents: {
                    zone: {
                        title: this.$t(`diagnostics.alarmstatistics.alarmContents.flag.zoneAlarmNameFlag`),
                        listHeader: [
                            {text: this.$t(`diagnostics.alarmstatistics.alarmContents.title.zoneAlarmNameHeader.alarmtypename`), value: 'alarm_type', sort: false},
                            {text: this.$t(`diagnostics.alarmstatistics.alarmContents.title.zoneAlarmNameHeader.alarmname`), value: 'alarm_name', sort: false},
                            {text: this.$t(`diagnostics.alarmstatistics.alarmContents.title.zoneAlarmNameHeader.zonename`), value: 'zone_name', sort: false},
                            {text: this.$t(`diagnostics.alarmstatistics.alarmContents.title.zoneAlarmNameHeader.sum`), value: 'sum', sort: false},
                            {text: this.$t(`diagnostics.alarmstatistics.alarmContents.title.zoneAlarmNameHeader.level`), value: 'level', sort: false}
                        ]
                    },
                    robot: {
                        title: this.$t(`diagnostics.alarmstatistics.alarmContents.flag.robotAlarmNameFlag`),
                        listHeader: [
                            {text: this.$t(`diagnostics.alarmstatistics.alarmContents.title.robotAlarmNameHeader.alarmcode`), value: 'alarm_code', sort: false},
                            {text: this.$t(`diagnostics.alarmstatistics.alarmContents.title.robotAlarmNameHeader.alarmname`), value: 'alarm_name', sort: false},
                            {text: this.$t(`diagnostics.alarmstatistics.alarmContents.title.zoneAlarmNameHeader.zonename`), value: 'zone_name', sort: false},
                            {text: this.$t(`diagnostics.alarmstatistics.alarmContents.title.robotAlarmNameHeader.robotname`), value: 'robot_name', sort: false},
                            {text: this.$t(`diagnostics.alarmstatistics.alarmContents.title.robotAlarmNameHeader.sum`), value: 'sum', sort: false}
                        ]

                    }
                },
                robotAlarmDlgTitle: '로봇 알람 상세',
                atomizerAlarmDlgTitle: '도장기 알람 상세',
                spcAlarmDlgTitle: 'SPC 알람 상세'
            },
            datas: {
                searchDatas: {
                    prevDate: '',
                    currDate: '',
                    dateType: '',
                    boothId: '',
                    zoneId: '',
                    robotId: '',
                    alarmType: '',
                    selectedAlarmCodes: [],
                    countType: '',
                    countNum: 5,
                    deadtimeType: '',
                    deadtimeNum: 15
                },
                boothInfo: [],  // 부스 정보
                zoneInfo: [],  // 존 정보
                robotInfo: [], // 로봇 정보
                zoneAlarmName: [], // 존 알람 발생명
                robotAlarmName: [], // 로봇 알람 발생명
                alarmDigIsOpen: false, // 다이얼로그 boolean
                isRobotAlarmDlgOpen: false,
                isAtomizerAlarmDlgOpen: false,
                isSpcDlgOpen: false,
                postDatas: {},
                getSelectedTargetZoneInfos: [],  // 선택한 존 정보
                getSelectedTargetRobotInfos: [], // 선택한 로봇 정보
                alarmInfoTableContentData: [],
                chartDatas: [],
                alarmTypes: [],
                maxAlarmNameStatistics: [],
                alarmNameDatas: [],
                alarmCodeDatas: [],
                dateAggregationDatas: [],
                event: {
                    dialog: false
                },
                robotInfoItems: [],
                robotTorqueItems: [],
                robotAccumTrendItems: [],
                robotTemperatureTrendItems: [],
                robotAccumGapItems: [],
                robotTemperatureGapItems: [],
                atomizerInfoItems: [],
                atomizerTrendItems: [],
                atomizerListItems: [],
                atomizerEntireListItems: [],
            }
        }
    },

    mounted() {
        this.initializeStyle();
        this.getBoothInfo();
        this.getAlarmType();
    },

    computed: {
        ...mapGetters({
            baseUrl: 'getBaseUrl',
            getNavigationFlag: 'getNavigationFlag',
            getRenewBoothInfos: 'getRenewBoothInfos',
            getRenewZoneInfos: 'getRenewZoneInfos',
            getRenewRobotInfos: 'getRenewRobotInfos',
            getLanguage: 'getLanguage'
        }),
    },

    methods: {
        initializeStyle() {
            this.ui.styleObject = this.$style.common.titleObjectItemColor;
            document.documentElement.style.setProperty("--buttonBackgroundColor", this.$style.common.buttonItemBackgroundColor);
            document.documentElement.style.setProperty("--buttonColor", this.$style.common.buttonItemColor);
        },
        getBoothInfo(){
            let date = new Date();
            let y = date.getFullYear();
            let m = date.getMonth();
            let d = date.getDate();
            m = m >= 0 && m <= 11 ? m+=1 : 1
            this.datas.searchDatas.prevDate = `${y}-${m}-01`
            this.datas.searchDatas.currDate =`${y}-${m}-${d}`
            const setInfo = (data,type) => {
                data.forEach(el => {
                    el['id'] = el[`${type}_id`]
                    el['name'] = el[`${type}_name`]
                    delete el[`${type}_id`]
                    delete el[`${type}_name`]
                })
            }
            const sortInfo = (data, type) => {
                data.sort(function (a, b) {
	                return a[`${type}_no`] < b[`${type}_no`] ? -1 : 1;
                });
            }
            this.datas.boothInfo = deepClone(this.getRenewBoothInfos)
            setInfo(this.datas.boothInfo, 'booth')
            sortInfo(this.datas.boothInfo, 'booth')
            this.datas.zoneInfo = deepClone(this.getRenewZoneInfos)
            setInfo(this.datas.zoneInfo, 'zone')
            sortInfo(this.datas.zoneInfo, 'zone')
            this.datas.robotInfo = deepClone(this.getRenewRobotInfos)
            setInfo(this.datas.robotInfo, 'robot')
            sortInfo(this.datas.robotInfo, 'robot')
        },

        initDatas() {
            this.datas.chartDatas = [];
            this.datas.alarmInfoTableContentData = [];
            this.datas.maxAlarmNameStatistics = [];
        },

        setLoadingDialog(flag) {
            this.datas.event.dialog = flag;
        },

        getPrevDate(prevDate) {
            this.datas.searchDatas.prevDate = prevDate;
        },

        getCurrDate(currDate) {
            this.datas.searchDatas.currDate = currDate;
        },

        dateCompare(preDate, currDate) {
            var preDate = new Date(preDate);
            var currDate = new Date(currDate);
            return preDate <= currDate;
        },

        dateDiff(_date1, _date2) {
            let diffDate_1 = _date1 instanceof Date ? _date1 : new Date(_date1);
            let diffDate_2 = _date2 instanceof Date ? _date2 : new Date(_date2);

            let diff = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
            diff = Math.ceil(diff / (1000 * 3600 * 24));
            return diff;
        },

        getDateTypes(dateType) {
            this.datas.searchDatas.dateType = dateType;
        },

        getTargetBoothId(target) {
            this.datas.getSelectedTargetZoneInfos = [];
            this.datas.searchDatas.boothId = target.target;
            for(let i = 0; i < this.datas.zoneInfo.length; i++) {
                if(this.datas.zoneInfo[i].disp_booth_id == this.datas.searchDatas.boothId) {
                    this.datas.getSelectedTargetZoneInfos.push(this.datas.zoneInfo[i]);
                }
            }
        },

        getTargetZoneId(target) {
            this.datas.getSelectedTargetRobotInfos = [];
            this.datas.searchDatas.zoneId = target.target;
            for(let i = 0; i < this.datas.robotInfo.length; i++) {
                if(this.datas.robotInfo[i].zone_id == this.datas.searchDatas.zoneId) {
                    this.datas.getSelectedTargetRobotInfos.push(this.datas.robotInfo[i]);
                }
            }
        },

        getTargetRobotId(target) {
            this.datas.searchDatas.robotId = target.target;
        },

        getTargetAlarmTypes(targetAlarm) {
            this.datas.searchDatas.alarmType = targetAlarm.target;
        },


        checkSearchDatas(searchDatas) {
            return (searchDatas.prevDate != undefined && searchDatas.currDate != undefined && this.dateCompare(searchDatas.prevDate, searchDatas.currDate));
        },

        clickAlarmLevel(alarmLevel){
            let tempLevel = ''
            if(alarmLevel.length > 0){
                for(let i = 0; i < alarmLevel.length; i++){
                    let tempdata = "'" + alarmLevel[i] + "'"
                    if(i == alarmLevel.length - 1) {
                        tempLevel += tempdata;
                    }
                    else {
                        tempLevel += (tempdata + ',');
                    }
                }
            }
            this.datas.searchDatas['alarmlevel'] = tempLevel
        },

        searchBtnClicked() {
            /* searchBtn 클릭 시, 과거/현재날짜 및 부스, 존, 로봇 정보 데이터 전송 */
            Object.assign(this.datas.postDatas, this.datas.searchDatas);
            if(this.checkSearchDatas(this.datas.postDatas)) {
                this.setLoadingDialog(true);
                this.getChartDatas(this.datas.postDatas);
                this.getAlarmDataTableDatas(this.datas.postDatas);
                this.getStatisticsDataTableDatas(this.datas.postDatas);
            }
            else {
                this.initDatas();
                this.$popmsg(this.$t(`diagnostics.alarmstatistics.popMsg.checkDate`));
            }
        },

        getAlarmDataTableDatas(postDatas) {
            let targetDatas = {};
            targetDatas = this.checkTargetDatas(postDatas);
            //renew
            this.datas.alarmInfoTableContentData = [];
            const data = {
                boothid: targetDatas.boothid,
                zoneid : targetDatas.zoneid,
                robotid : targetDatas.robotid,
                startdate : targetDatas.prevtime,
                enddate : targetDatas.currtime,
                language : this.getLanguage,
                alarmlevel : targetDatas.alarmlevel,
                alarmtype: targetDatas.alarmtype
            }
            this.$http.post(`/diagnostics/alarmstatistics/renew/zone/data/gridtable`,data)
            .then((result) => {
                if(result.data !== '' && data.robotid === undefined){
                    result.data.forEach(el => {
                        el.level = convertLevelToIcon(el.level)
                        this.datas.alarmInfoTableContentData.push(el)
                    })
                }
                this.datas.alarmInfoTableContentData.sort(function (a, b) {
                    if(a.level> b.level) return -1;
                    if(a.level < b.level) return 1;
                });
            })
            .catch((err) => {
                console.log(err)
            })
            this.$http.post(`/diagnostics/alarmstatistics/renew/robot/data/gridtable`,data)
            .then((result) => {
                if(result.data !== ''){
                    result.data.forEach(el => {
                        el.level = convertLevelToIcon(el.level, el.type_id)
                        this.datas.alarmInfoTableContentData.push(el)
                    })
                }
            })
            .catch((err) => {
                console.log(err)
            })
            if(this.datas.alarmInfoTableContentData.length > 0){
                this.datas.alarmInfoTableContentData.forEach(el => {
                    if(!el.hasOwnProperty('level')){
                        Object.assign(el, {level: ''})
                    }
                    if(!el.hasOwnProperty('robot_name')){
                        Object.assign(el, {robot_name: ''})
                    }
                })
            }
        },

        getStatisticsDataTableDatas(postDatas) {
            let tempIndex = 0;
            let targetDatas = {};
            let boolean = false;
            targetDatas = this.checkTargetDatas(postDatas);
            //renew
            const data = {
                boothid: targetDatas.boothid,
                zoneid : targetDatas.zoneid,
                robotid : targetDatas.robotid,
                startdate : targetDatas.prevtime,
                enddate : targetDatas.currtime,
                language : this.getLanguage,
                alarmlevel : targetDatas.alarmlevel,
                alarmtype: targetDatas.alarmtype
            }
            Promise.all([
                this.$http.post(`/diagnostics/alarmstatistics/renew/zone/data/gridtable/statistics/alarmname`, data)
                .then((resZoneAlarmName) => {
                    this.datas.zoneAlarmName = resZoneAlarmName.data !== '' && data.robotid === undefined ? deepClone(resZoneAlarmName.data) : []
                    if(this.datas.zoneAlarmName.length > 0){
                        this.datas.zoneAlarmName.sort(function (a, b) {
                            if(a.level> b.level) return -1;
                            if(a.level < b.level) return 1;
                            if(Number(a.sum) > Number(b.sum)) return -1;
                            if(Number(a.sum) < Number(b.sum)) return 1;
                        });
                        let tempIndex = 0;
                        if(this.datas.zoneAlarmName.length % 5 != 0){
                            tempIndex = 5 - this.datas.zoneAlarmName.length % 5;
                            for(let i = 0; i < tempIndex; i++){
                                this.datas.zoneAlarmName.push({
                                    alarm_type_name: '', alarm_name: '', zone_name: '', sum: '', level: ''
                                })
                            }
                         }

                    }else{
                        for(let i = 0; i < 5; i++) {
                            this.datas.zoneAlarmName.push(
                                {alarm_type_name: '', alarm_name: '', zone_name: '', sum: '', level: ''
                            })
                        }
                    }
                })
                .catch((err) => {
                    this.datas.zoneAlarmName = []
                    for(let i = 0; i < 5; i++) {
                        this.datas.zoneAlarmName.push(
                            {alarm_type_name: '', alarm_name: '', zone_name: '', sum: '', level: ''
                        })
                    }

                }),
                this.$http.post(`/diagnostics/alarmstatistics/renew/robot/data/gridtable/statistics/alarmname`, data)
                .then((resRobotAlarmName)=> {
                    this.datas.robotAlarmName =  resRobotAlarmName.data !== '' ? deepClone(resRobotAlarmName.data) : []
                    if(this.datas.robotAlarmName.length > 0){
                        let tempIndex = 0;
                        if(this.datas.robotAlarmName.length % 5 != 0){
                            tempIndex = 5 - this.datas.robotAlarmName.length % 5;
                            for(let i = 0; i < tempIndex; i++){
                                this.datas.robotAlarmName.push({
                                    alarm_name: '', zone_name: '', robot_name: '', sum: ''
                                })
                            }
                        }
                    }else{
                        for(let i = 0; i < 5; i++) {
                            this.datas.robotAlarmName.push(
                                {alarm_name: '', zone_name: '', robot_name: '', sum: ''
                            })
                        }
                    }
                })
                .catch((err) => {
                    this.datas.robotAlarmName = []
                    for(let i = 0; i < 5; i++) {
                        this.datas.robotAlarmName.push(
                            {alarm_name: '', zone_name: '', robot_name: '', sum: ''
                        })
                    }
                })
            ])
            //renew
        },

        getAlarmNameDatas(item) {
            //alarmcode, prevtime, currtime
            //output: date, dt, count
            let postDatas = {};
            this.datas.alarmNameDatas = [];
            postDatas['date'] = this.datas.postDatas.dateType.value;
            postDatas['prevtime'] = this.datas.postDatas.prevDate;
            postDatas['currtime'] = this.datas.postDatas.currDate;
            //renew
            this.$http.post(`/diagnostics/alarmstatistics/data/gridtable/statistics/renew/alarmname`, {
                data : item,
                startdate: this.datas.postDatas.prevDate,
                enddate: this.datas.postDatas.currDate
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
        },

        getDateAggregationDatas(item) {
            let postDatas = {};
            this.datas.dateAggregationDatas = [];
            //renew
            this.datas.dateAggregationDatas = [];
            this.$http.post(`/diagnostics/alarmstatistics/data/gridtable/statistics/renew/alarm/detail/chart`, {
                data : item,
                startdate: this.datas.postDatas.prevDate,
                enddate: this.datas.postDatas.currDate
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


        getChartDatas(postDatas) {
            let targetDatas = this.checkTargetDatas(postDatas);
            //renew
            this.$http.post(`/diagnostics/alarmstatistics/renew/data/chart/`, targetDatas).then((result) => {
                if(result.data != '' && targetDatas.robotid === undefined) {
                    Object.keys(result.data).forEach(function eachKey(key) {
                        if(result.data[key].count == null) {
                            result.data[key].count = 0;
                        }
                    });
                    this.datas.chartDatas = result.data.sort(function (a,b) {
                        return a.date < b.date ? -1 : 1;
                    });
                    this.setLoadingDialog(false);
                }
                else {
                    this.datas.chartDatas = [];
                    this.setLoadingDialog(false);
                    this.$popmsg(this.$t(`diagnostics.alarmstatistics.popMsg.alarmStatisticsDataChart`));
                }
            }).catch((error) => {
                this.setLoadingDialog(false);
                this.$log.error(error);
                this.datas.chartDatas = [];
            })
        },

        checkTargetDatas(targetDatas) {
            let postDatas = {};
            postDatas['prevtime'] = targetDatas.prevDate;
            postDatas['currtime'] = targetDatas.currDate;
            postDatas['daycount'] = this.dateDiff(targetDatas.prevDate, targetDatas.currDate);
            if(targetDatas.boothId != undefined) {
                postDatas['boothid'] = targetDatas.boothId;
            }
            if(targetDatas.zoneId != undefined) {
                postDatas['zoneid'] = targetDatas.zoneId;
            }
            if(targetDatas.robotId != undefined) {
                postDatas['robotid'] = targetDatas.robotId;
            }
            if(targetDatas.alarmType != undefined) {
                postDatas['alarmtype'] = targetDatas.alarmType;
            }
            if(targetDatas.selectedAlarmCodes.length > 0) {
                postDatas['alarmcode'] = targetDatas.selectedAlarmCodes;
            }
            if(targetDatas.selectedAlarmLevelCodes != undefined) {
                postDatas['alarmlevelcodes'] = targetDatas.selectedAlarmLevelCodes;
            }
            if(targetDatas.maxAlarmLevelCodes != undefined) {
                postDatas['maxalarmlevelcodes'] = targetDatas.maxAlarmLevelCodes;
            }
            if(targetDatas.alarmZoneId != undefined){
                postDatas['alarmlevelzones'] = targetDatas.alarmZoneId;
            }
            if(targetDatas.countType != undefined) {
                postDatas['cntstd'] = targetDatas.countType;
                postDatas['count'] = targetDatas.countNum;
            }
            if (targetDatas.deadtimeType != undefined) {
                postDatas['dtstd'] = targetDatas.deadtimeType;
                postDatas['deadtime'] = targetDatas.deadtimeNum;
            }
            if(targetDatas.alarmlevel != undefined) {
                postDatas['alarmlevel'] = targetDatas.alarmlevel
            }
            return postDatas;
        },

        getAlarmType() {
            //renew
            this.$http.get(`${this.baseUrl}/diagnostics/alarmstatistics/renew/data/alarm/type/${this.getLanguage}`)
            .then((result) => {
                if (result.data == '') {
                    this.notify(this.info[3].text);
                    return;
                }
                this.datas.alarmTypes = result.data;
            }).catch((error) => {
                this.$log.error(error);
            })
        },

        notify(msg) {
            this.$notify({
                group: 'pushAlarm',
                text: msg
            });
        },

        checkAlarmType(item) {
            if( item.type_id === 2 ) {
                this.getAtomizerAlarmItems(item);
            } else if (item.type_id === 0 && item.disp_alarm_axis) {
                this.getRobotAlarmItems(item);
            }else {
                this.datas.alarmDigIsOpen = true;
                this.getAlarmCodeDatas(item);
                this.getAlarmNameDatas(item);
                this.getDateAggregationDatas(item);
                this.setLoadingDialog(false);
            }
        },

        getRobotAlarmItems(item) {
            Promise.all([robotInfoAPI(item), robotTorqueAPI(item), robotAccumTrendAPI(item), robotAccumGapAPI(item), robotTemperatureTrendAPI(item), robotTemperatureGapAPI(item)])
            .then(([robotInfoRes, robotTorqueRes, robotAccumTrendRes, robotAccumGapRes, robotTemperatureTrendRes, robotTemperatureGapRes]) => {
                this.datas.robotInfoItems = robotInfoRes.data.length > 0 ? robotInfoRes.data : [];
                this.datas.robotTorqueItems = robotTorqueRes.data.length > 0 ? robotTorqueRes.data : [];
                this.datas.robotAccumTrendItems = robotAccumTrendRes.data.length > 0 ? robotAccumTrendRes.data: [];
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

        getAtomizerEntireAlarmItems(item) {
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
            this.getAtomizerEntireAlarmItems(item);
        },
    }
}
</script>

<style scoped lang="scss">
   @import './alarmstatistics';
</style>

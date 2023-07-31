<template>
    <v-layout>
        <v-flex class="treebox">
            <v-layout column>
                <v-treeview
                    :items="datas.boothInfo"
                    :open-all="true"
                    hoverable
                    item-key="key"
                    transition
                    class="treeView"
                    :active.sync="datas.selectedZoneKey"
                    active-class="teal--text"
                >
                    <template slot="label" slot-scope="props">
                        <div class="treeItem" v-if="props.item.children">{{props.item.booth_name}}</div>
                        <v-layout v-else column >
                            <v-layout >
                                <p @click="clickZone(props.item)" class="treeItemChildren">{{ props.item.zone_name}}</p>
                            </v-layout>
                        </v-layout>
                    </template>
                </v-treeview>
            </v-layout>
        </v-flex>
        <analysis-content-dlg
            v-if="datas.exportDlg"
            v-bind:isOpen="datas.exportDlg"
            v-on:clickCloseBtn="datas.exportDlg=false"
            v-bind:selectedZoneInfo="datas.selectedZoneInfo"
            v-bind:selectedZoneReport="datas.selectedZoneReport"
            v-bind:prevReport="datas.prevReport"
            v-bind:robotData="datas.selectedRobotData.hardware_data"
            v-bind:atomizerData="datas.selectedAtomizerData"
            v-bind:tableHeader="datas.hardWareReportHeader"
            v-bind:tableHeaderDetail="datas.hardWareReportHeaderDetail"
            v-bind:chartDatas="datas.chartDatas"
            v-bind:predictAtomizerItems="datas.predictAtomizerItems"
            v-bind:predictSubAtomizerItems="datas.predictSubAtomizerItems"
        />
        <v-flex ref="zoneReport" class="zoneReport">
            <div class="zonename mt-3 ml-3">{{datas.selectedZoneInfo[0].zone_name}}</div>
            <v-layout>
                <v-flex class="reportlist mt-3 ml-3">
                    <v-select
                        v-model="datas.selectedZoneReport[0]"
                        :items="datas.zoneReports"
                        item-text="report_name"
                        item-value="report_id"
                        :return-object="true"
                        :menu-props="{ maxHeight: '250px' }"
                        @change="changeSelectedCurrentReport"
                    >
                    </v-select>
                </v-flex>
                <v-flex class="mt-3 mr-1" style="text-align: right;">
                    <v-btn @click="clickZoneExportBtn" flat>
                        <img src="@/images/report/printing.png"/>
                    </v-btn>
                </v-flex>
            </v-layout>
            <div id="tabMenuBox">
                <v-btn-toggle  class="btnToggle" rounded color="transparent" style="background:transparent"  mandatory >
                    <v-btn class="btntype" @click="clickReportType(0)" :ripple="false" color="#393b58"><v-icon class="mr-2">mdi-wrench-clock</v-icon>{{ui.btn.hardware}}</v-btn>
                    <v-btn class="btntype" @click="clickReportType(1)" :ripple="false" color="#393b58"><v-icon class="mr-2">mdi-alarm-light-outline</v-icon>{{ui.btn.alarm}}</v-btn>
                    <v-btn class="btntype" @click="clickReportType(2)" :ripple="false" color="#393b58"><img class="mr-2" src="@/images/report/atomizer.png"/>{{ui.btn.atomizer}}</v-btn>
                </v-btn-toggle>
            </div>
            <v-flex class= "savebtn mt-2 mr-2">
                <v-btn round color="#2DB67C" @click="clickSaveBtn">{{ui.btn.save}}</v-btn>
            </v-flex>
            <v-layout>
                <v-layout v-if="datas.selectedReportType !==1">
                    <v-flex class="prevtext">{{ui.title.prevReport}} : </v-flex>
                    <v-flex class="prevreportlist">
                        <v-select class="pl-3 mt-2 pr-2"
                            v-model="datas.prevReport[0]"
                            :items="datas.prevReportLists"
                            item-text="report_name"
                            item-value="report_id"
                            :return-object="true"
                            :menu-props="{ maxHeight: '250px' }"
                            @change="changeSelectedPrevReport"
                        >
                        </v-select>
                    </v-flex>
                </v-layout>
            </v-layout>
            <loading-dlg
                v-bind:loadingFlag="datas.loading"
            ></loading-dlg>
            <div ref="zone_report_content">
                <hard-ware-analysis
                    v-if="datas.selectedReportType===0"
                    v-bind:selectedZoneInfo="datas.selectedZoneInfo"
                    v-bind:selectedZoneReport="datas.selectedZoneReport"
                    v-bind:prevReport="datas.prevReport"
                    v-bind:robotData="datas.selectedRobotData.hardware_data"
                    v-bind:tableHeader="datas.hardWareReportHeader"
                    v-bind:tableHeaderDetail="datas.hardWareReportHeaderDetail"
                    v-on:clickAxisExportBtn="clickAxisExportBtn"
                    v-bind:exportFlag="false"
                />
            </div>
            <alarm-analysis
                v-if="datas.selectedReportType===1"
                v-bind:selectedZoneReport="datas.selectedZoneReport"
                v-bind:zoneAlarmNameData="datas.zoneAlarmName"
                v-bind:robotAlarmNameData="datas.robotAlarmName"
                v-bind:alarmNameContents="ui.alarmNameContents"
                v-bind:alarmListContents="ui.alarmListContents"
                v-bind:zoneAlarm="datas.zoneAlarm"
                v-bind:robotAlarm="datas.robotAlarm"
                v-bind:selectedAlarm="datas.selectedAlarm"
                v-bind:btnBoolean="datas.btnBoolean"
                v-bind:selectedAlarmLevel="datas.selectedAlarmLevel"
                v-on:clickAlarmLevel="clickAlarmLevel"
                v-on:clickCheckBox="clickCheckBox"
                v-on:clickItem="clickItem"
            />
            <date-aggregation-dlg
                v-bind:priorityFlag="this.datas.alarmDigIsOpen"
                v-bind:datePeriod="[datas.selectedZoneData.start_date, datas.selectedZoneData.end_date]"
                v-bind:alarmNameDatas="datas.alarmNameDatas"
                v-bind:alarmCodeDatas="datas.alarmCodeDatas"
                v-bind:dateAggregationDatas="datas.dateAggregationDatas"
                v-on:changePriorityFlag="datas.alarmDigIsOpen=false"
            ></date-aggregation-dlg>

            <atomizer-analysis
                v-if="datas.selectedReportType === 2"
                v-bind:reportItem="datas.selectedZoneReport[0]"
                v-bind:prevReport="datas.prevReport.length > 0 ? datas.prevReport[0] : {}"
                v-bind:header-item="ui.alarmListContents"
                v-bind:reportAtomizerData="datas.selectedAtomizerData"
                v-on:onCloseAtomizerPredictModal="onCloseAtomizerPredictModal"
            />
            <v-layout class="mb-2 mt-2">
                <v-flex v-if="datas.prevReport[0]">
                    <v-layout>
                        <v-flex >
                            <report-zone-opinion
                                v-bind:title="datas.sub_title"
                                v-bind:comment="datas.sub_comment"
                                v-bind:isEditing="false"
                                @inputZoneOpinion="inputZoneOpinion"
                            />
                        </v-flex>
                        <v-icon class="ml-1 mr-1">mdi-arrow-right-bold-outline</v-icon>
                    </v-layout>
                </v-flex>
                <v-flex>
                    <report-zone-opinion
                        v-bind:title="datas.title"
                        v-bind:comment="datas.comment"
                        v-bind:isEditing="true"
                        @inputZoneOpinion="inputZoneOpinion"
                    />
                </v-flex>
            </v-layout>

            <report-btn-nav
                v-bind:data="datas.selectedReportType === 0 ? datas.selectedRobotData : datas.selectedReportType === 1 ? datas.selectedZoneData : datas.selectedReportType === 2 ? datas.selectedAtomizerData : {status: 0}"
                v-bind:type="datas.selectedReportType"
                v-on:clickStatusBtn="clickStatusBtn"
            />
        </v-flex>
    </v-layout>
</template>
<script>

import { mapGetters } from 'vuex';

import { isEmpty } from "lodash";
import { deepClone } from "@/utils/utils";
import DateAggregationDlg from '@/components/diagnostics/alarmstatistics/alarmstatistics/DateAggregationDlg'
import HardWareAnalysis from '@/components/report/report/HardWareAnalysis.vue'
import ReportZoneOpinion from '@/components/report/report/ReportZoneOpinion.vue'
import AlarmAnalysis from '@/components/report/report/AlarmAnalysis.vue'
import ReportBtnNav from '@/components/report/report/ReportBtnNav.vue'
import LoadingDlg from '@/commons/LoadingDlg'
import AnalysisContentDlg from '@/components/report/report/export/AnalysisContentDlg.vue'
import AtomizerAnalysis from '@/components/report/report/Atomizer/AtomizerAnalysis.vue'
import { convertToAtomizerChartItems, convertToAtomizerHVChartItems } from '@/utils/diagnostics/predict';
import {
    getAccumAxisAvgAPI,
    getTemperatureAvgAPI,
    getTorqueAvgAPI,
    getAccumDailyAvgAPI,
    getAccumDataAPI,
    getTemperatureDataAPI,
    getPmTorqueDataAPI
} from "@/api/report/hardwareDataAPI.js";

import { getDailyAccumAvgAPI } from '@/api/diagnostics/torqueLoadFactorAPI'
import { caculateAvg } from "@/utils/report";
import {
    getPredictAtomizerAlarmStatusItemsAPI,
    getReportAtomizerAvgDataItemsAPI,
    getReportAtomizerAlarmCountItemsAPI,
    getPredictAtomizerChartItemsAPI
} from "@/api/report/atomizerAPI";

export default {
    name: 'reportresult',
    components: {
        HardWareAnalysis,
        ReportZoneOpinion,
        AlarmAnalysis,
        DateAggregationDlg,
        ReportBtnNav,
        LoadingDlg,
        AnalysisContentDlg,
        AtomizerAnalysis
    },
     data(){
        return{
            ui: {
                cardColor: '',
                title: {
                    prevReport: this.$t(`report.hardware.title.prevReport`),
                },
                btn: {
                    save:this.$t(`report.common.btn.save`),
                    hardware: this.$t(`report.hardware.title.hardware`),
                    alarm: this.$t(`report.hardware.title.alarm`),
                    atomizer: this.$t(`report.hardware.title.atomizer`),

                },
                alarmNameContents: {
                    zone: {
                    title: this.$t(`diagnostics.alarmstatistics.alarmContents.flag.zoneAlarmNameFlag`),
                    listHeader: [
                        {
                            check: 'false',
                            value: 'check',
                            sort: false
                        },
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
                        {
                            check: 'false',
                            value: 'check',
                            sort: false
                         },
                        {text: this.$t(`diagnostics.alarmstatistics.alarmContents.title.robotAlarmNameHeader.alarmcode`), value: 'alarm_code', sort: false},
                        {text: this.$t(`diagnostics.alarmstatistics.alarmContents.title.robotAlarmNameHeader.alarmname`), value: 'alarm_name', sort: false},
                        {text: this.$t(`diagnostics.alarmstatistics.alarmContents.title.zoneAlarmNameHeader.zonename`), value: 'zone_name', sort: false},
                        {text: this.$t(`diagnostics.alarmstatistics.alarmContents.title.robotAlarmNameHeader.robotname`), value: 'robot_name', sort: false},
                        {text: this.$t(`diagnostics.alarmstatistics.alarmContents.title.robotAlarmNameHeader.sum`), value: 'sum', sort: false}
                    ]

                }
                },
                alarmListContents: [
                    { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.date`), value: 'time_stamp',sort: false},
                    { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.alarmtypename`), value: 'alarm_type_name', sort: false},
                    { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.alarmcode`), value: 'alarm_code', sort: false},
                    { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.alarmname`), value: 'alarm_name', sort: false},
                    { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.zonename`), value: 'zone_name', sort: false},
                    { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.jobname`), value: 'job_name', sort: false},
                    { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.robotname`), value: 'robot_name', sort: false},
                    { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.level`), value: 'level', sort: false},
                ],
                atomizerTypeValueItems: [
                    { id: 0, title: 'Turbine', value: 'turbine' },
                    { id: 1, title: 'SA_S', value: 'sa_s' },
                    { id: 2, title: 'SA_V', value: 'sa_v' },
                    { id: 3, title: 'HV', value: 'hv' }
                ],
            },
            datas: {
                /** 부스 정보 */
                boothInfo: [],
                /** 존 정보 */
                zoneInfo: [],
                /** 로봇 정보 */
                robotInfo: [],
                /** 선택한 존 key(선택된 존에 design 처리위함) */
                selectedZoneKey: [],
                /** 선택한 존 정보 */
                selectedZoneInfo: [],
                /** 선택한 존에 로봇별 DATA(하드웨어) */
                selectedRobotData: [],
                /** 선택한 존별 DATA(알람) */
                selectedZoneData : [],
                /** 선택한 존에 모든 리포트 */
                zoneReports: [],
                 /** 선택한 리포트 */
                selectedZoneReport: [],
                 /** 선택한 리포트 타입(하드웨어 OR 알람) */
                selectedReportType: null,
                 /** 적산 토크 데이터 */
                violatedAccumulation: [],
                /**  일일 적산 평균 데이터 */
                violatedDailyAccumulation: [],
                /** 모터 수명 데이터 */
                violatedPmhard: [],
                 /** 모터 온도 데이터 */
                violatedTemperature: [],
                /** 토크 평균 데이터 */
                violatedPmTorque: [],
                /** 비교할 이전 데이터들 */
                prevReportLists: [],
                /** 선택된 이전 데이터 */
                prevReport: [],
                /** 하드웨어 분석 테이블 헤더 */
                hardWareReportHeader: [],
                /** 하드웨어 분석 테이블 헤더 디테일(Expand) */
                hardWareReportHeaderDetail: [],
                /** 알람 위험도 */
                alarmLevel: null,
                /** 존 알람 발생명 데이터 */
                zoneAlarmName: [],
                /** 로봇 알람 발생명 데이터 */
                robotAlarmName: [],
                /** 존 알람 데이터 */
                zoneAlarm: [],
                /** 로봇 알람 데이터 */
                robotAlarm: [],
                /** 선택된 알람 데이터*/
                selectedAlarm: [],
                /** 버튼 활성화 유무 (저장된 알람 리포트에는 버튼 비활성화)*/
                btnBoolean: false,
                /** 선택된 알람 위험도 */
                selectedAlarmLevel: [],
                /** 알람 dialog에서  알람 이름 및 정보*/
                alarmCodeDatas: [],
                /** 알람 dialog에서  부스 별 알람 개수*/
                alarmNameDatas: [],
                /** 알람 dialog에서 날짜별 알람 개수*/
                dateAggregationDatas: [],
                /** 알람 dialog 활성화 유무*/
                alarmDigIsOpen: false,
                loading: false,
                exportDlg: false,
                chartDatas: [],
                title : '',
                comment : '',
                sub_title : '',
                sub_comment : '',
                predictAtomizerItems: [],
                predictAtomizerSubItems : [],
                selectedAtomizerData: [],
            }
        }
    },
    computed:{
        ...mapGetters({
            getRenewBoothInfos: 'getRenewBoothInfos',
            getRenewZoneInfos: 'getRenewZoneInfos',
            getRenewRobotInfos: 'getRenewRobotInfos',
            getRenewReportZoneInfos: 'getRenewReportZoneInfos',
            getAuth: 'getAuth',
            getTheme: 'getTheme',
            getLanguage: 'getLanguage'
        })
    },
    created(){
       this.initTreeList();
    },
    async mounted(){
        this.initializeStyle();
        await this.getZoneReport(this.getRenewReportZoneInfos.zone_id);
        await this.setRobotInfo(this.getRenewReportZoneInfos.zone_id); // 하드웨어 종합 분석 (로봇 데이터)
        await this.setZoneInfo(this.getRenewReportZoneInfos.zone_id);
        await this.setSelectedZoneReport(this.getRenewReportZoneInfos.report_id);
        this.setOpinionItem(0);
    },
    watch: {
    },

    methods: {
        initializeHeader(){
            this.ui.alarmNameContents = {
                zone: {
                    title: this.$t(`diagnostics.alarmstatistics.alarmContents.flag.zoneAlarmNameFlag`),
                    listHeader: [
                        {
                            check: 'false',
                            value: 'check',
                            sort: false
                        },
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
                        {
                            check: 'false',
                            value: 'check',
                            sort: false
                         },
                        {text: this.$t(`diagnostics.alarmstatistics.alarmContents.title.robotAlarmNameHeader.alarmcode`), value: 'alarm_code', sort: false},
                        {text: this.$t(`diagnostics.alarmstatistics.alarmContents.title.robotAlarmNameHeader.alarmname`), value: 'alarm_name', sort: false},
                        {text: this.$t(`diagnostics.alarmstatistics.alarmContents.title.zoneAlarmNameHeader.zonename`), value: 'zone_name', sort: false},
                        {text: this.$t(`diagnostics.alarmstatistics.alarmContents.title.robotAlarmNameHeader.robotname`), value: 'robot_name', sort: false},
                        {text: this.$t(`diagnostics.alarmstatistics.alarmContents.title.robotAlarmNameHeader.sum`), value: 'sum', sort: false}
                    ]

                }
            }
        },
        initializeStyle() {
            this.ui.cardColor = this.$style.common.gridTableItemCardColor;
        },

        clickMoveBtn(){

        },
        clickIcon(){

        },

        initTreeList(){
            this.datas.boothInfo = [];
            this.datas.selectedZoneKey = [];
            this.datas.selectedZoneInfo = [];
            this.datas.selectedReportType = 0;
            let key = 1
            this.datas.boothInfo = deepClone(this.getRenewBoothInfos)
            this.datas.zoneInfo = deepClone(this.getRenewZoneInfos)
            this.datas.robotInfo = deepClone(this.getRenewRobotInfos)
            this.datas.boothInfo.forEach(boothElement => {
                boothElement['key'] = key;
                key += 1;
            })
            this.datas.zoneInfo.forEach(zoneElement => {
                zoneElement['key'] = key
                key += 1;
            })

            this.datas.boothInfo.forEach(boothElement => {
                Object.assign(boothElement, {children: this.datas.zoneInfo.filter(element => element.disp_booth_id === boothElement.booth_id)})
                boothElement.children.sort(function (a, b) {
	                return a.zone_no < b.zone_no ? -1 : 1;
                });
            })
            this.datas.boothInfo.sort(function (a, b) {
                return a.booth_no < b.booth_no ? -1: 1;
            })
            this.datas.selectedZoneKey.push(this.getRenewReportZoneInfos.zone_key)
            this.datas.selectedZoneInfo = this.datas.zoneInfo.filter(el => el.zone_id == this.getRenewReportZoneInfos.zone_id)
        },
        clickReportType(type){ // 0이면 하드웨어 종합 분석 , 1이면 알람 분석
            this.datas.selectedReportType = (type === 0) ? 0 : (type === 1) ? 1 : (type === 2) ? 2 : 0
            this.setOpinionItem(type);
        },
        setOpinionItem(type){
            this.datas.title = type === 0 ? this.datas.selectedRobotData.hardwareTitle : type === 1 ? this.datas.selectedZoneData.alarmTitle : type === 2 ? this.datas.selectedAtomizerData.atomizer_title : ''
            this.datas.comment = type === 0 ?  this.datas.selectedRobotData.hardwareComment : type === 1 ? this.datas.selectedZoneData.alarmComment : type === 2 ? this.datas.selectedAtomizerData.atomizer_comment : ''
            this.datas.sub_title = type === 0 ? this.datas.selectedRobotData.prevHardWareTitle : type === 1 ? this.datas.selectedZoneData.prev_alarm_title : type === 2 ? this.datas.selectedAtomizerData.prev_atomizer_title : ''
            this.datas.sub_comment = type === 0 ?  this.datas.selectedRobotData.prevHardWareComment : type === 1 ? this.datas.selectedZoneData.prev_alarm_comment : type === 2 ? this.datas.selectedAtomizerData.prev_atomizer_comment : ''
        },


        async getZoneReport(zone_id){
            await this.$http.get(`/reportview/renew/report/zoneid/${zone_id}`)
            .then((res)=>{
                this.datas.zoneReports = res.data !== '' ? res.data : []
                this.datas.zoneReports.forEach(el => {
                    el.start_date = el.start_date.substr(0,10)
                    el.end_date = el.end_date.substr(0,10)
                    el.update_time = el.update_time.substr(0,10)
                })
            })
        },
        setZoneInfo(zone_id){
            this.datas.selectedZoneData = deepClone(this.datas.zoneInfo.filter(el => el.zone_id === zone_id)[0])
            this.datas.selectedZoneData = {
                start_date : '',
                end_date : '',
                alarmTitle: '',
                alarmComment: '',
                prev_alarm_title : '',
                prev_alarm_comment: '',
                status: 0
            }
            this.datas.zoneAlarmName = [];
            for(let i = 0; i < 5; i++) {
                this.datas.zoneAlarmName.push(
                    {check: '', alarm_name: '', zone_name: '', sum: '', level: ''
                })
            }
            this.datas.robotAlarmName = [];
            for(let j = 0; j < 5; j++){
                this.datas.robotAlarmName.push(
                    {check: '', alarm_name: '', zone_name : '', robot_name: '', sum: ''
                })
            }
            this.datas.zoneAlarm = [];
            this.datas.robotAlarm = [];
            this.datas.selectedAlarm = [];
            this.datas.selectedAlarmLevel = [
                this.$t(`diagnostics.alarmstatistics.level.middle`),
                this.$t(`diagnostics.alarmstatistics.level.high`)
            ];
            this.initializeHeader();
        },
        async setRobotInfo(zone_id){
            let tempIndex = 0;
            let tempNumber = 0;
            let type = (robot_axis,max_robot_axis,robot_id) => { // robot_axis : robot별 기본 축, max_robot_axis: 해당 존에서 가장 높은 축
                let temp = [];
                for(let i = 0; i < 5; i ++){
                    temp.push({
                        robot_id: robot_id,
                        masterjob: null,
                        prev_masterjob: null,
                        config: null,
                        prev_config: null,
                        cycle_time: null,
                        prev_cycle_time: null,
                        accum_count: '',
                        data: i === 1 ? Array(robot_axis).fill(2) : Array(robot_axis).fill(0),
                        violatedCount : i === 3 ? null : Array(robot_axis).fill(0),
                        previolatedCount: i === 3 ? null : Array(robot_axis).fill(0),
                        level: Array(robot_axis).fill({curr_level: 0, prev_level: 0}),
                        text: '',
                        toggle: false
                    })
                }
                temp.forEach((el,idx) => {
                    if(el.data.length % max_robot_axis != 0){
                        tempIndex = max_robot_axis - el.data.length % max_robot_axis;
                        for(let i = 0; i < tempIndex; i++){
                            idx === 1 ? el.data.push(2) : el.data.push(0)
                        }
                    }
                    if(el.level.length % max_robot_axis != 0){
                        tempIndex = max_robot_axis - el.level.length % max_robot_axis;
                        for(let i = 0; i < tempIndex; i++){
                            el.level.push({curr_level: 2, prev_level: 0})
                        }
                    }
                    if(idx !== 3 && el.violatedCount.length % max_robot_axis != 0){
                        tempIndex = max_robot_axis - el.violatedCount.length % max_robot_axis;
                        for(let i = 0; i < tempIndex; i++){
                            el.violatedCount.push(0)
                            el.previolatedCount.push(0)

                        }
                    }
                })
                temp[0].text = this.$t(`report.hardware.tableHeader.header.accum`)
                temp[1].text = this.$t(`report.hardware.tableHeader.header.accumAvg`)
                temp[2].text = this.$t(`report.hardware.tableHeader.header.temperature`)
                temp[3].text = this.$t(`report.hardware.tableHeader.header.motorLife`)
                temp[4].text = this.$t(`report.hardware.tableHeader.header.accumDailyAvg`)
                return temp
            }

            this.datas.selectedRobotData = {
                hardwareTitle : '',
                hardwareComment : '',
                prevHardWareTitle : '',
                prevHardWareComment : '',
                status : 0,
                hardware_data : await deepClone(this.datas.robotInfo.filter(el => el.zone_id === zone_id).sort(function (a, b) {
                    return a.robot_no < b.robot_no ? -1: 1;
                })),
                atomizer_data : await deepClone(this.datas.robotInfo.filter(el => el.zone_id === zone_id).sort(function (a, b) {
                    return a.robot_no < b.robot_no ? -1: 1;
                })),
            }
            this.datas.robotAxis = Math.max(...this.datas.selectedRobotData.hardware_data.map(e=>e.robot_axis)); // 선택 존에 로봇 중 가장 큰 축 추출
            this.datas.hardWareReportHeader = [];
            this.datas.hardWareReportHeaderDetail = [];
            for(let l = 0; l < this.datas.robotAxis; l++){
                this.datas.hardWareReportHeader.push({text:`${l+1}${this.$t(`report.hardware.tableHeader.header.axis`)}`})
                this.datas.hardWareReportHeaderDetail.push({text:`${l+1}${this.$t(`report.hardware.tableHeader.header.axis`)}`})
            }
            this.datas.hardWareReportHeader.unshift({ text: 'icon'},{text: this.$t(`report.hardware.tableHeader.header.robot`)})
            this.datas.hardWareReportHeaderDetail.unshift({ text: 'Type'})
            this.datas.hardWareReportHeader.push(
                { text: 'ControlBox(%)'},
                { text: 'Manipulation(%)'},
                { text: 'Cps(%)'},
                { text: 'Resernative_Fan(%)'},
                { text: 'Capacitor(%)'},
            )
            this.datas.hardWareReportHeaderDetail.push({ text: this.$t(`report.hardware.tableHeader.header.settingJob`)},)
            this.datas.selectedRobotData.hardware_data.forEach(robotElement => {
                Object.assign(robotElement, {
                    current_data: {
                        axis_level: deepClone(Array(robotElement.robot_axis).fill({curr_level: 0, prev_level: 0})),
                        type: deepClone(type(robotElement.robot_axis,this.datas.robotAxis, robotElement.robot_id)),
                        capacitor: {curr_level: 2, data: 0},
                        coolingfan: Array(4).fill({curr_level: 2, data: 0}),
                    }
                })
                if(robotElement.current_data.axis_level.length % this.datas.robotAxis != 0){
                    tempNumber = this.datas.robotAxis - robotElement.current_data.axis_level.length % this.datas.robotAxis;
                    for(let i = 0; i < tempNumber; i++){
                        robotElement.current_data.axis_level.push({curr_level: 0, prev_level: 0})
                    }
                }
            })
        },
        async setSelectedZoneReport(report_id){
            this.datas.selectedZoneReport = deepClone(this.datas.zoneReports.filter(el => el.report_id == report_id))
            if(this.datas.selectedZoneReport[0] !== undefined){ // 리포트 id와 name만 있는 상태 , 데이터는 가지고 있지 않은 상태
                await this.setPrevReportList(null);
                /** 저장 데이터 조회 */
                this.datas.selectedZoneReport[0].current_data !== null && await this.setHardWareData();
                this.datas.selectedZoneReport[0].atomizer_data !== null && await this.setAtomizerData();
                this.datas.prevReport.length > 0 && await this.setPrevReportData();
                await this.confirmAlertLevel();
                await this.getAlarm();

            }else{
                window.alert(this.$t(`report.common.window.addReport`))
            }
        },
        async setHardWareData(){ // 저장된 리포트 세팅
            this.datas.loading = true
            let temp = {}
            let selectedAxisInfo = [];
            this.datas.chartDatas = [];
            temp = deepClone(this.datas.selectedZoneReport[0].current_data) // 리포트 테이블에서 현재 데이터 조회
            temp.hardware_data.forEach((el, itemIndex) => {
                this.datas.robotInfo.forEach(item => {
                    if(item.robot_id === el.robot_id){
                        Object.assign(el, {robot_name: item.robot_name}, {zone_id: item.zone_id}, {robot_no: item.robot_no}, {robot_axis: item.robot_axis},{rc_model_id: item.rc_model_id},{tool_id : item.tool_id})
                        el.current_data.type.forEach((type, typeIndex) => {
                            type.level.forEach((level, levelIndex) => {
                                level.print ? (selectedAxisInfo.push({item : type, idx : levelIndex, type: typeIndex}), level.print = level.print) : (level.print = false)
                            })
                            switch(typeIndex){
                                case 0:
                                    el.current_data.type[typeIndex].text = this.$t(`report.hardware.tableHeader.header.accum`)
                                break;
                                case 1:
                                    el.current_data.type[typeIndex].text = this.$t(`report.hardware.tableHeader.header.accumAvg`)
                                break;
                                case 2:
                                    el.current_data.type[typeIndex].text = this.$t(`report.hardware.tableHeader.header.temperature`)
                                break;
                                case 3:
                                    el.current_data.type[typeIndex].text = this.$t(`report.hardware.tableHeader.header.motorLife`)
                                break;
                                case 4:
                                    el.current_data.type[typeIndex].text = this.$t(`report.hardware.tableHeader.header.accumDailyAvg`)
                                break; 
                            default:
                            }
                        })
                    }
                })
            })

            if(selectedAxisInfo.length > 0){
                selectedAxisInfo.forEach((axisInfo, index) => {
                    this.datas.chartDatas.push({
                        info : {
                            axis : axisInfo.idx + 1,
                            config : axisInfo.item.config !== null && axisInfo.item.config[axisInfo.idx] !== null ? Number(axisInfo.item.config[axisInfo.idx]) : 'No Data',
                            masterjob : axisInfo.item.masterjob !== null ? axisInfo.item.masterjob : 'No Setting Job',
                            prev_masterjob : axisInfo.item.prev_masterjob !== null ? axisInfo.item.prev_masterjob : 'No Setting Job',
                            prev_config : axisInfo.item.prev_config !== null && axisInfo.item.prev_config[axisInfo.idx] !== null ? Number(axisInfo.item.prev_config[axisInfo.idx]) : 'No Data',
                            previolatedCount : axisInfo.item.previolatedCount[axisInfo.idx],
                            robot_id : axisInfo.item.robot_id,
                            text: axisInfo.item.text,
                            violatedCount : axisInfo.item.violatedCount[axisInfo.idx],
                            type_value : axisInfo.type,
                            zone_name : this.datas.selectedZoneInfo[0].zone_name,
                            startdate : this.datas.selectedZoneReport[0].start_date,
                            enddate : this.datas.selectedZoneReport[0].end_date,
                            prev_startdate : this.datas.prevReport.length > 0 ? this.datas.prevReport[0].start_date : null,
                            prev_enddate : this.datas.prevReport.length > 0 ? this.datas.prevReport[0].end_date : null,
                            robot_name: this.getRenewRobotInfos.filter(el => el.robot_id === axisInfo.item.robot_id)[0].robot_name,
                            robot_axis: this.getRenewRobotInfos.filter(el => el.robot_id === axisInfo.item.robot_id)[0].robot_axis,
                            data_avg: '',
                            prev_data_avg: '',
                        },
                        chartData : [],
                        prevChartData: [],
                        index: index,
                        item: [],
                        value: [],
                        prevItem : [],
                        mainChartId: `main-chart-id-${index}`,
                        subChartId: `sub-chart-id-${index}`
                    })
                })
                for (const [infoIndex, item] of this.datas.chartDatas.entries()){
                    switch(item.info.type_value){
                        case 0 :
                            await this.getAccumData(item,infoIndex)
                        break;
                        case 1 :
                            await this.getPmTorque(item,infoIndex)
                        break;
                        case 2 :
                            await this.getTemperatureData(item,infoIndex)
                        break;
                        case 4 :
                            await this.getDailyAccumAvgData(item,infoIndex)
                        break; 
                    default :
                    }
                }
                const size = 3
                const dataLength = this.datas.chartDatas.length
                const tempResult = deepClone(this.datas.chartDatas)
                this.datas.chartDatas = [];
                for(let i = 0; i < dataLength; i ++){
                    let value = tempResult.splice(0,size)
                    !isEmpty(value) ? this.datas.chartDatas.push(value) : this.datas.chartDatas
                }
            }
            this.datas.loading = false
            this.datas.selectedRobotData = temp
        },

        async setAtomizerData(){
            this.datas.loading = true
            let temp = {}
            let selectedTypeInfo = [];
            this.datas.predictAtomizerItems = [];
            this.datas.predictSubAtomizerItems = [];
            temp = deepClone(this.datas.selectedZoneReport[0].atomizer_data)
            temp.atomizer_title = temp.atomizer_title ? temp.atomizer_title : ''
            temp.atomizer_comment = temp.atomizer_comment ? temp.atomizer_comment : ''
            temp.prev_atomizer_title = temp.prev_atomizer_title ? temp.prev_atomizer_title : ''
            temp.prev_atomier_comment = temp.prev_atomizer_comment ? temp.prev_atomer_comment : ''
            temp.data && temp.data.forEach(atomizerItem => {
                Object.assign(atomizerItem, {tool_id : this.datas.robotInfo.filter(robotInfoItem => robotInfoItem.robot_id === atomizerItem.robot_id)[0].tool_id})
                !atomizerItem.print ? atomizerItem.print = [false, false, false, false] :
                atomizerItem.print.forEach((print, printType) => {
                    print && selectedTypeInfo.push({
                        item : print,
                        id: printType,
                        value: this.ui.atomizerTypeValueItems[printType].value,
                        robot_id : atomizerItem.robot_id,
                        level : {
                            turbine : atomizerItem.violation_level[0],
                            sa_s :atomizerItem.violation_level[1],
                            sa_v :atomizerItem.violation_level[2],
                            hv :atomizerItem.violation_level[3],
                        },
                    })
                })
            })
            this.datas.selectedAtomizerData = temp

            const setListItem = (type, Array) => {
                let result = [];
                if (type === 'hv'){
                    (Array && temp.data.length ) ? Array.data.forEach(data => {data[0] = this.datas.selectedZoneReport[0].report_name}, result = Array.data) : result = []
                }
                else{
                    result = Array && Array.data.length ? (Array.data[0] = this.datas.selectedZoneReport[0].report_name, Array.data) : []
                }
                return result
            }
            if(selectedTypeInfo.length > 0) {
                for await (let typeInfo of selectedTypeInfo){
                    const atomizerAvgData = await getReportAtomizerAvgDataItemsAPI({robotId : typeInfo.robot_id, prevDate: `${this.datas.selectedZoneReport[0].start_date}`, currDate: `${this.datas.selectedZoneReport[0].end_date}`, type: typeInfo.value })
                    const atomizerSubAvgData = this.datas.prevReport.length > 0 && await getReportAtomizerAvgDataItemsAPI({robotId : typeInfo.robot_id, prevDate: `${this.datas.prevReport[0].start_date}`, currDate: `${this.datas.prevReport[0].end_date}`, type: typeInfo.value })
                    const atomizerPredictItems = await getPredictAtomizerChartItemsAPI({
                        type: typeInfo.value,
                        typeNo: typeInfo.id,
                        prevDate: `${this.datas.selectedZoneReport[0].start_date}`,
                        currDate: `${this.datas.selectedZoneReport[0].end_date}`,
                        robot_id : typeInfo.robot_id
                    });
                    const atomizerAlarmCountItem = await getReportAtomizerAlarmCountItemsAPI({robotId : typeInfo.robot_id, prevDate: `${this.datas.selectedZoneReport[0].start_date}`, currDate: `${this.datas.selectedZoneReport[0].end_date}`})
                    const atomizerSubAlarmCountItem = this.datas.prevReport.length > 0 && await getReportAtomizerAlarmCountItemsAPI({robotId : typeInfo.robot_id, prevDate: `${this.datas.prevReport[0].start_date}`, currDate: `${this.datas.prevReport[0].end_date}`})


                    atomizerPredictItems && atomizerPredictItems.data.length > 0 && this.datas.predictAtomizerItems.push({
                        id : typeInfo.id,
                        value: typeInfo.value,
                        data: typeInfo.value === 'hv' ? convertToAtomizerHVChartItems(atomizerPredictItems.data) : convertToAtomizerChartItems(atomizerPredictItems.data),
                        robot_id : typeInfo.robot_id,
                        robot_name : this.datas.robotInfo.filter(robot => robot.robot_id === typeInfo.robot_id)[0].robot_name,
                        level : typeInfo.level,
                        print: typeInfo.item,
                        list_title: typeInfo.value === 'hv' ? ['리포트 이름', 'Command', 'Command 평균'] : ['리포트 이름', '오차 초과율 평균', '오차 미달율 평균'],
                        list_item : setListItem(typeInfo.value, atomizerAvgData),
                        list_sub_item : setListItem(typeInfo.value, atomizerSubAvgData),
                        count : Array.isArray(atomizerAlarmCountItem.data) && atomizerAlarmCountItem.data.length > 0 ? atomizerAlarmCountItem.data[typeInfo.id].value : 0,
                        sub_count :Array.isArray(atomizerSubAlarmCountItem.data) && atomizerSubAlarmCountItem.data.length > 0 ? atomizerSubAlarmCountItem.data[typeInfo.id].value : 0,
                        config : Array.isArray(atomizerAlarmCountItem.data) && atomizerAlarmCountItem.data.length > 0 ? atomizerAlarmCountItem.data[typeInfo.id].config : [],
                        sub_config : Array.isArray(atomizerSubAlarmCountItem.data) && atomizerSubAlarmCountItem.data.length > 0 ? atomizerSubAlarmCountItem.data[typeInfo.id].config : [],
                        percent : atomizerAvgData && atomizerAvgData.data && atomizerSubAvgData && atomizerSubAvgData.data ? this.setPercentage(atomizerAvgData.data, atomizerSubAvgData.data, typeInfo.value) : []
                    })

                    if(this.datas.predictAtomizerItems && this.datas.predictAtomizerItems.length > 0){
                        this.datas.predictAtomizerItems.forEach((atomizerItem , atomizerIndex)=> {
                            atomizerItem.data.forEach((atomizerData, atomizerDataIndex) => {
                                if(Array.isArray(atomizerData)){
                                    this.datas.predictAtomizerItems.push({
                                        id : atomizerItem.id,
                                        level : atomizerItem.level,
                                        print : atomizerItem.print,
                                        robot_id : atomizerItem.robot_id,
                                        robot_name : atomizerItem.robot_name,
                                        value : atomizerItem.value,
                                        list_title : atomizerItem.list_title,
                                        data : atomizerData,
                                        list_item : atomizerItem.list_item[atomizerDataIndex],
                                        list_sub_item :atomizerItem.list_sub_item[atomizerDataIndex],
                                        count : atomizerItem.count,
                                        config : [atomizerItem.config[atomizerDataIndex]],
                                        sub_count : atomizerItem.sub_count,
                                        sub_config : [atomizerItem.sub_config[atomizerDataIndex]],
                                        percent : atomizerItem.percent[atomizerDataIndex]
                                    })
                                }
                            })
                            Array.isArray(atomizerItem.data[0]) && this.datas.predictAtomizerItems.splice(atomizerIndex,1)
                        })
                    }

                    const atomizerSubPredictItems = this.datas.prevReport.length > 0 && await getPredictAtomizerChartItemsAPI({
                        type: typeInfo.value,
                        typeNo: typeInfo.id,
                        prevDate: `${this.datas.prevReport[0].start_date}`,
                        currDate: `${this.datas.prevReport[0].end_date}`,
                        robot_id : typeInfo.robot_id
                    });
                    atomizerSubPredictItems && atomizerSubPredictItems.data.length > 0 && this.datas.predictSubAtomizerItems.push({
                        id : typeInfo.id,
                        value: typeInfo.value,
                        data: typeInfo.value === 'hv' ? convertToAtomizerHVChartItems(atomizerSubPredictItems.data) : convertToAtomizerChartItems(atomizerSubPredictItems.data),
                        robot_id : typeInfo.robot_id,
                        level : typeInfo.level,
                    })

                    if(this.datas.predictSubAtomizerItems && this.datas.predictSubAtomizerItems.length > 0){
                        this.datas.predictSubAtomizerItems.forEach((subAtomizerItem, subAtomizerIndex) => {
                            subAtomizerItem.data.forEach((subAtomizerData => {
                                if(Array.isArray(subAtomizerData)){
                                    this.datas.predictSubAtomizerItems.push({
                                        id: subAtomizerItem.id,
                                        level : subAtomizerItem,
                                        robot_id : subAtomizerItem.robot_id,
                                        value : subAtomizerItem.value,
                                        data : subAtomizerData,
                                    })
                                }
                            }))
                            Array.isArray(subAtomizerItem.data[0]) && this.datas.predictSubAtomizerItems.splice(subAtomizerIndex,1)
                        })
                    }
                }
                const size = 3
                const dataLength = this.datas.predictAtomizerItems.length
                const tempResult = deepClone(this.datas.predictAtomizerItems)
                const tempSubResult = deepClone(this.datas.predictSubAtomizerItems)
                this.datas.predictAtomizerItems = [];
                this.datas.predictSubAtomizerItems = [];
                for(let i = 0; i < dataLength; i ++){
                    let value = tempResult.splice(0,size)
                    let sub_value = tempSubResult.splice(0,size)
                    !isEmpty(value) ? this.datas.predictAtomizerItems.push(value) : this.datas.predictAtomizerItems
                    !isEmpty(sub_value) ? this.datas.predictSubAtomizerItems.push(sub_value) : this.datas.predictSubAtomizerItems
                }
            }
            this.datas.loading = false
        },

        setPercentage(mainArray, subArray, type){
            let result = type !== 'hv' ? Array(3).fill(null) : []
            if(type !== 'hv'){
                for(let i = 1; i < 3; i ++){
                    result[i] = Number(((mainArray[i] - subArray[i]) / Math.abs(subArray[i]) * 100).toFixed(2))
                }
            }
            else{
                for(let i = 0; i < Math.max(mainArray.length, subArray.length); i++){
                    let temp = Array(3).fill(null)
                    temp[2] = mainArray[i][1] === subArray[i][1] ?  Number(((mainArray[i][2] - subArray[i][2]) / Math.abs(subArray[i][2]) * 100).toFixed(2)) : null
                    result.push(temp)
                }
            }
            return result
        },

        async setAxisAvg(props){
            let prevAccumAvg = null
            let prevTemperatureAvg = null
            let prevTorqueAvg = null
            function caculatePercentage(curr, prev) {
                return prev !== 0 && prev ? (((curr-prev) / Math.abs(prev)) * 100).toFixed(2) : null
            }
            let accumAvg = {data: ''}
            if(props.item.rc_model_id === 0 || props.item.tool_id === 2){
                let result = await getAccumDailyAvgAPI({
                    startDate : this.datas.selectedZoneReport[0].start_date,
                    endDate : this.datas.selectedZoneReport[0].end_date,
                    robotId : props.item.robot_id
                })
                if(result.data.length > 0 && result){
                    let temp = Array(props.item.robot_axis).fill(0)
                    result.data.forEach(el => {
                        for(let i = 0; i < el.sum.length; i ++){
                            temp[i] += el.sum[i]
                        }
                    })

                    accumAvg.data = [{array : temp.map(el => {return Math.round(el / result.data.length)})}]
                }
            }
            else{
                accumAvg = await getAccumAxisAvgAPI(  // 적산 평균
                    {
                        robotId : props.item.robot_id,
                        startDate: this.datas.selectedZoneReport[0].start_date,
                        endDate: this.datas.selectedZoneReport[0].end_date,
                        robotAxis: props.item.robot_axis
                    }
                )
            }  // 일일 적산 평균 hidden
            const temperatureAvg = await getTemperatureAvgAPI( // 온도 평균
                {
                    robotId : props.item.robot_id,
                    startDate: this.datas.selectedZoneReport[0].start_date,
                    endDate: this.datas.selectedZoneReport[0].end_date,
                    robotAxis: props.item.robot_axis
                }
            )
            const torqueAvg = await getTorqueAvgAPI(
                {
                    robotId : props.item.robot_id,
                    startDate: this.datas.selectedZoneReport[0].start_date,
                    endDate: this.datas.selectedZoneReport[0].end_date,
                    robotAxis: props.item.robot_axis
                }
            )
            if(this.datas.prevReport.length > 0){
                if(props.item.rc_model_id === 0 || props.item.tool_id === 2){
                    let result = await getAccumDailyAvgAPI({
                        startDate : this.datas.prevReport[0].start_date,
                        endDate : this.datas.prevReport[0].end_date,
                        robotId : props.item.robot_id
                    })
                    if(result.data.length > 0 && result){
                        let temp = Array(props.item.robot_axis).fill(0)
                        result.data.forEach(el => {
                            for(let i = 0; i < el.sum.length; i ++){temp[i] += el.sum[i]}})
                        prevAccumAvg = {data: [{array : temp.map(el => {return Math.round(el / result.data.length)})}]}
                    }
                }
                else{
                    prevAccumAvg = await getAccumAxisAvgAPI(
                        {
                            robotId : props.item.robot_id,
                            startDate: this.datas.prevReport[0].start_date,
                            endDate: this.datas.prevReport[0].end_date,
                            robotAxis: props.item.robot_axis
                        }
                    )
                }
                prevTemperatureAvg = await getTemperatureAvgAPI( // 온도 평균
                    {
                        robotId : props.item.robot_id,
                        startDate: this.datas.prevReport[0].start_date,
                        endDate: this.datas.prevReport[0].end_date,
                        robotAxis: props.item.robot_axis
                    }
                )
                prevTorqueAvg = await getTorqueAvgAPI( // 토크 평균
                    {
                        robotId : props.item.robot_id,
                        startDate: this.datas.prevReport[0].start_date,
                        endDate: this.datas.prevReport[0].end_date,
                        robotAxis: props.item.robot_axis
                    }
                )
            }
            for(let i=0; i < props.item.robot_axis; i ++){
                props.item.current_data.type[0].level[i].data_avg = accumAvg.data !== '' && accumAvg.data.length > 0 ? accumAvg.data[0].array[i] : null
                props.item.current_data.type[1].level[i].data_avg = torqueAvg.data !== '' && torqueAvg.data.length > 0 ? torqueAvg.data[0].array[i] : null
                props.item.current_data.type[2].level[i].data_avg = temperatureAvg.data !== '' && temperatureAvg.data.length > 0 ? temperatureAvg.data[0].array[i] : null

                props.item.current_data.type[0].level[i].prev_data_avg = prevAccumAvg !== null && prevAccumAvg.data !== '' && prevAccumAvg.data.length > 0 ? prevAccumAvg.data[0].array[i] : null
                if(props.item.current_data.type[0].level[i].data_avg !== null && prevAccumAvg !== null && prevAccumAvg.data !== '' && prevAccumAvg.data.length > 0){
                    props.item.current_data.type[0].level[i].data_percentage = caculatePercentage(accumAvg.data[0].array[i],prevAccumAvg.data[0].array[i])
                }
                props.item.current_data.type[1].level[i].prev_data_avg =  prevTorqueAvg !== null && prevTorqueAvg.data !== '' && prevTorqueAvg.data.length > 0 ? prevTorqueAvg.data[0].array[i] : null
                if(props.item.current_data.type[1].level[i].data_avg !== null && prevTorqueAvg !== null && prevTorqueAvg.data !== '' && prevTorqueAvg.data.length > 0){
                    props.item.current_data.type[1].level[i].data_percentage = caculatePercentage(torqueAvg.data[0].array[i],prevTorqueAvg.data[0].array[i])
                }
                props.item.current_data.type[2].level[i].prev_data_avg = prevTemperatureAvg !== null && prevTemperatureAvg.data !== '' && prevTemperatureAvg.data.length > 0 ? prevTemperatureAvg.data[0].array[i] : null
                if( props.item.current_data.type[2].level[i].data_avg !== null && prevTemperatureAvg !== null && prevTemperatureAvg.data !== '' && prevTemperatureAvg.data.length > 0){
                    props.item.current_data.type[2].level[i].data_percentage = caculatePercentage(temperatureAvg.data[0].array[i],prevTemperatureAvg.data[0].array[i])
                }
            }
            return props.item
        },

        async getAccumData(item,index){
            this.datas.loading = true;
            let currTemp = [];
            let prevTemp = [];
            // 적산 값 조회
            const accumItem = await getAccumDataAPI({startdate : item.info.startdate, enddate : item.info.enddate, robotid : item.info.robot_id, axis : item.info.axis})
            accumItem.data !== '' ? currTemp = accumItem.data.filter(accum => accum.data !== null) : currTemp

            if(this.datas.prevReport.length > 0){
                    // 비교 리포트 적산 값 조회
                const prev_accumItem = await getAccumDataAPI({startdate : this.datas.prevReport[0].start_date , enddate : this.datas.prevReport[0].end_date, robotid : item.info.robot_id, axis : item.info.axis})
                prev_accumItem.data !== '' ? prevTemp = prev_accumItem.data.filter(prevAccum => prevAccum.data !== null) : prevTemp
            }
            this.datas.chartDatas[index].chartData = currTemp.length > 0 ? await this.setData(currTemp, item.info, index) : []
            this.datas.chartDatas[index].prevChartData = prevTemp.length > 0 ? await this.setPrevData(prevTemp, item.info, index) : []
            this.datas.loading = false;
        },

        async setData(array, object, index){
            let maxConfig = 0;
            let temp = [];
            let tempObj = {};
            temp = deepClone(array)
            temp.forEach(el => { el.spec = Number(el.spec)})
            tempObj = deepClone(object);
            tempObj.data_avg =  caculateAvg(temp, object)
            if(temp.length > 0 ){
                const result = temp.reduce(function(pre, curr) {
                    return (pre.data > curr.data) ? pre : curr
                })
                 maxConfig = result.data
            }
            if(Number(tempObj.config)){tempObj.maximum = object.violatedCount === 0 ? tempObj.config  + (tempObj.config * 0.15) : maxConfig+ (maxConfig * 0.15)}
            else{tempObj.maximum = maxConfig+ (maxConfig * 0.15)}

            this.datas.chartDatas[index].info = tempObj
            this.datas.chartDatas[index].item = [this.datas.selectedZoneReport[0].report_name, tempObj.masterjob, tempObj.config, tempObj.data_avg]
            return temp
        },

        async setPrevData(array, object, index){
            let maxConfig = 0;
            let temp = [];
            let tempObj = {}
            temp = deepClone(array)
            temp.forEach(el => { el.spec = Number(el.spec)})
            tempObj = deepClone(object);
            tempObj.prev_data_avg = await caculateAvg(temp, object)
            if(tempObj.data_avg !== '' && tempObj.prev_data_avg !== ''){
                tempObj.data_percentage = tempObj.prev_data_avg !== 0 && tempObj.prev_data_avg ? (((tempObj.data_avg - tempObj.prev_data_avg) / tempObj.prev_data_avg) * 100).toFixed(2) : null
            }
            if(temp.length > 0 ){
                const result = temp.reduce(function(pre, curr) {
                    return (pre.data > curr.data) ? pre : curr
                })
                maxConfig = result.data
            }
            if(Number(tempObj.prev_config)){tempObj.prev_maximum = object.previolatedCount === 0 ? tempObj.prev_config  + (tempObj.prev_config* 0.15) : maxConfig + (maxConfig * 0.15)}
            else{tempObj.prev_maximum = maxConfig + (maxConfig * 0.15)}
            this.datas.chartDatas[index].info = tempObj
            this.datas.chartDatas[index].value = [null, null, null, tempObj.data_percentage]
            this.datas.chartDatas[index].prevItem = this.datas.prevReport.length > 0 ? [this.datas.prevReport[0].report_name, tempObj.prev_masterjob, tempObj.prev_config, tempObj.prev_data_avg] : []
            return temp
        },

        async getPmTorque(item, index){
            this.datas.loading = true;
            let currTemp = [];
            let prevTemp = [];
            // pmtorque 조회
            const pmTorqueItem = await getPmTorqueDataAPI({startdate : item.info.startdate, enddate : item.info.enddate, robotid : item.info.robot_id, axis : item.info.axis})
            if(pmTorqueItem.data !== ''){
                pmTorqueItem.data.forEach(item => {
                    Object.assign(item, {data : Math.round(((item.latest-item.elapsed)*0.01) * 100) / 100})
                    Object.assign(item, {spec : 5})
                })
                currTemp = pmTorqueItem.data
            }
            else{
                this.datas.chartDatas[index].chartData = [];
            }
            if(this.datas.prevReport.length > 0){
                const prev_pmTorqueItem = await getPmTorqueDataAPI({startdate : this.datas.prevReport[0].start_date, enddate : this.datas.prevReport[0].end_date, robotid : item.info.robot_id, axis : item.info.axis})
                if(prev_pmTorqueItem.data !== ''){
                    prev_pmTorqueItem.data.forEach(item => {
                        Object.assign(item, {data : Math.round(((item.latest-item.elapsed)*0.01) * 100) / 100})
                        Object.assign(item, {spec : 5})
                    })
                    prevTemp = prev_pmTorqueItem.data
                }
                else{
                    this.datas.chartDatas[index].prevChartData = [];
                }
            }
                this.datas.chartDatas[index].chartData = currTemp.length > 0 ? await this.setData(currTemp, item.info, index): []
            this.datas.chartDatas[index].prevChartData = prevTemp.length > 0 ? await this.setPrevData(prevTemp, item.info,index): []
            this.datas.loading = false;
        },

        async getTemperatureData(item,index){
            this.datas.loading = true;
            let currTemp = [];
            let prevTemp = [];
            const temperatureItem = await getTemperatureDataAPI({startdate : item.info.startdate, enddate : item.info.enddate, robotid : item.info.robot_id, axis : item.info.axis})
                temperatureItem.data !== '' ? currTemp = temperatureItem.data.filter(temp => temp.data !== null) : this.datas.chartDatas[index].chartData = [];
            if(this.datas.prevReport.length > 0){
                // 비교 리포트 온도 값 조회
                const prev_temperatrueItem = await getTemperatureDataAPI({startdate : this.datas.prevReport[0].start_date, enddate : this.datas.prevReport[0].end_date, robotid : item.info.robot_id, axis : item.info.axis})
                prev_temperatrueItem.data !== '' ? prevTemp = prev_temperatrueItem.data.filter(prevTemp => prevTemp.data !== null) : this.datas.chartDatas[index].prevChartData = [];
            }
            this.datas.chartDatas[index].chartData = currTemp.length > 0 ? await this.setData(currTemp, item.info, index) : []
            this.datas.chartDatas[index].prevChartData = prevTemp.length > 0 ? await this.setPrevData(prevTemp, item.info, index) : []
            this.datas.loading = false;
        },

            async getDailyAccumAvgData(item, index){
                this.datas.loading = true;
                let currTemp = [];
                let prevTemp = [];
                const result = await getDailyAccumAvgAPI({
                    startDate : item.info.startdate,
                    endDate : item.info.enddate,
                    robotid : item.info.robot_id,
                    axis : item.info.axis,
                    jobname: item.info.masterjob
                })
                if(result.data.length > 0 && result){
                    currTemp = [];
                    result.data.forEach(el => {
                        currTemp.push({
                            spec : Number(el.spec),
                            robot_id : el.robot_id,
                            date : el.timestamp,
                            data : el.sum,
                            cycle_time : el.cycle
                        })
                    })
                }else{
                   this.datas.chartDatas[index].chartData = [];
                }

                if(this.datas.prevReport.length > 0){
                    const prevResult = await getDailyAccumAvgAPI({
                        startDate : this.datas.prevReport[0].start_date,
                        endDate : this.datas.prevReport[0].end_date,
                        robotid : item.info.robot_id,
                        axis : item.info.axis,
                        jobname: item.info.prev_masterjob
                    })
                    if(prevResult.data.length > 0 && prevResult){
                        prevTemp = [];
                        prevResult.data.forEach(el => {
                            prevTemp.push({
                                spec : Number(el.spec),
                                robot_id : el.robot_id,
                                date : el.timestamp,
                                data : el.sum,
                                cycle_time : el.cycle
                            })
                        })
                    }
                    else{
                        this.datas.chartDatas[index].prevChartData = [];
                    }
                }
                this.datas.chartDatas[index].chartData = currTemp.length > 0 ? await this.setData(currTemp, item.info, index): [];
                this.datas.chartDatas[index].prevChartData = prevTemp.length > 0 ? await this.setPrevData(prevTemp, item.info, index): [];
                this.datas.loading = false
            },

        setAlarmData(){
            let tempIndex = 0;
            let index = 0
            this.datas.zoneAlarmName = deepClone(this.datas.selectedZoneReport[0].alarm_data.zoneAlarm)
            this.datas.robotAlarmName = deepClone(this.datas.selectedZoneReport[0].alarm_data.robotAlarm)
            if(this.datas.zoneAlarmName.length === 0){
                for(let i = 0; i < 5; i++) {
                    this.datas.zoneAlarmName.push({check: '', alarm_name: '', zone_name: '', sum: '', level: ''})
                }
            }
            if(this.datas.robotAlarmName.length === 0){
                for(let j = 0; j < 5; j++){
                    this.datas.robotAlarmName.push(
                        {check: '', alarm_name: '', zone_name : '', robot_name: '', sum: ''
                    })
                }
            }
            if(this.datas.zoneAlarmName.length % 5 != 0){
                tempIndex = 5 - this.datas.zoneAlarmName.length % 5;
                for(let i = 0; i < tempIndex; i++){
                    this.datas.zoneAlarmName.push({
                        check: '', alarm_name: '', zone_name: '', sum: '', level: ''
                    })
                }
            }
            if(this.datas.robotAlarmName.length % 5 != 0){
                index = 5 - this.datas.robotAlarmName.length % 5;
                for(let i = 0; i < index; i++){
                    this.datas.robotAlarmName.push({
                        check: '', alarm_name: '', zone_name : '', robot_name: '', sum: ''
                    })
                }
            }
            this.ui.alarmNameContents.zone.listHeader[0].check = this.datas.selectedZoneReport[0].alarm_data.zoneHeader
            this.ui.alarmNameContents.robot.listHeader[0].check = this.datas.selectedZoneReport[0].alarm_data.robotHeader
            this.datas.selectedAlarm = deepClone(this.datas.selectedZoneReport[0].alarm_data.selectedAlarm)
            this.datas.selectedZoneData.alarmTitle = this.datas.selectedZoneReport[0].alarm_data.alarmTitle
            this.datas.selectedZoneData.alarmComment = this.datas.selectedZoneReport[0].alarm_data.alarmComment
            this.datas.selectedZoneData.prev_alarm_title = this.datas.selectedZoneReport[0].alarm_data.prev_alarm_title
            this.datas.selectedZoneData.prev_alarm_comment = this.datas.selectedZoneReport[0].alarm_data.prev_alarm_comment
            this.datas.selectedZoneData.status = this.datas.selectedZoneReport[0].alarm_data.status
        },

        clickStatusBtn(value){
            if(this.datas.selectedReportType === 0){
                this.datas.selectedRobotData.status = value
            }
            else{
                this.datas.selectedZoneData.status = value
            }
        },

        clickItem(data){
            this.datas.alarmDigIsOpen = true;
            this.datas.selectedZoneData.start_date = this.datas.selectedZoneReport[0].start_date
            this.datas.selectedZoneData.end_date = this.datas.selectedZoneReport[0].end_date
            this.getAlarmCodeDatas(data.item);
            this.getAlarmNameDatas(data.item);
            this.getDateAggregationDatas(data.item);
        },

        getAlarmCodeDatas(item){
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

        getAlarmNameDatas(item){
            this.datas.alarmNameDatas = [];
            this.$http.post(`/diagnostics/alarmstatistics/data/gridtable/statistics/renew/alarmname`, {
                data : item,
                startdate: this.datas.selectedZoneReport[0].start_date,
                enddate: this.datas.selectedZoneReport[0].end_date
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
        },

        getDateAggregationDatas(item){
            this.datas.dateAggregationDatas = [];
            this.$http.post(`/diagnostics/alarmstatistics/data/gridtable/statistics/renew/alarm/detail/chart`, {
                data : item,
                startdate: this.datas.selectedZoneReport[0].start_date,
                enddate: this.datas.selectedZoneReport[0].end_date
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
        },

        clickCheckBox(item){
            if(item.zoneHeader === 'true'){
                this.ui.alarmNameContents.zone.listHeader[0].check = 'true'
            }
            if(item.robotHeader === 'true'){
                this.ui.alarmNameContents.robot.listHeader[0].check = 'true'
            }
            if(item.robotNameData.length > 0) {
                this.datas.robotAlarmName = deepClone(item.robotNameData)
            }
            if(item.zoneNameData.length > 0) {
                this.datas.zoneAlarmName = deepClone(item.zoneNameData)
            }
            this.datas.selectedAlarm = deepClone(item.data).sort(function (a,b){
                return a.time_stamp < b.time_stamp ? -1 : 1;
            })
            if(this.datas.selectedAlarm.length > 0){
                this.datas.selectedAlarm.forEach(el => {
                    if(!el.hasOwnProperty('level')){
                        Object.assign(el, {level: ''})
                    }
                    if(!el.hasOwnProperty('robot_name')){
                        Object.assign(el, {robot_name: ''})
                    }
                })
            }
        },

        clickAlarmLevel(alarmLevel){
            this.datas.alarmLevel = '';
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
                this.datas.alarmLevel = tempLevel
            }
            setTimeout(() => {this.getAlarm()}, 300);
        },

        async getAlarm(){
            this.datas.loading = true
            this.datas.selectedAlarm = [];
            const reportData = {
                language : this.getLanguage,
                alarmlevel : this.datas.alarmLevel,
                zoneid : this.datas.selectedZoneReport[0].zone_id,
                startdate : this.datas.selectedZoneReport[0].start_date,
                enddate : this.datas.selectedZoneReport[0].end_date
            }
            await this.$http.post(`/diagnostics/alarmstatistics/renew/zone/data/gridtable`, reportData)
            .then((resAllZoneData) => {
                this.datas.zoneAlarm = resAllZoneData.data !== '' ? deepClone(resAllZoneData.data) : []
            })
            .catch((err) => {
                console.log(err)
                this.datas.zoneAlarm = [];
            }),
            await this.$http.post(`/diagnostics/alarmstatistics/renew/robot/data/gridtable`, reportData)
            .then((resAllRobotData) => {
                this.datas.robotAlarm = resAllRobotData.data !== '' ? deepClone(resAllRobotData.data) : []
            })
            .catch((err) => {
                console.log(err)
                this.datas.robotAlarm = [];
            })
            if(this.datas.selectedZoneReport[0].alarm_data !== null){
                this.datas.btnBoolean = true
                this.setAlarmData();
            }
            else{
                this.datas.btnBoolean = false
                Promise.all([
                    await this.$http.post(`/diagnostics/alarmstatistics/renew/zone/data/gridtable/statistics/alarmname`, reportData)
                    .then((resZoneAlarmName) => {
                        this.datas.zoneAlarmName = resZoneAlarmName.data !== '' ? deepClone(resZoneAlarmName.data).sort(function (a, b) {
	                        if(a.level> b.level) return -1;
                            if(a.level < b.level) return 1;
                            if(Number(a.sum) > Number(b.sum)) return -1;
                            if(Number(a.sum) < Number(b.sum)) return 1;
                        }) : []
                        this.datas.zoneAlarmName.forEach(el => {
                            Object.assign(el, {check : 'false'})
                        })
                        if(this.datas.zoneAlarmName.length > 0){
                            let tempIndex = 0;
                            if(this.datas.zoneAlarmName.length % 5 != 0){
                                tempIndex = 5 - this.datas.zoneAlarmName.length % 5;
                                for(let i = 0; i < tempIndex; i++){
                                    this.datas.zoneAlarmName.push({
                                        check: '', alarm_type_name: '', alarm_name: '', zone_name: '', sum: '', level: ''
                                    })
                                }
                            }

                        }else{
                            for(let i = 0; i < 5; i++) {
                                this.datas.zoneAlarmName.push(
                                    {check: '', alarm_type_name: '', alarm_name: '', zone_name: '', sum: '', level: ''
                                })
                            }
                        }
                    })
                    .catch((err) => {
                        this.datas.zoneAlarmName = []
                        for(let i = 0; i < 5; i++) {
                            this.datas.zoneAlarmName.push(
                                {check: '', alarm_type_name: '', alarm_name: '', zone_name: '', sum: '', level: ''
                            })
                        }

                    }),

                    await this.$http.post(`/diagnostics/alarmstatistics/renew/robot/data/gridtable/statistics/alarmname`, reportData)
                    .then((resRobotAlarmName)=> {
                        this.datas.robotAlarmName =  resRobotAlarmName.data !== '' ? deepClone(resRobotAlarmName.data) : []
                        this.datas.robotAlarmName.forEach(el => {
                            Object.assign(el, {check : 'false'})
                        })
                        if(this.datas.robotAlarmName.length > 0){
                            let tempIndex = 0;
                            if(this.datas.robotAlarmName.length % 5 != 0){
                                tempIndex = 5 - this.datas.robotAlarmName.length % 5;
                                for(let i = 0; i < tempIndex; i++){
                                    this.datas.robotAlarmName.push({
                                        check: '', alarm_name: '', zone_name : '', robot_name: '', sum: ''
                                    })
                                }
                            }
                        }else{
                            for(let i = 0; i < 5; i++) {
                                this.datas.robotAlarmName.push(
                                    {check: '', alarm_name: '', zone_name : '', robot_name: '', sum: ''
                                })
                            }
                        }
                    })
                    .catch((err) => {
                        this.datas.robotAlarmName = []
                        for(let i = 0; i < 5; i++) {
                            this.datas.robotAlarmName.push(
                                {check: '', alarm_name: '', zone_name : '', robot_name: '', sum: ''
                            })
                        }
                    })
                ])
                if(this.datas.prevReport.length > 0 && this.datas.prevReport[0].alarm_data){
                    this.datas.selectedZoneData.prev_alarm_title = this.datas.prevReport[0].alarm_data.alarmTitle
                    this.datas.selectedZoneData.prev_alarm_comment = this.datas.prevReport[0].alarm_data.alarmComment
                }
                this.initializeHeader();
            }
            this.datas.loading = false
        },

        async setPrevReportList(prevReport){
            this.datas.prevReport = [];
            this.datas.prevReportLists = [];
            this.datas.prevReportLists = deepClone(this.datas.zoneReports.filter(el => el.report_id !== this.datas.selectedZoneReport[0].report_id && el.current_data !== null))
            this.datas.prevReportLists.sort(function (a, b) {
	            if(a.start_date > b.start_date) return -1;
                if(a.start_date < b.start_date) return 1;
                if(a.update_time > b.update_time) return -1;
                if(a.update_time < b.update_time) return 1;
            });
            if(prevReport !== null){
                this.datas.prevReport.push(prevReport)
            }else{
                if(this.datas.selectedZoneReport[0].prev_data_id !== null){ // 저장된 비교 리포트가 있다면
                    this.datas.prevReport = deepClone(this.datas.zoneReports.filter(el => el.report_id === this.datas.selectedZoneReport[0].prev_data_id))

                }else{
                    // 이전 리포트가 없다면 날짜 순
                    this.datas.prevReport = deepClone(this.datas.prevReportLists.filter((item, index) => index === 0))
                }
            }
        },
        async setPrevReportData(){
            this.datas.selectedZoneReport[0].prev_data_id = this.datas.prevReport[0].report_id
            this.datas.selectedRobotData.prevHardWareTitle = this.datas.prevReport[0].current_data !== null? this.datas.prevReport[0].current_data.hardwareTitle : ''
            this.datas.selectedRobotData.prevHardWareComment = this.datas.prevReport[0].current_data !== null? this.datas.prevReport[0].current_data.hardwareComment : ''
            if(this.datas.selectedZoneReport[0].alarm_data && this.datas.prevReport[0].alarm_data){
                this.datas.selectedZoneReport[0].alarm_data.prev_alarm_title = this.datas.prevReport[0].alarm_data.alarmTitle
                this.datas.selectedZoneReport[0].alarm_data.prev_alarm_comment =this.datas.prevReport[0].alarm_data.alarmComment
            }
            this.datas.selectedAtomizerData.prev_atomizer_title = this.datas.prevReport[0].atomizer_data && this.datas.prevReport[0].atomizer_data.atomizer_title ? this.datas.prevReport[0].atomizer_data.atomizer_title : ''
            this.datas.selectedAtomizerData.prev_atomizer_comment = this.datas.prevReport[0].atomizer_data && this.datas.prevReport[0].atomizer_data.atomizer_comment ? this.datas.prevReport[0].atomizer_data.atomizer_comment : ''
            this.datas.selectedRobotData.hardware_data.forEach(robot => {
                if(this.datas.prevReport[0].current_data !== null){
                    this.datas.prevReport[0].current_data.hardware_data.forEach(prev => {
                        if(robot.robot_id === prev.robot_id){
                            prev.current_data.axis_level.forEach((axis,index) => {
                                if(axis !== ''){
                                    robot.current_data.axis_level[index].prev_level = axis.curr_level
                                }
                            })
                            prev.current_data.type.forEach((type, typeindex) => {
                                robot.current_data.type[typeindex].prev_masterjob = type.masterjob
                                robot.current_data.type[typeindex].prev_config = type.config
                                robot.current_data.type[typeindex].prev_cycle_time = type.cycle_time
                                robot.current_data.type[typeindex].previolatedCount = type.violatedCount
                                type.level.forEach((level, levelindex) => {
                                    if(level !== ''){
                                        robot.current_data.type[typeindex].level[levelindex].prev_level = level.curr_level
                                    }
                                })
                            })
                        }
                    })
                }
            })
            await this.response();

        },
        async clickZone(zoneInfo){
            if(!this.datas.loading){
                this.datas.selectedZoneKey = this.datas.selectedZoneKey.length === 0 ? [zoneInfo.key] : (this.datas.selectedZoneKey[0] !== zoneInfo.key ? [zoneInfo.key] : this.datas.selectedZoneKey);
                this.datas.selectedZoneInfo[0].zone_id !== zoneInfo.zone_id && ( this.datas.selectedZoneInfo = [], this.datas.selectedZoneInfo.push(zoneInfo))

                await this.getZoneReport(zoneInfo.zone_id);
                await this.setRobotInfo(zoneInfo.zone_id);
                await this.setZoneInfo(zoneInfo.zone_id);

                if(this.datas.zoneReports.length !== 0){
                    await this.setSelectedZoneReport(this.datas.zoneReports[0].report_id)
                    this.setOpinionItem(this.datas.selectedReportType)
                }else{
                    this.datas.selectedZoneReport = [];
                    this.datas.prevReport = [];
                    this.datas.prevReportLists = [];
                    window.alert(this.$t(`report.common.window.addReport`))
                    this.initializeHeader();
                }
            }
        },

        response(){  // 하위 컴포넌트 반응형
            let temp = [];
            temp = deepClone(this.datas.selectedRobotData)
            this.datas.selectedRobotData = [];
            this.datas.selectedRobotData = temp;
        },
        setRobotId(){
            let robot_id = ''
            for(let i = 0; i < this.datas.selectedRobotData.hardware_data.length; i++){     // 선택된 존에 robot_id
                let tempdata = "'" + this.datas.selectedRobotData.hardware_data[i].robot_id + "'"
                if(i == this.datas.selectedRobotData.hardware_data.length - 1) {
                    robot_id += tempdata
                }
                else {
                    robot_id += (tempdata + ',');
                }
            }
            return robot_id
        },
        clickSaveBtn(){
            window.confirm(this.$t(`common.window.save`)) ? this.saveData() : this.datas.loading = false
        },
        async saveData(){
            this.datas.loading = true;
            if(this.datas.selectedZoneReport[0]!== undefined) {
                switch(this.datas.selectedReportType){
                    case 0 :
                        let typeArr = [];
                        let tempArr = {
                            hardwareTitle : '',
                            hardwareComment : '',
                            prevHardWareTitle: '',
                            prevHardWareComment: '',
                            hardware_data: [],
                            status: 0
                        }

                        for await (let item of this.datas.selectedRobotData.hardware_data){
                            typeArr = [];
                            item.current_data.type.forEach((type,typeIndex) => {
                                typeArr.push({
                                    config : type.config,
                                    prev_config: type.prev_config,
                                    cycle_time: type.cycle_time,
                                    prev_cycle_time: type.prev_cycle_time,
                                    data : typeIndex === 3 ? type.data : null,
                                    level : type.level,
                                    masterjob: type.masterjob,
                                    prev_masterjob: type.prev_masterjob,
                                    robot_id : type.robot_id,
                                    violatedCount : type.violatedCount,
                                    previolatedCount : type.previolatedCount,
                                })
                            })
                            tempArr.hardware_data.push({
                                robot_id : item.robot_id,
                                current_data : {
                                    axis_level : item.current_data.axis_level,
                                    capacitor : item.current_data.capacitor,
                                    coolingfan : item.current_data.coolingfan,
                                    type: typeArr

                                }
                            })
                        }
                        tempArr.hardwareTitle = this.datas.selectedRobotData.hardwareTitle,
                        tempArr.hardwareComment = this.datas.selectedRobotData.hardwareComment
                        tempArr.prevHardWareTitle = this.datas.selectedRobotData.prevHardWareTitle,
                        tempArr.prevHardWareComment = this.datas.selectedRobotData.prevHardWareComment
                        tempArr.status = this.datas.selectedRobotData.status
                        let current_data = JSON.stringify(tempArr)
                        await this.$http.put(`/reportview/renew/report/data`, {
                            reportid: this.datas.selectedZoneReport[0].report_id,
                            zoneid : this.datas.selectedZoneReport[0].zone_id,
                            data : current_data,
                            prevreportid : this.datas.selectedZoneReport[0].prev_data_id,
                            type: 'hardware'
                        })
                    break;

                    case 1 :
                        let temp = {
                            alarmTitle : '',
                            alarmComment: '',
                            prev_alarm_title : '',
                            prev_alarm_comment: '',
                            zoneHeader : '',
                            robotHeader : '',
                            zoneAlarm : [],
                            robotAlarm : [],
                            selectedAlarm : [],
                            status : 0
                        }
                        let tempZoneName = [];
                        let tempRobotName = [];
                        tempZoneName = this.datas.zoneAlarmName.filter(item => item.check !== '')
                        tempRobotName = this.datas.robotAlarmName.filter(item => item.check !== '')
                        temp.zoneHeader = tempZoneName.every(alarm => alarm.check === 'true') ? 'true' : 'false'
                        temp.zoneHeader = this.ui.alarmNameContents.zone.listHeader[0].check === 'true' ? 'true' : 'false'
                        temp.robotHeader = tempRobotName.every(alarm => alarm.check === 'true') ? 'true' : 'false'
                        temp.robotHeader = this.ui.alarmNameContents.robot.listHeader[0].check === 'true' ? 'true' : 'false'
                        temp.zoneAlarm = tempZoneName
                        temp.robotAlarm = tempRobotName
                        temp.selectedAlarm = this.datas.selectedAlarm
                        temp.alarmTitle = this.datas.selectedZoneData.alarmTitle
                        temp.alarmComment = this.datas.selectedZoneData.alarmComment
                        temp.prev_alarm_title = this.datas.selectedZoneData.prev_alarm_title
                        temp.prev_alarm_comment = this.datas.selectedZoneData.prev_alarm_comment
                        temp.status = this.datas.selectedZoneData.status
                        let alarm_data = JSON.stringify(temp)
                        await this.$http.put(`/reportview/renew/report/data`, {
                            reportid: this.datas.selectedZoneReport[0].report_id,
                            zoneid : this.datas.selectedZoneReport[0].zone_id,
                            alarm : alarm_data,
                            prevreportid : this.datas.selectedZoneReport[0].prev_data_id,
                            type: 'alarm'
                        })
                    break;
                    case 2:
                        this.datas.selectedAtomizerData.data.forEach(data => {
                            data.print = data.print ? data.print : [false, false, false, false]
                        })
                        const atomizer_data = {
                            atomizer_title: this.datas.selectedAtomizerData.atomizer_title,
                            atomizer_comment : this.datas.selectedAtomizerData.atomizer_comment,
                            prev_atomizer_title: this.datas.selectedAtomizerData.prev_atomizer_title,
                            prev_atomizer_comment: this.datas.selectedAtomizerData.prev_atomizer_comment,
                            data : this.datas.selectedAtomizerData.data,
                            status: this.datas.selectedAtomizerData.status
                        }

                        await this.$http.put(`/reportview/renew/report/data`, {
                            reportid: this.datas.selectedZoneReport[0].report_id,
                            zoneid : this.datas.selectedZoneReport[0].zone_id,
                            data : JSON.stringify(atomizer_data),
                            prevreportid : this.datas.selectedZoneReport[0].prev_data_id,
                            type: 'atomizer'
                        })
                    break;
                }
            }
            await this.getZoneReport(this.datas.selectedZoneReport[0].zone_id)
            await this.setRobotInfo(this.datas.selectedZoneReport[0].zone_id)
            await this.setZoneInfo(this.datas.selectedZoneReport[0].zone_id);
            await this.setSelectedZoneReport(this.datas.selectedZoneReport[0].report_id);
            await this.setPrevReportList(null);
            this.datas.loading = false;
        },

        onCloseAtomizerPredictModal(data){
            const equals = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
            this.datas.selectedAtomizerData.data.forEach(atomizerItem => {
                atomizerItem.robot_id === data.robot_id && !equals(atomizerItem.print, data.print)  && (atomizerItem.print = data.print , this.saveData())
            })
        },

        async changeSelectedCurrentReport(selectedReport){
            if(!this.datas.loading) {
                this.$store.dispatch('setRenewReportZoneInfos', {
                    zone_key : this.datas.selectedZoneInfo.zone_key,
                    zone_id: selectedReport.zone_id ,
                    report_id : selectedReport.report_id
                });

                await this.getZoneReport(selectedReport.zone_id);
                await this.setRobotInfo(selectedReport.zone_id);
                await this.setZoneInfo(selectedReport.zone_id);
                await this.setSelectedZoneReport(selectedReport.report_id);
                await this.setPrevReportList(null);
                this.datas.prevReport.length > 0 && await this.setPrevReportData();
                this.setOpinionItem(this.datas.selectedReportType)
            }
        },
        async changeSelectedPrevReport(selectedPrevReport){
            
            if(!this.datas.loading){
                await this.setPrevReportList(selectedPrevReport);
                this.datas.prevReport.length > 0 && await this.setPrevReportData();
                await this.confirmAlertLevel();
                await this.getAlarm();
                this.setOpinionItem(this.datas.selectedReportType)
            }
           
        },

        inputZoneOpinion(opinion){
            switch(this.datas.selectedReportType){
                case 0 :
                    if(opinion.hasOwnProperty('title')){
                        this.datas.selectedRobotData.hardwareTitle = opinion.title
                        this.datas.title = opinion.title
                    }
                    if(opinion.hasOwnProperty('comment')){
                        this.datas.selectedRobotData.hardwareComment = opinion.comment
                        this.datas.comment = opinion.comment
                    }
                break;

                case 1 :
                    if(opinion.hasOwnProperty('title')){
                        this.datas.selectedZoneData.alarmTitle = opinion.title
                        this.datas.title = opinion.title
                    }
                    if(opinion.hasOwnProperty('comment')){
                        this.datas.selectedZoneData.alarmComment = opinion.comment
                        this.datas.comment = opinion.comment
                    }
                break;

                case 2 :
                    if(opinion.hasOwnProperty('title')){
                        this.datas.selectedAtomizerData.atomizer_title = opinion.title
                        this.datas.title = opinion.title
                    }
                    if(opinion.hasOwnProperty('comment')){
                        this.datas.selectedAtomizerData.atomizer_comment = opinion.comment
                        this.datas.comment = opinion.comment
                    }
                break;
            default:
            }

        },
        async confirmAlertLevel(){
            this.datas.loading = true
            let accum_array = [];
            this.datas.selectedRobotData.hardware_data.forEach(robotItem => {
                robotItem.current_data.type.forEach(typeItem => {
                    typeItem.level.forEach(levelItem => {
                        levelItem.curr_level === 1 || levelItem.prev_level === 1 ? accum_array.push({robot_id : robotItem.robot_id}) : levelItem
                    })
                })
            })
            if(!isEmpty(accum_array)){
                const result = deepClone(this.datas.selectedRobotData)
                let array = []
                accum_array.forEach(el => {
                    result.hardware_data.forEach(hardwareItem => {
                        el.robot_id === hardwareItem.robot_id  ? array.push(hardwareItem) : array
                    })
                })
                array = array.reduce(function(acc, current) {
                    if (acc.findIndex(({ robot_id }) => robot_id === current.robot_id) === -1) {
                        acc.push(current);
                    }
                    return acc;
                }, []);

                for (let i = 0; i < array.length; i += 1) {
                    const item = array[i];
                    const robot_index = result.hardware_data.findIndex(robot => robot.robot_id === item.robot_id)
                    result.hardware_data[robot_index] = await this.setAxisAvg({item: item})
                }
                this.datas.selectedRobotData = deepClone(result)
                this.datas.loading = false
            }
        },
        clickZoneExportBtn(){
            this.datas.exportDlg = false
            this.datas.selectedZoneReport[0].current_data !== null && this.datas.selectedZoneReport[0].alarm_data !== null ? this.datas.exportDlg = true : window.alert('하드웨어/알람 데이터를 저장해주세요')
        },
        clickAxisExportBtn(axisItem){
            let temp = deepClone(this.datas.selectedRobotData)
            temp.hardware_data.forEach(hardwareInfo => {
                axisItem.robot_id === hardwareInfo.robot_id ? hardwareInfo.current_data.type[axisItem.type_value].level = axisItem.items.item.level : hardwareInfo.current_data.type[axisItem.type_value].level
            })
            this.datas.selectedRobotData = [];
            this.datas.selectedRobotData = deepClone(temp)
            this.saveData();
        }
    }
}
</script>
<style lang="scss" scoped>
    @import './reportresult';
</style>
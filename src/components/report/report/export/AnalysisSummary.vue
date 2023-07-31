<template>
    <v-card color="white" class="summary">
        <v-layout>
            <v-spacer></v-spacer>
            <v-btn
                icon
                @click="clickCloseBtn"
                color="black"
                flat
        >
                <img src="@/images/report/close.png"/>
            </v-btn>
            <v-btn
                icon
                @click="clickSaveBtn"
                color="black"
                flat
            >
                <img src="@/images/report/save-file.png"/>
            </v-btn>
        </v-layout>
        <v-layout class="summary_progress" v-if="datas.progressActive">
            <v-progress-circular
                :size="50"
                :indeterminate="datas.progressIndeterminate"
                color="#2DB67C"
            ></v-progress-circular>
            <span class="summary_progress_text">출력중..</span>
        </v-layout>
        <v-layout :class="['summary_container']">
            <v-layout :class="['summary_container__layout']" column>
                <div ref="report_export">
                    <div v-bind:class="['summary_content']">
                        <v-layout class="report_name_box">
                            <v-flex v-if="prevReport.length > 0" class="prev_report_name">{{prevReport[0].report_name}}</v-flex>
                            <img v-if="prevReport.length > 0" src="@/images/report/right-arrow.png"/>
                            <v-flex class="report_name">{{selectedZoneReport[0].report_name}}</v-flex>
                        </v-layout>
                        <div class="summary_content_title">{{selectedZoneInfo[0].zone_name}} 종합 평가</div>
                        <v-layout column class="content_layout">
                            <div class="content_title">하드웨어 종합 위험도 평가</div>
                            <div class="content_main_report">
                                <hard-ware-analysis
                                    class="content_content"
                                    v-bind:selectedZoneInfo="selectedZoneInfo"
                                    v-bind:selectedZoneReport="selectedZoneReport"
                                    v-bind:prevReport="prevReport"
                                    v-bind:robotData="robotData"
                                    v-bind:tableHeader="tableHeader"
                                    v-bind:tableHeaderDetail="tableHeaderDetail"
                                    v-bind:exportFlag="true"
                                />
                            </div>
                        </v-layout>
                        <v-layout column class="content_layout">
                            <div class="content_title">하드웨어 종합 의견</div>
                            <v-layout>
                                <v-flex v-if="prevReport.length > 0" class="content_sub_report_opinion">
                                    <div class="content_report_name">{{prevReport[0].report_name}}</div>
                                        <report-zone-opinion
                                            v-bind:type="'hardware'"
                                            v-bind:title="ui.hardware.prev_title"
                                            v-bind:comment="ui.hardware.prev_comment"
                                            v-bind:exportFlag="true"
                                        />
                                </v-flex>
                                <img v-if="prevReport.length > 0" src="@/images/report/opinion-right-arrow.png"/>
                                <v-flex class="content_main_report_opinion">
                                    <div class="content_report_name">
                                        {{selectedZoneReport[0].report_name}}
                                    </div>
                                        <report-zone-opinion
                                            v-bind:type="'hardware'"
                                            v-bind:title="ui.hardware.title"
                                            v-bind:comment="ui.hardware.comment"
                                            v-bind:exportFlag="true"
                                        />
                                </v-flex>
                            </v-layout>
                        </v-layout>
                        <v-layout column class="content_layout">
                            <div class="content_title">알람 종합 평가</div>
                            <div class="content_content">
                                <v-layout>
                                    <v-flex class="content_main_report mr-1 content_flex" v-if="datas.zoneAlarmNameData.length > 0">
                                        <alarm-name-table
                                            v-bind:title="ui.alarmNameContents.zone.title"
                                            v-bind:header="ui.alarmNameContents.zone.listHeader"
                                            v-bind:type="'zone'"
                                            v-bind:alarmNameData="datas.zoneAlarmNameData"
                                            v-bind:exportFlag="true"
                                        />
                                    </v-flex>
                                    <v-flex class="content_main_report mr-1 content_flex" v-if="!datas.zoneAlarmNameData.length > 0">
                                        <div class="content_content_noDataAlarm">
                                            <div>존 알람 발생명</div>
                                            <span>선택된 알람이 없습니다.</span>
                                        </div>
                                    </v-flex>
                                    <v-flex class="content_main_report ml-1 content_flex" v-if="datas.robotAlarmNameData.length > 0">
                                        <alarm-name-table
                                            v-bind:title="ui.alarmNameContents.robot.title"
                                            v-bind:header="ui.alarmNameContents.robot.listHeader"
                                            v-bind:type="'robot'"
                                            v-bind:alarmNameData="datas.robotAlarmNameData"
                                            v-bind:exportFlag="true"
                                        />
                                    </v-flex>
                                    <v-flex class="content_main_report mr-1 content_flex" v-if="!datas.robotAlarmNameData.length > 0">
                                        <div class="content_content_noDataAlarm">
                                            <div>로봇 알람 발생명</div>
                                            <span>선택된 알람이 없습니다.</span>
                                        </div>
                                    </v-flex>
                                </v-layout>
                            </div>
                        </v-layout>
                        <v-layout column class="content_layout">
                            <div class="content_title">알람 종합 의견</div>
                            <v-layout>
                                <v-flex v-if="prevReport.length > 0" class="content_sub_report_opinion">
                                    <div class="content_report_name">{{prevReport[0].report_name}}</div>
                                    <report-zone-opinion
                                        v-bind:type="'alarm'"
                                        v-bind:title="ui.alarm.prev_title"
                                        v-bind:comment="ui.alarm.prev_comment"
                                        v-bind:exportFlag="true"
                                    />
                                </v-flex>
                                <img v-if="prevReport.length > 0" src="@/images/report/opinion-right-arrow.png"/>
                                <v-flex class="content_main_report_opinion">
                                    <div class="content_report_name">{{selectedZoneReport[0].report_name}}</div>
                                    <report-zone-opinion
                                        class="content_content"
                                        v-bind:type="'alarm'"
                                        v-bind:title="ui.alarm.title"
                                        v-bind:comment="ui.alarm.comment"
                                        v-bind:exportFlag="true"
                                    />
                                </v-flex>
                            </v-layout>
                        </v-layout>
                    </div>
                    <v-layout column class="content_layout before">
                            <div class="content_title"> 도장기 종합 의견</div>
                            <v-layout>
                                <v-flex v-if="prevReport.length > 0" class="content_sub_report_opinion">
                                    <div class="content_report_name">{{prevReport[0].report_name}}</div>
                                    <report-zone-opinion
                                        v-bind:title="ui.atomizer.prev_title"
                                        v-bind:comment="ui.atomizer.prev_comment"
                                        v-bind:exportFlag="true"
                                    />
                                </v-flex>
                                <img v-if="prevReport.length > 0" src="@/images/report/opinion-right-arrow.png"/>
                                <v-flex class="content_main_report_opinion">
                                    <div class="content_report_name">{{selectedZoneReport[0].report_name}}</div>
                                    <report-zone-opinion
                                        class="content_content"
                                        v-bind:title="ui.atomizer.title"
                                        v-bind:comment="ui.atomizer.comment"
                                        v-bind:exportFlag="true"
                                    />
                                </v-flex>
                            </v-layout>
                        </v-layout>
                    <div class="summary_content_title before" >{{selectedZoneInfo[0].zone_name}} 로봇 종합 분석</div>
                    <div v-for="(item, index) in datas.hardwareItem" :key="index" v-bind:class="[{'after': index !== datas.hardwareItem.length-1}]">
                        <hardware-table
                            v-bind:tableHeaderDetail="tableHeaderDetail"
                            v-bind:hardwareData="item"
                            v-bind:prevReport="prevReport"
                        />
                    </div>
                    <div v-if="chartDatas.length > 0" v-bind:class="['before']">
                        <div class="chart_content_title">{{selectedZoneInfo[0].zone_name}} 하드웨어 차트 종합 분석</div>
                        <div v-for="(item, index) in chartDatas" :key="index" v-bind:class="[index !== chartDatas.length-1 ? 'after' : '']">
                            <div v-for="(value, valueIndex) in item" :key="valueIndex" class="content_layout">
                                <div class="content_title">{{value.info.robot_name}} {{value.info.axis}}축 {{value.info.text}} 분석</div>
                                <div class="content_content content_main_report">
                                    <report-chart
                                        v-bind:mainChartId="value.mainChartId"
                                        v-bind:subChartId="value.subChartId"
                                        v-bind:chartData="value.chartData"
                                        v-bind:chartInfo="value.info"
                                        v-bind:prevChartData="value.prevChartData"
                                        v-bind:prevReport="prevReport"
                                        v-bind:selectedZoneReport="selectedZoneReport"
                                        v-bind:exportFlag="true"
                                    />
                                    <report-chart-info-card
                                        v-bind:chartInfo="value.info"
                                        v-bind:prevReport="prevReport"
                                        v-bind:item="value.item"
                                        v-bind:value="value.value"
                                        v-bind:prevItem="value.prevItem"
                                        v-bind:chartData="value.chartData"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <v-layout column>
                        <div v-if="datas.atomizerItems.length > 0" class="summary_content_title before">{{selectedZoneInfo[0].zone_name}} 도장기 종합 분석</div>
                        <v-layout column v-for="(atomizerItems , atomizerIndex) in datas.atomizerItems" :key="'atomizerRobotItem'+ atomizerIndex"  :class="[atomizerIndex !== datas.atomizerItems.length -1 ? 'after' : '']">
                            <v-layout v-for="atomizerItem in atomizerItems"
                                :key="atomizerItem.robot_id"
                                :class="['atomizer__robotInfo content_layout']"
                                column
                            >
                                <div class="content_title">{{atomizerItem.robot_name}} 도장기 종합 분석
                                    <img v-if="confirmAlertLevel(atomizerItem, atomizerIndex)" src="@/images/report/warning.png"/>
                                </div>
                                <v-layout>
                                    <atomizer-board
                                        :class="['atomizer-board']"
                                        :reportItem="selectedZoneReport[0]"
                                        :prevReport="prevReport.length > 0 ? prevReport[0] : {}"
                                        :selectedZoneItem="datas.zoneItem[0]"
                                        :selectedBoothItem="datas.boothItem[0]"
                                        :robotItem="atomizerItem"
                                    />
                                </v-layout>
                            </v-layout>
                        </v-layout>
                    </v-layout>
                    <div v-if="predictAtomizerItems && predictAtomizerItems.length > 0" class="before">
                        <div class="chart_content_title">{{selectedZoneInfo[0].zone_name}} 도장기 차트 종합 분석</div>
                        <div v-for="(chartData, chartDataIndex) in predictAtomizerItems"  :key="chartDataIndex" :class="[ chartDataIndex !== predictAtomizerItems.length-1 ? 'after' : '']">
                            <v-layout v-for="(predictAtomizerItem, predictAtomizerItemIndex) in chartData"  :key="`${chartDataIndex}+${predictAtomizerItem.robot_id}`+predictAtomizerItemIndex" column class="content_layout" >
                                <div class="content_title">{{predictAtomizerItem.robot_name}} {{predictAtomizerItem.value}} 종합 분석</div>
                                <v-layout :class="['atomizer-predict-modal__contents-data__chart']">
                                    <v-flex v-if="prevReport.length > 0" :class="['atomizer-predict-modal__contents-data__chart__box sub']">
                                        <mix-chart
                                            :chart-id="'atomizer-avg-sub-chart'+ predictAtomizerItemIndex + chartDataIndex"
                                            :chart-title="prevReport[0] ? `${prevReport[0].start_date}~${prevReport[0].end_date}` : ''"
                                            :chart-sub-title="`${selectedZoneInfo[0].zone_name}`+ ' ' + `${predictAtomizerItem.robot_name}` + ' ' + `${predictAtomizerItem.value}`"
                                            :chart-items="predictSubAtomizerItems[chartDataIndex][predictAtomizerItemIndex].data"
                                            :value-type="'atomizer-type'"
                                            :animation-type="true"
                                        >
                                            <list-card
                                                :title="predictAtomizerItem.list_title"
                                                :item="predictAtomizerItem.list_sub_item"
                                                :config="predictAtomizerItem.sub_config"
                                                :count="predictAtomizerItem.sub_count"
                                                :id="'sub'"
                                            />
                                        </mix-chart>
                                    </v-flex>
                                    <v-flex :class="['atomizer-predict-modal__contents-data__chart__box main']">
                                        <mix-chart
                                            :chart-id="'atomizer-avg-chart' + predictAtomizerItemIndex + chartDataIndex"
                                            :chart-title="`${selectedZoneReport[0].start_date} ~ ${selectedZoneReport[0].end_date}`"
                                            :chart-sub-title="`${selectedZoneInfo[0].zone_name}`+ ' ' + `${predictAtomizerItem.robot_name}` + ' ' + `${predictAtomizerItem.value}`"
                                            :chart-items="predictAtomizerItem.data"
                                            :value-type="'atomizer-type'"
                                            :animation-type="true"
                                        >
                                            <list-card
                                                :title="predictAtomizerItem.list_title"
                                                :item="predictAtomizerItem.list_item"
                                                :config="predictAtomizerItem.config"
                                                :count="predictAtomizerItem.count"
                                                :percentItem="predictAtomizerItem.percent"
                                                :id="'main'"
                                            />
                                        </mix-chart>
                                    </v-flex>
                                </v-layout>
                            </v-layout>
                        </div>
                    </div>
                    <div v-if="datas.selectedAlarmList.length > 0" v-bind:class="['before mt-2']">
                        <!--v-bind:class="[{'before': chartDatas.length === 0}]"-->
                        <div class="summary_content_title">{{selectedZoneInfo[0].zone_name}} 알람 발생 목록 분석</div>
                        <div v-for="(item, index) in datas.selectedAlarmList" :key="index"
                            v-bind:class="[{'content_layout after': index !== datas.selectedAlarmList.length-1},{'content_layout': index === datas.selectedAlarmList.length-1}]">
                            <table :class="['alarm_table']">
                                <thead>
                                    <tr>
                                        <th>{{ui.alarmListContents[0].text}}</th>
                                        <th>{{ui.alarmListContents[1].text}}</th>
                                        <th>{{ui.alarmListContents[2].text}}</th>
                                        <th>{{ui.alarmListContents[3].text}}</th>
                                        <th>{{ui.alarmListContents[4].text}}</th>
                                        <th>{{ui.alarmListContents[5].text}}</th>
                                        <th>{{ui.alarmListContents[6].text}}</th>
                                    </tr>
                                </thead>
                                <tbody v-for="(value, valueIndex) in item" :key="valueIndex">
                                    <tr>
                                        <td>{{value.time_stamp}}</td>
                                        <td>{{value.alarm_type_name}}</td>
                                        <td>{{value.alarm_code}}</td>
                                        <td>{{value.alarm_name}}</td>
                                        <td>{{value.zone_name}}</td>
                                        <td>{{value.robot_name}}</td>
                                        <td v-if="value.level == '0'"><img src="@/images/img_alarm_low.png"/></td>
                                        <td v-else-if="value.level == '1'"><img src="@/images/img_alarm_middle.png"/></td>
                                        <td v-else-if="value.type_id !== 0 && value.level == '2'"><img src="@/images/img_alarm_high.png"/></td>
                                        <td v-else-if="value.type_id == 0 && value.level == '2'"><img src="@/images/img_robot_alarm.png"/></td>
                                        <td v-else></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </v-layout>
        </v-layout>
    </v-card>
</template>

<script>
    import { deepClone, setRobotItems } from "@/utils/utils";
    import { isEmpty } from "lodash";
    import { mapGetters } from 'vuex';
    import html2pdf from 'html2pdf.js';
    import HardWareAnalysis from '@/components/report/report/HardWareAnalysis.vue'
    import ReportZoneOpinion from '@/components/report/report/ReportZoneOpinion.vue'
    import AlarmNameTable from '@/components/report/report/AlarmNameTable'
    import HardwareTable from '@/components/report/report/export/HardwareTable.vue'
    import ReportChart from '@/components/report/report/ReportChart.vue'
    import AlarmSelectTable from '@/components/report/report/AlarmSelectTable'
    import ReportChartInfoCard from '@/components/report/report/ReportChartInfoCard.vue'
    import AtomizerBoard from "@/components/report/report/Atomizer/AtomizerBoard.vue";
    import AtomizerPredictModal from "@/components/diagnostics/predict/predict/AtomizerPredictModal";
    import ListCard from "@/components/report/report/ListCard"
    import MixChart from "@/commons/chart/mixchart/MixChart";


    export default {
        components: {
            HardWareAnalysis,
            ReportZoneOpinion,
            AlarmNameTable,
            HardwareTable,
            ReportChart,
            AlarmSelectTable,
            ReportChartInfoCard,
            AtomizerBoard,
            AtomizerPredictModal,
            ListCard,
            MixChart
        },

        props: {
            isOpen: {

            },
            selectedZoneInfo: {

            },
            selectedZoneReport: {

            },
            prevReport: {
                default : []
            },
            robotData: {

            },
            tableHeader: {

            },
            tableHeaderDetail: {

            },
            chartDatas: {

            },
            predictAtomizerItems: {

            },
            predictSubAtomizerItems: {

            },
            atomizerData : {

            }

        },
        data(){
            return {
                ui: {
                    atomizerTypeValueItems: [
                        { id: 'turbine', title: 'TURBINE', value: 'turbine' },
                        { id: 'sa_s', title: 'SA_S', value: 'sa_s' },
                        { id: 'sa_v', title: 'SA_V', value: 'sa_v' },
                        { id: 'hv', title: 'HIGH-VOLTAGE', value: 'hv' }
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
                    alarmListContents: [
                        { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.date`), value: 'time_stamp',sort: false},
                        { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.alarmtypename`), value: 'alarm_type_name', sort: false},
                        { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.alarmcode`), value: 'alarm_code', sort: false},
                        { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.alarmname`), value: 'alarm_name', sort: false},
                        { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.zonename`), value: 'zone_name', sort: false},
                        { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.robotname`), value: 'robot_name', sort: false},
                        { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.level`), value: 'level', sort: false},
                    ],
                    hardware : {
                        title : '',
                        comment: '',
                        prev_title: '',
                        prev_comment: ''
                    },
                    alarm: {
                        title: '',
                        comment: '',
                        prev_title: '',
                        prev_comment: ''
                    },
                    atomizer: {
                        title: '',
                        comment: '',
                        prev_title: '',
                        prev_comment: ''
                    }
                },
                datas: {
                    selectedZoneReport : [],
                    zoneAlarmNameData: [],
                    robotAlarmNameData: [],
                    selectedAlarmList : [],
                    hardwareItem : [],
                    hardwareDetailToggle: false,
                    progressActive : false,
                    progressIndeterminate : false,
                    robotItems: [],
                    zoneItem : [],
                    boothItem : [],
                    atomizerItems: []

                }
            }
        },
        computed:{
            ...mapGetters({
                'boothInfos': 'getRenewBoothInfos',
                'zoneInfos': 'getRenewZoneInfos',
                'robotInfos': 'getRenewRobotInfos'
            }),
        },
        mounted(){
            this.datas.selectedZoneReport = deepClone(this.selectedZoneReport)
            this.setAlarmName();
            this.setHardwareData();
            this.setFactoryInfo();
            this.setAtomizerData();
        },
        watch:{
            isOpen: {
                immediate: true,
                handler(val) {
                    if(val) {

                    }
                }
            },
            selectedZoneReport(){
            },

        },
        methods: {
            setFactoryInfo(){
                const robotItems = setRobotItems(this.robotInfos, this.datas.selectedZoneReport[0].zone_id);
                this.datas.robotItems = robotItems ? robotItems.sort(function (a,b){return a.robot_no < b.robot_no ? -1 : 1}) : [];
                this.datas.zoneItem = this.zoneInfos.filter(zone => zone.zone_id === this.datas.selectedZoneReport[0].zone_id)
                this.datas.boothItem = this.boothInfos.filter(booth => booth.booth_id === this.datas.zoneItem[0].booth_id)
            },

            setAlarmName(){
                this.datas.zoneAlarmNameData = [];
                this.datas.robotAlarmNameData = [];
                this.datas.selectedAlarmList = [];
                let tempAlarm = [];
                let size = 50;
                this.datas.selectedZoneReport.forEach(el => {
                    this.setOpinion(el);
                    tempAlarm = el.alarm_data ? deepClone(el.alarm_data.selectedAlarm) : []
                    if(el.alarm_data && !isEmpty(el.alarm_data.zoneAlarm)){
                        el.alarm_data.zoneAlarm.forEach(zoneAlarm => {zoneAlarm.check === "true" ? this.datas.zoneAlarmNameData.push(zoneAlarm) : zoneAlarm})
                    }

                    if(el.alarm_data && !isEmpty(el.alarm_data.robotAlarm)){
                        el.alarm_data.robotAlarm.forEach(robotAlarm => {robotAlarm.check === "true" ? this.datas.robotAlarmNameData.push(robotAlarm) : robotAlarm})
                    }

                    if(!isEmpty(this.datas.zoneAlarmNameData)){
                        this.datas.zoneAlarmNameData.forEach(zone => {delete zone.check})
                        this.datas.zoneAlarmNameData.length > 5 ? this.datas.zoneAlarmNameData = this.datas.zoneAlarmNameData.slice(0,5) : this.calcuAlarm('zone', this.datas.zoneAlarmNameData);
                    }

                    if(!isEmpty(this.datas.robotAlarmNameData)){
                        this.datas.robotAlarmNameData.forEach(robot => {delete robot.check})
                        this.datas.robotAlarmNameData.length > 5 ? this.datas.robotAlarmNameData = this.datas.robotAlarmNameData.slice(0,5) : this.calcuAlarm('robot', this.datas.robotAlarmNameData);
                    }
                })
                let result = [];
                for(let i = 0; i < tempAlarm.length; i ++){
                    let value = tempAlarm.splice(0,size)
                    result.push(value)
                }
                this.datas.selectedAlarmList = result

            },
            setOpinion(el){
                this.ui.hardware.title = (el.current_data) ? el.current_data.hardwareTitle : ''
                this.ui.hardware.comment = (el.current_data) ? el.current_data.hardwareComment : ''
                this.ui.hardware.prev_title = (el.current_data) ? el.current_data.prevHardWareTitle : ''
                this.ui.hardware.prev_comment = (el.current_data) ? el.current_data.prevHardWareComment : ''
                this.ui.alarm.title = (el.alarm_data) ? el.alarm_data.alarmTitle : ''
                this.ui.alarm.comment = (el.alarm_data) ? el.alarm_data.alarmComment : ''
                this.ui.alarm.prev_title = (el.alarm_data) ? el.alarm_data.prev_alarm_title : ''
                this.ui.alarm.prev_comment = (el.alarm_data) ? el.alarm_data.prev_alarm_comment : ''
                this.ui.atomizer.title = (el.atomizer_data) ? el.atomizer_data.atomizer_title : ''
                this.ui.atomizer.comment = (el.atomizer_data) ? el.atomizer_data.atomizer_comment : ''
                this.ui.atomizer.prev_title = (el.atomizer_data) ? el.atomizer_data.prev_atomizer_title : ''
                this.ui.atomizer.prev_comment = (el.atomizer_data) ? el.atomizer_data.prev_atomizer_comment : ''
            },
            async setHardwareData(){
                this.datas.hardwareItem = [];
                this.spliceArray('hardware', this.datas.hardwareItem)
            },

            async setAtomizerData(){
                this.datas.atomizerItems = [];
                this.atomizerData.data.forEach(el => {
                    Object.assign(el, {robot_name : this.robotInfos.filter(robot => robot.robot_id === el.robot_id)[0].robot_name})
                })
                this.spliceArray('atomizer', this.datas.atomizerItems)
            },

            clickCloseBtn(){
                this.$emit('clickCloseBtn')
            },


            calcuAlarm(type, array){
                const tempIndex = 5 - array.length % 5;
                if(type === 'zone'){
                    for(let i = 0; i < tempIndex; i++){
                        array.push({alarm_type_name: '', alarm_name: '', zone_name: '', sum: '', level: ''})
                    }
                    return array
                }else{
                    for(let i = 0; i < tempIndex; i++){
                        array.push({alarm_name: '', zone_name: '', robot_name: '', sum: ''})
                    }
                    return array
                }
            },
            clickSaveBtn(){
                this.datas.progressActive = true
                this.datas.progressIndeterminate = true
                html2pdf(this.$refs.report_export, {
                    margin: [50,20,10,20],
                    filename: `${this.selectedZoneInfo[0].zone_name}.pdf`,
                    image: { type: 'jpeg', quality: 1},
                    html2canvas: {scrollY: 0, scale: 1.19, dpi: 300 , letterRendering: true},
                    jsPDF: { unit: 'pt', format: 'a2', orientation: 'portrait', compressPDF: true},
			    }).then(res => {
                    this.datas.progressActive = false
                    this.datas.progressIndeterminate =  false
                })
            },

            spliceArray(type, array){
                let size = 6;
                let result = type === 'hardware' ? deepClone(this.robotData) : deepClone(this.atomizerData.data.filter(item => item.tool_id === 0))
                for(let i = 0; i < result.length; i ++){
                    let value = result.splice(0,size)
                    array.push(value)
                }
            },

            confirmAlertLevel(item, idx){
                let result = false;
                if(!isEmpty(this.prevReport)){

                    result = item.violation_count.some(count => count ===1 ) || this.prevReport[0].atomizer_data.data.filter(prevAtomizerItem => prevAtomizerItem.robot_id === item.robot_id)[0].violation_level.some(count => count === 1) ? true : false
                }else{
                    result = item.violation_count.some(count => count ===1 ) ? true : false
                }
                return result

            }
        }
    }
</script>
<style lang="scss" scoped>
    @import './AnalysisSummary.scss'
</style>
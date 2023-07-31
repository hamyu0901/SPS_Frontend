<template>
    <v-layout column v-bind="[initialize, initPredictSetting]">
        <v-layout column>
            <v-layout>
                <v-flex lg3 class="pr-2">
                    <date-picker
                        :conditionalDate="datas.predict.date"
                        v-on:getDate="getPrevDate"
                    ></date-picker>
                </v-flex>
                <v-flex lg3 class="pl-2 pr-2"/>
                <a><img class="pt-1 pl-4 pr-2" src="@/images/selector_icon.png"/></a>
                <v-flex lg2 class="pl-2 pr-2">
                    <selector 
                        class="TorqueRangeSelector" 
                        v-bind:selectorTitle="$t(String(`selector.booth`))" 
                        v-bind:selectorOptions="getBoothInfos"
                        v-bind:selectorTRATarget="datas.predict.booth"
                        v-on:selectedTarget="getTargetBoothId"
                        v-bind:predictInUse="getPredictUse()"
                    ></selector>
                </v-flex>
                <v-flex lg2 class="pl-2 pr-2">
                    <selector 
                        class="TorqueRangeSelector" 
                        v-bind:selectorTitle="$t(String(`selector.zone`))" 
                        v-bind:selectorOptions="getSelectedTargetZoneInfos"
                        v-bind:selectorTRATarget="datas.predict.zone"
                        v-on:selectedTarget="getTargetZoneId"
                        v-bind:predictInUse="getPredictUse()"
                    ></selector>
                </v-flex>
                <v-flex lg2 class="pl-2 pr-2">
                    <selector 
                        class="TorqueRangeSelector" 
                        v-bind:selectorTitle="$t(String(`selector.robot`))" 
                        v-bind:selectorOptions="getSelectedTargetRobotInfos"
                        v-bind:selectorTRATarget="datas.predict.robot"
                        v-on:selectedTarget="getTargetRobotId"
                        v-bind:predictInUse="getPredictUse()"
                    ></selector>
                </v-flex>
                <v-flex lg2 class="pl-2 pr-2">                    
                    <selector 
                        class="TorqueRangeSelector" 
                        v-bind:selectorTitle="ui.selectJobFile"
                        v-bind:selectorOptions="getSelectedTargetJobInfos"
                        v-bind:selectorTRATarget="datas.predict.job"
                        v-on:selectedTarget="getTargetJobFile"
                        v-bind:predictInUse="getPredictUse()"
                    ></selector>
                </v-flex>
                <v-btn class="smallBtn ml-1" @click="searchBtnClicked">{{ui.dayAnalysis}}</v-btn>
                <v-btn class="smallBtn ml-1" @click="searchBtnClickedforSeveral">{{ui.severalAnalysis}}</v-btn>
                <v-btn class="smallBtn ml-1" @click="exportExcel" :disabled="datas.flag.excel === false"><a class="pt-1"><img :src="excelBtnIcon"></a></v-btn>
            </v-layout>
            <comfirm-dlg
                v-bind:comfirmDlgType="'jobUpdate'"
                v-bind:comfirmDlgFlag="comfirmDlgFlag"
                v-on:comfirmFlag="getComfirmFlag"
                v-on:closeFlag="comfirmDlgFlag = false"
            ></comfirm-dlg>
        </v-layout>
        <v-layout class="pt-2">
            <v-layout class="infoArea">
                <v-flex lg2>
                    <v-card elevation="0" :style="{ height: ui.card.zoneHeight, width: ui.card.width, backgroundColor: ui.card.color }">
                        <v-layout column align-center justify-center>
                            <p>{{ui.info.robotname}}</p>
                            <p>{{datas.info.robotname}}</p>
                        </v-layout>
                    </v-card>
                </v-flex>
                <v-flex lg2 class="pl-2">
                    <v-card elevation="0" :style="{ height: ui.card.zoneHeight, width: ui.card.width, backgroundColor: ui.card.color }">
                        <v-layout column align-center justify-center>
                            <p>{{ui.info.rcname}}</p>
                            <p>{{datas.info.rcname}}</p>
                        </v-layout>
                    </v-card>
                </v-flex>
                <v-flex lg2 class="pl-2">
                    <v-card elevation="0" :style="{ height: ui.card.zoneHeight, width: ui.card.width, backgroundColor: ui.card.color }">
                        <v-layout column align-center justify-center>
                            <p>{{ui.info.robotmodel}}</p>
                            <p>{{datas.info.robotmodel}}</p>
                        </v-layout>
                    </v-card>
                </v-flex>
                <v-flex lg2 class="pl-2">
                    <v-card elevation="0" :style="{ height: ui.card.zoneHeight, width: ui.card.width, backgroundColor: ui.card.color }">
                        <v-layout column align-center justify-center>
                            <p>{{ui.info.atommodel}}</p>
                            <p>{{datas.info.atommodel}}</p>
                        </v-layout>
                    </v-card>
                </v-flex>
                <v-flex lg2 class="pl-2">
                    <v-card elevation="0" :style="{ height: ui.card.zoneHeight, width: ui.card.width, backgroundColor: ui.card.color }">
                        <v-layout column align-center justify-center>
                            <p>{{ui.info.ip}}</p>
                            <p>{{datas.info.ip}}</p>
                        </v-layout>
                    </v-card>
                </v-flex>
                <v-flex lg2 class="pl-2">
                    <v-card elevation="0" :style="{ height: ui.card.zoneHeight, width: ui.card.width, backgroundColor: ui.card.color }">
                        <v-layout column align-center justify-center>
                            <p>{{ui.info.installdate}}</p>
                            <p>{{datas.info.installdate}}</p>
                        </v-layout>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-layout>
        <v-layout class="pt-3" column>
            <v-layout class="pb-2">
                <p 
                v-bind:style="styleObject"
                class="pl-1 pt-2">{{ui.torqueRange}}</p>
                <v-spacer/>
                <div class="pr-2" v-for="dataByAxis in datasByAxis" :key="dataByAxis.id">
                    <v-btn class="axisBtn" :ref="dataByAxis.id" @click="axisBtnClicked(dataByAxis)" flat :disabled="datas.flag.axis"> {{dataByAxis.title}} </v-btn>
                </div>
                <div class="pr-2">
                    <v-btn class="axisBtn warningValueBtn" ref="warningValueBtn" @click="warningValueClicked" flat :disabled="datas.flag.warn"> {{ui.warningValue}} </v-btn>
                </div>
            </v-layout>
            <v-layout class="subTitle pl-1" v-if="selectedWorkDatas != null">
                <p class="pr-2">{{'JOB  '+ selectedWorkDatas.job_name}}</p>
                <p class="pr-2">{{'DATE  '+ selectedWorkDatas.selectedDate}}</p>
                <p class="pr-2">{{'BOOTH  '+ selectedWorkDatas.booth_name}}</p>
                <p class="pr-2">{{'ZONE  '+ selectedWorkDatas.zone_name}}</p>
                <p>{{'ROBOT  '+ selectedWorkDatas.robot_name}}</p>
            </v-layout>
            <torque-range-chart
                v-bind:chartId="'torqueRangeChart'"
                v-bind:chartHeight="chartHeight"
                v-bind:torqueDatas="torqueValueDatas"
                v-bind:warningDatas="chartWarningValueDatas"
                v-bind:warningFlag="chartWarningFlag"
                v-on:selectValueIndex="selectedChartValueIndex"
            ></torque-range-chart>
            <v-layout class="pt-2" align-center justify-center>
                <v-spacer/>
                <v-flex lg1>
                    <p class="WVOffsetText">{{ui.warningValueOffset}}</p>
                </v-flex>            
                <v-flex lg1 class="pl-2">
                    <count-range
                        v-bind:hintValue="0"
                        v-on:targetValue="getWarningMargin"
                        :disabled="getFlagExcel() == false"
                    ></count-range>
                </v-flex>
                <v-btn class="violationBtn ml-2 elevation-0" :color="ui.violationApplyBtnColor" :disabled="getFlagExcel() == false" @click="warningValueApplyBtnClicked">{{ui.warningValueAccept}}</v-btn>
                <v-btn class="violationBtn ml-2 elevation-0" :color="ui.violationSaveBtnColor" :disabled="getFlagExcel() == false" @click="warningValueSaveBtnClicked">{{ui.warningValueSave}}</v-btn>
            </v-layout>
            <v-layout class="pt-2">
                <torque-range-table
                    v-bind:searchFlag="searchFlag"
                    v-bind:headerDatas="torqueRangeTableHeaderDatas"
                    v-bind:contentDatas="torqueRangeTableContentDatas"
                    v-bind:warningMargin="warningMargin"
                    v-bind:warningTorqueDatas="tableWarningValueDatas"
                    v-bind:warningFlag="tableWarningFlag"
                    v-bind:selectedValueIndex="selectedChartIndex"
                    v-bind:warningValueApplyFlag="warningValueApplyFlag"
                    v-on:searchFlag="changeSearchFlag"
                    v-on:warningFlag="changeTableWarningFlag"
                    v-on:warningTorqueDatas="getWarningTorqueDatas"
                ></torque-range-table>
            </v-layout>
            <loading-dlg
                v-bind:loadingFlag="datas.event.dialog"
            ></loading-dlg>
        </v-layout>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'
import DatePicker from '@/commons/DatePicker'
import Selector from '@/commons/Selector'
import SearchBtn from '@/commons/SearchBtn'
import CountRange from '@/commons/CountRange' 
import GridTable from '@/commons/GridTable'
import TorqueRangeChart from '@/components/diagnostics/torquerange/torquerange/TorqueRangeChart'
import TorqueRangeTable from '@/components/diagnostics/torquerange/torquerange/TorqueRangeTable'
import SettingInfoTable from '@/components/diagnostics/torquerange/torquerange/SettingInfoTable'
import ComfirmDlg from '@/commons/ComfirmDlg'
import LoadingDlg from '@/commons/LoadingDlg'
export default {
    components: {DatePicker, Selector, SearchBtn, CountRange, GridTable, TorqueRangeChart, TorqueRangeTable, SettingInfoTable, ComfirmDlg, LoadingDlg},
    data() {
        return {
            ui: {
                jobUpdate: this.$t(`diagnostics.torqueRange.jobUpdate`),
                dayAnalysis: this.$t(`diagnostics.torqueRange.dayAnalysis`),
                severalAnalysis: this.$t(`diagnostics.torqueRange.severalAnalysis`),
                selectJobFile: this.$t(`diagnostics.torqueRange.selectJobFile`),
                torqueRange: this.$t(`diagnostics.torqueRange.torqueRange`),
                jobExecutionText: this.$t(`diagnostics.torqueRange.jobExecutionText`),
                warningValue: this.$t(`diagnostics.torqueRange.warningValue`),
                warningValueOffset: this.$t(`diagnostics.torqueRange.warningValueOffset`),
                warningValueAccept: this.$t(`diagnostics.torqueRange.warningValueAccept`),
                warningValueSave: this.$t(`diagnostics.torqueRange.warningValueSave`),
                card: {
                    zoneWidth: '100%',
                    zoneHeight: '100%',
                    height: '100%',
                    width: '100%',
                    color: ''
                },
                info: {
                    robotname: this.$t(`diagnostics.torquedata.settinginfotable.robotname`),
                    rcname: this.$t(`diagnostics.torquedata.settinginfotable.modelname`),
                    robotmodel: this.$t(`diagnostics.torquedata.settinginfotable.robotmodel`),
                    atommodel: this.$t(`diagnostics.torquedata.settinginfotable.atomizermodel`),
                    ip: this.$t(`diagnostics.torquedata.settinginfotable.ipaddress`),
                    installdate: this.$t(`diagnostics.torquedata.settinginfotable.installdate`)
                },
                select: {
                    target: '',
                    name: this.$t(`selector.booth`)
                },
                violationApplyBtnColor: "",
                violationSaveBtnColor: ""
            },
            datas: {
                info: {
                    robotname: null,
                    rcname: null,
                    robotmodel: null,
                    atommodel: null,
                    ip: null,
                    installdate: null
                },
                flag: {
                    excel: false,
                    axis: true,
                    warn: true,
                    predict: false,
                    isSeveral: false,
                },
                event: {
                    dialog: false
                },
                predict: {
                    date: null,
                    booth: null,
                    zone: null,
                    robot: null,
                    job: null
                },
                cycle: 0,
            },
            prevDate: '',
            searchBtnIcon: require("@/images/search_icon.png"),
            excelBtnIcon: require("@/images/excel_icon.png"),
            searchFlag: false,
            targetBoothId: '',
            targetZoneId: '',
            targetRobotId: '',
            targetJobFile: '',
            cardHeight: 300,
            chartHeight: 570,
            jobInfoDatas: null,
            axisNum: 1,
            warningMargin: 0,
            selectedChartIndex: '',
            warningMinDatas: [],
            warningMaxDatas: [],
            chartWarningValueDatas: null,
            tableWarningValueDatas: null,
            torqueValueDatas: null,
            warningValueApplyFlag: false,
            chartWarningFlag: false,
            tableWarningFlag: false,
            warningAxisInfos: [],
            getSelectedTargetZoneInfos: [],
            getSelectedTargetRobotInfos: [],
            getSelectedTargetJobInfos: [],
            torqueRangeTableHeaderDatas: [],
            torqueRangeTableContentDatas: [],
            selectedWorkDatas: null,
            getJobInfos: [],
            datasByAxis: [
                {id: '1', title: this.$t(`diagnostics.torquedata.loadfactorbyaxis.1axis`), active: false},
                {id: '2', title: this.$t(`diagnostics.torquedata.loadfactorbyaxis.2axis`), active: false},
                {id: '3', title: this.$t(`diagnostics.torquedata.loadfactorbyaxis.3axis`), active: false},
                {id: '4', title: this.$t(`diagnostics.torquedata.loadfactorbyaxis.4axis`), active: false},
                {id: '5', title: this.$t(`diagnostics.torquedata.loadfactorbyaxis.5axis`), active: false},
                {id: '6', title: this.$t(`diagnostics.torquedata.loadfactorbyaxis.6axis`), active: false},
                {id: '7', title: this.$t(`diagnostics.torquedata.loadfactorbyaxis.7axis`), active: false}
            ],
            styleObject: null,
            comfirmDlgFlag: false,
        }
    },

    mounted() {
        this.initializeStyle();
    },

    computed: {
        ...mapGetters({
            baseUrl: 'getBaseUrl',
            getFactoryId: 'getFactoryId',
            getBoothInfos: 'getBoothInfos',
            getZoneInfos: 'getZoneInfos',
            getRobotInfos: 'getRobotInfos'     
        }),

        initialize() {
            this.setFlagExcel(true);
        },

        jobUpdateIcon() {
            return 'arrow_upward';
        },

        initPredictSetting() {
            if (this.fromPredict()) {
                this.prevDate =  this.datas.predict.date = this.$route.query.date;
                for (let i = 0; i < this.getBoothInfos.length; ++i) {
                    if (this.getBoothInfos[i].id === this.$route.query.boothid) {
                        this.datas.predict.booth = {
                            name: this.getBoothInfos[i].name,
                            target: this.getBoothInfos[i].id
                        }
                        this.setBoothID(this.getBoothInfos[i].id);
                    }
                }
                for (let i = 0; i < this.getZoneInfos.length; ++i) {
                    if (this.getZoneInfos[i].id === this.$route.query.zoneid) {
                        this.datas.predict.zone = {
                            name: this.getZoneInfos[i].name,
                            target: this.getZoneInfos[i].id
                        }
                        this.setZoneID(this.getZoneInfos[i].id);
                    }
                }
                for (let i = 0; i < this.getRobotInfos.length; ++i) {
                    if (this.getRobotInfos[i].id === this.$route.query.robotid) {
                        this.datas.predict.robot = {
                            name: this.getRobotInfos[i].name,
                            target: this.getRobotInfos[i].id
                        }
                        this.setRobotID(this.getRobotInfos[i].id);
                    }
                }                
                this.$http.get(`/diagnostics/joblist/factoryid/${this.getFactoryId}/boothid/${this.getBoothID()}/zoneid/${this.getZoneID()}/robotid/${this.getRobotID()}/date/${this.prevDate}`)
                .then((result) => {
                    if(result.data.length > 0) {
                        let tempJobList = [];
                        result.data.forEach(joblist => {
                            tempJobList.push({ id: joblist.job_name, name: joblist.job_name });
                        })
                        this.getJobInfos = tempJobList;
                        for (let i = 0; i < this.getJobInfos.length; ++i) {
                            if (this.getJobInfos[i].id === this.$route.query.job) {
                                this.datas.predict.job = {
                                    name: this.getJobInfos[i].name,
                                    target: this.getJobInfos[i].id
                                }
                                this.setJob(this.getJobInfos[i].name);
                                this.searchBtnClicked();
                            }
                        }
                    }
                })
            }
        },
    },

    methods: {
        initializeStyle() {
            this.styleObject = this.$style.common.titleObjectItemColor;         
            this.ui.card.color = this.$style.diagnostics.torqueRangeCardColor;
            this.ui.violationApplyBtnColor = this.$style.diagnostics.torqueRangeItemApplyButtonBackgroundColor;
            this.ui.violationSaveBtnColor = this.$style.diagnostics.torqueRangeItemSaveButtonBackgroundColor;
            document.documentElement.style.setProperty("--subTitleColor", this.$style.diagnostics.torqueRangeItemSubTitleColor);
            document.documentElement.style.setProperty("--infoTextColor", this.$style.diagnostics.torqueRangeItemInfoTextColor);
            document.documentElement.style.setProperty("--violationOffSetTextColor", this.$style.diagnostics.torqueRangeItemViolationOffSetTextColor);
            document.documentElement.style.setProperty("--buttonColor", this.$style.diagnostics.torqueRangeItemButtonColor);
            document.documentElement.style.setProperty("--buttonBackgroundColor", this.$style.diagnostics.torqueRangeItemButtonBackgroundColor);
            document.documentElement.style.setProperty("--btnAxisBorderColor", this.$style.common.axisButtonItemBorderColor);
            document.documentElement.style.setProperty("--axisBtnHoverBackgroundColor", this.$style.common.axisButtonItemActiveBackgroundColor);
            document.documentElement.style.setProperty("--axisBtnHoverColor", this.$style.common.axisButtonItemActiveColor);
        },
        fromPredict() {
            if ('axis' in this.$route.query) {
                this.setPredictUse(true);
                return true;
            }
            else {
                this.setPredictUse(false);
                return false;
            }
        },

        setPredictUse(flag) {
            this.datas.flag.predict = flag;
        },

        getPredictUse() {
            return this.datas.flag.predict;
        },

        setBoothID(id) {
            this.targetBoothId = id;
        },

        getBoothID() {
            return this.targetBoothId;
        },

        setZoneID(id) {
            this.targetZoneId = id;
        },

        getZoneID() {
            return this.targetZoneId;
        },

        setRobotID(id) {
            this.targetRobotId = id;
        },

        getRobotID() {
            return this.targetRobotId;
        },

        setJob(name) {
            this.targetJobFile = name;
        },

        getJob() {
            return this.targetJobFile;
        },

        initTableWarningValueDatas() {
            this.tableWarningValueDatas = null;
        },

        initSettingInfoDatas() {
            this.datas.info.robotname = '';
            this.datas.info.rcname = '';
            this.datas.info.robotmodel = '';
            this.datas.info.atommodel = '';
            this.datas.info.ip = '';
            this.datas.info.installdate = '';
        },

        clearChartData() {
            this.torqueValueDatas = [];
            this.chartWarningValueDatas = [];
            this.torqueValueDatas.push('');            
            this.chartWarningValueDatas.push('');
        },

        setLoadingDialog(flag) {
            this.datas.event.dialog = flag;
        },

        getPrevDate(prevDate) {
            this.prevDate = prevDate;
            this.setFlagExcel(false);
            this.setDisableAxis(true);
        },

        getTargetBoothId(targetId) {
            this.getSelectedTargetZoneInfos = [];
            this.setBoothID(targetId.target);
            for (let i = 0; i < this.getZoneInfos.length; i++) {
                if (this.getZoneInfos[i].booth == this.getBoothID()) {
                    this.getSelectedTargetZoneInfos.push(this.getZoneInfos[i]);
                }
            }
            if (!this.fromPredict()) {
                this.setFlagExcel(false);
                this.setDisableAxis(true);
            }
        },

        getTargetZoneId(targetId) {
            this.getSelectedTargetRobotInfos = [];
            this.setZoneID(targetId.target);
            for (let i = 0; i < this.getRobotInfos.length; i++) {
                if (this.getRobotInfos[i].zone == this.getZoneID()) {
                    this.getSelectedTargetRobotInfos.push(this.getRobotInfos[i]);
                }
            }
            if (!this.fromPredict()) {
                this.setFlagExcel(false);
                this.setDisableAxis(true);
            }
        },

        getTargetRobotId(targetId) {
            this.setRobotID(targetId.target);
            if (this.getFactoryId != '' && this.getRobotID() != undefined) {
                this.getJobList();
            } 
            else {
                this.getSelectedTargetJobInfos = [];   
            }
            if (!this.fromPredict()) {
                this.setFlagExcel(false);
                this.setDisableAxis(true);
            }
        },

        getTargetJobFile(targetJobFlie) {
            this.setJob(targetJobFlie.target);
            if (!this.fromPredict()) {
                this.setFlagExcel(false);
                this.setDisableAxis(true);
            }
        },

        getJobList() {
            let tempJobList = [];
            this.$http.get(`/diagnostics/joblist/factoryid/${this.getFactoryId}/boothid/${this.getBoothID()}/zoneid/${this.getZoneID()}/robotid/${this.getRobotID()}/date/${this.prevDate}`)
            .then((result) => {
                if(result.data.length > 0) {
                    result.data.forEach(joblist => {
                        tempJobList.push({id: joblist.job_name, name: joblist.job_name})
                    });
                    this.getSelectedTargetJobInfos = tempJobList;  
                } else {
                    this.getSelectedTargetJobInfos = [];
                }              
            }) 
        },

        jobUpdateBtnClicked() {
            if (this.prevDate != undefined && this.getBoothID() != undefined && this.getZoneID() != undefined && this.getRobotID() != undefined) {
                this.comfirmDlgFlag = true;
            } 
            else {
                this.$popmsg(this.$t(`diagnostics.torqueRange.popMsg.jobNotUpdate`));
            }
        },

        jobUpdate() {
            this.setLoadingDialog(true);
            this.$http.post(`/diagnostics/job`, {
                    'factoryid': this.getFactoryId,
                    'date': this.prevDate,
                    'boothid': this.getBoothID(),
                    'zoneid': this.getZoneID(),
                    'robotid': this.getRobotID()
                })
                .then((result) => {
                    this.$popmsg(this.$t(`diagnostics.torqueRange.popMsg.jobUpdate`));
                    this.getJobList();
                    this.setLoadingDialog(false);
                })  
                .catch((error) => {
                    this.$log.error(error); 
                }) 
        },

        getComfirmFlag() {
            this.jobUpdate();
            this.comfirmDlgFlag = false;
        },

        changeSearchFlag() {
            this.searchFlag = false;
        },

        setFlagExcel(flag) {
            this.datas.flag.excel = flag;
        },
        getFlagExcel() {
            return this.datas.flag.excel;
        },

        setDisableAxis(flag) {
            this.datas.flag.axis = flag;
            this.datas.flag.warn = flag;
        },

        setDisableOnlyWarn(flag) {
            this.datas.flag.warn = flag;
        },

        searchBtnClicked() {
            this.setFlagExcel(true);
            this.setDisableAxis(false);
            this.initTableWarningValueDatas();
            if (this.prevDate != undefined && this.getBoothID() != undefined && this.getZoneID() != undefined && this.getRobotID() != undefined && this.getJob() != undefined) {
                this.selectedWorkDatas = {};
                this.selectedWorkDatas['selectedDate'] = this.prevDate;
                this.selectedWorkDatas['booth_name'] = this.getBoothName(this.getBoothID());
                this.selectedWorkDatas['zone_name'] = this.getZoneName(this.getZoneID());
                this.selectedWorkDatas['robot_name'] = this.getRobotName(this.getRobotID());
                this.selectedWorkDatas['job_name'] = this.getJob();
                this.getWarningAxisInfos();
                this.axisNum = 1;
                this.warningValueApplyFlag = false;
                this.updateSettingData();
                this.getTorqueRangeTableDatas();
                this.axisBtnHighLight();
            } 
            else {
                this.torqueRangeTableHeaderDatas = [];
                this.torqueRangeTableContentDatas = [];
                this.torqueValueDatas = null;
                this.selectedWorkDatas = null;
                this.initSettingInfoDatas();
                this.axisBtnInitialize();
                this.searchFlag = false;
                this.setDisableAxis(true);
                this.$popmsg(this.$t(`diagnostics.torqueRange.popMsg.checkSearchData`));
            }
        },
        searchBtnClickedforSeveral() {
            this.setFlagExcel(true);
            this.setDisableAxis(false);
            this.initTableWarningValueDatas();
            if (this.prevDate != undefined && this.getBoothID() != undefined && this.getZoneID() != undefined && this.getRobotID() != undefined && this.getJob() != undefined) {
                this.selectedWorkDatas = {};
                this.selectedWorkDatas['selectedDate'] = this.prevDate;
                this.selectedWorkDatas['booth_name'] = this.getBoothName(this.getBoothID());
                this.selectedWorkDatas['zone_name'] = this.getZoneName(this.getZoneID());
                this.selectedWorkDatas['robot_name'] = this.getRobotName(this.getRobotID());
                this.selectedWorkDatas['job_name'] = this.getJob();
                this.getWarningAxisInfos();
                this.axisNum = 1;
                this.warningValueApplyFlag = false;
                this.updateSettingData();
                this.getTorqueRangeTableDatasforSeveral();
                this.axisBtnHighLight();
            } 
            else {
                this.torqueRangeTableHeaderDatas = [];
                this.torqueRangeTableContentDatas = [];
                this.torqueValueDatas = null;
                this.selectedWorkDatas = null;
                this.initSettingInfoDatas();
                this.axisBtnInitialize();
                this.searchFlag = false;
                this.setDisableAxis(true);
                this.$popmsg(this.$t(`diagnostics.torqueRange.popMsg.checkSearchData`));
            }
        },

        getWarningAxisInfos() {
            this.setDisableOnlyWarn(true);
            let postDatas = {};
            this.warningAxisInfos = [];
            postDatas['factoryid'] = this.getFactoryId;
            postDatas['boothid'] = this.getBoothID();
            postDatas['zoneid'] = this.getZoneID();
            postDatas['robotid'] = this.getRobotID();
            postDatas['jobname'] = this.getJob();
            this.$http.post(`${this.baseUrl}/diagnostics/torquerange/data/table/warning/axis/from`, postDatas).then((result) => {
                if(result.data != "") {
                    this.warningAxisInfos = result.data;
                    this.checkWarningActive(this.axisNum);
                }
            }).catch((error) => {
                this.$log.error(error);
            })
        },

        checkWarningActive(axis) {
            for(let i = 0; i < this.warningAxisInfos.length; i++) {
                if(axis == this.warningAxisInfos[i].axis) {
                    this.setDisableOnlyWarn(false);
                    return;
                }
            }
            this.$refs.warningValueBtn.$el.style.backgroundColor = this.$style.common.axisButtonItemBackgroundColor;
            this.$refs.warningValueBtn.$el.style.color = this.$style.common.axisButtonItemColor;
            this.$refs.warningValueBtn.$el.style.border = "";
            this.setDisableOnlyWarn(true);
            return;
        },
        setSeveralFlag(flag) {
            this.datas.flag.isSeveral = flag;
        },
        isSeveral() {
            return this.datas.flag.isSeveral;
        },
        getTorqueRangeTableDatas() {
            this.setLoadingDialog(true);
            this.chartWarningFlag = false;
            this.$http.get(`/diagnostics/torquerange/data/trend/factoryid/${this.getFactoryId}/boothid/${this.getBoothID()}/zoneid/${this.getZoneID()}/robotid/${ this.getRobotID()}/axis/${this.axisNum}/jobname/${this.getJob()}/date/${this.prevDate}`)
            .then((result) => {
                if (result.data == '') {
                    this.torqueRangeTableHeaderDatas = [];
                    this.torqueRangeTableContentDatas = [];
                    this.clearChartData();
                    this.setDisableOnlyWarn(true);
                    this.setFlagExcel(false);
                    this.setDisableAxis(true);
                    this.setLoadingDialog(false);   
                    this.$popmsg(this.$t(`diagnostics.torqueRange.popMsg.trendData`));
                }
                else {
                    this.torqueRangeTableHeaderDatas = [];
                    this.torqueRangeTableContentDatas = [];
                    this.warningMinDatas = [];
                    this.warningMaxDatas = [];
                    let tempDatas = [];
                    for (let i = 0; i < result.data[0].stepno.length; i++) {
                        if(result.data[0].stepno[i] > 0) {
                            this.torqueRangeTableHeaderDatas.push({ stepno: result.data[0].stepno[i] });
                            tempDatas.push({stepno: result.data[0].stepno[i], min: result.data[0].min[i], max: result.data[0].max[i]});
                        }
                    }
                    this.torqueRangeTableContentDatas = tempDatas;
                    this.torqueValueDatas = tempDatas;
                    this.searchFlag = true;
                    this.setSeveralFlag(false);                    
                    if (this.fromPredict()) {
                        this.warningValueClicked();
                    }
                }
                this.setLoadingDialog(false);
            }).catch(error => {
                this.setLoadingDialog(false);
                this.$log.error(error);
            })
        },
        getTorqueRangeTableDatasforSeveral() {
            this.setLoadingDialog(true);
            this.$http.get(`/diagnostics/torquerange/data/week/trend/factoryid/${this.getFactoryId}/boothid/${this.getBoothID()}/zoneid/${this.getZoneID()}/robotid/${ this.getRobotID()}/axis/${this.axisNum}/jobname/${this.getJob()}/date/${this.prevDate}`)
            .then((result) => {
                if (result.data == '') {
                    this.torqueRangeTableHeaderDatas = [];
                    this.torqueRangeTableContentDatas = [];
                    this.clearChartData();
                    this.setDisableOnlyWarn(true);
                    this.setFlagExcel(false);
                    this.setDisableAxis(true);
                    this.setLoadingDialog(false);
                    this.$popmsg(this.$t(`diagnostics.torqueRange.popMsg.trendData`));
                } else {
                    this.torqueRangeTableHeaderDatas = [];
                    this.torqueRangeTableContentDatas = [];
                    this.warningMinDatas = [];
                    this.warningMaxDatas = [];
                    let tempDatas = [];
                    for (let i = 0; i < result.data[0].stepno.length; i++) {
                        if(result.data[0].stepno[i] > 0) {
                            this.torqueRangeTableHeaderDatas.push({ stepno: result.data[0].stepno[i] });
                            tempDatas.push({stepno: result.data[0].stepno[i], min: result.data[0].min[i], max: result.data[0].max[i]});
                        }
                    }
                    this.torqueRangeTableContentDatas = tempDatas;
                    this.torqueValueDatas = tempDatas;
                    this.chartWarningFlag = false;
                    this.searchFlag = true;
                    this.setSeveralFlag(true);                    
                    if (this.fromPredict()) {
                        this.warningValueClicked();
                    }
                }
                this.setLoadingDialog(false);
            }).catch(error => {
                this.setLoadingDialog(false);
                this.$log.error(error);
            })
        },
      
        getWarningTorqueDatas(warningMinDatas, warningMaxDatas) {
            this.warningMinDatas = [];
            this.warningMaxDatas = [];
            this.warningMinDatas = warningMinDatas;
            this.warningMaxDatas = warningMaxDatas;
        },

        checkTargetDatas(boothId, zoneId, robotId, prevdate) {
            var postDatas = {'factoryid': `${this.getFactoryId}`, 'prevtime': prevdate};
            if (boothId != undefined) {
                postDatas['boothid'] = boothId;
            }   
            if (zoneId != undefined) {
                postDatas['zoneid'] = zoneId;
            }
            if (robotId != undefined) {
                postDatas['robotid'] = robotId;
            }
            return postDatas;
        },

        checkWarningDatas(boothID, zoneID, robotID, jobName, Axis) {
            return {
                'factoryid': this.getFactoryId,
                'boothid': boothID,
                'zoneid': zoneID,
                'robotid': robotID,
                'jobname': jobName,
                'axis': Axis
            };
        },

        axisBtnHighLight() {
            let index = Object.keys(this.$refs)[0]; 
            this.$refs.warningValueBtn.$el.style.backgroundColor = this.$style.common.axisButtonItemBackgroundColor;
            this.$refs.warningValueBtn.$el.style.color = this.$style.common.axisButtonItemColor;
            this.$refs.warningValueBtn.$el.style.border = "";

            this.$refs[index][0].$el.style.backgroundColor = this.$style.common.axisButtonItemActiveBackgroundColor;
            this.$refs[index][0].$el.style.color = this.$style.common.axisButtonItemActiveColor;
            this.$refs[index][0].$el.style.border = 0;

            this.datasByAxis[0].active = true;
                    
            for(let i = 0; i < Object.keys(this.$refs).length-1; i++) {
                if(i != 0) {
                    this.$refs[i + 1][0].$el.style.backgroundColor =  this.$style.common.axisButtonItemBackgroundColor;
                    this.$refs[i + 1][0].$el.style.color = this.$style.common.axisButtonItemColor;
                    this.$refs[i + 1][0].$el.style.border = "";    
                }
                this.datasByAxis[i].active = false;
            }
        },

        axisBtnClicked(axisData) {
            this.initTableWarningValueDatas();
            this.warningValueApplyFlag = false;
            this.chartWarningFlag = false;
            let index = Object.keys(this.$refs);
            this.checkWarningActive(axisData.id);   
            for (let i = 1; i <= index.length-1; i++) {
                if (axisData.id == i) {
                    this.axisNum = i;
                    this.$refs[i][0].$el.style.backgroundColor = this.$style.common.axisButtonItemActiveBackgroundColor;
                    this.$refs[i][0].$el.style.color = this.$style.common.axisButtonItemActiveColor;
                    this.$refs[i][0].$el.style.border = 0;
                    this.datasByAxis[i-1].active = true;
                    if (this.isSeveral()) {
                        this.getTorqueRangeTableDatasforSeveral();
                    } else {
                        this.getTorqueRangeTableDatas();
                    }
                } 
                else {
                    this.$refs[i][0].$el.style.backgroundColor =  this.$style.common.axisButtonItemBackgroundColor;
                    this.$refs[i][0].$el.style.color = this.$style.common.axisButtonItemColor;
                    this.$refs[i][0].$el.style.border = "";  
                    this.datasByAxis[i-1].active = false;
                }
            }
        },

        axisBtnInitialize() {
            for(let i = 0; i < this.datasByAxis.length; i++) {
                this.$refs[i+1][0].$el.style.color = "";
                this.$refs[i+1][0].$el.style.border = "";
                this.datasByAxis[i].active = false;
            }
            this.$refs.warningValueBtn.$el.style.color = "";
            this.$refs.warningValueBtn.$el.style.border = "";
            this.setFlagExcel(false);
        },

        warningValueClicked() {
            if (this.warningValueApplyFlag == false) {
                this.$refs.warningValueBtn.$el.style.backgroundColor = this.$style.common.axisButtonItemActiveBackgroundColor;
                this.$refs.warningValueBtn.$el.style.color = this.$style.common.axisButtonItemActiveColor;
                this.$refs.warningValueBtn.$el.style.border = 0;
                this.warningValueApplyFlag = true;
                 this.setLoadingDialog(true);
                if (this.getBoothID() != undefined && this.getZoneID() != undefined && this.getRobotID() != undefined && this.getJob() != '' && this.axisNum != 0) {
                    let postDatas = this.checkWarningDatas(this.getBoothID(), this.getZoneID(), this.getRobotID(), this.getJob(), this.axisNum);
                    this.$http.post(`${this.baseUrl}/diagnostics/torquerange/data/table/warning/from`, postDatas).then((result) => {
                        if (result.data != '') {
                            this.chartWarningFlag = true;
                            this.searchFlag = true;
                            this.chartWarningValueDatas = result.data;
                            this.tableWarningValueDatas = result.data;
                             this.setLoadingDialog(false);
                        }
                        else {
                            this.$popmsg(this.$t(`diagnostics.torqueRange.popMsg.warningFrom`));
                            this.$refs.warningValueBtn.$el.style.border = "";
                            this.$refs.warningValueBtn.$el.style.color = "";
                             this.setLoadingDialog(false);
                        }
                    }).catch((error) => {
                        this.$log.error(error);
                         this.setLoadingDialog(false);
                    })
                }
            }
            else {
                this.$refs.warningValueBtn.$el.style.border = "";
                this.$refs.warningValueBtn.$el.style.color = "";
                this.warningValueApplyFlag = false;
                this.chartWarningValueDatas = [];
                this.tableWarningValueDatas = [];
                this.chartWarningFlag = true;
                this.searchFlag = true;
            }
        },

        getWarningMargin(warningMargin) {
            this.warningMargin = warningMargin;
        },

        changeTableWarningFlag() {
            this.tableWarningFlag = false;
        },

        selectedChartValueIndex(index) {
            this.selectedChartIndex = index;
        },

        warningValueApplyBtnClicked() {
            this.tableWarningFlag = true;
        },

        warningValueSaveBtnClicked() {
            let warningSteps = [];
            let warningMinDatas = [];
            let warningMaxDatas = [];
            if (this.getBoothID() != undefined && 
                this.getZoneID() != undefined && 
                this.getRobotID() != undefined && 
                this.getJob() != '' && 
                this.axisNum != 0 &&
                this.warningMinDatas.length > 0 &&
                this.warningMaxDatas.length > 0) {
                let postDatas = this.checkWarningDatas(this.getBoothID(), this.getZoneID(), this.getRobotID(), this.getJob(), this.axisNum);
                for (let i = 0; i < this.torqueRangeTableContentDatas.length; i++) {
                    warningSteps.push(this.torqueRangeTableContentDatas[i].stepno);
                    warningMinDatas.push(this.warningMinDatas[i].warningmin);
                    warningMaxDatas.push(this.warningMaxDatas[i].warningmax);
                }
                postDatas['stepnoarr'] = `'{${warningSteps}}'`;
                postDatas['minvalarr'] = `'{${warningMinDatas}}'`;
                postDatas['maxvalarr'] = `'{${warningMaxDatas}}'`;
                this.$http.post(`${this.baseUrl}/diagnostics/torquerange/data/table/warning/to`, postDatas).then((result) => {
                        if (result.status === 204) {
                            this.$popmsg(this.$t(`diagnostics.torqueRange.popMsg.warningTo`));
                            this.warningValueApplyFlag = false;
                            this.getWarningAxisInfos();
                            this.warningValueClicked();
                        }
                    }).catch((error) => {
                        this.$log.error(error);
                    })
            }
            else {
                this.$popmsg(this.$t(`diagnostics.torqueRange.popMsg.warnNoSave`));
            }
        },

        updateSettingData() {
            // robot information setting data
            let params = this.checkTargetDatas(this.getBoothID(), this.getZoneID(), this.getRobotID(), this.prevDate);
            this.$http.post(`${this.baseUrl}/diagnostics/torquedata/data/table`, params).then((result) => {
                if (result.data == '') {
                    this.initSettingInfoDatas();
                    this.$popmsg(this.$t(`diagnostics.torqueRange.child.settingInfoTable.popMsg.torqueData`));
                }
                else {
                    this.datas.info.robotname = result.data[0].robot_name;
                    this.datas.info.rcname = result.data[0].rc_name;
                    this.datas.info.robotmodel = result.data[0].robot_model;
                    this.datas.info.atommodel = result.data[0].atom_model;
                    this.datas.info.ip = result.data[0].ip_addr;
                    this.datas.info.installdate = result.data[0].install_date;
                }
            }).catch((error) => {
                this.$log.error(error);
            })
        },

        getBoothName(boothid) {
            for (let i = 0; i < this.getBoothInfos.length; ++i) {
                if (this.getBoothInfos[i].id === boothid) {
                    return this.getBoothInfos[i].name;
                }
            }
            return -1;
        },

        getZoneName(zoneid) {
            for (let i = 0; i < this.getZoneInfos.length; ++i) {
                if (this.getZoneInfos[i].id === zoneid) {
                    return this.getZoneInfos[i].name;
                }
            }
            return -1;
        },

        getRobotName(robotid) {
            for (let i = 0; i < this.getRobotInfos.length; ++i) {
                if (this.getRobotInfos[i].id === robotid) {
                    return this.getRobotInfos[i].name;
                }
            }
            return -1;
        },

        exportExcel() {
            if (this.getFlagExcel() === true) {
                this.$http.post(`${this.baseUrl}/excel/torquerange`, {
                    date: this.prevDate,
                    booth: this.getBoothName(this.getBoothID()),
                    zone: this.getZoneName(this.getZoneID()),
                    robot: this.getRobotName(this.getRobotID()),
                    jobname: this.getJob(),
                    axis: this.axisNum,
                    robotname: this.datas.info.robotname,
                    rcname: this.datas.info.rcname,
                    robotmodel: this.datas.info.robotmodel,
                    atommodel: this.datas.info.atommodel,
                    ip: this.datas.info.ip,
                    installdate: this.datas.info.installdate,
                    stepcount: this.torqueRangeTableContentDatas.length,
                    torqueloadfactorvalue: this.torqueRangeTableContentDatas,
                    torqueloadfactorwarnvalue : this.tableWarningValueDatas,
                    datescript: this.$t(`diagnostics.torqueRange.excel.date`),
                    boothscript: this.$t(`diagnostics.torqueRange.excel.booth`),
                    zonescript: this.$t(`diagnostics.torqueRange.excel.zone`),
                    robotscript: this.$t(`diagnostics.torqueRange.excel.robot`),
                    jobnamescript: this.$t(`diagnostics.torqueRange.excel.date`),
                    axisscript: this.$t(`diagnostics.torqueRange.excel.axis`),
                    robotnamescript: this.$t(`diagnostics.torquedata.settinginfotable.robotname`),
                    rcnamescript: this.$t(`diagnostics.torquedata.settinginfotable.modelname`),
                    robotmodelscript: this.$t(`diagnostics.torquedata.settinginfotable.robotmodel`),
                    atommodelscript: this.$t(`diagnostics.torquedata.settinginfotable.atomizermodel`),
                    ipscript: this.$t(`diagnostics.torquedata.settinginfotable.ipaddress`),
                    installdatescript: this.$t(`diagnostics.torquedata.settinginfotable.installdate`),
                    stepscript: this.$t(`diagnostics.torqueRange.excel.step`),
                    torqueloadfactorminscript: this.$t(`diagnostics.torqueRange.excel.torqueMin`),
                    torqueloadfactormaxscript: this.$t(`diagnostics.torqueRange.excel.torqueMax`),
                    torqueloadfactorwarnminscript: this.$t(`diagnostics.torqueRange.excel.torqueWarnMin`),
                    torqueloadfactorwarnmaxscript: this.$t(`diagnostics.torqueRange.excel.torqueWarnMax`) 
                }, {responseType: 'blob'}).then((result) => {
                    if (result.data == '') {
                        
                    }
                    else {
                        const type = result.headers['content-type']
                        const blob = new Blob([result.data], { type: type, encoding: 'UTF-8' })
                        this.$saveAs(blob, "TorqueRange.xlsx");
                    }
                }).catch((error) => {
                    this.$log.error(error);
                })
            }
            else {

            }
        }
    }
}
</script>

<style scoped lang="scss">
    @import './torquerange';
</style>

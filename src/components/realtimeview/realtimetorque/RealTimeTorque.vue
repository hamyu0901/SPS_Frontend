<template>
    <v-layout column>
        <v-layout>
            <v-spacer/>
            <v-btn class="mr-2 settingButton buttonItem" round :disabled="flags.warningSetButton" @click="warningSetButtonClicked">
                <a><img class="pt-2 pr-2" :src='ui.settingIcon'/></a>{{ui.warningSetButtonTitle}}
            </v-btn>
            <warning-setting-dlg
                v-bind:warningSettingDlgFlag="flags.warningSettingDlg"
                v-bind:warningSettingDatas="datas.warningValueItems"
                v-on:warningValue="saveWarningValueItems"
                v-on:closeDlg="flags.warningSettingDlg = false"
            ></warning-setting-dlg>
            <div class="pr-2"><v-btn class="axisButton" :ref="'allAxisButton'" flat :disabled="flags.axisButton" @click="allAxisButtonClicked">{{ui.allAxisButtonTitle}}</v-btn></div>
            <div class="pr-2" v-for="dataByAxis in datas.datasByAxis" :key="dataByAxis.id">
                <v-btn class="axisButton" :ref="dataByAxis.id" flat :disabled="flags.axisButton" @click="axisButtonClicked(dataByAxis.id)"> {{dataByAxis.title}} </v-btn>
            </div>
        </v-layout>
        <v-layout column class="pt-3">
            <v-layout class="pl-4">
                <p v-bind:style="ui.styleObject">{{ui.chartTitle}}</p>
                <p v-bind:style="ui.styleObject">{{"[ "+ datas.currRobotController.toUpperCase() + " ]"}}</p>
                <p v-bind:style="ui.styleObject">{{"[ " + ui.selectedRobotJobFiles + " ]"}}</p>
                <p v-bind:style="ui.styleObject" v-if="flags.multishowJobFiles === true">{{"[ " + ui.relationRobotJobFiles + " ]"}}</p>
                <v-spacer/>
                <multi-selector
                    class="pt-2"
                    v-bind:showFlag="flags.multiSelectorShow"
                    v-bind:selectorOptions="datas.multiSelectorOptions"
                    v-on:selectedItem="getMultiSelectorOption"
                />
            </v-layout>
            <v-layout>
                <v-flex lg12 class="pl-4">
                    <real-time-torque-chart
                        v-bind:chartId="'realTimeTorqueChart'"
                        v-bind:torqueValueLegends="setTorqueValueLegends"
                        v-bind:warningValueLegends="datas.warningValueItems"
                        v-bind:chartDatas="datas.realTimeChartDatas"
                    ></real-time-torque-chart>
                </v-flex>
            </v-layout>
        </v-layout>
        <v-layout>
            <v-flex lg12 class="pl-4">
                <real-time-log-list
                    v-bind:logListDatas="datas.warningLogListDatas"
                ></real-time-log-list>
            </v-flex>
        </v-layout>
    </v-layout>
</template>

<script>
import RealTimeTorqueChart from '@/components/realtimeview/realtimetorque/realtimetorque/RealTimeTorqueChart'
import RealTimeLogList from '@/components/realtimeview/realtimetorque/realtimetorque/RealTimeLogList'
import MultiSelector from '@/components/realtimeview/realtimetorque/realtimetorque/MultiSelector'
import WarningSettingDlg from '@/components/realtimeview/realtimetorque/realtimetorque/WarningSettingDlg'
export default {
    components: {RealTimeTorqueChart, RealTimeLogList, MultiSelector, WarningSettingDlg},
    props: ['nodeInfos'],
    data() {
        return {
            ui: {
                chartTitle: this.$t(`realtime.child.realTimeTorque.chartTitle`),
                settingIcon: require("@/images/setting.png"),
                warningSetButtonTitle: this.$t(`realtime.child.realTimeTorque.warningSetButtonTitle`),
                multiSelectorPlaceHolder: this.$t(`realtime.child.realTimeTorque.multiSelectorPlaceHolder`),
                allAxisButtonTitle: this.$t(`realtime.child.realTimeTorque.allAxisButtonTitle`),
                selectedRobotJobFiles: "",
                relationRobotJobFiles: "",
                styleObject: null,
                axisButton: {
                    color: "",
                    border: ""
                },
                chartLineColor: {
                    selectedRobot: "",
                    relationRobot: "",
                    forwardWarning: "",
                    forwardViolation: "",
                    reverseWarning: "",
                    reverseViolation: ""
                },
                legends: {
                    forwardWarning: this.$t(`realtime.legends.forwardWarning`),
                    forwardViolation: this.$t(`realtime.legends.forwardViolation`),
                    reverseWarning: this.$t(`realtime.legends.reverseWarning`),
                    reverseViolation: this.$t(`realtime.legends.reverseViolation`)
                }
            },
            datas: {
                chartIndex: 0,
                axisNum: 0,
                chartDataLimit: 0,
                limits: {
                    dx: 3000,
                    nx: 600
                },
                robotControllerTypes: {
                    nx: "nx",
                    dx: "dx"
                },
                currRobotController: "",
                datasByAxis: [
                    {id: "1", title: this.$t(`realtime.child.realTimeTorque.datasByAxis.1axis`), color: ""},
                    {id: "2", title: this.$t(`realtime.child.realTimeTorque.datasByAxis.2axis`), color: ""},
                    {id: "3", title: this.$t(`realtime.child.realTimeTorque.datasByAxis.3axis`), color: ""},
                    {id: "4", title: this.$t(`realtime.child.realTimeTorque.datasByAxis.4axis`), color: ""},
                    {id: "5", title: this.$t(`realtime.child.realTimeTorque.datasByAxis.5axis`), color: ""},
                    {id: "6", title: this.$t(`realtime.child.realTimeTorque.datasByAxis.6axis`), color: ""},
                    {id: "7", title: this.$t(`realtime.child.realTimeTorque.datasByAxis.7axis`), color: ""}
                ],
                multiSelectorOptions: [],
                realTimeChartDatas: [],
                selectedChartDatas: [],
                relationChartDatas: [],
                robotNames: [],
                axisNames: [],
                warningValueItems: [],
                warningLogListDatas: [],
            },
            flags: {
                axisButton: true,
                warningSetButton: true,
                warningSettingDlg: false,
                multiSelectorShow: true,
                multishowJobFiles: false,
                handler: false
            },
            logCheckValues: {
                logCheckValue: 0,
                forwardWarning: 0,
                forwardViolation: 0,
                reverseWarning: 0,
                reverseViolation: 0
            },
            handle: {
               realtimeTorque: null
            }
        }
    },

    created() {
        this.initializeUI();
        this.initAxisNames();
    },

    mounted() {
        this.initializeStyle();
    },

    async destroyed() {
        await this.destoryHandle();
    },

    watch: {
        nodeInfos: {
            deep: true,
            handler(nodeInfos) {
                if(!this.isEmpty(nodeInfos.selectedRobotInfo) && !this.isEmpty(nodeInfos.relationRobotInfo)) {
                    this.flags.axisButton = false;
                    this.initCurrJobName();
                    this.initCurrRobotControllerName();
                    this.initRealTimeChartDatas();
                    this.initWarningLogListDatas();
                    this.initLogCheckValues();
                    this.setRobotNames(nodeInfos.selectedRobotInfo, null);
                    this.allAxisButtonClicked();
                }
                else if(!this.isEmpty(nodeInfos.selectedRobotInfo) && this.isEmpty(nodeInfos.relationRobotInfo)) {
                    this.flags.axisButton = false;
                    this.initCurrJobName();
                    this.initCurrRobotControllerName();
                    this.initRealTimeChartDatas();
                    this.initWarningLogListDatas();
                    this.initLogCheckValues();
                    this.setRobotNames(nodeInfos.selectedRobotInfo, null);
                    this.allAxisButtonClicked();
                }
                else {
                    this.flags.axisButton = true;
                    this.flags.warningSetButton = true;
                    this.destoryHandle();
                    this.initCurrJobName();
                    this.initCurrRobotControllerName();
                    this.initRobotNames();
                    this.initLogCheckValues();
                    this.initRealTimeChartDatas();
                    this.initWarningLogListDatas();
                    this.initMultiSelectorOptions();
                    this.initAxisButtonStyle();
                }
            }
        }
    },

    computed: {
        setTorqueValueLegends() {
            if(this.flags.multiSelectorShow) {
                return this.datas.robotNames;
            }
            else {
                return this.datas.axisNames;
            }
        }
    },

    methods: {
        initializeUI() {
            this.ui.axisButton.color = this.$style.realtime.realTimeTorqueAxisButtonColor;
            this.ui.axisButton.border = "solid 2px #0ca889";

            this.ui.chartLineColor.selectedRobot = this.$style.realtime.realTimeTorqueRobotChartLineColors.selected;
            this.ui.chartLineColor.relationRobot = this.$style.realtime.realTimeTorqueRobotChartLineColors.relation;

            this.ui.chartLineColor.forwardWarning = this.$style.realtime.realTimeTorqueSettingChartLineColors.forwardWarning;
            this.ui.chartLineColor.forwardViolation = this.$style.realtime.realTimeTorqueSettingChartLineColors.forwardViolation;
            this.ui.chartLineColor.reverseWarning = this.$style.realtime.realTimeTorqueSettingChartLineColors.reverseWarning;
            this.ui.chartLineColor.reverseViolation = this.$style.realtime.realTimeTorqueSettingChartLineColors.reverseViolation;

            // 축 별 line color
            this.datas.datasByAxis[0].color = this.$style.realtime.realTimeTorqueAxisChartLineColors.axis_1;
            this.datas.datasByAxis[1].color = this.$style.realtime.realTimeTorqueAxisChartLineColors.axis_2;
            this.datas.datasByAxis[2].color = this.$style.realtime.realTimeTorqueAxisChartLineColors.axis_3;
            this.datas.datasByAxis[3].color = this.$style.realtime.realTimeTorqueAxisChartLineColors.axis_4;
            this.datas.datasByAxis[4].color = this.$style.realtime.realTimeTorqueAxisChartLineColors.axis_5;
            this.datas.datasByAxis[5].color = this.$style.realtime.realTimeTorqueAxisChartLineColors.axis_6;
            this.datas.datasByAxis[6].color = this.$style.realtime.realTimeTorqueAxisChartLineColors.axis_7;

        },

        initializeStyle() {
            this.ui.styleObject = this.$style.common.titleObjectItemColor;
            document.documentElement.style.setProperty("--buttonItemBackgroundColor", this.$style.common.buttonItemBackgroundColor);
            document.documentElement.style.setProperty("--buttonItemColor", this.$style.common.buttonItemColor);
            document.documentElement.style.setProperty("--btnAxisBorderColor", this.$style.common.axisButtonItemBorderColor);
            document.documentElement.style.setProperty("--axisBtnHoverBackgroundColor", this.$style.common.axisButtonItemActiveBackgroundColor);
            document.documentElement.style.setProperty("--axisBtnHoverColor", this.$style.common.axisButtonItemActiveColor);
        },

        initAxisButtonStyle() {
            let ids = Object.keys(this.$refs);
            ids.forEach(id => {
                if(id === 'allAxisButton') {
                    this.$refs[id].$el.style.backgroundColor = this.$style.common.axisButtonItemBackgroundColor;
                    this.$refs[id].$el.style.color = this.$style.common.axisButtonItemColor;
                    this.$refs[id].$el.style.border = "";
                }
                else {
                    this.$refs[id][0].$el.style.backgroundColor = this.$style.common.axisButtonItemBackgroundColor;
                    this.$refs[id][0].$el.style.color = this.$style.common.axisButtonItemColor;
                    this.$refs[id][0].$el.style.border = "";
                }
            })
           
        },

        initRobotNames() {
            this.datas.robotNames = [];
        },

        initCurrJobName() {
            this.ui.selectedRobotJobFiles = "";
            this.ui.relationRobotJobFiles = "";
        },

        initCurrRobotControllerName() {
            this.datas.currRobotController = "";
        },

        initWarningValueItems() {
            this.datas.warningValueItems = [];
        },

        initWarningLogListDatas() {
            this.datas.warningLogListDatas = [];
        },

        initRealTimeChartDatas() {
            this.datas.realTimeChartDatas = [];
        },

        initMultiSelectorOptions() {
            this.datas.multiSelectorOptions = [];
        },

        initAxisNames() {
            this.datas.datasByAxis.forEach(axis => {
                this.datas.axisNames.push({
                    id: axis.id,
                    legend: axis.title,
                    color: axis.color,
                    visible: true
                })
            })
        },

        initLogCheckValues() {
            this.logCheckValues.logCheckValue = 0;
            this.logCheckValues.forwardWarning = 0;
            this.logCheckValues.forwardViolation = 0;
            this.logCheckValues.reverseWarning = 0;
            this.logCheckValues.reverseViolation = 0;
        },

        setRobotJobFiles(robotName, jobName) {
            this.datas.robotNames.forEach(robotInfo => {
                if(robotInfo.legend === robotName) {
                    if(robotInfo.id === "selectedRobot") {
                        this.ui.selectedRobotJobFiles = robotName + " : " + jobName;
                    }
                    else {
                        this.ui.relationRobotJobFiles = robotName + " : " + jobName;
                    }
                }
            })
        },

        isEmpty(obj) {
            for(var key in obj) {
                if(obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        },

        getNowTimeStamp() {
            let date = new Date();
            date = this.$moment(date).format('YYYY-MM-DD');
            return "'" + date + "'";
        },

        getRobotController(robotInfos) {
            return new Promise((resolve, reject) => {
                this.flags.handler = true;
                let robotController = "";
                this.$http.get('realtimeview/robot/controller', {params: {
                    factoryid: robotInfos.factoryid,
                    boothid: robotInfos.boothid,
                    zoneid: robotInfos.zoneid,
                    robotid: robotInfos.robotid
                }})
                .then(result => {
                    if(result.data.length > 0 && result.data[0].rc_name !== "") {
                       robotController = result.data[0].rc_name;
                    }
                    resolve(robotController);
                })
            })
        },

        getWarningCheckValue(robotController) {
            this.logCheckValues.logCheckValue = 0;
            if(robotController.indexOf("NX") === 0) {
                this.logCheckValues.logCheckValue = 3;
            }
            else {
                 this.logCheckValues.logCheckValue = 10;
            }
        },

        createdHandle(selectedRobotInfo, relationRobotInfo, axis) {
            this.flags.handler = true;
            let checkWarningValueItemsFlag = null;
            let selectedRobotController ="";
            let relationRobotController = "";
            this.getWarningValueItems(selectedRobotInfo).then((warningValueItemsFlag) => {
                checkWarningValueItemsFlag = warningValueItemsFlag;
                this.getRobotController(selectedRobotInfo).then((selectedController) => {
                    selectedRobotController = selectedController;
                    this.getWarningCheckValue(selectedRobotController);
                    if(relationRobotInfo !== null) {
                        this.getRobotController(relationRobotInfo).then((relationController) => {
                            relationRobotController = relationController;
                            if(selectedRobotController.indexOf("NX") === 0 && String(relationRobotController).indexOf("NX") === 0) {
                                this.datas.chartDataLimit = this.datas.limits.nx;
                                this.datas.currRobotController = this.datas.robotControllerTypes.nx;
                                if(checkWarningValueItemsFlag) {
                                    this.handle.realtimeTorque = setInterval(()=> {this.getRealTimeDatas(selectedRobotInfo, relationRobotInfo, axis, this.datas.warningValueItems)}, 1000);
                                }
                                else {
                                    this.handle.realtimeTorque = setInterval(()=> {this.getRealTimeDatas(selectedRobotInfo, relationRobotInfo, axis, null)}, 1000);
                                }
                                this.flags.handler = false;
                            }
                            else if(selectedRobotController.indexOf("DX") === 0 && String(relationRobotController).indexOf("DX") === 0) {
                                this.datas.chartDataLimit = this.datas.limits.dx;
                                this.datas.currRobotController = this.datas.robotControllerTypes.dx;
                                if(checkWarningValueItemsFlag) {
                                    this.handle.realtimeTorque = setInterval(()=> {this.getRealTimeDXDatas(selectedRobotInfo, relationRobotInfo, axis, this.datas.warningValueItems)}, 1000);
                                }
                                else {
                                    this.handle.realtimeTorque = setInterval(()=> {this.getRealTimeDXDatas(selectedRobotInfo, relationRobotInfo, axis, null)}, 1000);
                                }
                                this.flags.handler = false;
                            }
                        })
                    }
                    else {
                        relationRobotController = null;
                        if(selectedRobotController.indexOf("NX") === 0 && relationRobotController === null) {
                            this.datas.chartDataLimit = this.datas.limits.nx;
                            this.datas.currRobotController = this.datas.robotControllerTypes.nx;
                            if(checkWarningValueItemsFlag) {
                                this.handle.realtimeTorque = setInterval(()=> {this.getRealTimeDatas(selectedRobotInfo, relationRobotInfo, axis, this.datas.warningValueItems)}, 1000);
                            }
                            else {
                                this.handle.realtimeTorque = setInterval(()=> {this.getRealTimeDatas(selectedRobotInfo, relationRobotInfo, axis, null)}, 1000);
                            }
                            this.flags.handler = false;
                        }
                        else if(selectedRobotController.indexOf("DX") === 0 && relationRobotController === null) {
                            this.datas.chartDataLimit = this.datas.limits.dx;
                            this.datas.currRobotController = this.datas.robotControllerTypes.dx;
                            if(checkWarningValueItemsFlag) {
                                this.handle.realtimeTorque = setInterval(()=> {this.getRealTimeDXDatas(selectedRobotInfo, relationRobotInfo, axis, this.datas.warningValueItems)}, 1000);
                            }
                            else {
                                this.handle.realtimeTorque = setInterval(()=> {this.getRealTimeDXDatas(selectedRobotInfo, relationRobotInfo, axis, null)}, 1000);
                            }
                            this.flags.handler = false;
                        }
                    }
                })
            })
        },

        destoryHandle() {
            return new Promise((resolve, reject) => {
                clearInterval(this.handle.realtimeTorque);
                this.handle.realtimeTorque = null;
                this.datas.chartIndex = 0;
                this.sockets.unsubscribe('realtimetorque');
                this.sockets.unsubscribe('realtimetorqueall');
                resolve();
            });
        },

        warningSetButtonClicked() {
            this.flags.warningSettingDlg = true;
        },

        saveWarningValueItems(warningValueItems) {
            this.$http.post(`/realtimeview/robot/value`,{
                'robotid': this.nodeInfos.selectedRobotInfo.robotid,
                'forwardviolation': warningValueItems[1].value,
                'forwardwarning': warningValueItems[0].value,
                'reverseviolation': warningValueItems[3].value,
                'reversewarning': warningValueItems[2].value,
                'axis': this.datas.axisNum
            }).then(result => {
                if(result.status === 200) {
                    this.$popmsg(this.$t(`realtime.child.realTimeTorque.popMsg.saveWarningValues`));
                }
            }).catch((error) => {
                this.$log.error(error);
            });
            this.flags.warningSettingDlg = false;
            this.axisButtonClicked(this.datas.axisNum);
        },

        getWarningValueItems(selectedRobotInfo) {
            return new Promise((resolve, reject) => {
                this.$http.get(`/realtimeview/robot/value`, {params: {
                    'robotid': selectedRobotInfo.robotid,
                    'axis': this.datas.axisNum
                }}).then(result => {
                    let warningValueItemsFlag = false;
                    if(result.data.forwardWarning !== "" && result.data.forwardViolation !== "" && result.data.reverseWarning !== "" && result.data.reverseViolation !== "") {
                        this.setWarningValueItems(result.data);
                        warningValueItemsFlag = true;
                    }
                    else {
                        this.initWarningValueItems();
                    }
                    resolve(warningValueItemsFlag);
                }).catch((error) => {
                    this.$log.error(error);
                });
            });
        },

        setWarningValueItems(warningValues) {
            this.initWarningValueItems();
            this.datas.warningValueItems = [
                {id: 'forwardViolation', legend: this.ui.legends.forwardViolation, value: warningValues.forwardViolation, visible: true, color: this.ui.chartLineColor.forwardViolation},
                {id: 'forwardWarning', legend: this.ui.legends.forwardWarning, value: warningValues.forwardWarning, visible: true, color: this.ui.chartLineColor.forwardWarning},
                {id: 'reverseViolation', legend: this.ui.legends.reverseViolation, value: warningValues.reverseViolation, visible: true, color: this.ui.chartLineColor.reverseViolation},
                {id: 'reverseWarning', legend: this.ui.legends.reverseWarning, value: warningValues.reverseWarning, visible: true, color: this.ui.chartLineColor.reverseWarning}
            ]
        },

        allAxisButtonClicked() {
            this.initAxisButtonStyle();
            this.initRealTimeChartDatas();
            
            this.flags.warningSetButton = true;
            
            this.$refs['allAxisButton'].$el.style.backgroundColor = this.$style.common.axisButtonItemActiveBackgroundColor;
            this.$refs['allAxisButton'].$el.style.color = this.$style.common.axisButtonItemActiveColor;
            this.$refs['allAxisButton'].$el.style.border = 0;

            this.flags.multiSelectorShow = false;
            this.flags.multishowJobFiles = false;
            this.destoryHandle().then(() => {
                if(this.flags.handler === false) {
                    this.getRobotController(this.nodeInfos.selectedRobotInfo).then((robotController) => {
                        this.flags.handler = false;
                        if(robotController.indexOf('NX') === 0) {
                            this.datas.chartDataLimit = this.datas.limits.nx;
                            this.datas.currRobotController = this.datas.robotControllerTypes.nx;
                            this.handle.realtimeTorque = setInterval(()=> {this.getRobotAllTorqueDatas(this.nodeInfos.selectedRobotInfo)}, 1000);
                        }
                        else if(robotController.indexOf('DX') === 0) {
                            this.datas.chartDataLimit = this.datas.limits.dx;
                            this.datas.currRobotController = this.datas.robotControllerTypes.dx;
                            this.handle.realtimeTorque = setInterval(()=> {this.getDXRobotAllTorqueDatas(this.nodeInfos.selectedRobotInfo)}, 1000);
                        }
                    })
                }
            });
        },

        axisButtonClicked(axisId) {
            this.initAxisButtonStyle();
            this.initRealTimeChartDatas();

            this.$refs[axisId][0].$el.style.backgroundColor = this.$style.common.axisButtonItemActiveBackgroundColor;
            this.$refs[axisId][0].$el.style.color =  this.$style.common.axisButtonItemActiveColor;
            this.$refs[axisId][0].$el.style.border = 0;

            this.datas.axisNum = axisId;
            this.flags.warningSetButton = false;
            this.flags.multiSelectorShow = true;
            
            this.destoryHandle().then(() => {
                if(this.flags.handler === false) {
                    if(!this.isEmpty(this.nodeInfos.relationRobotInfo)) {
                        this.createdHandle(this.nodeInfos.selectedRobotInfo, null, axisId);
                    } 
                    else {
                        this.createdHandle(this.nodeInfos.selectedRobotInfo, null, axisId);
                    }
                }
            })
        },

        setRobotNames(selectedRobotInfo, relationRobotInfo) {
            this.initRobotNames();
            if(relationRobotInfo === null) {
                this.datas.robotNames = [
                    {id: "selectedRobot", legend: selectedRobotInfo.robotname, color: this.ui.chartLineColor.selectedRobot, visible: true},
                ]
            }
            else {
                this.datas.robotNames = [
                    {id: "selectedRobot", legend: selectedRobotInfo.robotname, color: this.ui.chartLineColor.selectedRobot, visible: true},
                    {id: "relationRobot", legend: relationRobotInfo.robotname, color: this.ui.chartLineColor.relationRobot, visible: true}
                ];
            }
            this.setMultiSelectorOptions(this.datas.robotNames);
        },

        setMultiSelectorOptions(robotNameInfos) {
            this.initMultiSelectorOptions();
            robotNameInfos.forEach((robotNameInfo, index) => {
                if(robotNameInfo.id === "relationRobot") {
                    this.datas.multiSelectorOptions.push(
                        {id: "relationRobot", name: robotNameInfos[index-1].legend+ " + " + robotNameInfo.legend}
                    )            
                }
                else {
                    this.datas.multiSelectorOptions.push(
                        {id: "selectedRobot", name: robotNameInfo.legend}
                    )
                }
            })
        },

        getMultiSelectorOption(multiSelectorOption) {
            this.initRealTimeChartDatas();
            if(multiSelectorOption.id === "selectedRobot") {
                this.flags.multishowJobFiles = false;
                this.datas.robotNames.forEach(robotName => {
                    if(robotName.id === multiSelectorOption.id) {
                        robotName.visible = true;
                    }
                    else {
                        robotName.visible = false;
                    }
                })
            }
            else {
                this.flags.multishowJobFiles = true;
                this.datas.robotNames.forEach(robotName => {
                    robotName.visible = true;
                })
            }
        },

        async getRealTimeDXDatas(selectedRobotInfo, relationRobotInfo, axis, warningValueItems) {
            let selectedRobotTorqueData = await this.getDXRobotTorqueDatas(selectedRobotInfo, axis);
            let relationRobotTorqueData = null;
            if(relationRobotInfo !== null) {
                relationRobotTorqueData = await this.getDXRobotTorqueDatas(relationRobotInfo, axis);
                if(selectedRobotTorqueData.length > relationRobotTorqueData.length) {
                    relationRobotTorqueData = this.compareTorqueDatas(selectedRobotTorqueData, relationRobotTorqueData);
                }
                else if(selectedRobotTorqueData.length < relationRobotTorqueData.length){
                    selectedRobotTorqueData = this.compareTorqueDatas(selectedRobotTorqueData, relationRobotTorqueData);
                }
            }
            this.setRealtimeDXChartDatas(selectedRobotTorqueData, relationRobotTorqueData, warningValueItems);
        },

        async getRealTimeDatas(selectedRobotInfo, relationRobotInfo, axis, warningValueItems) {
            let selectedRobotTorqueData = await this.getRobotTorqueDatas(selectedRobotInfo, axis);
            let relationRobotTorqueData = null;
            if(relationRobotInfo !== null) {
                relationRobotTorqueData = await this.getRobotTorqueDatas(relationRobotInfo, axis);
            }
            this.setRealtimeChartDatas(selectedRobotTorqueData, relationRobotTorqueData, warningValueItems);
        },

        getDXRobotAllTorqueDatas(robotInfo) {
            this.$socket.emit('realtimetorquealldx', {
                factoryid: robotInfo.factoryid,
                boothid: robotInfo.boothid,
                zoneid: robotInfo.zoneid,
                robotid: robotInfo.robotid
            });
            this.sockets.subscribe('realtimetorqueall', (datas) => {
                if(datas.length > 0) {
                    let tempData = datas[0];
                    let realTimeTorqueDatas = [];
                    let realTimeTorqueData = {};
                    let tempRealTimeTorqueDatas = datas.splice(0,10);
                    tempRealTimeTorqueDatas.forEach((data, index) => {
                        realTimeTorqueData = {};
                        this.setRobotJobFiles(robotInfo.robotname, data.job_name);
                        if(tempData.time_stamp.split("T")[1].split(".")[0] === data.time_stamp.split("T")[1].split(".")[0]) {
                            if(index === 0 || tempData.time_stamp.split("T")[1].split(".")[1].split("Z")[0] !== data.time_stamp.split("T")[1].split(".")[1].split("Z")[0]) {
                                if(data.motor_torque.length >= this.datas.axisNames.length) {
                                    data.motor_torque = data.motor_torque.splice(0,7);
                                }
                                else {
                                    for(let i = 0; i < 7-data.motor_torque.length; i++){
                                        data.motor_torque.push(undefined);
                                    }  
                                }
                                realTimeTorqueData['time_stamp'] = data.time_stamp.split("T")[1].split(".")[0] + "." + data.time_stamp.split("T")[1].split(".")[1].split("Z")[0];
                                realTimeTorqueData['motor_torque'] = data.motor_torque;
                                realTimeTorqueDatas.push(realTimeTorqueData);
                            }
                        }
                    })
                    this.setRealtimeAxisDXChartDatas(realTimeTorqueDatas.reverse());
                }
                this.sockets.unsubscribe('realtimetorqueall');
            })
        },

        getRobotAllTorqueDatas(robotInfo) {
            this.$socket.emit('realtimetorqueallnx', {
                factoryid: robotInfo.factoryid,
                boothid: robotInfo.boothid,
                zoneid: robotInfo.zoneid,
                robotid: robotInfo.robotid,
                timestamp: this.getNowTimeStamp()
            });
            this.sockets.subscribe('realtimetorqueall', (datas) => {
                if(datas.length > 0) {
                    let realTimeTorqueDatas = {};
                    datas.forEach(data => {
                        this.setRobotJobFiles(robotInfo.robotname, data.job_name);
                        if(data.motor_torque.length >= this.datas.axisNames.length) {
                            data.motor_torque = data.motor_torque.splice(0,7);
                        }
                        else {
                            for(let i = 0; i < 7-data.motor_torque.length; i++){
                                data.motor_torque.push(undefined);
                            }  
                        }
                        realTimeTorqueDatas['time_stamp'] = data.time_stamp.split("T")[1].split(".")[0];
                        realTimeTorqueDatas['motor_torque'] = data.motor_torque;
                    })
                    this.setRealtimeAxisChartDatas(realTimeTorqueDatas);
                }
                this.sockets.unsubscribe('realtimetorqueall');
            })
        },

        getDXRobotTorqueDatas(robotInfo, axis) {
            return new Promise((resolve, reject) => {
                this.$socket.emit('realtimetorquedx', {
                    factoryid: robotInfo.factoryid,
                    boothid: robotInfo.boothid,
                    zoneid: robotInfo.zoneid,
                    robotid: robotInfo.robotid,
                    axis: axis
                })
                this.sockets.subscribe('realtimetorque', (datas) => {
                    if(datas.length > 0) {
                        let tempData = datas[0];
                        let realTimeTorqueDatas = [];
                        let realTimeTorqueData = {};
                         let tempRealTimeTorqueDatas = datas.splice(0,10);
                        tempRealTimeTorqueDatas.forEach((data, index) => {
                            realTimeTorqueData = {};
                            this.setRobotJobFiles(robotInfo.robotname, data.job_name);
                            if(tempData.time_stamp.split("T")[1].split(".")[0] === data.time_stamp.split("T")[1].split(".")[0]) {
                                if(index === 0 || tempData.time_stamp.split("T")[1].split(".")[1].split("Z")[0] !== data.time_stamp.split("T")[1].split(".")[1].split("Z")[0]) {
                                    realTimeTorqueData['time_stamp'] = data.time_stamp.split("T")[1].split(".")[0] + "." + data.time_stamp.split("T")[1].split(".")[1].split("Z")[0];
                                    realTimeTorqueData['motor_torque'] = data.motor_torque;
                                    realTimeTorqueDatas.push(realTimeTorqueData);
                                }
                            }
                        })
                    resolve(realTimeTorqueDatas.reverse());
                    }
                    this.sockets.unsubscribe('realtimetorque');
                })
            })
        },

        getRobotTorqueDatas(robotInfo, axis) {
            return new Promise((resolve, reject) => {
                this.$socket.emit('realtimetorquenx', {
                    factoryid: robotInfo.factoryid,
                    boothid: robotInfo.boothid,
                    zoneid: robotInfo.zoneid,
                    robotid: robotInfo.robotid,
                    timestamp: this.getNowTimeStamp(),
                    axis: axis
                })
                this.sockets.subscribe('realtimetorque', (datas) => {
                    if(datas.length > 0) {
                        let realTimeTorqueDatas = {};
                        datas.forEach(data => {
                            this.setRobotJobFiles(robotInfo.robotname, data.job_name);
                            realTimeTorqueDatas['time_stamp'] = data.time_stamp.split("T")[1].split(".")[0];
                            realTimeTorqueDatas['motor_torque'] = data.motor_torque;
                        })
                        resolve(realTimeTorqueDatas);
                    }
                    this.sockets.unsubscribe('realtimetorque');
                })
            })
        },

        compareTorqueDatas(selectedRobotTorqueDatas, relationRobotTorqueDatas) {
            let tempRobotTorqueDatas = [];
            if(selectedRobotTorqueDatas.length > relationRobotTorqueDatas.length) {
                tempRobotTorqueDatas = Array.prototype.slice.call(relationRobotTorqueDatas);
                for(let selectedIndex = 0; selectedIndex < selectedRobotTorqueDatas.length; selectedIndex++) {
                    for(let tempRobotIndex = 0; tempRobotIndex < tempRobotTorqueDatas.length; tempRobotIndex++) {
                        if(selectedRobotTorqueDatas.length !== tempRobotTorqueDatas.length) {
                            if(Number(selectedRobotTorqueDatas[selectedIndex].time_stamp.split(".")[1]) <= Number(tempRobotTorqueDatas[0].time_stamp.split(".")[1])) {
                                tempRobotTorqueDatas.unshift({'time_stamp': selectedRobotTorqueDatas[selectedIndex].time_stamp, 'motor_torque': null});
                                break;
                            }
                            else if (
                                tempRobotIndex < tempRobotTorqueDatas.length - 1 &&
                                Number(selectedRobotTorqueDatas[selectedIndex].time_stamp.split(".")[1]) > Number(tempRobotTorqueDatas[tempRobotIndex].time_stamp.split(".")[1]) &&
                                Number(selectedRobotTorqueDatas[selectedIndex].time_stamp.split(".")[1]) <= Number(tempRobotTorqueDatas[tempRobotIndex+1].time_stamp.split(".")[1]) 
                            ) {
                                tempRobotTorqueDatas.splice(tempRobotIndex+1, 0, {'time_stamp': selectedRobotTorqueDatas[selectedIndex].time_stamp, 'motor_torque': null});
                                break;
                            }
                            else if((Number(selectedRobotTorqueDatas[selectedIndex].time_stamp.split(".")[1]) > Number(tempRobotTorqueDatas[tempRobotTorqueDatas.length-1].time_stamp.split(".")[1]))) {
                                tempRobotTorqueDatas.push({'time_stamp': selectedRobotTorqueDatas[selectedIndex].time_stamp, 'motor_torque': null});
                                break;
                            }
                        }
                    }
                }              
            }
            else if(selectedRobotTorqueDatas.length < relationRobotTorqueDatas.length) {
                tempRobotTorqueDatas = Array.prototype.slice.call(selectedRobotTorqueDatas);
                for(let relationIndex = 0; relationIndex < relationRobotTorqueDatas.length; relationIndex++) {
                    for(let tempRobotIndex = 0; tempRobotIndex < tempRobotTorqueDatas.length; tempRobotIndex++) {
                        if(relationRobotTorqueDatas.length !== tempRobotTorqueDatas.length) {
                            if(Number(relationRobotTorqueDatas[relationIndex].time_stamp.split(".")[1]) <= Number(tempRobotTorqueDatas[0].time_stamp.split(".")[1])) {
                                tempRobotTorqueDatas.unshift({'time_stamp': relationRobotTorqueDatas[relationIndex].time_stamp, 'motor_torque': null});
                                break;
                            }
                            else if (
                                tempRobotIndex < tempRobotTorqueDatas.length - 1 &&
                                Number(relationRobotTorqueDatas[relationIndex].time_stamp.split(".")[1]) > Number(tempRobotTorqueDatas[tempRobotIndex].time_stamp.split(".")[1]) &&
                                Number(relationRobotTorqueDatas[relationIndex].time_stamp.split(".")[1]) <= Number(tempRobotTorqueDatas[tempRobotIndex+1].time_stamp.split(".")[1]) 
                            ) {
                                tempRobotTorqueDatas.splice(tempRobotIndex+1, 0, {'time_stamp': relationRobotTorqueDatas[relationIndex].time_stamp, 'motor_torque': null});
                                break;
                            }
                            else if((Number(relationRobotTorqueDatas[relationIndex].time_stamp.split(".")[1]) > Number(tempRobotTorqueDatas[tempRobotTorqueDatas.length-1].time_stamp.split(".")[1]))) {
                                tempRobotTorqueDatas.push({'time_stamp': relationRobotTorqueDatas[relationIndex].time_stamp, 'motor_torque': null});
                                break;
                            }
                        }
                    }
                }              
            }
            return tempRobotTorqueDatas;
        },

        setWarningTorqueValue(selectedRobotTorqueData, warningValueItems) {
            // warningValueItems[0]: forwardViolation, warningValueItems[1]: forwardWarning, warningValueItems[2]: reverseViolation, warningValueItems[3]: reverseWarning
            let markerStyle = {borderColor: "", size: 0};
            if(warningValueItems !== null) {
                if(selectedRobotTorqueData.motor_torque > warningValueItems[1].value) {
                    this.logCheckValues.forwardWarning++;
                    if(this.logCheckValues.logCheckValue === this.logCheckValues.forwardWarning) {
                        markerStyle.borderColor = this.ui.chartLineColor.forwardWarning;
                        markerStyle.size = 10;
                        this.setRealTimeLogListDatas("forwardWarning",selectedRobotTorqueData, this.nodeInfos.selectedRobotInfo);
                        this.logCheckValues.forwardWarning = 0;
                    }
                }
                else {
                    this.logCheckValues.forwardWarning = 0;
                }
                
                if(selectedRobotTorqueData.motor_torque < warningValueItems[1].value && selectedRobotTorqueData.motor_torque > warningValueItems[0].value) {
                    this.logCheckValues.forwardViolation++;
                    if(this.logCheckValues.logCheckValue === this.logCheckValues.forwardViolation) {
                        markerStyle.borderColor = this.ui.chartLineColor.forwardViolation;
                        markerStyle.size = 10;
                        this.setRealTimeLogListDatas("forwardViolation", selectedRobotTorqueData, this.nodeInfos.selectedRobotInfo);
                        this.logCheckValues.forwardViolation = 0;
                    }
                }
                else {
                    this.logCheckValues.forwardViolation = 0;
                }
                
                if(selectedRobotTorqueData.motor_torque > warningValueItems[3].value && selectedRobotTorqueData.motor_torque < warningValueItems[2].value) {
                    this.logCheckValues.reverseViolation++;
                    if(this.logCheckValues.logCheckValue === this.logCheckValues.reverseViolation) {
                        markerStyle.borderColor = this.ui.chartLineColor.reverseViolation;
                        markerStyle.size = 10;
                        this.setRealTimeLogListDatas("reverseViolation", selectedRobotTorqueData, this.nodeInfos.selectedRobotInfo)
                        this.logCheckValues.reverseViolation = 0;
                    }
                }
                else {
                    this.logCheckValues.reverseViolation = 0;
                }
                
                if(selectedRobotTorqueData.motor_torque < warningValueItems[3].value) {
                    this.logCheckValues.reverseWarning++;
                    if(this.logCheckValues.logCheckValue === this.logCheckValues.reverseWarning) {
                        markerStyle.borderColor = this.ui.chartLineColor.reverseWarning;
                        markerStyle.size = 10;
                        this.setRealTimeLogListDatas("reverseWarning", selectedRobotTorqueData, this.nodeInfos.selectedRobotInfo);
                        this.logCheckValues.reverseWarning = 0;
                    }
                }
                else {
                    this.logCheckValues.reverseWarning = 0;
                } 
            }
            return markerStyle;
        },

        setRealTimeLogListDatas(warningType, selectedRobotTorqueData, selectedRobotInfo) {
            let logListData = {};
            logListData['timestamp'] = selectedRobotTorqueData.time_stamp;
            logListData['robotid'] = selectedRobotInfo.robotid;
            this.datas.warningValueItems.forEach(warningValueItem => {
                if(warningType === warningValueItem.id) {
                    logListData[String(warningType).toLocaleLowerCase()] = selectedRobotTorqueData.motor_torque;
                }
                else {
                    logListData[String(warningValueItem.id).toLocaleLowerCase()] = null;
                }
            })
            this.saveRealTimeLogListDatas(logListData);
        },

        saveRealTimeLogListDatas(logListData) {
            this.$http.post('/realtimeview/robot/log', logListData)
            .then(result=> {
                if(result.status === 200) {
                    if(this.datas.warningLogListDatas.length > this.datas.chartDataLimit) {
                        this.datas.warningLogListDatas = [];
                    }
                    this.datas.warningLogListDatas.unshift(logListData);
                }
            })
        },

        getRealTimeLogListDatas(selectedRobotInfo) {
            this.$http.get('realtimeview/robot/log', {params: {
                date: this.getNowTimeStamp()
            }})
            .then(result => {
                let tempDatas = result.data.split('\n');
                let realTimeLogListDatas = [];
                tempDatas.pop();
                tempDatas.forEach(tempData => {
                    let test = JSON.parse(Object(tempData));
                    if(selectedRobotInfo.robotid === test.message.robotid) {
                        this.datas.warningLogListDatas.unshift(test.message);
                    }
                })
            })
        },

        setRealtimeAxisDXChartDatas(realTimeAxisDatas) {
            if(this.datas.realTimeChartDatas.length === this.datas.axisNames.length) {
                this.datas.chartIndex = this.datas.realTimeChartDatas[0].data[this.datas.realTimeChartDatas[0].data.length-1].x;
                this.datas.realTimeChartDatas.forEach((realTimeChartData, index) => {
                    if(realTimeChartData.data.length >= this.datas.chartDataLimit) {
                        realTimeChartData.data.splice(0,realTimeAxisDatas.length);
                    }
                    let chartIndex = this.datas.chartIndex;
                    realTimeAxisDatas.forEach(realTimeAxisData => {
                        chartIndex++;
                        realTimeChartData.data.push(
                            {x: chartIndex, label: realTimeAxisData.time_stamp,y: realTimeAxisData.motor_torque[index]}
                        )
                    })
                });
            }
            else {
                this.datas.axisNames.forEach((axis, index) => {
                    let chartIndex = this.datas.chartIndex;
                    this.datas.realTimeChartDatas.push({id: axis.id, data: []});
                    realTimeAxisDatas.forEach(realTimeAxisData => {
                        chartIndex++;
                        this.datas.realTimeChartDatas[index].data.push(
                            {x: chartIndex, label: realTimeAxisData.time_stamp,y: realTimeAxisData.motor_torque[index]}
                        )
                    })
                });
            }
        },

        setRealtimeAxisChartDatas(realTimeAxisDatas) {
            this.datas.chartIndex++;
            if(this.datas.realTimeChartDatas.length === realTimeAxisDatas.motor_torque.length) {
                this.datas.realTimeChartDatas.forEach((realTimeChartData, index) => {
                    if(Number(realTimeChartData.id) === index+1) {
                        if(realTimeChartData.data.length >= this.datas.chartDataLimit) {
                            realTimeChartData.data.shift();
                        }
                        realTimeChartData.data.push(
                            {x: this.datas.chartIndex, label: realTimeAxisDatas.time_stamp,y: realTimeAxisDatas.motor_torque[index]}
                        );
                    }
                });
            }
            else {
                this.datas.axisNames.forEach((axis, index) => {
                    this.datas.realTimeChartDatas.push({
                        id: axis.id,
                        data: [
                            {x: this.datas.chartIndex, label: realTimeAxisDatas.time_stamp,y: realTimeAxisDatas.motor_torque[index]}
                        ]
                    });
                });
            }
        },

        setRealtimeDXChartDatas(selectedRobotTorqueDatas, relationRobotTorqueDatas, warningValueItems) {
            // warningValueItems[0]: forwardViolation, warningValueItems[1]: forwardWarning, warningValueItems[2]: reverseViolation, warningValueItems[3]: reverseWarning
            if(this.datas.realTimeChartDatas.length > 0) {
                this.datas.chartIndex = this.datas.realTimeChartDatas[0].data[this.datas.realTimeChartDatas[0].data.length-1].x;
                this.datas.realTimeChartDatas.forEach(realTimeChartData => {
                    if(realTimeChartData.id === "selectedRobot") {
                        let chartIndex = this.datas.chartIndex;
                        selectedRobotTorqueDatas.forEach(selectedRobotTorqueData => {
                            let markerStyle = this.setWarningTorqueValue(selectedRobotTorqueData, warningValueItems);
                            chartIndex++;
                            realTimeChartData.data.push(
                                {
                                    x: chartIndex,
                                    label: selectedRobotTorqueData.time_stamp,
                                    y: selectedRobotTorqueData.motor_torque,
                                    markerBorderColor: markerStyle.borderColor,
                                    markerSize: markerStyle.size,
                                    indexLabelFontColor: markerStyle.borderColor
                                }
                            )
                        })
                    }
                    else if(realTimeChartData.id === "relationRobot") {
                        let chartIndex = this.datas.chartIndex;
                        relationRobotTorqueDatas.forEach(relationRobotTorqueData => {
                            chartIndex++;
                            realTimeChartData.data.push(
                                {
                                    x: chartIndex,
                                    label: relationRobotTorqueData.time_stamp,
                                    y: relationRobotTorqueData.motor_torque,
                                }
                            )
                        })
                    }
                    else if(realTimeChartData.id === "forwardWarning") {
                        let chartIndex = this.datas.chartIndex;
                        for(let i = 0; i < selectedRobotTorqueDatas.length; i++) {
                            chartIndex++;
                            realTimeChartData.data.push(
                                {
                                    x: chartIndex,
                                    y: Number(warningValueItems[1].value)
                                }
                            )
                        }
                        
                    }
                    else if(realTimeChartData.id === "forwardViolation") {
                        let chartIndex = this.datas.chartIndex;
                        for(let i = 0; i < selectedRobotTorqueDatas.length; i++) {
                            chartIndex++;
                            realTimeChartData.data.push(
                                {
                                    x: chartIndex,
                                    y: Number(warningValueItems[0].value)
                                }
                            )
                        }
                    }

                    else if(realTimeChartData.id === "reverseWarning") {
                        let chartIndex = this.datas.chartIndex;
                        for(let i = 0; i < selectedRobotTorqueDatas.length; i++) {
                            chartIndex++;
                            realTimeChartData.data.push(
                                {
                                    x: chartIndex,
                                    y: Number(warningValueItems[3].value)
                                }
                            )
                        }
                    }
                    else if(realTimeChartData.id === "reverseViolation") {
                        let chartIndex = this.datas.chartIndex;
                        for(let i = 0; i < selectedRobotTorqueDatas.length; i++) {
                            chartIndex++;
                            realTimeChartData.data.push(
                                {
                                    x: chartIndex,
                                    y: Number(warningValueItems[2].value)
                                }
                            )
                        }
                    }

                    if(realTimeChartData.data.length >= this.datas.chartDataLimit) {
                        realTimeChartData.data.splice(0,selectedRobotTorqueDatas.length);
                    }
                })
            }
            else {
                if(selectedRobotTorqueDatas.length > 0) {
                    let chartIndex = this.datas.chartIndex;
                    this.datas.realTimeChartDatas.push({id: "selectedRobot", data: []});
                    selectedRobotTorqueDatas.forEach(selectedRobotTorqueData => {
                        let markerStyle = this.setWarningTorqueValue(selectedRobotTorqueData, warningValueItems);
                        chartIndex++;
                        this.datas.realTimeChartDatas[0].data.push(
                            {
                                x: chartIndex,
                                label: selectedRobotTorqueData.time_stamp,
                                y: selectedRobotTorqueData.motor_torque,
                                markerBorderColor: markerStyle.borderColor,
                                markerSize: markerStyle.size,
                                indexLabelFontColor: markerStyle.borderColor
                            }
                        )
                    })
                }
                if(relationRobotTorqueDatas !== null && relationRobotTorqueDatas.length > 0) {
                    let chartIndex = this.datas.chartIndex;
                    this.datas.realTimeChartDatas.push({id: "relationRobot", data: []});
                    relationRobotTorqueDatas.forEach(relationRoboTorqueData => {
                        chartIndex++;
                        this.datas.realTimeChartDatas[1].data.push(
                            {
                                x: chartIndex,
                                label: relationRoboTorqueData.time_stamp,
                                y: relationRoboTorqueData.motor_torque
                            }
                        )
                    })
                }
                
                if(warningValueItems !== null && warningValueItems.length > 0) {
                    // // warningValueItems[0]: forwardViolation, warningValueItems[1]: forwardWarning, warningValueItems[2]: reverseViolation, warningValueItems[3]: reverseWarning
                    warningValueItems.forEach((warningValueItem, index) => {
                        let chartIndex = this.datas.chartIndex;
                        this.datas.realTimeChartDatas.push({id: warningValueItem.id, data: []});
                        for(let i = 0; i < this.datas.realTimeChartDatas[0].data.length; i++) {
                            chartIndex++;
                            this.datas.realTimeChartDatas[this.datas.realTimeChartDatas.length-1].data.push(
                                {
                                    x: chartIndex,
                                    y: Number(warningValueItem.value)
                                }
                            )
                        }
                    })
                }
            }
        },

        setRealtimeChartDatas(selectedRobotTorqueData, relationRobotTorqueData, warningValueItems) {
             // // warningValueItems[0]: forwardViolation, warningValueItems[1]: forwardWarning, warningValueItems[2]: reverseViolation, warningValueItems[3]: reverseWarning
            this.datas.chartIndex++;
            if(this.datas.realTimeChartDatas.length > 0) {
                this.datas.realTimeChartDatas.forEach(realTimeChartData => {
                    if(realTimeChartData.id === "selectedRobot") {
                        let markerStyle = this.setWarningTorqueValue(selectedRobotTorqueData, warningValueItems);
                        realTimeChartData.data.push(
                            {   x: this.datas.chartIndex, 
                                label: selectedRobotTorqueData.time_stamp, 
                                y: selectedRobotTorqueData.motor_torque, 
                                markerBorderColor: markerStyle.borderColor,
                                markerSize: markerStyle.size,
                                indexLabelFontColor: markerStyle.borderColor
                            }
                        );

                    }
                    else if(realTimeChartData.id === "relationRobot") {
                        realTimeChartData.data.push(
                            {   x: this.datas.chartIndex, 
                                label: relationRobotTorqueData.time_stamp, 
                                y: relationRobotTorqueData.motor_torque
                            }
                        );
                    }
                    else if(realTimeChartData.id === "forwardWarning") {
                        realTimeChartData.data.push(
                            {   x: this.datas.chartIndex, 
                                y: Number(warningValueItems[1].value)
                            }
                        );
                    }
                    else if(realTimeChartData.id === "forwardViolation") {
                        realTimeChartData.data.push(
                            {   x: this.datas.chartIndex, 
                                y: Number(warningValueItems[0].value)
                            }
                        );
                    }

                    else if(realTimeChartData.id === "reverseWarning") {
                        realTimeChartData.data.push(
                            {   x: this.datas.chartIndex, 
                                y: Number(warningValueItems[3].value)
                            }
                        );
                    }
                    else if(realTimeChartData.id === "reverseViolation") {
                        realTimeChartData.data.push(
                            {   x: this.datas.chartIndex, 
                                y: Number(warningValueItems[2].value)
                            }
                        );
                    }

                    if(realTimeChartData.data.length >= this.datas.chartDataLimit) {
                        realTimeChartData.data.shift();
                    }
                })
            }
            else {
                let markerStyle = this.setWarningTorqueValue(selectedRobotTorqueData, warningValueItems);
                this.datas.realTimeChartDatas.push(
                    {
                        id: "selectedRobot", 
                        data: [
                            {
                                x: this.datas.chartIndex, 
                                label: selectedRobotTorqueData.time_stamp, 
                                y: selectedRobotTorqueData.motor_torque,
                                markerBorderColor: markerStyle.borderColor,
                                markerSize: markerStyle.size,
                                indexLabelFontColor: markerStyle.borderColor
                            }
                        ]
                    }
                );

                if(relationRobotTorqueData !== null) {
                    this.datas.realTimeChartDatas.push(
                    {
                        id: "relationRobot", 
                        data: [
                            {
                                x: this.datas.chartIndex, 
                                label: relationRobotTorqueData.time_stamp, 
                                y: relationRobotTorqueData.motor_torque 
                            }
                        ]
                        
                    });
                }

                if(warningValueItems !== null) {
                     // // warningValueItems[0]: forwardViolation, warningValueItems[1]: forwardWarning, warningValueItems[2]: reverseViolation, warningValueItems[3]: reverseWarning
                    this.datas.realTimeChartDatas.push({id: warningValueItems[0].id, data: [{x: this.datas.chartIndex, y: Number(warningValueItems[0].value)}]});
                    this.datas.realTimeChartDatas.push({id: warningValueItems[1].id, data: [{x: this.datas.chartIndex, y: Number(warningValueItems[1].value)}]});
                    this.datas.realTimeChartDatas.push({id: warningValueItems[2].id, data: [{x: this.datas.chartIndex, y: Number(warningValueItems[2].value)}]});
                    this.datas.realTimeChartDatas.push({id: warningValueItems[3].id, data: [{x: this.datas.chartIndex, y: Number(warningValueItems[3].value)}]});
                }
            }
            
        }
    }
}
</script>

<style lang="scss" scoped>
    @import './realtimetorque';
</style>
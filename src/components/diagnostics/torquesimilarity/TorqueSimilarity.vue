<template>
    <v-layout column fill-height>
        <v-layout>
            <a><img class="pt-1 pl-1 pr-4" :src="ui.icons.firstIcon"/></a>
            <v-flex class="pr-2" lg2>
                <date-picker 
                    v-bind:placeHolder="ui.text.firstDateText" 
                    v-bind:textColor="ui.colors.firstColor"
                    v-on:getDate="getDate($event, 'first')"
                ></date-picker>
            </v-flex>
            <v-flex lg2>
                <selector 
                    class="TorqueSimilaritySelector pl-2 pr-2" 
                    v-bind:selectorTitle="ui.text.boothText" 
                    v-bind:selectorOptions="getBoothInfos"
                    v-bind:selectorColor="ui.colors.firstColor"
                    v-on:selectedTarget="getTargetBoothId($event, 'first')"
                ></selector>
            </v-flex>
            <v-flex lg2>
                <selector 
                    class="TorqueSimilaritySelector pl-2 pr-2"
                    v-bind:selectorTitle="ui.text.zoneText"
                    v-bind:selectorOptions="datas.firstProcessInfos.zoneInfos"
                    v-bind:selectorColor="ui.colors.firstColor"
                    v-on:selectedTarget="getTargetZoneId($event, 'first')"
                ></selector>
            </v-flex>
            <v-flex lg2>
                <selector 
                    class="TorqueSimilaritySelector pl-2 pr-2"
                    v-bind:selectorTitle="ui.text.robotText" 
                    v-bind:selectorOptions="datas.firstProcessInfos.robotInfos"
                    v-bind:selectorColor="ui.colors.firstColor"
                    v-on:selectedTarget="getTargetRobotId($event, 'first')"
                ></selector>
            </v-flex>
            <v-flex lg2>
                <selector 
                    class="TorqueSimilaritySelector pl-2 pr-2" 
                    v-bind:selectorTitle="ui.text.jobText"
                    v-bind:selectorOptions="datas.firstProcessInfos.jobInfos"
                    v-bind:selectorColor="ui.colors.firstColor"
                    v-on:selectedTarget="getTargetJobFile($event, 'first')"
                ></selector>
            </v-flex>
            <v-spacer/>
            <v-btn class="smallBtn ml-1" :color="ui.colors.btnColor" @click="searchBtnClicked">{{ui.text.searchText}}</v-btn>
            <v-btn class="smallBtn ml-1" :color="ui.colors.btnColor" @click="jobSearchBtnClicked">{{ui.text.detailSearchText}}</v-btn>
        </v-layout>
        <v-layout>
            <a><img class="pt-1 pl-1 pr-4" :src="ui.icons.secondIcon"/></a>
            <v-flex class="pr-2" lg2>
                <date-picker 
                    v-bind:conditionalDate="datas.firstSearchDatas.date"
                    v-bind:placeHolder="ui.text.secondDateText"
                    v-bind:textColor="ui.colors.secondColor"
                    v-on:getDate="getDate($event, 'second')"
                ></date-picker>
            </v-flex>
            <v-flex lg2>
                <selector 
                    class="TorqueSimilaritySelector pl-2 pr-2" 
                    v-bind:selectorTitle="ui.text.boothText" 
                    v-bind:selectorOptions="getBoothInfos"
                    v-bind:selectorTRATarget="datas.traTargetDatas.boothInfo"
                    v-bind:selectorColor="ui.colors.secondColor"
                    v-on:selectedTarget="getTargetBoothId($event, 'second')"
                ></selector>
            </v-flex>
            <v-flex lg2>
                <selector 
                    class="TorqueSimilaritySelector pl-2 pr-2" 
                    v-bind:selectorTitle="ui.text.zoneText" 
                    v-bind:selectorOptions="datas.secondProcessInfos.zoneInfos"
                    v-bind:selectorTRATarget="datas.traTargetDatas.zoneInfo"
                    v-bind:selectorColor="ui.colors.secondColor"
                    v-on:selectedTarget="getTargetZoneId($event, 'second')"
                ></selector>
            </v-flex>
            <v-flex lg2>
                <selector 
                    class="TorqueSimilaritySelector pl-2 pr-2" 
                    v-bind:selectorTitle="ui.text.robotText" 
                    v-bind:selectorOptions="datas.secondProcessInfos.robotInfos"
                    v-bind:selectorTRATarget="datas.traTargetDatas.robotInfo"
                    v-bind:selectorColor="ui.colors.secondColor"
                    v-on:selectedTarget="getTargetRobotId($event, 'second')"
                ></selector>
            </v-flex>
            <v-flex lg2>
                <selector 
                    class="TorqueSimilaritySelector pl-2 pr-2" 
                    v-bind:selectorTitle="ui.text.jobText"
                    v-bind:selectorOptions="datas.secondProcessInfos.jobInfos"
                    v-bind:selectorColor="ui.colors.secondColor"
                    v-on:selectedTarget="getTargetJobFile($event, 'second')"
                ></selector>
            </v-flex>
        </v-layout>
        <v-layout class="pt-2" column fill-height v-if="flags.default === true">
            <v-layout>
                <p 
                v-bind:style="ui.style.titleStyle"
                class="pl-1 pt-2">{{ui.text.chartTitleText}}</p>
                <v-spacer/>
                <div class="pr-2" v-for="dataByAxis in datas.datasByAxis" :key="dataByAxis.id">
                    <v-btn class="axisBtn" :ref="dataByAxis.id" @click="axisBtnClicked(dataByAxis.id)" flat> {{dataByAxis.title}} </v-btn>
                </div>
            </v-layout>
        </v-layout>
        <v-layout class="pt-2" column v-else>
            <v-layout>
                <v-flex lg6 class="pr-2">
                    <v-card>
                        <v-card-title v-bind:style="ui.style.firstTitleStyle" class="cardTitle">
                            <span>{{datas.firstFilterDatas.date + "&nbsp;"}}</span>
                            <span>{{datas.firstFilterDatas.boothName + '-'}}</span>
                            <span>{{datas.firstFilterDatas.zoneName + '-'}}</span>
                            <span>{{datas.firstFilterDatas.robotName + "&nbsp;"}}</span>
                            <span>{{datas.firstFilterDatas.jobFile + "&nbsp;"}}</span>
                        </v-card-title>
                        <grid-table
                            v-bind:headerData="datas.workInfoTableHeaderData"
                            v-bind:contentData="datas.workListDatas.firstWorkListDatas"
                            v-on:getGridDataTableData="getWorkDatas($event, 'first')"
                            v-bind:highlightFlag="true"
                        ></grid-table>
                    </v-card>
                </v-flex>
                <v-flex lg6 class="pl-2">
                    <v-card>
                        <v-card-title v-bind:style="ui.style.secondTitleStyle" class="cardTitle">
                            <span>{{datas.secondFilterDatas.date + "&nbsp;"}}</span>
                            <span>{{datas.secondFilterDatas.boothName + '-'}}</span>
                            <span>{{datas.secondFilterDatas.zoneName + '-'}}</span>
                            <span>{{datas.secondFilterDatas.robotName + "&nbsp;"}}</span>
                            <span>{{datas.secondFilterDatas.jobFile + "&nbsp;"}}</span>
                        </v-card-title>
                        <grid-table
                            v-bind:headerData="datas.workInfoTableHeaderData"
                            v-bind:contentData="datas.workListDatas.secondWorkListDatas"
                            v-on:getGridDataTableData="getWorkDatas($event, 'second')"
                            v-bind:highlightFlag="true"
                        ></grid-table>
                    </v-card>
                </v-flex>
            </v-layout>
            <v-layout class="pt-2">
                <p 
                v-bind:style="ui.style.titleStyle"
                class="pl-1 pt-2">{{ui.text.chartTitleText}}</p>
                <v-spacer/>
                <p v-bind:style="ui.style.titleStyle" class="pl-1 pt-1"  v-bind:showFlag="flags.autoSelector"> {{ui.text.axisXOutputText + ": "}}</p>
                <auto-selector 
                    class="TorqueSimilaritySelector pt-1 pr-3"
                    v-bind:showFlag="flags.autoSelector"
                    v-bind:selectorOptions="datas.chartOutputTypes"
                    v-on:selectedItem="getChartOutputTypes"
                ></auto-selector>
                <div class="pr-2" v-for="dataByAxis in datas.datasByAxis" :key="dataByAxis.id">
                    <v-btn class="axisBtn" :ref="dataByAxis.id" @click="axisBtnClicked(dataByAxis.id)" flat> {{dataByAxis.title}} </v-btn>
                </div>
            </v-layout>
        </v-layout>
        <torque-similarity-chart
            v-bind:chartId="'torqueSimilarityChart'"
            v-bind:chartHeight="ui.chartHeight.default"
            v-bind:chartDatas="datas.trendDatas"
            v-bind:chartOutputType="datas.chartOutputType"
            v-bind:chartLabels="{firstLabel: datas.firstFilterDatas.jobFile, secondLabel: datas.secondFilterDatas.jobFile}"
        ></torque-similarity-chart>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'
import DatePicker from '@/commons/DatePicker'
import Selector from '@/commons/Selector'
import AutoSelector from '@/commons/AutoSelector'
import GridTable from '@/commons/GridTable'
import TorqueSimilarityChart from './torquesimilarity/TorqueSimilarityChart';
export default {
    components: {DatePicker, Selector, AutoSelector, TorqueSimilarityChart, GridTable},
    data() {
        return {
            ui: {
                style: {
                    titleStyle: {},
                    firstTitleStyle: {},
                    secondTitleStyle: {},
                    tableHeaderStyle: {}
                },
                chartHeight: {
                    default: 800,
                },
                icons: {
                    firstIcon: require("@/images/selector_first_icon.png"),
                    secondIcon: require("@/images/selector_second_icon.png"),
                    searchBtnIcon: require("@/images/search_icon.png"),
                    excelBtnIcon: require("@/images/excel_icon.png")
                },
                colors: {
                    firstColor: "#0ca889 !important",
                    secondColor: "#ffbb00 !important",
                    btnColor: "#237ffe"
                },
                text: {
                    firstDateText: this.$t(`diagnostics.torqueSimilarity.searchDate1`),
                    secondDateText: this.$t(`diagnostics.torqueSimilarity.searchDate2`),
                    boothText: this.$t(String(`selector.booth`)),
                    zoneText: this.$t(String(`selector.zone`)),
                    robotText: this.$t(String(`selector.robot`)),
                    jobText: this.$t(String(`selector.job`)),
                    chartTitleText: this.$t(`diagnostics.torqueSimilarity.chartTitle`),
                    searchText: this.$t(`diagnostics.torqueSimilarity.searchText`),
                    detailSearchText: this.$t(`diagnostics.torqueSimilarity.detailSearchText`),
                    axisXOutputText: this.$t(`diagnostics.torquedata.axisXOutputTitle`)
                }
            },
            datas: {
                firstSearchDatas: {
                    date: "",
                    boothId: "",
                    zoneId: "",
                    robotId: "",
                    jobFile: ""
                },
                secondSearchDatas: {
                    date: "",
                    boothId: "",
                    zoneId: "",
                    robotId: "",
                    jobFile: ""
                },
                firstFilterDatas: {},
                secondFilterDatas: {},
                traTargetDatas: {
                    boothInfo: null,
                    zoneInfo: null,
                    robotInfo: null
                },
                firstProcessInfos: {
                    zoneInfos: [],
                    robotInfos: [],
                    jobInfos: []
                },
                secondProcessInfos: {
                    zoneInfos: [],
                    robotInfos: [],
                    jobInfos: []
                },
                trendDatas: {
                    firstTrendDatas: [],
                    secondTrendDatas: []
                },
                workListDatas: {
                    firstWorkListDatas: [],
                    secondWorkListDatas: []
                },
                datasByAxis: [
                    {id: '1', title: this.$t(`diagnostics.torquedata.loadfactorbyaxis.1axis`), active: false},
                    {id: '2', title: this.$t(`diagnostics.torquedata.loadfactorbyaxis.2axis`), active: false},
                    {id: '3', title: this.$t(`diagnostics.torquedata.loadfactorbyaxis.3axis`), active: false},
                    {id: '4', title: this.$t(`diagnostics.torquedata.loadfactorbyaxis.4axis`), active: false},
                    {id: '5', title: this.$t(`diagnostics.torquedata.loadfactorbyaxis.5axis`), active: false},
                    {id: '6', title: this.$t(`diagnostics.torquedata.loadfactorbyaxis.6axis`), active: false},
                    {id: '7', title: this.$t(`diagnostics.torquedata.loadfactorbyaxis.7axis`), active: false}
                ],
                workInfoTableHeaderData: [
                    { text: this.$t(`diagnostics.torquedata.worktimetable.jobname`), value: 'job_name', sortable: false, align: 'center'},
                    { text: this.$t(`diagnostics.torquedata.worktimetable.starttime`), value: 's_time', sortable: false, align: 'center'},
                    { text: this.$t(`diagnostics.torquedata.worktimetable.endtime`), value: 'e_time', sortable: false, align: 'center'},
                    { text: this.$t(`diagnostics.torquedata.worktimetable.worktime`), value: 'cycle_time', sortable: false, align: 'center'}
                ],
                chartOutputTypes: [
                    {id: "stepno", name: "Step Number"},
                    {id: "sec", name: "Time(sec)"}
                ],
                chartOutputType: {}
            },
            flags: {
                default: true,
                autoSelector: false
            }
        }
    },

    created() {
        this.initialize();
    },

    mounted() {
        this.initializeStyle();
    },

    computed: {
        ...mapGetters({
            factoryId: 'getFactoryId',
            getBoothInfos: 'getBoothInfos',
            getZoneInfos: 'getZoneInfos',
            getRobotInfos: 'getRobotInfos'     
        })
    },

    methods: {
        initializeStyle() {
            document.documentElement.style.setProperty("--btnAxisBorderColor", this.$style.common.axisButtonItemBorderColor);
            document.documentElement.style.setProperty("--axisBtnHoverBackgroundColor", this.$style.common.axisButtonItemActiveBackgroundColor);
            document.documentElement.style.setProperty("--axisBtnHoverColor", this.$style.common.axisButtonItemActiveColor);
        },

        initialize() {
            this.ui.style.titleStyle = this.$style.getTitleStyle();
            Object.assign(this.ui.style.firstTitleStyle, this.ui.style.titleStyle);
            this.ui.style.firstTitleStyle.color = '#0ca889';
            Object.assign(this.ui.style.secondTitleStyle,this.ui.style.titleStyle);
            this.ui.style.secondTitleStyle.color = '#FFBB00';
        },

        getDate(date, flag) {
            if(date !== undefined) {
                this.datas[flag+"SearchDatas"].date = date;
            }
        },

        getTargetBoothId(target, flag) {
            this.datas[flag+"SearchDatas"]["boothId"] = target.target;
            this.datas[flag+"SearchDatas"]["boothName"] = target.name;
            if(flag === 'first') {
                this.datas.traTargetDatas.boothInfo = target;
            }
            this.datas[flag+"ProcessInfos"].zoneInfos = [];
            for(let i = 0; i < this.getZoneInfos.length; i++) {
                if(this.getZoneInfos[i].booth === this.datas[flag+"SearchDatas"].boothId) {
                    this.datas[flag+"ProcessInfos"].zoneInfos.push(this.getZoneInfos[i]);
                }
            }
        },

        getTargetZoneId(target, flag) {
            this.datas[flag+"SearchDatas"]["zoneId"] = target.target;
            this.datas[flag+"SearchDatas"]["zoneName"] = target.name;
            if(flag === 'first') {
                this.datas.traTargetDatas.zoneInfo = target;
            }
            this.datas[flag+"ProcessInfos"].robotInfos = [];
            for(let i = 0; i < this.getRobotInfos.length; i++) {
                if(this.getRobotInfos[i].zone === this.datas[flag+"SearchDatas"].zoneId) {
                    this.datas[flag+"ProcessInfos"].robotInfos.push(this.getRobotInfos[i]);
                }
            }
        },

        async getTargetRobotId(target, flag) {
            this.datas[flag+"SearchDatas"]["robotId"] = target.target;
            this.datas[flag+"SearchDatas"]["robotName"] = target.name;
            if(flag === 'first') {
                 this.datas.traTargetDatas.robotInfo = target;
            }
            if(this.checkSearchDatas(this.datas[flag+"SearchDatas"]) === true) {
                this.datas[flag+"ProcessInfos"].jobInfos = await this.getJobList(this.datas[flag+"SearchDatas"]);
                this.datas[flag+"SearchDatas"]["robotType"] = await this.getRobotType(this.datas[flag+"SearchDatas"]);
            } else {
                this.datas[flag+"ProcessInfos"].jobInfos = [];
                this.datas[flag+"SearchDatas"]["robotType"] = "";
            }
        },

        getRobotType(searchDatas) {
            return new Promise((resolve, reject) => {
                this.$http.get(`diagnostics/robottype/factoryid/${this.factoryId}/boothid/${searchDatas.boothId}/zoneid/${searchDatas.zoneId}/robotid/${searchDatas.robotId}`).then(result => {
                    if(result.data != '') {
                        resolve(result.data[0].modelname.substring(0,2));
                    } 
                }).catch(error => {
                    reject(error);
                })
            })
        },

        getJobList(searchDatas) {
            return new Promise((resolve, reject) => {
                let tempJobList = [];
                this.$http.get(`/diagnostics/joblist/factoryid/${this.factoryId}/boothid/${searchDatas.boothId}/zoneid/${searchDatas.zoneId}/robotid/${searchDatas.robotId}/date/${searchDatas.date}`).then(result => {
                    if(result.data.length > 0) {
                        result.data.forEach(joblist => {
                            tempJobList.push({id: joblist.job_name, name: joblist.job_name})
                        });
                    }
                    resolve(tempJobList);
                }).catch(error => {
                    reject(error);
                })
            })
        },

        getChartOutputTypes(chartOutputType) {
            this.datas.chartOutputType = chartOutputType;
        },

        getTargetJobFile(target, flag) {
            this.datas[flag+"SearchDatas"]['jobFile'] = target.target;
        },

        checkSearchDatas(searchDatas) {
            let checkFlag;
            if(this.factoryId !== undefined && searchDatas.boothId !== undefined && searchDatas.zoneId !== undefined && searchDatas.robotId !== undefined && searchDatas.date !== "") {
                checkFlag = true;
            } else {
                checkFlag = false;
            }
            return checkFlag;
        },

        setFilterDatas(searchDatas) {
            return Object.assign({}, searchDatas);
        },

        async searchBtnClicked() {
            this.flags.default = true;
            this.ui.chartHeight.default = 800;
            if(this.checkSearchDatas(this.datas.firstSearchDatas) === true && this.checkSearchDatas(this.datas.secondSearchDatas) === true && this.datas.firstSearchDatas.jobFile !== "" &&  this.datas.secondSearchDatas.jobFile !== "") {
                this.datas.chartOutputType = this.datas.chartOutputTypes[0];
                this.flags.autoSelector = false;
                this.datas.firstFilterDatas = this.setFilterDatas(this.datas.firstSearchDatas);
                this.datas.secondFilterDatas = this.setFilterDatas(this.datas.secondSearchDatas);
                this.axisBtnClicked(1);
            } else {
                this.$popmsg(this.$t(`diagnostics.torqueSimilarity.popMsg.checkSearchData`));
            }
        },

        getTorqueDatas(filterDatas, axis) {
            return new Promise((resolve, reject) => {
                this.$http.get(`/diagnostics/torquesimilarity/data/trend/factoryid/${this.factoryId}/boothid/${filterDatas.boothId}/zoneid/${filterDatas.zoneId}/robotid/${filterDatas.robotId}/axis/${axis}/jobname/${filterDatas.jobFile}/date/${filterDatas.date}`)
                .then(result => {
                    if(result.data.length > 0) {
                        resolve(result.data);
                    } else {
                        resolve([]);
                    }
                }).catch(error => {
                    reject(error);
                })
            })
        },

        getJobTorqueDatas(filterDatas, axis) {
            return new Promise((resolve, reject) => {
                let jobTorqueDatas = [{sec: [], secTorque: [], stepno: [], stepNoTorque: []}];
                Promise.all([
                    this.$http.get(`diagnostics/torquesimilarity/data/detail/time/trend/factoryid/${this.factoryId}/boothid/${filterDatas.boothId}/zoneid/${filterDatas.zoneId}/robotid/${filterDatas.robotId}/axis/${axis}/jobname/${filterDatas.jobFile}/startime/${filterDatas.startTime}/endtime/${filterDatas.endTime}`),
                    this.$http.get(`diagnostics/torquesimilarity/data/detail/stepno/trend/factoryid/${this.factoryId}/boothid/${filterDatas.boothId}/zoneid/${filterDatas.zoneId}/robotid/${filterDatas.robotId}/axis/${axis}/jobname/${filterDatas.jobFile}/startime/${filterDatas.startTime}/endtime/${filterDatas.endTime}`)
                ]).then(([jobTimeTorqueRes, jobStepnoTorqueRes]) => {
                    if(jobTimeTorqueRes.data.length > 0 && jobStepnoTorqueRes.data.length > 0) {
                        jobTimeTorqueRes.data.forEach(jobTimeTorqueData => {
                            jobTorqueDatas[0].sec.push(Number(jobTimeTorqueData.sec));
                            jobTorqueDatas[0].secTorque.push(Number(jobTimeTorqueData.torque));
                        })
                        jobStepnoTorqueRes.data.forEach(jobStepnoTorqueData => {
                            jobTorqueDatas[0].stepno.push(Number(jobStepnoTorqueData.stepno));
                            jobTorqueDatas[0].stepNoTorque.push(Number(jobStepnoTorqueData.torque));
                        })
                        resolve(jobTorqueDatas);
                    } else {
                        resolve([]);
                    }
                }).catch(error => {
                    reject(error);
                })
            })
        },

        async jobSearchBtnClicked() {
            if(this.checkSearchDatas(this.datas.firstSearchDatas) === true && this.checkSearchDatas(this.datas.secondSearchDatas) === true) {
                this.flags.default = false;
                this.ui.chartHeight.default = 400;
                this.datas.firstFilterDatas = this.setFilterDatas(this.datas.firstSearchDatas);
                this.datas.secondFilterDatas = this.setFilterDatas(this.datas.secondSearchDatas);
                this.datas.workListDatas.firstWorkListDatas = [];
                this.datas.workListDatas.secondWorkListDatas = [];
                if(this.datas.firstFilterDatas.robotType === 'DX' && this.datas.secondFilterDatas.robotType === 'DX') {
                    this.flags.autoSelector = true;
                    this.datas.workListDatas.firstWorkListDatas = await this.getJobWorkDatas(this.datas.firstFilterDatas);
                    this.datas.workListDatas.secondWorkListDatas = await this.getJobWorkDatas(this.datas.secondFilterDatas);
                    
                } else {
                    this.flags.autoSelector = false;
                    if(this.datas.firstFilterDatas.robotType === 'NX') {
                        this.$popmsg(this.$t(`diagnostics.torqueSimilarity.popMsg.search1NoFilterData`));
                    }
                    if(this.datas.secondFilterDatas.robotType === 'NX') {
                        this.$popmsg(this.$t(`diagnostics.torqueSimilarity.popMsg.search2NoFilterData`));
                    }
                }
            } else {
                this.$popmsg(this.$t(`diagnostics.torqueSimilarity.popMsg.checkSearchData`));
            }
        },

        getJobWorkDatas(filterDatas) {
            return new Promise((resolve, reject) => {
                this.$http.get(`/diagnostics/worklist/factoryid/${this.factoryId}/boothid/${filterDatas.boothId}/zoneid/${filterDatas.zoneId}/robotid/${filterDatas.robotId}/date/${filterDatas.date}/jobfile/${filterDatas.jobFile}`).then(result => {
                    if(result.data.length > 0) {
                        let tempWorkDatas = []
                        Object.keys(result.data).forEach(function eachKey(key) {
                            if (typeof result.data[key].s_time === 'string' && typeof result.data[key].e_time === 'string') {
                                result.data[key].s_time = result.data[key].s_time.replace("T", " ");
                                result.data[key].s_time = result.data[key].s_time.replace("Z", "");
                                result.data[key].e_time = result.data[key].e_time.replace("T", " ");
                                result.data[key].e_time = result.data[key].e_time.replace("Z", "");
                            }
                        });
                        tempWorkDatas = result.data;
                        if (tempWorkDatas.length % 5 != 0) {
                            let tempIndex = 5 - tempWorkDatas.length % 5;
                            for (let i = 0; i < tempIndex; i++) {
                                tempWorkDatas.push({ job_name: '', s_time: '', e_time: '', cycle_time: '' });
                            }
                        }
                        resolve(tempWorkDatas);
                    } else {
                        resolve([]);
                    }
                }).catch(error => {
                    reject(error);
                })
            })
        },

        getWorkDatas(event, flag) {
            this.datas[flag+"FilterDatas"]["startTime"] = event.s_time;
            this.datas[flag+"FilterDatas"]["endTime"] = event.e_time;
            if(this.datas.firstFilterDatas.startTime !== undefined && this.datas.firstFilterDatas.endTime && this.datas.secondFilterDatas.startTime && this.datas.secondFilterDatas.endTime) {
                this.axisBtnClicked(1);
            }
        },

        axisBtnHighLight(axisNum) {
            this.$nextTick(() => {
                let index = Object.keys(this.$refs)[axisNum-1];
                this.$refs[index][0].$el.style.backgroundColor = this.$style.common.axisButtonItemActiveBackgroundColor;
                this.$refs[index][0].$el.style.color = this.$style.common.axisButtonItemActiveColor;
                this.$refs[index][0].$el.style.border = 0;
                this.datas.datasByAxis[0].active = true;
                for (let i = 0; i < Object.keys(this.$refs).length; i++) {
                    if (i != (axisNum-1)) {
                        this.$refs[i + 1][0].$el.style.backgroundColor =  this.$style.common.axisButtonItemBackgroundColor;
                        this.$refs[i + 1][0].$el.style.color = this.$style.common.axisButtonItemColor;
                        this.$refs[i + 1][0].$el.style.border = "";  
                    }
                    this.datas.datasByAxis[i].active = false;
                }
            })
        },

        async axisBtnClicked(axisData) {
            this.datas.trendDatas.firstTrendDatas = [];
            this.datas.trendDatas.secondTrendDatas = []; 
            let index = Object.keys(this.$refs); 
            for (let i = 1; i <= index.length; i++) {
                if (axisData == i) {    
                    this.axisBtnHighLight(axisData);   
                    if (this.flags.default === true) {
                        this.datas.trendDatas.firstTrendDatas = await this.getTorqueDatas(this.datas.firstFilterDatas, axisData);
                        this.datas.trendDatas.secondTrendDatas = await this.getTorqueDatas(this.datas.secondFilterDatas, axisData);
                    } 
                    else {
                        this.datas.trendDatas.firstTrendDatas = await this.getJobTorqueDatas(this.datas.firstFilterDatas,axisData);
                        this.datas.trendDatas.secondTrendDatas = await this.getJobTorqueDatas(this.datas.secondFilterDatas,axisData);
                    }
                } 
            }
        }

    }
}
</script>

<style scoped lang="scss">
    @import './torquesimilarity';
</style>
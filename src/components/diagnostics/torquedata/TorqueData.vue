<template>
    <v-layout column>
        <v-layout column>
            <v-layout>
                <v-flex class="pr-2" lg3>
                    <date-picker v-on:getDate="getPrevDate"></date-picker>
                </v-flex>
                
                <v-flex class="pl-2 pr-2" lg3>
                </v-flex>
                
                <a><img class="pt-1 pl-4 pr-2" src="@/images/selector_icon.png"/></a>
                
                <v-flex lg2>
                    <selector 
                        class="TorqueDataSelector pl-2 pr-2" 
                        v-bind:selectorTitle="$t(String(`selector.booth`))" 
                        v-bind:selectorOptions="datas.targetBoothInfos"
                        v-on:selectedTarget="getTargetBoothId"
                    ></selector>
                </v-flex>
                
                <v-flex lg2>
                    <selector 
                        class="TorqueDataSelector pl-2 pr-2" 
                        v-bind:selectorTitle="$t(String(`selector.zone`))" 
                        v-bind:selectorOptions="datas.getSelectedTargetZoneInfos"
                        v-on:selectedTarget="getTargetZoneId"
                    ></selector>
                </v-flex>
                
                <v-flex lg2>
                    <selector 
                        class="TorqueDataSelector pl-2 pr-2" 
                        v-bind:selectorTitle="$t(String(`selector.robot`))" 
                        v-bind:selectorOptions="datas.getSelectedTargetRobotInfos"
                        v-on:selectedTarget="getTargetRobotId"
                    ></selector>
                </v-flex>
                <v-spacer/>
                <v-btn class="searchBtn" :color="ui.searchBtnColor"  @click="searchBtnClicked"><a class="pt-1"><img :src="ui.searchBtnIcon"></a></v-btn>
            </v-layout>
            <v-layout class="pt-4">
                <v-flex lg7>
                    <paging-data-grid
                        v-bind:headerData="datas.workInfoTableHeaderData"
                        v-bind:contentCount="datas.workInfoTableContentCount"
                        v-bind:contentData="datas.workInfoTableContentData"
                        v-on:getGridDataTableData="getWorTimeDatas"
                        v-bind:highlightFlag="true"
                    ></paging-data-grid>
                </v-flex>   
                <v-flex lg5 class="pl-4">
                    <setting-info-table
                        v-bind:contentDatas="datas.settingInfoTableDatas"
                    ></setting-info-table>
                </v-flex>
            </v-layout>
        </v-layout>
        <v-layout class="pt-3" column>
            <v-layout>
                <p 
                v-bind:style="ui.styleObject"
                class="pl-1 pt-2">{{ui.loadFactorTitle}}</p>
                <v-spacer/>
                <p v-bind:style="ui.styleObject" class="pl-1 pt-1"
                >{{ui.axisXOutputTitle + ": "}}</p>
                <auto-selector 
                    class="TorqueDataSelector pt-1 pr-3"
                    v-bind:showFlag="datas.flag.autoSelector"
                    v-bind:selectorOptions="datas.chartOutputTypes"
                    v-on:selectedItem="getChartOutputTypes"
                ></auto-selector>
                <div class="pr-2" v-for="dataByAxis in datas.datasByAxis" :key="dataByAxis.id">
                    <v-btn class="axisBtn" :ref="dataByAxis.id" @click="axisBtnClicked(dataByAxis)" flat :disabled="datas.flag.axis"> {{renderAxisTitle(dataByAxis.title)}} </v-btn>
                </div>
            </v-layout>
            <v-layout class="subTitle pl-1" v-if="datas.selectedWorkDatas != ''">
                <p class="jobName pr-2">{{datas.selectedWorkDatas.job_name}}</p>
                <p class="pr-2">{{'START  '+ datas.selectedWorkDatas.start_time}}</p>
                <p class="pr-2">{{'END  '+ datas.selectedWorkDatas.end_time}}</p>
                <p class="">{{'CYCLE  '+ datas.selectedWorkDatas.cycle_time}}</p>
            </v-layout>
            <load-factor-by-axis
                v-bind:chartId="'torqueDataChart'"
                v-bind:chartDatas="datas.chartDatas"
                v-bind:chartOutputType="datas.chartOutputType"
            ></load-factor-by-axis>
        </v-layout>
        <loading-dlg v-bind:loadingFlag="datas.event.dialog"></loading-dlg>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'
import DatePicker from '@/commons/DatePicker'
import Selector from '@/commons/Selector'
import AutoSelector from '@/commons/AutoSelector'
import PagingDataGrid from '@/commons/PagingDataGrid'
import LoadingDlg from '@/commons/LoadingDlg'
import SettingInfoTable from '@/components/diagnostics/torquedata/torquedata/SettingInfoTable'
import LoadFactorByAxis from '@/components/diagnostics/torquedata/torquedata/LoadFactorByAxis'
import { getTorqueDataRobotInfoItemAPI, getTorqueDataItemsAPI } from "@/api/diagnostics/torqueDataAPI";

export default {
    components: { DatePicker, Selector, AutoSelector, PagingDataGrid, LoadingDlg, SettingInfoTable, LoadFactorByAxis},
    data() {
        return {
            ui: {
                loadFactorTitle: this.$t(`diagnostics.torquedata.loadfactorbyaxis.title`),
                searchBtnIcon: require("@/images/search_icon.png"),
                searchBtnColor: "",
                axisXOutputTitle: this.$t(`diagnostics.torquedata.axisXOutputTitle`),
                styleObject: null
            },
            datas: {
                targetBoothInfos: [],
                getSelectedTargetZoneInfos: [],
                getSelectedTargetRobotInfos: [],
                cardHeight: 500,
                chartHeight: 490,
                axisNum: 0,
                selectedWorkDatas: [],
                workInfoTableContentCount: 0,
                workInfoTableContentData: [],
                workInfoTableHeaderData: [
                    { text: this.$t(`diagnostics.torquedata.worktimetable.jobname`), value: 'job_name', sortable: false, align: 'center'},
                    { text: this.$t(`diagnostics.torquedata.worktimetable.starttime`), value: 'start_time', sortable: false, align: 'center'},
                    { text: this.$t(`diagnostics.torquedata.worktimetable.endtime`), value: 'end_time', sortable: false, align: 'center'},
                    { text: this.$t(`diagnostics.torquedata.worktimetable.worktime`), value: 'cycle_time', sortable: false, align: 'center'}
                ],
                settingInfoTableDatas: [],
                chartDatas: [],
                datasByAxis: [
                    // {id: '1', title: this.$t(`diagnostics.torquedata.loadfactorbyaxis.1axis`), active: false},
                    // {id: '2', title: this.$t(`diagnostics.torquedata.loadfactorbyaxis.2axis`), active: false},
                    // {id: '3', title: this.$t(`diagnostics.torquedata.loadfactorbyaxis.3axis`), active: false},
                    // {id: '4', title: this.$t(`diagnostics.torquedata.loadfactorbyaxis.4axis`), active: false},
                    // {id: '5', title: this.$t(`diagnostics.torquedata.loadfactorbyaxis.5axis`), active: false},
                    // {id: '6', title: this.$t(`diagnostics.torquedata.loadfactorbyaxis.6axis`), active: false},
                    // {id: '7', title: this.$t(`diagnostics.torquedata.loadfactorbyaxis.7axis`), active: false}
                ],
                searchDatas: {
                    date: '',
                    boothId: '',
                    zoneId: '',
                    robotId: ''
                },
                postDatas: {},
                chartOutputTypes: [
                    {id: "step", name: "Step Number"},
                ],
                chartOutputType: {},
                event: {
                    dialog: false
                },
                flag: {
                    axis: true,
                    autoSelector: true
                }
            }
        }
    },

    created() {
        this.datas.targetBoothInfos = this.setTargetBoothInfo();
    },

    mounted() {
        this.initializeStyle();
    },
    
    computed: {
        ...mapGetters({
            getBoothInfos: 'getRenewBoothInfos',
            getZoneInfos: 'getRenewZoneInfos',
            getRobotInfos: 'getRenewRobotInfos'
        }),

        renderAxisTitle() {
            return (title) => {
                return this.$t(title);
            }
        }
    },

    methods: {
        initializeStyle() {
            this.ui.searchBtnColor = this.$style.diagnostics.torqueDataItemSearchButtonColor;
            this.ui.styleObject = this.$style.common.titleObjectItemColor;
            document.documentElement.style.setProperty("--subTitleColor", this.$style.diagnostics.torqueDataItemSubTitleColor);
            document.documentElement.style.setProperty("--btnAxisBorderColor", this.$style.common.axisButtonItemBorderColor);
            document.documentElement.style.setProperty("--axisBtnHoverBackgroundColor", this.$style.common.axisButtonItemActiveBackgroundColor);
            document.documentElement.style.setProperty("--axisBtnHoverColor", this.$style.common.axisButtonItemActiveColor);
        },

        setLoadingDialog(flag) {
            this.datas.event.dialog = flag;
        },

        setDisableAxis(flag) {
            this.datas.flag.axis = flag;
        },

        setTargetBoothInfo() {
            return this.getBoothInfos.map(boothInfo => { return { id: boothInfo.booth_id, name: boothInfo.booth_name }});
        },

        getPrevDate(prevDate) {
            this.datas.searchDatas.date = prevDate;
            this.setDisableAxis(true);
        },

        getTargetBoothId(target) {
            this.datas.getSelectedTargetZoneInfos = [];
            this.datas.searchDatas.boothId = target.target;
            this.datas.searchDatas.zoneId = undefined;
            for(let i = 0; i < this.getZoneInfos.length; i++) {
                if(this.getZoneInfos[i].disp_booth_id == this.datas.searchDatas.boothId) {
                    this.datas.getSelectedTargetZoneInfos.push({ id: this.getZoneInfos[i].zone_id, name: this.getZoneInfos[i].zone_name });
                }
            }
            this.setDisableAxis(true);
        },

        getTargetZoneId(target) {
            this.datas.getSelectedTargetRobotInfos = [];
            this.datas.searchDatas.zoneId = target.target;
            this.datas.searchDatas.robotId = undefined;
            for(let i = 0; i < this.getRobotInfos.length; i++) {
                if(this.getRobotInfos[i].zone_id == this.datas.searchDatas.zoneId) {
                    this.datas.getSelectedTargetRobotInfos.push({id: this.getRobotInfos[i].robot_id, name: this.getRobotInfos[i].robot_name });
                }
            }
            this.setDisableAxis(true);
        },

        getTargetRobotId(target) {
            this.datas.searchDatas.robotId = target.target;
            this.setDisableAxis(true);
        },

        getChartOutputTypes(chartOutputType) {
            this.datas.chartOutputType = chartOutputType;
        },

        checkSearchDatas(searchDatas) {
            if(searchDatas.date != undefined && searchDatas.boothId != undefined && searchDatas.zoneId != undefined && searchDatas.robotId != undefined) {
                return true;
            }
            else {
                return false;
            } 

        },

        checkTargetDatas(postDatas) {
            let targetDatas = {};
            targetDatas['date'] = postDatas.date;
            targetDatas['robotId'] = postDatas.robotId;
            return targetDatas;
        },

        async searchBtnClicked() {
            Object.assign(this.datas.postDatas, this.datas.searchDatas);
            if(this.checkSearchDatas(this.datas.postDatas)) {
                this.setLoadingDialog(true);
                this.datas.datasByAxis = await this.getTorqueDataRobotAxis(this.datas.postDatas.robotId)
                this.datas.settingInfoTableDatas = await this.getTorqueDataRobotInfoItem(this.datas.postDatas);
                this.datas.workInfoTableContentData = await this.getTorqueDataItems(this.datas.postDatas);
                this.datas.workInfoTableContentCount = this.datas.workInfoTableContentData.length;
                this.datas.selectedWorkDatas = [];
                this.datas.chartDatas = [];
                this.setDisableAxis(false);
            }
            else {
                this.datas.datasByAxis = [];
                this.datas.selectedWorkDatas = []
                this.datas.workInfoTableContentData = []
                this.datas.settingInfoTableDatas = []
                this.datas.chartDatas =  []
                this.defaultAxisBtn();
                this.$popmsg(this.$t(`diagnostics.torquedata.popMsg.checkSearchData`));
            }
            
        },

        async getTorqueDataRobotAxis(robotId) {
            const robotInfoArr = this.getRobotInfos.filter(robotInfo => robotInfo.robot_id === robotId);
            const { robot_axis } = robotInfoArr.length > 0 ? robotInfoArr[0] : null;
            let axisItems = [];
            for( let i = 0; i < robot_axis; ++i) {
                axisItems.push({ id: i+1, title: `diagnostics.torquedata.loadfactorbyaxis.${i+1}axis`, active: false })
            }
            return axisItems;
        },

        async getTorqueDataRobotInfoItem(params) {
            try {
                const torqueDataRobotInfoItem = await getTorqueDataRobotInfoItemAPI(params);
                return torqueDataRobotInfoItem.data ? torqueDataRobotInfoItem.data : [];
            } catch(error) {
                console.log(error);
                return [];
            }
        },

        async getTorqueDataItems(params) {
            try {
                const torqueDataItems = await getTorqueDataItemsAPI(params);
                this.setLoadingDialog(false);
                return torqueDataItems.data ? torqueDataItems.data: [];
            } catch(error) {
                console.log(error);
                return [];
            }
        },

        async getAlarmStatisticsResultItems(api) {
            try {
                const alarmStatisticsResultItems = await api;
                return alarmStatisticsResultItems.data ? alarmStatisticsResultItems.data : [];
            } catch(error) {
                console.log(error);
                return null;
            }
        },

        getWorTimeDatas(workDatas) {
            this.datas.selectedWorkDatas = workDatas;
            this.getChartDatas(workDatas, 1);
            this.axisBtnHighLight(1);
        },

        convertToChartItems(torqueItems, stepNoItems) {
            const chartItems = stepNoItems.length > 0 ? stepNoItems.map((stepNoItem, index) => {
                return { step_no: stepNoItem, torque: torqueItems[index] }
            }) : [];
            return chartItems ? chartItems : [];
        },
        getChartDatas(workDatas, axisNum) {
            this.datas.chartDatas = this.convertToChartItems(workDatas.torque[axisNum-1] ? workDatas.torque[axisNum-1] : [], workDatas.step_no[axisNum-1] ? workDatas.step_no[axisNum-1] : []);
        },

        axisBtnClicked(axisData) {
            this.axisBtnHighLight(axisData.id);
            this.getChartDatas(this.datas.selectedWorkDatas, axisData.id);
        },

        axisBtnHighLight(axisNum) {
            let index = Object.keys(this.$refs)[axisNum-1];
            this.$refs[index][0].$el.style.backgroundColor = this.$style.common.axisButtonItemActiveBackgroundColor;
            this.$refs[index][0].$el.style.color = this.$style.common.axisButtonItemActiveColor;
            this.$refs[index][0].$el.style.border = 0;
            this.datas.datasByAxis[0].active = true;

            for (let i = 0; i < Object.keys(this.$refs).length; i++) {
                if (i != (axisNum-1) && this.$refs[i+1].length > 0) {
                    this.$refs[i + 1][0].$el.style.backgroundColor =  this.$style.common.axisButtonItemBackgroundColor;
                    this.$refs[i + 1][0].$el.style.color = this.$style.common.axisButtonItemColor;
                    this.$refs[i + 1][0].$el.style.border = "";    
                }
            }
        },

        defaultAxisBtn() {
            let index = Object.keys(this.$refs);
            for(let i = 1; i < index.length; i++) {
                this.$refs[i][0].$el.style.color = "";
                this.$refs[i][0].$el.style.border = "";
                this.datas.datasByAxis[i-1].active = false;
            }
        }
    }
}
</script>

<style scoped lang="scss">
    @import './torquedata';
</style>



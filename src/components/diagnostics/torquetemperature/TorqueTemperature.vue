<template>
    <v-layout column>
        <v-layout>
            <v-flex class="pr-2" lg3>
                <date-picker v-on:getDate="getPrevDate" v-bind:setDate="data.searchDatas.prevDate"></date-picker>
            </v-flex>

            <v-flex class="pl-2 pr-2" lg3>
                <date-picker v-on:getDate="getCurrDate" v-bind:setDate="data.searchDatas.currDate"></date-picker>
            </v-flex>

            <v-flex class="pl-3 pr-3" lg2>
                <output-types v-bind:type="data.searchDatas.outputType" v-on:selectedType="getSelectedType"></output-types>
            </v-flex>
            <a><img class="pt-1 pl-2 pr-2" :src="ui.sectorIcon"/></a>
            <v-flex class="pl-2 pr-2" lg2>
                <selector
                    class="processSelector"
                    v-bind:selectorTitle="$t(String(`selector.booth`))"
                    v-bind:selectorOptions="datas.boothInfo"
                    v-on:selectedTarget="getTargetBoothId"
                ></selector>
            </v-flex>

            <v-flex class="pl-2 pr-2" lg2>
                <selector
                    class="processSelector"
                    v-bind:selectorTitle="$t(String(`selector.zone`))"
                    v-bind:selectorOptions="data.getSelectedTargetZoneInfos"
                    v-on:selectedTarget="getTargetZoneId"
                ></selector>
            </v-flex>

            <v-flex class="pl-2 pr-2" lg2>
                <selector
                    class="processSelector"
                    v-bind:selectorTitle="$t(String(`selector.robot`))"
                    v-bind:selectorOptions="data.getSelectedTargetRobotInfos"
                    v-on:selectedTarget="getTargetRobotId"
                ></selector>
            </v-flex>
            <v-btn class="ml-2 searchBtn" :color="'#237ffe'" @click="searchBtnClicked">
                <a class="pt-1"><img :src="ui.searchBtnIcon"></a>
            </v-btn>
            <loading-dlg v-bind:loadingFlag="data.loadingFlag"></loading-dlg>
        </v-layout>
        <v-layout column class="pt-5">
            <v-layout>
                <p
                    v-bind:style="this.ui.styleObject"
                    class="pl-1 pt-2">{{ui.chartTitle + " ( " + data.outputTypeName + " ) "}}
                </p>
                <v-spacer/>

                <div class="pr-2" v-for="dataByAxis in data.datasByAxis" :key="dataByAxis.id">
                    <v-btn class="axisBtn" :ref="dataByAxis.id" @click="axisBtnClicked(dataByAxis)" flat :disabled="!data.searchFlag"> {{dataByAxis.title}} </v-btn>
                </div>
                <temperature-setting-dlg
                    v-bind:flag="datas.settingDlg">
                </temperature-setting-dlg>
            </v-layout>
            <v-layout class="pt-5">
                <v-flex lg12>
                    <temperature-chart
                        v-bind:chartId="'temperatureChart'"
                        v-bind:chartHeight="ui.window.height"
                        v-bind:chartDatas="data.torqueTemperatureDatas"
                    ></temperature-chart>
                </v-flex>
            </v-layout>
        </v-layout>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'
import DatePicker from '@/commons/DatePicker'
import Selector from '@/commons/Selector'
import OutputTypes from '@/components/diagnostics/torquetemperature/torquetemperature/OutputTypes'
import TemperatureChart from '@/components/diagnostics/torquetemperature/torquetemperature/TemperatureChart'
import TempSettingDlg from '@/components/diagnostics/torquetemperature/torquetemperature/TempSettingDlg'
import LoadingDlg from '@/commons/LoadingDlg'
import TemperatureSettingDlg from '@/components/diagnostics/torquetemperature/torquetemperature/TemperatureSettingDlg'
import { getTorqueTempAPI } from "@/api/diagnostics/torquetemperatureAPI";
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
export default {
    components: {DatePicker, Selector, OutputTypes, TemperatureChart, TempSettingDlg, LoadingDlg, TemperatureSettingDlg},
    data() {
        return {
            ui: {
                window: {
                    height: 0
                },
                sectorIcon: require("@/images/selector_icon.png"),
                searchBtnIcon: require("@/images/search_icon.png"),
                styleObject: null,
                chartTitle: this.$t(`diagnostics.torqueTemperature.chartTitle`),
                settingIcon: require("@/images/setting.png"),
                settingDlgTitle: this.$t(`diagnostics.torqueTemperature.settingDlgTitle`),
                accept: this.$t(`diagnostics.torqueTemperature.accept`),
                close: this.$t(`diagnostics.torqueTemperature.close`)
            },
            data: {
                prevDate: '',
                currDate: '',
                weeks: '',
                outputType: '',
                outputTypeName: this.$t(`diagnostics.torqueTemperature.outputTypeName`),
                targetBoothId: '',
                targetZoneId: '',
                targetRobotId: '',
                settingValue: null,
                axisNum: 0,
                searchFlag: false,
                settingValueDlgFlag: false,
                loadingFlag: false,
                searchDatas: {
                    prevDate: '',
                    currDate: '',
                    weeks: '',
                    boothId: '',
                    zoneId: '',
                    robotId: '',
                    outputType: '',
                },
                postDatas: {},
                getSelectedTargetZoneInfos: [],
                getSelectedTargetRobotInfos: [],
                datasByAxis: [],
                torqueTemperatureDatas: []
            },
            datas: {
                settingDlg: false,
                boothInfo: [],
                zoneInfo: [],
                robotInfo: [],
            }
        }
    },
    computed: {
        ...mapGetters({
            baseUrl: 'getBaseUrl',
            getRenewBoothInfos: 'getRenewBoothInfos',
            getRenewZoneInfos: 'getRenewZoneInfos',
            getRenewRobotInfos: 'getRenewRobotInfos',
        }),
    },
    created() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    },
    mounted() {
        this.initializeStyle();
        this.getBoothInfo();
    },
    methods: {
        initializeStyle() {
            this.ui.styleObject = this.$style.common.titleObjectItemColor;
            document.documentElement.style.setProperty("--btnAxisBorderColor", this.$style.common.axisButtonItemBorderColor);
            document.documentElement.style.setProperty("--axisBtnHoverBackgroundColor", this.$style.common.axisButtonItemActiveBackgroundColor);
            document.documentElement.style.setProperty("--axisBtnHoverColor", this.$style.common.axisButtonItemActiveColor);
            document.documentElement.style.setProperty("--buttonBackgroundColor", this.$style.common.buttonItemBackgroundColor);
            document.documentElement.style.setProperty("--buttonColor", this.$style.common.buttonItemColor);
            document.documentElement.style.setProperty("--chartCardColor", this.$style.diagnostics.torqueTemperatureItemChartCardColor);
            document.documentElement.style.setProperty("--cartCardBorderColor", this.$style.diagnostics.torqueTemperatureItemCartCardBorderColor);
            document.documentElement.style.setProperty("--dialogContentBackgroundColor", this.$style.diagnostics.tempSettingDlgItemBackgroundColor);
        },
        getBoothInfo(){
            let date = new Date();
            let y = date.getFullYear();
            let m = date.getMonth();
            let d = date.getDate();
            m = m >= 0 && m <= 11 ? m+=1 : 1
            this.data.searchDatas.prevDate = `${y}-${m}-01`
            this.data.searchDatas.currDate=`${y}-${m}-${d}`
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
        handleResize() {
            this.ui.window.height = window.innerHeight / 1.5;
        },
        getPrevDate(prevDate) {
            this.data.searchDatas.prevDate = prevDate;
        },
        getCurrDate(currDate) {
            this.data.searchDatas.currDate = currDate;
        },
        getTargetBoothId(target) {
            this.data.getSelectedTargetZoneInfos = [];
            this.data.searchDatas.boothId = target.target;
            for(let i = 0; i < this.datas.zoneInfo.length; i++) {
                if(this.datas.zoneInfo[i].disp_booth_id == this.data.searchDatas.boothId) {
                    this.data.getSelectedTargetZoneInfos.push(this.datas.zoneInfo[i]);
                }
            }
        },
        getTargetZoneId(target) {
            this.data.getSelectedTargetRobotInfos = [];
            this.data.searchDatas.zoneId = target.target;
            for(let i = 0; i < this.datas.robotInfo.length; i++) {
                if(this.datas.robotInfo[i].zone_id == this.data.searchDatas.zoneId) {
                    this.data.getSelectedTargetRobotInfos.push(this.datas.robotInfo[i]);
                }
            }
        },
        getTargetRobotId(target) {
            this.data.searchDatas.robotId = target.target;
            let axisNum = null;
            this.data.datasByAxis = [];
            if(target !== ''){
                if(this.data.getSelectedTargetRobotInfos.filter(el => el.id === target.target).length > 0){
                    axisNum = this.data.getSelectedTargetRobotInfos.filter(el => el.id === target.target)[0].robot_axis
                    for(let i = 0; i < axisNum; i ++){
                        this.data.datasByAxis.push({
                            id: `${i+1}`, title: this.$t(`diagnostics.torqueTemperature.datasByAxis.${i+1}axis`)
                        })
                    }
                }

            }
        },
        getSettingValue(settingValue) {
            this.data.settingValue = Number(settingValue);
        },
        getSelectedType(outputType) {
            if(outputType != '') {
                this.data.outputTypeName = outputType.name;
                this.data.searchDatas.outputType = outputType.value
                Object.assign(this.data.postDatas, this.data.searchDatas);
                this.getTorqueTempDatas(this.data.postDatas, this.data.axisNum);
            } else {
                this.data.outputTypeName = this.$t(`diagnostics.torqueTemperature.outputTypeName`);
            }
        },
        setLoadingFlag(loadingFlag) {
            this.data.loadingFlag = loadingFlag;
        },
        searchBtnClicked() {
            this.data.searchDatas.weeks = this.calcDate(this.data.searchDatas.prevDate, this.data.searchDatas.currDate);
            this.setOutputTpyes(this.data.searchDatas.weeks);
            Object.assign(this.data.postDatas, this.data.searchDatas);
            if(this.checkPostDatas(this.data.postDatas)) {
                this.data.searchFlag = true;
                this.axisBtnClicked({id: 1});
            } else {
                this.data.searchFlag = false;
                this.data.torqueTemperatureDatas = [];
                this.data.searchDatas.outputType = '';
                this.defaultAxisBtn();
                this.$popmsg(this.$t(`diagnostics.torqueTemperature.popMsg.checkSearchData`));
            }
        },
        checkPostDatas(postDatas) {
            let checkFlag = false;
            if(
                postDatas.prevDate != undefined &&
                postDatas.currDate != undefined &&
                postDatas.boothId != undefined &&
                postDatas.zoneId != undefined &&
                postDatas.robotId != undefined
                ) {
                    checkFlag = true;
            }
            return checkFlag;
        },
        settingValueBtnClick() {
            this.setTorqueSettingValue(this.data.settingValue);
            this.data.settingValueDlgFlag = false;
        },

        closeSettingValueDlg() {
            this.data.settingValueDlgFlag = false;
        },

        calcDate(prevDate, currDate) {
            let diffWeeks;
            let tmpPrevDate = new Date(prevDate);
            let tmpCurrDate = new Date(currDate);
            let diffTime = tmpCurrDate - tmpPrevDate;
            if(diffTime < 0) {
                diffWeeks = -1;
            }
            else {
                diffWeeks = Math.ceil(diffTime / (1000*60*60*24*7));
            }
            return diffWeeks;
        },
        getTodayDate() {
            let date;
            let today = new Date();
            date = this.$moment(today).format('YYYY-MM-DD hh:mm:ss');
            return date;
        },
        setOutputTpyes(weeks) {
            if(weeks === 0) {
                this.data.searchDatas.outputType = 'hour';
            } else if(weeks > 0 && weeks <= 12) {
                this.data.searchDatas.outputType = 'day';
            } else if(weeks > 12){
                this.data.searchDatas.outputType = 'month';
            }
        },
        setTemperatureBtnClicked() {
            this.data.settingValueDlgFlag = true;
        },
        setTorqueSettingValue(settingValue) {
            let postDatas = {};
            postDatas['boothid'] = this.data.postDatas.boothId;
            postDatas['zoneid'] = this.data.postDatas.zoneId;
            postDatas['robotid'] = this.data.postDatas.robotId;
            postDatas['axis'] = this.data.axisNum;
            postDatas['updatetime'] = this.getTodayDate();
            postDatas['templimit'] = settingValue;
            this.$http.post('/diagnostics/torquetemperature/data/limit', postDatas).then((result) => {
                this.getTorqueSettingValue();
            })
        },
        getTorqueSettingValue() {
            let params = {};
            params['boothid'] = this.data.postDatas.boothId;
            params['boothid'] = this.data.postDatas.boothId;
            params['zoneid'] = this.data.postDatas.zoneId;
            params['robotid'] = this.data.postDatas.robotId;
            params['axis'] = this.data.axisNum;
            this.$http.post(`/diagnostics/torquetemperature/renew/data/temp/limit`, {
                robotid : params.robotid,
                axis: params.axis,
            })
            .then((result) => {
                this.data.settingValue = result.data !== '' ? result.data[0].temperature_max_spec : null
                this.getTorqueTempDatas(this.data.postDatas, this.data.axisNum);
            })
        },
        axisBtnClicked(axisData) {
            let index;
            if(this.data.searchFlag == true) {
                index = Object.keys(this.$refs);
                for(let i = 1; i <= index.length; i++) {
                    if(axisData.id == i) {
                        this.data.axisNum = i;
                        this.$refs[i][0].$el.style.backgroundColor = this.$style.common.axisButtonItemActiveBackgroundColor;
                        this.$refs[i][0].$el.style.color = this.$style.common.axisButtonItemActiveColor;
                        this.$refs[i][0].$el.style.border = 0;
                        this.setLoadingFlag(true);
                        this.getTorqueSettingValue();
                    } else {
                        this.$refs[i][0].$el.style.backgroundColor = this.$style.common.axisButtonItemBackgroundColor;
                        this.$refs[i][0].$el.style.color = this.$style.common.axisButtonItemColor;
                        this.$refs[i][0].$el.style.border = "";
                    }
                }
            }
        },
        checkDatas(targetDatas, axis) {
            let postDatas = {};
            postDatas['encoder'] = axis;
            postDatas['boothid'] = targetDatas.boothId;
            postDatas['zoneid'] = targetDatas.zoneId;
            postDatas['robotid'] = targetDatas.robotId;
            postDatas['prevtime'] = targetDatas.prevDate + " 00:00:00";
            postDatas['endtime'] = targetDatas.currDate + " 23:59:59";

            return postDatas;
        },
        async getTorqueTempDatas(targetDatas, axis) {
            let postDatas = {};
            postDatas = this.checkDatas(targetDatas, axis);
            const temperatureItem = await getTorqueTempAPI({
                robotId : postDatas.robotid,
                startDate : postDatas.prevtime,
                endDate : postDatas.endtime,
                axis : postDatas.encoder,
                type : targetDatas.outputType,
            })
            
            if(temperatureItem.data.length > 0){
                Object.keys(temperatureItem.data).forEach(function eachKey(key) {
                    temperatureItem.data[key].settingValue = this.data.settingValue;
                    temperatureItem.data[key].output_type = String(targetDatas.outputType).substring(0,1).toUpperCase();
                }.bind(this));
                this.data.torqueTemperatureDatas = temperatureItem.data;
            }
            else {
                this.data.torqueTemperatureDatas = [];
                this.$popmsg(this.$t(`diagnostics.torqueTemperature.popMsg.noTorqueTemperatureData`))
            }
            this.setLoadingFlag(false);
        },
        defaultAxisBtn() {
            let index = Object.keys(this.$refs);
            for(let i = 1; i <= index.length; i++) {
                this.$refs[i][0].$el.style.backgroundColor = this.$style.common.axisButtonItemBackgroundColor;
                this.$refs[i][0].$el.style.color = this.$style.common.axisButtonItemColor;
            }
        }
    }
}
</script>

<style scoped lang="scss">
    @import './torquetemperature';
</style>
<template>
    <v-layout column>
        <v-layout column>
            <v-layout>
                <v-flex class="pr-2" lg2>
                    <date-picker
                        v-on:getDate="getPrevDate"
                        v-bind:setDate="prevStartDate"
                    ></date-picker>
                </v-flex>
                <v-flex class="pr-2" lg2>
                    <date-picker
                        v-on:getDate="getCurrDate"
                        v-bind:setDate="prevEndDate"
                    ></date-picker>
                </v-flex>
                <!--renew-->
                <v-flex lg2>
                    <selector
                        class="torqueLoadFactorSelector pl-2 pr-2"
                        v-bind:selectorTitle="$t(String(`selector.booth`))"
                        v-bind:selectorOptions="datas.boothInfo"
                        v-on:selectedTarget="getTargetBoothId"
                    ></selector>
                </v-flex>
                <!--renew-->
                <v-flex lg2>
                    <selector
                        class="torqueLoadFactorSelector pl-2 pr-2"
                        v-bind:selectorTitle="$t(String(`selector.zone`))"
                        v-bind:selectorOptions="getSelectedTargetZoneInfos"
                        v-on:selectedTarget="getTargetZoneId"
                    ></selector>
                </v-flex>

                <v-flex lg2>
                    <selector
                        class="torqueLoadFactorSelector pl-2 pr-2"
                        v-bind:selectorTitle="$t(String(`selector.robot`))"
                        v-bind:selectorOptions="getSelectedTargetRobotInfos"
                        v-on:selectedTarget="getTargetRobotId"
                    ></selector>
                </v-flex>
                <v-flex lg2>
                    <selector
                        class="torqueLoadFactorSelector pl-2 pr-2"
                        v-bind:selectorTitle="ui.selectJobFile"
                        v-bind:selectorOptions="getSelectedTargetJobInfos"
                        v-bind:selectorTRATarget="datas.predict.job"
                        v-on:selectedTarget="getTargetJobFile"
                        v-bind:predictInUse="getPredictUse()"
                        v-bind:getSettingJobInfo="getSettingJobInfo"
                    ></selector>
                </v-flex>

                 <v-flex lg2>
                    <selector
                        class="torqueLoadFactorSelector pl-2 pr-2"
                        v-bind:selectorTitle="ui.selectAxis"
                        v-bind:selectorOptions="datasByAxis"
                        v-bind:selectorTRATarget="datas.predict.axis"
                        v-on:selectedTarget="getTargetAxisNum"
                        v-bind:predictInUse="getPredictUse()"
                    ></selector>
                </v-flex>
                <v-spacer/>
                <v-btn class="smallBtn" color="primary" icon @click="searchBtnClicked"><v-icon>mdi-magnify</v-icon></v-btn>
                <comfirm-dlg
                    v-bind:comfirmDlgType="'jobUpdate'"
                    v-bind:comfirmDlgFlag="comfirmDlgFlag"
                    v-on:comfirmFlag="getComfirmFlag"
                    v-on:closeFlag="comfirmDlgFlag = false"
                ></comfirm-dlg>
            </v-layout>
            <v-layout class="pt-2">
                <v-flex lg12 class="pl-2">
                    <load-factor-by-axis
                        v-bind:chartId="'torqueLoadFactorChart'"
                        v-bind:chartTitle="ui.chartTitle"
                        v-bind:chartHeight="chartHeight"
                        v-bind:chartDatas="loadFactorTrendDatas"
                        v-bind:configDatas="abnormalStandardSettingTableContentDatas"
                        v-bind:mostJobName="datas.mostJobName"
                        v-bind:accumAvgText="datas.accumAvgText"
                        v-bind:dailyAvgToggle="datas.flag.dailyAvgToggle"
                        v-bind:showAlertFlag="datas.flag.showAlertToggle"
                        v-on:clickDailyAvgBtn="clickDailyAvgBtn"
                        v-on:clickAlertBtnHandler="clickAlertBtn"
                    ></load-factor-by-axis>
                </v-flex>
            </v-layout>
            <v-layout class="pt-3 pr-2">
                <v-flex lg6 class="pr-2 pl-2">
                    <work-list-table
                        v-bind:headerData="workListTableHeaderDatas"
                        v-bind:contentData="workListTableContentDatas"
                        v-bind:configDatas="abnormalStandardSettingTableContentDatas"
                    ></work-list-table>
                </v-flex>
                <v-flex lg6>
                    <abnormal-standard-setting-table
                        v-bind:headerData="abnormalStandardSettingTableHeaderDatas"
                        v-bind:contentData="abnormalStandardSettingTableContentDatas"
                        v-bind:date="prevDate"
                        v-bind:startdate="prevStartDate"
                        v-bind:enddate="prevEndDate"
                        v-on:settingAbnormalData="getSettingAbnormalData"
                        v-on:reloadPage="reloadPage"
                    ></abnormal-standard-setting-table>
                </v-flex>
            </v-layout>
        </v-layout>
        <loading-dlg
            v-bind:loadingFlag="datas.flag.loading"
        ></loading-dlg>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'
import DatePicker from '@/commons/DatePicker'
import Selector from '@/commons/Selector'
import GridTable from '@/commons/GridTable'
import AbnormalStandardSettingTable from '@/components/diagnostics/torqueloadfactor/torqueloadfactor/AbnormalStandardSettingTable'
import ViolationRecordTable from '@/components/diagnostics/torqueloadfactor/torqueloadfactor/ViolationRecordTable'
import WorkListTable from '@/components/diagnostics/torqueloadfactor/torqueloadfactor/WorkListTable'
import LoadFactorByAxis from '@/components/diagnostics/torqueloadfactor/torqueloadfactor/LoadFactorByAxis'
import ComfirmDlg from '@/commons/ComfirmDlg'
import LoadingDlg from '@/commons/LoadingDlg'
import TorqueLoadFactorDatePicker from './TorqueLoadFactorDatePicker.vue'
import { getDailyAccumAvgAPI, getRobotJobItemsAPI  } from '@/api/diagnostics/torqueLoadFactorAPI'
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
    components: {DatePicker, Selector, GridTable, AbnormalStandardSettingTable, ViolationRecordTable, WorkListTable, LoadFactorByAxis, ComfirmDlg, LoadingDlg,
    TorqueLoadFactorDatePicker},
    data() {
        return {
            ui: {
                selectJobFile: this.$t(`diagnostics.torqueLoadFactor.selectJobFile`),
                selectAxis: this.$t(`diagnostics.torqueLoadFactor.selectAxis`),
                exception: this.$t(`diagnostics.torqueLoadFactor.exception`),
                jobUpdate: this.$t(`diagnostics.torqueLoadFactor.jobUpdate`),
                chartTitle: this.$t(`diagnostics.torqueLoadFactor.child.loadFactorByAxis.sumChartTitle`)
            },
            prevDate: '',
            prevStartDate: '',
            prevEndDate: '',
            currDate: '',
            updateBtnIcon: require("@/images/update_icon.png"),
            searchBtnIcon: require("@/images/search_icon.png"),
            interval: null,
            targetBoothId: '',
            targetZoneId: '',
            targetRobotId: '',
            targetJobFile: '',
            targetAxisNum: '',
            exceptCheckFlag: true,
            getSelectedTargetZoneInfos: [],
            getSelectedTargetRobotInfos: [],
            getSelectedTargetJobInfos: [],
            getSettingJobInfo: [],
            chartHeight: 400,
            abnormalStandardSettingTableHeaderDatas: [
                {id: 'type',    title: this.$t(`diagnostics.torqueLoadFactor.abnormalStandardSettingTableHeaderDatas.category`)},
                {id: 'value', title: this.$t(`diagnostics.torqueLoadFactor.abnormalStandardSettingTableHeaderDatas.value`)}
            ],
            abnormalStandardSettingTableRequestInfo: {},
            abnormalStandardSettingTableContentDatas: [],
            datasByAxis: [

            ],
            workListTableHeaderDatas: [
                {id: 'timestamp',   title: this.$t(`diagnostics.torqueLoadFactor.workListTableHeaderDatas.timestamp`)},
                {id: 'sum',         title: this.$t(`diagnostics.torqueLoadFactor.workListTableHeaderDatas.sum`)},
                {id: 'cycle',       title: this.$t(`diagnostics.torqueLoadFactor.workListTableHeaderDatas.cycle`)}
            ],
            workListTableContentDatas: [],
            loadFactorTrendDatas: [],
            comfirmDlgFlag: false,
            datas:{
                flag: {
                    predict: false,
                    loading: false,
                    dailyAvgToggle: false,
                    showAlertToggle: false
                },
                predict: {
                    date: null,
                    booth: null,
                    zone: null,
                    robot: null,
                    job: null,
                    axis: null,
                },
                boothInfo: [], //
                zoneInfo: [], //
                robotInfo: [], //
                mostJobName: '',
                accumAvgText: ''
            }
        }
    },

    mounted() {
        this.initalizeStyle();
        this.intData();
    },

    computed: {
        ...mapGetters({
            baseUrl: 'getBaseUrl',
            getRenewBoothInfos: 'getRenewBoothInfos',
            getRenewZoneInfos: 'getRenewZoneInfos',
            getRenewRobotInfos: 'getRenewRobotInfos',
        })
    },

    methods: {
        initalizeStyle() {
            document.documentElement.style.setProperty("--buttonBackgroundColor", this.$style.diagnostics.torqueLoadFactorItemButtonBackgroundColor);
            document.documentElement.style.setProperty("--buttonColor", this.$style.diagnostics.torqueLoadFactorItemButtonColor);
            document.documentElement.style.setProperty("--tableCardTopColor", this.$style.common.tableCardTopColor);
            document.documentElement.style.setProperty("--tableTheadBackgroundColor", this.$style.common.tableTHeadBGColor);
            document.documentElement.style.setProperty("--tableTheadBorderBottomColor", this.$style.common.tableTHeadBBColor);
            document.documentElement.style.setProperty("--tableTBodyTrOddBackgroundColor", this.$style.common.tableTBodyOddBGColor);
            document.documentElement.style.setProperty("--tableTBodyTrOddBorderBottomColor", this.$style.common.tableTBodyOddBBColor);
            document.documentElement.style.setProperty("--tableTBodyTrEvenBackgroundColor", this.$style.common.tableTBodyEvenBGColor);
            document.documentElement.style.setProperty("--tableTBodyTrEvenBorderBottomColor", this.$style.common.tableTBodyEvenBBColor);
            document.documentElement.style.setProperty("--tableTBodyTrBackgroundColor", this.$style.common.tableTBodyHoverColor);
            document.documentElement.style.setProperty("--tableTBodyPaginationItem", this.$style.common.tablePaginationColor);
            document.documentElement.style.setProperty("--tdTextColor", this.$style.common.tableItemTdTextColor);
            document.documentElement.style.setProperty("--dataTableBorderBottomColor", this.$style.common.tableTBodyBBColor);
        },
        intData(){
            let date = new Date();
            let y = date.getFullYear();
            let m = date.getMonth();
            let d = date.getDate();
            m = m >= 0 && m <= 11 ? m+=1 : 1
            this.prevStartDate = `${y}-${m}-01`
            this.prevEndDate=`${y}-${m}-${d}`
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
        setLoadingDialog(flag) {
            this.datas.flag.loading = flag;
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
        setAxis(id) {
            this.targetAxisNum = id;
        },
        getPrevDate(prevDate) {
            this.prevStartDate = prevDate;
        },
        getPrevPickerDate(item){
            this.prevStartDate = item.startDate
            this.prevEndDate = item.endDate
        },
        getCurrDate(currDate) {
            this.prevEndDate = currDate
        },
        getTargetBoothId(targetId) {
            this.getSelectedTargetZoneInfos = [];
            if(targetId !== '' && targetId !== undefined){
                this.targetBoothId = targetId.target;
                for(let i = 0; i < this.datas.zoneInfo.length; i++) {
                    if(this.datas.zoneInfo[i].disp_booth_id == this.targetBoothId) {
                        this.getSelectedTargetZoneInfos.push(this.datas.zoneInfo[i]);
                    }
                }
            }
        },
        getTargetZoneId(targetId) {
            this.getSelectedTargetRobotInfos = [];
            this.getSelectedTargetJobInfos = [];
            this.datasByAxis = [];
            this.datas.mostJobName = ''
            if(targetId !== '' && targetId !== undefined){
                this.targetZoneId = targetId.target;
                for(let i = 0; i < this.datas.robotInfo.length; i++) {
                    if(this.datas.robotInfo[i].zone_id == this.targetZoneId) {
                        this.getSelectedTargetRobotInfos.push(this.datas.robotInfo[i]);
                    }
                }
            }

        },
        getTargetRobotId(targetId) {
            this.getSelectedTargetJobInfos = [];
            this.datasByAxis = [];
            this.targetRobotId = targetId.target;
            this.datas.mostJobName = ''
            if(this.targetRobotId != undefined && this.targetRobotId !== '') {
                this.datas.flag.dailyAvgToggle = this.confirmFilterdRobot() ? 1 : 0
                this.getJobList();
            } else {
                this.getSelectedTargetJobInfos = [];
            }
        },
        async getJobList() {

            this.getSettingJobInfo = [];
            const robotJobItems = await getRobotJobItemsAPI({startDate: this.prevStartDate, endDate : this.prevEndDate, robotId : this.targetRobotId})
            this.getSelectedTargetJobInfos = robotJobItems.data.length > 0 && robotJobItems ? (robotJobItems.data.forEach(jobItem => Object.assign(jobItem , {name: `${jobItem.id}(${jobItem.count})`})), robotJobItems.data) : []
            let maxCount = -Infinity;  // 현재까지 발견된 가장 큰 count 값
            let maxCountName = "";  // 가장 큰 count 값을 가진 job_name

            if( this.getSelectedTargetJobInfos.length > 0) {
                for (let i = 0; i < this.getSelectedTargetJobInfos.length; i++) {
                    let job_list = this.getSelectedTargetJobInfos[i];
                    if (job_list.count > maxCount) {
                        maxCount = job_list.count;
                        maxCountName = job_list.id;
                    }
                }
            }
            this.datas.mostJobName = maxCountName

            await this.$http.post('/diagnostics/renew/accum/masterjob',{
                robotid : this.targetRobotId
            })
            .then((res) => {
                if(res.data !== ''){
                    this.getSettingJobInfo = res.data
                    this.getSettingJobInfo[0].job_name = this.getSelectedTargetJobInfos.filter(jobItem => jobItem.id === this.getSettingJobInfo[0].job_name)[0].name
                }else{
                    this.getSettingJobInfo = [];
                }
            })
            .catch((err) => {
                console.log(err)
                this.getSettingJobInfo = [];
            })
        },

        getTargetJobFile(targetJobFile) {
            if(targetJobFile != undefined && targetJobFile != '') {
                this.targetJobFile = targetJobFile.target;
                this.setAxisNum();
            }else{
                this.datasByAxis = []
            }
        },
        setAxisNum(){
            this.datasByAxis = [];
            let temp = {}
            if(this.targetRobotId !== undefined){
                temp = this.datas.robotInfo.filter(el => el.id === this.targetRobotId)[0]
                for(let i = 0; i < temp.robot_axis; i++){
                    this.datasByAxis.push({
                        id: i+1, name: this.$t(`diagnostics.torquedata.loadfactorbyaxis.${i+1}axis`), active: false
                    })
                }
            }
        },
        async getTargetAxisNum(targetAxisNum) {
            this.datas.accumAvgText = ''
            if(targetAxisNum !== undefined && targetAxisNum !== '') {
                this.targetAxisNum = await targetAxisNum.target;
                await this.$http.post(`/diagnostics/renew/accum/avg/robot/axis`, { // 선택한 잡 평균 data
                    startdate : this.prevStartDate,
                    enddate : this.prevEndDate,
                    robotid : this.targetRobotId,
                    axis : this.targetAxisNum,
                    jobname: this.targetJobFile
                })
                .then((res) => {
                    this.datas.accumAvgText = res.data !== '' ? res.data[0].data_avg : ''
                })
                .catch((err) => {
                    console.log(err)
                    this.datas.accumAvgText = ''
                })
            }
        },
        listBtnClicked() {
            this.dialog = true;
        },
        searchBtnClicked() {
            this.setLoadingDialog(true);
            if(this.checkDataConditions()){
                if(this.datas.flag.showAlertToggle) {
                    this.searchAlertDataClicked();
                }else {
                    if(this.datas.flag.dailyAvgToggle === 1){
                        this.getAccumDailyAvgDatas();
                        this.getDailyAvgWorkListTableDatas();
                    }else{
                        this.getLoadFactorTrendDatas();
                        this.getWorkListTableDatas();
                    }
                }
                this.getAbnormalStandardDatas();

            } else {
                window.alert(this.$t(`diagnostics.torqueLoadFactor.popMsg.checkSearchData`))
                this.setLoadingDialog(false);
                this.abnormalStandardSettingTableContentDatas = [];
                this.workListTableContentDatas = [];
                this.loadFactorTrendDatas = [];
            }
        },

        searchAlertDataClicked(){
            this.setLoadingDialog(true)
            if(this.checkDataConditions()) {
                if(this.datas.flag.dailyAvgToggle === 1){
                    this.getFilterdAccumDailyAvgDatas();
                    this.getFilteredDailyWorkListTableDatas();
                }else{
                    this.getFilteredWorkListTableDatas();
                    this.getFilteredLoadFactorTrendDatas();
                }
                this.getAbnormalStandardDatas();

            } else {
                window.alert(this.$t(`diagnostics.torqueLoadFactor.popMsg.checkSearchData`))
                this.setLoadingDialog(false);
                this.abnormalStandardSettingTableContentDatas = [];
                this.workListTableContentDatas = [];
                this.loadFactorTrendDatas = [];
            }
        },

        async getAccumDailyAvgDatas(){
            let postDatas = {};
            postDatas = this.checkTargetDatas(this.targetBoothId, this.targetZoneId, this.targetRobotId, this.targetJobFile, this.targetAxisNum);
            postDatas['startDate'] = this.prevStartDate;
            postDatas['endDate'] = this.prevEndDate;
            this.loadFactorTrendDatas = [];
            const result = await getDailyAccumAvgAPI(postDatas)
            this.loadFactorTrendDatas = result && result.data.length > 0 ? result.data : []
        },
        async getFilterdAccumDailyAvgDatas(){
            let postDatas = {};
            postDatas = this.checkTargetDatas(this.targetBoothId, this.targetZoneId, this.targetRobotId, this.targetJobFile, this.targetAxisNum);
            postDatas['startDate'] = this.prevStartDate;
            postDatas['endDate'] = this.prevEndDate;
            this.loadFactorTrendDatas = [];
            const result = await getDailyAccumAvgAPI(postDatas)
            this.loadFactorTrendDatas = result && result.data.length > 0 ? result.data : []
            if(this.abnormalStandardSettingTableContentDatas.length > 0){
                let maxSum = this.abnormalStandardSettingTableContentDatas[0].maxsum
                this.loadFactorTrendDatas = this.loadFactorTrendDatas.filter(el => el.sum >= maxSum);
            }else{
                this.loadFactorTrendDatas = [];
            }
        },
        clickDailyAvgBtn(toggle){
            this.datas.flag.dailyAvgToggle = toggle
        },
        async getAbnormalStandardDatas() {
            let postDatas = {};
            this.abnormalStandardSettingTableContentDatas = [];
            postDatas = this.checkTargetDatas(this.targetBoothId, this.targetZoneId, this.targetRobotId, this.targetJobFile, this.targetAxisNum);
            let temp = [{
                maxsum: '',
                workingtime: '',
                job_name: ''
            }]
            await this.$http.post(`/diagnostics/torqueloadfactor/renew/data/abn/list`, postDatas)  // 설정 값, 설정 잡 조회
            .then((res) => {
                if(res.data !== ''){
                    if(this.confirmFilterdRobot()){
                        if(this.datas.flag.dailyAvgToggle === 1){
                            temp[0].maxsum = Number(res.data[0].torque_accum_avg_spec)
                            temp[0].workingtime = res.data[0].cycle_time
                            temp[0].job_name = res.data[0].job_name
                        }
                        else{
                            temp = [];
                        }
                    }else{
                        if(this.datas.flag.dailyAvgToggle === 1){
                            temp = [];
                        }else{
                            temp[0].maxsum =  res.data[0].torque_accum_spec
                            temp[0].workingtime = res.data[0].cycle_time
                            temp[0].job_name = res.data[0].job_name
                        }
                    }
                    this.abnormalStandardSettingTableContentDatas = postDatas.jobname === res.data[0].job_name ? temp : []
                }else{
                    this.$popmsg(this.$t(`diagnostics.torqueLoadFactor.popMsg.abnormalRefData`));
                }
            })
        },

        confirmFilterdRobot(){
            let temp = deepClone(this.getRenewRobotInfos.filter(item => item.robot_id === this.targetRobotId))[0];
            return temp.tool_id === 2 || temp.rc_model_id === 0;
        },

        reloadPage() {
            this.setLoadingDialog(true)
            if(this.datas.flag.dailyAvgToggle === 1){
                this.getAccumDailyAvgDatas();
                this.getDailyAvgWorkListTableDatas();
            }else{
                this.getLoadFactorTrendDatas();
                this.getWorkListTableDatas();
            }
            this.getAbnormalStandardDatas();
        },
        getSettingAbnormalData(settingAbnormalData) {
            let postDatas = {};
            let configData = {};
            postDatas['factoryid'] = this.getFactoryId;
            postDatas['boothid'] = this.targetBoothId;
            postDatas['zoneid'] = this.targetZoneId;
            postDatas['robotid'] = this.targetRobotId;
            postDatas['jobname'] = this.targetJobFile;
            postDatas['axis'] = this.targetAxisNum;
            postDatas['worktime'] = settingAbnormalData.workingtime;
            postDatas['maxconfig'] = settingAbnormalData.maxsum;
            postDatas['configdata'] = JSON.stringify(configData);
            postDatas['robotaxis'] = deepClone(this.datas.robotInfo.filter(el => el.id === postDatas.robotid))[0].robot_axis
            if(this.confirmFilterdRobot() && this.datas.flag.dailyAvgToggle === 1){
                this.$http.post(`/diagnostics/torqueloadfactor/renew/data/avg/abn`, postDatas)
                .then((result) => {
                    this.reloadPage();
                })
            }
            if(!this.confirmFilterdRobot() && this.datas.flag.dailyAvgToggle === 0){
                this.$http.post(`${this.baseUrl}/diagnostics/torqueloadfactor/renew/data/abn`, postDatas)
                .then((result) => {
                    this.reloadPage();
                })
            }
        },
        deleteJobConfigInfo(){
            this.$http.post(`/diagnostics/torqueloadfactor/robotid/${this.targetRobotId}/job/${this.targetJobFile}`)  // 이상 기준 로봇별 설정값 삭제
            .then((res) => {
                this.reloadPage();
            })
        },
        async getDailyAvgWorkListTableDatas(){
            let postDatas = {};
            this.workListTableContentDatas = [];
            postDatas = this.checkTargetDatas(this.targetBoothId, this.targetZoneId, this.targetRobotId, this.targetJobFile, this.targetAxisNum);
            postDatas['startDate'] = this.prevStartDate;
            postDatas['endDate'] = this.prevEndDate;
            const result = await getDailyAccumAvgAPI(postDatas)
            if(result){
                if(result.data.length > 0){
                    this.workListTableContentDatas = result.data;
                    this.setLoadingDialog(false);
                }else{
                    this.$popmsg(this.$t(`diagnostics.torqueLoadFactor.popMsg.currentData`));
                    if(this.workListTableContentDatas.length == 0) {
                        for(let i = 0; i < 5; i++) {
                            this.workListTableContentDatas.push({timestamp: '', sum: '', cycle: ''});
                        }
                    }
                    this.setLoadingDialog(false);
                }
            }else{
                this.$log.error(error);
                this.setLoadingDialog(false);
            }
        },
        async getFilteredDailyWorkListTableDatas(){
            let postDatas = {};
            this.workListTableContentDatas = [];
            postDatas = this.checkTargetDatas(this.targetBoothId, this.targetZoneId, this.targetRobotId, this.targetJobFile, this.targetAxisNum);
            postDatas['startDate'] = this.prevStartDate;
            postDatas['endDate'] = this.prevEndDate;
            const result = await getDailyAccumAvgAPI(postDatas)
            if(result){
                if(result.data.length > 0){
                    this.workListTableContentDatas = result.data
                    if(this.abnormalStandardSettingTableContentDatas.length > 0){
                        let maxSum = this.abnormalStandardSettingTableContentDatas[0].maxsum
                        this.workListTableContentDatas = this.workListTableContentDatas.filter(el => el.sum >= maxSum);
                    }else{
                        this.workListTableContentDatas = []
                    }
                    this.setLoadingDialog(false);
                }else{
                    this.$popmsg(this.$t(`diagnostics.torqueLoadFactor.popMsg.currentData`));
                    if(this.workListTableContentDatas.length == 0) {
                        for(let i = 0; i < 5; i++) {
                            this.workListTableContentDatas.push({timestamp: '', sum: '', cycle: ''});
                        }
                    }
                    this.setLoadingDialog(false);
                }
            }else{
                this.$log.error(error);
                this.setLoadingDialog(false);
            }
        },
        getWorkListTableDatas() {
            let postDatas = {};
            this.workListTableContentDatas = [];
            postDatas = this.checkTargetDatas(this.targetBoothId, this.targetZoneId, this.targetRobotId, this.targetJobFile, this.targetAxisNum);
            postDatas['startDate'] = this.prevStartDate;
            postDatas['endDate'] = this.prevEndDate;
            this.$http.post(`/diagnostics/torqueloadfactor/renew/data`, postDatas)
            .then((result) => {
                if(result.data != '') {
                    this.workListTableContentDatas = [];
                    this.workListTableContentDatas = result.data;
                    this.setLoadingDialog(false);
                }
                else {
                    this.$popmsg(this.$t(`diagnostics.torqueLoadFactor.popMsg.currentData`));
                    if(this.workListTableContentDatas.length == 0) {
                        for(let i = 0; i < 5; i++) {
                            this.workListTableContentDatas.push({timestamp: '', acm: '', avg: '', cycle: ''});
                        }
                    }
                    this.setLoadingDialog(false);
                }
            }).catch((error) => {
                this.$log.error(error);
                this.setLoadingDialog(false);
            })

        },
        getFilteredWorkListTableDatas() {
            let postDatas = {};
            this.workListTableContentDatas = [];
            postDatas = this.checkTargetDatas(this.targetBoothId, this.targetZoneId, this.targetRobotId, this.targetJobFile, this.targetAxisNum);
            postDatas['startDate'] = this.prevStartDate;
            postDatas['endDate'] = this.prevEndDate;
            this.$http.post(`/diagnostics/torqueloadfactor/renew/data`, postDatas)
            .then((result) => {
                if(result.data != '') {
                    this.workListTableContentDatas = [];
                    let maxSum = this.abnormalStandardSettingTableContentDatas[0].maxsum
                    this.workListTableContentDatas = result.data.filter(el => el.sum >= maxSum);
                    this.setLoadingDialog(false);
                }
                else {
                    this.$popmsg(this.$t(`diagnostics.torqueLoadFactor.popMsg.currentData`));
                    if(this.workListTableContentDatas.length == 0) {
                        for(let i = 0; i < 5; i++) {
                            this.workListTableContentDatas.push({timestamp: '', acm: '', avg: '', cycle: ''});
                        }
                    }
                    this.setLoadingDialog(false);
                }
            }).catch((error) => {
                this.$log.error(error);
                this.setLoadingDialog(false);
            })
        },
        getLoadFactorTrendDatas() {
            let postDatas = {};
            postDatas = this.checkTargetDatas(this.targetBoothId, this.targetZoneId, this.targetRobotId, this.targetJobFile, this.targetAxisNum);
            postDatas['startDate'] = this.prevStartDate;
            postDatas['endDate'] = this.prevEndDate;
            this.loadFactorTrendDatas = [];
            this.$http.post(`/diagnostics/torqueloadfactor/renew/data`, postDatas)
            .then((result) => {
                if(result.data != '') {
                    this.loadFactorTrendDatas = result.data;
                    this.setLoadingDialog(false);
                }
                else {
                    this.$popmsg(this.$t(`diagnostics.torqueLoadFactor.popMsg.trendData`));
                    this.setLoadingDialog(false);
                }
            }).catch((error) => {
                this.$log.error(error);
                this.setLoadingDialog(false);
            })
        },
        getFilteredLoadFactorTrendDatas(){
            let postDatas = {};
            postDatas = this.checkTargetDatas(this.targetBoothId, this.targetZoneId, this.targetRobotId, this.targetJobFile, this.targetAxisNum);
            postDatas['startDate'] = this.prevStartDate;
            postDatas['endDate'] = this.prevEndDate;
            this.loadFactorTrendDatas = [];
            this.$http.post(`/diagnostics/torqueloadfactor/renew/data`, postDatas)
            .then((result) => {
                if(result.data != '') {
                    let maxSum = this.abnormalStandardSettingTableContentDatas[0].maxsum
                    this.loadFactorTrendDatas = result.data.filter(el => el.sum >= maxSum)
                    this.setLoadingDialog(false);
                }
                else {
                    this.$popmsg(this.$t(`diagnostics.torqueLoadFactor.popMsg.trendData`));
                    this.setLoadingDialog(false);
                }
            }).catch((error) => {
                this.$log.error(error);
                this.setLoadingDialog(false);
            })
        },

        jobUpdateBtnClicked() {
            if(this.prevDate != undefined && this.targetBoothId != undefined && this.targetZoneId != undefined && this.targetRobotId != undefined) {
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
                'boothid': this.targetBoothId,
                'zoneid': this.targetZoneId,
                'robotid': this.targetRobotId
            })
            .then((result) => {
                this.$popmsg(this.$t(`diagnostics.torqueRange.popMsg.jobUpdate`));
                this.setLoadingDialog(false);
                this.getJobList();
            })
            .catch((error) => {
                this.$log.error(error);
                this.setLoadingDialog(false);
            })
        },

        getComfirmFlag() {
            this.jobUpdate();
            this.comfirmDlgFlag = false;
        },

        dateCompare(preDate, currDate) {
            var preDate = new Date(preDate);
            var currDate = new Date(currDate);
            return preDate <= currDate;
        },

        checkTargetDatas(boothId, zoneId, robotId, jobName, axisNum) {
            let postDatas = {};
            postDatas['factoryid'] = this.getFactoryId;
            postDatas['boothid'] = boothId;
            postDatas['zoneid'] = zoneId;
            postDatas['robotid'] = robotId;
            postDatas['jobname'] = jobName;
            postDatas['axis'] = axisNum;
            return postDatas;
        },

        checkDataConditions() {
            if(this.prevStartDate && this.prevEndDate && this.targetBoothId && this.targetZoneId && this.targetRobotId && this.targetJobFile && this.targetAxisNum) {
                return true
            }else {
                return false
            }
        },

        clickAlertBtn(status) {
            this.datas.flag.showAlertToggle = !status;
        }
    }
}
</script>

<style scoped lang="scss">
    @import './torqueloadfactor';
</style>



<template>
    <div>
        <loading-dlg
            v-bind:loadingFlag="datas.loading"
        ></loading-dlg>
        <v-toolbar flat :color="ui.cardColor" >
            <v-toolbar-title>{{selectedZoneInfo[0].name}} {{ui.headerTitle.title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <div v-if="!exportFlag">
                <v-btn v-if="datas.dataFlag" @click="clickAllSetAvg" color="#26D38B"><v-icon class="mr-1" color="white">mdi-refresh </v-icon>{{ui.text.avgData}}</v-btn>
                <v-btn v-else @click="clickAllSetAvg" outline color="#26D38B"><v-icon class="mr-1" color="#26D38B">mdi-refresh</v-icon>{{ui.text.avgData}}</v-btn>
            </div>
        </v-toolbar>
        <v-layout>
           <v-flex>
                <v-data-table
                    class="report_table"
                    :style="ui.tableDataStyle"
                    ref="datatable"
                    hide-actions :headers="ui.header"
                    :items="datas.robotData"
                    :expand="expand"
                    item-key="robot_name"
                >
                    <template v-slot:headers="props">
                        <tr>
                            <th :style="ui.tableHeaderStyle" v-for="header in props.headers" :key="header.text">
                                <div v-if="header.text !== 'icon'">{{ header.text }}</div>
                                <div v-else>
                                    <v-btn icon @click="clickExpandAll(expand)">
                                        <v-icon v-if="expand">mdi-menu-up-outline</v-icon>
                                        <v-icon v-else>mdi-menu-down-outline</v-icon>
                                    </v-btn>
                                </div>
                            </th>
                        </tr>
                    </template>
                    <template v-slot:items="props">
                        <tr>
                            <td class="arrowBtn">
                                <v-layout>
                                    <v-flex>
                                        <v-btn  @click="clickExpandRow(props)" icon>
                                            <v-icon v-if="props.expanded">mdi-menu-up-outline</v-icon>
                                            <v-icon v-else>mdi-menu-down-outline</v-icon>
                                        </v-btn>
                                    </v-flex>
                                 </v-layout>
                            </td>
                             <td class="robotname text-xs-center">{{props.item.robot_name}}</td>
                             <td class="text-xs-center" v-for="(item, index) in props.item.current_data.axis_level" :key="index">
                                <hardware-btn-status
                                    v-bind:dataType="'level'"
                                    v-bind:axisLevel="item"
                                    v-bind:size="35"
                                    v-bind:prevReport="prevReport"
                                    v-bind:compareFlag="compareLevel(item)"
                                />
                             </td>
                             <td class="text-xs-center" v-for="(item, fan_index) in props.item.current_data.coolingfan" :key="`o-${fan_index}`" >
                                <hardware-btn-status
                                    v-bind:dataType="'data'"
                                    v-bind:axisLevel="item"
                                    v-bind:axisData="item.data"
                                    v-bind:btnStyle="'height: 35px; width: 35px; pointer-events: none;'"
                                    v-bind:size="35"
                                />
                             </td>
                             <td class="text-xs-center">
                                <hardware-btn-status
                                    v-bind:dataType="'data'"
                                    v-bind:axisLevel="props.item.current_data.capacitor"
                                    v-bind:axisData="props.item.current_data.capacitor.data"
                                    v-bind:btnStyle="'height: 35px; width: 35px; pointer-events: none;'"
                                    v-bind:size="35"
                                />
                            </td>
                        </tr>
                    </template>
                    <template v-slot:expand="props" v-if="!exportFlag">
                        <v-card color="#222A3E">
                            <v-layout>
                                <v-card-title>{{props.item.robot_name}} {{ui.headerTitle.hardware}}</v-card-title>
                                <v-spacer></v-spacer>
                                <v-btn v-if="props.item.toggle" @click="getAvgData(props)" color="#26D38B"><v-icon class="mr-1" color="white">mdi-refresh </v-icon>{{ui.text.avgData}}</v-btn>
                                <v-btn v-else @click="getAvgData(props)" outline color="#26D38B"><v-icon class="mr-1" color="#26D38B">mdi-refresh</v-icon>{{ui.text.avgData}}</v-btn>
                            </v-layout>
                        <v-card-text>
                            <v-data-table
                                hide-actions :headers="ui.detail_header"
                                :items="props.item.current_data.type"
                                item-key="text"
                            >
                            <template v-slot:headers="props">
                                <tr>
                                    <th :style="ui.tableHeaderStyle" v-for="header in props.headers" :key="header.value">
                                        <div>{{ header.text }}</div>
                                    </th>
                                    </tr>
                            </template>
                            <template v-slot:items="props">
                                <tr v-if ="props.index !== 3 && props.index !== 4">
                                    <td class="text-xs-center"> {{ props.item.text }}</td>
                                    <td class="text-xs-center" v-for="(item, idx) in props.item.level" :key="idx">
                                        <v-btn class="statusBtn" v-if="!props.item.avg_toggle" flat @click="clickStatusBtn(props.item, idx, props)" :disabled="setDisabled(item)">
                                            <hardware-btn-status
                                                v-bind:dataType="'level'"
                                                v-bind:axisLevel="item"
                                                v-bind:prevReport="prevReport"
                                                v-bind:exportFlag="false"
                                                v-bind:compareFlag="compareLevel(item)"
                                            />
                                        </v-btn>
                                        <v-btn class="statusBtn" v-else flat @click="clickStatusBtn(props.item, idx, props)" :disabled="setDisabled(item)">
                                            <hardware-btn-status
                                                v-bind:dataType="'avg'"
                                                v-bind:axisLevel="item"
                                                v-bind:violatedCount="props.item.violatedCount[idx]"
                                                v-bind:previolatedCount="props.item.previolatedCount[idx]"
                                                v-bind:prevReport="prevReport"
                                            />
                                        </v-btn>
                                    </td>
                                    <td v-if="props.item.prev_masterjob !== null && props.item.prev_masterjob !== '' && props.item.masterjob !== props.item.prev_masterjob" class="text-xs-center">{{props.item.prev_masterjob}}
                                        <v-icon>mdi-arrow-right-bold-outline</v-icon>
                                        {{ props.item.masterjob}}
                                    </td>
                                    <td class="text-xs-center" v-else>{{props.item.masterjob}}</td>
                                </tr>
                                <tr v-else-if ="props.index !== 4">
                                    <td class="text-xs-center"> {{ props.item.text }}</td>
                                    <td class="text-xs-center" v-for="(item, idx) in props.item.data" :key="idx" >
                                        <hardware-btn-status
                                            v-bind:dataType="'data'"
                                            v-bind:axisLevel="props.item.level[idx]"
                                            v-bind:axisData="item"
                                            v-bind:btnStyle="'height: 30px; width: 30px; pointer-events: none;'"
                                        />
                                    </td>
                                    <td class="text-xs-center">{{ props.item.masterjob}}</td>
                                </tr>
                            </template>
                        </v-data-table>
                        </v-card-text>
                        </v-card>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
        <report-chart-dlg
            v-bind:chargDlg="datas.chartDlg"
            v-bind:chartData="datas.chartData"
            v-bind:prevChartData="datas.prevChartData"
            v-bind:chartInfo="datas.chartInfo"
            v-bind:prevReport="prevReport"
            v-bind:selectedZoneReport="selectedZoneReport"
            v-bind:exportFlag="false"
            v-on:clickCloseBtn="datas.chartDlg = false"
            v-on:clickErrorBtn="clickErrorBtn"
            v-on:clickAxis="clickAxis"
            v-on:clickAxisExportBtn="clickAxisExportBtn"
            v-bind:mainChartId="datas.mainChartId"
            v-bind:subChartId="datas.subChartId"
        />
    </div>
</template>
<script>
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
import { mapGetters } from 'vuex';
import ReportChartDlg from '@/components/report/report/ReportChartDlg.vue'
import HardwareBtnStatus from '@/components/report/report/HardwareBtnStatus.vue'
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
import LoadingDlg from '@/commons/LoadingDlg'
export default {
    props: ['selectedZoneInfo','selectedZoneReport', 'robotData','tableHeader','tableHeaderDetail','prevReport','exportFlag'],
    // selectedZoneInfo: type: Array / 선택된 존 정보
    // selectedZoneReport: type: Array / 선택된 리포트 정보
    // robotData : type: Array / 선택된 존에 로봇 data
    // tableHeader : type: Array / 선택된 존에 테이블 메인 헤더
    // tableHeaderDetail : type: Array / 선택된 존에 테이블 디테일 헤더 (expand)
    components: {
        ReportChartDlg,
        HardwareBtnStatus,
        LoadingDlg
    },
    data(){
        return{
            expand: false,
            ui: {
                tableHeaderStyle: ';',
                cardColor: '',
                header: [],
                detail_header: [],
                headerTitle: {
                    title: this.$t(`report.hardware.tableHeader.title`),
                    hardware: this.$t(`report.hardware.title.hardware`)
                },
                text: {
                    avgData: this.$t(`report.hardware.title.avgData`)
                }
            },
            datas: {
                chartDlg: false,
                chartData: [],
                prevChartData: [],
                robotData: [],
                loading : false,
                dataFlag : false,
                mainChartId: null,
                subChartId: null,
                chartInfo: {
                    robot_id: '',
                    config : null,
                    prev_config: null,
                    cycle_time_config: null,
                    prev_cycle_time_config: null,
                    masterjob: null,
                    prev_masterjob: null,
                    zone_name: '',
                    robot_name: '',
                    robot_axis: null,
                    text: '',
                    startdate: '',
                    enddate: '',
                    axis: '',
                    prev_startdate: null,
                    prev_enddate: null,
                    data_avg: '',
                    prev_data_avg: '',
                    data_percentage: null,
                    toggle : false,
                    violatedCount: '',
                    previolatedCount: '',
                    maximum: '',
                    prev_maximum: '',
                    type_value: '',
                    items : {}
                }
            }
        }
    },

    created(){

    },
    async mounted(){
        this.initializeStyle();
        await this.setRobotData();
    },
    computed:{
        ...mapGetters({
            getRenewRobotInfos: 'getRenewRobotInfos',
        })
    },
    watch: {
        tableHeader(){
            this.ui.header = this.tableHeader;
            this.ui.detail_header = this.tableHeaderDetail
        },
        robotData : {
            handler(){
                this.datas.dataFlag = false
                this.setRobotData();
            }
        }

    },
    methods: {
        setRobotData(){
            this.datas.robotData = deepClone(this.robotData)
            if(this.datas.robotData !== undefined && this.datas.robotData.length > 0) {
                this.datas.robotData.forEach(robot => {
                    if(robot.rc_model_id === 0 || robot.tool_id === 2){
                        let temp = [];
                        temp = deepClone(robot.current_data)
                        temp.type[0] = temp.type[4]
                        robot.current_data = temp
                    } //일일 적산 hidden
                    robot.current_data.type.forEach((type, index) => {
                        Object.assign(type, {rc_model_id: robot.rc_model_id, tool_id : robot.tool_id})
                        Object.assign(type, {avg_toggle : false})
                        if(index !== 3){
                            type.level.forEach(level => {
                                level.data_avg = level.data_avg
                                level.prev_data_avg = level.prev_data_avg
                                level.data_percentage = level.data_percentage
                            })
                        }
                    })
                })
            }
        },
        initializeStyle() {
            this.ui.header = this.tableHeader;
            this.ui.detail_header = this.tableHeaderDetail
            this.ui.tableHeaderStyle = this.$style.common.tableHeaderStyleColor;
            this.ui.cardColor = this.$style.common.gridTableItemCardColor;
            document.documentElement.style.setProperty("--tableCardTopColor", this.$style.common.tableCardTopColor);
            document.documentElement.style.setProperty("--tableTheadBackgroundColor", this.$style.common.tableTHeadBGColor);
            document.documentElement.style.setProperty("--tableTheadBorderBottomColor", this.$style.common.tableTHeadBBColor);
            document.documentElement.style.setProperty("--tableTBodyTrOddBackgroundColor", this.$style.common.tableTBodyOddBGColor);
            document.documentElement.style.setProperty("--tableTBodyTrOddBorderBottomColor", this.$style.common.tableTBodyOddBBColor);
            document.documentElement.style.setProperty("--tableTBodyTrEvenBackgroundColor", this.$style.common.tableTBodyEvenBGColor);
            document.documentElement.style.setProperty("--tableTBodyTrEvenBorderBottomColor", this.$style.common.tableTBodyEvenBBColor);
            document.documentElement.style.setProperty("--tableTBodyTrBackgroundColor", this.$style.common.tableTBodyHoverColor);
            document.documentElement.style.setProperty("--tableTBodyPaginationItem", this.$style.common.tablePaginationColor);
            document.documentElement.style.setProperty("--tdTextColor", this.$style.home.boothMonitoringCardItemTdColor);
            document.documentElement.style.setProperty("--dataTableBorderBottomColor", this.$style.common.gridTableItemBorderBottomColor);
            document.documentElement.style.setProperty("--gridTableCardBorderColor", this.$style.common.cardItemBorderColor);
        },
        setDisabled(item){
            if(this.prevReport.length > 0) return item.curr_level === 2 && item.prev_level === 2
            else return item.curr_level === 2
        },
        async clickAxis(value,idx, items){
            this.datas.chartInfo = {
                robot_id : '',
                config : null,
                prev_config: null,
                cycle_time_config: null,
                prev_cycle_time_config: null,
                masterjob: null,
                prev_masterjob: null,
                zone_name: '',
                robot_name: '',
                text: '',
                startdate: '',
                enddate: '',
                axis: '',
                prev_startdate: null,
                prev_enddate: null,
                data_avg: '',
                prev_data_avg: '',
                data_percentage: null,
                toggle : false,
                violatedCount: '',
                previolatedCount: '',
                maximum: '',
                prev_maximum: '',
                type_value: '',
                robot_axis: null,
                items : {}
            }
            this.datas.mainChartId = `main-chart-id-${idx}`,
            this.datas.subChartId =`sub-chart-id-${idx}`,
            this.datas.chartDlg = true;
            this.datas.chartInfo.robot_id = value.robot_id
            this.datas.chartInfo.axis = idx + 1
            this.datas.chartInfo.startdate = this.selectedZoneReport.length > 0 ? this.selectedZoneReport[0].start_date : ''
            this.datas.chartInfo.enddate = this.selectedZoneReport.length > 0 ? this.selectedZoneReport[0].end_date : ''
            this.datas.chartInfo.zone_name = this.selectedZoneInfo[0].zone_name
            this.datas.chartInfo.type_value = (items.index === 0 && (items.item.rc_model_id === 0 || items.item.tool_id === 2)) ? 4 : items.index // 일일 적산 hidden
            this.datas.chartInfo.items = items
            this.getConfig(value,idx, items);
        },
        async clickStatusBtn(value, idx, items){
            this.datas.chartData = [];
            this.datas.prevChartData = [];
            this.datas.chartInfo = {
                robot_id : '',
                config : null,
                prev_config: null,
                cycle_time_config: null,
                prev_cycle_time_config: null,
                masterjob: null,
                prev_masterjob: null,
                zone_name: '',
                robot_name: '',
                text: '',
                startdate: '',
                enddate: '',
                axis: '',
                prev_startdate: null,
                prev_enddate: null,
                data_avg: '',
                prev_data_avg: '',
                data_percentage: null,
                toggle : false,
                violatedCount: '',
                previolatedCount: '',
                maximum: '',
                prev_maximum: '',
                type_value: '',
                robot_axis: null,
                items : {}
            }
            this.datas.mainChartId = `main-chart-id-${idx}`,
            this.datas.subChartId =`sub-chart-id-${idx}`,
            this.datas.chartDlg = true;
            this.datas.chartInfo.robot_id = value.robot_id
            this.datas.chartInfo.axis = idx + 1
            this.datas.chartInfo.startdate = this.selectedZoneReport.length > 0 ? this.selectedZoneReport[0].start_date : ''
            this.datas.chartInfo.enddate = this.selectedZoneReport.length > 0 ? this.selectedZoneReport[0].end_date : ''
            this.datas.chartInfo.zone_name = this.selectedZoneInfo[0].zone_name
            this.datas.chartInfo.type_value = (items.index === 0 && (items.item.rc_model_id === 0 || items.item.tool_id === 2)) ? 4 : items.index // 일일 적산 hidden
            this.datas.chartInfo.items = items
            this.getConfig(value,idx, items);
        },
        async getConfig(value,idx, items){
            switch(items.index){
                case 0 :
                    await this.setConfig(value,idx);
                    if(value.rc_model_id === 0 || value.tool_id === 2){
                        this.datas.chartInfo.text = this.$t(`report.hardware.tableHeader.header.accumDailyAvg`)
                        await this.getDailyAccumAvgData(value,idx);
                    }
                    else{ // 적산 일일 평균 기능 잠시 hidden
                        this.datas.chartInfo.text = this.$t(`report.hardware.tableHeader.header.accum`)
                        await this.getAccumData(value,idx);
                    }
                break;
                case 1 :
                    this.datas.chartInfo.text = this.$t(`report.hardware.tableHeader.header.accumAvg`)
                    await this.setConfig(value,idx)
                    await this.getPmTorque(value,idx);
                break;
                case 2 :
                    this.datas.chartInfo.text = this.$t(`report.hardware.tableHeader.header.temperature`)
                    await this.setConfig(value,idx);
                    await this.getTemperatureData(value,idx);
                break;
            default:
            }
            this.datas.loading = false
        },
        setConfig(value,idx){
            this.datas.chartInfo.violatedCount = value.violatedCount[idx]
            this.datas.chartInfo.previolatedCount = value.previolatedCount[idx]
            this.datas.chartInfo.config = value.config !== null && value.config[idx] !== null ? Number(value.config[idx]) : 'No Data'
            this.datas.chartInfo.prev_config = value.prev_config !== null && value.prev_config[idx] !== null ? Number(value.prev_config[idx]): 'No Data'
            this.datas.chartInfo.cycle_time_config = value.cycle_time !== null ? Number(value.cycle_time) : 'null'
            this.datas.chartInfo.prev_cycle_time_config = value.prev_cycle_time !== null ? Number(value.prev_cycle_time) : 'null'
            this.datas.chartInfo.masterjob = value.masterjob != null ? value.masterjob : 'No Setting Job'
            this.datas.chartInfo.prev_masterjob = value.prev_masterjob != null ? value.prev_masterjob : 'No Setting Job'
            this.datas.chartInfo.robot_name = this.getRenewRobotInfos.filter(el => el.robot_id === value.robot_id)[0].robot_name
            this.datas.chartInfo.robot_axis = this.getRenewRobotInfos.filter(el => el.robot_id === value.robot_id)[0].robot_axis
        },
        async getDailyAccumAvgData(value, idx){
            this.datas.loading = true
            let currTemp = [];
            let prevTemp = [];
            const result = await getDailyAccumAvgAPI({
                startDate : this.datas.chartInfo.startdate,
                endDate : this.datas.chartInfo.enddate,
                robotid : value.robot_id,
                axis : idx+1,
                jobname: value.masterjob
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
                this.datas.chartData = [];
            }

            if(this.prevReport.length > 0){
                const prevResult = await getDailyAccumAvgAPI({
                    startDate : this.prevReport[0].start_date,
                    endDate : this.prevReport[0].end_date,
                    robotid : value.robot_id,
                    axis : idx+1,
                    jobname: value.prev_masterjob
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
                    this.datas.prevChartData = [];
                }
            }
            this.datas.chartData = currTemp.length > 0 ? await this.setData(currTemp, this.datas.chartInfo): [];
            this.datas.prevChartData = prevTemp.length > 0 ? (await this.setPrevData(prevTemp, this.datas.chartInfo)) : [];
            this.datas.loading = false
        },
        async getAccumData(value,idx){
            this.datas.loading = true
            let currTemp = [];
            let prevTemp = [];
            // 적산 값 조회
            const accumItem = await getAccumDataAPI({startdate : this.datas.chartInfo.startdate, enddate : this.datas.chartInfo.enddate, robotid : value.robot_id, axis : idx+1,})
            accumItem.data !== '' ? currTemp = accumItem.data.filter(accum => accum.data !== null) : this.datas.chartData = []
            if(this.prevReport.length > 0){
                // 비교 리포트 적산 값 조회
                const prev_accumItem = await getAccumDataAPI({startdate : this.prevReport[0].start_date , enddate : this.prevReport[0].end_date, robotid : value.robot_id, axis : idx+1,})
                prev_accumItem.data !== '' ? prevTemp = prev_accumItem.data.filter(prevAccum => prevAccum.data !== null) : this.datas.prevChartData = [];
            }
            this.datas.chartData = currTemp.length > 0 ? (await this.setData(currTemp, this.datas.chartInfo)) : [] ;
            this.datas.prevChartData = prevTemp.length > 0 ? (await this.setPrevData(prevTemp, this.datas.chartInfo)) : [];
            this.datas.loading = false;
        },

        async getTemperatureData(value,idx){
            this.datas.loading = true
            let currTemp = [];
            let prevTemp = [];
            const temperatureItem = await getTemperatureDataAPI({startdate : this.datas.chartInfo.startdate, enddate : this.datas.chartInfo.enddate, robotid : value.robot_id, axis : idx +1})
            temperatureItem.data !== '' ? currTemp = temperatureItem.data.filter(temp => temp.data !== null) : this.datas.chartData = [];
            if(this.prevReport.length > 0){
                // 비교 리포트 온도 값 조회
                const prev_temperatrueItem = await getTemperatureDataAPI({startdate : this.prevReport[0].start_date, enddate : this.prevReport[0].end_date, robotid : value.robot_id, axis : idx+1})
                prev_temperatrueItem.data !== '' ? prevTemp = prev_temperatrueItem.data.filter(prevTemp => prevTemp.data !== null) : this.datas.prevChartData = [];
            }
            this.datas.chartData = currTemp.length > 0 ? await this.setData(currTemp, this.datas.chartInfo): [];
            this.datas.prevChartData = prevTemp.length > 0 ? await this.setPrevData(prevTemp, this.datas.chartInfo): [];
            this.datas.loading = false;
        },

        async getPmTorque(value,idx){
            this.datas.loading = true
            let currTemp = [];
            let prevTemp = [];
            // pmtorque 조회
            const pmTorqueItem = await getPmTorqueDataAPI({startdate : this.datas.chartInfo.startdate, enddate : this.datas.chartInfo.enddate, robotid : value.robot_id, axis : idx+1})
            if(pmTorqueItem.data !== ''){
                pmTorqueItem.data.forEach(item => {
                    Object.assign(item, {data : Math.round(((item.latest-item.elapsed)*0.01) * 100) / 100})
                    Object.assign(item, {spec : 5})
                })
                currTemp = pmTorqueItem.data
            }
            else{
                this.datas.chartData = [];
            }
            if(this.prevReport.length > 0){
                const prev_pmTorqueItem = await getPmTorqueDataAPI({startdate : this.prevReport[0].start_date, enddate : this.prevReport[0].end_date, robotid : value.robot_id, axis : idx+1})
                if(prev_pmTorqueItem.data !== ''){
                    prev_pmTorqueItem.data.forEach(item => {
                        Object.assign(item, {data : Math.round(((item.latest-item.elapsed)*0.01) * 100) / 100})
                        Object.assign(item, {spec : 5})
                    })
                    prevTemp = prev_pmTorqueItem.data
                }
                else{
                    this.datas.prevChartData = [];
                }
            }
            this.datas.chartData = currTemp.length > 0 ? await this.setData(currTemp, this.datas.chartInfo): [];
            this.datas.prevChartData = prevTemp.length > 0 ? await this.setPrevData(prevTemp, this.datas.chartInfo): [];
            this.datas.loading = false;
        },
        clickErrorBtn(chartInfo){
            let temp = deepClone(chartInfo)
            if(chartInfo.toggle){
                if(this.datas.chartData.length > 0){
                    let result = this.datas.chartData.filter(el => chartInfo.config <= el.data)
                    this.datas.chartData = result.length > 0 ? result : this.datas.chartData
                }
                if(this.datas.prevChartData.length > 0){
                    let result = this.datas.prevChartData.filter(el => chartInfo.prev_config <= el.data)
                    this.datas.prevChartData = result.length > 0 ? result : this.datas.prevChartData
                }
            }
            else{
                switch(chartInfo.type_value){
                    case 0:
                        this.getAccumData(temp, temp.axis-1)
                    break;
                    case 1:
                        this.getPmTorque(temp, temp.axis-1)
                    break;
                    case 2:
                        this.getTemperatureData(temp, temp.axis-1)
                    break;
                    case 4:
                        this.getDailyAccumAvgData(temp, temp.axis-1)
                    break; //일일 적산 hidden
                default:
                }
            }
        },
        clickExpandRow(props){
            props.expanded = !props.expanded
            if(this.datas.dataFlag && props.expanded){
                props.item.toggle = false
                this.getAvgData(props)
            }
        },
        async clickExpandAll(expand){
            this.expand = !expand
            let temp = [];
            temp = deepClone(this.datas.robotData)
            let tempArray = deepClone(this.datas.robotData)
            if(this.expand){
                for (let i = 0; i < this.datas.robotData.length; i += 1) {
                    const item = this.datas.robotData[i];
                    if(this.datas.dataFlag){
                        item.toggle = true
                        item.current_data.type.forEach(type => {
                            type.avg_toggle = true
                        })
                        this.datas.loading = true;
                        temp[i] = await this.setAxisAvg({item: item});
                    }
                    this.$set(this.$refs.datatable.expanded, item.robot_name, true)
                }
                this.datas.robotData = this.datas.dataFlag ? deepClone(temp) : deepClone(tempArray)
            }else{
                for (let i = 0; i < this.datas.robotData.length; i += 1) {
                    const item = this.datas.robotData[i];
                    this.$set(this.$refs.datatable.expanded, item.robot_name, false)
                }
            }

        },

        async setData(array, object){
            let maxConfig = 0;
            let temp = [];
            let tempObj = {};
            temp = deepClone(array)
            temp.forEach(el => { el.spec = Number(el.spec)})
            tempObj = deepClone(object);
            tempObj.data_avg =  await this.caculateAvg(temp)
            if(temp.length > 0 ){
                const result = temp.reduce(function(pre, curr) {
                    return (pre.data > curr.data) ? pre : curr
                })
                maxConfig = result.data
            }

            tempObj.maximum = Number(tempObj.config) < maxConfig ? maxConfig + (maxConfig * 0.15) : tempObj.config  + (tempObj.config * 0.15)
            this.datas.chartInfo = {};
            this.datas.chartInfo = tempObj
            return temp
        },

        async setPrevData(array, object){
            let maxConfig = 0;
            let temp = [];
            let tempObj = {}
            temp = deepClone(array)
            temp.forEach(el => {
                el.spec = Number(el.spec)
            })
            tempObj = deepClone(object);
            tempObj.prev_data_avg = await this.caculateAvg(temp)
            if(tempObj.data_avg !== '' && tempObj.prev_data_avg !== ''){
                tempObj.data_percentage = tempObj.prev_data_avg !== 0 && tempObj.prev_data_avg ? (((tempObj.data_avg - tempObj.prev_data_avg) / Math.abs(tempObj.prev_data_avg)) * 100).toFixed(2) : null
            }
            if(temp.length > 0 ){
                const result = temp.reduce(function(pre, curr) {
                    return (pre.data > curr.data) ? pre : curr
                })
                maxConfig = result.data
            }

            tempObj.prev_maximum = Number(tempObj.prev_config) < maxConfig ? maxConfig + (maxConfig * 0.15) : tempObj.prev_config  + (tempObj.prev_config * 0.15)
            tempObj.prev_startdate = this.prevReport[0].start_date
            tempObj.prev_enddate = this.prevReport[0].end_date
            this.datas.chartInfo = {};
            this.datas.chartInfo = tempObj
            return temp
        },

        caculateAvg(array){
            if(array.length > 0){
                 let sum = 0;
                for(let i=0; i < array.length; i ++){
                    sum += array[i].data
                }
                return (this.datas.chartInfo.type_value === 1) ? Math.round((sum/array.length) * 100) / 100 : Math.round(sum/array.length)
            }else{
                return ''
            }
        },

        async getAvgData(props){
            props.item.toggle = !props.item.toggle
            let temp = [];
            temp = deepClone(this.datas.robotData)
            if(props.item.toggle){
                props.item.current_data.type.forEach(type => {
                    type.avg_toggle = true
                })
                this.datas.loading = true;
                temp[props.index] = await this.setAxisAvg(props);
                this.datas.robotData = deepClone(temp)
            }else{
                props.item.current_data.type.forEach(type => {
                    type.avg_toggle = false
                })
                temp[props.index] = props.item
                this.datas.robotData = deepClone(temp)
            }
        },

        async clickAllSetAvg(){
            this.datas.dataFlag = !this.datas.dataFlag
            let temp = [];
            temp = deepClone(this.datas.robotData)
            let tempArray = [];
            if(this.datas.dataFlag){
                for (let i = 0; i < this.datas.robotData.length; i += 1) {
                    const item = this.datas.robotData[i];
                    item.toggle = true
                    item.current_data.type.forEach(type => {type.avg_toggle = true})
                    this.datas.loading = true;
                   temp[i] = await this.setAxisAvg({item: item});
                }
                this.datas.robotData = deepClone(temp)
            }else{
                for (let i = 0; i < this.datas.robotData.length; i += 1) {
                    const item = this.datas.robotData[i];
                    item.toggle = false
                    item.current_data.type.forEach(type => {type.avg_toggle = false})
                    this.datas.loading = true;
                    tempArray.push(item)
                }
                this.datas.robotData = deepClone(tempArray)
                this.datas.loading = false;
            }
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
                    startDate : this.selectedZoneReport[0].start_date,
                    endDate : this.selectedZoneReport[0].end_date,
                    robotId : props.item.robot_id,
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
                        startDate: this.selectedZoneReport[0].start_date,
                        endDate: this.selectedZoneReport[0].end_date,
                        robotAxis: props.item.robot_axis
                    }
                )
            } // 일일 적산 평균 hidden
            const temperatureAvg = await getTemperatureAvgAPI( // 온도 평균
                {
                    robotId : props.item.robot_id,
                    startDate: this.selectedZoneReport[0].start_date,
                    endDate: this.selectedZoneReport[0].end_date,
                    robotAxis: props.item.robot_axis
                }
            )
            const torqueAvg = await getTorqueAvgAPI(
                {
                    robotId : props.item.robot_id,
                    startDate: this.selectedZoneReport[0].start_date,
                    endDate: this.selectedZoneReport[0].end_date,
                    robotAxis: props.item.robot_axis
                }
            )
            if(this.prevReport.length > 0){
                if(props.item.rc_model_id === 0 || props.item.tool_id === 2){
                    let result = await getAccumDailyAvgAPI({
                        startDate : this.prevReport[0].start_date,
                        endDate : this.prevReport[0].end_date,
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
                            startDate: this.prevReport[0].start_date,
                            endDate: this.prevReport[0].end_date,
                            robotAxis: props.item.robot_axis
                        }
                    )
                    
                } // 일일 적산 평균 hidden
                prevTemperatureAvg = await getTemperatureAvgAPI( // 온도 평균
                    {
                        robotId : props.item.robot_id,
                        startDate: this.prevReport[0].start_date,
                        endDate: this.prevReport[0].end_date,
                        robotAxis: props.item.robot_axis
                    }
                )
                prevTorqueAvg = await getTorqueAvgAPI( // 토크 평균
                    {
                        robotId : props.item.robot_id,
                        startDate: this.prevReport[0].start_date,
                        endDate: this.prevReport[0].end_date,
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
            this.datas.loading = false
            return props.item
        },

        clickAxisExportBtn(data){
            this.$emit('clickAxisExportBtn',data)
        },

        compareLevel(levelItem){
            let compare = null
            compare = (this.prevReport.length > 0 && levelItem.curr_level === 1) || (this.prevReport.length > 0 && levelItem.prev_level === 1) ?  true : false
            if(!compare){
                compare = this.prevReport.length > 0 && levelItem.curr_level !== levelItem.prev_level ? true : false
            }
            return compare
        }
    }
}


</script>

<style lang="scss" scoped>
    @import './hardwareanalysis';
</style>
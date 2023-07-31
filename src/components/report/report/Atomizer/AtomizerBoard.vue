<template>
    <v-layout :class="['atomizer-board']">
        <div v-for="(atomizerType, atomizerItemIndex) in ui.atomizerTypeValueItems" :key="atomizerItemIndex" :class="['atomizer-board__info']" @click="clickBoard(atomizerType, atomizerItemIndex)">
            <img :class="['atomizer-board__img']" src="@/images/report/printing.png" v-if="atomizerReportItem && atomizerReportItem.print[atomizerItemIndex]"/>
            <v-layout>
                <v-flex>
                    <p>{{atomizerType.title}}</p>
                    <alarm-status
                        :atomizerAlarmStatusItem="datas.atomizerStatusItem[atomizerType.value]"
                        :atomizerAlarmStatusSubItem="datas.atomizerStatusSubItem[atomizerType.value]"

                    />
                </v-flex>
                <v-flex :class="['atomizer-board__rate']">
                    <atomizer-rate
                        v-if="datas.atomizerCountItem[atomizerItemIndex]"
                        :atomizerRateItem="datas.atomizerCountItem[atomizerItemIndex]"
                        :prevReport="prevReport"
                        :atomizerSubRateItem="datas.atomizerSubCountItem[atomizerItemIndex]"
                    />
                </v-flex>
            </v-layout>
        </div>
        <atomizer-predict-modal
            v-if="datas.isAtomizerDlgOpen"
            :is-open="datas.isAtomizerDlgOpen"
            :width="2000"
            :title="'도장기 상태 경고'"
            :chart-title="renderDatePeriod"
            :chart-prev-title="renderSubDatePeriod"
            :chart-sub-title="renderPredictBoardModalSubTitle"
            :atomizer-item="datas.atomizerStatusItem"
            :atomizer-predict-items="datas.predictAtomizerItems"
            :atomizer-predict-sub-items="datas.predictSubAtomizerItems"
            :atomizer-type-value="datas.selectedAtomizerType"
            @onChangeAtomizerType="changeAtomizerTypeHandler"
            @onCloseModal="closeAtomizerPredictModalHandler"
            :listTitleItem="datas.listTitleItem"
            :listItem="datas.listItem"
            :atomizer-type-print-status-item="datas.atomizerTypePrintStatusItem"
            @onChangeAtomizerTypePrintStatus="changeAtomizerTypePrintStatus"
        />
    </v-layout>
</template>
<script>
import { deepClone , isEmptyObj } from "@/utils/utils";
import {
    getReportAtomizerAvgDataItemsAPI,
    getPredictAtomizerChartItemsAPI
} from "@/api/report/atomizerAPI";
import AlarmStatus from "@/components/report/report/Atomizer/AlarmStatus.vue"
import AtomizerRate from "@/components/report/report/Atomizer/AtomizerRate.vue"
import AtomizerPredictModal from "@/components/diagnostics/predict/predict/AtomizerPredictModal";
export default {
    components: { AlarmStatus, AtomizerRate , AtomizerPredictModal},
    props: {
        robotItems : {
            type: Array,
        },
        reportItem: {
            type: Object,
            required: true
        },
        prevReport : {
            type: Object,
            default : {}
        },
        selectedZoneItem: {
            type: Object,
        },
        selectedBoothItem: {
            type: Object
        },
        robotItem: {
            type: Object,
            required : true
        },
        atomizerReportItem : {
            type: Object,
        }
    },
    data(){
        return {
            ui: {
                atomizerTypeValueItems: [
                    { id: 0, title: 'Turbine', value: 'turbine' },
                    { id: 1, title: 'SA_S', value: 'sa_s' },
                    { id: 2, title: 'SA_V', value: 'sa_v' },
                    { id: 3, title: 'HV', value: 'hv' }
                ],
            },
            datas: {
                atomizerStatusItem : {},
                atomizerCountItem: [],
                atomizerSubCountItem: [],
                atomizerStatusSubItem : {},
                isAtomizerDlgOpen: false,
                predictAtomizerItems: [],
                predictSubAtomizerItems: [],
                selectedAtomizerType: null,
                listTitleItem : [],
                listItem : {
                    main : {item : [], config : [], count: null},
                    sub : {item : [], config : [], count: null},
                    percent : []
                },
                atomizerTypePrintStatusItem: null, 
                atomizerReportItem: {},
            }

        }
    },
    async created() {
        this.datas.atomizerStatusItem = await this.getPredictAtomizerAlarmStatusItems(this.reportItem, 'main')
        this.datas.atomizerCountItem = await this.getReportAtomizerAlarmCountItems(this.reportItem, 'main');
        this.datas.atomizerStatusSubItem = !isEmptyObj(this.prevReport) && await this.getPredictAtomizerAlarmStatusItems(this.prevReport, 'sub')
        this.datas.atomizerSubCountItem = !isEmptyObj(this.prevReport) && await this.getReportAtomizerAlarmCountItems(this.prevReport, 'sub');
        this.datas.atomizerReportItem = this.atomizerReportItem && !isEmptyObj(this.atomizerReportItem) && deepClone(this.atomizerReportItem)
    },

    watch: {
        reportItem: {
            immediate: true,
            deep: true,
            async handler(reportItem) {
                this.datas.atomizerStatusItem = await this.getPredictAtomizerAlarmStatusItems(reportItem, 'main')
                this.datas.atomizerCountItem = await this.getReportAtomizerAlarmCountItems(reportItem, 'main');
            }
        },
        prevReport: {
            immediate: true,
            deep: true,
            async handler(prevReport){
                this.datas.atomizerStatusSubItem = !isEmptyObj(prevReport) && await this.getPredictAtomizerAlarmStatusItems(prevReport, 'sub')
                this.datas.atomizerSubCountItem = !isEmptyObj(prevReport) && await this.getReportAtomizerAlarmCountItems(prevReport, 'sub');
            }
        },
        atomizerReportItem : {
            async handler(atomizerItem) {
                this.datas.atomizerReportItem = atomizerItem && !isEmptyObj(atomizerItem) && deepClone(atomizerItem)
            }
        }
    },
    computed: {
        renderDatePeriod() {
            return this.reportItem.start_date + ' - ' + this.reportItem.end_date;
        },
        renderSubDatePeriod(){
            return !isEmptyObj(this.prevReport) ? this.prevReport.start_date + ' - ' + this.prevReport.end_date : ''
        },
        renderPredictBoardModalSubTitle() {
            return this.selectedBoothItem.booth_name + ' ' + this.selectedZoneItem.zone_name + ' ' + this.robotItem.robot_name
        },
    },

    methods: {
        async getPredictAtomizerAlarmStatusItems(reportItem, type){
            const atomizerItem = reportItem.atomizer_data && reportItem.atomizer_data.data && reportItem.atomizer_data.data.filter(atomizerItem => atomizerItem.robot_id === this.robotItem.robot_id)[0].violation_level
            const result = atomizerItem ? {
                turbine : atomizerItem[0] ,
                sa_s : atomizerItem[1],
                sa_v : atomizerItem[2],
                hv : atomizerItem[3]
            } : {}
            return result

        },

        async getReportAtomizerAlarmCountItems(reportItem, type){
            const setAtomizerCount = (configItem, countItem) => {
                let array = [];
                for(let i = 0; i < 4; i ++){
                    array[i] = {
                        config : configItem[i].filter(config => config !== 0 && config !== null) ,
                        value : countItem[i],
                        type : i
                    }
                }
                return array
            }
            const atomizerConfigItem = reportItem.atomizer_data && reportItem.atomizer_data.data && reportItem.atomizer_data.data.filter(atomizerItem => atomizerItem.robot_id === this.robotItem.robot_id)[0].config
            const atomizerCountItem = reportItem.atomizer_data && reportItem.atomizer_data.data && reportItem.atomizer_data.data.filter(atomizerItem => atomizerItem.robot_id === this.robotItem.robot_id)[0].violation_count
            const result = atomizerConfigItem && atomizerCountItem ? setAtomizerCount(atomizerConfigItem, atomizerCountItem) : [];
            return result
        },

        async clickBoard(atomizerType){
            this.datas.listItem = {main : {item : [], config : [], count: null},sub : {item : [], config : [], count: null},percent : []};
            this.datas.atomizerTypePrintStatusItem = this.atomizerReportItem.print[atomizerType.id]
            this.getAtomizerAvgData(atomizerType.value, atomizerType.id);
            this.datas.isAtomizerDlgOpen = true;
            this.datas.selectedAtomizerType = atomizerType.value;

            const atomizerPredictItems = await getPredictAtomizerChartItemsAPI({
                type: atomizerType.value,
                typeNo: atomizerType.id,
                prevDate: `${this.reportItem.start_date}`,
                currDate: `${this.reportItem.end_date}`, ...this.robotItem
            });
            this.datas.predictAtomizerItems = atomizerPredictItems.data.length > 0 ? atomizerPredictItems.data : [];

            const atomizerSubPredictItems = !isEmptyObj(this.prevReport) && await getPredictAtomizerChartItemsAPI({
                type: atomizerType.value,
                typeNo: atomizerType.id,
                prevDate: `${this.prevReport.start_date}`,
                currDate: `${this.prevReport.end_date}`, ...this.robotItem
            });
            this.datas.predictSubAtomizerItems = atomizerSubPredictItems && atomizerSubPredictItems.data.length > 0 ? atomizerSubPredictItems.data : [];
        },

        closeAtomizerPredictModalHandler() {
            this.datas.isAtomizerDlgOpen = false;
            if(JSON.stringify(this.atomizerReportItem.print) !== JSON.stringify(this.datas.atomizerReportItem.print) && window.confirm('수정하시겠습니까?')) {
                let atomizerReportItem = deepClone( this.datas.atomizerReportItem)
                atomizerReportItem.print[this.ui.atomizerTypeValueItems.filter(type => type.value === this.datas.selectedAtomizerType)[0].id] = this.datas.atomizerTypePrintStatusItem
                this.$emit('onCloseAtomizerPredictModalHandler', {
                    print : atomizerReportItem.print,
                    robot_id : this.atomizerReportItem.robot_id,
                    robot_name : this.atomizerReportItem.robot_name,
                    violation_count : this.atomizerReportItem.violation_count,
                    violation_level : this.atomizerReportItem.violation_level
                })
            }
            this.datas.atomizerReportItem = deepClone(this.atomizerReportItem)
        },

        async changeAtomizerTypeHandler(atomizerTypeItem){
            this.datas.listItem = {main : {item : [], config : [], count: null},sub : {item : [], config : [], count: null},percent : []};
            this.datas.atomizerTypePrintStatusItem = this.atomizerReportItem.print[atomizerTypeItem.typeNo]
            this.datas.selectedAtomizerType = atomizerTypeItem.type;
            const atomizerPredictItems = await getPredictAtomizerChartItemsAPI({
                type: atomizerTypeItem.type,
                typeNo: atomizerTypeItem.typeNo,
                prevDate: `${this.reportItem.start_date}`,
                currDate: `${this.reportItem.end_date}`, ...this.robotItem
            } );
            this.datas.predictAtomizerItems = atomizerPredictItems.data.length > 0 ? atomizerPredictItems.data : [];

            const atomizerSubPredictItems = !isEmptyObj(this.prevReport) && await getPredictAtomizerChartItemsAPI({
                type: atomizerTypeItem.type,
                typeNo: atomizerTypeItem.typeNo,
                prevDate: `${this.prevReport.start_date}`,
                currDate: `${this.prevReport.end_date}`, ...this.robotItem
            });
            this.datas.predictSubAtomizerItems = atomizerSubPredictItems && atomizerSubPredictItems.data.length > 0 ? atomizerSubPredictItems.data : [];
            this.getAtomizerAvgData(atomizerTypeItem.type, atomizerTypeItem.typeNo);
        },

        async getAtomizerAvgData(atomizerType, atomizerTypeNo){
            this.datas.listTitleItem = atomizerType === 'hv' ? this.datas.listTitleItem = ['리포트 이름', 'Command', 'Command 평균'] : ['리포트 이름', '오차 초과율 평균', '오차 미달율 평균']
            const atomizerAvgData = await getReportAtomizerAvgDataItemsAPI({robotId : this.robotItem.robot_id, prevDate: `${this.reportItem.start_date}`, currDate: `${this.reportItem.end_date}`, type: atomizerType })
            const atomizerSubAvgData = !isEmptyObj(this.prevReport) && await getReportAtomizerAvgDataItemsAPI({robotId : this.robotItem.robot_id, prevDate: `${this.prevReport.start_date}`, currDate: `${this.prevReport.end_date}`, type: atomizerType })
            if(atomizerType === 'hv'){
                (atomizerAvgData && atomizerAvgData.data.length) ? (atomizerAvgData.data.forEach(data => {data[0] = this.reportItem.report_name}), this.datas.listItem.main.item = atomizerAvgData.data) : this.datas.listItem.main.item = [];
                (atomizerSubAvgData && atomizerSubAvgData.data.length) ? (atomizerSubAvgData.data.forEach(prevData => {prevData[0] = this.prevReport.report_name}), this.datas.listItem.sub.item = atomizerSubAvgData.data) : this.datas.listItem.sub.item = [];
                this.datas.atomizerCountItem[atomizerTypeNo].config.forEach(configItem => { let temp = []; temp.push(configItem); this.datas.listItem.main.config.push(temp)})
                !isEmptyObj(this.prevReport) && this.datas.atomizerSubCountItem &&
                this.datas.atomizerSubCountItem[atomizerTypeNo] && this.datas.atomizerSubCountItem[atomizerTypeNo].config.forEach(subConfigItem => {
                    let temp = []; temp.push(subConfigItem); this.datas.listItem.sub.config.push(temp)
                })
                
                /** 이전 리포트와 DATA 비교 */       
                const listItem = atomizerAvgData && atomizerAvgData.data && atomizerSubAvgData && atomizerSubAvgData.data && await this.setHvListItem(atomizerAvgData.data, atomizerSubAvgData.data)
                this.datas.listItem.main.item = listItem ? listItem.main : this.datas.listItem.main.item
                this.datas.listItem.sub.item = listItem ? listItem.sub : this.datas.listItem.sub.item
            }
            else{
                atomizerAvgData && atomizerAvgData.data.length && (atomizerAvgData.data[0] = this.reportItem.report_name , this.datas.listItem.main.item = atomizerAvgData.data)
                atomizerSubAvgData && atomizerSubAvgData.data.length && (atomizerSubAvgData.data[0] = this.prevReport.report_name, this.datas.listItem.sub.item = atomizerSubAvgData.data)
                this.datas.listItem.main.config = this.datas.atomizerCountItem[atomizerTypeNo].config
                this.datas.listItem.sub.config = !isEmptyObj(this.prevReport) && this.datas.atomizerSubCountItem[atomizerTypeNo] ? this.datas.atomizerSubCountItem[atomizerTypeNo].config : []
                
            }
             
            this.datas.listItem.percent = atomizerAvgData && atomizerAvgData.data && atomizerSubAvgData && atomizerSubAvgData.data ? this.setPercentage(atomizerAvgData.data, atomizerSubAvgData.data, atomizerType) : []
            this.datas.listItem.main.count = this.datas.atomizerCountItem[atomizerTypeNo].value
            !isEmptyObj(this.prevReport) && (this.datas.listItem.sub.count = this.datas.atomizerSubCountItem[atomizerTypeNo] && this.datas.atomizerSubCountItem[atomizerTypeNo].value)
        },

        setPercentage(mainArray, subArray, type){
            let result = type !== 'hv' ? Array(3).fill(null) : []
            if(type !== 'hv'){
                for(let i = 1; i < 3; i ++){
                    result[i] = Number(((mainArray[i] - subArray[i]) / Math.abs(subArray[i]) * 100).toFixed(2))
                }
            }
            else{
                const listItem = this.setHvListItem(mainArray, subArray)
                const main = listItem.main
                const sub = listItem.sub
                for(let i = 0; i < main.length; i++){
                    let temp = Array(3).fill(null)
                    temp[2] = main[i][1] === sub[i][1] ?  Number(((main[i][2] - sub[i][2]) / Math.abs(sub[i][2]) * 100).toFixed(2)) : null
                    result.push(temp)
                }
            } 
            return result
        },

        setHvListItem(mainArray, subArray) {
            let main = deepClone(mainArray)
            let sub = deepClone(subArray)

            for(let i=0; i < mainArray.length; i++){
                let found = false;
                for(let j = 0; j < subArray.length; j++){
                    if(subArray[j][1] && ( mainArray[i][1] === subArray[j][1])){
                        found = true;
                        break;
                    }
                 }
                !found && sub.splice(i, 0, []);
             }

            for(let j = 0; j < subArray.length; j++){
                let found = false;
                for(let i=0; i< mainArray.length; i++){
                    if(mainArray[i][1] && (mainArray[i][1] === subArray[j][1])){
                        found = true;
                        break;
                    }
                }
                !found && main.splice(j, 0, []);
             }
            return {main : main, sub : sub}
            
        },

        changeAtomizerTypePrintStatus(data){
            this.datas.atomizerTypePrintStatusItem = data.status
            this.datas.atomizerReportItem.print[data.type] = data.status
        }
    }

}
</script>
<style lang="scss" scoped>
 @import './AtomizerBoard.scss'
</style>
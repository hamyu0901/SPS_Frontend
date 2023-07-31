<template>
    <v-card class="bgColor">
        <v-card-title class="titleHeader">{{ui.header}}
            <v-spacer></v-spacer>
            <v-btn icon @click="closeReportDialog"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-layout>
            <v-list two-line class="reportList ml-4">
            <template v-for="(item, index) in datas.reportItems">
                <v-divider
                    v-if="item.divider"
                    :key="index"
                    :inset="item.inset"
                ></v-divider>
                <v-list-tile
                    v-else
                    :key="index"
                    avatar
                    @click="clickListTile(item.number)"
                >
                    <v-list-tile-avatar>
                        <v-icon v-if="item.number === 1">mdi-note-plus</v-icon>
                        <v-icon v-else>mdi-file-search</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title>{{item.title}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </template>
        </v-list>
        <div class="addReportContainer ml-4" v-if="datas.selectedReportNumber === 1">
            <v-form class="addReportForm"
                ref="form"
                lazy-validation
            >
                <v-text-field
                    v-model="datas.reportName"
                    :rules="[v => !!v || 'Name is required']"
                    label="Report Name"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="currentData"
                    label="Today Date"
                    readonly
                ></v-text-field>
                <!-- <v-layout>
                    <div class="yearBox">
                        <v-combobox
                            v-model="datas.selectedYear"
                            label="Select year"
                            outlined
                            :rules="[v => !!v || 'year is required']"
                            :items="years"
                        >
                        </v-combobox>
                    </div>
                    <div class="monthBox">
                        <v-combobox
                            v-model="datas.selectedMonth"
                            @click="clickMonth"
                            label="Select Month"
                            outlined
                            :items="datas.months"
                        >
                        </v-combobox>
                    </div>
                </v-layout> -->
                <div class= "addReportButton">
                    <v-btn class="btnColor my-3 mr-2" @click="clickReportAddButton"
                    >생성
                    </v-btn>
                </div>
            </v-form>
        </div>
        <v-layout column class="reportSelectContainer ml-4" v-if="datas.selectedReportNumber === 2">
            <DxDataGrid
                class="dataGrid"
                :data-source="datas.reports"
                key-expr="reportNumber"
                :show-borders="true"
                @selection-changed="selectReport"
            >
                <DxColumn data-field="reportNumber" :width="100" caption="No"/>
                <DxColumn data-field="report_name" caption="제목"/>
                <DxColumn data-field="update_time" caption="등록일" :customize-text="customizeText"/>
                <DxSelection
                    mode="single"
                    :width="50"
                    show-check-boxes-mode="always"
                />
            </DxDataGrid>
                <div class="selectReportButton my-3 mr-2">
                    <v-btn class="deletebtnColor" @click="clickDeleteButton" >삭제</v-btn>
                    <v-btn class="btnColor" @click="clickConfirmButton">확인</v-btn>
                </div>
        </v-layout>
        <router-view></router-view>
        </v-layout>
    </v-card>
</template>
<script>
import{
    DxDataGrid,
    DxColumn,
    DxButton,
    DxSelection
} from 'devextreme-vue/data-grid';
import EventBus from "@/commons/EventBus"
import {mapGetters, mapActions} from 'vuex';
function isEmptyObj(obj)  {
  if(obj.constructor === Object
     && Object.keys(obj).length === 0)  {
    return true;
  }

  return false;
}
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
    components: {
        DxDataGrid,
        DxColumn,
        DxButton,
        DxSelection
    },
    data() {
        return {
            ui: {
                header: '리포트 조회 및 생성'
            },
            datas: {
                reportItems: [
                    { number: 1, title: '리포트 생성'},
                    { divider: true, inset: true },
                    { number: 2, title: '리포트 조회'}
                ],
                selectedReportNumber: 1,
                reports: [],
                selectedReport: {},
                reportSwitch : null,
                reportName: '',
                currentData: '',
                selectedYear: null,
                selectedMonth: null,
                months: [],
                torqueAnalysisReportDetail: []
            }
        }
    },
    created(){
        EventBus.$on('getFilteredReportDetail', this.getFilteredReportDetail)
    },
    computed: {
        ...mapGetters({
            reportDatas: 'getReportItems'
        }),
        currentData(){
            let today = new Date();
            let year = today.getFullYear(); // 년도
            let month = today.getMonth() + 1;  // 월
            let date = today.getDate();  // 날짜
            let hours = ('0' + today.getHours()).slice(-2);
            let minutes = ('0' + today.getMinutes()).slice(-2);
            let seconds = ('0' + today.getSeconds()).slice(-2);
            this.datas.currentDate = year + '-' + month + '-' + date + ' ' + hours +':' + minutes + ':' + seconds
            return year + '-' + month + '-' + date + ' ' + hours + ' : ' + minutes
        },
        years(){
            let years = [];
            years.push(Number(new Date().getFullYear()),Number(new Date().getFullYear())-1)
            return years
        },
    },
    mounted(){
    },
    methods: {
        ...mapActions({
            setReportItems: 'setReportItems'
        }),
        clickListTile(number){
            switch(number){
                case 1 :
                    this.datas.selectedReportNumber = 1
                    break;
                case 2:
                    this.datas.selectedReportNumber = 2
                    this.getReport();
                default:
            }
        },
        clickMonth(){
            this.datas.month = [];
            if(this.datas.selectedYear !== null){
                this.datas.months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
            }
            else{
                window.alert('Year is Required')
            }
        },
        clickReportAddButton(){
            if(this.datas.reportName !== ''){
                this.$http.post(`/diagnostics/report/report`,{
                    reportName : this.datas.reportName,
                    timeStamp : this.datas.currentDate,
                })
                .then((response) => {
                    this.getReport();
                });
                this.datas.selectedReportNumber = 2;
            }
            else {
                if(this.datas.reportName == ''){
                    window.alert('Name is Required')
                }
            }
        },
        async getReport(){
            await this.$http.get(`/diagnostics/report/report`)
            .then((response) => {
                this.datas.reports = deepClone(response.data)
                this.datas.reports.forEach((el,index) => {
                Object.assign(el, {reportNumber : index + 1})
                })
                this.$emit('getReport', this.datas.reports)
            });
        },
        async getReportDetail(report_id){
            this.datas.torqueAnalysisReportDetail = [];
            await this.$http.get(`diagnostics/report/report/detail/${report_id}`)
            .then((response) => {
                if(response.data !== ''){
                    response.data.forEach(el => {
                        switch(el.report_type){
                            case 0: this.datas.torqueAnalysisReportDetail.push(el)
                            break;
                        default:
                        }
                    })
                }
                else{
                    this.datas.torqueAnalysisReportDetail = [];
                }
            })
            .catch((err) => {
                console.error(err);
            })
        },
        async getFilteredReportDetail(report_id){
            this.datas.torqueAnalysisReportDetail = [];
            await this.$http.get(`diagnostics/report/report/detail/${report_id}`)
            .then((response) => {
                if(response.data !== ''){
                    response.data.forEach(el => {
                        switch(el.report_type){
                            case 0: this.datas.torqueAnalysisReportDetail.push(el)
                            break;
                        default:
                        }
                    })
                }
                else{
                    this.datas.torqueAnalysisReportDetail = [];
                }
            })
            .catch((err) => {
                console.error(err);
            })
            this.$emit('updateTorqueAnalysisReportDetail', {
                torqueAnalysisReportDetail: this.datas.torqueAnalysisReportDetail
            });
        },
        customizeText({value}){
            return value.substr(0, 10)
        },
        closeReportDialog(){
            this.$emit('closeReportDialog')
        },
        async selectReport(selectReport){
            if(selectReport.selectedRowsData.length !== 0){
                this.datas.selectedReport = {
                    report_id : selectReport.selectedRowsData[0].report_id,
                    report_name : selectReport.selectedRowsData[0].report_name,
                    update_type : selectReport.selectedRowsData[0].update_time
                }
            }
            await this.getReportDetail(this.datas.selectedReport.report_id)
            if(this.datas.torqueAnalysisReportDetail.length == 0){
                this.datas.reportSwitch = 0
            }
            else{
                this.datas.reportSwitch = 1
            }
            if(selectReport.selectedRowsData.length !== 0){
                this.setReportItems(this.datas.selectedReport);
            }
        },
        async clickConfirmButton(){
            if(isEmptyObj(this.datas.selectedReport) !== true){
                this.$emit('clickConfirmButton', {
                    selectedReport : this.datas.selectedReport,
                    reportSwitch : this.datas.reportSwitch,
                    torqueAnalysisReportDetail: this.datas.torqueAnalysisReportDetail
                })
            }
            else{
                window.alert('Select Report')
            }
        },
        async clickDeleteButton(){
            if(window.confirm("삭제하시겠습니까?")){
                if(isEmptyObj(this.datas.selectedReport) !== true){
                    await this.$http.post(`diagnostics/report/report/reportid/${this.datas.selectedReport.report_id}/delete`) // his_report 리포트 삭제
                    .then(()=> {
                        this.getReport();
                    })
                    await this.$http.get(`diagnostics/report/report/reportid/${this.datas.selectedReport.report_id}/delete/detail`) // 선택한 리포트 data_id 조회
                    .then(async (response)=> {
                        for await (let item of response.data){
                            this.$http.post(`diagnostics/report/report/dataid/${item.data_id}/delete/detail`) // 동일한 data_id를 가지고 있는 prev_data_id를 null update
                        }
                        await this.$http.post(`diagnostics/report/report/reportid/${this.datas.selectedReport.report_id}/delete/detail`)// his_report_detail 리포트 삭제
                    })
                }
                else{
                    window.alert('Select Report')
                }
            }
        }
    }
}
</script>
<style scoped>
    .reportList{
        width: 300px;
        background-color: #25273e;
    }
    .addReportContainer{
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .addReportForm{
        width: 700px;
    }
    .addReportButton{
        display: flex;
        justify-content: right;
    }
    .btnColor {
        background-color: #237ffe !important;
        font-weight: bold;
        font-size: 15px;
    }
    .deletebtnColor{
        background-color: #db4c0a !important;
        font-weight: bold;
        font-size: 15px;
    }
    .reportSelectContainer{
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .dataGrid{
        width: 700px;
    }
    .selectReportButton{
        display: flex;
        justify-content: right;
    }
    .yearBox{
        width: 300px;
        margin-right: 20px;
    }
    .monthBox{
        width: 300px;
    }
    .bgColor {
        background-color: #25273e;
    }
    .titleHeader {
        font-weight: bold;
        font-size: 22px;
        margin-left: 18px;
    }
    .v-list__tile__title {
        color: #237ffe;
        font-size: 17px;
        font-weight: bold;
    }
    .v-avatar .v-icon {
        color: #237ffe !important ;
    }
    .theme--dark.v-list :active {
        background-color: #237ffe !important;
        color: white;
    }
</style>

<template>
    <div>
        <div class="torqueReport">
            <torque-report
            />
        </div>
        <div v-if="datas.reportSwitch == 0 && datas.reports.length !== 0">
            <div class="combobox">
                <div class="yearCombobox">
                    <v-combobox
                        v-model="datas.selectedYear"
                        label="Select year"
                        outlined
                        :items="years"
                        @input="clickYear"
                    >
                    </v-combobox>
                </div>
                <div>
                    <v-combobox
                        v-model="datas.selectedMonth"
                        @click="clickMonth"
                        label="Select Month"
                        outlined
                        :items="month"
                        :disabled="!datas.isYearSelected"
                    >
                    </v-combobox>
                </div>
            </div>
        </div>
        <div>
            <torque-report-table
                v-if="datas.reports.length !== 0"
                v-bind:selectedReport="datas.selectedReport"
                v-bind:reports="datas.reports"
                v-bind:torqueAnalysisReportDetail="datas.torqueAnalysisReportDetail"
                @bindingCatch="bindingCatch"
                v-bind:bindingCatch="datas.rerender"
                v-bind:reportType="reportType"
                v-bind:reportSwitch="datas.reportSwitch"
                v-bind:selectedMonth="datas.selectedMonth"
                v-bind:selectedYear="datas.selectedYear"
            />
        </div>
        <!-- <div>
            <torque-add-report-table
                v-if="datas.selectedMonth !== null && datas.reportSwitch == 0"
                v-bind:selectedReport="datas.selectedReport"
                v-bind:reports="datas.reports"
                v-bind:selectedMonth="datas.selectedMonth"
                v-bind:selectedYear="datas.selectedYear"
                v-bind:torqueAnalysisReportDetail="datas.torqueAnalysisReportDetail"
                @bindingCatch="bindingCatch"
                v-bind:bindingCatch="datas.rerender"
                v-bind:reportType="reportType"
                v-bind:reportSwitch="datas.reportSwitch"
            />
        </div> -->
        <v-spacer></v-spacer>
    </div>
</template>

<script>

// import TorquePicker from '@/components/diagnostics/report/report/torqueAnalysis/TorquePicker'
function isEmptyObj(obj)  {
  if(obj.constructor === Object
     && Object.keys(obj).length === 0)  {
    return true;
  }

  return false;
}

import {mapGetters} from 'vuex';
import TorqueReportAddDlg from '@/components/diagnostics/report/report/torqueAnalysis/TorqueReportAddDlg'
import TorqueAddReportTable from '@/components/diagnostics/report/report/torqueAnalysis/TorqueAddReportTable'
import TorqueReport from './TorqueReport.vue';
import TorqueReportTable from './TorqueReportTable.vue';
import{
    DxDataGrid,
    DxColumn,
    DxEditing
} from 'devextreme-vue/data-grid';
export default {
  components: {
      TorqueReportAddDlg,
      TorqueAddReportTable,
      TorqueReport,
      TorqueReportTable,
            DxDataGrid,
            DxColumn,
            DxEditing,
  },
  props:['reportSwitch','selectedReport','reports','torqueAnalysisReportDetail','reportType'],
  data(){
      return{
        report: null,
          ui: {
              headerTitle : ''
          },
          datas: {
              torequeReportAddDlg: false,
              reports: [],
              selectedReport : {},
              reportSwitch: null,
              selectedYear: null,
              selectedMonth : null,
              months: [],
              torqueAnalysisReportDetail:[],
              rerender : 0,
              isYearSelected : false,
          }
      }
  },
    computed: {
        ...mapGetters({
            getReport : 'getReport'
        }),
        reportDatas(){
            return this.$store.getters['getReport'];
        },
        years(){
            let years = [];
            years.push(Number(new Date().getFullYear()),Number(new Date().getFullYear())-1)
            return years
        },
        month(){
            let month = [];
            if(this.datas.selectedYear !== null){
                month = ['01월','02월','03월','04월','05월','06월','07월','08월','09월','10월','11월','12월']
                return month
            }

        }
    },
    async created(){
        if(isEmptyObj(this.selectedReport) == true){
            await this.getReportList();
        }
    },
    mounted(){
        this.report = this.$store.getters['getReport'];
        if(isEmptyObj(this.selectedReport) == true){
            this.initializeReportData();
        }
        else{
            this.datas.reportSwitch = this.reportSwitch
            this.datas.selectedReport = this.selectedReport
            this.datas.reports = this.reports
            this.datas.torqueAnalysisReportDetail= this.torqueAnalysisReportDetail
            this.datas.torqueAnalysisReportDetail.length !== 0 ? this.datas.reportSwitch = 1 : this.datas.reportSwitch = 0
        }
        this.resetDate();
    },
    watch: {
        async selectedReport(){
            this.datas.reportSwitch = this.reportSwitch
            this.datas.selectedReport = this.selectedReport
            this.datas.reports = this.reports
            this.datas.torqueAnalysisReportDetail= this.torqueAnalysisReportDetail
            await this.resetDate();
        },
        torqueAnalysisReportDetail(){
            this.datas.torqueAnalysisReportDetail= this.torqueAnalysisReportDetail
            this.datas.torqueAnalysisReportDetail.length !== 0 ? this.datas.reportSwitch = 1 : this.datas.reportSwitch = 0
        },
    },
    methods:{
        async initializeReportData(){
            this.datas.selectedReport = this.report
            await this.getReportDetail(this.report.report_id);
            this.datas.torqueAnalysisReportDetail.length !== 0 ? this.datas.reportSwitch = 1 : this.datas.reportSwitch = 0
        },
        resetDate(){
            this.datas.selectedYear = null
            this.datas.selectedMonth = null
        },
        bindingCatch(){
            this.datas.rerender ++;
        },
        clickMonth(){
            if(this.datas.selectedYear == null){
                window.alert('Year is Required')
            }
        },
        clickYear(){
            this.datas.isYearSelected = true;
        },
        async getReportList(){
            await this.$http.get(`/diagnostics/report/report`)
            .then((response) => {
                this.datas.reports = response.data
                if(this.datas.reports !== ""){
                    this.datas.reports.forEach((el,index) => {
                        Object.assign(el, {reportNumber : index + 1})
                    })
                }
            });
            if(this.datas.reports.length == 0){
                window.alert('리포트를 생성해주세요')
            }
            else{

            }
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
                window.alert('리포트를 조회해주세요')
            })
        }
    }
}
</script>
<style lang="scss" scoped>
  @import './torqueAnalysis';
</style>
<template>
    <div id="reportMainContainer">
        <v-dialog
            v-model="datas.reportDlg"
            width="1000"
        >
            <template v-slot:activator="{ on, attrs }">
                <div>
                    <v-btn
                        v-on="on"
                        v-bind="attrs"
                        class="reportBtn"
                    >
                    <img class="mr-2" src="@/images/assignment-outline.png"/>
                     리포트 조회 / 생성</v-btn>
                </div>
            </template>
            <report-dialog
                @closeReportDialog="closeReportDialog"
                @clickConfirmButton="clickConfirmButton"
                @getReport="getReport"
                @updateTorqueAnalysisReportDetail="updateTorqueAnalysisReportDetail"
            />
        </v-dialog>
        <div id="tabMenuBox">
            <v-btn-toggle  class="btnToggle" rounded color="transparent" style="background:transparent" v-model="datas.toggle" mandatory >
                <v-btn class="btnInfo" @click="clickTorqueAnalysis" :ripple="false" color="#393b58"><v-icon class="mr-2">check</v-icon>토크 분석</v-btn>
                <v-btn class="btnInfo" @click="clickTempAnalysis" :ripple="false" color="#393b58"><v-icon class="mr-2">check</v-icon>온도 분석</v-btn>
                <v-btn class="btnInfo" @click="clickAlarmAnalysis" :ripple="false" color="#393b58"><v-icon class="mr-2">check</v-icon>알람 분석</v-btn>
            </v-btn-toggle>
        </div>
        <!-- <v-divider></v-divider> -->
        <div>
            <torque-analysis
                v-if="datas.reportType === 0"
                v-bind:reportSwitch="datas.reportSwitch"
                v-bind:selectedReport="datas.selectedReport"
                v-bind:reports="datas.reports"
                v-bind:torqueAnalysisReportDetail="datas.torqueAnalysisReportDetail"
                v-bind:reportType="datas.reportType"
            />
        </div>
        <div>
            <temp-analysis
                v-if="datas.reportType === 1"
                :reports="datas.reports"

            ></temp-analysis>
        </div>
        <div>
            <alarm-analysis
                v-if="datas.reportType === 2"
                :reports="datas.reports"
            >
            </alarm-analysis>
        </div>
        <!-- <div id="reportRouterbox"> -->
            <!-- <router-view></router-view> -->
        <!-- </div> -->
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import ReportDialog from '@/components/diagnostics/report/report/ReportDialog';
import TorqueAnalysis from '@/components/diagnostics/report/report/torqueAnalysis/TorqueAnalysis';
import TempAnalysisVue from './report/tempAnalysis/TempAnalysis.vue';
import AlarmAnalysis from '@/components/diagnostics/report/report/alarmAnalysis/AlarmAnalysis';
export default {
    components: {
        ReportDialog,
        TorqueAnalysis,
        TempAnalysis: TempAnalysisVue,
        AlarmAnalysis
    },
    data(){
        return{
            datas: {
                toggle: null,
                reportDlg: false,
                reportSwitch : null,
                selectedReport : {},
                reports: [],
                reportType: null,
                torqueAnalysisReportDetail: [],
            }
        }
    },
    computed: {
        ...mapGetters({
            reportDatas: 'getReportItems'
        })
    },
    mounted() {
        let btn = document.getElementsByClassName('btnToggle')
        if(btn[0].children[0].__vue__.isActive == true){
            this.datas.reportType = 0
        }
    },

    methods:{
        clickTorqueAnalysis(e){
            this.reportDatas.selectedReport.report_type = 0
            this.datas.reportType = 0
        },
        clickTempAnalysis(){
            this.reportDatas.selectedReport.report_type = 1
            this.datas.reportType = 1
        },
        clickAlarmAnalysis(){
            this.reportDatas.selectedReport.report_type = 2
            this.datas.reportType = 2
        },
        closeReportDialog(){
            this.datas.reportDlg = false
        },
        clickConfirmButton(item){
            this.datas.reportDlg = false
            this.datas.selectedReport = item.selectedReport
            this.datas.reportSwitch = item.reportSwitch
            this.datas.torqueAnalysisReportDetail = item.torqueAnalysisReportDetail
        },
        getReport(reports){
            this.datas.reports = reports
        },
        updateTorqueAnalysisReportDetail(item){
            this.datas.torqueAnalysisReportDetail = item.torqueAnalysisReportDetail
        }
    }
}
</script>
<style lang="scss" scoped>
  @import './report';
</style>
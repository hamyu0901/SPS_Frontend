<template>
    <v-layout row justify-center>
        <v-dialog
            v-if="chargDlg"
            v-model="chargDlg"
            persistent
            @keydown.esc="clickCloseBtn"
        >
            <report-chart
                v-bind:chartData="chartData"
                v-bind:chartInfo="chartInfo"
                v-bind:prevChartData="prevChartData"
                v-bind:prevReport="prevReport"
                v-bind:selectedZoneReport="selectedZoneReport"
                v-bind:exportFlag="exportFlag"
                v-on:clickCloseBtn="clickCloseBtn"
                v-on:clickErrorBtn="clickErrorBtn"
                v-on:clickAxis="clickAxis"
                v-on:clickAxisExportBtn="clickAxisExportBtn"
                v-bind:mainChartId="mainChartId"
                v-bind:subChartId="subChartId"
            />
            <report-chart-info-card
                v-bind:chartInfo="chartInfo"
                v-bind:chartData="chartData"
                v-bind:prevReport="prevReport"
                v-bind:prevChartData="prevChartData"
                v-bind:selectedZoneReport="selectedZoneReport"
                v-bind:item="datas.item"
                v-bind:value="datas.value"
                v-bind:prevItem="datas.prevItem"
            />
        </v-dialog>
    </v-layout>
</template>

<script>
import ReportChart from '@/components/report/report/ReportChart.vue'
import ReportChartInfoCard from '@/components/report/report/ReportChartInfoCard.vue'
  export default {
    props:['chargDlg','chartData', 'chartInfo' ,'prevChartData','prevReport','selectedZoneReport','exportFlag', 'mainChartId', 'subChartId'],
    components: {
        ReportChartInfoCard,
        ReportChart
    },
    data () {
      return {
        ui: {

        },

        datas: {
            item: [],
            value: [],
            prevItem: [],
        },
      }
    },
    created(){

    },
    mounted(){
    },
    watch:{
        chartData (){
            this.datas.item = [this.selectedZoneReport[0].report_name, this.chartInfo.masterjob, this.chartInfo.config, this.chartInfo.data_avg]
        },
        prevChartData(){
            this.datas.value = [null, null, null, this.chartInfo.data_percentage]
            this.datas.prevItem = this.prevReport.length > 0 ? [this.prevReport[0].report_name, this.chartInfo.prev_masterjob, this.chartInfo.prev_config, this.chartInfo.prev_data_avg] : []
        }
    },
    methods: {
        clickAxisExportBtn(chartInfo){
            this.$emit('clickAxisExportBtn', chartInfo)
        },
        clickCloseBtn(){
            this.$emit('clickCloseBtn')
        },
        clickErrorBtn(chartInfo){
            this.$emit('clickErrorBtn', chartInfo)
        },
        clickAxis(value, idx, items){
            this.$emit('clickAxis', value, idx, items)
        },
    }
  }
</script>
<style lang="scss" scoped>
</style>
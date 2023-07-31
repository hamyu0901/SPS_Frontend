<template>
    <div
        class="chartCard"
    >
        <v-layout v-if="!exportFlag">
            <p>{{this.chartInfo.text}} {{ui.chartTitle.analysis}}</p>
            <v-spacer></v-spacer>
            <v-btn icon @click="clickCloseBtn"><v-icon>mdi-close</v-icon></v-btn>
        </v-layout>
        <v-layout style="position: relative;" class="mb-2" v-if="!exportFlag">
            <v-btn-toggle v-model="datas.selectedAxis" class="axisBtn" mandatory>
                <v-btn v-for="(axis, index) in ui.axis" :key="index" @click="clickAxis(index)">{{axis}}</v-btn>
            </v-btn-toggle>
            <img class="printBtn" v-if="chartInfo.items.item.level[chartInfo.axis-1].print" src="@/images/report/axis_print_hover.png" @click="clickAxisPrintBtn"/>
            <img class="printBtn" v-else src="@/images/report/axis_print_normal.png" @click="clickAxisPrintBtn"/>
            <v-btn class="errorBtn" v-if="chartInfo.toggle" @click="clickErrorBtn(chartInfo.toggle)" color="error"><v-icon class="mr-1" color="white">mdi-alert-circle-outline </v-icon>{{ui.btn.confirmAlert}}</v-btn>
            <v-btn class="errorBtn" v-else @click="clickErrorBtn(chartInfo.toggle)" outline color="error"><v-icon class="mr-1" color="error">mdi-alert-circle-outline</v-icon>{{ui.btn.confirmAlert}}</v-btn>
        </v-layout>
        <v-layout class="hardwareChart">
            <v-flex class="hardwareChart_prevChart" v-if="prevReport.length > 0 && prevChartData.length > 0">
                <div v-if="prevReport.length > 0 && prevChartData.length > 0" :id="subChartId" style="height: 100%; width: 100%;" />
                <div v-if="prevReport.length > 0 && datas.prevChart == null" class="prevreportChartEmpty">{{ui.chartTitle.noData}}</div>
            </v-flex>
            <v-flex class="hardwareChart_Chart">
                <div v-if="chartData.length > 0" :id="mainChartId" style="height: 100%; width: 100%;"></div>
                <div v-if="datas.chart == null" class="reportChartEmpty">{{ui.chartTitle.noData}}</div>
            </v-flex>
        </v-layout>
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
import { isEmpty } from "lodash";
export default {
    props:['mainChartId', 'subChartId', 'chargDlg','chartData', 'chartInfo' ,'prevChartData','prevReport','selectedZoneReport','exportFlag'],
    data () {
      return {
        prevChartRender : null,
        ui: {
            printBtn: false,
            chartTitle: {
                analysis: this.$t(`report.hardware.title.analysis`),
                noData: this.$t(`report.common.window.noData`)
            },
            btn: {
                confirmAlert: this.$t(`report.hardware.btn.confirmAlert`)
            },
            axis: [],
            mainEmpty: false,
            subEmpty: false

        },
        chartOptions: {
            animationEnabled: false,
            backgroundColor: "#2D2E53",
            title:{
                text: ""
            },
            subtitles: [],
            axisY: {
                title: "",
                stripLines: [],
                labelFontColor: "white",
                maximum: ''
            },
            axisX: {
                labelFontColor: "white",
                labelFormatter: function(e){
                    let label = e.label;
                    if(label !== null){
                        return  label.slice(0,10);
                    }
                    else{
                        return label
                    }
			    }
            },
            data: []
        },
        chartPrevOptions: {
            animationEnabled: false,
            backgroundColor: "#2D2E53",
            title:{
                text: ""
            },
            subtitles: [],
            axisY: {
                title: "",
                stripLines: [],
                labelFontColor: "white",
                maximum: '',

            },
            axisX: {
                labelFontColor: "white",
                labelFormatter: function(e){
                    let label = e.label;
                    if(label !== null){
                        return  label.slice(0,10);
                    }
                    else{
                        return label
                    }
			    }
            },
            data: []
        },
        datas: {
            toggle: false,
            chart : null,
            prevChart: null,
            loading: false,
            selectedAxis: null,
            chartInfoItems: {}
        },
      }
    },
    created(){
    },
    watch: {
        chartData: {
           immediate: true,
            handler(val) {
               if( !isEmpty(val) ) {
                    this.datas.selectedAxis = this.chartInfo.axis - 1;
                    this.ui.axis = [];
                    for(let i = 0; i < this.chartInfo.robot_axis; i++){
                        this.ui.axis.push(`${i+1}${this.$t(`report.hardware.tableHeader.header.axis`)}`)
                    }
                    this.setChart();
               } else {
                    this.chartOptions.data = [];
                    this.destroyChart('main');
               }
            }
        },

        prevChartData: {
           immediate: true,
            handler(val) {
               if( !isEmpty(val) ) {
                    this.datas.selectedAxis = this.chartInfo.axis - 1;
                    this.ui.axis = [];
                    for(let i = 0; i < this.chartInfo.robot_axis; i++){
                        this.ui.axis.push(`${i+1}${this.$t(`report.hardware.tableHeader.header.axis`)}`)
                    }
                    this.setPrevChart();
               } else {
                    this.chartPrevOptions.data = [];
                    this.destroyChart('prev');
               }
            }
        },
        chartInfo: {
            immediate: true,
            handler(val) {
                this.datas.chartInfoItems = deepClone(this.chartInfo)
            }
        }

    },
    methods: {
        setChart(){
            let temp = [];
            this.chartOptions.data = [];
            this.chartOptions.title = {
                text: `${this.chartInfo.startdate}~${this.chartInfo.enddate}`,
                fontColor: "white",
                fontSize: 22,
            }
            this.chartOptions.subtitles = [{
                text : `${this.chartInfo.zone_name} ${this.chartInfo.robot_name} ${this.$t(`report.hardware.tableHeader.header.robot`)} ${this.chartInfo.axis}${this.$t(`report.hardware.tableHeader.header.axis`)}`,
                fontColor: "white",
                fontSize: 14,

            }]
            this.chartOptions.axisY.stripLines = [{value : this.chartInfo.config, thickness:2, showOnTop: true, color:"#EF4C28"}]
            this.chartOptions.axisY.maximum = this.chartInfo.maximum
            if(this.chartData.length > 0){
                this.chartData.forEach(el => {
                    if(el.data >= this.chartInfo.config){
                        temp.push({
                            label: el.date, y: el.data, markerColor: "red" , indexLabelFontColor: "red", indexLabel: `${el.data}`
                        })
                    }
                    else{
                        temp.push({
                            label: el.date, y: el.data , markerColor: "#2DB67C", indexLabelFontColor: "white"
                        })
                    }
                })
                this.chartOptions.data.push({
                    type: "line",
                    color: "#2DB67C",
                    lineColor:"#2DB67C",
                    dataPoints : temp,
                })
            }
            this.renderChart()
        },

        setPrevChart(){
            let temp = [];
            this.chartPrevOptions.data = [];
            this.chartPrevOptions.title = {
                text: `${this.chartInfo.prev_startdate}~${this.chartInfo.prev_enddate}`,
                fontColor: "white",
                fontSize: 22,
            }
            this.chartPrevOptions.subtitles = [{
                text : `${this.chartInfo.zone_name} ${this.chartInfo.robot_name} ${this.$t(`report.hardware.tableHeader.header.robot`)}  ${this.chartInfo.axis}${this.$t(`report.hardware.tableHeader.header.axis`)} `,
                fontColor: "white",
                fontSize: 14,

            }]
            this.chartPrevOptions.axisY.stripLines = [{value : this.chartInfo.prev_config, thickness:2, showOnTop: true, color:"#EF4C28"}]
            this.chartPrevOptions.axisY.maximum = this.chartInfo.prev_maximum
            if(this.prevChartData.length > 0){
                this.prevChartData.forEach(el => {
                    if(el.data >= this.chartInfo.prev_config){
                        temp.push({
                            label: el.date, y: el.data, markerColor: "red" , indexLabelFontColor: "red" , indexLabel: `${el.data}`
                        })
                    }
                    else{
                        temp.push({
                            label: el.date, y: el.data , markerColor: "#2992F3", indexLabelFontColor: "white"
                        })
                    }
                })
                this.chartPrevOptions.data.push({
                    type: "line",
                    color: "#2992F3",
                    lineColor:"#2992F3",
                    dataPoints : temp,
                })
            }
            this.renderChart()
        },

        renderChart(){
            this.$nextTick(function() {
                if(this.chartData.length > 0){
                    this.datas.chart = new CanvasJS.Chart(this.mainChartId, this.chartOptions);
                    this.datas.chart.render();
                }
                if(this.prevChartData.length > 0){
                    this.datas.prevChart = new CanvasJS.Chart(this.subChartId, this.chartPrevOptions);
                    this.datas.prevChart.render();
                }
            });
        },

        destroyChart(type) {
            this.$nextTick(() => {
                if(type === 'main' && this.datas.chart !== null){
                    this.datas.chart.destroy();
                    this.datas.chart = null;
                }
                if(type === 'prev' && this.datas.prevChart !== null){
                    this.datas.prevChart.destroy();
                    this.datas.prevChart = null;
                }
            })
        },
        clickErrorBtn(toggle){
            this.chartInfo.toggle = !toggle
            this.$emit('clickErrorBtn', this.chartInfo)
        },
        clickAxis(axis){
            let temp = deepClone(this.chartInfo)
            this.$emit('clickAxis', temp.items.item, axis, temp.items)
        },
        clickAxisPrintBtn(){
            this.chartInfo.items.item.level[this.chartInfo.axis-1].print = !this.chartInfo.items.item.level[this.chartInfo.axis-1].print

        },
        clickCloseBtn(){
            let selectedPrintAxis = [];
            let differentData = [];
            this.chartInfo.items.item.level.forEach((level, index) => {
                level.print ? selectedPrintAxis.push({data: level, axis: index}) : selectedPrintAxis
                this.chartInfo.items.item.level[index].print !== this.datas.chartInfoItems.items.item.level[index].print && differentData.push({data: level, axis: index})
            })

            if(!isEmpty(differentData)){
                this.confirmSelectedPrintAxis(selectedPrintAxis) ? this.$emit('clickAxisExportBtn', this.chartInfo) : this.chartInfo;
            }
            this.$emit('clickCloseBtn')
        },

        confirmSelectedPrintAxis(selectedPrintAxis){
            let axis = ''
            if(!isEmpty(selectedPrintAxis)){
                for(let j = 0; j < selectedPrintAxis.length; j++){
                    let tempStr = + selectedPrintAxis[j].axis+1 + "축"
                    axis += j == selectedPrintAxis.length - 1 ? tempStr : tempStr + ','
                }
                return window.confirm(`${this.chartInfo.robot_name}${this.$t(`settingDlg.datas.reportItems.robotAlarmType`)} ${axis} 출력하시겠습니까?`)
            }else{
                return window.confirm('수정하시겠습니까?')
            }
        }

    }
}
</script>
<style lang="scss" scoped>
 @import './ReportChart.scss'

</style>
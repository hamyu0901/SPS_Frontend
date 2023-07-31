<template>
    <v-card class="alarmChartCard" elevation="0" v-bind="initialize" :color="ui.cardColor">
        <v-card-title class="cardTitle" v-bind:style="ui.titleStyle">
            {{ui.alarmChartTitle}}
            <v-spacer/>
        </v-card-title>
        <div :id="chartId" class="elevation-0"></div>
    </v-card>
</template>

<script>
import MixedChart from '@/commons/chartjs/MixedChart'
export default {
    components: {
        MixedChart
        },
    props: ['chartId','alarmChartDatas'],
    data() {
        return {
            ui: {
                alarmChartTitle: "",
                cardColor: "",
                titleStyle: null,
                default: {
                    text: "",
                    height: "",
                    verticalAlign : "",
                    backgroundColor: "",
                    fontColor: "",
                    fontWeight: "",
                    fontSize: ""
                },
                toolTip: {
                    fontSize: ""
                },
                axis: {
                    tickLength: "",
                    tickThickness: "",
                    labelFontSize: "",
                    axisX: {
                        labelFontColor: "",
                        lineColor: ""
                    },
                    axisY: {
                        lineThickness: "",
                        gridDashType: "dash",
                        gridColor: "",
                        axisY1: {
                            axisYType: "",
                            type: "",
                            name: "",
                            labelFontColor: ""
                        },
                        axisY2: {
                            axisYType: "",
                            type: "",
                            name: "",
                            labelFontColor: ""
                        }
                    },
                },
                legend: {
                    horizontalAlign: "",
                    verticalAlign: "", 
                    fontSize: "",
                    fontColor: ""
                }
            },
            datas: {
                chartOptions: {},
                chart: null
            }
        }
    },

    created() {
        this.initializeUI();
    },

    mounted() {
        this.initializeStyle();
        this.initChartOptions();
    },

    updated() {
        if(this.datas.chart !== null && this.datas.chart.width < Math.round(window.innerWidth / 2)) {
            this.renderChart();
        }
    },

    destroyed() {
        this.destroyedChart();
    },

    computed: {
        initialize() {
            this.getAlarmChartDatas();
        }
    },
    
    methods: {
        initializeUI() {
            this.ui.alarmChartTitle = this.$t(`home.child.alarmChart.alarmChartTitle`);
            this.ui.titleStyle = this.$style.common.titleObjectItemColor;
            this.ui.cardColor = this.$style.common.tableCardBottomColor;

            this.ui.default.height = 255;
            this.ui.default.text = this.$t(`home.child.alarmChart.defaultTextMessage`);
            this.ui.default.verticalAlign = "center";
            this.ui.default.backgroundColor = this.$style.home.chartAlarmBackgroundColor;
            this.ui.default.fontColor = this.$style.home.chartAlarmFontColor;
            this.ui.default.fontWeight = "lighter";
            this.ui.default.fontSize = 20;

            this.ui.toolTip.fontSize = 20;

            this.ui.axis.tickLength = 15;
            this.ui.axis.tickThickness = 0;
            this.ui.axis.labelFontSize = 15;

            this.ui.axis.axisX.labelFontColor = this.$style.home.chartAlarmAxisXLabelFontColor;
            this.ui.axis.axisX.lineColor = this.$style.home.chartAlarmAxisXLineColor;
         
            this.ui.axis.axisY.lineThickness = 0;
            this.ui.axis.axisY.gridDashType = "dash";
            this.ui.axis.axisY.gridColor = this.$style.home.chartAlarmAxisYGridColor;

            this.ui.axis.axisY.axisY1.axisYType = "primary";
            this.ui.axis.axisY.axisY1.type = "column";
            this.ui.axis.axisY.axisY1.name = this.$t(`home.child.alarmChart.count`);
            this.ui.axis.axisY.axisY1.labelFontColor = this.$style.home.chartAlarmAxisY1LabelFontColor;
                   
            this.ui.axis.axisY.axisY2.axisYType = "secondary";      
            this.ui.axis.axisY.axisY2.type = "line";
            this.ui.axis.axisY.axisY2.name = this.$t(`home.child.alarmChart.deadtime`);
            this.ui.axis.axisY.axisY2.labelFontColor = this.$style.home.chartAlarmAxisY2LabelFontColor;
                  
            this.ui.legend.horizontalAlign = "center";
            this.ui.legend.verticalAlign = "top";
            this.ui.fontSize = 15;
            this.ui.fontColor = this.$style.home.chartAlarmLegendFontColor;
             
        },

        initializeStyle() {
            const chartStyle = document.querySelector("#"+this.chartId);
            chartStyle.style.height = "100%";
            chartStyle.style.width = "100%";
            document.documentElement.style.setProperty("--alarmChartCardBorderColor", this.$style.common.cardItemBorderColor);
        },

        initChartOptions() {
            this.datas.chartOptions = {
                backgroundColor: this.ui.default.backgroundColor,
                height: this.ui.default.height,
                animationEnabled: true,
                toolTip: {
                    fontSize: this.ui.toolTip.fontSize
                },
                subtitles: [],
                legend: {
                    horizontalAlign: this.ui.legend.horizontalAlign,
                    verticalAlign: this.ui.legend.verticalAlign, 
                    fontSize: this.ui.legend.fontSize,
                    fontColor: this.ui.legend.fontColor
                },
                axisX: {
                    labelFontColor: this.ui.axis.axisX.labelFontColor,
                    tickLength: this.ui.axis.tickLength,
                    tickThickness: this.ui.axis.tickThickness,
                    lineColor: this.ui.axis.axisX.lineColor,
                    labelFontSize: this.ui.axis.labelFontSize,
                    labelWrap: this.ui.axis.axisX.labelWrap,
                    labelAutoFit: this.ui.axis.axisX.labelAutoFit,      
                    interval: 1
                }
                ,
                axisY: [{
                    title: this.ui.axis.axisY.axisY1.name,
                    titleFontColor: this.ui.axis.axisY.axisY1.labelFontColor,
                    labelFontColor:  this.ui.axis.axisY.axisY1.labelFontColor,
                    tickLength: this.ui.axis.tickLength,
                    tickThickness: this.ui.axis.tickThickness,
                    lineThickness: this.ui.axis.axisY.lineThickness,
                    labelFontSize: this.ui.axis.labelFontSize,
                    gridDashType: this.ui.axis.axisY.gridDashType,
                    gridColor: this.ui.axis.axisY.gridColor
                }],
                axisY2: [{
                    title: this.ui.axis.axisY.axisY2.name,
                    titleFontColor: this.ui.axis.axisY.axisY2.labelFontColor,
                    labelFontColor: this.ui.axis.axisY.axisY2.labelFontColor,
                    tickLength: this.ui.axis.tickLength,
                    tickThickness: this.ui.axis.tickThickness,
                    lineThickness: this.ui.axis.axisY.lineThickness,
                    labelFontSize: this.ui.axis.labelFontSize,
                    gridDashType: this.ui.axis.axisY.gridDashType,
                    gridColor: this.ui.axis.axisY.gridColor
                }],
                data: []
            }
            this.renderChart();
        },

        setSubTitle() {
            if(this.datas.chartOptions.data.length === 0) {
                this.datas.chartOptions.subtitles.push({
                    text: this.ui.default.text,
                    verticalAlign : this.ui.default.verticalAlign,
                    fontColor: this.ui.default.fontColor,
                    fontWeight: this.ui.default.fontWeight,
                    fontSize: this.ui.default.fontSize
                })
            }
            else {
                this.datas.chartOptions.subtitles = [];
            }
        },

        destroyedChart() {
            this.datas.chart.destroy();
            this.datas.chart = null;
        },

        renderChart() {
            this.$nextTick(() => {
                this.setSubTitle();
                if(this.datas.chart === null) {
                    this.datas.chart = new this.$chart.Chart(this.chartId, this.datas.chartOptions);
                }
                this.datas.chart.render();
            })
        },

        getAlarmChartDatas() {
            if (this.alarmChartDatas.length != 0) {
                let labels = this.setDefaultDatas(0);
                let deadtimeDatas = this.setDefaultDatas(1);
                let countDatas = this.setDefaultDatas(1);
                
                for (let i = 0; i < this.alarmChartDatas.length; i++) {
                    for (let j = 0; j < labels.length; j++) {
                        if (this.alarmChartDatas[i].hour == j) {
                            labels[j] = this.alarmChartDatas[i].hour + this.$t(`home.child.alarmChart.hour`); 
                            deadtimeDatas[j] = this.alarmChartDatas[i].dt.toFixed(3);
                            countDatas[j] = this.alarmChartDatas[i].count;
                        }
                    }
                }
                this.setChartDatas(labels, deadtimeDatas, countDatas);
            }
        },

        setDefaultDatas(index) {
            let tempDatas = [];
            if (index == 0) {
                for (let i = 0; i < 24; i++) {
                    tempDatas.push(String(i)+this.$t(`home.child.alarmChart.hour`));
                }
            } 
            else {
                for (let i = 0; i < 24; i++) {
                    tempDatas.push(0);
                }
            }
            return tempDatas;
        },

        setDataPoints(labels, datas) {
            let dataPoints = [];
            labels.forEach((label, index) => {
                dataPoints.push({label: label, y: Number(datas[index])});
            })
            return dataPoints;
        },

        setChartDatas(labels, tempDeadTimeDatas, tempCountDatas) {
            let countDatas = this.setDataPoints(labels, tempCountDatas);
            let deadTimeDatas = this.setDataPoints(labels, tempDeadTimeDatas);
            if(this.datas.chartOptions.data.length === 0) {
                this.datas.chartOptions.data.push(
                    {
                        type: this.ui.axis.axisY.axisY1.type,
                        name: this.ui.axis.axisY.axisY1.name,
                        axisYType: this.ui.axis.axisY.axisY1.axisYType,
                        color: this.ui.axis.axisY.axisY1.labelFontColor,
                        showInLegend: true,
                        dataPoints: countDatas
                    },
                    {
                        type: this.ui.axis.axisY.axisY2.type,
                        name: this.ui.axis.axisY.axisY2.name,
                        axisYType: this.ui.axis.axisY.axisY2.axisYType,
                        color: this.ui.axis.axisY.axisY2.labelFontColor,
                        showInLegend: true,
                        dataPoints: deadTimeDatas
                    }
                )
                this.renderChart();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    @import "alarmchart";
</style>

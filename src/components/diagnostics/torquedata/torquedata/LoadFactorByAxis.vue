<template>
    <v-card id="torqueDataChartCard" elevation="0" v-bind="initialize">
        <div :id="chartId"></div>
    </v-card>
</template>

<script>
export default {
    props: ['chartId', 'chartDatas', 'chartOutputType'],
    data() {
        return {
            ui: {
                default: {
                    text: "",
                    verticalAlign : "",
                    backgroundColor: "",
                    fontColor: "",
                    fontWeight: "",
                    fontSize: ""
                },
                toolTip: {
                    fontColor: ""
                },
                axis: {
                    tickLength: "",
                    tickThickness: "",
                    labelFontColor: "",
                    labelFontSize: "",
                    axisX: {
                        title: "",
                        lineColor: ""
                    },
                    axisY: {
                        title: "",
                        lineThickness: "",
                        gridDashType: "",
                        gridColor: ""
                    },
                },
                legend: {
                    verticalAlign: "", 
                    fontColor: ""
                },
                dataPoints: {
                    type: "",
                    visible: "",
                    showInLegend: "",
                    color: "",
                    name: ""
                }
            },
            datas: {
                chartOptions: {}
            }
        }
    },

    created() {
        this.initializeUI();
        this.initChartOptions();
    },

    mounted() {
        this.initializeStyle();
        this.renderChart();
    },

    computed: {
        initialize() {
            this.getChartDatas();
        },
    },

    methods: {
        initializeUI() {
            this.ui.default.text = this.$t(`diagnostics.torquedata.child.loadFactorByAxis.defaultTextMessage`);
            this.ui.default.verticalAlign = "center";
            this.ui.default.backgroundColor = this.$style.diagnostics.torqueDataChartBackgroundColor;
            this.ui.default.fontColor = this.$style.diagnostics.torqueDataChartFontColor;
            this.ui.default.fontWeight = "lighter";
            this.ui.default.fontSize = 20;

            this.ui.toolTip.fontColor = this.$style.diagnostics.torqueDataChartTooltipFontColor;
          
            this.ui.axis.tickLength = 15;
            this.ui.axis.tickThickness = 0;
            this.ui.axis.labelFontColor = this.$style.diagnostics.torqueDataChartAxisLabelFontColor;
            this.ui.axis.labelFontSize = 15;
               
            this.ui.axis.axisX.lineColor = this.$style.diagnostics.torqueDataChartAxisXLineColor;
            
            this.ui.axis.axisY.lineThickness = 0;
            this.ui.axis.axisY.gridDashType = "dash";
            this.ui.axis.axisY.gridColor = this.$style.diagnostics.torqueDataChartAxisYGridColor;
             
            this.ui.legend.verticalAlign = "top";
            this.ui.legend.fontColor = this.$style.diagnostics.torqueDataChartLegendFontColor;

            this.ui.dataPoints.type = "line";
            this.ui.dataPoints.visible = true;
            this.ui.dataPoints.showInLegend = true;
            this.ui.dataPoints.name = this.$t(`diagnostics.torquedata.child.loadFactorByAxis.legend`);
            this.ui.dataPoints.color = this.$style.diagnostics.torqueDataChartDataPointsColor;
         
        },

        initializeStyle() {
            const chartStyle = document.querySelector("#"+this.chartId);
            chartStyle.style.height = "100%";
            chartStyle.style.width = "100%";

            const torqueDataChartCard = document.querySelector("#torqueDataChartCard");
            torqueDataChartCard.style.height = "480px";
            torqueDataChartCard.style.border = "solid 1px " + this.$style.common.cardItemBorderColor;

        },

        renderChart() {
            this.$nextTick(() => {
                this.setSubTitle();
                const chart = new this.$chart.Chart(this.chartId, this.datas.chartOptions);
                chart.render();
            })
        },

        getChartDatas() {
            if(this.chartDatas.length > 0) {
                this.setChartDatas(this.chartDatas);
            }
            else {
                this.initChartDatas();
            }
        },

        initChartDatas() {
            this.datas.chartOptions.data = [];
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

        initChartOptions() {
            this.datas.chartOptions = {
                backgroundColor: this.ui.default.backgroundColor,
                animationEnabled: true,
                zoomEnabled: true,
                subtitles: [],
                toolTip: {
                    fontColor: this.ui.toolTip.fontColor,
                    contentFormatter: (e) => {
                        let contentStr = "";
                        contentStr += this.chartOutputType.name + ": " + e.entries[0].dataPoint.label + "<br/>";
                        contentStr += "Torque: " + e.entries[0].dataPoint.y;
                        return contentStr;  
                    }
                }, 
                axisX: {
                    titleFontSize: 15,
                    titleFontColor: this.ui.axis.labelFontColor,
                    tickLength: this.ui.axis.tickLength,
                    tickThickness: this.ui.axis.tickThickness,
                    lineThickness: this.ui.axis.axisY.lineThickness,
                    labelFontColor: this.ui.axis.labelFontColor,
                    labelFontSize: this.ui.axis.labelFontSize,
                    gridDashType: this.ui.axis.axisY.gridDashType,
                    gridColor: this.ui.axis.axisY.gridColor
                },
                axisY: {
                    title: "Torque",
                    titleFontSize: 15,
                    titleFontColor: this.ui.axis.labelFontColor,
                    tickLength: this.ui.axis.tickLength,
                    tickThickness: this.ui.axis.tickThickness,
                    lineThickness: this.ui.axis.axisY.lineThickness,
                    labelFontColor: this.ui.axis.labelFontColor,
                    labelFontSize: this.ui.axis.labelFontSize,
                    gridDashType: this.ui.axis.axisY.gridDashType,
                    gridColor: this.ui.axis.axisY.gridColor,
                },
                legend: {
                    verticalAlign: this.ui.legend.verticalAlign, 
                    fontColor: this.ui.legend.fontColor
                },
                data: []
            }
        },

        setDataPoints(chartDatas, chartOutputType) {
            let dataPoints = [];
            chartDatas.forEach(chartData => {
                if(chartOutputType.id === "step") {
                    dataPoints.push(
                        {label: String(chartData.step_no), y: chartData.torque}
                    )
                }
                else {
                    dataPoints.push(
                        {label: String(chartData.sec)+"s", y: chartData.torque}
                    )
                }
            })
            return dataPoints;
        },

        setChartDatas(chartDatas) {
            let dataPoints = this.setDataPoints(chartDatas , this.chartOutputType);
            if(this.datas.chartOptions.data.length === 0) {
                this.datas.chartOptions.data.push(
                    {
                        type: this.ui.dataPoints.type,
                        visible: this.ui.dataPoints.visible,
                        showInLegend: this.ui.dataPoints.showInLegend,
                        name: this.ui.dataPoints.name,
                        color: this.ui.dataPoints.color,
                        dataPoints: dataPoints
                    }
                )
            }
            else {
                this.datas.chartOptions.data[0].dataPoints = dataPoints;
            }
            this.renderChart();
        }
    }
}
</script>

<style lang="scss" scoped>
    @import './loadfactorbyaxis';
</style>
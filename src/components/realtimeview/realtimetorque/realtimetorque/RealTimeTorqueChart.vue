<template>
    <div :id="chartId" v-bind="getBindDatas"></div>
</template>

<script>
export default {
    props: ['chartId', 'torqueValueLegends', 'warningValueLegends', 'chartDatas'],
    data() {
        return {
            ui: {
                default: {
                    backgroundColor: ""
                },
                axis: {
                    tickLength: "",
                    tickThickness: "",
                    labelFontColor: "",
                    labelFontSize: "",
                    axisX: {
                        lineColor: "",
                        labelWrap: "",
                        labelAutoFit: "",
                        labelAngle: ""
                    },
                    axisY: {
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
                    markerSize: "",
                    xValueType: "",
                    nullDataLineDashType: "",
                    connectNullData: "",
                    lineThickness: "",
                    markerBorderThickness: "",
                }
            },
            datas: {
                valueLabel: "",
                chartOptions: {},
                chartDatas: [],
                torqueValueLegends: [],
                warningValueLegends: [],
                chart: null
            }
        }
    },

    created() {
        this.initializeUI();
        this.initChartOptions();
    },

    mounted() {
        this.initializeStyle();
    },

    computed: {
        getBindDatas() {
            this.getTorqueValueLegends();
            this.getWarningValueLegends();
        },

    },

    watch: {
        chartDatas: {
            deep: true,
            handler(chartDatas) {
                if(chartDatas.length > 0) {
                    this.datas.chartDatas = chartDatas;
                    this.setChartDatas(this.datas.chartDatas);
                }
                else {
                    this.initChartDatas();
                }
            }
        }
    },

    methods: {
        initializeUI() {
            this.ui.default.backgroundColor = this.$style.realtime.realTimeTorqueChartBackgroundColor;

            this.ui.axis.tickLength = 15;
            this.ui.axis.tickThickness = 0;
            this.ui.axis.labelFontColor = this.$style.realtime.realTimeTorqueChartAxisLabelFontColor;
            this.ui.axis.labelFontSize = 12;

            this.ui.axis.axisX.lineColor = this.$style.realtime.realTimeTorqueChartAxisXLineColor;
            this.ui.axis.axisX.labelWrap = false;
            this.ui.axis.axisX.labelAutoFit = true;
            this.ui.axis.axisX.labelAngle = 0;
            
            this.ui.axis.axisY.lineThickness = 0;
            this.ui.axis.axisY.gridDashType = "dash";
            this.ui.axis.axisY.gridColor = this.$style.realtime.realTimeTorqueChartAxisYGridColor;

            this.ui.legend.verticalAlign = "top";
            this.ui.legend.fontColor = this.$style.realtime.realTimeTorqueChartLegendFontColor;

            this.ui.dataPoints.type = "line";
            this.ui.dataPoints.markerSize = 0;
            this.ui.dataPoints.xValueType = "dateTime";
            this.ui.dataPoints.nullDataLineDashType = "soild";
            this.ui.dataPoints.connectNullData = true;
            this.ui.dataPoints.lineThickness = 2;
            this.ui.dataPoints.markerBorderThickness = 2;
        },

        initializeStyle() {
            const chartStyle = document.querySelector("#"+this.chartId);
            chartStyle.style.width = "100%";
            chartStyle.style.height = "480px";
            chartStyle.style.border = "1px solid #575f7d";
        },

        initTorqueValueLegends() {
            this.datas.torqueValueLegends = [];
        },

        initWarningValueLegends() {
            this.datas.warningValueLegends = [];
        },

        initChartDatas() {
            this.datas.chartDatas = [];
            this.datas.chartOptions.data = [];
            this.datas.chart = null;
            this.renderChart();
        },

        getTorqueValueLegends() {
            if(this.torqueValueLegends.length > 0) {
                this.datas.torqueValueLegends = this.torqueValueLegends;
            }
            else {
                this.initTorqueValueLegends();
            }
        },

        getWarningValueLegends() {
            if(this.warningValueLegends.length > 0) {
                this.datas.warningValueLegends = this.warningValueLegends;
            }
            else {
                this.initWarningValueLegends();
            }
        },

        initChartOptions() {
            this.datas.chartOptions = {
                zoomEnabled: true, 
                axisX: {
                    tickLength: this.ui.axis.tickLength,
                    tickThickness: this.ui.axis.tickThickness,
                    lineColor: this.ui.axis.axisX.lineColor,
                    labelFontColor: this.ui.axis.labelFontColor,
                    labelFontSize: this.ui.axis.labelFontSize,
                    labelWrap: this.ui.axis.axisX.labelWrap,
                    labelAutoFit: this.ui.axis.axisX.labelAutoFit,
                    labelAngle: 0
                },
                axisY: {
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
                backgroundColor:this.ui.default.backgroundColor,
                data: []
            }
        },

        renderChart() {
            if(this.datas.chart === null) {
                this.datas.chart = new this.$chart.Chart(this.chartId, this.datas.chartOptions);
            }
            this.datas.chart.render();
        },

        setChartDatas(chartDatas) {
            if(this.datas.chartOptions.data.length <= 0) {
                chartDatas.forEach((chartData, index) => {
                    this.datas.chartOptions.data.push({
                        markerSize: this.ui.dataPoints.markerSize,
                        type: this.ui.dataPoints.type,
                        xValueType: this.ui.dataPoints.xValueType,
                        connectNullData: this.ui.dataPoints.connectNullData,
                        nullDataLineDashType: this.ui.dataPoints.nullDataLineDashType, 
                        showInLegend: this.getShowInLegend(chartData.id),
                        visible: this.getVisible(chartData.id),
                        lineThickness: this.ui.dataPoints.lineThickness,
                        markerBorderThickness: this.ui.dataPoints.markerBorderThickness,
                        color: this.getColor(chartData.id),
                        name: this.getName(chartData.id),
                        dataPoints: chartData.data
                    })
                })
            }
            this.renderChart();
        },

        getShowInLegend(id) {
            let visible = null;
            this.datas.torqueValueLegends.forEach(torqueValueLegend => {
                if(torqueValueLegend.id === id) {
                   visible = torqueValueLegend.visible;
                }
            })
            this.datas.warningValueLegends.forEach(warningValueLegend => {
                if(warningValueLegend.id === id) {
                   visible = warningValueLegend.visible;
                }
            })
            return visible;
        },

        getVisible(id) {
            let visible = null;
            this.datas.torqueValueLegends.forEach(torqueValueLegend => {
                if(torqueValueLegend.id === id) {
                   visible = torqueValueLegend.visible;
                }
            })
            this.datas.warningValueLegends.forEach(warningValueLegend => {
                if(warningValueLegend.id === id) {
                    visible = warningValueLegend.visible;
                }
            })
            return visible;
        },

        getColor(id) {
            let color = "";
            this.datas.torqueValueLegends.forEach(torqueValueLegend => {
                if(torqueValueLegend.id === id) {
                    color = torqueValueLegend.color;
                }
            })
            this.datas.warningValueLegends.forEach(warningValueLegend => {
                if(warningValueLegend.id === id) {
                    color = warningValueLegend.color;
                }
            })
            return color;
        },

        getName(id) {
            let legend = "";
            this.datas.torqueValueLegends.forEach(torqueValueLegend => {
                if(torqueValueLegend.id === id) {
                    legend = torqueValueLegend.legend;
                }
            })
            this.datas.warningValueLegends.forEach(warningValueLegend => {
                if(warningValueLegend.id === id) {
                    legend = warningValueLegend.legend;
                }
            })
            return legend;
        }
       
    }

}
</script>

<style>

</style>
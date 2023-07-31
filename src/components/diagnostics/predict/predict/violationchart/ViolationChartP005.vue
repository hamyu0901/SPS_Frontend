<template>
    <div :id="chartId" v-bind="initialize"></div>
</template>

<script>
export default {
    props: ['chartId', 'chartHeight', 'chartDatas'],
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
                    fontSize: ""
                },
                axis: {
                    tickLength: "",
                    tickThickness: "",
                    labelFontColor: "",
                    labelFontSize: "",
                    axisX: {
                        lineColor: ""
                    },
                    axisY: {
                        lineThickness: "",
                        gridDashType: "",
                        gridColor: ""
                    },
                },
                indexLabel: {
                    fontColor: ""
                },
                legend: {
                    horizontalAlign: "",
                    verticalAlign: "", 
                    fontSize: "",
                    fontColor: ""
                },
                dataPoints: {
                    type: "",
                    lineThickness: "",
                    markerBorderThickness: "",
                    color: {
                        accumData: "",
                        configData: "",
                        violation: ""
                    },
                    name: {
                        accumData: "",
                        configData: ""
                    }
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
    },

    computed: {
        initialize() {
            this.getChartDatas();
        }
    },

    methods: {
        initializeUI() {
            this.ui.default.text = this.$t(`diagnostics.predict.child.violationChart.defaultTextMessage.p005`);
            this.ui.default.verticalAlign = "center";
            this.ui.default.backgroundColor = this.$style.diagnostics.p005ViolationChartBackgroundColor;
            this.ui.default.fontColor = this.$style.diagnostics.p005ViolationChartFontColor;
            this.ui.default.fontWeight = "lighter";
            this.ui.default.fontSize = 20;
            
            this.ui.toolTip.fontSize = 20;
            
            this.ui.axis.tickLength = 15;
            this.ui.axis.tickThickness = 0;
            this.ui.axis.labelFontColor = this.$style.diagnostics.p005ViolationChartAxisLabelFontColor;
            this.ui.axis.labelFontSize = 15;

            this.ui.axis.axisX.lineColor = this.$style.diagnostics.p005ViolationChartAxisXLineColor;
            
            this.ui.axis.axisY.lineThickness = 0;
            this.ui.axis.axisY.gridDashType = "dash";
            this.ui.axis.axisY.gridColor = this.$style.diagnostics.p005ViolationChartAxisYGridColor;
               
            this.ui.indexLabel.fontColor = this.$style.diagnostics.p005ViolationChartIndexLabelFontColor;

            this.ui.legend.horizontalAlign = "center";
            this.ui.legend.verticalAlign = "top";
            this.ui.legend.fontSize = 15;
            this.ui.legend.fontColor = this.$style.diagnostics.p005ViolationChartLegendFontColor;
            
            this.ui.dataPoints.type = "line";
            this.ui.dataPoints.lineThickness = 2;
            this.ui.dataPoints.markerBorderThickness = 2;
            this.ui.dataPoints.color.accumData = this.$style.diagnostics.p005ViolationChartDataPointsColors.accumData;
            this.ui.dataPoints.color.configData = this.$style.diagnostics.p005ViolationChartDataPointsColors.configData;
            this.ui.dataPoints.color.violation = this.$style.diagnostics.p005ViolationChartDataPointsColors.violation;
            this.ui.dataPoints.name.accumData = this.$t(`diagnostics.predict.child.violationChart.torqueAccumulateValue`); 
            this.ui.dataPoints.name.configData = "";
                
        },

        initializeStyle() {
            const chartStyle = document.querySelector("#" + this.chartId);
            chartStyle.style.height = String(this.chartHeight) + "px";
            chartStyle.style.border = "solid 1px " + this.$style.common.cardItemBorderColor;
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

        initChartOptions() {
            this.datas.chartOptions = {
                backgroundColor: this.ui.default.backgroundColor,
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
                    labelFontColor: this.ui.axis.labelFontColor,
                    tickLength: this.ui.axis.tickLength,
                    tickThickness: this.ui.axis.tickThickness,
                    lineColor: this.ui.axis.axisX.lineColor,
                    labelFontSize: this.ui.axis.labelFontSize,
                },
                axisY: {
                    labelFontColor:  this.ui.axis.labelFontColor,
                    tickLength: this.ui.axis.tickLength,
                    tickThickness: this.ui.axis.tickThickness,
                    lineThickness: this.ui.axis.axisY.lineThickness,
                    labelFontSize: this.ui.axis.labelFontSize,
                    gridDashType: this.ui.axis.axisY.gridDashType,
                    gridColor: this.ui.axis.axisY.gridColor
                },
                data: []
            }
        },

        renderChart() {
            this.$nextTick(() => {
                this.setSubTitle();
                const chart = new this.$chart.Chart(this.chartId, this.datas.chartOptions);
                chart.render();
            })
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

        setChartDatas(chartDatas) {
            let labels = this.setLabels(chartDatas);
            let violationType = this.setViolationType(chartDatas);
            let configDatas = this.setConfigDatas(chartDatas, labels);
            let accumDatas = this.setAccumDatas(chartDatas, labels, violationType);

            if(this.datas.chartOptions.data.length === 0) {
                this.datas.chartOptions.data.push(
                    {
                        type: this.ui.dataPoints.type,
                        lineThickness: this.ui.dataPoints.lineThickness,
                        markerBorderThickness: this.ui.dataPoints.markerBorderThickness,
                        indexLabelFormatter: function (e) {
                            if(e.dataPoint.markerBorderColor !== undefined && e.dataPoint.markerBorderColor !== "") {
                                return e.dataPoint.y;  
                            }
                            else {
                                return "";
                            }
                        },
                        indexLabelFontColor: this.ui.indexLabel.fontColor,
                        showInLegend: true,
                        visible: true,
                        color: this.ui.dataPoints.color.accumData,
                        name: this.ui.dataPoints.name.accumData,
                        dataPoints: accumDatas
                    },
                    {
                        type: this.ui.dataPoints.type,
                        lineThickness: this.ui.dataPoints.lineThickness,
                        showInLegend: true,
                        visible: true,
                        color: this.ui.dataPoints.color.configData,
                        name: this.ui.dataPoints.name.configData,
                        dataPoints: configDatas
                    }
                )
            }
            this.renderChart();
        },

        setLabels(chartDatas) {
            let labels = [];
            chartDatas.forEach(chartData => {
                labels.push(chartData.timestamp);
            })
            return labels;
        },

        setViolationType(chartDatas) {
            if(chartDatas[0].accumtype === 2) {
                this.ui.dataPoints.name.configData = this.$t(`diagnostics.predict.child.violationChart.torqueRangeWarningMinValue`) 
            }
            else if(chartDatas[0].accumtype === 3){
                this.ui.dataPoints.name.configData =  this.$t(`diagnostics.predict.child.violationChart.torqueRangeWarningMaxValue`) 
            }
            else {
                this.ui.dataPoints.name.configData = "";
            }
            return chartDatas[0].accumtype;
        },

        setConfigDatas(chartDatas, labels) {
            let configDatas = [];
            labels.forEach((label) => {
                configDatas.push({label: label, y: chartDatas[0].config_value});      
            });
            return configDatas;
        },

        setAccumDatas(chartDatas, labels, violationType) {
            let accumDatas = [];
            labels.forEach((label, index) => {
                let violationColor = "";
                if((violationType === 3 || violationType === 4) &&  chartDatas.length - 1 === index) {
                    violationColor = this.ui.dataPoints.color.violation;
                }
                accumDatas.push({label: label, y: chartDatas[index].sum, markerBorderColor: violationColor});
            });
            return accumDatas;
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
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
                        tmpData: "",
                        tmpConfigData: ""
                    },
                    name: {
                        tmpData: "",
                        tmpConfigData: ""
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
            this.ui.default.text = this.$t(`diagnostics.predict.child.violationChart.defaultTextMessage.p002`);
            this.ui.default.verticalAlign = "center";
            this.ui.default.backgroundColor = this.$style.diagnostics.p002ViolationChartBackgroundColor;
            this.ui.default.fontColor = this.$style.diagnostics.p002ViolationChartFontColor;
            this.ui.default.fontWeight = "lighter";
            this.ui.default.fontSize = 20;
          
            this.ui.toolTip.fontSize = 20;
              
            this.ui.axis.tickLength = 15;
            this.ui.axis.tickThickness = 0;
            this.ui.axis.labelFontColor = this.$style.diagnostics.p002ViolationChartAxisLabelFontColor;
            this.ui.axis.labelFontSize = 15;

            this.ui.axis.axisX.lineColor = this.$style.diagnostics.p002ViolationChartAxisXLineColor;

            this.ui.axis.axisY.lineThickness = 0;
            this.ui.axis.axisY.gridDashType = "dash";
            this.ui.axis.axisY.gridColor = this.$style.diagnostics.p002ViolationChartAxisYGridColor;

            this.ui.indexLabel.fontColor = this.$style.diagnostics.p002ViolationChartIndexLabelFontColor;
                
            this.ui.legend.horizontalAlign = "center";
            this.ui.legend.verticalAlign = "top";
            this.ui.legend.fontSize = 15;
            this.ui.legend.fontColor = this.$style.diagnostics.p002ViolationChartLegendFontColor;

            this.ui.dataPoints.type = "line";
            this.ui.dataPoints.lineThickness = 2;
            this.ui.dataPoints.markerBorderThickness = 2;
            this.ui.dataPoints.color.tmpData = this.$style.diagnostics.p002ViolationChartDataPointsColors.tmpData;
            this.ui.dataPoints.color.tmpConfigData = this.$style.diagnostics.p002ViolationChartDataPointsColors.tmpConfigData;
            this.ui.dataPoints.name.tmpData = this.$t(`diagnostics.predict.child.violationChart.tempValue`); 
            this.ui.dataPoints.name.tmpConfigData = this.$t(`diagnostics.predict.child.violationChart.tempSettingValue`); 

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
            let tmpDatas = this.setTmpDatas(chartDatas, labels);
            let tmpConfigDatas = this.setTmpConfigDatas(chartDatas, labels);

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
                        color: this.ui.dataPoints.color.tmpData,
                        name: this.ui.dataPoints.name.tmpData,
                        dataPoints: tmpDatas
                    },
                    {
                        type: this.ui.dataPoints.type,
                        lineThickness: this.ui.dataPoints.lineThickness,
                        showInLegend: true,
                        visible: true,
                        color: this.ui.dataPoints.color.tmpConfigData,
                        name: this.ui.dataPoints.name.tmpConfigData,
                        dataPoints: tmpConfigDatas
                    }
                )
            }
            else {
                this.datas.chartOptions.data[0].dataPoints = tmpDatas;
                this.datas.chartOptions.data[1].dataPoints = tmpConfigDatas;
            }
            this.renderChart();
        },

        setLabels(chartDatas) {
            let labels = [];
            chartDatas.forEach(chartData => {
                let time = chartData.time_stamp.split("T")[1].split(".")[0];
                labels.push(time);
            })
            return labels;
        },

        setTmpDatas(chartDatas, labels) {
            let tmpDatas = [];
            let violationColor = "";
            labels.forEach((label, index) => {
                if(chartDatas.length-1 === index) {
                    violationColor = "#f63c1e";
                }
                tmpDatas.push({label: label, y: chartDatas[index].motor_encoder, markerBorderColor: violationColor});
            });
            return tmpDatas;
        },

        setTmpConfigDatas(chartDatas, labels) {
            let tmpConfigDatas = [];
            labels.forEach((label, index) => {
                tmpConfigDatas.push(
                    {label: label, y: Number(chartDatas[index].check_value)} // check_value: waring
                );
            });
            return tmpConfigDatas;
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
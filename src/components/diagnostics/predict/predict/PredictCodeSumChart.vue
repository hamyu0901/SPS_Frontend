<template>
    <div >
        <div :id="chartId" v-bind="initialize" style="width: 100%"></div>
    </div>
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
                    color: {
                        p001: "",
                        p002: "",
                        p003: "",
                        p004: "",
                        p005: "",
                        total: ""
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

    destroyed() {
    },

    computed: {
        initialize() {
            this.getChartDatas();
        }
    },

    methods: {
        initializeUI() {
            this.ui.default.text = this.$t(`diagnostics.predict.child.predictCodeSumChart.defaultTextMessage`);
            this.ui.default.verticalAlign = "center";
            this.ui.default.backgroundColor = this.$style.diagnostics.predictCodeSumChartBackgroundColor;
            this.ui.default.fontColor = this.$style.diagnostics.predictCodeSumChartFontColor;
            this.ui.default.fontWeight = "lighter";
            this.ui.default.fontSize = 20;
          
            this.ui.toolTip.fontSize = 20;

            this.ui.axis.tickLength = 15;
            this.ui.axis.tickThickness = 0;
            this.ui.axis.labelFontColor = this.$style.diagnostics.predictCodeSumChartAxisLabelFontColor;
            this.ui.axis.labelFontSize = 15;

            this.ui.axis.axisX.lineColor = this.$style.diagnostics.predictCodeSumChartAxisXLineColor;

            this.ui.axis.axisY.lineThickness = 0;
            this.ui.axis.axisY.gridDashType = "dash";
            this.ui.axis.axisY.gridColor = this.$style.diagnostics.predictCodeSumChartAxisYGridColor;

            this.ui.indexLabel.fontColor = this.$style.diagnostics.predictCodeSumChartIndexLabelFontColor;

            this.ui.legend.horizontalAlign = "center";
            this.ui.legend.verticalAlign = "top";
            this.ui.legend.fontSize = 15;
            this.ui.legend.fontColor = this.$style.diagnostics.predictCodeSumChartLegendFontColor;
              
            this.ui.dataPoints.color.p001 = this.$style.diagnostics.predictCodeSumChartDataPointsP001Color;
            this.ui.dataPoints.color.p002 = this.$style.diagnostics.predictCodeSumChartDataPointsP002Color;
            this.ui.dataPoints.color.p003 = this.$style.diagnostics.predictCodeSumChartDataPointsP003Color;
            this.ui.dataPoints.color.p003 = this.$style.diagnostics.predictCodeSumChartDataPointsP004Color;
            this.ui.dataPoints.color.p005 = this.$style.diagnostics.predictCodeSumChartDataPointsP005Color;
            this.ui.dataPoints.color.total = this.$style.diagnostics.predictCodeSumChartDataPointsTotalColor;
            
        },

        initializeStyle() {
            const chartStyle = document.querySelector("#" + this.chartId);
            chartStyle.style.height = String(this.chartHeight) + "px";
            chartStyle.style.width = "100%";
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
            let predictCodeInfos = this.setPredictCodeInfos(chartDatas);
            let defaultDatas = this.setDefaultDatas(labels, predictCodeInfos);
            let sumDatas = this.setSumDatas(chartDatas, defaultDatas);
            
            if(this.datas.chartOptions.data.length === 0) {
                predictCodeInfos.forEach(predictCodeInfo => {
                    if(predictCodeInfo === 'total') {
                        this.datas.chartOptions.data.push(
                            {
                                type: "column",
                                showInLegend: true,
                                name: this.setDataPointNames(predictCodeInfo),
                                color: this.setDataPointColors(predictCodeInfo),
                                indexLabelFormatter: function (e) {
                                    return e.dataPoint.y
                                },
                                indexLabelFontColor: this.ui.indexLabel.fontColor,
                                dataPoints: sumDatas[predictCodeInfo]
                            }
                        )            
                    }
                    else {
                        this.datas.chartOptions.data.push(
                            {
                                type: "line",
                                showInLegend: true,
                                name: this.setDataPointNames(predictCodeInfo),
                                color: this.setDataPointColors(predictCodeInfo),
                                dataPoints: sumDatas[predictCodeInfo]
                            }
                        )  
                    }
                });
            }
            this.renderChart();
        },

        setLabels(chartDatas) {
            let labels = [];
            chartDatas.forEach(chartData => {
                labels.push(chartData.time_stamp);
            })
            labels = Array.from(new Set(labels));
            return labels;
        },

        setPredictCodeInfos(chartDatas) {
            let codeInfos = [];
            chartDatas.forEach(chartData => {
                codeInfos.push(chartData.code);
            })
            codeInfos = Array.from(new Set(codeInfos)).sort().reverse();
            return codeInfos;
        },

        setDefaultDatas(labels, predictCodeInfos) {
            let defaultDatas= {};
            labels.forEach(label => {
                predictCodeInfos.forEach(predictCodeInfo => {
                    if(defaultDatas.hasOwnProperty(predictCodeInfo)) {
                        defaultDatas[predictCodeInfo].push({label: label, y: 0});
                    }
                    else {
                        defaultDatas[predictCodeInfo] = [];
                        defaultDatas[predictCodeInfo].push({label: label, y: 0});
                    }
                })
            });
            return defaultDatas;
        },

        setSumDatas(chartDatas, defaultDatas) {
            chartDatas.forEach(chartData => {
               defaultDatas[chartData.code].forEach(predictCodeData => {
                   if(predictCodeData.label === chartData.time_stamp) {
                       predictCodeData.y = Number(chartData.sum);
                   }
               })
            }) 
            return defaultDatas;
        },

        setDataPointNames(code) {
            return this.$t("diagnostics.predict.violationInfos."+code);
        },

        setDataPointColors(code) {
            if(code === 'total') {
                return this.ui.dataPoints.color.total;
            }
            else {
                code = code.toLowerCase();
                return this.ui.dataPoints.color[code];
            }
        }

    }
}
</script>

<style lang="scss" scoped>
   
</style>
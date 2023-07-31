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
                        type: "",
                        lineThickness: "",
                        gridDashType: "",
                        gridColor: ""
                    }
                },
                dataPoints: {
                    dataColor0: "",
                    dataColor1: "",
                    dataColor2: "",
                    dataColor3: "",
                    dataColor4: ""
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
            this.ui.default.text = this.$t(`diagnostics.alarmstatistics.child.codeAggregationDlg.codeAggregationChart.defaultTextMessage`);
            this.ui.default.verticalAlign = "center";
            this.ui.default.backgroundColor = this.$style.diagnostics.codeAggregationChartBackgroundColor;
            this.ui.default.fontColor = this.$style.diagnostics.codeAggregationChartFontColor;
            this.ui.default.fontWeight = "lighter";
            this.ui.default.fontSize = 20;

            this.ui.toolTip.fontSize = 20;

            this.ui.axis.tickLength = 15;
            this.ui.axis.tickThickness = 0;
            this.ui.axis.labelFontColor = this.$style.diagnostics.codeAggregationChartAxisLabelFontColor;
            this.ui.axis.labelFontSize = 15;

            this.ui.axis.axisX.lineColor = this.$style.diagnostics.codeAggregationChartAxisXLineColor;

            this.ui.axis.axisY.type = "column";
            this.ui.axis.axisY.lineThickness = 0;
            this.ui.axis.axisY.gridDashType = "dash";
            this.ui.axis.axisY.gridColor = this.$style.diagnostics.codeAggregationChartAxisYGridColor;

            this.ui.dataPoints.dataColor0 = this.$style.diagnostics.codeAggregationChartDataPointsColor0;
            this.ui.dataPoints.dataColor1 = this.$style.diagnostics.codeAggregationChartDataPointsColor1;
            this.ui.dataPoints.dataColor2 = this.$style.diagnostics.codeAggregationChartDataPointsColor2;
            this.ui.dataPoints.dataColor3 = this.$style.diagnostics.codeAggregationChartDataPointsColor3;
            this.ui.dataPoints.dataColor4 = this.$style.diagnostics.codeAggregationChartDataPointsColor4;

        },

        initializeStyle() {
            const chartStyle = document.querySelector("#"+this.chartId);
            chartStyle.style.height = String(this.chartHeight) + "px";
        },

        getChartDatas() {
            if(this.chartDatas.length > 0) {
                this.setChartDatas(this.chartDatas);
            }
            else {
                this.initChartDatas();
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
                axisX: {
                    labelFontColor: this.ui.axis.labelFontColor,
                    tickLength: this.ui.axis.tickLength,
                    tickThickness: this.ui.axis.tickThickness,
                    lineColor: this.ui.axis.axisX.lineColor,
                    labelFontSize: this.ui.axis.labelFontSize
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

        setChartDatas(chartDatas) {
            let labels = this.setLabels(chartDatas);
            let countDatas = this.setCountDatas(chartDatas, labels);

            if(this.datas.chartOptions.data.length === 0) {
                this.datas.chartOptions.data.push(
                    {
                        type: "column",
                        showInLegend: false,
                        dataPoints: countDatas
                    }
                )
            }
            else {
                this.datas.chartOptions.data[0].dataPoints = countDatas;
            }
            this.renderChart();
        },

        setLabels(chartDatas) {
            let labels = [];
            chartDatas.forEach(chartData => {
                if(chartData.hasOwnProperty('alarmcode')) {
                    labels.push(chartData.alarmcode);
                }
                else if(chartData.hasOwnProperty('code')) {
                    labels.push(chartData.code);
                }
            })
            return labels;
        },

        setCountDatas(chartDatas, labels) {
            let countDatas = [];
            labels.forEach((label, index) => {
                countDatas.push(
                    {label: label, y: Math.round(Number(chartDatas[index].count)), color: this.ui.dataPoints['dataColor'+index]}
                );
            })
            return countDatas;
        }


    }

}
</script>

<style lang="scss" scoped>
</style>
<template>
    <div :id="chartId"  v-bind="initialize"></div>
</template>

<script>
export default {
    props: ['chartId', 'chartBackgroundColor', 'chartHeight', 'alarmMixedChartDatas'],
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
                        gridColor: "",
                        axisY1: {
                            type: "",
                            name: "",
                            axisYType: "",
                            color: ""
                        },
                        axisY2: {
                            type: "",
                            name: "",
                            axisYType: "",
                            color: ""
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
            this.getChartBackgroundColor();
        }
    },

    methods: {
        initializeUI() {
            this.ui.default.text = this.$t(`diagnostics.alarmstatistics.child.alarmMixedChart.defaultTextMessage`);
            this.ui.default.verticalAlign = "center";
            this.ui.default.backgroundColor = this.$style.diagnostics.alarmStatisticsChartBackgroundColor;
            this.ui.default.fontColor = this.$style.diagnostics.alarmStatisticsChartFontColor;
            this.ui.default.fontWeight = "lighter";
            this.ui.default.fontSize = 20;

            this.ui.toolTip.fontSize = 20;

            this.ui.axis.tickLength = 15;
            this.ui.axis.tickThickness = 0;
            this.ui.axis.labelFontColor = this.$style.diagnostics.alarmStatisticsChartAxisLabelFontColor;
            this.ui.axis.labelFontSize = 15;

            this.ui.axis.axisX.lineColor = this.$style.diagnostics.alarmStatisticsChartAxisXLineColor;

            this.ui.axis.axisY.lineThickness = 0;
            this.ui.axis.axisY.gridDashType = "dash";
            this.ui.axis.axisY.gridColor = this.$style.diagnostics.alarmStatisticsChartAxisYGridColor;

            this.ui.axis.axisY.axisY1.type = "column";
            this.ui.axis.axisY.axisY1.name = this.$t(`diagnostics.alarmstatistics.child.alarmMixedChart.count`);
            this.ui.axis.axisY.axisY1.axisYType = "primary";
            this.ui.axis.axisY.axisY1.color = this.$style.diagnostics.alarmStatisticsChartAxisY1Color;


            this.ui.legend.horizontalAlign = "center";
            this.ui.legend.verticalAlign = "top";
            this.ui.legend.fontSize = 15;
            this.ui.legend.fontColor = this.$style.diagnostics.alarmStatisticsChartLegendFontColor;

        },

        initializeStyle() {
            const chartStyle = document.querySelector("#"+this.chartId);
            chartStyle.style.height = String(this.chartHeight) + "px";
            chartStyle.style.border = "solid 1px " + this.$style.common.cardItemBorderColor;
        },

        initChartDatas() {
            this.datas.chartOptions.data = [];
            this.renderChart();
        },

        getChartDatas() {
            if(this.alarmMixedChartDatas.length > 0) {
                this.setChartDatas(this.alarmMixedChartDatas);
            }
            else {
                this.initChartDatas();
            }
        },

        getChartBackgroundColor() {
            if(this.chartBackgroundColor !== undefined) {
                this.ui.default.backgroundColor = this.chartBackgroundColor;
                this.datas.chartOptions.backgroundColor = this.ui.default.backgroundColor;
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
                axisY: [{
                    title: this.ui.axis.axisY.axisY1.name,
                    titleFontColor: this.ui.axis.axisY.axisY1.color,
                    labelFontColor:  this.ui.axis.axisY.axisY1.color,
                    tickLength: this.ui.axis.tickLength,
                    tickThickness: this.ui.axis.tickThickness,
                    lineThickness: this.ui.axis.axisY.lineThickness,
                    labelFontSize: this.ui.axis.labelFontSize,
                    gridDashType: this.ui.axis.axisY.gridDashType,
                    gridColor: this.ui.axis.axisY.gridColor
                }],
                axisY2: [{
                    title: this.ui.axis.axisY.axisY2.name,
                    titleFontColor: this.ui.axis.axisY.axisY2.color,
                    labelFontColor: this.ui.axis.axisY.axisY2.color,
                    tickLength: this.ui.axis.tickLength,
                    tickThickness: this.ui.axis.tickThickness,
                    lineThickness: this.ui.axis.axisY.lineThickness,
                    labelFontSize: this.ui.axis.labelFontSize,
                    gridDashType: this.ui.axis.axisY.gridDashType,
                    gridColor: this.ui.axis.axisY.gridColor
                }],
                data: []
            }
        },

        setChartDatas(chartDatas) {
            let labels = this.setLabelDatas(chartDatas);
            let countDatas = this.setCountDatas(chartDatas, labels);
            let deadTimeDatas = this.setDeadTimeDatas(chartDatas, labels);

            if(this.datas.chartOptions.data.length === 0) {
                this.datas.chartOptions.data.push(
                     {
                        type: this.ui.axis.axisY.axisY1.type,
                        name: this.ui.axis.axisY.axisY1.name,
                        axisYType: this.ui.axis.axisY.axisY1.axisYType,
                        color: this.ui.axis.axisY.axisY1.color,
                        showInLegend: true,
                        dataPoints: countDatas
                    },
                )
            }
            else {
                this.datas.chartOptions.data[0].dataPoints = countDatas;
            }
            this.renderChart();
        },

        setLabelDatas(chartDatas) {
            let labels = [];
            chartDatas.forEach(chartData => {
                labels.push(chartData.date);
            });
            return labels;
        },

        setCountDatas(chartDatas, labels) {
            let countDatas = [];
            labels.forEach((label, index) => {
                countDatas.push(
                    {label: label, y: Number(chartDatas[index].count)}
                );
            });
            return countDatas;
        },

        setDeadTimeDatas(chartDatas, labels) {
            let deadTimeDatas = [];
            labels.forEach((label, index) => {
                deadTimeDatas.push(
                    {label: label, y: Number(chartDatas[index].dt)}
                );
            });
            return deadTimeDatas;
        }

    }
}
</script>

<style lang="scss" scoped>

</style>

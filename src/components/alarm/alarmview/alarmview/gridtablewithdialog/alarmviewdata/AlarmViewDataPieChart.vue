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
                    height: "",
                    backgroundColor: "",
                    verticalAlign : "",
                    fontColor: "",
                    fontWeight: "",
                    fontSize: "",
                },
                toolTip: {
                    fontSize: ""
                },
                indexLabel: {
                    fontColor: "",
                    fontSize: ""
                },
                dataPoints: {
                    type: "",
                    startAngle: "",
                    animationEnabled: "",
                    color: {
                        boothColor_1: "",
                        boothColor_2: "",
                        boothColor_3: "",
                        boothColor_4: "",
                        boothColor_5: ""
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

    },

    computed: {
        initialize() {
            this.getChartDatas();
        }
    },

    methods: {
        initializeUI() {
            this.ui.default.text = this.$t(`alarmView.child.alarmViewDataPieChart.defaultTextMessage`);
            this.ui.default.height = this.chartHeight;
            this.ui.default.backgroundColor = this.$style.alarm.alarmViewDataPieChartBackgroundColor;
            this.ui.default.verticalAlign = "center";
            this.ui.default.fontColor = this.$style.alarm.alarmViewDataPieChartFontColor;
            this.ui.default.fontWeight = "lighter";
            this.ui.default.fontSize = 20;

            this.ui.toolTip.fontSize = 20;

            this.ui.indexLabel.fontColor = this.$style.alarm.alarmViewDataPieChartIndexLabelFontColor;
            this.ui.indexLabel.fontSize = 15;

            this.ui.dataPoints.type = "pie";
            this.ui.dataPoints.startAngle = 240;
            this.ui.dataPoints.animationEnabled = true;

            this.ui.dataPoints.color.boothColor_1 = this.$style.alarm.alarmViewDataPieChartDataPointsColors.boothColor_1;
            this.ui.dataPoints.color.boothColor_2 = this.$style.alarm.alarmViewDataPieChartDataPointsColors.boothColor_2;
            this.ui.dataPoints.color.boothColor_3 = this.$style.alarm.alarmViewDataPieChartDataPointsColors.boothColor_3;
            this.ui.dataPoints.color.boothColor_4 = this.$style.alarm.alarmViewDataPieChartDataPointsColors.boothColor_4;
            this.ui.dataPoints.color.boothColor_5 = this.$style.alarm.alarmViewDataPieChartDataPointsColors.boothColor_5;
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

        initChartDatas() {
            this.datas.chartOptions.data = [];
            this.renderChart();
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
                height: this.ui.default.height,
                animationEnabled: this.ui.dataPoints.animationEnabled,
                subtitles: [],
                toolTip: {
                    fontSize: this.ui.toolTip.fontSize
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
                        type: this.ui.dataPoints.type,
                        startAngle: this.ui.dataPoints.startAngle,
                        indexLabelFontColor: this.ui.indexLabel.fontColor,
                        indexLabelFormatter: function (e) {
                            if(e.dataPoint.y !== undefined && e.dataPoint.y !== 0) {
                                return e.dataPoint.label + " " + e.dataPoint.y;  
                            }
                            else {
                                return "";
                            }
                        },
                        indexLabelFontSize: this.ui.indexLabel.fontSize,
                        dataPoints: countDatas
                    }
                );
            }
            this.renderChart();
        },

        setLabels(chartDatas) {
            let labels = [];
            chartDatas.forEach(chartData => {
                labels.push(chartData.zonename);
            });
            return labels;
        },

        setCountDatas(chartDatas, labels) {
            let countDatas = [];
            labels.forEach((label, index) => {
                countDatas.push(
                    {label: label, y: chartDatas[index].count, color: this.ui.dataPoints.color['boothColor_' + (index+1)]}
                );
            });
            return countDatas;
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
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
                    verticalAlign : "",
                    backgroundColor: "",
                    fontColor: "",
                    fontWeight: "",
                    fontSize: "",
                    type: "",
                    startAngle: "",
                },
                indexLabel: {
                    fontColor: "",
                    fontSize: ""
                },
                toolTip: {
                    fontSize: ""
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
            this.ui.default.height = this.chartHeight;
            this.ui.default.verticalAlign = "center";
            this.ui.default.backgroundColor = this.$style.diagnostics.dateAggregationChartBackgroundColor;
            this.ui.default.fontColor = this.$style.diagnostics.dateAggregationChartFontColor;
            this.ui.default.fontWeight = "lighter";
            this.ui.default.fontSize = 20;
            this.ui.default.type = "pie";
            this.ui.default.startAngle = 240;

            this.ui.indexLabel.fontColor = this.$style.diagnostics.dateAggregationChartIndexLabelFontColor;
            this.ui.indexLabel.fontSize = 15;

            this.ui.toolTip.fontSize = 20;

            this.ui.dataPoints.dataColor0 = this.$style.diagnostics.dateAggregationChartDataPointsColor0;
            this.ui.dataPoints.dataColor1 = this.$style.diagnostics.dateAggregationChartDataPointsColor1;
            this.ui.dataPoints.dataColor2 = this.$style.diagnostics.dateAggregationChartDataPointsColor2;
            this.ui.dataPoints.dataColor3 = this.$style.diagnostics.dateAggregationChartDataPointsColor3;
            this.ui.dataPoints.dataColor4 = this.$style.diagnostics.dateAggregationChartDataPointsColor4;
                 
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
                animationEnabled: true,
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
                        type: this.ui.default.type,
                        startAngle: this.ui.default.startAngle,
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
                labels.push(chartData.name);
            });
            return labels;
        },

        setCountDatas(chartDatas, labels) {
            let countDatas = [];
            labels.forEach((label, index) => {
                countDatas.push(
                    {label: label, y: chartDatas[index].count, color: this.ui.dataPoints['dataColor'+index]}
                );
            });
            return countDatas;
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
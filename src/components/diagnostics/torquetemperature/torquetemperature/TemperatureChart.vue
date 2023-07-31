<template>
   <v-card class="temperatureChartCard" elevation="0" v-bind="initialize" :color="ui.cardBackgroundColor">
        <div :id="chartId"></div>
    </v-card>
</template>

<script>
export default {
    props: ['chartId', 'chartDatas', 'chartHeight'],
    data() {
        return {
            ui: {
                cardBackgroundColor: "",
                default: {
                    text: "",
                    verticalAlign : "",
                    fontColor: "",
                    fontWeight: "",
                    fontSize: ""
                },
                axis: {
                    tickLength: "",
                    tickThickness: "",
                    labelFontColor: "",
                    labelFontSize: "",
                    axisX: {
                        lineColor: "",
                        labelWrap: "",
                        labelAutoFit: ""
                    },
                    axisY: {
                        lineThickness: "",
                        gridDashType: "",
                        gridColor: ""
                    },
                },
                legend: {
                    verticalAlign: "", 
                    fontColor: "",
                    fontSize: ""
                },
                dataPoints: {
                    type: "",
                    lineThickness: "",
                    markerBorderThickness: "",
                    color: {
                        maxTemperature: "",
                        stdTemperature: "",
                        violation: ""
                    },
                    name: {
                        maxTemperature: "",
                        stdTemperature: ""
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
        this.renderChart();
    },

    computed: {
        initialize() {
            this.getChartDatas();
        }
    },
    
    methods: {
        initializeUI() {
            this.ui.cardBackgroundColor = this.$style.diagnostics.torqueLoadFactorByAxisItemBackgroundColor;
            
            this.ui.default.text = this.$t(`diagnostics.torqueTemperature.child.temperatureCharts.defaultTextMessage`);
            this.ui.default.verticalAlign = "center";
            this.ui.default.fontColor = this.$style.diagnostics.temperatureChartFontColor;
            this.ui.default.fontSize = 20;

            this.ui.axis.tickLength = 15;
            this.ui.axis.tickThickness = 0;
            this.ui.axis.labelFontColor = this.$style.diagnostics.temperatureChartAxisLabelFontColor;
            this.ui.axis.labelFontSize = 15;

            this.ui.axis.axisX.lineColor = this.$style.diagnostics.temperatureChartAxisXLineColor;
            this.ui.axis.axisX.labelWrap = false;
            this.ui.axis.axisX.labelAutoFit = false;

            this.ui.axis.axisY.lineThickness = 0;
            this.ui.axis.axisY.gridDashType = "dash";
            this.ui.axis.axisY.gridColor = this.$style.diagnostics.temperatureChartAxisYGridColor;

            this.ui.legend.verticalAlign = "top";
            this.ui.legend.fontColor = this.$style.diagnostics.temperatureChartLegendFontColor;
            this.ui.legend.fontSize = 15;

            this.ui.dataPoints.type = "line";
            this.ui.dataPoints.lineThickness = 2;
            this.ui.dataPoints.markerBorderThickness = 2;
            this.ui.dataPoints.color.maxTemperature = this.$style.diagnostics.temperatureChartDataPointsColor.maxTemperature;
            this.ui.dataPoints.color.stdTemperature = this.$style.diagnostics.temperatureChartDataPointsColor.stdTemperature;
            this.ui.dataPoints.color.violation = this.$style.diagnostics.temperatureChartDataPointsColor.violation;
            this.ui.dataPoints.name.maxTemperature = this.$t(`diagnostics.torqueTemperature.child.temperatureCharts.max`);
            this.ui.dataPoints.name.stdTemperature = this.$t(`diagnostics.torqueTemperature.child.temperatureCharts.standard`);

        },

        initializeStyle() {
            const chartStyle = document.querySelector("#"+this.chartId);
            chartStyle.style.height = String(Math.round(this.chartHeight)) + "px";
            chartStyle.style.border = "solid 1px" + this.$style.common.cardItemBorderColor;
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
                animationEnabled: true,
                subtitles: [],
                backgroundColor:this.$style.diagnostics.torqueLoadFactorByAxisItemBackgroundColor,
                axisX: {
                    tickLength: this.ui.axis.tickLength,
                    tickThickness: this.ui.axis.tickThickness,
                    lineColor: this.ui.axis.axisX.lineColor,
                    labelFontColor: this.ui.axis.labelFontColor,
                    labelFontSize: this.ui.axis.labelFontSize,
                    labelWrap: this.ui.axis.axisX.labelWrap,
                    labelAutoFit: this.ui.axis.axisX.labelAutoFit,
                },
                axisY: {
                    tickLength: this.ui.axis.tickLength,
                    tickThickness: this.ui.axis.tickThickness,
                    lineThickness: this.ui.axis.axisY.lineThickness,
                    labelFontColor: this.ui.axis.labelFontColor,
                    labelFontSize: this.ui.axis.labelFontSize,
                    gridDashType: this.ui.axis.axisY.gridDashType,
                    gridColor: this.ui.axis.axisY.gridColor
                },
                legend: {
                    verticalAlign: this.ui.legend.verticalAlign, 
                    fontColor: this.ui.legend.fontColor,
                    fontSize: this.ui.legend.fontSize
                },
                data: []
            }
            this.renderChart();
        },

        setChartDatas(chartDatas) {
            let labels = this.setLabels(chartDatas);
            let maxTmpDatas = this.setMaxTmpDatas(chartDatas, labels);
            let stdTmpDatas = this.setStdTmpDatas(chartDatas, labels);

            if(this.datas.chartOptions.data.length === 0) {
                this.datas.chartOptions.data.push(
                    {
                        type: this.ui.dataPoints.type,
                        lineThickness: this.ui.dataPoints.lineThickness,
                        showInLegend: true,
                        visible: true,
                        color: this.ui.dataPoints.color.maxTemperature,
                        name: this.ui.dataPoints.name.maxTemperature,
                        dataPoints: maxTmpDatas
                    },
                    {
                        type: this.ui.dataPoints.type,
                        lineThickness: this.ui.dataPoints.lineThickness,
                        showInLegend: true,
                        visible: true,
                        color: this.ui.dataPoints.color.stdTemperature,
                        name: this.ui.dataPoints.name.stdTemperature,
                        dataPoints: stdTmpDatas
                    },
                )
            } else {
                this.datas.chartOptions.data[0].dataPoints = maxTmpDatas;
                this.datas.chartOptions.data[1].dataPoints = stdTmpDatas;
            }
            this.renderChart();
        },

        setLabels(chartDatas) {
            let labelDatas = [];
            if(chartDatas[0].output_type == 'H') {
                for(let i = 0; i < chartDatas.length; i++) {
                    labelDatas.push(chartDatas[i].date_part + " " + chartDatas[i].output_type);
                }
            }
            else if(chartDatas[0].output_type == 'D') {
                for(let i = 0; i < chartDatas.length; i++) {
                    labelDatas.push(chartDatas[i].date.substr(5));
                }
            }
            else if(chartDatas[0].output_type == 'W') {
                for(let i = 0; i < chartDatas.length; i++) {
                    labelDatas.push(chartDatas[i].month  + " M " + chartDatas[i].week + " W");
                }
            }
            else if(chartDatas[0].output_type == 'M') {
                 for(let i = 0; i < chartDatas.length; i++) {
                    labelDatas.push(chartDatas[i].date_part + " " + chartDatas[i].output_type);
                }
            }
            return labelDatas;
        },

        setMaxTmpDatas(chartDatas, labels) {
            let maxTmpDatas = [];
            labels.forEach((label, index) => {
                maxTmpDatas.push(
                    {label: label, y: chartDatas[index].max}
                );
            })
            return maxTmpDatas;
        },


        setStdTmpDatas(chartDatas, labels) {
            let stdTmpDatas = [];
            labels.forEach((label, index) => {
                stdTmpDatas.push(
                    {label: label, y: chartDatas[index].settingValue}
                );
            })
            return stdTmpDatas;
        }
        
    }
}
</script>

<style lang="scss" scoped>
    .temperatureChartCard {
      height: 100%;
      width: 100%;
    }
    
</style>
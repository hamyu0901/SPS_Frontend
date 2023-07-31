<template>
   <v-card class="temperatureChartCard" elevation="0" v-bind="initialize" :color="ui.cardBackgroundColor">
        <div :id="chartId"></div>
    </v-card>
</template>

<script>
export default {
    props: ['chartId', 'chartDatas', 'chartOutputType', 'chartHeight', 'chartLabels'],
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
                        first: "",
                        second: ""
                    },
                    name: {
                        first: "",
                        second: ""
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
        // this.initializeStyle();
        this.renderChart();
    },

    computed: {
        initialize() {
            this.getChartDatas();
            this.getChartLabels();
        }
    },
    
    methods: {
        initializeUI() {
            this.ui.cardBackgroundColor = this.$style.diagnostics.torqueLoadFactorByAxisItemBackgroundColor;
            
            this.ui.default.text = this.$t(`diagnostics.torqueSimilarity.child.torqueSimilarityChart.defaultTextMessage`);
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
            this.ui.dataPoints.color.first = '#0ca889';
            this.ui.dataPoints.color.second = '#ffbb00';
        },

        initializeStyle() {
            const chartStyle = document.querySelector("#"+this.chartId);
            chartStyle.style.height = String(Math.round(this.chartHeight)) + "px";
            chartStyle.style.border = "solid 1px" + this.$style.common.cardItemBorderColor;
        },

        getChartDatas() {
            if(this.chartDatas.firstTrendDatas.length > 0 && this.chartDatas.secondTrendDatas.length > 0) {
                this.setChartDatas(this.chartDatas);
            } 
            else {
                this.initChartDatas();
            }
        },

        getChartLabels() {
            if(this.chartLabels.firstLabel !== undefined && this.chartLabels.secondLabel !== undefined) {
                this.ui.dataPoints.name.first = this.chartLabels.firstLabel;
                this.ui.dataPoints.name.second = this.chartLabels.secondLabel;
            } else {
                this.ui.dataPoints.name.first = '';
                this.ui.dataPoints.name.second = '';
            }
        },

        renderChart() {
            this.$nextTick(() => {
                this.setSubTitle();
                this.initializeStyle();
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
                zoomEnabled: true,
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
            let labels = this.setLabels(chartDatas, this.chartOutputType);
            let firstTmpDatas = this.setTmpDatas(chartDatas.firstTrendDatas[0], labels, this.chartOutputType);
            let secondTmpDatas = this.setTmpDatas(chartDatas.secondTrendDatas[0], labels, this.chartOutputType);
            if(this.datas.chartOptions.data.length === 0) {
                this.datas.chartOptions.data.push(
                    {
                        type: this.ui.dataPoints.type,
                        lineThickness: this.ui.dataPoints.lineThickness,
                        showInLegend: true,
                        visible: true,
                        color:this.ui.dataPoints.color.first,
                        name: this.ui.dataPoints.name.first,
                        dataPoints: firstTmpDatas
                    },
                    {
                        type: this.ui.dataPoints.type,
                        lineThickness: this.ui.dataPoints.lineThickness,    
                        showInLegend: true,
                        visible: true,
                        color: this.ui.dataPoints.color.second,
                        name: this.ui.dataPoints.name.second,
                        dataPoints: secondTmpDatas
                    }
                   
                )
            } else {
                this.datas.chartOptions.data[0].dataPoints = firstTmpDatas;
                this.datas.chartOptions.data[1].dataPoints = secondTmpDatas;
            }
            this.renderChart();
        },

        setLabels(chartDatas, chartOutputType) {
            let labelDatas = [];
            if(chartOutputType.id === "stepno") {
                if(chartDatas.firstTrendDatas[0].avg !== undefined && chartDatas.secondTrendDatas[0].avg !== undefined) {
                    let tempLabels = chartDatas.firstTrendDatas[0].stepno.concat(chartDatas.secondTrendDatas[0].stepno);
                    tempLabels = tempLabels.filter((tempLabel, pos) => tempLabels.indexOf(tempLabel) === pos);
                    labelDatas = tempLabels.sort(function(a,b) {return a-b;});
                } else if(chartDatas.firstTrendDatas[0].stepNoTorque !== undefined && chartDatas.secondTrendDatas[0].stepNoTorque !== undefined) {
                    let tempLabels = chartDatas.firstTrendDatas[0].stepno.concat(chartDatas.secondTrendDatas[0].stepno);
                    tempLabels = tempLabels.filter((tempLabel, pos) => tempLabels.indexOf(tempLabel) === pos);
                    labelDatas = tempLabels.sort(function(a,b) {return a-b;});
                }
                
            } else if(chartOutputType.id === "sec") {
                let tempLabels = chartDatas.firstTrendDatas[0].sec.concat(chartDatas.secondTrendDatas[0].sec);
                tempLabels = tempLabels.filter((tempLabel, pos) => tempLabels.indexOf(tempLabel) === pos);
                labelDatas = tempLabels.sort(function(a,b) {return a-b;});
            }
            return labelDatas;
        },

        setTmpDatas(chartDatas, labels, chartOutputType) {
            let tmpDatas = [];
            if(chartOutputType.id === "stepno") {
                if(chartDatas.avg !== undefined) {
                    labels.forEach((label, index) => {
                        if(chartDatas.stepno.findIndex(stepno => stepno === label) !== -1) {
                            tmpDatas.push({label: label, y: Number(chartDatas.avg[chartDatas.stepno.findIndex(stepno => stepno === label)])});
                        } else {
                           if(tmpDatas.length !== 0) {
                                tmpDatas.push({label: label, y: Number(tmpDatas[tmpDatas.length-1].y)});
                            } else {
                                tmpDatas.push({label: label, y: null});
                            }
                        }
                    })
                } else if(chartDatas.stepNoTorque !== undefined) {
                    labels.forEach((label, index) => {
                        if(chartDatas.stepno.findIndex(stepno => stepno === label) !== -1) {
                            tmpDatas.push({label: label + "s", y: Number(chartDatas.stepNoTorque[chartDatas.stepno.findIndex(stepno => stepno === label)])});
                        } else {
                            if(tmpDatas.length !== 0) {
                                tmpDatas.push({label: label+"s", y: Number(tmpDatas[tmpDatas.length-1].y)});
                            } else {
                                tmpDatas.push({label: label+"s", y: null});
                            }
                        }
                    })
                }
            } else if(chartOutputType.id === "sec") {
                if(chartDatas.secTorque !== undefined) {
                    labels.forEach((label, index) => {
                        if(chartDatas.sec.findIndex(sec => sec === label) !== -1) {
                            tmpDatas.push({label: label, y: Number(chartDatas.secTorque[chartDatas.sec.findIndex(sec => sec === label)])});
                        } else {
                            if(tmpDatas.length !== 0) {
                                tmpDatas.push({label: label, y: Number(tmpDatas[tmpDatas.length-1].y)});
                            } else {
                                tmpDatas.push({label: label, y: null});
                            }
                            
                        }
                    })
                }
            }
            
            return tmpDatas;
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
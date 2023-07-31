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
                        torqueData: "",
                        maxConfigData: "",
                        minConfigData: "",
                        violation: ""
                    },
                    name: {
                        torqueData: "",
                        maxConfigData: "",
                        minConfigData: ""
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
            this.ui.default.text = this.$t(`diagnostics.predict.child.violationChart.defaultTextMessage.p001`);
            this.ui.default.verticalAlign = "center";
            this.ui.default.backgroundColor = this.$style.diagnostics.p001ViolationChartBackgroundColor;
            this.ui.default.fontColor = this.$style.diagnostics.p001ViolationChartFontColor;
            this.ui.default.fontWeight = "lighter";
            this.ui.default.fontSize = 20;

            this.ui.toolTip.fontSize = 20;
            
            this.ui.axis.tickLength = 15;
            this.ui.axis.tickThickness = 0;
            this.ui.axis.labelFontColor = this.$style.diagnostics.p001ViolationChartAxisLabelFontColor;
            this.ui.axis.labelFontSize = 15;

            this.ui.axis.axisX.lineColor = this.$style.diagnostics.p001ViolationChartAxisXLineColor;

            this.ui.axis.axisY.lineThickness = 0;
            this.ui.axis.axisY.gridDashType = "dash";
            this.ui.axis.axisY.gridColor = this.$style.diagnostics.p001ViolationChartAxisYGridColor;

            this.ui.legend.horizontalAlign = "center";
            this.ui.legend.verticalAlign = "top";
            this.ui.legend.fontSize = 15;
            this.ui.legend.fontColor = this.$style.diagnostics.p001ViolationChartLegendFontColor;
                
            this.ui.dataPoints.type = "line";
            this.ui.dataPoints.lineThickness = 2;
            this.ui.dataPoints.markerBorderThickness = 2;
            this.ui.dataPoints.color.torqueData = this.$style.diagnostics.p001ViolationChartDataPointsColors.torqueData;
            this.ui.dataPoints.color.maxConfigData = this.$style.diagnostics.p001ViolationChartDataPointsColors.maxConfigData;
            this.ui.dataPoints.color.minConfigData = this.$style.diagnostics.p001ViolationChartDataPointsColors.minConfigData;
            this.ui.dataPoints.color.violation = this.$style.diagnostics.p001ViolationChartDataPointsColors.violation;

            this.ui.dataPoints.name.torqueData = this.$t(`diagnostics.predict.child.violationChart.torqueRangeValue`); 
            this.ui.dataPoints.name.maxConfigData = this.$t(`diagnostics.predict.child.violationChart.torqueRangeWarningMaxValue`);
            this.ui.dataPoints.name.minConfigData = this.$t(`diagnostics.predict.child.violationChart.torqueRangeWarningMinValue`);
                  
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
                    maximum: 300,
                    minimum: -300,
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

        async setChartDatas(chartDatas) {
            let labels = await this.setLabels(chartDatas);
            let tempTorqueDatas = await this.setTorqueDatas(chartDatas, labels);
            let tempConfigDatas = await this.setConfigDatas(chartDatas, labels);
            let torqueDatas = await this.setViolationValues(labels, tempTorqueDatas, tempConfigDatas.maxConfigDatas, tempConfigDatas.minConfigDatas);
            if(this.datas.chartOptions.data.length === 0) {
                this.datas.chartOptions.data.push(
                    {
                        type: this.ui.dataPoints.type,
                        showInLegend: true,
                        name: this.ui.dataPoints.name.torqueData,
                        color: this.ui.dataPoints.color.torqueData,
                        markerSize: 5,
                        markerBorderThickness: this.ui.dataPoints.markerBorderThickness,
                        dataPoints: torqueDatas.maxTorqueDatas
                    },
                    {
                        type: this.ui.dataPoints.type,
                        showInLegend: true,
                        name: this.ui.dataPoints.name.torqueData,
                        color: this.ui.dataPoints.color.torqueData,
                        markerSize: 5,
                        markerBorderThickness: this.ui.dataPoints.markerBorderThickness,
                        dataPoints: torqueDatas.minTorqueDatas
                    },
                    {
                        type: this.ui.dataPoints.type,
                        showInLegend: true,
                        name: this.ui.dataPoints.name.maxConfigData,
                        color: this.ui.dataPoints.color.maxConfigData,
                        dataPoints: tempConfigDatas.maxConfigDatas
                    },
                    {
                        type:this.ui.dataPoints.type,
                        showInLegend: true,
                        name: this.ui.dataPoints.name.minConfigData,
                        color: this.ui.dataPoints.color.minConfigData,
                        dataPoints: tempConfigDatas.minConfigDatas
                    }
                )
            }
            this.renderChart();
        },

        setLabels(chartDatas) {
            return new Promise((resolve, reject) => {
                try {
                    let labelSet = new Set(chartDatas[0].step_no[0]);
                    let labels = [...labelSet].map(Number).sort((a,b) => {return a-b});
                    resolve(labels);
                }
                catch(error) {
                    reject(error);
                }
            })
        },

        setTorqueDatas(chartDatas, labels) {
            return new Promise((resolve, reject) => {
                try {
                    let maxTorqueDatas = [], minTorqueDatas = [];
                    labels.forEach(label => {
                        let min = 300, max = -300;
                        chartDatas[0].step_no[0].forEach((stepNo, index) => {
                            if(label == stepNo) {
                                if(min > chartDatas[0].motor_torque[0][index]) {
                                    min = chartDatas[0].motor_torque[0][index];
                                }
                                if(max < chartDatas[0].motor_torque[0][index]) {
                                    max = chartDatas[0].motor_torque[0][index];
                                }
                            }
                            if(index === chartDatas[0].step_no[0].length-1) {
                                maxTorqueDatas.push({label: label, y: max});
                                minTorqueDatas.push({label: label, y: min});
                            }
                        })
                    })
                    resolve({maxTorqueDatas: maxTorqueDatas, minTorqueDatas: minTorqueDatas});   
                }
                catch(error) {
                    reject(error);
                }
            })
        },

        setConfigDatas(chartDatas, labels) {
            return new Promise((resolve, reject) => {
                try {
                    let maxConfigDatas = [], minConfigDatas = [];
                    labels.forEach(label => {
                        let checkFlag = false;
                        chartDatas[0].config_stepno[0].forEach((configStepNo, index) => {
                            if(label == configStepNo) {
                                maxConfigDatas.push({label: label, y: chartDatas[0].config_torquemax[0][index]});
                                minConfigDatas.push({label: label, y: chartDatas[0].config_torquemin[0][index]});
                                checkFlag = true;
                            } 
                            if(checkFlag == false && index == (chartDatas[0].config_stepno[0].length-1)) {
                                maxConfigDatas.push({label: label, y: undefined});
                                minConfigDatas.push({label: label, y: undefined});
                            }
                        })
                    })
                    resolve({maxConfigDatas: maxConfigDatas, minConfigDatas: minConfigDatas});
                }
                catch(error) {
                    reject(error);
                }
            })
        },

        setViolationValues(labels, torqueDatas, maxConfigDatas, minConfigDatas) {
            return new Promise((resolve, reject) => {
                try {
                    labels.forEach((label, index) => {
                        if(torqueDatas.maxTorqueDatas[index].y > maxConfigDatas[index].y) {
                            torqueDatas.maxTorqueDatas[index]['markerBorderColor'] = this.ui.dataPoints.color.violation;
                        }
                        if(torqueDatas.minTorqueDatas[index].y < minConfigDatas[index].y) {
                            torqueDatas.minTorqueDatas[index]['markerBorderColor'] = this.ui.dataPoints.color.violation;
                        }
                    })
                    resolve(torqueDatas);
                }
                catch(error) {
                    reject(error);
                }
            })
            
        }
    }
}
</script>

<style>

</style>
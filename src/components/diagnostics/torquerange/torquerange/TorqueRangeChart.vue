<template>
    <div :id="chartId" v-bind="initialize"></div>
</template>

<script>
export default {
    props: ['chartId', 'chartHeight', 'torqueDatas', 'warningDatas', 'warningFlag'],
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
                    labelTitle: "",
                    valueTitle: ""
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
                    type: '',
                    lineThickness: "",
                    markerBorderThickness: "",
                    markerSize: "",
                    color: {
                        maxTorqueData: "",
                        minTorqueData: "",
                        maxConfigData: "",
                        minConfigData: "",
                        violation: ""
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
            this.getTorqueDatas();
        }
    },

    methods: {
        initializeUI() {
            this.ui.default.text = this.$t(`diagnostics.torqueRange.child.torqueRangeChart.defaultTextMessage`);
            this.ui.default.verticalAlign = "center";
            this.ui.default.backgroundColor = this.$style.diagnostics.torqueRangeChartBackgroundColor;
            this.ui.default.fontColor = this.$style.diagnostics.torqueRangeChartFontColor;
            this.ui.default.fontWeight = "lighter";
            this.ui.default.fontSize = 20;
            
            this.ui.toolTip.labelTitle = "Step Number";
            this.ui.toolTip.valueTitle = "Torque";

            this.ui.axis.tickLength = 15; 
            this.ui.axis.tickThickness = 0;
            this.ui.axis.labelFontColor = this.$style.diagnostics.torqueRangeChartAxisLabelFontColor;
            this.ui.axis.labelFontSize = 15;

            this.ui.axis.axisX.lineColor = this.$style.diagnostics.torqueRangeChartAxisXLineColor;

            this.ui.axis.axisY.lineThickness = 0;
            this.ui.axis.axisY.gridDashType = "dash";
            this.ui.axis.axisY.gridColor = this.$style.diagnostics.torqueRangeChartAxisYGridColor;

            this.ui.legend.horizontalAlign = "center";
            this.ui.legend.verticalAlign = "top";
            this.ui.legend.fontSize = 15;
            this.ui.legend.fontColor = this.$style.diagnostics.torqueRangeChartLegendFontColor;
               
            this.ui.dataPoints.type = "line";
            this.ui.dataPoints.lineThickness = 2;
            this.ui.dataPoints.markerBorderThickness = 2;
            this.ui.dataPoints.markerSize = 5;

            this.ui.dataPoints.color.maxTorqueData = this.$style.diagnostics.torqueRangeChartDataPointsColor.maxTorqueData;
            this.ui.dataPoints.color.minTorqueData = this.$style.diagnostics.torqueRangeChartDataPointsColor.minTorqueData;
            this.ui.dataPoints.color.maxConfigData = this.$style.diagnostics.torqueRangeChartDataPointsColor.maxConfigData;
            this.ui.dataPoints.color.minConfigData = this.$style.diagnostics.torqueRangeChartDataPointsColor.minConfigData;
            this.ui.dataPoints.color.violation = this.$style.diagnostics.torqueRangeChartDataPointsColor.violation;
               
        },

        initializeStyle() {
            const chartStyle = document.querySelector("#" + this.chartId);
            chartStyle.style.height = String(this.chartHeight) + "px";
            chartStyle.style.border = "solid 1px " + this.$style.common.cardItemBorderColor;
        },

        getTorqueDatas() {
            if(this.torqueDatas !== null && this.torqueDatas.length > 0) {
                if(this.warningDatas !== null && this.warningDatas.length > 0 && this.warningFlag === true) {
                    this.setChartDatas(this.torqueDatas, this.warningDatas, this.warningFlag);
                }
                else {
                    this.setChartDatas(this.torqueDatas);
                }
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
                    contentFormatter: (e) => {
                        let contentStr = "";
                        contentStr += this.ui.toolTip.labelTitle + ": " + e.entries[0].dataPoint.label + "<br/>";
                        contentStr += this.ui.toolTip.valueTitle + ": " + e.entries[0].dataPoint.y;
                        return contentStr;  
                    }
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

        async setChartDatas(torqueDatas, warningDatas = null, warningFlag = false) {
            let labels = this.setLabels(torqueDatas);
            let tempTorqueDatas = await this.setTorqueDatas(torqueDatas, labels);
            let tempWarningDatas = {maxWaringDatas: [], minWarningDatas: []};
            if(warningDatas !== null && warningFlag === true) {
                tempWarningDatas = await this.setWarningDatas(warningDatas, labels);
                tempTorqueDatas = await this.setViolationValues(labels, tempTorqueDatas, tempWarningDatas.maxWarningDatas, tempWarningDatas.minWarningDatas);
            }
            if(this.datas.chartOptions.data.length === 0) {
                this.datas.chartOptions.data.push(
                    {
                        type: this.ui.dataPoints.type,
                        color: this.ui.dataPoints.color.maxTorqueData,
                        markerBorderThickness: this.ui.dataPoints.markerBorderThickness,
                        markerSize: this.ui.dataPoints.markerSize,
                        mouseover: function(e) {
                            e.chart.toolTip.fontColor = this.ui.dataPoints.color.maxTorqueData;
                        }.bind(this),
                        click: function(e) {
                            this.$emit('selectValueIndex', e.dataPointIndex);
                        }.bind(this),
                        dataPoints: tempTorqueDatas.maxTorqueDatas
                    },
                    {
                        type: this.ui.dataPoints.type,
                        color: this.ui.dataPoints.color.minTorqueData,
                        markerBorderThickness: this.ui.dataPoints.markerBorderThickness,
                        markerSize: this.ui.dataPoints.markerSize,
                        mouseover: function(e) {
                            e.chart.toolTip.fontColor = this.ui.dataPoints.color.minTorqueData;
                        }.bind(this),
                        click: function(e) {
                            this.$emit('selectValueIndex', e.dataPointIndex);
                        }.bind(this),
                        dataPoints: tempTorqueDatas.minTorqueDatas
                    },
                    {
                        type: this.ui.dataPoints.type,
                        color: this.ui.dataPoints.color.maxConfigData,
                        mouseover: function(e) {
                            e.chart.toolTip.fontColor = this.ui.dataPoints.color.maxConfigData;
                        }.bind(this),
                        click: function(e) {
                            this.$emit('selectValueIndex', e.dataPointIndex);
                        }.bind(this),
                        dataPoints: tempWarningDatas.maxWarningDatas
                    },
                    {
                        type: this.ui.dataPoints.type,
                        color: this.ui.dataPoints.color.minConfigData,
                        mouseover: function(e) {
                            e.chart.toolTip.fontColor = this.ui.dataPoints.color.minConfigData;
                        }.bind(this),
                        click: function(e) {
                            this.$emit('selectValueIndex', e.dataPointIndex);
                        }.bind(this),
                        dataPoints: tempWarningDatas.minWarningDatas
                    }
                )
            } 
            else {
                this.datas.chartOptions.data[0].dataPoints = tempTorqueDatas.maxTorqueDatas;
                this.datas.chartOptions.data[1].dataPoints = tempTorqueDatas.minTorqueDatas;
                this.datas.chartOptions.data[2].dataPoints = tempWarningDatas.maxWarningDatas;
                this.datas.chartOptions.data[3].dataPoints = tempWarningDatas.minWarningDatas;
            }
            this.renderChart();
        },

        setLabels(chartDatas) {
            let labels = [];
            chartDatas.forEach(chartData => {
                labels.push(String(chartData.stepno));
            });
            return labels;
        },

        setTorqueDatas(chartDatas, labels) {
            return new Promise((resolve, reject) => {
                try {
                    let maxTorqueDatas = [], minTorqueDatas = [];
                    labels.forEach((label, labelIdx) => {
                        let checkFlag = false;
                        chartDatas.forEach((chartData, chartDataIdx) => {
                            if(label == chartData.stepno) {
                                checkFlag = true;
                                maxTorqueDatas.push({label: label, y: Number(chartData.max)});
                                minTorqueDatas.push({label: label, y: Number(chartData.min)});
                            }
                            if(chartDataIdx == chartDatas.length-1 && checkFlag == false) {
                                maxTorqueDatas.push({label: label, y: undefined});
                                minTorqueDatas.push({label: label, y: undefined});
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

        setMaxTorqueDatas(torqueDatas, labels) {
            let maxTorqueDatas = [];
            labels.forEach((label, index) => {
                maxTorqueDatas.push({label: label, y: Number(torqueDatas[index].max)});
            });
            return maxTorqueDatas;
        },

        setMinTorqueDatas(torqueDatas, labels) {
            let minTorqueDatas = [];
            labels.forEach((label, index) => {
                minTorqueDatas.push({label: label, y: Number(torqueDatas[index].min)});
            });
            return minTorqueDatas;
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
            
        },

        setViolation(torqueDatas, warningDatas) {
            return new Promise((resolve, reject) => {
                try {
                     torqueDatas.forEach(torqueData => {
                        warningDatas.forEach(warningData => {
                            let violation = "";
                            if(torqueData.label == warningData.label) {
                                if(Number(torqueData.y) > Number(warningData.y) || Number(torqueData.y) < Number(warningData.y)) {
                                    violation = this.ui.dataPoints.color.violation;
                                }
                            }
                            torqueData['markerBorderColor'] = violation;
                        })
                    })
                    resolve(torqueDatas);
                }
                catch(error) {
                    reject(error);
                }
            })
        },

        setWarningDatas(warningDatas, labels) {
            return new Promise((resolve, reject) => {
                try {
                    let maxWarningDatas = [], minWarningDatas = [];
                    labels.forEach((label, labelIdx) => {
                        let checkFlag = false;
                        warningDatas[0].stepno.forEach((stepNo, stepNoIdx) => {
                            if(label == stepNo) {
                                checkFlag = true;
                                maxWarningDatas.push({label: label, y: Number(warningDatas[0].max[stepNoIdx])});
                                minWarningDatas.push({label: label, y: Number(warningDatas[0].min[stepNoIdx])});
                            }
                            if(stepNoIdx == warningDatas[0].stepno.length-1 && checkFlag == false) {
                                maxWarningDatas.push({label: label, y: undefined});
                                minWarningDatas.push({label: label, y: undefined});
                            }
                        })
                    })
                    resolve({maxWarningDatas: maxWarningDatas, minWarningDatas: minWarningDatas});
                }
                catch(error) {
                    reject(error);
                }
            })
        },

        setMaxWarningDatas(warningDatas, labels) {
            return new Promise((resolve, reject) => {
                try {
                    let maxWarningDatas = [];
                    labels.forEach((label, index) => {
                        warningDatas[0].stepno.forEach((stepno, waringIndex) => {
                            if(label == stepno) {
                                maxWarningDatas.push({label: label, y: Number(warningDatas[0].max[waringIndex])});
                            }
                        })
                    });
                    resolve(maxWarningDatas);
                }
                catch(error) {
                    reject(error);
                }
            })
        },

        setMinWarningDatas(warningDatas, labels) {
            return new Promise((resolve, reject) => {
                try {
                    let minWarningDatas = [];
                    labels.forEach((label, index) => {
                        warningDatas[0].stepno.forEach((stepno, waringIndex) => {
                            if(label == stepno) {
                                minWarningDatas.push({label: label, y: Number(warningDatas[0].min[waringIndex])});
                            }
                        })
                    
                    });
                    resolve(minWarningDatas);
                }
                catch(error) {
                    reject(error);
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
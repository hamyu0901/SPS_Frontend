<template>
    <div :id="chartId"  v-bind="initialize"></div>
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
                        lineColor: "",
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
                            color: "#"
                        }
                    },
                },
                legend: {
                    horizontalAlign: "",
                    verticalAlign: "", 
                    fontSize: "",
                    fontColor: ""
                },
                dataPoints: {
                    showInLegend: ""
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
            this.ui.default.text = this.$t(`alarmView.child.alarmViewDataMixedChart.defaultTextMessage`);
            this.ui.default.verticalAlign = "center";
            this.ui.default.backgroundColor = this.$style.alarm.alarmViewDataMixedChartBackgroundColor;
            this.ui.default.fontColor = this.$style.alarm.alarmViewDataMixedChartFontColor;
            this.ui.default.fontWeight = "lighter";
            this.ui.default.fontSize = 20;

            this.ui.toolTip.fontSize = 20;

            this.ui.axis.tickLength = 15;
            this.ui.axis.tickThickness = 0;
            this.ui.axis.labelFontColor = this.$style.alarm.alarmViewDataMixedChartAxisLabelFontColor;
            this.ui.axis.labelFontSize = 15;

            this.ui.axis.axisX.lineColor = this.$style.alarm.alarmViewDataMixedChartAxisXLineColor;

            this.ui.axis.axisY.lineThickness = 0;
            this.ui.axis.axisY.gridDashType = "dash";
            this.ui.axis.axisY.gridColor = this.$style.alarm.alarmViewDataMixedChartAxisYGridColor;
            
            this.ui.axis.axisY.axisY1.type = "column";
            this.ui.axis.axisY.axisY1.name = this.$t(`home.child.alarmChart.count`);
            this.ui.axis.axisY.axisY1.axisYType = "primary";
            this.ui.axis.axisY.axisY1.color = this.$style.alarm.alarmViewDataMixedChartAxisY1Color;

            this.ui.axis.axisY.axisY2.type = "line";
            this.ui.axis.axisY.axisY2.name = this.$t(`home.child.alarmChart.deadtime`);
            this.ui.axis.axisY.axisY2.axisYType = "secondary";
            this.ui.axis.axisY.axisY2.color = this.$style.alarm.alarmViewDataMixedChartAxisY2Color;
            
            this.ui.legend.horizontalAlign = "center";
            this.ui.legend.verticalAlign = "top";
            this.ui.legend.fontSize = 15;
            this.ui.legend.fontColor = this.$style.alarm.alarmViewDataMixedChartLegendFontColor;

            this.ui.dataPoints.showInLegend = true;
        },

        initializeStyle() {
            const chartStyle = document.querySelector("#"+this.chartId);
            chartStyle.style.height = String(this.chartHeight) + "px";
        },

        initChartDatas() {
            this.datas.chartOptions.data = [];
            this.renderChart();
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
                        showInLegend: this.ui.dataPoints.showInLegend,
                        dataPoints: countDatas
                    },
                    {
                        type: this.ui.axis.axisY.axisY2.type,
                        name: this.ui.axis.axisY.axisY2.name,
                        axisYType: this.ui.axis.axisY.axisY2.axisYType,
                        color: this.ui.axis.axisY.axisY2.color,
                        showInLegend: this.ui.dataPoints.showInLegend,
                        dataPoints: deadTimeDatas
                    }
                )
            }
            else {
                this.datas.chartOptions.data[0].dataPoints = countDatas;
                this.datas.chartOptions.data[1].dataPoints = deadTimeDatas;
            }
            this.renderChart();
        },

        setLabelDatas(chartDatas) {
            let selectedDate = new Date(chartDatas[chartDatas.length-1].time_stamp.split('T')[0]);
            let year = selectedDate.getFullYear();
            let month = selectedDate.getMonth();
            let date = selectedDate.getDate();
            let weekDate = [];

            for(let i=0; i<7; i++) {
            let resultDay = new Date(year, month, date-i);
            let yyyy = resultDay.getFullYear();
            let mm = Number(resultDay.getMonth()) + 1;
            let dd = resultDay.getDate();
            
            mm = String(mm).length === 1 ? '0' + mm : mm;
            dd = String(dd).length === 1 ? '0' + dd : dd;
            
            weekDate[i] = yyyy + '-' + mm + '-' + dd;
            }
            
            return weekDate.reverse();
        },

        setCountDatas(chartDatas, labels) {
            let countDatas = [];
            labels.forEach((label, index) => {
                if(chartDatas[index] !== undefined && chartDatas[index].hasOwnProperty('time_stamp')) {
                    countDatas.push(
                        {label: label, y: Number(chartDatas[index].count)}
                    );
                } 
                else {
                    countDatas.push(
                        {label: label, y: 0}
                    );
                }
            });
            return countDatas;
        },

        setDeadTimeDatas(chartDatas, labels) {
            let deadTimeDatas = [];
            labels.forEach((label, index) => {
                if(chartDatas[index] !== undefined && chartDatas[index].hasOwnProperty('time_stamp')) {
                    deadTimeDatas.push(
                        {label: label, y: Number(chartDatas[index].deadtime)}
                    );
                } 
                else {
                    deadTimeDatas.push(
                        {label: label, y: 0}
                    );
                }
            });
            return deadTimeDatas;
        }
        
    }
}
</script>

<style lang="scss" scoped>
    
</style>

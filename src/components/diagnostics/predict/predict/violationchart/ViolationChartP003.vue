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
                indexLabel: {
                    fontColor: "",
                    placement: ""
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
                    color: {
                        sumData: "",
                        addData: "",
                    },
                    name: {
                        sumData: "",
                        addData: ""
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
        this.initChartOptions()
    },

    mounted() {
        this.initializeStyle()
    },

    computed: {
        initialize() {
            this.getChartDatas();
        }
    },

    methods: {
        initializeUI() {
            this.ui.default.text = this.$t(`diagnostics.predict.child.violationChart.defaultTextMessage.p003`);
            this.ui.default.verticalAlign = "center";
            this.ui.default.backgroundColor = this.$style.diagnostics.p003ViolationChartBackgroundColor;
            this.ui.default.fontColor = this.$style.diagnostics.p003ViolationChartFontColor;
            this.ui.default.fontWeight = "lighter";
            this.ui.default.fontSize = 20;

            this.ui.toolTip.fontSize = 20;

            this.ui.axis.tickLength = 15;
            this.ui.axis.tickThickness = 0;
            this.ui.axis.labelFontColor = this.$style.diagnostics.p003ViolationChartAxisLabelFontColor;
            this.ui.axis.labelFontSize = 15;

            this.ui.axis.axisX.lineColor = this.$style.diagnostics.p003ViolationChartAxisXLineColor;

            this.ui.axis.axisY.lineThickness = 0;
            this.ui.axis.axisY.gridDashType = "dash";
            this.ui.axis.axisY.gridColor = this.$style.diagnostics.p003ViolationChartAxisYGridColor;

            this.ui.indexLabel.fontColor = this.$style.diagnostics.p003ViolationChartIndexLabelFontColor;
            this.ui.indexLabel.placement = "outside";

            this.ui.legend.horizontalAlign = "center";
            this.ui.legend.verticalAlign = "top";
            this.ui.legend.fontSize = 15;
            this.ui.legend.fontColor = this.$style.diagnostics.p003ViolationChartLegendFontColor;
              
            this.ui.dataPoints.type = "stackedColumn";
            this.ui.dataPoints.lineThickness = 2;
            this.ui.dataPoints.color.sumData = this.$style.diagnostics.p003ViolationChartDataPointsColors.sumData;
            this.ui.dataPoints.color.addData = this.$style.diagnostics.p003ViolationChartDataPointsColors.addData;
            this.ui.dataPoints.name.sumData = this.$t(`diagnostics.predict.child.violationChart.standardTorqueWeekAverageValue`);
            this.ui.dataPoints.name.addData =this.$t(`diagnostics.predict.child.violationChart.addTorqueWeekAverageValue`);

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
            let addDatas = this.setAddDatas(chartDatas, labels);
            let sumDatas = this.setSumDatas(addDatas, chartDatas, labels);

            if(this.datas.chartOptions.data.length === 0) {
                this.datas.chartOptions.data.push(
                    {
                        type: this.ui.dataPoints.type,
                        showInLegend: true,
                        color: this.ui.dataPoints.color.sumData,
                        name: this.ui.dataPoints.name.sumData,
                        dataPoints: sumDatas
                    },
                    {
                        type: this.ui.dataPoints.type,
                        showInLegend: true,
                        indexLabelFontColor: this.ui.indexLabel.fontColor,
                        indexLabelPlacement: this.ui.indexLabel.placement,
                        indexLabelFormatter: function (e) {
                            return e.total;
                        },
                        color: this.ui.dataPoints.color.addData,
                        name: this.ui.dataPoints.name.addData,
                        dataPoints: addDatas
                    }
                )   
            }
            this.renderChart();
        },
        
        setLabels(chartDatas) {
            let labels = [];
            let currentDate = chartDatas[0].time_stamp.split('T')[0] + '~' + chartDatas[0].end_time.split('T')[0];
            labels.push(this.$t(`diagnostics.predict.child.violationChart.weeksAgo2`)); // 2 주전
            labels.push(this.$t(`diagnostics.predict.child.violationChart.weeksAgo1`)); // 1 주전
            labels.push(currentDate);
            return labels;
        },

        setAddDatas(chartDatas, labels) {
           let addDatas = [];
           labels.forEach((label, index) => {
                let addData = 0;
                if(index !== 0) {
                    addData = chartDatas[0].motor_torque_min[index] - chartDatas[0].motor_torque_min[index-1];
                }
                addDatas.push({label: label, y: addData});
           });
           return addDatas;
        },

        setSumDatas(addDatas, chartDatas, labels) {
            let sumDatas = [];
            labels.forEach((label, index) => {
                let sumData = chartDatas[0].motor_torque_min[index] - addDatas[index].y;
                sumDatas.push({label: label, y: sumData});
            });
            return sumDatas;
        }

    }  
}
</script>

<style lang="scss" scoped>

</style>
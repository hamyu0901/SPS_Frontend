<template>
    <div :id="chartId" v-bind="getBindDatas"></div>
</template>

<script>
export default {
    props: ['chartId', 'torqueValueLegends', 'warningValueLegends', 'chartDatas'],
    data() {
        return {
            ui: {
               
            },
            datas: {
                valueLabel: "",
                chartOptions: {},
                chartDatas: [],
                torqueValueLegends: [],
                warningValueLegends: [],
                chart: null
            }
        }
    },

    created() {
        this.initChartOptions();
    },

    mounted() {
        this.initializeStyle();
        this.renderChart();
    },

    computed: {
        getBindDatas() {
            this.getTorqueValueLegends();
            this.getWarningValueLegends();
        },

    },

    watch: {
        chartDatas: {
            deep: true,
            handler(chartDatas) {
                if(chartDatas.length > 0) {
                    this.datas.chartDatas = chartDatas;
                    this.setChartDatas(this.datas.chartDatas);
                }
                else {
                    this.initChartDatas();
                }
            }
        }
    },

    methods: {
        initializeStyle() {
            const chartStyle = document.querySelector("#"+this.chartId);
            chartStyle.style.width = "100%";
            chartStyle.style.height = "480px";
            chartStyle.style.border = "1px solid #575f7d";
        },

        initTorqueValueLegends() {
            this.datas.torqueValueLegends = [];
        },

        initWarningValueLegends() {
            this.datas.warningValueLegends = [];
        },

        initChartDatas() {
            this.datas.chartDatas = [];
            this.datas.chartOptions.data = [];
            this.renderChart();
        },

        getTorqueValueLegends() {
            if(this.torqueValueLegends.length > 0) {
                this.datas.torqueValueLegends = this.torqueValueLegends;
            }
            else {
                this.initTorqueValueLegends();
            }
        },

        getWarningValueLegends() {
            if(this.warningValueLegends.length > 0) {
                this.datas.warningValueLegends = this.warningValueLegends;
            }
            else {
                this.initWarningValueLegends();
            }
        },

        initChartOptions() {
            this.datas.chartOptions = {
                axisX: {
                    tickLength: 15,
                    tickThickness: 0,
                    labelFontColor: this.$style.getTitleStyle().color,
                    lineColor: "#575f7d",
                    labelFontColor: "#575f7d",
                    labelFontSize: 15,
                    labelWrap: false,
                    labelAutoFit: false,
                },
                axisY: {
                    tickLength: 15,
                    tickThickness: 0,
                    labelFontColor: this.$style.getTitleStyle().color,
                    lineThickness: 0,
                    gridDashType: "dash",
                    gridColor: "#575f7d",
                    labelFontColor: "#575f7d",
                    labelFontSize: 15,
                },
                legend: {
                    verticalAlign: "top",  // top, center, bottom
                    fontColor: "white"
                },
                backgroundColor:this.$style.getHomeAlarmEventChartBackGroundColorStyle(),
                data: []
            }
        },

        renderChart() {
            const chart = new this.$chart.Chart(this.chartId, this.datas.chartOptions);
            chart.render();
        },

        setChartDatas(chartDatas) {
            if(this.datas.chartOptions.data.length <= 0) {
                chartDatas.forEach((chartData, index) => {
                    this.datas.chartOptions.data.push({
                        type: "line",
                        xValueType: "dateTime",
                        showInLegend: this.getShowInLegend(chartData.id),
                        visible: this.getVisible(chartData.id),
                        lineThickness: 2,
                        markerBorderThickness: 2,
                        color: this.getColor(chartData.id),
                        name: this.getName(chartData.id),
                        dataPoints: chartData.data
                    })
                })
            }
            this.renderChart();
        },

        getShowInLegend(id) {
            let visible = null;
            this.datas.torqueValueLegends.forEach(torqueValueLegend => {
                if(torqueValueLegend.id === id) {
                   visible = torqueValueLegend.visible;
                }
            })
            this.datas.warningValueLegends.forEach(warningValueLegend => {
                if(warningValueLegend.id === id) {
                   visible = warningValueLegend.visible;
                }
            })
            return visible;
        },

        getVisible(id) {
            let visible = null;
            this.datas.torqueValueLegends.forEach(torqueValueLegend => {
                if(torqueValueLegend.id === id) {
                   visible = torqueValueLegend.visible;
                }
            })
            this.datas.warningValueLegends.forEach(warningValueLegend => {
                if(warningValueLegend.id === id) {
                    visible = warningValueLegend.visible;
                }
            })
            return visible;
        },

        getColor(id) {
            let color = "";
            this.datas.torqueValueLegends.forEach(torqueValueLegend => {
                if(torqueValueLegend.id === id) {
                    color = torqueValueLegend.color;
                }
            })
            this.datas.warningValueLegends.forEach(warningValueLegend => {
                if(warningValueLegend.id === id) {
                    color = warningValueLegend.color;
                }
            })
            return color;
        },

        getName(id) {
            let legend = "";
            this.datas.torqueValueLegends.forEach(torqueValueLegend => {
                if(torqueValueLegend.id === id) {
                    legend = torqueValueLegend.legend;
                }
            })
            this.datas.warningValueLegends.forEach(warningValueLegend => {
                if(warningValueLegend.id === id) {
                    legend = warningValueLegend.legend;
                }
            })
            return legend;
        }
       
    }

}
</script>

<style>

</style>
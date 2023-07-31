<template>
    <div :id="chartId"></div>
</template>

<script>
export default {
    props: ['chartId'],
    data() {
        return {
            ui: {

            },
            datas: {
                chartOptions: {}
            }
        }
    },

    created() {
        this.initChartOptions();
    },

    mounted() {
        this.initChart();
    },

    computed: {

    },

    methods: {
        initChartOptions() {
            this.datas.chartOptions = {
                title: {
                    text: "RealTime Torque Datas",
                    fontSize: 30,
                    fontColor: this.$style.getTitleStyle().color,
                    horizontalAlign: "left"
                },
                axisX: {
                    tickLength: 15,
                    tickThickness: 0,
                    labelFontColor: this.$style.getTitleStyle().color,
                    lineColor: "white"
                },
                axisY: {
                    tickLength: 15,
                    tickThickness: 0,
                    labelFontColor: this.$style.getTitleStyle().color,
                    lineThickness: 0,
                    lineColor: "white",
                    gridDashType: "dash",
                    gridColor: "white"
                },
                backgroundColor:this.$style.getHomeAlarmEventChartBackGroundColorStyle(),
                data: [
                    {   
                        type: "line", 
                        dataPoints: []
                    }
                ]
            }
        },

        initChart() {
            const chart = new this.$chart.Chart(this.chartId, this.datas.chartOptions);
        }
    }

}
</script>

<style>

</style>
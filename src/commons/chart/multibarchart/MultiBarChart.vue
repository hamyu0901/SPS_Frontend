<template>
    <v-layout :class="['multi-bar-chart-container']">
        <div v-if="datas.chartItems.length > 0" :id="chartId" style="height: 100%; width: 100%;" />
        <v-layout column v-show="datas.chartItems.length === 0" :class="['multi-bar-chart-container-empty']">
            <p>{{datas.emptyTitle}}</p>
        </v-layout>
    </v-layout>
</template>

<script>
import {isEmpty} from "lodash";
const chartXType = {
    time: 'time',
    step: 'step'
}
export default {
    props: {
        chartId: {
            type: String,
            required: true
        },
        chartXType: {
            type: String,
            default: 'step'
        },
        chartItems: {
            type: Array,
            required: true,
            default() {
                return [];
            }
        },
        valueType: {
            type: String,
            default() {
                return 'torque'
            }
        },
        title: {
            type: String
        },
        axisYTitle: {
            type: String
        },
        bgColor: {
            type: String,
        },
    },
    data: (vm) => ({
        datas: {
            chart: null,
            emptyTitle: vm.$t(`common.chart.title.empty`),
            chartItems: [],
            colorItems: {
                torque: ['#2195F3', '#ABB62D', '#C0504E', '#38C5B2', '#F79647', '#7F6084', '#FCBE2D'],
                accum: ['#264FCE', '#03B7FA'],
                temperature: ['#ED551F', '#F8C96C']
            },
            options: {
                backgroundColor: '#2B2B47',
                animationEnabled: true,
                title: {
                    text: vm.title ? vm.title : '',
                    verticalAlign: 'bottom',
                    fontColor: '#FFFFFF',
                    fontSize: 18,
                },
                legend: {
                    verticalAlign: 'top',
                    fontSize: 14,
                    fontColor: '#FFFFFF',
                    cursor: 'pointer',
                    itemclick: function(e) {
                        e.dataSeries.visible = (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible ) ? false : true;
                        e.chart.render();
                    }
                },
                axisX: {
                    valueFormatString: vm.chartXType === chartXType.time ? 'MM-DD HH:mm:ss' : '#',
                    labelFontColor: '#FFFFFF',
                    lineColor: '#4F5070',
                    gridThickness: 0,
                    tickThickness: 0,
                    labelAngle: 0,
                },
                axisY: {
                    title: (vm.valueType === 'torque' || vm.valueType === 'accum') ? vm.$t('diagnostics.predict.main.predictLineChart.axisYTitle.torque'): vm.$t('diagnostics.predict.main.predictLineChart.axisYTitle.temperature'),
                    titleFontColor: '#FFFFFF',
                    labelFontColor: '#FFFFFF',
                    lineColor: '#4F5070',
                    gridThickness: 1,
                    gridColor: '#4F5070',
                    tickThickness: 0,
                },
                data: []
            }
        }
    }),

    created() {
    },

    mounted() {
    },

    destroyed() {
    },

    watch: {
        chartItems: {
            immediate: true,
            handler(val) {
                this.datas.chartItems = isEmpty(val) ? [] : val;
                this.datas.chartItems.length === 0 ? this.destroyChart() : this.setChart(this.datas.chartItems);
            }
        }
    },

    computed: {},

    methods: {
        renderChart() {
            this.$nextTick(() => {
                this.datas.chart = new this.$chart.Chart(this.chartId, this.datas.options);
                this.datas.chart.render();
            })
        },

        destroyChart() {
            this.$nextTick(() => {
                if( this.datas.chart !== null ) {
                    this.datas.chart.destroy();
                    this.datas.chart = null;
                }
            })
        },
        setChart(chartItems) {
            /**
             [ { name, items } ]
             items: x, y,
             * */
            this.datas.options.backgroundColor = this.bgColor ? this.bgColor : this.datas.options.backgroundColor;
            this.datas.options.axisY.title = this.axisYTitle ? this.axisYTitle : this.datas.options.axisY.title;
            this.datas.options.data = [];
            chartItems.forEach((chartItem, index) => {
                this.datas.options.data.push(
                    {
                        type: "column",
                        name: chartItem.name,
                        showInLegend: true,
                        legendText: chartItem.name,
                        color: chartItem.color ? chartItem.color : this.datas.colorItems[this.valueType][index],
                        dataPoints: chartItem.items
                    }
                )
            })
            this.renderChart();
        }
    }
}
</script>

<style scoped lang='scss'>
@import 'MultiBarChart';
</style>

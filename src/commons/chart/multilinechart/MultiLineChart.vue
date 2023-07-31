<template>
    <v-layout :class="['multi-line-chart-container']">
        <div v-if="datas.chartItems.length > 0" :id="chartId" style="height: auto; width: 100%;" />
        <v-layout column v-show="datas.chartItems.length === 0" :class="['multi-line-chart-container-empty']">
            <p>{{datas.emptyTitle}}</p>
        </v-layout>
    </v-layout>
</template>

<script>
import { isEmpty } from "lodash";
const chartXType = {
    time: 'time',
    step: 'step'
}
const chartStripLineType = {
    single: 'single',
    multiple: 'multiple'
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
        chartTitle: {
            type: String
        },
        chartSubTitle: {
            type: String
        },
        chartStripLineType: {
            type: String,
            default: 'single'
        },
        chartStripLines: {
            type: Number,
            default: 0
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
        axisYTitle: {
            type: String,
        }
    },
    data: (vm) => ({
        datas: {
            chart: null,
            emptyTitle: vm.$t(`common.chart.title.empty`),
            chartItems: [],
            colorItems: {
                torque: ['#2195F3', '#ABB62D', '#C0504E', '#38C5B2', '#F79647', '#7F6084', '#FCBE2D'],
                accum: ['#2195F3', '#ABB62D', '#C0504E', '#38C5B2', '#F79647', '#7F6084', '#FCBE2D'],
                temperature: ['#2195F3', '#ABB62D', '#C0504E', '#38C5B2', '#F79647', '#7F6084', '#FCBE2D'],
                atomizer: ['#2195F3', '#FFA800', '#F25855'],
                'atomizer-type': ['#2195F3', '#28CC97']
            },
            options: {
                backgroundColor: '#2B2B47',
                animationEnabled: true,
                zoomEnabled: true,
                title: vm.chartTitle ? { text: vm.chartTitle, fontColor: '#FFFFFF', fontSize: 24 } : null,
                subtitles: vm.chartSubTitle ? [{ text: vm.chartSubTitle, fontColor: '#FFFFFF', fontSize: 18 }] : null,
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
                    crosshair: {
                        enabled: true,
                        color: "#FFFFFF",
                        labelFontColor: '#FFFFFF'
                    },
                    stripLines: null
                },
                axisY: {
                    title: vm.axisYTitle ? vm.axisYTitle + '(%)' : vm.setAxisYTitle(vm.valueType),
                    titleFontColor: '#FFFFFF',
                    labelFontColor: '#FFFFFF',
                    lineColor: '#4F5070',
                    gridThickness: 1,
                    gridColor: '#4F5070',
                    interval: vm.valueType === 'atomizer-type' ? 10 : null,
                    minimum: vm.valueType === 'atomizer-type' ? -40 : null,
                    maximum: vm.valueType === 'atomizer-type' ? 40 : null,
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
        chartStripLines: {
            immediate: true,
            handler(val) {
               this.datas.options.axisX.stripLines = this.setAxisXStripLines(val);
            }
        },
        chartItems: {
            immediate: true,
            handler(val) {
                this.datas.chartItems = isEmpty(val) ? [] : val;
                this.datas.chartItems.length === 0 ? this.destroyChart() : this.setChart(this.datas.chartItems);
            }
        },
    },

    computed: {
    },

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

        setAxisYTitle(valueType) {
            return (valueType === 'torque' || valueType === 'accum') ? this.$t('diagnostics.predict.main.predictLineChart.axisYTitle.torque') :
                (valueType === 'temperature' ? this.$t('diagnostics.predict.main.predictLineChart.axisYTitle.temperature') : (valueType === 'atomizer') ? '' : (valueType === 'atomizer-type' ? '' : valueType))
        },

        setAxisXStripLines(stripLine) {
            return this.chartStripLineType === chartStripLineType.single ? [
                {   value: stripLine,
                    label: stripLine,
                    color: '#FF3737',
                    showOnTop: true,
                    labelPlacement: 'outside',
                    labelBackgroundColor: '#2B2B47',
                    labelFontColor: '#FF3737',
                    labelFontWeight: 'bold',
                    labelMaxWidth: 100
                }
            ] : [
                {
                    startValue: stripLine - 10,
                    endValue: stripLine + 10,
                    color: '#4F5070',
                    showOnTop: false,
                    label: 'ALARM OCCURRENCE',
                    labelPlacement: 'outside',
                    labelBackgroundColor: '#2B2B47',
                    labelFontColor: '#FF3737',
                    labelFontWeight: 'bold',
                    labelMaxWidth: 100
                }
            ];
        },

        setChart(chartItems) {
            /**
             [ { name, items } ]
             items: x( or label), y,
             * */``
            this.datas.options.data = [];
            chartItems.forEach((chartItem, index) => {
                this.datas.options.data.push(
                    {
                        type: 'line',
                        lineDashType: chartItem.color ? "dot": "solid",
                        markerType: (chartItem.items && chartItem.items.length > 1) ? "none" : "circle",
                        connectNullData: true,
                        showInLegend: true,
                        name: chartItem.name,
                        color:( chartItem.color && chartItem.color !== null ) ? chartItem.color : this.datas.colorItems[this.valueType][this.valueType === 'atomizer-type' ? index / 2 : index],
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
    @import 'MultiLineChart';
</style>
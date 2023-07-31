<template>
    <v-layout :class="['mix-chart-container']" column>
        <div v-if="datas.chartItems.length > 0" :id="chartId" style="height: 100%; width: 100%;" />
        <v-layout column v-show="datas.chartItems.length === 0" :class="['mix-chart-container-empty']">
            <p>{{datas.emptyTitle}}</p>
        </v-layout>
        <slot/>
    </v-layout>
</template>

<script>
import {isEmpty} from "lodash";
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
        /** 차트 아이디 */
        chartId: {
            type: String,
            required: true
        },
        /** 차트 x축 타입 */
        chartXType: {
            type: String,
            default: 'step'
        },
        /** 차트 타이틀 */
        chartTitle: {
            type: String
        },
        /** 차트 서브 타이틀 */
        chartSubTitle: {
            type: String
        },
        /** 차트 strip line 타입 */
        chartStripLineType: {
            type: String,
            default: 'single'
        },
        /** 차트 Strip line 값 */
        chartStripLines: {
            type: Number,
            default: 0
        },
        /** 차트 아이템 */
        chartItems: {
            type: Array,
            required: true,
            default() {
                return [];
            }
        },
        /** 값 타입 */
        valueType: {
            type: String,
            default() {
                return 'torque'
            }
        },
        animationType: {
            type: Boolean
        },
        bgColor: {
            type: String,
        },
        /** 차트 Y축 아이템 */
        chartAxisYOptions: {
            type: Object,
        },
        /** 차트 X축 아이템 */
        chartAxisXOptions: {
            type: Object
        },
        /** 차트 Y2축 아이템 */
        chartAxisY2Options: {
            type: Object,
        },
        /** 차트 legend 아이템 */
        chartLegendOptions: {
            type: Object
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
                production: ['#F25855', '#FF8A00', '#FFD600', '#28CC97', '#0088F7', '#F7C6FF', '#B13FC3','#6687ED', '#A25D5D', '#D9D9D9', '#8308FF', '#AC3962', '#3403FA', '#00FF66', '#DBFF00'],
                'atomizer-type': ['#2195F3', '#28CC97']
            },
            options: {
                backgroundColor: vm.bgColor ? vm.bgColor : '#2B2B47',
                animationEnabled: vm.animationType ? false : true,
                zoomEnabled: true,
                title: vm.chartTitle ? { text: vm.chartTitle, fontColor: '#FFFFFF', fontSize: 24 } : null,
                subtitles: vm.chartSubTitle ? [{ text: vm.chartSubTitle, fontColor: '#FFFFFF', fontSize: 18 }] : null,
                legend: {},
                axisX: {},
                axisY: [],
                axisY2: [],
                dataPointMaxWidth: 50,
                data: []
            }
        }
    }),

    created() {
    },

    mounted() {
        this.setChartAxisYOptions();
        this.setChartAxisXOptions();
        this.setChartAxisY2Options();
        this.setChartLegendOptions();
    },

    destroyed() {
    },

    watch: {
        chartStripLines: {
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
    computed: {},

    methods: {
        renderChart() {
            this.$nextTick(() => {
                this.datas.chart = new this.$chart.Chart(this.chartId, this.datas.options);
                this.datas.chart.render();
            })
        },

        setChartAxisYOptions() {
            const defaultOptions = {
                title: this.chartAxisYOptions && this.chartAxisYOptions.title ? this.chartAxisYOptions.title : 'VALUE(%)',
                titleFontColor: '#FFFFFF',
                titleFontSize: 18,
                labelFontColor: '#3682DC',
                lineColor: '#4F5070',
                gridThickness: 1,
                gridColor: '#4F5070',
                interval: this.valueType === 'atomizer-type' ? 10 : null,
                minimum: this.valueType === 'atomizer-type' ? -40 : null,
                maximum: this.valueType === 'atomizer-type' ? 40 : null,
                tickThickness: 0,
            }
            if (this.chartAxisYOptions) {
                this.datas.options.axisY = [{
                    ...defaultOptions,
                    ...this.chartAxisYOptions,
                }];
            } else {
                this.datas.options.axisY = [defaultOptions];
            }
        },

        setChartAxisXOptions() {
            const defaultOptions = {
                valueFormatString: this.chartXType === chartXType.time ? 'MM-DD HH:mm:ss' : '#',
                labelFontColor: '#FFFFFF',
                labelFontSize: 15,
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
            }
            if (this.chartAxisXOptions) {
                this.datas.options.axisX = {
                    ...defaultOptions,
                    ...this.chartAxisXOptions,
                };
            } else {
                this.datas.options.axisX = defaultOptions;
            }
        },

        setChartAxisY2Options() {
            const defaultOptions = {
                title: this.chartAxisY2Options && this.chartAxisY2Options.title ? this.chartAxisY2Options.title : this.$t('diagnostics.predict.main.predictLineChart.axisY2Title.alarmCount'),
                titleFontColor: '#FFFFFF',
                labelFontColor: '#6D71D2',
                titleFontSize: 18,
                labelFontSize: 15
            }
            if (this.chartAxisY2Options) {
                this.datas.options.axisY2 = [{
                    ...defaultOptions,
                    ...this.chartAxisY2Options,
                }];
            } else {
                this.datas.options.axisY2 = [defaultOptions];
            }
        },

        setChartLegendOptions() {
            const defaultOptions = {
                verticalAlign: 'top',
                fontSize: 15,
                fontColor: '#FFFFFF',
                cursor: 'pointer',
                itemclick: function(e) {
                    e.dataSeries.visible = (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible ) ? false : true;
                    e.chart.render();
                }
            }
            if (this.chartLegendOptions) {
                this.datas.options.legend = {
                    ...defaultOptions,
                    ...this.chartLegendOptions,
                };
            } else {
                this.datas.options.legend = defaultOptions;
            }
        },

        destroyChart() {
            this.$nextTick(() => {
                if( this.datas.chart !== null ) {
                    this.datas.chart.destroy();
                    this.datas.chart = null;
                }
            })
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

        setMarkerType(chartItem) {
            return (chartItem.items && (chartItem.items.length > 1 && chartItem.items.filter(item => item.y !== null).length !== 1)) ? "none" : "circle";
        },

        setChart(chartItems) {
            /**
             [ { name, items } ]
             items: x( or label), y,
             * */
            this.datas.options.data = [];
            chartItems.forEach((chartItem, index) => {
                this.datas.options.data.unshift(
                    {
                        type: chartItem.type ? "column" : "line",
                        axisYType: chartItem.type ? 'secondary' : 'primary',
                        lineDashType: chartItem.color ? "dot": "solid",
                        markerType: this.setMarkerType(chartItem),
                        fillOpacity: chartItem.fillOpacity ? chartItem.fillOpacity : 1,
                        connectNullData: true,
                        nullDataLineDashType:  "dot",
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
    @import 'MixChart';
</style>
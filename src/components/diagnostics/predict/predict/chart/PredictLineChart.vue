<template>
    <div :id="chartId" :class="['predict-line-chart']" style="{ width: 100% }" />
</template>

<script>
import {isEmpty} from "lodash";

export default {
    props: {
        /** 타이틀 */
        chartTitle: {
            type: String,
            default() {
                return 'Predict Detail Chart'
            }
        },
        /** 차트 아이디 */
        chartId: {
            type: String,
            required: true
        },
        chartSubTitle: {
            type: String
        },
        /** 차트 아이템 목록 */
        chartItems: {
            type: Object,
            required: true
        },
        /** value 타입 */
        valueType: {
            type: String,
            default() {
                return 'torque'
            }
        }
    },
    data: (vm) =>  ({
        datas: {
            // [TODO]: 디자인 반영 완료 시, 주석으로 정리 예정
            chart: null,
            options: {
                backgroundColor: '#2B2B47',
                animationEnabled: true,
                toolTop: {
                    fontSize: ''
                },
                title: vm.chartTitle ? { text: vm.chartTitle, fontColor: '#FFFFFF', fontSize: 24 } : null,
                subtitles: vm.chartSubTitle ? [{ text: vm.chartSubTitle, fontColor: '#FFFFFF', fontSize: 18 }] : null,
                legend: {
                    verticalAlign: 'top',
                    fontSize: 14,
                    fontColor: '#FFFFFF',
                    cursor: 'pointer',
                    itemclick: function(e) {
                        console.log(e);
                        e.dataSeries.visible = (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible ) ? false : true;
                        e.chart.render();
                    }
                },
                axisX: {
                    valueFormatString: 'MM/DD',
                    labelFontColor: '#FFFFFF',
                    lineColor: '#4F5070',
                    gridThickness: 0,
                    tickThickness: 0,
                    labelAngle: 0,
                    crosshair: {
                        enabled: true,
                        color: "#FFFFFF",
                        labelFontColor: '#FFFFFF'
                    }
                },
                axisY: {
                    title: vm.valueType === 'torque'? vm.$t('diagnostics.predict.main.predictLineChart.axisYTitle.torque'): vm.$t('diagnostics.predict.main.predictLineChart.axisYTitle.temperature'),
                    titleFontColor: '#FFFFFF',
                    labelFontColor: '#FFFFFF',
                    lineColor: '#4F5070',
                    gridThickness: 1,
                    gridColor: '#4F5070',
                    tickThickness: 0,
                    stripLines: []
                },
                data: []
            },
            locale: {
                config: vm.$t('diagnostics.predict.main.predictLineChart.config'),
                value: vm.$t('diagnostics.predict.main.predictLineChart.value')
            }
        }
    }),

    created() {
        this.chartItems && this.setChart(this.chartItems);
    },

    mounted() {
    },

    destroyed() {

    },

    watch: {
        chartItems: {
            immediate: true,
            handler(val) {
                isEmpty(val)? this.destroyChart : this.setChart(val);
                this.datas.options.axisY.stripLines = ( !isEmpty(val.configs) && !isEmpty(val.items) && val.configs.length === 1, val.items.length === 1 ) ?
                    [
                        {
                            color:"#F14B27",
                            labelFontColor:"#F14B27",
                            value: val.configs[0].y
                        },
                        {
                            color:"#2DB67C",
                            labelFontColor:"#2DB67C",
                            value:val.items[0].y
                        }
                    ] :
                    []
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
            this.datas.options.data = [];
            this.datas.options.data.push(
                {
                    type: 'line',
                    xValueType: "dateTime",
                    lineDashType: "dot",
                    markerType: "none",
                    xValueFormatString: `[${this.datas.locale.config} - MM-DD HH:mm:ss] `,
                    showInLegend: true,
                    name: 'config',
                    color: '#F14B27',
                    dataPoints: chartItems.configs
                },
                {
                    type: 'line',
                    xValueType: "dateTime",
                    markerType: "none",
                    xValueFormatString: `[${this.datas.locale.value} - MM-DD HH:mm:ss] `,
                    showInLegend: true,
                    name: 'value',
                    color: '#2DB67C',
                    dataPoints: chartItems.items
                }
            )
            this.renderChart();
        }
    }
}
</script>

<style scoped lang='scss'>
    @import './PredictLineChart';
</style>
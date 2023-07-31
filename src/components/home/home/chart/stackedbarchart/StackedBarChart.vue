<template>
    <v-layout :class="['stacked-bar-chart-container']" column>
        <p>{{title}}</p>
        <div v-if="chartItems.length > 0" :id="chartId" style="height: 100%; width: 100%;" />
        <v-layout v-if="chartItems.length === 0" :class="['stacked-bar-chart-container-empty']" column>
            <v-img :class="['stacked-bar-chart-container-empty-image']" :src="datas.emptyItem.emptyImg" contain :height="datas.emptyItem.height" :width="datas.emptyItem.width"/>
            <p>{{datas.emptyItem.emptyText}}</p>
        </v-layout>
    </v-layout>
</template>

<script>
import {isEmpty} from "lodash";

export default {
    props: {
        /** 타이틀 */
        title: {
            type: String,
            default() {
                return 'Stacked Bar Chart'
            }
        },
        /** 차트 아이디 */
        chartId: {
            type: String,
            required: true
        },
        /** 차트 아이템 목록 */
        chartItems: {
            type: Array,
            required: true
        },
    },
    data: (vm) => ({
        datas: {
            options: {
                backgroundColor: '#222a3e',
                animationEnabled: true,
                toolTip: {
                    shared: true
                },
                axisX: {
                    labelFontColor: '#ffffff',
                    labelFontSize: 16,
                    tickThickness: 0,
                    labelAutoFit: false,
                    labelMaxWidth: 1000,
                    interval: 1,
                    labelFormatter: function ( e ) {
                        return e.label !== null ? e.label : ''
                    },
                },
                legend: {
                    fontColor: '#ffffff',
                    fontSize: 16
                },
                axisY: {
                    labelFontColor: '#ffffff',
                    gridColor: '#545353',
                },
                data: []
            },
            chartColorItems: ['#159B98', '#95D0B6', '#1ABC78', '#ABEE80'],
            emptyItem: {
                emptyImg: require('@/images/home/statistics_zone_top_empty.png'),
                emptyText: vm.$t('home.main.stackedBarChart.emptyText'),
                height: 100,
                width: 200
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
                !isEmpty(val) && this.setChartItems(val);
            }
        }
    },

    computed: {
    },

    methods: {
        renderChart() {
            this.$nextTick(() => {
                const chart = new this.$chart.Chart(this.chartId, this.datas.options);
                chart.render();
            })
        },

        setChartItems(chartItems) {
            this.datas.options.data = [];
            chartItems.forEach((chartItem, index) => {
                this.datas.options.data.push({
                    type: 'stackedBar',
                    name: chartItem.name,
                    showInLegend: true,
                    color: this.datas.chartColorItems[index],
                    dataPoints: chartItem.items
                })
            })
            this.renderChart();
        }
    }
}
</script>

<style scoped lang='scss'>
    @import './StackedBarChart';
</style>
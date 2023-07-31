<template>
    <v-layout :class="['bar-chart-container']" column>
        <p>{{title}}</p>
        <div v-if="chartItems.length > 0" :id="chartId" style="height: 100%; width: 100%;" />
        <v-layout v-if="chartItems.length === 0" :class="['bar-chart-container-empty']" column>
            <v-img :class="['bar-chart-container-empty-image']" :src="renderEmptyImage(analysisType, alarmType)" contain :height="renderEmptyHeight(analysisType)" :width="renderEmptyWidth(analysisType)"/>
            <p>{{renderEmptyText(analysisType, alarmType)}}</p>
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
                return 'Predict Bar Chart'
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
        /** 분석 타입, statistics/predict */
        analysisType: {
            type: String,
            required: true
        },
        /** 알람 타입
            statistics: zone / robot
            predict: accum / temperature / pm-torque / atomizer
         */
        alarmType: {
            type: String,
            required: true
        }
    },
    data: (vm) => ({
        datas: {
            options: {
                backgroundColor: '#222a3e',
                animationEnabled: true,
                axisX: {
                    labelFontColor: '#ffffff',
                    tickThickness: 0,
                    labelAutoFit: false,
                    labelFontSize: 16,
                    labelMaxWidth: 1000,
                    interval: 1,
                    labelFormatter: function ( e ) {
                        return e.label !== null ? e.label : ''
                    },
                },
                axisY: {
                    labelFontColor: '#ffffff',
                    gridColor: '#545353',
                },
                data: []
            },
            chartType: {
                statistics: {
                    emptySize: {
                        height: 100,
                        width: 200
                    },
                    zone: {
                        color: '',
                        emptyImg: require('@/images/home/statistics_zone_top_empty.png'),
                        emptyText: vm.$t('home.main.barChart.statistics.emptyText')
                    },
                    robot: {
                        color: '#3072C6',
                        emptyImg: require('@/images/home/statistics_robot_top_empty.png'),
                        emptyText: vm.$t('home.main.barChart.statistics.emptyText')
                    }
                },
                predict: {
                    emptySize: {
                        height: 100,
                        width: 200
                    },
                    accum: {
                        color: '#6D78AD',
                        emptyImg: require('@/images/home/predict_accum_top_empty.png'),
                        emptyText: vm.$t('home.main.barChart.predict.emptyText.accum')
                    },
                    temperature: {
                        color: '#DF874D',
                        emptyImg: require('@/images/home/predict_temperature_top_empty.png'),
                        emptyText: vm.$t('home.main.barChart.predict.emptyText.temperature')
                    },
                    'pm-torque': {
                        color: '#DF7970',
                        emptyImg: require('@/images/home/predict_pmtorque_top_empty.png'),
                        emptyText: vm.$t('home.main.barChart.predict.emptyText.pm-torque')
                    },
                    atomizer: {
                        color: '#D6BB5C',
                        emptyImg: require('@/images/home/predict_atomizer_top_empty.png'),
                        emptyText: vm.$t('home.main.barChart.predict.emptyText.atomizer')
                    }
                }
            }
        }
    }),

    created() {

    },

    mounted() {
    },

    destroyed() {
    },

    updated() {
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
        renderEmptyImage() {
            return (analysisType, alarmType) => {
                return this.datas.chartType[analysisType][alarmType].emptyImg;
            }
        },
        renderEmptyText() {
            return (analysisType, alarmType) => {
                return this.datas.chartType[analysisType][alarmType].emptyText;
            }
        },
        renderEmptyHeight() {
            return (analysisType) => {
                return this.datas.chartType[analysisType]['emptySize'].height;
            }
        },
        renderEmptyWidth() {
            return (analysisType) => {
                return this.datas.chartType[analysisType]['emptySize'].width;
            }
        },
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
            this.datas.options.data.push({
                type: "bar",
                color: this.datas.chartType[this.analysisType][this.alarmType].color,
                indexLabel: "{y}",
                indexLabelFontColor: "#ffffff",
                indexLabelFontSize: 16,
                dataPoints: chartItems
            });
            this.renderChart();
        }
    }
}
</script>

<style scoped lang='scss'>
    @import 'BarChart';
</style>
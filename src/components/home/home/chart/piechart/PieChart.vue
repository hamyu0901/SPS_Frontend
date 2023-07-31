<template>
    <v-layout :class="['pie-chart-container']" column>
        <p>{{title}}</p>
        <div v-if="chartItems.length > 0" :id="chartId" style="height: 100%; width: 100%;" />
        <v-layout v-if="chartItems.length === 0" :class="['pie-chart-container-empty']" column>
            <v-img :class="['pie-chart-container-empty-image']" :src="renderEmptyImage(alarmType)" contain :height="180" :width="180"/>
            <p>{{renderEmptyText(alarmType)}}</p>
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
        /** 알람 타입
         statistics: zone / robot
         predict: accum / temperature / pm-torque
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
                colorSet: 'dyPieColorSet',
                animationEnabled: true,
            },
            colorSet: ['#E8973A', '#79A133', '#3072C6', '#04CBE5', '#E8534C'],
            chartType: {
                zone: {
                    emptyImg: require('@/images/home/statistics_zone_rate_empty.png'),
                    emptyText: vm.$t('home.main.pieChart.emptyText')
                },
                robot: {
                    emptyImg: require('@/images/home/statistics_robot_rate_empty.png'),
                    emptyText: vm.$t('home.main.pieChart.emptyText')
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
            return (alarmType) => {
                return this.datas.chartType[alarmType].emptyImg;
            }
        },
        renderEmptyText() {
            return (alarmType) => {
                return this.datas.chartType[alarmType].emptyText;
            }
        }
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
            const colorChartItems = this.setColor(chartItems);
            this.datas.options.data.push({
                type: "pie",
                indexLabel: "{label} - {y}",
                toolTipContent: "{contents}",
                indexLabelFontSize: 18,
                dataPoints: colorChartItems
            });
            this.renderChart();
        },
        setColor(chartItems) {
            return chartItems.map((chartItem, index) => {
                chartItem['color'] = (!chartItem['color'] || chartItem['color'] === '') ? this.datas.colorSet[index] : chartItem['color'];
                chartItem['indexLabelFontColor'] = (!chartItem['indexLabelFontColor'] || chartItem['indexLabelFontColor'] === '') ? this.datas.colorSet[index] : chartItem['indexLabelFontColor'];
                return chartItem;
            })
        }
    }
}
</script>

<style scoped lang='scss'>
    @import './PieChart';
</style>
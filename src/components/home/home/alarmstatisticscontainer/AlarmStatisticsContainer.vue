<template>
    <v-layout :class="['alarm-statistics-container']" column fill-height>
        <h1 :class="['alarm-statistics-container-title', `${alarmStatisticsItem.alarmType}-title-border`]">{{alarmStatisticsItem.title}}</h1>
        <v-layout :class="['alarm-statistics-container__result']">
            <v-flex lg5 md5 sm5 xs5 :class="['alarm-statistics-container__result-total-count']">
                <statistics-total-count
                    :title="alarmStatisticsItem.totalCountTitle"
                    :statistics-alarm-type="alarmStatisticsItem.alarmType"
                    :total-count="renderTotalAlarmCount"
                    v-on:onClickTotalCountItem="alarmItemClickHandler"
                />
            </v-flex>
            <v-flex lg7 md7 sm7 xs7 :class="['alarm-statistics-container__result-top']">
                <statistics-top
                    v-for="(topAxisItem, index) in datas.topAxisItems"
                    :top-item="topAxisItem"
                    :key="alarmStatisticsItem.alarmType + 'topAxisItem'+ index"
                    :count="Number(topAxisItem.violation_count)"
                    :title="topAxisItem.zone_name && renderTopAxisTitle(topAxisItem)"
                    :statistics-alarm-type="alarmStatisticsItem.alarmType"
                    v-on:onClickTopItem="alarmItemClickHandler"
                />
            </v-flex>
        </v-layout>
        <v-layout :class="['alarm-statistics-container__chart']">
            <v-flex lg6 md6 sm6 xs6 :class="['alarm-statistics-container__chart-process-count']">
                <stacked-bar-chart
                    v-if="alarmStatisticsItem.alarmType === 'zone'"
                    :chart-items="datas.chartItems"
                    :chart-id="alarmStatisticsItem.id+'stackedBarChart'"
                    :title="alarmStatisticsItem.chartTitle"
                />
                <bar-chart
                    v-if="alarmStatisticsItem.alarmType === 'robot'"
                    :alarm-type="alarmStatisticsItem.alarmType"
                    :analysis-type="alarmStatisticsItem.analysisType"
                    :chart-items="datas.chartItems"
                    :chart-id="alarmStatisticsItem.id+'barChart'"
                    :title="alarmStatisticsItem.chartTitle"
                />
            </v-flex>
            <v-flex lg6 md6 sm6 xs6 :class="['alarm-statistics-container__chart-alarm-count']">
                <pie-chart
                    :alarm-type="alarmStatisticsItem.alarmType"
                    :chart-items="datas.codeChartItems"
                    :chart-id="alarmStatisticsItem.id+'pieChart'"
                    :title="alarmStatisticsItem.codeTitle"
                />
            </v-flex>
        </v-layout>
        <alarm-analysis-modal
            :is-open="datas.isOpen"
            :title="datas.modalTitle"
            :active-item="datas.modalActiveItem"
            :width="2000"
            :alarm-type="alarmStatisticsItem.alarmType"
            :tree-view-items="datas.alarmStatisticsItems"
            :alarm-list-header-items="renderAlarmListHeaderItems"
            @onCloseModal="closeModalHandler"
        />
    </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import {convertToBarChartItems, convertToPieChartItems, convertToStackedBarChartZoneItems } from "@/utils/home";
import StatisticsTotalCount from "@/components/home/home/homepartial/statisticstotalcount/StatisticsTotalCount";
import StatisticsTop from "@/components/home/home/homepartial/statisticstop/StatisticsTop";
import StackedBarChart from "@/components/home/home/chart/stackedbarchart/StackedBarChart";
import BarChart from "@/components/home/home/chart/barchart/BarChart";
import PieChart from "@/components/home/home/chart/piechart/PieChart";
import AlarmAnalysisModal from "@/components/home/home/modal/alarmanalysismodal/AlarmAnalysisModal.vue";

export default {
    components: {AlarmAnalysisModal, StatisticsTotalCount, StatisticsTop, StackedBarChart, BarChart, PieChart },
    props: {
        alarmStatisticsItem: {
            type: Object,
            required: true
        }
    },
    data: (vm) => ({
        datas: {
            alarmListItems: [],
            alarmStatisticsItems: [],
            alarmStatisticsResultItems: [],
            alarmStatisticsCodeResultItems: [],
            topAxisItems: [],
            chartItems: [],
            codeChartItems: [],
            locale: {
                axis: vm.$t('home.main.axis')
            },
            isOpen: false,
            modalTitle: '',
            modalActiveItem: {},
            zoneAlarmListHeaderItems: [
                { id: 'date', value: 'date', text: vm.$t('home.main.modal.table.header.date'), type: 'text', align: 'center', sortable: false },
                { id: 'type', value: 'type', text: vm.$t('home.main.modal.table.header.type'), type: 'text', align: 'center', sortable: false },
                { id: 'code', value: 'code', text: vm.$t('home.main.modal.table.header.code'), type: 'text', align: 'center', sortable: false },
                { id: 'contents', value: 'contents', text: vm.$t('home.main.modal.table.header.contents'), type: 'text', align: 'center', sortable: false },
                { id: 'robot_name', value: 'robot_name', text: vm.$t('home.main.modal.table.header.robot'), type: 'text', align: 'center', sortable: false },
                { id: 'job_name', value: 'job_name', text: 'JOB', type: 'text', align: 'center', sortable: false },
                { id: 'step_no', value: 'step_no', text: 'STEP', type: 'text', align: 'center', sortable: false },
                { id: 'level', value: 'level', text: vm.$t('home.main.modal.table.header.level'), type: 'img', align: 'center', sortable: false }
            ],

            robotAlarmListHeaderItems: [
                { id: 'date', value: 'date', text: vm.$t('home.main.modal.table.header.date'), type: 'text', align: 'center', sortable: false },
                { id: 'type', value: 'type', text: vm.$t('home.main.modal.table.header.type'), type: 'text', align: 'center', sortable: false },
                { id: 'code', value: 'code', text: vm.$t('home.main.modal.table.header.code'), type: 'text', align: 'center', sortable: false },
                { id: 'sub_code', value: 'sub_code', text: vm.$t('home.main.modal.table.header.subCode'), type: 'text', align: 'center', sortable: false },
                { id: 'contents', value: 'contents', text: vm.$t('home.main.modal.table.header.contents'), type: 'text', align: 'center', sortable: false },
                { id: 'job_name', value: 'job_name', text: 'JOB', type: 'text', align: 'center', sortable: false },
                { id: 'step_no', value: 'step_no', text: 'STEP', type: 'text', align: 'center', sortable: false },
                { id: 'axis', value: 'axis', text: 'AXIS', type: 'text', align: 'center', sortable: false }
            ],
        }
    }),

    async created() {
        setTimeout(async () => {
            this.datas.alarmStatisticsItems = await this.getAlarmStatisticsItems(this.alarmStatisticsItem.listApi);
        }, 500)
        this.datas.alarmStatisticsResultItems = await this.getAlarmStatisticsResultItems(this.alarmStatisticsItem.api);
        this.datas.alarmStatisticsCodeResultItems = await this.getAlarmStatisticsCodeResultItems(this.alarmStatisticsItem.codeApi);
        this.datas.chartItems = this.convertToChartItems(this.datas.alarmStatisticsResultItems);
        this.datas.codeChartItems = this.convertToCodeChartItems(this.datas.alarmStatisticsCodeResultItems);
        this.datas.topAxisItems = this.getTopAxisItems(this.datas.alarmStatisticsResultItems);
    },

    mounted() {
    },

    destroyed() {
    },

    computed: {
        ...mapGetters({
            boothInfoItems: 'getRenewBoothInfos',
            zoneInfoItems: 'getRenewZoneInfos'
        }),

        renderTotalAlarmCount() {
            /** 전체 건수 */
            return this.datas.alarmStatisticsResultItems.length > 0 ? this.getTotalAlarmCount(this.datas.alarmStatisticsResultItems) : 0;
        },

        renderTopAxisTitle() {
            return (topAxisItem) => {
                return `${topAxisItem.zone_name}${topAxisItem.robot_name ? (' ' + topAxisItem.robot_name) : ''}${topAxisItem.axis ? (' '+topAxisItem.axis+' '+this.datas.locale.axis) : ''}`
            }
        },

        renderAlarmListHeaderItems() {
            return this.alarmStatisticsItem.alarmType === 'zone' ? this.datas.zoneAlarmListHeaderItems : this.datas.robotAlarmListHeaderItems;
        }
    },

    methods: {
        async getAlarmStatisticsItems(listApi) {
            try {
                const alarmStatisticsItems = await listApi;
                this.datas.alarmListItems = alarmStatisticsItems.data;
                return this.alarmStatisticsItem.alarmType === 'zone' ? this.setZoneAlarmTreeViewItems(alarmStatisticsItems.data) : this.setRobotAlarmTreeViewItems(alarmStatisticsItems.data);
            } catch(error) {
                this.datas.alarmListItems = [];
                console.error(error);
                return null;
            }
        },

        async getAlarmStatisticsResultItems(api) {
            try {
                const alarmStatisticsResultItems = await api;
                return alarmStatisticsResultItems.data ? alarmStatisticsResultItems.data : [];
            } catch(error) {
                console.error(error);
                return null;
            }
        },

        async getAlarmStatisticsCodeResultItems(codeApi) {
            try {
                const alarmStatisticsCodeResultItems = await codeApi;
                return alarmStatisticsCodeResultItems.data ? alarmStatisticsCodeResultItems.data : [];
            } catch(error) {
                console.error(error);
                return null;
            }
        },

        getTotalAlarmCount(alarmStatisticsResultItems) {
            const totalAlarmCount = alarmStatisticsResultItems.reduce((sum, { violation_count }) => sum + Number(violation_count), 0);
            return totalAlarmCount !== null ? totalAlarmCount : 0;
        },

        getTopAxisItems(alarmStatisticsResultItems) {
            const topAxisItems = alarmStatisticsResultItems.length > 0 ? alarmStatisticsResultItems.filter(alarmStatisticsResultItem => {
                return Number(alarmStatisticsResultItem.violation_count) > 0
            }).slice(0, 3) : [];

            return topAxisItems.length === 3 ? topAxisItems : this.getTopAxisEmptyItems(topAxisItems, topAxisItems.length);
        },

        getTopAxisEmptyItems(oldTopAxisItems, length) {
            const topAxisEmptyItems =Array(3 - length).fill({ violation_count: 0 });
            const newTopAxisItems = oldTopAxisItems.concat(topAxisEmptyItems);
            return newTopAxisItems;
        },

        convertToChartItems(alarmStatisticsResultItems) {
            return this.alarmStatisticsItem.alarmType === "zone" ? this.convertToZoneAlarmChartItems(alarmStatisticsResultItems) : this.convertToRobotAlarmChartItems(alarmStatisticsResultItems);
        },

        convertToZoneAlarmChartItems(alarmStatisticsResultItems) {
            const filteredZoneStatisticsAnalysisResultItems = alarmStatisticsResultItems.length > 0 ? alarmStatisticsResultItems.filter(alarmStatisticsResultItem => {
                return Number(alarmStatisticsResultItem.violation_count) > 0;
            }).slice(0, 9) : [];
            return filteredZoneStatisticsAnalysisResultItems.length > 0 ? convertToStackedBarChartZoneItems(filteredZoneStatisticsAnalysisResultItems.sort((a, b) => Number(a.violation_count)-Number(b.violation_count)), true, function( item ) {
                Number(item.violation_count) > 0 && this.alarmItemClickHandler(item);
            }.bind(this)) : [];
        },

        convertToRobotAlarmChartItems(alarmStatisticsResultItems) {
            const filteredRobotStatisticsAnalysisResultItems = alarmStatisticsResultItems.length > 0 ? alarmStatisticsResultItems.sort((a, b) => b.violation_count - a.violation_count).filter(alarmStatisticsResultItem => {
                return Number(alarmStatisticsResultItem.violation_count) > 0;
            }).slice(0, 9) : [];
            return filteredRobotStatisticsAnalysisResultItems.length > 0 ?  convertToBarChartItems(filteredRobotStatisticsAnalysisResultItems, true, function (item) {
                Number(item.violation_count) > 0 && this.alarmItemClickHandler(item);
            }.bind(this)).reverse() : [];
        },

        convertToCodeChartItems(alarmStatisticsCodeResultItems) {
            const filteredAlarmStatisticsAnalysisResultItems = alarmStatisticsCodeResultItems.length > 0 ? alarmStatisticsCodeResultItems.filter(alarmStatisticsCodeResultItem => {
                return Number(alarmStatisticsCodeResultItem.violation_count) > 0;
            }).slice(0, 5) : [];
            const labelType = this.alarmStatisticsItem.alarmType === 'zone'? 'type_name' : 'alarm_code';
            const contentType = this.alarmStatisticsItem.alarmType === 'zone'? 'type_name' : 'alarm_contents';
            return filteredAlarmStatisticsAnalysisResultItems.length > 0 ? convertToPieChartItems(filteredAlarmStatisticsAnalysisResultItems, labelType, contentType) : [];
        },

        setZoneAlarmTreeViewItems(alarmStatisticsItems) {
            const zoneAlarmTreeViewItems = [];
            let treeViewId = 0;
            this.boothInfoItems.forEach(boothInfoItem => {
                ++treeViewId;
                const zoneAlarmTreeViewItem = {
                    id: treeViewId,
                    booth_id: boothInfoItem.booth_id,
                    name: boothInfoItem.booth_name,
                    children: []
                }
                alarmStatisticsItems.forEach((alarmStatisticsItem, alarmStatisticsItemIdx) => {
                    if( boothInfoItem.booth_id === alarmStatisticsItem.disp_booth_id ) {
                        ++treeViewId;
                        zoneAlarmTreeViewItem.children.push({
                            id: treeViewId,
                            zone_id: alarmStatisticsItem.zone_id,
                            count: alarmStatisticsItem.count,
                            zone_name: alarmStatisticsItem.zone_name,
                            booth_name: boothInfoItem.booth_name,
                            name: alarmStatisticsItem.zone_name + '(' + alarmStatisticsItem.count + ')'
                        })
                    }
                    alarmStatisticsItems.length - 1 === alarmStatisticsItemIdx && zoneAlarmTreeViewItems.push(zoneAlarmTreeViewItem);
                })
            })
            treeViewId = null;
            return zoneAlarmTreeViewItems;
        },

        setRobotAlarmTreeViewItems(alarmStatisticsItems) {
            const robotAlarmTreeViewItems = [];
            let treeViewId = 0;
            this.boothInfoItems.forEach(boothInfoItem => {
                ++treeViewId;
                const robotAlarmTreeViewItem = {
                    id: treeViewId,
                    booth_id: boothInfoItem.booth_id,
                    name: boothInfoItem.booth_name,
                    children: []
                };
                this.zoneInfoItems.forEach((zoneInfoItem, zoneInfoItemIdx) => {
                    if( boothInfoItem.booth_id === zoneInfoItem.disp_booth_id ) {
                        ++treeViewId;
                        const zoneAlarmTreeViewItem = {
                            id: treeViewId,
                            zone_id: zoneInfoItem.zone_id,
                            name: zoneInfoItem.zone_name,
                            children: []
                        }
                        alarmStatisticsItems.forEach((alarmStatisticsItem, alarmStatisticsItemIdx) => {
                            if(zoneAlarmTreeViewItem.zone_id === alarmStatisticsItem.zone_id) {
                                ++treeViewId;
                                zoneAlarmTreeViewItem.children.push({
                                    id: treeViewId,
                                    robot_id: alarmStatisticsItem.robot_id,
                                    count: alarmStatisticsItem.count,
                                    robot_name: alarmStatisticsItem.robot_name,
                                    zone_name: zoneInfoItem.zone_name,
                                    booth_name: boothInfoItem.booth_name,
                                    name: alarmStatisticsItem.robot_name + '(' + alarmStatisticsItem.count + ')'
                                })
                            }
                            zoneAlarmTreeViewItem.name = alarmStatisticsItems.length - 1 === alarmStatisticsItemIdx ? zoneAlarmTreeViewItem.name + '(' + zoneAlarmTreeViewItem.children.reduce(function(acc, obj) { return acc + Number(obj.count)}, 0)+ ')' : zoneAlarmTreeViewItem.name;
                            alarmStatisticsItems.length - 1 === alarmStatisticsItemIdx && robotAlarmTreeViewItem.children.push(zoneAlarmTreeViewItem);
                        })
                    }
                    this.zoneInfoItems.length - 1 === zoneInfoItemIdx && robotAlarmTreeViewItems.push(robotAlarmTreeViewItem);
                })
            })
            treeViewId = null;
            return robotAlarmTreeViewItems;
        },

        alarmItemClickHandler(item = null) {
            this.datas.modalActiveItem = this.findTreeActiveItem(this.alarmStatisticsItem.alarmType, item === null ? (this.datas.alarmListItems.reduce((prev, cur) => (Number(prev.count) > Number(cur.count)) ? prev : cur, 1)) : item);
            this.datas.modalTitle = this.alarmStatisticsItem.alarmType === 'robot' ? this.$t('home.main.modal.title.robot') : this.$t('home.main.modal.title.zone')
            this.datas.isOpen = true;
            this.$emit('modalStatus', true);
        },

        findTreeActiveItem(type, item) {
            let treeActiveItem = null;
            this.datas.alarmStatisticsItems.forEach(alarmStatisticsItem => {
                alarmStatisticsItem.children && alarmStatisticsItem.children.forEach(zoneStatisticsItem => {
                    type === 'zone' ? (zoneStatisticsItem.zone_id === item.zone_id && (treeActiveItem = {...zoneStatisticsItem})) : (zoneStatisticsItem.children && zoneStatisticsItem.children.forEach(robotStatisticsItem => {
                        robotStatisticsItem.robot_id === item.robot_id && (treeActiveItem = {...robotStatisticsItem});
                    }))
                })
            })
            return treeActiveItem;
        },

        closeModalHandler() {
            this.datas.modalActiveItem = {};
            this.datas.isOpen = false;
            this.$emit('modalStatus', false);
        }
    }
}
</script>

<style scoped lang='scss'>
    @import './AlarmStatisticsContainer';
</style>

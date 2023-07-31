<template>
    <base-modal :class="['robot-alarm-modal']" :title="title" :is-open="isOpen" :width="width" @onCloseModal="closeModalHandler">
        <v-layout :class="['robot-alarm-modal__contents']" column>
            <v-layout :class="['robot-alarm-modal__contents-infos']">
                <alarm-partial-card :title="datas.robotAlarmInfoTitle">
                    <info-table :info-table-items="datas.robotInfoItems" />
                </alarm-partial-card>
            </v-layout>
            <v-layout :class="['robot-alarm-modal__contents-torque']">
                <v-flex>
                    <alarm-partial-card :title="datas.robotTorqueTrendChartTitle">
                        <multi-line-chart
                            :chart-id="'torque-data-chart'"
                            :chart-items="datas.robotTorqueItems"
                            :value-type="'torque'"
                            :chart-strip-lines="renderStepNo"
                            :chart-strip-line-type="'single'"
                        />
                    </alarm-partial-card>
                </v-flex>
            </v-layout>
            <v-layout :class="['robot-alarm-modal__contents-accum']">
                <v-flex lg8 md8 sm8 :class="['robot-alarm-modal__contents-accum-line']">
                    <alarm-partial-card :title="datas.robotAccumTrendChartTitle">
                        <multi-line-chart :chart-items="datas.robotAccumTrendItems" chart-id="accum-trend-chart" :chartXType="'time'" :value-type="'accum'" />
                    </alarm-partial-card>
                </v-flex>
                <v-flex lg4 md4 sm4 :class="['robot-alarm-modal__contents-accum-bar']">
                    <alarm-partial-card :title="datas.robotAccumGapChartCardTitle">
                        <multi-bar-chart :chart-items="datas.robotAccumGapItems" chart-id="accum-gap-chart" :value-type="'accum'" :title="datas.robotAccumGapChartTitle" />
                    </alarm-partial-card>
                </v-flex>
            </v-layout>
            <v-layout :class="['robot-alarm-modal__contents-temperature']">
                <v-flex lg8 md8 sm8 :class="['robot-alarm-modal__contents-temperature-line']">
                    <alarm-partial-card :title="datas.robotTemperatureTrendChartTitle">
                        <multi-line-chart :chart-items="datas.robotTemperatureTrendItems" chart-id="temperature-trend-chart" :chartXType="'time'" :value-type="'temperature'" />
                    </alarm-partial-card>
                </v-flex>
                <v-flex lg4 md4 sm4 :class="['robot-alarm-modal__contents-temperature-bar']">
                    <alarm-partial-card :title="datas.robotTemperatureGapChartCardTitle">
                        <multi-bar-chart :chart-items="datas.robotTemperatureGapItems" chart-id="temperature-gap-chart" :value-type="'temperature'" :title="datas.robotTemperatureGapChartTitle" />
                    </alarm-partial-card>
                </v-flex>
            </v-layout>
        </v-layout>
    </base-modal>
</template>

<script>
import {
    convertTorqueToChartItems,
    convertTrendToChartItems,
    convertGapToChartItems,
} from '@/utils/alarm';
import { isEmpty } from 'lodash';
import { mapGetters } from "vuex";
import BaseModal from '@/commons/basemodal/BaseModal';
import InfoTable from '@/commons/alarm/infotable/InfoTable';
import AlarmPartialCard from '@/commons/alarm/partialcard/PartialCard';
import MultiLineChart from '@/commons/chart/multilinechart/MultiLineChart';
import MultiBarChart from "@/commons/chart/multibarchart/MultiBarChart";
export default {
    props: {
        width: {
            type: Number
        },
        isOpen: {
            type: Boolean,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        /**
            code: String,
            zone_robot_name: String,
            alarm_name: String,
            job_name: String,
            step_no: Number,
            axis: String,
            parts: Object,
            time: String
        */
        infoItems: {
            type: Array,
            required: true
        },
        torqueItems: {
            type: Array,
            required: true
        },
        accumTrendItems: {
            type: Array,
            required: true
        },
        temperatureTrendItems: {
            type: Array,
            required: true
        },
        accumGapItems: {
            type: Array,
            required: true
        },
        temperatureGapItems: {
            type: Array,
            required: true
        }
    },
    components: {
        BaseModal,
        InfoTable,
        AlarmPartialCard,
        MultiLineChart,
        MultiBarChart
    },
    data: (vm) => ({
        datas: {
            robotAlarmInfoTitle: vm.$t('common.robotAlarmModal.robotAlarmInfoTitle'),
            robotTorqueTrendChartTitle: vm.$t('common.robotAlarmModal.robotTorqueTrendChartTitle'),
            robotAccumTrendChartTitle: vm.$t('common.robotAlarmModal.robotAccumTrendChartTitle'),
            robotAccumGapChartCardTitle: vm.$t('common.robotAlarmModal.robotAccumGapChartCardTitle'),
            robotAccumGapChartTitle: vm.$t('common.robotAlarmModal.robotAccumGapChartTitle'),
            robotTemperatureTrendChartTitle: vm.$t('common.robotAlarmModal.robotTemperatureTrendChartTitle'),
            robotTemperatureGapChartCardTitle: vm.$t('common.robotAlarmModal.robotTemperatureGapChartCardTitle'),
            robotTemperatureGapChartTitle: vm.$t('common.robotAlarmModal.robotTemperatureGapChartTitle'),
            robotInfoItems: [],
            robotTorqueItems: [],
            robotAccumTrendItems: [],
            robotAccumGapItems: [],
            robotTemperatureTrendItems: [],
            robotTemperatureGapItems: []
        }
    }),

    created() {
    },

    mounted() {
    },

    destroyed() {
    },

    watch: {
        isOpen: {
            handler(val) {
                if (val) {
                    this.datas.robotInfoItems = this.infoItems.length > 0 ? this.setRobotInfoItems(this.infoItems) : [];
                    this.datas.robotTorqueItems = this.torqueItems.length > 0 ? this.setRobotTorqueItems(this.torqueItems): [];
                    this.datas.robotAccumTrendItems = this.accumTrendItems.length > 0 ? this.setRobotTrendItems(this.accumTrendItems): [];
                    this.datas.robotTemperatureTrendItems = this.temperatureTrendItems.length > 0 ? this.setRobotTrendItems(this.temperatureTrendItems): [];
                    this.datas.robotAccumGapItems = this.accumGapItems.length > 0 ? this.setRobotGapItems(this.accumGapItems): [];
                    this.datas.robotTemperatureGapItems = this.temperatureGapItems.length > 0 ? this.setRobotGapItems(this.temperatureGapItems): [];
                } else {
                    this.datas.robotInfoItems = [];
                    this.datas.robotTorqueItems = [];
                    this.datas.robotAccumTrendItems = [];
                    this.datas.robotAccumGapItems = [];
                    this.datas.robotTemperatureTrendItems = [];
                    this.datas.robotTemperatureGapItems = [];
                }
            }
        }
    },

    computed: {
        ...mapGetters({
            zoneInfos: 'getRenewZoneInfos',
            robotInfos: 'getRenewRobotInfos',
            robotPartItems: 'getRobotPartItems',
            getRcModelInfos : 'getRcModelInfos',
            getRobotToolInfos: 'getRobotToolInfos'
        }),

        renderStepNo() {
            return this.infoItems.length > 0 ? this.infoItems[0].step_no : 0;
        }
    },

    methods: {
        getZoneRobotName(robotId = '') {
            const { robot_name: robotName, zone_id } = this.robotInfos.filter(robotInfo => robotInfo.robot_id === robotId).length > 0 ? this.robotInfos.filter(robotInfo => robotInfo.robot_id === robotId)[0] : { robot_name: ''};
            const { zone_name: zoneName } = this.zoneInfos.filter(zoneInfo => zoneInfo.zone_id === zone_id).length > 0 ? this.zoneInfos.filter(zoneInfo => zoneInfo.zone_id === zone_id)[0] : { zone_name: '' };
            return zoneName + '-' + robotName;
        },

        getPartItems(matchParts) {
            return matchParts.map(matchPart => {
                const partItem = this.robotPartItems.filter(robotPartItem => robotPartItem.part_id === matchPart);
                return { item: partItem[0].part_name, level: partItem[0].part_level }
            })
        },

        setRobotInfoItems(infoItems) {
            const infoItem = infoItems[0];
            const robotInfoItems = [
                { title: 'CODE', contents: infoItem.code, type: 'text' },
                { title: 'CONTENTS', contents: infoItem.alarm_name, type: 'text' },
                { title: 'ROBOT', contents: this.getZoneRobotName(infoItem.robot_id), type: 'text' },
                { title: 'RC_MODEL', contents: this.getRcModelInfos.filter(modelInfo => modelInfo.rc_model_id === infoItem.rc_model_id)[0].rc_model_name, type: 'text'},
                { title : 'TOOL', contents: this.getRobotToolInfos.filter(toolInfoItem => toolInfoItem.tool_id === infoItem.tool_id)[0].tool_name, type: 'text'},
                { title: 'STEP', contents: infoItem.step_no, type: 'text' },
                { title: 'JOB NAME', contents: infoItem.job_name, type: 'text' },
                { title: 'AXIS', contents: infoItem.axis_info.map((axisInfo, axisIndex) => axisInfo === 1 ? axisIndex+1 : '').filter(String), type: 'text' },
                { title: 'TIME', contents: infoItem.update_time, type: 'text'},
            ];
            !isEmpty(infoItem.match_parts) && robotInfoItems.push({ title: 'PARTS', contents: this.getPartItems(infoItem.match_parts), type: 'chip'});
            return robotInfoItems;
        },

        setRobotTorqueItems(torqueItems) {
            return convertTorqueToChartItems(torqueItems);
        },

        setRobotTrendItems(robotTrendItems) {
            return convertTrendToChartItems(robotTrendItems);
        },

        setRobotGapItems(robotGapItems) {
            return convertGapToChartItems(robotGapItems);
        },

        closeModalHandler() {
            this.$emit('onCloseModal');
        }
    }
}
</script>

<style scoped lang='scss'>
    @import "RobotAlarmModal";
</style>

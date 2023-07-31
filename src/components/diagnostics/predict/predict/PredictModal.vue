<template>
    <base-modal :class="['predict-modal']" :title="title" :is-open="isOpen" @onCloseModal="closeModalHandler">
        <v-layout :class="['predict-modal__contents']">
            <v-layout :class="['predict-modal__contents-data']" column>
                <v-layout :class="['predict-modal__contents-data__btn-items']">
                    <v-btn-toggle mandatory v-model="datas.selectedAxis" :class="['predict-modal__contents-data__btn-items-toggle']">
                        <v-btn v-for="(robotAxis, index) in renderAxisItem" :key="robotAxis" flat @click="() => {chartLoadHandler({robotId: robotItem.robot_id, axis: index, prevDate: prevDate})}">
                            <v-layout align-center justify-center>
                                <span class="mr-1">{{(index + 1)  + datas.locale.axis}}</span>
                                <v-layout justify-center class="ml-1">
                                    <alarm-status-container
                                        :component-type="'icon'"
                                        :alarm-type="renderAlarmStatus(axisItem[robotAxis], predictType)"
                                    />
                                </v-layout>
                            </v-layout>
                        </v-btn>
                    </v-btn-toggle>
                </v-layout>
                <v-layout column v-if="renderChartOptions" :class="['predict-modal__contents-data__chart']">
                    <predict-line-chart
                        v-for="(chartOption, index) in renderChartOptions"
                        :key="chartOption.id + index"
                        :chart-id="chartOption.id + index"
                        :chart-items="chartOption.items"
                        :chart-title="chartTitle"
                        :chart-sub-title="renderChartSubTitle(chartOption.items.jobName)"
                        :value-type="chartOption.valueType"
                    />
                </v-layout>
                <v-layout fill-heihgt :class="['predict-modal__contents-data__empty']" v-if="!renderChartOptions">
                    <p>{{datas.locale.emptyText}}</p>
                </v-layout>
            </v-layout>
        </v-layout>
    </base-modal>
</template>

<script>
import BaseModal from "@/commons/basemodal/BaseModal";
import AlarmStatusContainer from "@/commons/alarmstatuscontainer/AlarmStatusContainer";
import PredictLineChart from "@/components/diagnostics/predict/predict/chart/PredictLineChart";
import DateTypeToggle from "@/commons/datetypetoggle/DateTypeToggle";
import { isEmpty } from "lodash";

export default {
    components: { BaseModal, AlarmStatusContainer, PredictLineChart, DateTypeToggle },
    props: {
        /** 모달 오픈 여부 */
        isOpen: {
            type: Boolean,
            required: true
        },
        /** 예지 보전 경고 타입 */
        predictType: {
            type: String,
            required: true
        },
        /** 모달 타이틀 */
        title: String,
        /** 모달 서브 타이틀 */
        subTitle: String,
        /** 차트 타이틀 */
        chartTitle: String,
        /** 차트 서브 타이틀 */
        chartSubTitle: String,
        /** 로봇 아이템 */
        robotItem: {
            type: Object,
            required: true
        },
        /** 로봇 축 아이템 */
        axisItem: {
            type: Object,
            required: true
        },
        /** 차트 옵션 */
        chartOptions: {
            type: Array,
            required: true
        },
        /** 이전 날짜 ( 검색 범위 ) */
        prevDate: {
            type: String,
            required: true
        },

        selectedAxis: {
            type: Number
        }
    },
    data: (vm) => ({
        datas: {
            selectedAxis: vm.selectedAxis && vm.selectedAxis,
            chartOptions: [],
            locale: {
                axis: vm.$t('diagnostics.predict.main.axis'),
                emptyText: vm.$t('diagnostics.predict.main.predictModal.emptyText')
            }
        }
    }),

    created() {
        this.chartLoadHandler({robotId: this.robotItem.robot_id, axis: this.selectedAxis, prevDate: this.prevDate});
        /** 모달 created 될 때, 1축 차트 생성 */
    },

    mounted() {

    },

    destroyed() {},

    watch: {},

    computed: {
        renderSubTitle() {
            return this.subTitle && this.subTitle;
        },

        renderAxisItem() {
            return Object.keys(this.axisItem);
        },

        renderAlarmStatus() {
            return (alarmStatus, predictType) => {
                if (predictType !== 'pmtorque_alarm_status') {
                    return (alarmStatus === '0' || alarmStatus === 0 || alarmStatus === null) ? 'normal' : 'alarm';
                } else {
                    return (alarmStatus === '0' || alarmStatus === 0) ? 'normal' : (alarmStatus === '1' || alarmStatus === 1) ? 'alarm' : 'default';
                }
            }
        },

        renderChartOptions() {
            return !isEmpty(this.chartOptions) && this.chartOptions;
        },

        renderChartSubTitle() {
            return (param) => {
                return param === undefined? this.chartSubTitle : this.chartSubTitle + ' ' + `[JOB-FILE: ${param}]`;
            }
        },

        renderDatePeriod() {
            return this.prevDate + ' - ' + this.$moment().format('YYYY-MM-DD');
        }
    },

    methods: {
        closeModalHandler() {
            this.$emit('onCloseModal')
        },

        chartLoadHandler(params) {
            this.datas.selectedAxis = (params.axis);
            this.$emit('setChartLoadParams', {...params, predictType: this.predictType, rc_model_id: this.robotItem.rc_model_id, tool_id : this.robotItem.tool_id});
        },
    }
}
</script>

<style scoped lang='scss'>
@import 'PredictModal';
</style>

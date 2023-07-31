<template>
    <v-layout :class="['predict-chart-board']" column>
        <span :class="['predict-chart-board-title']">{{ title }}</span>
        <v-layout :class="['predict-chart-board__btn-items']">
                <v-btn-toggle mandatory v-model="datas.selectedAxis" :class="['predict-chart-board__btn-items-toggle']">
                    <v-btn v-for="(robotAxis, index) in renderAxisItem" :key="robotAxis" flat @click="() => {chartLoadHandler({robotId: robotItem.robot_id, axis: index})}">
                        <v-layout align-center justify-center>
                            <span class="mr-1">{{(index + 1)  + datas.locale.axis}}</span>
                            <v-layout justify-center class="ml-1">
                                <alarm-status-container
                                    :component-type="'icon'"
                                    :alarm-type="renderAlarmStatus(axisItem[robotAxis], predictType)"
                                    :size="30"
                                />
                            </v-layout>
                        </v-layout>
                    </v-btn>
                </v-btn-toggle>
            </v-layout>
            <v-layout column v-if="renderChartOptions" :class="['predict-chart-board__chart']">
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
                <v-layout fill-heihgt :class="['predict-chart-board__empty']" v-if="!renderChartOptions">
                    <p>{{datas.locale.emptyText}}</p>
                </v-layout>

    </v-layout>
</template>

<script>
import AlarmStatusContainer from "@/commons/alarmstatuscontainer/AlarmStatusContainer";
import PredictLineChart from "@/components/diagnostics/predict/predict/chart/PredictLineChart";

import { isEmpty } from "lodash";

export default {
    props: {
        robotItem: {
            type: Object,
        },
        axisItem: {
            type: Object
        },
        predictType: {
            type : String
        },
        /** 차트 옵션 */
        chartOptions: {
            type: Array,
            required: true
        },
        selectedAxis: {
            type : Number
        },
        title : String,
        /** 차트 타이틀 */
        chartTitle: String,
        /** 차트 서브 타이틀 */
        chartSubTitle: String,
    },
    components : { AlarmStatusContainer, PredictLineChart },
    data(vm) {
        return {
            datas : {
                locale: {
                    axis: vm.$t('diagnostics.predict.main.axis'),
                    emptyText: vm.$t('diagnostics.predict.main.predictModal.emptyText')
                },
                selectedAxis : vm.selectedAxis ? vm.selectedAxis : 0
            }
        }
    },
    computed: {
        renderAlarmStatus() {
            return (alarmStatus, predictType) => {
                if (predictType !== 'pmtorque_alarm_status') {
                    return (alarmStatus === '0' || alarmStatus === 0 || alarmStatus === null) ? 'normal' : 'alarm';
                } else {
                    return (alarmStatus === '0' || alarmStatus === 0) ? 'normal' : (alarmStatus === '1' || alarmStatus === 1) ? 'alarm' : 'default';
                }
            }
        },

        renderAxisItem() {
            return Object.keys(this.axisItem);
        },

        renderChartOptions() {
            return !isEmpty(this.chartOptions) && this.chartOptions;
        },

        renderChartSubTitle() {
            return (param) => {
                return param === undefined? this.chartSubTitle : this.chartSubTitle + '  ' + ` [JOB-FILE: ${param}] `;
            }
        },

    },
    mounted(){

    },

    watch:{
        selectedAxis: {
            deep: true,
            handler(val){
                this.datas.selectedAxis = val && val
            }
        }
    },
    methods: {
        chartLoadHandler(params) {
            // this.datas.selectedAxis = (params.axis);
            this.$emit('setChartLoadParams', {...params, predictType: this.predictType, rc_model_id: this.robotItem.rc_model_id, tool_id : this.robotItem.tool_id});
        },
    }
}
</script>
<style scoped lang="scss">
    @import './RobotPredictChartBoard.scss'
</style>

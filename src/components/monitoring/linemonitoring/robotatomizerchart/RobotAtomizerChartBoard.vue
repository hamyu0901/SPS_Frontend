<template>
    <v-layout :class="['atomizer-chart-board']" column>
        <span :class="['atomizer-chart-board-title']">{{title}}</span>
        <v-layout :class="['atomizer-chart-board__btn-items']">
                <v-btn-toggle mandatory v-model="datas.atomizerTypeValue" :class="['atomizer-chart-board__btn-items-toggle']" @change="changeAtomizerTypeValue">
                    <v-btn v-for="atomizerTypeValueItem in datas.atomizerTypeValueItems" :key="atomizerTypeValueItem.id" flat :value="atomizerTypeValueItem.value" >
                        <v-layout align-center justify-center>
                            <span class="mr-1">{{atomizerTypeValueItem.title}}</span>
                            <v-layout justify-center class="ml-1">
                                <alarm-status-container
                                    :component-type="'icon'"
                                    :alarm-type="renderAtomizerStatus(atomizerTypeValueItem.value)"
                                />
                            </v-layout>
                        </v-layout>
                    </v-btn>
            </v-btn-toggle>
        </v-layout>
        <v-layout v-if="(datas.atomizerTypeValue !== datas.atomizerTypeValueItems[3].value && datas.atomizerTypeValue !== datas.atomizerTypeValueItems[4].value) || datas.atomizerPredictItems.length === 0">
            <v-flex>
                <mix-chart
                    :chart-id="'atomizer-avg-chart'"
                    :chart-title="chartTitle"
                    :chart-sub-title="chartSubTitle"
                    :chart-items="datas.atomizerPredictItems"
                    :value-type="'atomizer-type'"
                    :chart-axis-y-options="{ title: 'ERROR RATE(%)' }"
                >
                </mix-chart>
            </v-flex>
        </v-layout>
        <v-layout v-if="datas.atomizerTypeValue === datas.atomizerTypeValueItems[3].value && datas.atomizerPredictItems.length > 0">
            <v-flex>
                <mix-chart
                    v-for="(atomizerPredictItem, atomizerPredictItemIdx) in datas.atomizerPredictItems"
                        :key="'atomizerPredictItem'+ atomizerPredictItemIdx"
                        :chart-id="'atomizer-hv-'+atomizerPredictItemIdx+'-avg-chart'"
                        :chart-title="chartTitle"
                        :chart-sub-title="chartSubTitle"
                        :chart-items="[...atomizerPredictItem]"
                        :value-type="'atomizer-type'"
                    >
                </mix-chart>
            </v-flex>
        </v-layout>
        <v-layout v-if="datas.atomizerTypeValue === datas.atomizerTypeValueItems[4].value && datas.atomizerPredictItems.length > 0"column>
            <base-table
                :class="['atomizer-chart-board__layout-table']"
                :header-items="datas.atomizerAlarmListHeaderItems"
                :content-items="atomizerAlarmListItems"
            />
            <v-flex :class="['atomizer-chart-board__layout-alarm-chart-box']">
                <mix-chart
                    :chart-id="'atomizer-avg-chart'"
                    :chart-title="chartTitle"
                    :chart-sub-title="chartSubTitle"
                    :chart-items="atomizerAlarmListItems.length > 0 ? datas.atomizerPredictItems : []"
                    :value-type="'atomizer-type'"
                />
            </v-flex>
        </v-layout>
    </v-layout>
</template>
<script>

import AlarmStatusContainer from "@/commons/alarmstatuscontainer/AlarmStatusContainer";
import MixChart from "@/commons/chart/mixchart/MixChart";
import BaseTable from "@/commons/basetable/BaseTable.vue";
import {
    convertToAtomizerAlarmChartItems,
    convertToAtomizerChartItems,
    convertToAtomizerHVChartItems
} from '@/utils/diagnostics/predict';

export default {
    props: {
        /** 타이틀 */
        title : String,
        /** 도장기 아이템 */
        atomizerItem: {
            type: Object,
        },
        /** 도장기 타입 */
        atomizerTypeValue : {
            type : String
        },
        /** 도장기 데이터 */
        atomizerPredictItems: {
            type : Array
        },
        chartTitle: String,
        /** 차트 서브 타이틀 */
        chartSubTitle: String,
        /** 도장기 유효 알람 아이템 */
        atomizerAlarmListItems: {
            type: Array
        }
    },
    components: { BaseTable, AlarmStatusContainer, MixChart },

    data(vm) {
        return {
            datas: {
                atomizerTypeValue: vm.atomizerTypeValue ? vm.atomizerTypeValue : 'turbine',
                atomizerTypeValueItems: [
                    { id: 'turbine', title: 'TURBINE', value: 'turbine' },
                    { id: 'sa_s', title: 'SA_S', value: 'sa_s' },
                    { id: 'sa_v', title: 'SA_V', value: 'sa_v' },
                    { id: 'hv', title: 'HIGH-VOLTAGE', value: 'hv' },
                    { id: 'alarm', title: 'ALARM', value: 'alarm' }
                ],
                atomizerPredictItems: [],
                atomizerAlarmListHeaderItems: [
                    { text: vm.$t('diagnostics.atomizer.atomizerAlarmListHeaderItems.update_time'), value: 'update_time', type: 'text', align: 'center' },
                    { text: vm.$t('diagnostics.atomizer.atomizerAlarmListHeaderItems.code'), value: 'code', type: 'text', align: 'center' },
                    { text: vm.$t('diagnostics.atomizer.atomizerAlarmListHeaderItems.name'), value: 'name', type: 'text', align: 'center' },
                    { text: vm.$t('diagnostics.atomizer.atomizerAlarmListHeaderItems.job_name'), value: 'job_name', type: 'text', align: 'center' },
                    { text: vm.$t('diagnostics.atomizer.atomizerAlarmListHeaderItems.step_no'), value: 'step_no', type: 'text', align: 'center' },
                    { text: vm.$t('diagnostics.atomizer.atomizerAlarmListHeaderItems.level'), value: 'level', type: 'img', align: 'center' },
                ],
            },
            
        }
    },
    computed: {
        renderAtomizerStatus() {
            return (atomizerType) => {
                return (this.atomizerItem[atomizerType] === '0' || this.atomizerItem[atomizerType] === 0 ) ? 'normal' : ((this.atomizerItem[atomizerType] === '1' || this.atomizerItem[atomizerType] === 1 ) ? 'alarm' : 'default');
            }
        },
    },
    watch: {
        atomizerTypeValue : {
            deep : true,
            handler(val){
                this.datas.atomizerTypeValue = val && val
            }
        },
        atomizerPredictItems: {
            handler(val) {
                this.datas.atomizerPredictItems = val.length > 0 ? this.setAtomizerPredictItems(val) : [];

            }
        },
    },
    methods: {
        setAtomizerPredictItems(atomizerPredictItems) {
            if(this.datas.atomizerTypeValue === this.datas.atomizerTypeValueItems[3].value){
                return convertToAtomizerHVChartItems(atomizerPredictItems);
            }else if(this.datas.atomizerTypeValue === this.datas.atomizerTypeValueItems[4].value){
                return convertToAtomizerAlarmChartItems(atomizerPredictItems);
            }else {
                return convertToAtomizerChartItems(atomizerPredictItems);
            }
        },

        changeAtomizerTypeValue(type) {
            const atomizerTypeValueIndex = this.datas.atomizerTypeValueItems.findIndex(atomizerTypeValueItem => atomizerTypeValueItem.value === type);
            this.datas.atomizerPredictItems = [];
            this.$emit('onChangeAtomizerType', { type: type, typeNo: atomizerTypeValueIndex });
        },
    }
}
</script>
<style scoped lang="scss">
    @import './RoobtAtomizerChartBoard.scss';
</style>

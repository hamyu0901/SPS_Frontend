<template>
    <base-modal :class="['atomizer-alarm-modal']" :title="title" :is-open="isOpen" :width="width" @onCloseModal="closeModalHandler">
        <v-layout :class="['atomizer-alarm-modal__contents']" column>
            <v-layout :class="['atomizer-alarm-modal__contents-infos']">
                    <alarm-partial-card :title="datas.atomizerAlarmInfoTitle">
                        <info-table :info-table-items="datas.atomizerInfoItems" />
                    </alarm-partial-card>
            </v-layout>
            <v-layout :class="['atomizer-alarm-modal__contents-chart']">
                <v-flex lg6 md6 sm6 :class="['atomizer-alarm-modal__contents-chart-entire']">
                    <alarm-partial-card :title="datas.atomizerChartTitle">
                        <v-layout :class="['atomizer-alarm-modal__contents-chart-entire__items']" column>
                            <v-btn-toggle mandatory v-model="datas.atomizerEntireValue" :class="['atomizer-alarm-modal__contents-chart-entire__items-btn-toggle']">
                                <v-btn v-for="atomizerEntireBtnItem in datas.atomizerEntireBtnItems" :key="atomizerEntireBtnItem.id" flat :value="atomizerEntireBtnItem.value">
                                    {{atomizerEntireBtnItem.title}}
                                </v-btn>
                            </v-btn-toggle>
                        </v-layout>
                        <multi-line-chart
                            :chart-id="'atomizer-entire-chart'"
                            :chart-items="datas.atomizerEntireTrendItems[datas.atomizerEntireValue]? datas.atomizerEntireTrendItems[datas.atomizerEntireValue]: []"
                            :value-type="'atomizer'"
                            :chart-strip-lines="renderStepNo"
                            :chart-strip-line-type="'multiple'"
                        />
                    </alarm-partial-card>
                </v-flex>

                <v-flex lg6 md6 sm6 :class="['atomizer-alarm-modal__contents-chart-hv-hvc']">
                    <alarm-partial-card :title="datas.atomizerHVChartTitle">
                        <multi-line-chart
                            :chart-id="'atomizer-hv-chart'"
                            :chart-items="datas.atomizerHVTrendItems"
                            :value-type="'atomizer'"
                            :chart-strip-lines="renderStepNo"
                            :chart-strip-line-type="'multiple'"
                        />
                    </alarm-partial-card>
                </v-flex>
            </v-layout>
            <v-layout :class="['atomizer-alarm-modal__contents-list']">
                <alarm-partial-card :title="datas.atomizerAlarmListTitle">
                    <v-layout :class="['atomizer-alarm-modal__contents-list__items']" column>
                        <v-btn-toggle mandatory v-model="datas.atomizerListValue" :class="['atomizer-alarm-modal__contents-list__items-btn-toggle']">
                            <v-btn v-for="atomizerListBtnItem in datas.atomizerListBtnItems" :key="atomizerListBtnItem.id" flat :value="atomizerListBtnItem.value">
                                {{atomizerListBtnItem.title}}
                            </v-btn>
                        </v-btn-toggle>
                    </v-layout>
                    <base-table
                        :has-click="datas.atomizerListValue === datas.atomizerListBtnItems[0].value ? true : false"
                        :header-items="datas.atomizerListHeaderItems"
                        :content-items="datas.atomizerListValue === datas.atomizerListBtnItems[0].value ? datas.atomizerListItems : datas.atomizerEntireListItems"
                        v-on:onClickBaseTableItem="getAtomizerListItem"
                    />
                </alarm-partial-card>
            </v-layout>
        </v-layout>
    </base-modal>
</template>

<script>
import {
    convertAtomizerToChartItems,
    convertLevelToIconItems,
    convertLevelToIcon
} from '@/utils/alarm';
import { mapGetters } from "vuex";
import BaseModal from '@/commons/basemodal/BaseModal';
import InfoTable from "@/commons/alarm/infotable/InfoTable";
import AlarmPartialCard from '@/commons/alarm/partialcard/PartialCard';
import MultiLineChart from "@/commons/chart/multilinechart/MultiLineChart";
import BaseTable from "@/commons/basetable/BaseTable";
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
        infoItems: {
            type: Array,
            required: true
        },
        trendItems: {
            type: Array,
            required: true
        },
        listItems: {
            type: Array,
            required: true
        },
        entireListItems: {
            type: Array,
        }
    },
    components: {
        BaseModal,
        InfoTable,
        AlarmPartialCard,
        MultiLineChart,
        BaseTable
    },
    data: (vm) => ({
        datas: {
            atomizerAlarmInfoTitle: vm.$t('common.atomizerAlarmModal.atomizerAlarmInfoTitle'),
            atomizerChartTitle: vm.$t('common.atomizerAlarmModal.atomizerChartTitle'),
            atomizerHVChartTitle: vm.$t('common.atomizerAlarmModal.atomizerHVChartTitle'),
            atomizerAlarmListTitle: vm.$t('common.atomizerAlarmModal.atomizerAlarmListTitle'),
            atomizerEntireValue: 'flow',
            atomizerEntireBtnItems: [
                { id: 'flow', title: 'FLOW', value: 'flow' },
                { id: 'turbine', title: 'TURBINE', value: 'turbine_speed' },
                { id: 'sa_s', title: 'SA_S', value: 'sa_s' },
                { id: 'sa_v', title: 'SA_V', value: 'sa_v' }
            ],
            atomizerTrendType: {
                entire: 'entire',
                hv: 'hv'
            },
            atomizerInfoItems: [],
            atomizerEntireTrendItems: {},
            atomizerHVTrendItems: [],
            atomizerListItems: [],
            atomizerEntireListItems: [],
            atomizerListHeaderItems: [
                { id: 'date', value: 'date', text: vm.$t('common.atomizerAlarmModal.atomizerListHeaderItems.date'), type: 'text',  align: 'center' },
                { id: 'type', value: 'type', text: vm.$t('common.atomizerAlarmModal.atomizerListHeaderItems.type'), type: 'text', align: 'center' },
                { id: 'code', value: 'code', text: vm.$t('common.atomizerAlarmModal.atomizerListHeaderItems.code'), type: 'text', align: 'center' },
                { id: 'job_name', value: 'job_name', text: vm.$t('common.atomizerAlarmModal.atomizerListHeaderItems.job_name'), type: 'text', align: 'center' },
                { id: 'contents', value: 'contents', text: vm.$t('common.atomizerAlarmModal.atomizerListHeaderItems.contents'), type: 'text', align: 'center' },
                { id: 'level', value: 'level', text: vm.$t('common.atomizerAlarmModal.atomizerListHeaderItems.level'), type: 'img', align: 'center' }
            ],
            atomizerListValue: 'atomizer',
            atomizerListBtnItems: [
                { id: 'atomizer', title: 'ATOMIZER', value: 'atomizer' },
                { id: 'entire', title: 'ENTIRE', value: 'entire' }
            ]
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
                    this.datas.atomizerInfoItems = this.infoItems.length > 0 ? this.setAtomizerInfoItems(this.infoItems) : [];
                    this.datas.atomizerEntireTrendItems = this.trendItems.length > 0 ? this.setAtomizerTrendItems(this.datas.atomizerTrendType.entire, this.trendItems): {};
                    this.datas.atomizerHVTrendItems = this.trendItems.length > 0 ? this.setAtomizerTrendItems(this.datas.atomizerTrendType.hv, this.trendItems)[this.datas.atomizerTrendType.hv]: [];
                    this.datas.atomizerListItems = this.listItems.length > 0 ? this.setAtomizerListItems(this.infoItems[0].alarm_id, this.listItems) : [];
                    this.datas.atomizerEntireListItems = this.entireListItems.length > 0 ? this.setAtomizerListItems(this.infoItems[0].alarm_id, this.entireListItems) : [];
                } else {
                    this.datas.atomizerInfoItems = [];
                    this.datas.atomizerTrendItems = {};
                    this.datas.atomizerHVTrendItems = [];
                    this.datas.atomizerListItems = [];
                    this.datas.atomizerEntireValue = this.datas.atomizerEntireBtnItems[0].value;
                    this.datas.atomizerListValue = this.datas.atomizerListBtnItems[0].value;
                }
            }
        },

        infoItems: {
            handler(val) {
                if(val) {
                    this.datas.atomizerInfoItems = val.length > 0 ? this.setAtomizerInfoItems(val) : [];
                    this.datas.atomizerEntireListItems = this.datas.atomizerEntireListItems.length > 0 ? this.setAtomizerListItems(val[0].alarm_id, this.datas.atomizerEntireListItems) : [];
                } else {
                    this.datas.atomizerInfoItems = [];
                }
            }
        },

        trendItems: {
            handler(val) {
                if(val) {
                    this.datas.atomizerEntireValue = this.datas.atomizerEntireBtnItems[0].value;
                    this.datas.atomizerEntireTrendItems = val.length > 0 ? this.setAtomizerTrendItems(this.datas.atomizerTrendType.entire, val): {};
                    this.datas.atomizerHVTrendItems = val.length > 0 ? this.setAtomizerTrendItems(this.datas.atomizerTrendType.hv, val)[this.datas.atomizerTrendType.hv]: [];
                } else {
                    this.datas.atomizerTrendItems = {};
                    this.datas.atomizerHVTrendItems = [];
                    this.datas.atomizerEntireValue = this.datas.atomizerEntireBtnItems[0].value;
                }
            }
        }

    },

    computed: {
        ...mapGetters({
            zoneInfos: 'getRenewZoneInfos',
            robotInfos: 'getRenewRobotInfos',
        }),

        renderStepNo() {
            return this.infoItems.length > 0 ? this.infoItems[0].step_no : 0;
        }
    },

    methods: {
        getZoneRobotName(zoneId = '', robotId = '') {
            const { robot_name: robotName } = this.robotInfos.filter(robotInfo => robotInfo.robot_id === robotId).length > 0 ? this.robotInfos.filter(robotInfo => robotInfo.robot_id === robotId)[0] : { robot_name: ''};
            const { zone_name: zoneName } = this.zoneInfos.filter(zoneInfo => zoneInfo.zone_id === zoneId).length > 0 ? this.zoneInfos.filter(zoneInfo => zoneInfo.zone_id === zoneId)[0] : { zone_name: '' };
            return zoneName + '-' + robotName;
        },

        setAtomizerInfoItems(infoItems) {
            const infoItem = infoItems[0];
            return [
                { title: 'CODE', contents: infoItem.code, type: 'text' },
                { title: 'CONTENTS', contents: infoItem.contents, type: 'text' },
                { title: 'LEVEL', contents: convertLevelToIcon(infoItem.level), type: 'img' },
                { title: 'ROBOT', contents: this.getZoneRobotName(infoItem.zone_id, infoItem.robot_id), type: 'text' },
                { title: 'STEP', contents: infoItem.step_no, type: 'text' },
                { title: 'JOB NAME', contents: infoItem.job_name, type: 'text' },
                { title: 'TIME', contents: infoItem.date, type: 'text'},
            ]
        },

        setAtomizerTrendItems(type, trendItems) {
            return convertAtomizerToChartItems(type, trendItems);
        },

        setAtomizerListItems(alarmId, listItems) {
            return convertLevelToIconItems(alarmId, listItems);
        },

        getAtomizerListItem(item) {
            this.$emit('onClickAtomizerListItem', item);
        },

        closeModalHandler() {
            this.$emit('onCloseModal');
        },
    }
}
</script>

<style scoped lang='scss'>
@import "AtomizerAlarmModal";
</style>

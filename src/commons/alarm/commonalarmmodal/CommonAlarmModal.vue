<template>
    <base-modal :class="['common-alarm-modal']" :title="title" :is-open="isOpen"  @onCloseModal="closeModalHandler">
        <v-layout :class="['common-alarm-modal__contents']">
            <v-layout :class="['common-alarm-modal__contents-item']">
                <alarm-partial-card :title="datas.commonAlarmInfoTitle">
                    <info-table :info-table-items="convertToBoardContentsItems(alarmInfoItem)" />
                </alarm-partial-card>
            </v-layout>
            <v-layout :class="['common-alarm-modal__contents-item']">
                <alarm-partial-card :class="['common-alarm-modal__contents-item__container']" :title="datas.commonAlarmChartTitle">
                    <multi-bar-chart
                      :class="['common-alarm-modal__contents-item__container-chart']"
                      chart-id="common-alarm-multi-bar-chart"
                      :chart-items="convertToAlarmChartItems(alarmChartItems)"
                      :axis-y-title="datas.commonAlarmChartAxisYTitle"
                    />
                </alarm-partial-card>
            </v-layout>
        </v-layout>
    </base-modal>
</template>
<script>
import BaseModal from "@/commons/basemodal/BaseModal.vue";
import AlarmPartialCard from "@/commons/alarm/partialcard/PartialCard.vue";
import InfoTable from "@/commons/alarm/infotable/InfoTable.vue";
import MultiBarChart from "@/commons/chart/multibarchart/MultiBarChart.vue";
import {convertLevelToIcon} from "@/utils/alarm";
import {isEmpty} from "lodash";

export default {
    components: {MultiBarChart, BaseModal, AlarmPartialCard, InfoTable},
    props: {
        title: {
            type: String,
            required: true
        },
        isOpen: {
            type: Boolean,
            required: true
        },
        alarmInfoItem: {
            type: Object,
            required: true
        },
        alarmChartItems: {
            type: Array,
            required: true
        }
    },
    data: (vm) => ({
        datas: {
            commonAlarmInfoTitle: vm.$t('common.commonAlarmModal.commonAlarmInfoTitle'),
            commonAlarmChartTitle: vm.$t('common.commonAlarmModal.commonAlarmChartTitle'),
            commonAlarmChartAxisYTitle: vm.$t('common.commonAlarmModal.commonAlarmChartAxisYTitle')
        }
    }),

    watch: {
        alarmChartItems: {
          handler(val) {
             this.convertToAlarmChartItems(val);
          }
        }
    },
    methods: {
        convertToBoardContentsItems(items) {
            return isEmpty(items) ? [] :
              (items.type_id === 0 ?
                [
                    { id: 'code', title: 'CODE' , contents: items.code, type: 'text' },
                    { id: 'sub_code', title: 'SUB CODE', contents: items.sub_code, type: 'text' },
                    { id: 'contents', title: 'CONTENTS', contents: items.contents, type: 'text' },
                    { id: 'process', title: 'ROBOT', contents: items.zone_name + '-' + items.robot_name, type: 'text' },
                    { id: 'job', title: 'JOB', contents: items.job, type: 'text' },
                    { id: 'step_no', title: 'STEP NO', contents: items.step_no, type: 'text' },
                    { id: 'time', title: 'TIME', contents: items.time, type: 'text' }
                ] :
                [
                    { id: 'code', title: 'CODE', contents: items.code, type: 'text' },
                    { id: 'contents', title: 'CONTENTS', contents: items.contents, type: 'text' },
                    { id: 'process', title: 'ZONE', contents: items.zone_name, type: 'text' },
                    { id: 'level', title: 'LEVEL', contents: convertLevelToIcon(items.level, items.type_id), type: 'img' },
                    { id: 'time', title: 'TIME', contents: items.time, type: 'text' }
                ])
        },
        convertToAlarmChartItems(items) {
            const alarmChartItems = [ { name: this.$t('common.commonAlarmModal.commonAlarmChartItems.alarmCountTitle'), color: '#03B7FA', items: []} ];
            const alarmChartLabels = items.map(item => item.date);
            alarmChartLabels.length > 0 && alarmChartLabels.forEach(alarmChartLabel => {
              const alarmIdx = items.findIndex(item => alarmChartLabel === item.date);
              const alarmChartItem = alarmIdx !== -1 ? { label: items[alarmIdx].date, y: Number(items[alarmIdx].count) } : { label: alarmChartLabel, y: null };
              alarmChartItems[0].items.push(alarmChartItem);
            })
            return alarmChartItems;
        },
        closeModalHandler() {
            this.$emit('onCloseModal');
        }
    }
}
</script>
<style scoped lang="scss">
    @import 'CommonAlarmModal';
</style>
